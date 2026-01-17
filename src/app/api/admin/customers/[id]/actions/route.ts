// Customer Actions API (Ban/Suspend, Adjust Points)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/admin/customers/[id]/actions
 * Perform actions on a customer (ban, adjust points, etc.)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params;
    const supabase = await createClient();

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { action, value, reason } = body;

    switch (action) {
      case 'ban':
        // Ban user
        const { error: banError } = await supabase
          .from('profiles')
          .update({
            is_banned: true,
            banned_reason: reason || 'Banned by admin'
          })
          .eq('id', customerId);

        if (banError) {
          return NextResponse.json({ error: 'Failed to ban user' }, { status: 500 });
        }

        // Log activity
        await supabase.rpc('log_admin_activity', {
          p_action: 'ban_user',
          p_resource_type: 'user',
          p_resource_id: customerId,
          p_details: { reason }
        });

        return NextResponse.json({ success: true, message: 'User banned successfully' });

      case 'unban':
        // Unban user
        const { error: unbanError } = await supabase
          .from('profiles')
          .update({
            is_banned: false,
            banned_reason: null
          })
          .eq('id', customerId);

        if (unbanError) {
          return NextResponse.json({ error: 'Failed to unban user' }, { status: 500 });
        }

        await supabase.rpc('log_admin_activity', {
          p_action: 'unban_user',
          p_resource_type: 'user',
          p_resource_id: customerId,
          p_details: {}
        });

        return NextResponse.json({ success: true, message: 'User unbanned successfully' });

      case 'adjust_credits':
        // Adjust credits
        const { data: currentProfile } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', customerId)
          .single();

        const newCredits = (currentProfile?.credits || 0) + Number(value);

        const { error: creditsError } = await supabase
          .from('profiles')
          .update({ credits: newCredits })
          .eq('id', customerId);

        if (creditsError) {
          return NextResponse.json({ error: 'Failed to adjust credits' }, { status: 500 });
        }

        await supabase.rpc('log_admin_activity', {
          p_action: 'adjust_credits',
          p_resource_type: 'user',
          p_resource_id: customerId,
          p_details: { amount: value, new_balance: newCredits }
        });

        return NextResponse.json({ 
          success: true, 
          message: 'Credits adjusted successfully',
          new_credits: newCredits
        });

      case 'adjust_points':
        // Create points transaction
        const { error: pointsError } = await supabase
          .from('points_transactions')
          .insert({
            user_id: customerId,
            points: Number(value),
            transaction_type: value > 0 ? 'earned' : 'redeemed',
            description: reason || 'Admin adjustment'
          });

        if (pointsError) {
          return NextResponse.json({ error: 'Failed to adjust points' }, { status: 500 });
        }

        await supabase.rpc('log_admin_activity', {
          p_action: 'adjust_points',
          p_resource_type: 'user',
          p_resource_id: customerId,
          p_details: { points: value, reason }
        });

        return NextResponse.json({ success: true, message: 'Points adjusted successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Customer action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
