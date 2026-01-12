// GET/PUT /api/admin/points/config - Manage Points Configuration
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check admin access
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin/superadmin role
    const isAdmin = await supabase.rpc('is_admin');
    if (!isAdmin.data) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get config
    const { data, error } = await supabase
      .from('points_config')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check admin access
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin/superadmin role
    const isAdmin = await supabase.rpc('is_admin');
    if (!isAdmin.data) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updates = await request.json();

    // Update config
    const { data, error } = await supabase
      .from('points_config')
      .update({
        ...updates,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;

    // Log admin action
    await supabase.from('points_admin_actions').insert({
      admin_id: user.id,
      action_type: 'config_change',
      details: { changes: updates }
    });

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
