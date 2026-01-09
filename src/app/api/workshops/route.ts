import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Enable ISR with 5 minute revalidation
export const revalidate = 300;

/**
 * GET /api/workshops
 * Fetches workshop data from database
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('available', true)
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching workshops:', error);
      return NextResponse.json(
        { error: 'Failed to fetch workshops' },
        { status: 500 }
      );
    }

    // Use local images from /public/workshops/ folder
    const workshops = data.map(workshop => ({
      ...workshop,
      image_url: workshop.image_url 
        ? `/workshops/${workshop.image_url}`
        : '/workshops/1.jpg'
    }));

    return NextResponse.json({
      success: true,
      workshops,
      count: workshops.length
    });

  } catch (error) {
    console.error('Workshops API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workshops
 * Create new workshop (ADMIN ONLY - Future)
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Admin functionality not yet implemented' },
    { status: 501 }
  );
}