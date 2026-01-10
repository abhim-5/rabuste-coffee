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
        const supabase = await createClient();
        
        // 1. Authenticate User
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
        }

        const body: CreateOrderRequest = await request.json();
        const { orderType, scheduledTime, items, subtotal, tax, total, notes } = body;

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
                subtotal, // Ensure these are numbers
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

        // 4. Return Data
        return NextResponse.json({
            success: true,
            dbOrderId: order.id, // UUID
            razorpayOrderId: razorpayOrder.id, // order_...
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            orderNumber: orderNumber
        });

    } catch (error: any) {
        console.error('Create Order API Error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
