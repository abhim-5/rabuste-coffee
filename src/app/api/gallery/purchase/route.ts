import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0; // No caching for purchases

/**
 * POST /api/gallery/purchase
 * Creates an art purchase record
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[Gallery Purchase API] Starting purchase request');
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('[Gallery Purchase API] Authentication failed:', authError);
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please login to book artwork.' },
        { status: 401 }
      );
    }

    console.log('[Gallery Purchase API] User authenticated:', user.id);

    const body = await request.json();
    console.log('[Gallery Purchase API] Request body:', body);
    let { artPieceIds, artPieceId } = body;

    // Normalize to array
    if (artPieceId && !artPieceIds) {
        artPieceIds = [artPieceId];
    }

    if (!artPieceIds || !Array.isArray(artPieceIds) || artPieceIds.length === 0) {
      console.error('[Gallery Purchase API] Invalid art piece IDs:', artPieceIds);
      return NextResponse.json(
        { success: false, error: 'Art piece IDs are required' },
        { status: 400 }
      );
    }

    console.log('[Gallery Purchase API] Fetching art pieces:', artPieceIds);

    // Get art pieces details and verify availability
    const { data: artPieces, error: fetchError } = await supabase
      .from('art_pieces')
      .select('*')
      .in('id', artPieceIds)
      .eq('available', true);

    if (fetchError) {
      console.error('[Gallery Purchase API] Database fetch error:', fetchError);
      return NextResponse.json(
        { success: false, error: `Database error: ${fetchError.message}` },
        { status: 500 }
      );
    }

    if (!artPieces || artPieces.length === 0) {
      console.error('[Gallery Purchase API] No art pieces found or all unavailable. Requested:', artPieceIds, 'Found:', artPieces);
      return NextResponse.json(
        { success: false, error: 'The requested artwork is no longer available' },
        { status: 404 }
      );
    }

    console.log('[Gallery Purchase API] Found art pieces:', artPieces.length);

    // Check if all requested pieces are available
    if (artPieces.length !== artPieceIds.length) {
        console.error('[Gallery Purchase API] Not all pieces available. Requested:', artPieceIds.length, 'Found:', artPieces.length);
        return NextResponse.json(
            { success: false, error: 'One or more art pieces are no longer available' },
            { status: 409 } // Conflict
        );
    }

    // Generate booking number (6 digits) - shared for the batch if we wanted, 
    // but the DB schema likely processes them individually? 
    // The previous code generated one booking number. User didn't specify batching logic 
    // but "confirmation of only 1" implies they want to see all purchased.
    // Let's create individual purchase records.
    
    const purchaseRecords = artPieces.map(piece => ({
        art_piece_id: piece.id,
        user_id: user.id,
        purchase_price: piece.price,
        status: 'pending'
    }));

    console.log('[Gallery Purchase API] Creating purchase records:', purchaseRecords.length);

    const { data: purchases, error: purchaseError } = await supabase
      .from('art_purchases')
      .insert(purchaseRecords)
      .select();

    if (purchaseError) {
      console.error('[Gallery Purchase API] Purchase creation error:', purchaseError);
      return NextResponse.json(
        { success: false, error: `Failed to create purchase: ${purchaseError.message}` },
        { status: 500 }
      );
    }

    console.log('[Gallery Purchase API] Purchase records created:', purchases?.length);

    // Mark art pieces as unavailable
    const { error: updateError } = await supabase
      .from('art_pieces')
      .update({ available: false })
      .in('id', artPieceIds);

    if (updateError) {
      console.error('[Gallery Purchase API] Error marking art as unavailable:', updateError);
    }

    // Construct response
    // If multiple, maybe return the first one's booking info or a summary?
    // The frontend mostly cares about success and maybe details to show.
    // We'll return the list.
    
    const bookingNumber = Math.floor(100000 + Math.random() * 900000).toString(); // Visual booking ref

    const response = {
      success: true,
      bookingNumber, // One "Booking Ref" for the session
      purchases: purchases.map((p, idx) => ({
          id: p.id,
          artPieceName: artPieces[idx].name,
          price: artPieces[idx].price,
          artist: artPieces[idx].artist
      })),
      count: purchases.length
    };

    console.log('[Gallery Purchase API] Success! Returning response:', response);

    return NextResponse.json(response);

  } catch (error) {
    console.error('[Gallery Purchase API] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
