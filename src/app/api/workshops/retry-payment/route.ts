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

    const { registration_id } = await request.json();

    // Get registration details
    const { data: registration, error: regError } = await supabase
      .from('workshop_registrations')
      .select('*, workshops(*)')
      .eq('id', registration_id)
      .eq('user_id', user.id)
      .single();

    if (regError || !registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Create NEW Razorpay order for retry
    const amount = Math.round(registration.workshops.price * 100); // Convert to paise
    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: registration.booking_number,
      notes: {
        workshop_id: registration.workshop_id,
        user_id: user.id,
        booking_number: registration.booking_number,
        retry: 'true'
      }
    });

    // Update registration with new order ID
    await supabase
      .from('workshop_registrations')
      .update({
        razorpay_order_id: razorpayOrder.id
      })
      .eq('id', registration_id);

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      registrationId: registration.id
    });

  } catch (error) {
    console.error('Retry payment order creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create payment order',
      details: (error as any).message 
    }, { status: 500 });
  }
}
