import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getMenuItemImageUrl } from '@/lib/utils/menuImages';

// Enable ISR with 5 minute revalidation
export const revalidate = 300;

/**
 * GET /api/menu/featured
 * Fetches featured/deal items
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('available', true)
      .eq('is_featured', true)
      .order('sort_order', { ascending: true})
      .limit(3);

    if (error) {
      console.error('Error fetching featured items:', error);
      return NextResponse.json(
        { error: 'Failed to fetch featured items' },
        { status: 500 }
      );
    }

    // Transform to MenuItem format
    const featuredItems = data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      originalPrice: item.original_price ? parseFloat(item.original_price) : undefined,
      image: item.image_url 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${item.image_url}`
        : getMenuItemImageUrl(item.category, item.name),
      category: item.category,
      available: item.available,
      rating: parseFloat(item.rating || '4.5'),
      reviewCount: item.review_count || 0,
      variations: item.variations || [],
    }));

    return NextResponse.json({
      success: true,
      items: featuredItems,
      count: featuredItems.length
    });

  } catch (error) {
    console.error('Featured items API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
