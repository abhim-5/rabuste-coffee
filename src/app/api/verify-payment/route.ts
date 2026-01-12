import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await req.json();

        // 1. Verify Signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            console.error('Signature Mismatch:', { expected: expectedSignature, actual: razorpay_signature });
            return NextResponse.json({ error: 'Invalid Payment Signature' }, { status: 400 });
        }

        // 2. Successful Payment - Update Database
        const supabase = await createClient();

        console.log('Attempting to update order:', order_id);

        // Try updating by UUID first
        let { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({ 
                status: 'confirmed',  // Valid status: 'pending', 'confirmed', 'completed', 'cancelled'
                payment_status: 'paid',
                notes: `Paid: ${razorpay_payment_id}`
            })
            .eq('id', order_id)
            .select()
            .single();

        // If failed, try by order_number (for retry payments)
        if (updateError) {
            const result = await supabase
                .from('orders')
                .update({ 
                    status: 'preparing',
                    payment_status: 'paid',
                    notes: `Paid: ${razorpay_payment_id}`
                })
                .eq('order_number', order_id)
                .select()
                .single();
            
            updatedOrder = result.data;
            updateError = result.error;
        }

        if (updateError) {
             console.error('Database Update Failed:', order_id);
             console.error('Error Details:', updateError);
             return NextResponse.json({ 
                 success: false,
                 error: 'Payment verified but DB update failed',
                 details: updateError.message 
             }, { status: 500 });
        }

        console.log('Order updated successfully:', updatedOrder);

        return NextResponse.json({ 
            success: true, 
            message: 'Payment verified and order updated',
            order: updatedOrder
        });

    } catch (error: any) {
        console.error('Verification Error:', error);
        return NextResponse.json({ 
            success: false,
            error: 'Internal Server Error',
            details: error.message 
        }, { status: 500 });
    }
}
