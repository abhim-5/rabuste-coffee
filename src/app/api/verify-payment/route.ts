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
            .select('*')
            .maybeSingle();

        console.log('First update attempt:', { updatedOrder, updateError });

        // If failed, try by order_number (for retry payments)
        if (!updatedOrder) {
            console.log('Trying by order_number:', order_id);
            const result = await supabase
                .from('orders')
                .update({ 
                    status: 'preparing',
                    payment_status: 'paid',
                    notes: `Paid: ${razorpay_payment_id}`
                })
                .eq('order_number', order_id)
                .select('*')
                .maybeSingle();
            
            updatedOrder = result.data;
            updateError = result.error;
            console.log('Second update attempt (by order_number):', { updatedOrder, updateError });
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

        // 3. Award next-order coupon if eligible
        let couponEarned = null;
        try {
            const orderTotal = updatedOrder.subtotal || updatedOrder.total || 0;
            console.log(`💰 Order total for coupon calculation: ₹${orderTotal}`);
            
            let discountAmount = 0;
            
            if (orderTotal >= 700) {
                discountAmount = 30;
            } else if (orderTotal >= 500) {
                discountAmount = 20;
            }

            console.log(`🎁 Discount amount calculated: ₹${discountAmount}`);

            if (discountAmount > 0) {
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 30);

                console.log('💾 Attempting to insert coupon...');
                const { data: insertedCoupon, error: couponError } = await supabase
                    .from('user_coupons')
                    .insert({
                        user_id: updatedOrder.user_id,
                        discount_amount: discountAmount,
                        earned_from_order_id: updatedOrder.id,
                        expires_at: expiryDate.toISOString()
                    })
                    .select()
                    .single();

                console.log('💾 Insert result:', { insertedCoupon, couponError });

                if (!couponError) {
                    couponEarned = { amount: discountAmount };
                    console.log(`✅ User earned ₹${discountAmount} coupon!`);
                } else {
                    console.error('❌ Failed to insert coupon:', couponError);
                }
            } else {
                console.log('❌ Order total not eligible for coupon');
            }
        } catch (error) {
            console.error('Failed to award coupon:', error);
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Payment verified and order updated',
            order: updatedOrder,
            couponEarned
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
