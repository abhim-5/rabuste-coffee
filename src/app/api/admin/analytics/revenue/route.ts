// Revenue Analytics API
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/analytics/revenue?period=today|week|month|year
 * Returns revenue analytics for specified period
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

    // Get period from query
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Fetch revenue data
    const { data: orders, error } = await supabase
      .from('orders')
      .select('total, created_at, status')
      .gte('created_at', startDate.toISOString())
      .in('status', ['completed', 'ready', 'preparing', 'pending']);

    if (error) {
      console.error('Error fetching revenue data:', error);
      return NextResponse.json({ error: 'Failed to fetch revenue' }, { status: 500 });
    }

    // Calculate metrics
    const total = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
    const orderCount = orders?.length || 0;
    const averageOrderValue = orderCount > 0 ? total / orderCount : 0;

    // Group by date for breakdown
    const breakdown = orders?.reduce((acc: Record<string, { amount: number; orders: number }>, order) => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { amount: 0, orders: 0 };
      }
      acc[date].amount += Number(order.total);
      acc[date].orders += 1;
      return acc;
    }, {});

    const breakdownArray = Object.entries(breakdown || {}).map(([date, data]) => ({
      date,
      amount: data.amount,
      orders: data.orders
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Calculate growth (compare to previous period)
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const { data: prevOrders } = await supabase
      .from('orders')
      .select('total')
      .gte('created_at', prevStartDate.toISOString())
      .lt('created_at', startDate.toISOString())
      .in('status', ['completed', 'ready', 'preparing', 'pending']);

    const prevTotal = prevOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
    const growth = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        total: Number(total.toFixed(2)),
        orders: orderCount,
        average_order_value: Number(averageOrderValue.toFixed(2)),
        growth: Number(growth.toFixed(2)),
        breakdown: breakdownArray
      }
    });

  } catch (error) {
    console.error('Revenue analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
