// API Route: Get Admin Dashboard Stats
// This bypasses RLS by using service_role key on the backend
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        console.log('🔍 Dashboard stats API called');
        const supabase = await createClient();

        // Verify user is admin
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        console.log('👤 User:', user?.email, 'Auth Error:', authError);
        
        if (authError || !user) {
            console.log('❌ Unauthorized - no user');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check admin role
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        console.log('👔 Profile:', profile, 'Profile Error:', profileError);

        if (!profile || !['admin', 'superadmin', 'staff'].includes(profile.role)) {
            console.log('❌ Forbidden - user is not admin. Role:', profile?.role);
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        console.log('✅ User is admin, fetching customer stats...');

        // Fetch customer stats (service_role bypasses RLS)
        const { data: customers, error: customersError } = await supabase
            .from('profiles')
            .select('id, created_at, role')
            .eq('role', 'customer');

        console.log('📊 Customers query result:', {
            count: customers?.length,
            error: customersError,
            sample: customers?.slice(0, 2)
        });

        if (customersError) {
            console.error('❌ Error fetching customers:', customersError);
            return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const newCustomers7d = customers?.filter(c =>
            new Date(c.created_at) >= sevenDaysAgo
        ).length || 0;

        const response = {
            success: true,
            totalCustomers: customers?.length || 0,
            newCustomers7d
        };

        console.log('✅ Sending response:', response);

        return NextResponse.json(response);

    } catch (error) {
        console.error('💥 Dashboard stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
