import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET user's purchased art pieces
export async function GET() {
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

    // Get user's art purchases with art piece details
    const { data: purchases, error } = await supabase
      .from('art_purchases')
      .select(`
        *,
        art_pieces (
          id,
          title,
          artist_name,
          description,
          image_url,
          dimensions,
          medium,
          year_created
        )
      `)
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false })

    if (error) {
      console.error('Error fetching art purchases:', error)
      return NextResponse.json(
        { error: 'Failed to fetch art purchases' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      purchases: purchases || [],
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

// POST purchase art piece
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

    const { artPieceId } = await request.json()

    if (!artPieceId) {
      return NextResponse.json(
        { error: 'Missing required field: artPieceId' },
        { status: 400 }
      )
    }

    // Check if art piece exists and is available
    const { data: artPiece, error: artError } = await supabase
      .from('art_pieces')
      .select('id, price, available')
      .eq('id', artPieceId)
      .single()

    if (artError || !artPiece) {
      return NextResponse.json(
        { error: 'Art piece not found' },
        { status: 404 }
      )
    }

    if (!artPiece.available) {
      return NextResponse.json(
        { error: 'Art piece is no longer available' },
        { status: 400 }
      )
    }

    // Check if user already purchased this piece
    const { data: existingPurchase } = await supabase
      .from('art_purchases')
      .select('id')
      .eq('art_piece_id', artPieceId)
      .eq('user_id', user.id)
      .single()

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'Already purchased this art piece' },
        { status: 400 }
      )
    }

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from(' art_purchases')
      .insert({
        art_piece_id: artPieceId,
        user_id: user.id,
        purchase_price: artPiece.price
      })
      .select()
      .single()

    if (purchaseError) {
      console.error('Error creating art purchase:', purchaseError)
      return NextResponse.json(
        { error: 'Failed to purchase art piece' },
        { status: 500 }
      )
    }

    // Mark art piece as unavailable
    await supabase
      .from('art_pieces')
      .update({ available: false })
      .eq('id', artPieceId)

    return NextResponse.json({
      purchase,
      success: true,
      message: 'Art piece purchased successfully'
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
