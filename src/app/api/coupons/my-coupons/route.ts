// GET /api/coupons/my-coupons - Get user's coupons
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { status: 401 });
    }

    // Get active coupon
   const { data: activeCoupon } = await supabase
      .from('user_coupons')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    // Get coupon history
    const { data: history } = await supabase
      .from('user_coupons')
      .select(`
        *,
        used_order:orders!user_coupons_used_on_order_id_fkey(order_number)
      `)
      .eq('user_id', user.id)
      .eq('is_used', true)
      .order('used_on_order_id', { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      active_coupon: activeCoupon ? {
        id: activeCoupon.id,
        discount: activeCoupon.discount_amount,
        min_order: activeCoupon.min_order_value,
        earned_on: activeCoupon.earned_at,
        expires_on: activeCoupon.expires_at,
        days_left: Math.ceil((new Date(activeCoupon.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      } : null,
      history: history?.map(h => ({
        discount: h.discount_amount,
        used_on: h.used_on_order_id,
        order_number: h.used_order?.order_number,
        earned_on: h.earned_at
      })) || []
    });

  } catch (error: any) {
    console.error('Error fetching user coupons:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch coupons'
    }, { status: 500 });
  }
}
