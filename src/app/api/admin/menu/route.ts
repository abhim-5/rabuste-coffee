// Menu Management API
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/menu
 * Returns all menu items with sales analytics
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch menu items
    const { data: menuItems, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching menu items:', error);
      return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
    }

    // Calculate sales for each item
    const itemsWithSales = await Promise.all(
      (menuItems || []).map(async (item) => {
        // Get total sales from order_items
        const { data: salesData } = await supabase
          .from('order_items')
          .select('quantity')
          .eq('menu_item_id', item.id);

        const totalSales = salesData?.reduce((sum, sale) => sum + sale.quantity, 0) || 0;

        return {
          ...item,
          total_sales: totalSales
        };
      })
    );

    return NextResponse.json({
      success: true,
      items: itemsWithSales
    });

  } catch (error) {
    console.error('Menu API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
