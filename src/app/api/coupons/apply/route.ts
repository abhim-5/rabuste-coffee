// POST /api/coupons/apply - Apply coupon to order
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

    const { order_id, coupon_id, user_coupon_id, cart_total, items } = await request.json();

    if (!order_id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order ID required' 
      }, { status: 400 });
    }

    // Get config
    const {data: config } = await supabase
      .from('coupon_config')
      .select('*')
      .single();

    if (!config?.system_enabled) {
      return NextResponse.json({
        success: false,
        error: 'Coupon system is currently disabled'
      }, { status: 400 });
    }

    let discount = 0;
    let couponData = null;

    // Apply cart/menu coupon
    if (coupon_id) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', coupon_id)
        .eq('is_active', true)
        .single();

      if (!coupon) {
        return NextResponse.json({
          success: false,
          error: 'Coupon not found or inactive'
        }, { status: 400 });
      }

      // Validate cart value coupon
      if (coupon.type === 'cart_value') {
        if (cart_total < coupon.min_cart_value) {
          return NextResponse.json({
            success: false,
            error: `Minimum cart value of ₹${coupon.min_cart_value} not met`
          }, { status: 400 });
        }
      }

      // Validate menu coupon
      if (coupon.type === 'menu_limited') {
        const hasApplicableItems = items?.some((item: any) => {
          const categoryMatch = coupon.applicable_categories?.includes(item.category);
          const itemMatch = coupon.applicable_items?.some((id: string) => id === item.id);
          const excluded = coupon.excluded_items?.some((id: string) => id === item.id);
          return (categoryMatch || itemMatch) && !excluded;
        });

        if (!hasApplicableItems) {
          return NextResponse.json({
            success: false,
            error: 'No applicable items in cart'
          }, { status: 400 });
        }
      }

      discount = coupon.discount_amount;
      couponData = { coupon_id: coupon.id };
    }

    // Apply user next-order coupon
    if (user_coupon_id) {
      const { data: userCoupon } = await supabase
        .from('user_coupons')
        .select('*')
        .eq('id', user_coupon_id)
        .eq('user_id', user.id)
        .eq('is_used', false)
        .single();

      if (!userCoupon) {
        return NextResponse.json({
          success: false,
          error: 'Coupon not found or already used'
        }, { status: 400 });
      }

      // Check expiry
      if (new Date(userCoupon.expires_at) < new Date()) {
        return NextResponse.json({
          success: false,
          error: 'Coupon has expired'
        }, { status: 400 });
      }

      // Check minimum order value
      if (cart_total < userCoupon.min_order_value) {
        return NextResponse.json({
          success: false,
          error: `Minimum order value of ₹${userCoupon.min_order_value} not met`
        }, { status: 400 });
      }

      discount = userCoupon.discount_amount;
      couponData = { user_coupon_id: userCoupon.id };
    }

    // Calculate final total
    const new_total = Math.max(cart_total - discount, config.min_payable_amount);
    const actual_discount = cart_total - new_total;

    // Ensure minimum payable
    if (new_total < config.min_payable_amount) {
      return NextResponse.json({
        success: false,
        error: `Order total cannot be less than ₹${config.min_payable_amount}`
      }, { status: 400 });
    }

    // Update order (this would be done in the order creation/update API)
    // For now, just return the calculation
    return NextResponse.json({
      success: true,
      discount_applied: actual_discount,
      new_total: new_total,
      original_total: cart_total,
      coupon_data: couponData,
      message: `₹${actual_discount} discount applied successfully`
    });

  } catch (error: any) {
    console.error('Error applying coupon:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to apply coupon'
    }, { status: 500 });
  }
}
