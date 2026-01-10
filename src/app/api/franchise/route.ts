import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/franchise
 * Handles franchise inquiry form submissions
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { name, email, phone, location, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert franchise inquiry
    console.log('Attempting to insert franchise inquiry:', { name, email, phone, location, message });
    
    const { data, error } = await supabase
      .from('franchise_inquiries')
      .insert({
        name,
        email,
        phone,
        location,
        message: message || null
      })
      .select()
      .single();

    if (error) {
      console.error('Franchise inquiry database error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json(
        { 
          error: 'Failed to submit inquiry',
          details: error.message,
          code: error.code
        },
        { status: 500 }
      );
    }

    console.log('Franchise inquiry submitted successfully:', data);
    
    return NextResponse.json({
      success: true,
      message: 'Franchise inquiry submitted successfully!',
      inquiry: data
    });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
