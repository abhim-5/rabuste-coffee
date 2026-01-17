import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/profile/stats
 * Fetches user statistics (orders count, workshops, art purchases, etc.)
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

    // Fetch profile for credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits, created_at')
      .eq('id', user.id)
      .single();

    // Count orders
    const { count: ordersCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Count workshop registrations
    const { count: workshopsCount } = await supabase
      .from('workshop_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Count art purchases
    const { count: artCount } = await supabase
      .from('art_purchases')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Calculate total spent
    const { data: orders } = await supabase
      .from('orders')
      .select('total')
      .eq('user_id', user.id);

    const totalSpent = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

    // Calculate member duration
    const memberSince = profile?.created_at ? new Date(profile.created_at) : new Date();
    const daysSinceMember = Math.floor((Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      success: true,
      stats: {
        ordersCount: ordersCount || 0,
        workshopsCount: workshopsCount || 0,
        artPurchasedCount: artCount || 0,
        totalSpent,
        credits: profile?.credits || 0,
        memberDays: daysSinceMember
      }
    });

  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
