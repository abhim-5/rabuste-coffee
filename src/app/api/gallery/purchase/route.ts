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
    const { artPieceId } = body;

    if (!artPieceId) {
      return NextResponse.json(
        { error: 'Art piece ID is required' },
        { status: 400 }
      );
    }

    // Get art piece details
    const { data: artPiece, error: fetchError } = await supabase
      .from('art_pieces')
      .select('*')
      .eq('id', artPieceId)
      .eq('available', true)
      .single();

    if (fetchError || !artPiece) {
      return NextResponse.json(
        { error: 'Art piece not found or not available' },
        { status: 404 }
      );
    }

    // Generate booking number (6 digits)
    const bookingNumber = Math.floor(100000 + Math.random() * 900000).toString();

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('art_purchases')
      .insert({
        art_piece_id: artPieceId,
        user_id: user.id,
        purchase_price: artPiece.price,
        status: 'pending'
      })
      .select()
      .single();

    if (purchaseError) {
      console.error('Purchase creation error:', purchaseError);
      return NextResponse.json(
        { error: 'Failed to create purchase' },
        { status: 500 }
      );
    }

    // Mark art piece as unavailable
    const { error: updateError } = await supabase
      .from('art_pieces')
      .update({ available: false })
      .eq('id', artPieceId);

    if (updateError) {
      console.error('Error marking art as unavailable:', updateError);
      // Note: Purchase is already created, so we don't rollback
    }

    return NextResponse.json({
      success: true,
      bookingNumber,
      purchase: {
        id: purchase.id,
        artPieceName: artPiece.name,
        price: artPiece.price,
        artist: artPiece.artist
      }
    });

  } catch (error) {
    console.error('Gallery purchase API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
