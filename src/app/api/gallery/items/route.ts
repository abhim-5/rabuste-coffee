import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Enable ISR with 5 minute revalidation
export const revalidate = 0; // Disable cache for admin updates to reflect immediately

/**
 * GET /api/gallery/items
 * Fetches art gallery items from database
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const adminMode = searchParams.get('admin') === 'true';

    // Build query with artist join
    let query = supabase
      .from('art_pieces')
      .select(`
        *,
        artists (
          id,
          name,
          description
        )
      `)
      .order('created_at', { ascending: false });

    // Public view only shows available items
    if (!adminMode) {
        query = query.eq('available', true);
    }

    if (featured) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching gallery items:', error);
      return NextResponse.json(
        { error: 'Failed to fetch gallery items' },
        { status: 500 }
      );
    }

    // Transform to include full URLs and flatten artist data
    const galleryItems = data.map(item => {
        let imageUrl = item.image_url || '/gallery/default.jpg';
        
        if (!adminMode && !imageUrl.startsWith('http')) {
             imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${imageUrl.replace(/^\/+/, '')}`;
        }
        
        // Flatten artist data for backward compatibility
        const { artists, ...artData } = item;
        return {
            ...artData,
            image_url: imageUrl,
            artist: artists?.name || 'Unknown Artist',
            artist_pov: artists?.description || '',
            artist_id: artists?.id || null
        };
    });

    return NextResponse.json({
      success: true,
      items: galleryItems,
      count: galleryItems.length
    });

  } catch (error) {
    console.error('Gallery API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gallery/items (Admin Only)
 * Create new art piece
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        // Auth Check
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin' && profile.role !== 'staff')) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const body = await request.json();
        const { name, artist_id, artist_name, artist_description, description, price, image_url, available } = body;

        // If artist_id not provided but artist_name is, create or find artist
        let finalArtistId = artist_id;
        if (!finalArtistId && artist_name) {
            // Check if artist exists
            const { data: existingArtist } = await supabase
                .from('artists')
                .select('id')
                .eq('name', artist_name.trim())
                .single();

            if (existingArtist) {
                finalArtistId = existingArtist.id;
            } else {
                // Create new artist
                const { data: newArtist, error: artistError } = await supabase
                    .from('artists')
                    .insert({
                        name: artist_name.trim(),
                        description: artist_description?.trim() || null
                    })
                    .select('id')
                    .single();

                if (artistError) {
                    console.error('Artist creation error:', artistError);
                    return NextResponse.json({ error: 'Failed to create artist' }, { status: 500 });
                }
                finalArtistId = newArtist.id;
            }
        }

        const { data: newArt, error } = await supabase
            .from('art_pieces')
            .insert({
                name,
                artist: artist_name?.trim() || 'Unknown', // Keep legacy column populated for constraint
                artist_id: finalArtistId,
                description,
                price,
                image_url,
                available: available !== false
            })
            .select(`
                *,
                artists (
                    id,
                    name,
                    description
                )
            `)
            .single();

        if (error) {
            console.error('Create error:', error);
            return NextResponse.json({ error: error.message || 'Failed to create art piece', details: error }, { status: 500 });
        }

        return NextResponse.json({ success: true, art: newArt });

    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

/**
 * PUT /api/gallery/items (Admin Only)
 * Update art piece
 */
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        // Auth Check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (!profile || !['admin', 'superadmin', 'staff'].includes(profile.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        // Handle artist update if provided
        // Map legacy 'artist' field or new 'artist_name' field to artist_id
        if (updates.artist || updates.artist_name) {
            const nameToFind = (updates.artist_name || updates.artist).trim();
            
            // Check if artist exists
            const { data: existingArtist } = await supabase
                .from('artists')
                .select('id')
                .eq('name', nameToFind)
                .single();

            if (existingArtist) {
                updates.artist_id = existingArtist.id;
            } else {
                // Create new artist
                const { data: newArtist, error: artistError } = await supabase
                    .from('artists')
                    .insert({ name: nameToFind })
                    .select('id')
                    .single();

                if (artistError) {
                    // If conflict, try fetching again (race condition)
                    if (artistError.code === '23505') {
                         const { data: retryArtist } = await supabase.from('artists').select('id').eq('name', nameToFind).single();
                         if (retryArtist) updates.artist_id = retryArtist.id;
                    } else {
                         console.error('Artist creation error:', artistError);
                    }
                } else {
                    updates.artist_id = newArtist.id;
                }
            }
        }

        // Clean up fields that shouldn't be blindly updated to art_pieces if they are legacy/helper fields
        // However, we are keeping 'artist' column for now as per plan, so we can update it too for sync.
        // But 'artist_name' is not a column.
        delete updates.artist_name;
        delete updates.artist_description; // art_pieces doesn't have this
        // 'artist' column exists, so we leave it in updates object to keep it in sync with artist_id

        const { data: updatedArt, error } = await supabase
            .from('art_pieces')
            .update(updates)
            .eq('id', id)
            .select(`
                *,
                artists (
                    id,
                    name,
                    description
                )
            `)
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, art: updatedArt });

    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

/**
 * DELETE /api/gallery/items (Admin Only)
 */
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        // Auth Check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (!profile || !['admin', 'superadmin', 'staff'].includes(profile.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { error } = await supabase
            .from('art_pieces')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
