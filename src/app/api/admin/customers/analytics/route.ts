// Customer Analytics API
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/customers/analytics
 * Returns comprehensive customer analytics
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

    // Get all customers with their order data
    const { data: customers, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, created_at, credits')
      .eq('role', 'customer');

    if (error) {
      console.error('Error fetching customers:', error);
      return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }

    // For each customer, calculate metrics
    const customerAnalytics = await Promise.all(
      (customers || []).map(async (customer) => {
        // Get all orders
        const { data: orders } = await supabase
          .from('orders')
          .select('total, created_at, status')
          .eq('user_id', customer.id);

        const totalOrders = orders?.length || 0;
        const totalSpent = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
        const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

        // Get points transactions
        const { data: pointsData } = await supabase
          .from('points_transactions')
          .select('points, transaction_type')
          .eq('user_id', customer.id);

        const pointsEarned = pointsData
          ?.filter(t => t.transaction_type === 'earned')
          .reduce((sum, t) => sum + t.points, 0) || 0;

        const pointsRedeemed = pointsData
          ?.filter(t => t.transaction_type === 'redeemed')
          .reduce((sum, t) => sum + Math.abs(t.points), 0) || 0;

        const pointsBalance = pointsEarned - pointsRedeemed;

        // Determine if returning customer (more than 1 order)
        const isReturning = totalOrders > 1;

        // Get last order date
        const lastOrderDate = orders && orders.length > 0
          ? orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
          : null;

        // Calculate tier based on total spent
        let tier: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze';
        if (totalSpent >= 10000) tier = 'platinum';
        else if (totalSpent >= 5000) tier = 'gold';
        else if (totalSpent >= 2000) tier = 'silver';

        return {
          user_id: customer.id,
          email: customer.email,
          full_name: customer.full_name,
          total_orders: totalOrders,
          total_spent: Number(totalSpent.toFixed(2)),
          avg_order_value: Number(avgOrderValue.toFixed(2)),
          points_earned: pointsEarned,
          points_redeemed: pointsRedeemed,
          points_balance: pointsBalance,
          last_order_date: lastOrderDate,
          is_returning: isReturning,
          lifetime_value: Number(totalSpent.toFixed(2)),
          tier,
          credits: customer.credits || 0
        };
      })
    );

    // Sort by lifetime value
    customerAnalytics.sort((a, b) => b.lifetime_value - a.lifetime_value);

    // Get date ranges for active users
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsers7d = customerAnalytics.filter(
      c => c.last_order_date && new Date(c.last_order_date) >= sevenDaysAgo
    ).length;

    const activeUsers30d = customerAnalytics.filter(
      c => c.last_order_date && new Date(c.last_order_date) >= thirtyDaysAgo
    ).length;

    // Summary stats
    const summary = {
      total_customers: customerAnalytics.length,
      active_7d: activeUsers7d,
      active_30d: activeUsers30d,
      new_customers: customerAnalytics.filter(c => !c.is_returning).length,
      returning_customers: customerAnalytics.filter(c => c.is_returning).length,
      total_points_earned: customerAnalytics.reduce((sum, c) => sum + c.points_earned, 0),
      total_points_redeemed: customerAnalytics.reduce((sum, c) => sum + c.points_redeemed, 0),
      avg_lifetime_value: customerAnalytics.length > 0
        ? customerAnalytics.reduce((sum, c) => sum + c.lifetime_value, 0) / customerAnalytics.length
        : 0,
      tier_distribution: {
        bronze: customerAnalytics.filter(c => c.tier === 'bronze').length,
        silver: customerAnalytics.filter(c => c.tier === 'silver').length,
        gold: customerAnalytics.filter(c => c.tier === 'gold').length,
        platinum: customerAnalytics.filter(c => c.tier === 'platinum').length,
      }
    };

    return NextResponse.json({
      success: true,
      summary,
      customers: customerAnalytics.slice(0, 100) // Top 100 customers by CLV
    });

  } catch (error) {
    console.error('Customer analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
