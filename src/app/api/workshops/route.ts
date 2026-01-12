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

    // 1. Fetch workshops
    const { data: workshopsData, error } = await supabase
      .from('workshops')
      .select('*, workshop_registrations(count)')
      .eq('available', true)
      .eq('workshop_registrations.status', 'confirmed') // Only count confirmed bookings
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching workshops:', error);
      return NextResponse.json(
        { error: 'Failed to fetch workshops' },
        { status: 500 }
      );
    }

    // 2. Fetch reviews for these workshops
    const workshopIds = workshopsData.map(w => w.id);
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('workshop_reviews')
      .select('*, profiles(full_name, avatar_url)')
      .in('workshop_id', workshopIds)
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      // Continue without reviews if error
    }

    // Help map reviews to workshops
    const reviewsByWorkshop = (reviewsData || []).reduce((acc: any, review: any) => {
      if (!acc[review.workshop_id]) {
        acc[review.workshop_id] = [];
      }
      
      // Transform review to match frontend expectation
      acc[review.workshop_id].push({
        id: review.id,
        name: review.profiles?.full_name || 'Anonymous',
        rating: review.rating || 5,
        date: review.created_at,
        comment: review.review_text,
        avatar: review.profiles?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (review.profiles?.full_name || 'Anonymous'),
        user_id: review.user_id // For delete permission check
      });
      return acc;
    }, {});

    // Construct full Supabase URL for images that are filenames only
    const workshops = workshopsData.map(workshop => {
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
      
      return {
        ...workshop,
        image_url: imageUrl,
        attendees: workshop.workshop_registrations?.[0]?.count || 0, // Map count to attendees
        reviews: reviewsByWorkshop[workshop.id] || [] // Attach reviews
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