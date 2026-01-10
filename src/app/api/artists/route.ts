import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/artists - Fetch all artists
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: artists, error } = await supabase
      .from('artists')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching artists:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch artists' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      artists: artists || []
    });

  } catch (error) {
    console.error('Artists API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/artists - Create new artist
export async function POST(request: Request) {
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

    // Check if user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Artist name is required' },
        { status: 400 }
      );
    }

    // Insert new artist
    const { data: artist, error } = await supabase
      .from('artists')
      .insert({
        name: name.trim(),
        description: description?.trim() || null
      })
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Artist with this name already exists' },
          { status: 409 }
        );
      }
      console.error('Error creating artist:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create artist' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      artist
    });

  } catch (error) {
    console.error('Artists API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/artists - Update existing artist
export async function PUT(request: Request) {
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

    // Check if user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, name, description } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Artist ID is required' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description?.trim() || null;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Update artist
    const { data: artist, error } = await supabase
      .from('artists')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Artist with this name already exists' },
          { status: 409 }
        );
      }
      console.error('Error updating artist:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update artist' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      artist
    });

  } catch (error) {
    console.error('Artists API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
