import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

// Enable ISR with 5 minute revalidation
export const revalidate = 300;

/**
 * GET /api/menu/categories
 * Fetches all categories with item counts
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('available', true);

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    // Count items per category
    const categoryMap = new Map<string, number>();
    data.forEach(item => {
      const count = categoryMap.get(item.category) || 0;
      categoryMap.set(item.category, count + 1);
    });

    // Category display names
    const categoryNames: Record<string, string> = {
      'robusta-cold': 'Robusta Specialty Cold',
      'robusta-hot': 'Robusta Specialty Hot',
      'blend-cold': 'Blend Cold',
      'blend-hot': 'Blend Hot',
      'manual-brew': 'Manual Brew (Peaberry Special)',
      'shakes-tea': 'Shakes & Tea',
      'food': 'Food',
    };

    // Transform to array
    const categories = Array.from(categoryMap.entries()).map(([id, itemCount]) => ({
      id,
      name: categoryNames[id] || id,
      itemCount
    }));

    // Sort by predefined order
    const categoryOrder = ['robusta-cold', 'robusta-hot', 'blend-cold', 'blend-hot', 'manual-brew', 'shakes-tea', 'food'];
    categories.sort((a, b) => {
      return categoryOrder.indexOf(a.id) - categoryOrder.indexOf(b.id);
    });

    return NextResponse.json({
      success: true,
      categories,
      count: categories.length
    });

  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
