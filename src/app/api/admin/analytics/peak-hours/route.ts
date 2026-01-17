// Peak Hours Analytics API
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/analytics/peak-hours
 * Returns order volume by hour of day
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth & admin check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch orders from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: orders, error } = await supabase
      .from('orders')
      .select('created_at, total')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (error) {
      console.error('Error fetching orders for peak hours:', error);
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    // Group by hour
    const hourlyData: Record<number, { orders: number; revenue: number }> = {};
    
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = { orders: 0, revenue: 0 };
    }

    orders?.forEach(order => {
      const hour = new Date(order.created_at).getHours();
      hourlyData[hour].orders += 1;
      hourlyData[hour].revenue += Number(order.total);
    });

    // Convert to array
    const peakHours = Object.entries(hourlyData).map(([hour, data]) => ({
      hour: parseInt(hour),
      orders: data.orders,
      revenue: Number(data.revenue.toFixed(2))
    }));

    // Find peak hour
    const peakHour = peakHours.reduce((max, curr) => 
      curr.orders > max.orders ? curr : max
    );

    return NextResponse.json({
      success: true,
      data: {
        peak_hour: peakHour.hour,
        peak_orders: peakHour.orders,
        hourly_breakdown: peakHours
      }
    });

  } catch (error) {
    console.error('Peak hours analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
