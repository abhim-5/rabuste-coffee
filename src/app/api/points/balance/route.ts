// GET /api/points/balance - User Points Balance
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if system is enabled
    const { data: config } = await supabase
      .from('points_config')
      .select('system_enabled, points_to_rupee_ratio')
      .eq('id', 1)
      .single();

    if (!config?.system_enabled) {
      return NextResponse.json({ 
        total_points: 0,
        available_points: 0,
        system_disabled: true 
      });
    }

    // Get user points summary
    const { data: userPoints } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get locked points (pending/locked transactions)
    const { data: lockedTx } = await supabase
      .from('points_transactions')
      .select('points')
      .eq('user_id', user.id)
      .in('status', ['pending', 'locked']);

    const lockedPoints = lockedTx?.reduce((sum, tx) => sum + tx.points, 0) || 0;
    const totalPoints = userPoints?.total_points || 0;
    const availablePoints = Math.max(0, totalPoints - lockedPoints);

    return NextResponse.json({
      total_points: totalPoints,
      total_earned: userPoints?.total_earned || 0,
      total_redeemed: userPoints?.total_redeemed || 0,
      locked_points: lockedPoints,
      available_points: availablePoints,
      conversion_rate: config.points_to_rupee_ratio,
      discount_value: availablePoints / config.points_to_rupee_ratio
    });

  } catch (error) {
    console.error('Error fetching points balance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
