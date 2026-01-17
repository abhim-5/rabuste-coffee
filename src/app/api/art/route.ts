import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch all art pieces
    const { data: artPieces, error } = await supabase
      .from('art_pieces')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching art pieces:', error)
      return NextResponse.json(
        { error: 'Failed to fetch art pieces' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      artPieces: artPieces || [],
      success: true
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    // Check if user has admin/staff role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.role !== 'admin' && profile.role !== 'staff' && profile.role !== 'superadmin')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const artData = await request.json()

    // Validate required fields
    if (!artData.title || !artData.artist_name || !artData.price) {
      return NextResponse.json(
        { error: 'Missing required fields: title, artist_name, price' },
        { status: 400 }
      )
    }

    const { data: artPiece, error } = await supabase
      .from('art_pieces')
      .insert({
        title: artData.title,
        artist_name: artData.artist_name,
        description: artData.description || '',
        price: artData.price,
        image_url: artData.image_url || null,
        dimensions: artData.dimensions || '',
        medium: artData.medium || '',
        year_created: artData.year_created || null,
        available: artData.available !== false,
        created_by: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating art piece:', error)
      return NextResponse.json(
        { error: 'Failed to create art piece' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      artPiece,
      success: true
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
