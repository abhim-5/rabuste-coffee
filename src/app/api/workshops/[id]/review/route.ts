import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const supabase = await createClient();
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { review_text } = await request.json();
    const workshopId = params.id;

    if (!review_text || review_text.trim().length === 0) {
      return NextResponse.json({ error: 'Review text is required' }, { status: 400 });
    }

    // 1. Get workshop details
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('*')
      .eq('id', workshopId)
      .single();

    if (workshopError || !workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 });
    }

    // 2. Check if user has confirmed registration
    const { data: registration, error: regError } = await supabase
      .from('workshop_registrations')
      .select('*')
      .eq('workshop_id', workshopId)
      .eq('user_id', user.id)
      .eq('status', 'confirmed')
      .single();

    if (regError || !registration) {
      return NextResponse.json({ 
        error: 'You must have a confirmed registration to review this workshop' 
      }, { status: 403 });
    }

    // 3. Check if workshop date has passed
    const workshopDate = new Date(workshop.start_date);
    const now = new Date();
    
    if (workshopDate > now) {
      return NextResponse.json({ 
        error: 'Cannot review a workshop that hasn\'t occurred yet' 
      }, { status: 403 });
    }

    // 4. Check if user has already reviewed in the new table
    const { data: existingReview, error: reviewCheckError } = await supabase
      .from('workshop_reviews')
      .select('id')
      .eq('workshop_id', workshopId)
      .eq('user_id', user.id)
      .single();

    if (existingReview) {
      return NextResponse.json({ 
        error: 'You have already reviewed this workshop' 
      }, { status: 403 });
    }

    // 5. Insert into workshop_reviews table
    const { data: newReview, error: insertError } = await supabase
      .from('workshop_reviews')
      .insert({
        workshop_id: workshopId,
        user_id: user.id,
        review_text: review_text.trim(),
        rating: 5 // Default rating for now as the modal only has text. Ideally we add rating input later.
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting workshop review:', insertError);
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Review submitted successfully',
      review: newReview
    });

  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
