import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/profile/art
 * Fetches user's art purchases
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user's art purchases with art piece details
    const { data: purchases, error } = await supabase
      .from('art_purchases')
      .select(`
        *,
        art_pieces (*)
      `)
      .eq('user_id', user.id)
      .order('purchase_date', { ascending: false });

    if (error) {
      console.error('Error fetching art purchases:', error);
      return NextResponse.json(
        { error: 'Failed to fetch art purchases' },
        { status: 500 }
      );
    }

    // Transform to frontend format
    const transformedArt = (purchases || []).map(purchase => {
      const imageUrl = purchase.art_pieces?.image_url;
      // Ensure image has proper path prefix
      const imagePath = imageUrl 
        ? (imageUrl.startsWith('/') || imageUrl.startsWith('http') ? imageUrl : `/gallery/${imageUrl}`)
        : '/gallery/default.jpg';
      
      return {
        id: purchase.art_pieces?.id || purchase.id,
        title: purchase.art_pieces?.name || 'Art Piece',
        artist: purchase.art_pieces?.artist || 'Artist',
        purchaseDate: purchase.purchase_date,
        price: purchase.purchase_price || purchase.art_pieces?.price || 0,
        image: imagePath,
        status: purchase.status || 'purchased'
      };
    });

    return NextResponse.json({
      success: true,
      artPieces: transformedArt
    });

  } catch (error) {
    console.error('Art purchases API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
