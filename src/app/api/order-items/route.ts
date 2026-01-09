import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get the authenticated user from session cookies
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const { order_id, coffee_id, quantity } = body

    if (!order_id || !coffee_id || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields: order_id, coffee_id, quantity' }, 
        { status: 400 }
      )
    }

    // Insert order item (RLS will validate order ownership)
    const { data: orderItem, error: insertError } = await supabase
      .from('order_items')
      .insert([
        {
          order_id,
          coffee_id,
          quantity
        }
      ])
      .select()
      .single()

    if (insertError) {
      console.error('Error creating order item:', insertError)
      return NextResponse.json(
        { error: 'Failed to create order item' }, 
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: orderItem
    }, { status: 201 })

  } catch (error) {
    console.error('Error in /api/order-items POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
