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

    // Construct full Supabase URL for images that are filenames only
    const workshops = data.map(workshop => {
      let imageUrl = '/workshops/1.jpg'; // Default fallback
      
      if (workshop.image_url) {
        // If it's already a full URL (starts with http), use it
        if (workshop.image_url.startsWith('http')) {
          imageUrl = workshop.image_url;
        } else {
          // It's just a filename, construct full Supabase URL
          imageUrl = `https://cxwudthziqkqazzpatlp.supabase.co/storage/v1/object/public/workshops/${workshop.image_url}`;
        }
      }
      
      console.log('Workshop:', workshop.title, 'Image URL:', imageUrl);
      
      return {
        ...workshop,
        image_url: imageUrl
      };
    });

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