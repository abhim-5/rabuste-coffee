import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

    // Get user orders with order items
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          product_name
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      orders: orders || [],
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
  console.log('POST /api/orders - Starting request processing')
  
  try {
    const supabase = await createClient()
    console.log('Supabase client created successfully')
    
    // Get the authenticated user from session cookies
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('Supabase auth session result:', {
      user: user ? { id: user.id, email: user.email } : null,
      authError: authError ? {
        message: authError.message,
        status: authError.status
      } : null
    })
    
    if (authError) {
      console.log('Authentication error detected:', authError)
      return NextResponse.json(
        { 
          error: 'Authentication failed',
          details: authError.message 
        }, 
        { status: 401 }
      )
    }
    
    if (!user) {
      console.log('No authenticated user found')
      return NextResponse.json(
        { error: 'No authenticated user' }, 
        { status: 401 }
      )
    }

    console.log(`Authenticated user found: ${user.id}`)

    // Parse request body for any additional order data
    const body = await request.json().catch(() => ({}))
    console.log('Request body parsed:', body)

    const orderData = {
      user_id: user.id,
      status: 'pending',
      ...body
    }
    console.log('Order data to insert:', orderData)

    // Create new order in the orders table
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single()

    if (orderError) {
      console.error('Supabase insert error:', {
        message: orderError.message,
        details: orderError.details,
        hint: orderError.hint,
        code: orderError.code
      })
      
      return NextResponse.json(
        { 
          error: 'Database insert failed',
          supabaseError: orderError.message,
          code: orderError.code
        }, 
        { status: 500 }
      )
    }

    console.log('Order created successfully:', order)
    return NextResponse.json(order, { status: 201 })

  } catch (error) {
    console.error('Unexpected error in /api/orders POST:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    })
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }, 
      { status: 500 }
    )
  }
}
