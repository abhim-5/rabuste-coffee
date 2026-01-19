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

        // 3. Get order ID from request
        const { orderId } = await request.json();

        if (!orderId || typeof orderId !== 'string') {
            return NextResponse.json({ 
                success: false, 
                error: 'Invalid order ID' 
            }, { status: 400 });
        }

        // 4. Verify order exists and is eligible for pickup
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('id, order_number, status, pickup_verified')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ 
                success: false, 
                error: 'Order not found' 
            }, { status: 404 });
        }

        // 5. Check if already marked
        if (order.pickup_verified) {
            return NextResponse.json({ 
                success: false, 
                error: 'Order already marked as picked up' 
            }, { status: 400 });
        }

        // 6. Mark as picked up
        const { error: updateError } = await supabase
            .from('orders')
            .update({ 
                pickup_verified: true,
                pickup_verified_at: new Date().toISOString(),
                pickup_verified_by: user.id,
                status: 'completed' // Auto-complete on pickup
            })
            .eq('id', orderId);

        if (updateError) {
            console.error('Update error:', updateError);
            return NextResponse.json({ 
                success: false, 
                error: 'Failed to mark order as picked up' 
            }, { status: 500 });
        }

        // 7. Success
        return NextResponse.json({ 
            success: true, 
            message: 'Order marked as picked up successfully',
            order: {
                orderNumber: order.order_number,
                status: 'completed'
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error('Mark pickup error:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || 'Internal server error' 
        }, { status: 500 });
    }
}
