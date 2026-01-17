import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, phone } = await request.json();
    const { id: workshopId } = await params; // Await params in Next.js 15

    // Validate input
    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Get workshop details
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('*')
      .eq('id', workshopId)
      .single();

    if (workshopError || !workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 });
    }

    // Check availability
    if (workshop.available_spots <= 0) {
      return NextResponse.json({ error: 'No spots available' }, { status: 400 });
    }

    // Check if user already registered
    const { data: existingReg } = await supabase
      .from('workshop_registrations')
      .select('id')
      .eq('workshop_id', workshopId)
      .eq('user_id', user.id)
      .single();

    if (existingReg) {
      return NextResponse.json({ error: 'Already registered for this workshop' }, { status: 400 });
    }

    // Generate booking number
    const bookingNumber = `WS${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Create Razorpay order
    const amount = Math.round(workshop.price * 100); // Convert to paise
    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: bookingNumber,
      notes: {
        workshop_id: workshopId,
        user_id: user.id,
        booking_number: bookingNumber
      }
    });

    // Create registration record with pending payment
    const { data: registration, error: regError } = await supabase
      .from('workshop_registrations')
      .insert({
        workshop_id: workshopId,
        user_id: user.id,
        booking_number: bookingNumber,
        name,
        email,
        phone,
        status: 'pending',
        payment_status: 'pending',
        razorpay_order_id: razorpayOrder.id,
        amount_paid: workshop.price
      })
      .select()
      .single();

    if (regError) {
      console.error('Registration creation error:', regError);
      return NextResponse.json({ error: 'Failed to create registration' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      registrationId: registration.id,
      bookingNumber
    });

  } catch (error) {
    console.error('Workshop registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
