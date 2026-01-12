import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
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

    const reviewId = params.id;

    // Verify review ownership (RLS handles this usually, but double check doesn't hurt)
    // Actually, simple DELETE with eq user_id matches RLS policy
    const { error: deleteError } = await supabase
      .from('workshop_reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', user.id); // Explicitly ensure user owns it

    if (deleteError) {
      console.error('Error deleting review:', deleteError);
      return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Review deleted successfully' 
    });

  } catch (error) {
    console.error('Review deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
