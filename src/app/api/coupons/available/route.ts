// GET /api/coupons/available - Get available coupons for cart
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { status: 401 });
    }

    const { cart_total, items } = await request.json();

    if (!cart_total || cart_total <= 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid cart total' 
      }, { status: 400 });
    }

    // Get system config
    const { data: config } = await supabase
      .from('coupon_config')
      .select('*')
      .single();

    if (!config?.system_enabled) {
      return NextResponse.json({
        success: true,
        cart_coupons: [],
        menu_coupons: [],
        my_coupon: null,
        system_enabled: false
      });
    }

    // 1. Get cart value coupons
    const { data: cartCoupons } = await supabase
      .from('coupons')
      .select('*')
      .eq('type', 'cart_value')
      .eq('is_active', true)
      .order('min_cart_value', { ascending: false });

    const availableCartCoupons = (cartCoupons || []).map(coupon => ({
      id: coupon.id,
      type: 'cart_value',
      name: coupon.name,
      description: coupon.description,
      discount: coupon.discount_amount,
      min_cart: coupon.min_cart_value,
      can_apply: cart_total >= coupon.min_cart_value,
      progress: coupon.min_cart_value > cart_total 
        ? (cart_total / coupon.min_cart_value) * 100  // Calculate percentage correctly
        : 100,  // 100% if already unlocked
      message: cart_total >= coupon.min_cart_value
        ? `₹${coupon.discount_amount} OFF on orders above ₹${coupon.min_cart_value}`
        : `Add ₹${coupon.min_cart_value - cart_total} more to unlock ₹${coupon.discount_amount} OFF`
    }));

    // 2. Get menu-limited coupons
    const { data: menuCoupons } = await supabase
      .from('coupons')
      .select('*')
      .eq('type', 'menu_limited')
      .eq('is_active', true);

    const availableMenuCoupons = (menuCoupons || []).map(coupon => {
      // Check if any cart items match this coupon
      const applicableItems = items?.filter((item: any) => {
        const categoryMatch = coupon.applicable_categories?.includes(item.category);
        const itemMatch = coupon.applicable_items?.some((id: string) => id === item.id);
        const excluded = coupon.excluded_items?.some((id: string) => id === item.id);
        
        return (categoryMatch || itemMatch) && !excluded;
      }) || [];

      return {
        id: coupon.id,
        type: 'menu_limited',
        name: coupon.name,
        description: coupon.description,
        discount: coupon.discount_amount,
        applicable_to: applicableItems.length > 0 
          ? applicableItems.map((i: any) => i.name)
          : coupon.applicable_categories || [],
        can_apply: applicableItems.length > 0,
        message: `₹${coupon.discount_amount} OFF on selected items`
      };
    });

    // 3. Get user's next-order coupon
    const { data: userCoupon } = await supabase
      .from('user_coupons')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    const myNextOrderCoupon = userCoupon ? {
      id: userCoupon.id,
      type: 'next_order',
      discount: userCoupon.discount_amount,
      min_order: userCoupon.min_order_value,
      can_apply: cart_total >= userCoupon.min_order_value,
      expires_at: userCoupon.expires_at,
      message: cart_total >= userCoupon.min_order_value
        ? `₹${userCoupon.discount_amount} OFF (Your Reward)`
        : `Spend ₹${userCoupon.min_order_value - cart_total} more to use your ₹${userCoupon.discount_amount} reward`
    } : null;

    return NextResponse.json({
      success: true,
      cart_coupons: availableCartCoupons,
      menu_coupons: availableMenuCoupons.filter(c => c.can_apply),
      my_coupon: myNextOrderCoupon,
      config: {
        min_payable: config.min_payable_amount
      }
    });

  } catch (error: any) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch coupons'
    }, { status: 500 });
  }
}
