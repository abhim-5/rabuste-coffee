// Workshop CRUD API
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/workshops
 * Get all workshops
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: workshops, error } = await supabase
      .from('workshops')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching workshops:', error);
      return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      workshops
    });

  } catch (error) {
    console.error('Workshops API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/workshops
 * Create a new workshop
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('workshops')
      .insert({
        title: body.title,
        description: body.description,
        instructor: body.instructor,
        start_date: body.start_date,
        duration: body.duration,
        capacity: body.capacity,
        price: body.price,
        image_url: body.image_url,
        requirements: body.requirements || []
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating workshop:', error);
      return NextResponse.json({ error: 'Failed to create workshop' }, { status: 500 });
    }

    // Log activity
    await supabase.rpc('log_admin_activity', {
      p_action: 'create_workshop',
      p_resource_type: 'workshop',
      p_resource_id: data.id,
      p_details: { title: body.title }
    });

    return NextResponse.json({
      success: true,
      workshop: data
    });

  } catch (error) {
    console.error('Workshop creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
