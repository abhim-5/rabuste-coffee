import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET user's points and transactions
export async function GET(request: Request) {
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

    // Get filter from query params
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'

    // Get user points summary
    const { data: pointsSummary } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Build query for transactions
    let query = supabase
      .from('points_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Apply filters
    if (filter === 'earned') {
      query = query.eq('type', 'earned')
    } else if (filter === 'redeemed') {
      query = query.eq('type', 'redeemed')
    } else if (filter !== 'all') {
      // Filter by source (orders, bonuses, workshops)
      query = query.eq('source', filter)
    }

    const { data: transactions, error } = await query

    if (error) {
      console.error('Error fetching points transactions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch points transactions' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      summary: pointsSummary || {
        user_id: user.id,
        total_points: 0,
        total_earned: 0,
        total_redeemed: 0
      },
      transactions: transactions || [],
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

// POST award or redeem points
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

    const { points, type, source, description, orderId, workshopId } = await request.json()

    // Validate required fields
    if (!points || !type || !source) {
      return NextResponse.json(
        { error: 'Missing required fields: points, type, source' },
        { status: 400 }
      )
    }

    if (type !== 'earned' && type !== 'redeemed') {
      return NextResponse.json(
        { error: 'Invalid type: must be "earned" or "redeemed"' },
        { status: 400 }
      )
    }

    // If redeeming, check if user has enough points
    if (type === 'redeemed') {
      const { data: pointsSummary } = await supabase
        .from('user_points')
        .select('total_points')
        .eq('user_id', user.id)
        .single()

      const currentPoints = pointsSummary?.total_points || 0
      if (currentPoints < points) {
        return NextResponse.json(
          { error: 'Insufficient points' },
          { status: 400 }
        )
      }
    }

    // Create transaction
    const { data: transaction, error } = await supabase
      .from('points_transactions')
      .insert({
        user_id: user.id,
        points,
        type,
        source,
        description: description || '',
        order_id: orderId || null,
        workshop_id: workshopId || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating points transaction:', error)
      return NextResponse.json(
        { error: 'Failed to create points transaction' },
        { status: 500 }
      )
    }

    // Get updated points summary
    const { data: updatedSummary } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({
      transaction,
      summary: updatedSummary,
      success: true,
      message: type === 'earned' ? 'Points awarded successfully' : 'Points redeemed successfully'
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
