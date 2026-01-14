// Admin Coupon Management API
// GET, POST, PATCH, DELETE /api/admin/coupons
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - List all coupons with constraints
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { status: 401 });
    }

    // Check admin role
    const { data: isAdmin } = await supabase.rpc('is_admin');
    if (!isAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Admin access required' 
      }, { status: 403 });
    }

    // Get all coupons
    const { data: coupons } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    const cartCoupons = coupons?.filter(c => c.type === 'cart_value') || [];
    const menuCoupons = coupons?.filter(c => c.type === 'menu_limited') || [];

    // Get system config
    const { data: config } = await supabase
      .from('coupon_config')
      .select('*')
      .single();

    return NextResponse.json({
      success: true,
      cart_coupons: {
        active: cartCoupons.filter(c => c.is_active).length,
        max: 2,
        coupons: cartCoupons
      },
      menu_coupons: {
        active: menuCoupons.filter(c => c.is_active).length,
        max: 2,
        coupons: menuCoupons
      },
      system_enabled: config?.system_enabled || false,
      config
    });

  } catch (error: any) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch coupons'
    }, { status: 500 });
  }
}

// POST - Create new coupon
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { status: 401 });
    }

    const { data: isAdmin } = await supabase.rpc('is_admin');
    if (!isAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Admin access required' 
      }, { status: 403 });
    }

    const couponData = await request.json();

    // Validate constraints
    const { data: existing } = await supabase
      .from('coupons')
      .select('id')
      .eq('type', couponData.type)
      .eq('is_active', true);

    const maxAllowed = couponData.type === 'cart_value' ? 2 : 2;
    if (existing && existing.length >= maxAllowed) {
      return NextResponse.json({
        success: false,
        error: `Maximum ${maxAllowed} active ${couponData.type} coupons allowed`
      }, { status: 400 });
    }

    // Create coupon
    const { data: newCoupon, error } = await supabase
      .from('coupons')
      .insert({
        ...couponData,
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      coupon: newCoupon
    });

  } catch (error: any) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create coupon'
    }, { status: 500 });
  }
}
