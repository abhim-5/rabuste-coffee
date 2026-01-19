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
      let imageUrl = '/gallery/default.jpg'; // Default fallback
      
      if (purchase.art_pieces?.image_url) {
        // If it's already a full URL (starts with http), use it
        if (purchase.art_pieces.image_url.startsWith('http')) {
          imageUrl = purchase.art_pieces.image_url;
        } else {
          // It's just a filename, construct full Supabase URL
          imageUrl = `https://cxwudthziqkqazzpatlp.supabase.co/storage/v1/object/public/gallery/${purchase.art_pieces.image_url}`;
        }
      }
      
      return {
        id: purchase.art_pieces?.id || purchase.id,
        title: purchase.art_pieces?.name || 'Art Piece',
        artist: purchase.art_pieces?.artist || 'Artist',
        purchaseDate: purchase.purchase_date,
        price: purchase.purchase_price || purchase.art_pieces?.price || 0,
        image: imageUrl,
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
