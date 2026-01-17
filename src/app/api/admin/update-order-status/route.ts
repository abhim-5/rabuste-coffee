// API Route to Update Order Status
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user is admin/superadmin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || !['admin', 'superadmin', 'staff'].includes(profile.role)) {
            return NextResponse.json(
                { error: 'Forbidden - Admin access required' },
                { status: 403 }
            );
        }

        // Get request body
        const body = await request.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return NextResponse.json(
                { error: 'Missing orderId or status' },
                { status: 400 }
            );
        }

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
                { status: 400 }
            );
        }

        // Update order status
        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({ 
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', orderId)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating order:', updateError);
            return NextResponse.json(
                { error: 'Failed to update order status' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            order: updatedOrder
        });

    } catch (error) {
        console.error('Update order status error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
