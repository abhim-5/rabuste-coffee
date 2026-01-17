import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { order_id } = await request.json();

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Create NEW Razorpay order for retry
    const amount = Math.round(order.total_amount * 100); // Convert to paise
    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: order.order_number,
      notes: {
        order_id: order.id,
        user_id: user.id,
        order_number: order.order_number,
        retry: 'true'
      }
    });

    // Update order with new Razorpay order ID
    await supabase
      .from('orders')
      .update({
        razorpay_order_id: razorpayOrder.id
      })
      .eq('id', order_id);

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: order.id
    });

  } catch (error) {
    console.error('Retry payment order creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create payment order',
      details: (error as any).message 
    }, { status: 500 });
  }
}
