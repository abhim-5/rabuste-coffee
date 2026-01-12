// Backend Helper: Award Points on Order Completion
import { createClient } from '@/lib/supabase/server';

interface AwardPointsParams {
  userId: string;
  orderId: string;
  orderTotal: number;
  items: { id: string; name: string; price: number; quantity: number }[];
}

export async function awardPointsForOrder(params: AwardPointsParams) {
  const { userId, orderId, orderTotal, items } = params;
  
  try {
    const supabase = await createClient();
    
    // Get the points ratio from config (fallback to 10 if not configured)
    let ratio = 10;  // Default: 10 points = ₹1
    try {
      const { data: config } = await supabase
        .from('points_config')
        .select('points_to_rupee_ratio')
        .eq('id', 1)
        .single();
      
      if (config?.points_to_rupee_ratio) {
        ratio = config.points_to_rupee_ratio;
      }
    } catch (configError) {
      // If points_config doesn't exist yet, use default
      console.log('Using default ratio (10:1)');
    }
    
    // Check if user has already been awarded for this order
    const { data: existing } = await supabase
      .from('points_transactions')
      .select('id')
      .eq('order_id', orderId)
      .eq('transaction_type', 'earned')
      .single();

    if (existing) {
      console.log('Points already awarded for this order');
      return { success: false, reason: 'already_awarded' };
    }

    // Calculate points: ALL ITEMS earn points based on ratio
    const pointsToAward = Math.floor(orderTotal / ratio);

    if (pointsToAward === 0) {
      console.log(`Order too small to earn points (<₹${ratio})`);
      return { success: false, reason: 'amount_too_small' };
    }

    // Create transaction (status: confirmed - points available immediately)
    const { data: transaction, error: txError } = await supabase
      .from('points_transactions')
      .insert({
        user_id: userId,
        points: pointsToAward,
        transaction_type: 'earned',
        source: 'order',
        description: `Earned ${pointsToAward} points from order`,
        order_id: orderId,
        status: 'confirmed',
        metadata: {
          order_total: orderTotal,
          items_count: items.length,
          ratio: `${ratio}:1`
        }
      })
      .select()
      .single();

    if (txError) {
      console.error('Error creating points transaction:', txError);
      return { success: false, error: txError };
    }

    console.log(`✅ POINTS AWARDED: ${pointsToAward} points to user ${userId} for order ${orderId} (₹${orderTotal} at ${ratio}:1 ratio)`);

    // user_points will be updated automatically by the trigger
    return {
      success: true,
      points_awarded: pointsToAward,
      transaction_id: transaction.id,
      ratio: ratio
    };

  } catch (error) {
    console.error('Error awarding points:', error);
    return { success: false, error };
  }
}

// Function to reverse points if order is cancelled
export async function reversePointsForOrder(orderId: string, reason: string) {
  try {
    const supabase = await createClient();

    // Find the original earning transaction
    const { data: originalTx } = await supabase
      .from('points_transactions')
      .select('*')
      .eq('order_id', orderId)
      .eq('transaction_type', 'earned')
      .eq('status', 'confirmed')
      .single();

    if (!originalTx) {
      console.log('No points to reverse for this order');
      return { success: false, reason: 'no_transaction_found' };
    }

    // Create reversal transaction
    const { data: reversal, error } = await supabase
      .from('points_transactions')
      .insert({
        user_id: originalTx.user_id,
        points: originalTx.points,
        transaction_type: 'redeemed',
        source: 'reversal',
        description: `Points reversed: ${reason}`,
        order_id: orderId,
        status: 'confirmed',
        reversal_reason: reason,
        reversed_transaction_id: originalTx.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error reversing points:', error);
      return { success: false, error };
    }

    console.log(`Reversed ${originalTx.points} points for order ${orderId}`);
    return { success: true, points_reversed: originalTx.points };

  } catch (error) {
    console.error('Error in reversal:', error);
    return { success: false, error };
  }
}
