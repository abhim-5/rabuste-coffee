import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// Initialize Admin Client for bypassing RLS
const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Enable ISR/Cache control - Admin data should be fresh
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/reviews/workshops
 * Fetch all workshop reviews with user & workshop details
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check admin auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch reviews
    // Using adminClient or regular client? adminClient ensures we see everything 
    // though RLS "Public reviews are viewable by everyone" should suffice.
    // However, joining profiles/workshops might trigger RLS issues if fetched deeply?
    // Let's use regular client for reading if policies allow.
    
    const { data: reviews, error } = await supabase
      .from('workshop_reviews')
      .select(`
        *,
        profiles (
          full_name,
          email,
          avatar_url
        ),
        workshops (
          title,
          image_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin reviews:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }

    return NextResponse.json({ success: true, reviews });

  } catch (error) {
    console.error('Admin reviews API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/reviews/workshops
 * Delete a review by ID (Admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check admin auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await request.json();

    if (!id) {
        return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    // Use Admin Client to delete (bypass RLS which limits delete to owner)
    const { error: deleteError } = await adminSupabase
      .from('workshop_reviews')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting review (admin):', deleteError);
      return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Review deleted successfully' 
    });

  } catch (error) {
    console.error('Admin review deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
