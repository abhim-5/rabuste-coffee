import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/profile/orders
 * Fetches user's order history
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

    // Fetch user's orders with items
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    // Transform orders to match frontend Order type
    const transformedOrders = (orders || []).map(order => ({
      id: order.order_number || order.id, // Display ID
      uuid: order.id, // UUID for ratings lookup
      date: order.created_at, // Keep as ISO string
      status: order.status,
      payment_status: order.payment_status || 'paid', // Add payment status
      total: order.total,
      pointsEarned: Math.floor(order.total), // 1 point per rupee
      items: (order.order_items || []).map((item: any) => ({
        name: item.menu_item_name || 'Unknown Item',
        quantity: item.quantity,
        price: item.unit_price,
        image: item.menu_item_image || '/placeholder.jpg'
      }))
    }));

    return NextResponse.json({
      success: true,
      orders: transformedOrders
    });

  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
