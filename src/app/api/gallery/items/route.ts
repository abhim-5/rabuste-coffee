import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Enable ISR with 5 minute revalidation
export const revalidate = 300;

/**
 * GET /api/gallery/items
 * Fetches art gallery items from database
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';

    let query = supabase
      .from('art_pieces')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false });

    if (featured) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching gallery items:', error);
      return NextResponse.json(
        { error: 'Failed to fetch gallery items' },
        { status: 500 }
      );
    }

    // Transform to include full Supabase Storage URLs
    const galleryItems = data.map(item => ({
      ...item,
      image_url: item.image_url 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${item.image_url}`
        : `/gallery/default.jpg`
    }));

    return NextResponse.json({
      success: true,
      items: galleryItems,
      count: galleryItems.length
    });

  } catch (error) {
    console.error('Gallery API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gallery/items (Admin Only - Future)
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Admin functionality not yet implemented' },
    { status: 501 }
  );
}
