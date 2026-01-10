import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0; // No caching for purchases

/**
 * POST /api/gallery/purchase
 * Creates an art purchase record
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    let { artPieceIds, artPieceId } = body;

    // Normalize to array
    if (artPieceId && !artPieceIds) {
        artPieceIds = [artPieceId];
    }

    if (!artPieceIds || !Array.isArray(artPieceIds) || artPieceIds.length === 0) {
      return NextResponse.json(
        { error: 'Art piece IDs are required' },
        { status: 400 }
      );
    }

    // Get art pieces details and verify availability
    const { data: artPieces, error: fetchError } = await supabase
      .from('art_pieces')
      .select('*')
      .in('id', artPieceIds)
      .eq('available', true);

    if (fetchError || !artPieces) {
      return NextResponse.json(
        { error: 'Failed to fetch art pieces' },
        { status: 500 }
      );
    }

    // Check if all requested pieces are available
    if (artPieces.length !== artPieceIds.length) {
        return NextResponse.json(
            { error: 'One or more art pieces are no longer available' },
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

    const { data: purchases, error: purchaseError } = await supabase
      .from('art_purchases')
      .insert(purchaseRecords)
      .select();

    if (purchaseError) {
      console.error('Purchase creation error:', purchaseError);
      return NextResponse.json(
        { error: 'Failed to create purchase records' },
        { status: 500 }
      );
    }

    // Mark art pieces as unavailable
    const { error: updateError } = await supabase
      .from('art_pieces')
      .update({ available: false })
      .in('id', artPieceIds);

    if (updateError) {
      console.error('Error marking art as unavailable:', updateError);
    }

    // Construct response
    // If multiple, maybe return the first one's booking info or a summary?
    // The frontend mostly cares about success and maybe details to show.
    // We'll return the list.
    
    const bookingNumber = Math.floor(100000 + Math.random() * 900000).toString(); // Visual booking ref

    return NextResponse.json({
      success: true,
      bookingNumber, // One "Booking Ref" for the session
      purchases: purchases.map((p, idx) => ({
          id: p.id,
          artPieceName: artPieces[idx].name,
          price: artPieces[idx].price,
          artist: artPieces[idx].artist
      })),
      count: purchases.length
    });

  } catch (error) {
    console.error('Gallery purchase API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
