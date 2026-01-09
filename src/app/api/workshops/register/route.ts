import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0; // No caching for registrations

/**
 * POST /api/workshops/register
 * Creates a workshop registration
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { workshopId, name, email, phone } = body;

    if (!workshopId || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get workshop details
    const { data: workshop, error: fetchError } = await supabase
      .from('workshops')
      .select('*')
      .eq('id', workshopId)
      .eq('available', true)
      .single();

    if (fetchError || !workshop) {
      return NextResponse.json(
        { error: 'Workshop not found or not available' },
        { status: 404 }
      );
    }

    // Check if workshop has available spots
    if (workshop.available_spots <= 0) {
      return NextResponse.json(
        { error: 'Workshop is full' },
        { status: 400 }
      );
    }

    // Check if user already registered
    const { data: existing } = await supabase
      .from('workshop_registrations')
      .select('id')
      .eq('workshop_id', workshopId)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'You are already registered for this workshop' },
        { status: 400 }
      );
    }

    // Generate booking number (6 digits)
    const bookingNumber = `WS${Math.floor(100000 + Math.random() * 900000)}`;

    // Create registration
    const { data: registration, error: regError } = await supabase
      .from('workshop_registrations')
      .insert({
        workshop_id: workshopId,
        user_id: user.id,
        booking_number: bookingNumber,
        name,
        email,
        phone,
        status: 'confirmed'
      })
      .select()
      .single();

    if (regError) {
      console.error('Registration error:', regError);
      return NextResponse.json(
        { error: 'Failed to create registration' },
        { status: 500 }
      );
    }

    // Update available spots
    const { error: updateError } = await supabase
      .from('workshops')
      .update({ available_spots: workshop.available_spots - 1 })
      .eq('id', workshopId);

    if (updateError) {
      console.error('Error updating spots:', updateError);
    }

    return NextResponse.json({
      success: true,
      bookingNumber,
      registration: {
        id: registration.id,
        workshopTitle: workshop.title,
        date: workshop.start_date,
        time: workshop.start_time,
        price: workshop.price
      }
    });

  } catch (error) {
    console.error('Workshop registration API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
