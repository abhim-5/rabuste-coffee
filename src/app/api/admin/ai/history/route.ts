// AI Analytics History API - Fetch chat history
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate as superadmin
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { status: 401 });
    }

    // Check superadmin role
    const { data: isSuperadmin, error: roleError } = await supabase
      .rpc('is_superadmin');
    
    if (roleError || !isSuperadmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Superadmin access required' 
      }, { status: 403 });
    }

    // 2. Fetch history (last 20 queries)
    const { data: history, error: historyError } = await supabase
      .from('ai_analytics_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (historyError) {
      console.error('Error fetching history:', historyError);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch history'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      history: history || []
    });

  } catch (error: any) {
    console.error('History fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch history',
      details: error.message
    }, { status: 500 });
  }
}

// DELETE endpoint to clear history
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { status: 401 });
    }

    const { data: isSuperadmin, error: roleError } = await supabase
      .rpc('is_superadmin');
    
    if (roleError || !isSuperadmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Superadmin access required' 
      }, { status: 403 });
    }

    // Delete all history for this user
    const { error: deleteError } = await supabase
      .from('ai_analytics_history')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to clear history'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'History cleared'
    });

  } catch (error: any) {
    console.error('History delete error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to clear history'
    }, { status: 500 });
  }
}
