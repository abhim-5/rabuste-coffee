import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CreateRatingRequest, CreateRatingResponse } from '@/types/orders';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json<CreateRatingResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: CreateRatingRequest = await request.json();
    const { order_id, ratings } = body;

    // Validate request
    if (!order_id || !ratings || ratings.length === 0) {
      return NextResponse.json<CreateRatingResponse>(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify order belongs to user and is completed
    // Try to find by order_number first (e.g., "RC939490"), then by UUID
    let { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_number, user_id, status')
      .eq('order_number', order_id)
      .single();

    // If not found by order_number, try by id (UUID)
    if (!order) {
      const result = await supabase
        .from('orders')
        .select('id, order_number, user_id, status')
        .eq('id', order_id)
        .single();
      
      order = result.data;
      orderError = result.error;
    }

    if (orderError || !order) {
      console.error('Order lookup error:', orderError, 'for order_id:', order_id);
      return NextResponse.json<CreateRatingResponse>(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.user_id !== user.id) {
      return NextResponse.json<CreateRatingResponse>(
        { success: false, error: 'Unauthorized to rate this order' },
        { status: 403 }
      );
    }

    if (order.status !== 'completed') {
      return NextResponse.json<CreateRatingResponse>(
        { success: false, error: 'Can only rate completed orders' },
        { status: 400 }
      );
    }

    // Validate all ratings are 1-5
    const invalidRatings = ratings.filter(r => r.rating < 1 || r.rating > 5);
    if (invalidRatings.length > 0) {
      return NextResponse.json<CreateRatingResponse>(
        { success: false, error: 'Ratings must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if ratings already exist for this order (use the UUID)
    const { data: existingRatings } = await supabase
      .from('product_ratings')
      .select('id')
      .eq('order_id', order.id) // Use the UUID
      .limit(1);

    if (existingRatings && existingRatings.length > 0) {
      return NextResponse.json<CreateRatingResponse>(
        { success: false, error: 'This order has already been rated' },
        { status: 400 }
      );
    }

    // Insert ratings (use the actual order UUID, not the order_number)
    const ratingsToInsert = ratings.map(rating => ({
      user_id: user.id,
      order_id: order.id, // Use the UUID, not the order_number
      order_item_id: rating.order_item_id,
      menu_item_id: rating.menu_item_id,
      menu_item_name: rating.menu_item_name,
      rating: rating.rating,
      // review_text removed - we don't collect it anymore
    }));

    const { error: insertError } = await supabase
      .from('product_ratings')
      .insert(ratingsToInsert);

    if (insertError) {
      console.error('Rating insert error:', insertError);
      return NextResponse.json<CreateRatingResponse>(
        { success: false, error: `Failed to save ratings: ${insertError.message}` },
        { status: 500 }
      );
    }

    // Success!
    return NextResponse.json<CreateRatingResponse>({
      success: true,
      message: 'Ratings submitted successfully!',
    });

  } catch (error: any) {
    console.error('Rating submission error:', error);
    return NextResponse.json<CreateRatingResponse>(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch user's ratings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    // Build query
    let query = supabase
      .from('product_ratings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Filter by order if specified
    if (orderId) {
      query = query.eq('order_id', orderId);
    }

    const { data: ratings, error: fetchError } = await query;

    if (fetchError) {
      console.error('Ratings fetch error:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch ratings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      ratings: ratings || [],
    });

  } catch (error: any) {
    console.error('Ratings fetch error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
