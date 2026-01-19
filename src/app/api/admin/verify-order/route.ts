import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        // 1. Authenticate admin
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ 
                success: false, 
                error: 'Authentication required' 
            }, { status: 401 });
        }

        // 2. Check admin/superadmin/staff role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const allowedRoles = ['admin', 'superadmin', 'staff'];
        if (!profile || !allowedRoles.includes(profile.role)) {
            return NextResponse.json({ 
                success: false, 
                error: 'Unauthorized. Admin, Superadmin, or Staff access required.' 
            }, { status: 403 });
        }

        // 3. Get order number from request
        const { orderNumber } = await request.json();

        if (!orderNumber || typeof orderNumber !== 'string') {
            return NextResponse.json({ 
                success: false, 
                error: 'Invalid order number' 
            }, { status: 400 });
        }

        // 4. Verify order exists and get details
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select(`
                id,
                order_number,
                order_type,
                status,
                payment_status,
                pickup_verified,
                pickup_verified_at,
                total,
                customer_name,
                customer_email,
                created_at,
                order_items (
                    menu_item_name,
                    variation_name,
                    quantity,
                    unit_price,
                    subtotal
                )
            `)
            .eq('order_number', orderNumber)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ 
                success: false, 
                valid: false,
                error: 'Order not found',
                errorCode: 'ORDER_NOT_FOUND'
            }, { status: 404 });
        }

        // 5. Check if already picked up
        if (order.pickup_verified) {
            return NextResponse.json({ 
                success: false, 
                valid: false,
                error: `Order already picked up on ${new Date(order.pickup_verified_at).toLocaleString()}`,
                errorCode: 'ALREADY_PICKED_UP',
                order: {
                    orderNumber: order.order_number,
                    pickedUpAt: order.pickup_verified_at
                }
            }, { status: 200 });
        }

        // 6. Check payment status
        if (order.payment_status !== 'paid') {
            return NextResponse.json({ 
                success: false, 
                valid: false,
                error: `Payment not confirmed. Status: ${order.payment_status}`,
                errorCode: 'PAYMENT_NOT_CONFIRMED',
                order: {
                    orderNumber: order.order_number,
                    paymentStatus: order.payment_status
                }
            }, { status: 200 });
        }

        // 7. Check order status (should be 'ready' for pickup)
        if (order.status !== 'ready' && order.status !== 'completed') {
            return NextResponse.json({ 
                success: false, 
                valid: false,
                error: `Order not ready for pickup. Status: ${order.status}`,
                errorCode: 'ORDER_NOT_READY',
                order: {
                    orderNumber: order.order_number,
                    status: order.status
                }
            }, { status: 200 });
        }

        // 8. Check if takeaway order
        if (order.order_type !== 'takeaway-now' && order.order_type !== 'takeaway-scheduled') {
            return NextResponse.json({ 
                success: false, 
                valid: false,
                error: 'QR verification is only for takeaway orders',
                errorCode: 'NOT_TAKEAWAY',
                order: {
                    orderNumber: order.order_number,
                    orderType: order.order_type
                }
            }, { status: 200 });
        }

        // 9. All checks passed - return valid order
        return NextResponse.json({ 
            success: true, 
            valid: true,
            message: 'Order verified successfully',
            order: {
                id: order.id,
                orderNumber: order.order_number,
                orderType: order.order_type,
                status: order.status,
                paymentStatus: order.payment_status,
                total: order.total,
                customerName: order.customer_name,
                customerEmail: order.customer_email,
                createdAt: order.created_at,
                items: order.order_items
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error('Verify order error:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || 'Internal server error' 
        }, { status: 500 });
    }
}
