import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getMenuItemImageUrl } from '@/lib/utils/menuImages';

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

// Enable ISR with 5 minute revalidation
export const revalidate = 300;

/**
 * GET /api/menu/featured
 * Fetches featured/deal items
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const limit = 3; // Featured items limit

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('available', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true})
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured items:', error);
      return NextResponse.json(
        { error: 'Failed to fetch featured items' },
        { status: 500 }
      );
    }

    // Transform to MenuItem format with new pricing fields
    const featuredItems = data.map(item => {
      let imageUrl;
      
      // Check if image_url is a Supabase Storage path (starts with product-images/)
      if (item.image_url?.startsWith('product-images/')) {
        // Generate Supabase Storage public URL
        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${item.image_url}`;
      } else if (item.image_url) {
        // Legacy local path
        imageUrl = `/menu-images/${item.image_url}`;
      } else {
        // Fallback to default image
        imageUrl = getMenuItemImageUrl(item.category, item.name);
      }

      return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: parseFloat(item.discount_price || item.price), // Use discount if available
        originalPrice: item.crossed_price ? parseFloat(item.crossed_price) : (item.discount_price ? parseFloat(item.price) : undefined),
        image: imageUrl,
        category: item.category,
        available: item.available,
        rating: parseFloat(item.rating || '4.5'),
        reviewCount: item.review_count || 0,
        variations: item.variations || [],
        isDealOfTheDay: item.is_deal_of_day || false,
        dealExpiry: item.deal_expiry,
        is_featured: item.is_featured || false,
      };
    });

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
