// API Route: Update Product
// Allows admins to update product details
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface UpdateProductRequest {
    productId: string;
    name?: string;
    description?: string;
    price?: number;
    discount_price?: number | null;
    crossed_price?: number | null;
    is_deal_of_day?: boolean;
    deal_expiry?: string | null;
    category?: string;
    available?: boolean;
    image_url?: string;
    display_order?: number;
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Verify user is admin
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check admin role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        // Parse request body
        const body: UpdateProductRequest = await request.json();
        const { productId, ...updates } = body;

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        // Validate price logic
        if (updates.price !== undefined && updates.price < 0) {
            return NextResponse.json({ error: 'Price cannot be negative' }, { status: 400 });
        }

        if (updates.discount_price !== undefined && updates.discount_price !== null && updates.discount_price < 0) {
            return NextResponse.json({ error: 'Discount price cannot be negative' }, { status: 400 });
        }

        // Prepare update object
        const updateData: any = {
            ...updates,
            updated_at: new Date().toISOString()
        };

        // Update product
        const { data: updatedProduct, error: updateError } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', productId)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating product:', updateError);
            return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            product: updatedProduct
        });

    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
