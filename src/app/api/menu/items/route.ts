import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getMenuItemImageUrl } from '@/lib/utils/menuImages';

// Enable ISR with 5 minute revalidation
export const revalidate = 300;

/**
 * GET /api/menu/items
 * Fetches menu items from database
 * Query params:
 *   - category: Filter by category (optional)
 *   - featured: Filter featured items only (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';

    // Build query
    let query = supabase
      .from('products')
      .select('*')
      .eq('available', true)
      .order('sort_order', { ascending: true });

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }

    if (featured) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching menu items:', error);
      return NextResponse.json(
        { error: 'Failed to fetch menu items' },
        { status: 500 }
      );
    }

    // Transform to MenuItem format
    const menuItems = data.map(item => ({
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
      items: menuItems,
      count: menuItems.length
    });

  } catch (error) {
    console.error('Menu API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/menu/items
 * Create new menu item (ADMIN ONLY - Future)
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Admin functionality not yet implemented' },
    { status: 501 }
  );
}

/**
 * PUT /api/menu/items/[id]
 * Update menu item (ADMIN ONLY - Future)
 */
export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { error: 'Admin functionality not yet implemented' },
    { status: 501 }
  );
}

/**
 * DELETE /api/menu/items/[id]
 * Delete menu item (ADMIN ONLY - Future)
 */
export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { error: 'Admin functionality not yet implemented' },
    { status: 501 }
  );
}
