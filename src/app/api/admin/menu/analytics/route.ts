// Menu Analytics API
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/menu/analytics
 * Returns comprehensive menu analytics
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

    // Get all order items with menu item details
    const { data: orderItems, error } = await supabase
      .from('order_items')
      .select('menu_item_id, menu_item_name, quantity, unit_price');

    if (error) {
      console.error('Error fetching order items:', error);
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }

    // Aggregate sales by menu item
    const salesByItem: Record<string, { name: string; quantity: number; revenue: number }> = {};
    
    orderItems?.forEach(item => {
      if (!salesByItem[item.menu_item_id]) {
        salesByItem[item.menu_item_id] = {
          name: item.menu_item_name,
          quantity: 0,
          revenue: 0
        };
      }
      salesByItem[item.menu_item_id].quantity += item.quantity;
      salesByItem[item.menu_item_id].revenue += item.quantity * Number(item.unit_price);
    });

    // Convert to array and sort
    const salesArray = Object.entries(salesByItem).map(([id, data]) => ({
      id,
      ...data
    }));

    // Top sellers
    const topSellers = [...salesArray]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Low sellers
    const lowSellers = [...salesArray]
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 10);

    // Category breakdown
    const { data: menuItems } = await supabase
      .from('menu_items')
      .select('id, category');

    const categoryBreakdown: Record<string, { sales: number; revenue: number }> = {};
    
    salesArray.forEach(item => {
      const menuItem = menuItems?.find(m => m.id === item.id);
      const category = menuItem?.category || 'Unknown';
      
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = { sales: 0, revenue: 0 };
      }
      categoryBreakdown[category].sales += item.quantity;
      categoryBreakdown[category].revenue += item.revenue;
    });

    const categories = Object.entries(categoryBreakdown).map(([category, data]) => ({
      category,
      total_sales: data.sales,
      revenue: Number(data.revenue.toFixed(2))
    }));

    return NextResponse.json({
      success: true,
      analytics: {
        top_sellers: topSellers,
        low_sellers: lowSellers,
        category_breakdown: categories
      }
    });

  } catch (error) {
    console.error('Menu analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
