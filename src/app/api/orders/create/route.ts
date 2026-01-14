import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CreateOrderRequest, CreateOrderResponse } from '@/types/orders';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: CreateOrderRequest = await request.json();
    const { orderType, scheduledTime, items, subtotal, tax, total, notes } = body;

    // Validate request
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No items in order' },
        { status: 400 }
      );
    }

    // Get user profile for customer info
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    // Generate unique order number using database function
    const { data: orderNumberData, error: orderNumberError } = await supabase
      .rpc('generate_order_number');

    if (orderNumberError) {
      console.error('Error generating order number:', orderNumberError);
      return NextResponse.json(
        { success: false, error: 'Failed to generate order number' },
        { status: 500 }
      );
    }

    const orderNumber = orderNumberData as string;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        order_type: orderType,
        scheduled_time: scheduledTime,
        subtotal,
        tax,
        total,
        customer_name: profile?.full_name || user.email?.split('@')[0] || 'Customer',
        customer_email: profile?.email || user.email,
        notes,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { success: false, error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      menu_item_id: String(item.menuItemId),
      menu_item_name: item.menuItemName,
      menu_item_image: item.menuItemImage,
      variation_name: item.variationName,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      subtotal: item.subtotal
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback: delete the order
      await supabase.from('orders').delete().eq('id', order.id);
      
      return NextResponse.json(
        { success: false, error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    // Check if user should earn a next-order coupon
    let couponEarned = false;
    try {
      const { data: config } = await supabase
        .from('coupon_config')
        .select('*')
        .single();

      // Check if order qualifies for next-order coupon
      if (config?.system_enabled && total >= config.next_order_min_earn) {
        // Check if user already has an active coupon
        const { data: existingCoupon } = await supabase
          .from('user_coupons')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_used', false)
          .single();

        // Only award if they don't have one already
        if (!existingCoupon) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + config.next_order_expiry_days);

          const { error: couponError } = await supabase
            .from('user_coupons')
            .insert({
              user_id: user.id,
              discount_amount: config.next_order_discount,
              min_order_value: 100, // Can be configurable
              earned_from_order_id: order.id,
              expires_at: expiryDate.toISOString()
            });

          if (!couponError) {
            couponEarned = true;
            console.log(`✅ User earned ₹${config.next_order_discount} coupon!`);
          }
        }
      }
    } catch (couponError) {
      // Don't fail the order if coupon fails, just log
      console.error('Failed to award coupon:', couponError);
    }

    // Return success with coupon status
    return NextResponse.json({
      success: true,
      orderNumber: order.order_number,
      orderId: order.id,
      couponEarned: couponEarned  // Include coupon status in response
    } as CreateOrderResponse);

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
