import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET current user's profile
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

    // Get user profile
   const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      profile,
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

// PUT update current user's profile WITH REWARDS
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updateData = await request.json()

    // Get current profile to check for rewards
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('age, avatar_url, credits, phone')
      .eq('id', user.id)
      .single()

    let creditsToAdd = 0
    let rewardMessages: string[] = []

    // Age reward (₹50 first time)
    if (updateData.age && !currentProfile?.age) {
      creditsToAdd += 50
      rewardMessages.push('🎉 ₹50 reward for adding your age!')
    }

    // Avatar reward (₹50 first time)
    if (updateData.avatar_url && !currentProfile?.avatar_url) {
      creditsToAdd += 50
      rewardMessages.push('🎉 ₹50 reward for uploading your avatar!')
    }

    // Phone reward (₹25 first time)
    if (updateData.phone && !currentProfile?.phone) {
      creditsToAdd += 25
      rewardMessages.push('🎉 ₹25 reward for adding your phone!')
    }

    const newCredits = (currentProfile?.credits || 0) + creditsToAdd

    const allowedFields = ['full_name', 'age', 'avatar_url', 'phone']
    const filteredData: Record<string, any> = {}
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field]
      }
    }

    if (creditsToAdd > 0) {
      filteredData.credits = newCredits
    }

    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    filteredData.updated_at = new Date().toISOString()

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(filteredData)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({
      profile,
      success: true,
      message: 'Profile updated successfully',
      rewards: {
        creditsEarned: creditsToAdd,
        messages: rewardMessages
      }
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
