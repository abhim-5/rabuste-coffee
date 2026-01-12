// POST /api/points/calculate-discount - Preview Points Discount
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface CartItem {
  id: string;
  name: string;
  type: 'menu_item' | 'workshop' | 'art_piece';
  price: number;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items }: { items: CartItem[] } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Get config
    const { data: config } = await supabase
      .from('points_config')
      .select('*')
      .eq('id', 1)
      .single();

    if (!config?.system_enabled || !config?.redemption_enabled) {
      return NextResponse.json({
        applicable_points: 0,
        discount_amount: 0,
        final_total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        original_total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        warnings: ['Points redemption is currently disabled'],
        items_breakdown: []
      });
    }

    // Get user's available points
    const { data: userPoints } = await supabase
      .from('user_points')
      .select('total_points')
      .eq('user_id', user.id)
      .single();

    const availablePoints = userPoints?.total_points || 0;
    
    if (availablePoints === 0) {
      return NextResponse.json({
        applicable_points: 0,
        discount_amount: 0,
        final_total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        original_total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        warnings: ['No points available'],
        items_breakdown: []
      });
    }

    // Calculate total order value
    const originalTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Calculate maximum allowed discount
    const maxByPercent = (originalTotal * config.max_discount_percent) / 100;
    const maxByMinPayable = originalTotal - config.min_payable_amount;
    const maxByPoints = availablePoints / config.points_to_rupee_ratio;
    const maxByOrderCap = config.max_points_per_order / config.points_to_rupee_ratio;

    const maxDiscount = Math.min(
      maxByPercent,
      maxByMinPayable > 0 ? maxByMinPayable : 0,
      maxByPoints,
      maxByOrderCap,
      originalTotal  // Can't discount more than total
    );

    // Calculate points to apply (binary - all or nothing up to cap)
    const pointsToApply = Math.min(
      availablePoints,
      Math.floor(maxDiscount * config.points_to_rupee_ratio)
    );

    const discountAmount = pointsToApply / config.points_to_rupee_ratio;
    const finalTotal = originalTotal - discountAmount;

    // Build warnings
    const warnings: string[] = [];
    if (pointsToApply < availablePoints) {
      if (maxByPercent === maxDiscount) {
        warnings.push(`Discount capped at ${config.max_discount_percent}% of order total`);
      }
      if (maxByMinPayable === maxDiscount) {
        warnings.push(`Minimum payable amount is ₹${config.min_payable_amount}`);
      }
      if (maxByOrderCap === maxDiscount) {
        warnings.push(`Maximum ${config.max_points_per_order} points per order`);
      }
    }

    return NextResponse.json({
      applicable_points: pointsToApply,
      discount_amount: Number(discountAmount.toFixed(2)),
      final_total: Number(finalTotal.toFixed(2)),
      original_total: Number(originalTotal.toFixed(2)),
      warnings,
      items_breakdown: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        points_used: 0,  // Simplified - not breaking down by item
        discount: 0,
        reason: 'Global discount applied to total'
      }))
    });

  } catch (error) {
    console.error('Error calculating discount:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
