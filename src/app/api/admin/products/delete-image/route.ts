// API Route: Delete Product Image from Supabase Storage
// Removes old product images when replaced with new ones
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get file path from request
        const { filePath } = await request.json();

        if (!filePath) {
            return NextResponse.json({ error: 'File path is required' }, { status: 400 });
        }

        // Delete from Supabase Storage
        const { error: deleteError } = await supabase.storage
            .from('products')
            .remove([filePath]);

        if (deleteError) {
            console.error('Delete error:', deleteError);
            return NextResponse.json({ 
                error: 'Failed to delete image',
                details: deleteError.message
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Image deleted successfully'
        });

    } catch (error) {
        console.error('Image deletion error:', error);
        return NextResponse.json({ 
            error: 'Internal server error' 
        }, { status: 500 });
    }
}
