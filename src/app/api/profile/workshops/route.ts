import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/profile/workshops
 * Fetches user's workshop registrations
 */
export async function GET(request: NextRequest) {
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

    // Fetch user's workshop registrations with workshop details
    const { data: registrations, error } = await supabase
      .from('workshop_registrations')
      .select(`
        *,
        workshops (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workshops:', error);
      return NextResponse.json(
        { error: 'Failed to fetch workshops' },
        { status: 500 }
      );
    }

    // Transform to frontend format
    const transformedWorkshops = (registrations || []).map(reg => ({
      id: reg.workshops?.id || reg.id,
      title: reg.workshops?.title || 'Workshop',
      host: reg.workshops?.instructor || 'Instructor', // Component expects 'host'
      date: reg.workshops?.start_date || reg.created_at,
      price: reg.workshops?.price || 0,
      attended: reg.status === 'attended' || reg.status === 'completed', // Component expects boolean 'attended'
      image: reg.workshops?.image_url ? `/workshops/${reg.workshops.image_url}` : '/workshops/default.jpg'
    }));

    return NextResponse.json({
      success: true,
      workshops: transformedWorkshops
    });

  } catch (error) {
    console.error('Workshops API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
