// Individual Menu Item API (Update/Delete)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * PUT /api/admin/menu/[id]
 * Update a menu item
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Update menu item
    const { data, error } = await supabase
      .from('menu_items')
      .update({
        name: body.name,
        description: body.description,
        price: body.price,
        original_price: body.original_price,
        category: body.category,
        image_url: body.image_url,
        available: body.available,
        is_deal_of_day: body.is_deal_of_day,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating menu item:', error);
      return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
    }

    // Log admin activity
    await supabase.rpc('log_admin_activity', {
      p_action: 'update_menu_item',
      p_resource_type: 'menu_item',
      p_resource_id: id,
      p_details: { changes: body }
    });

    return NextResponse.json({
      success: true,
      item: data
    });

  } catch (error) {
    console.error('Menu item update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/menu/[id]
 * Delete a menu item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Delete menu item
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting menu item:', error);
      return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }

    // Log admin activity
    await supabase.rpc('log_admin_activity', {
      p_action: 'delete_menu_item',
      p_resource_type: 'menu_item',
      p_resource_id: id,
      p_details: {}
    });

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Menu item delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
