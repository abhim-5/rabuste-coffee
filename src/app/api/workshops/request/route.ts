import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0;

/**
 * POST /api/workshops/request
 * Submit a custom workshop request
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get user if authenticated (optional)
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const { name, email, phone, workshopTheme, additionalDetails, instagramHandle } = body;

    // Validate required fields
    if (!name || !email || !phone || !workshopTheme) {
      return NextResponse.json(
        { error: 'Name, email, phone, and workshop theme are required' },
        { status: 400 }
      );
    }

    // Create workshop request
    const { data: workshopRequest, error } = await supabase
      .from('workshop_requests')
      .insert({
        user_id: user?.id || null,
        name,
        email,
        phone,
        workshop_theme: workshopTheme,
        additional_details: additionalDetails || null,
        instagram_handle: instagramHandle || null,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Workshop request error:', error);
      return NextResponse.json(
        { error: 'Failed to submit workshop request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Workshop request submitted successfully!',
      requestId: workshopRequest.id
    });

  } catch (error) {
    console.error('Workshop request API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
