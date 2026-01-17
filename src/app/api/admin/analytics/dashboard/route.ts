// Dashboard Analytics API
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/analytics/dashboard
 * Returns overall dashboard statistics
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication and admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch from the admin_dashboard_stats view
    const { data: stats, error } = await supabase
      .from('admin_dashboard_stats')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching dashboard stats:', error);
      return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
