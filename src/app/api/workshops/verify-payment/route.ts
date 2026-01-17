import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      registration_id 
    } = await request.json();

    console.log('Payment verification request:', {
      razorpay_order_id,
      razorpay_payment_id,
      registration_id,
      user_id: user.id
    });

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('Signature mismatch:', { generatedSignature, razorpay_signature });
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Signature verified successfully');

    // Create Admin Client with Service Role Key to bypass RLS
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // First, check if the registration exists (using standard client is fine for read if RLS allows, 
    // but let's use admin to be sure we find it)
    const { data: existingReg, error: checkError } = await adminSupabase
      .from('workshop_registrations')
      .select('id, workshop_id, user_id, booking_number, status, payment_status')
      .eq('id', registration_id)
      .maybeSingle();
    
    console.log('Existing registration check:', existingReg);
    
    if (checkError) {
      console.error('Error checking registration:', checkError);
      return NextResponse.json({
        success: false,
        error: 'Database error',
        details: checkError.message
      }, { status: 500 });
    }

    if (!existingReg) {
      console.error('Registration not found in database:', registration_id);
      return NextResponse.json({
        success: false,
        error: 'Registration not found. The registration may have been deleted or does not exist.',
        details: `No registration found with ID: ${registration_id}`
      }, { status: 404 });
    }

    // Verify ownership
    if (existingReg.user_id !== user.id) {
      console.error('User mismatch:', { expected: user.id, actual: existingReg.user_id });
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - registration belongs to different user'
      }, { status: 403 });
    }

    console.log('Registration exists and belongs to user, proceeding with payment update');

    // Update registration payment status using ADMIN client
    const { error: updateError } = await adminSupabase
      .from('workshop_registrations')
      .update({
        payment_status: 'paid',
        payment_id: razorpay_payment_id
      })
      .eq('id', registration_id);

    if (updateError) {
      console.error('Payment update error:', updateError);
      console.error('Registration ID:', registration_id);
      console.error('User ID:', user.id);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update payment status',
        details: updateError.message 
      }, { status: 500 });
    }

    console.log('Payment status updated successfully for registration:', registration_id);

    // Use the workshop_id from the existing registration check
    const workshop_id = existingReg.workshop_id;

    // Decrease available spots (also using admin client to be safe)
    const { error: spotError } = await adminSupabase.rpc('decrement_workshop_spots', {
      workshop_uuid: workshop_id
    });

    if (spotError) {
      // Log error but don't fail the verification since payment is already recorded
      console.error('Failed to decrement spots:', spotError);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      details: (error as any).message 
    }, { status: 500 });
  }
}
