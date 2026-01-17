import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Razorpay from 'razorpay';
import { CreateOrderRequest } from '@/types/orders';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('Create Order Request:', body);

        // Check if this is a retry payment scenario
        if (body.retryPayment && body.orderNumber) {
            // Get order UUID from database using order_number
            const supabase = await createClient();
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
            }

            const { data: existingOrder, error: orderError } = await supabase
                .from('orders')
                .select('id, total')
                .eq('order_number', body.orderNumber)
                .eq('user_id', user.id)
                .single();

            if (orderError || !existingOrder) {
                return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
            }

            // For retry payment, create Razorpay order with existing order total
            const amount = Math.round((body.total || existingOrder.total) * 100); // Convert to paise

            const razorpayOrder = await razorpay.orders.create({
                amount,
                currency: 'INR',
                receipt: `retry_${body.orderNumber}_${Date.now()}`,
            });

            return NextResponse.json({
                success: true,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                orderNumber: body.orderNumber,
                dbOrderId: existingOrder.id // Return actual UUID
            });
        }

        // Original order creation logic for new orders
        const supabase = await createClient();
        
        // 1. Authenticate User
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
        }

        const { orderType, scheduledTime, items, subtotal, tax, total, notes, regularDiscount, nextOrderDiscount, nextOrderCouponId } = body as CreateOrderRequest & {
            regularDiscount?: number;
            nextOrderDiscount?: number;
            nextOrderCouponId?: string;
        };

        // 2. Create Order in Supabase
        const { data: orderNumberData, error: numError } = await supabase.rpc('generate_order_number');
        if (numError) throw new Error('Failed to generate order number');
        const orderNumber = orderNumberData as string;

        // Fetch profile for customer name
        const { data: profile } = await supabase.from('profiles').select('full_name, email').eq('id', user.id).single();

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
                status: 'pending'
            })
            .select()
            .single();

        if (orderError) throw new Error(`DB Order creation failed: ${orderError.message}`);

        // Insert Items
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

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
        if (itemsError) {
             // Rollback
             await supabase.from('orders').delete().eq('id', order.id);
             throw new Error(`DB Items creation failed: ${itemsError.message}`);
        }

        // 3. Create Razorpay Order
        const options = {
            amount: Math.round(total * 100), // Convert to paise
            currency: 'INR',
            receipt: order.id, // Use DB UUID as receipt
            notes: {
                db_order_id: order.id,
                user_id: user.id
            }
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Check if user should earn a next-order coupon
        let couponEarned = false;
        try {
            const { data: config, error: configError } = await supabase
                .from('coupon_config')
                .select('*')
                .single();

            if (!configError && config?.system_enabled && total >= config.next_order_min_earn) {
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
                    expiryDate.setDate(expiryDate.getDate() + (config.next_order_expiry_days || 30));

                    const { error: couponError } = await supabase
                        .from('user_coupons')
                        .insert({
                            user_id: user.id,
                            discount_amount: config.next_order_discount || 40,
                            min_order_value: 100,
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
            console.error('Failed to award coupon:', couponError);
        }

        // 4. Return Data
        return NextResponse.json({
            success: true,
            orderNumber: order.order_number,
            orderId: order.id,
            amount: total * 100,
            currency: 'INR',
            razorpayOrderId: razorpayOrder.id,
            dbOrderId: order.id,
            couponEarned: couponEarned
        });

    } catch (error: any) {
        console.error('Create Order API Error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
