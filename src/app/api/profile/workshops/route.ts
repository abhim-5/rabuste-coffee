import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';


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

    // Fetch user's reviews for workshops
    const { data: userReviews } = await supabase
      .from('workshop_reviews')
      .select('id, workshop_id, rating, review_text')
      .eq('user_id', user.id);

    const reviewsMap = new Map((userReviews || []).map(r => [r.workshop_id, r]));

    // Transform to frontend format
    const transformedWorkshops = (registrations || []).map(reg => {
      // Construct proper image URL
      let imageUrl = '/workshops/default.jpg';
      if (reg.workshops?.image_url) {
        // If it's a full URL, use it directly
        if (reg.workshops.image_url.startsWith('http')) {
          imageUrl = reg.workshops.image_url;
        } else {
          // It's a filename, construct Supabase URL
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          imageUrl = `${supabaseUrl}/storage/v1/object/public/workshops/${reg.workshops.image_url}`;
        }
      }

      // Check if user has already reviewed this workshop
      const workshopId = reg.workshops?.id || reg.workshop_id;
      const review = reviewsMap.get(workshopId);

      return {
        id: reg.id, // Registration ID (for payment operations)
        workshopId: workshopId, // Workshop ID (for display)
        title: reg.workshops?.title || 'Workshop',
        host: reg.workshops?.instructor || 'Instructor',
        date: reg.workshops?.start_date || reg.created_at,
        price: reg.workshops?.price || 0,
        status: reg.status || 'pending',
        payment_status: reg.payment_status || 'pending',
        razorpay_order_id: reg.razorpay_order_id, // For payment retry
        attended: reg.status === 'attended' || reg.status === 'completed',
        hasReviewed: !!review,
        reviewId: review?.id, // For deletion
        reviewRating: review?.rating,
        reviewText: review?.review_text,
        image: imageUrl
      };
    });

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
