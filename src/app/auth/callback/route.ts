import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error && data?.session) {
        console.log('Auth callback successful for user:', data.user?.email)
        
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle()

        // Profile doesn't exist - create it
        if (!existingProfile) {
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
              avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || null,
              role: 'customer',
              age: null // Optional - user can add later for bonus points
            })

          if (createError) {
            console.error('Error creating profile:', createError)
            // Don't block user - they can still use the app
          }
        }
        
        // Always redirect to home or intended destination
        // Age is now optional - can be added later for rewards
        return NextResponse.redirect(`${origin}${next}`)
      }
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
      }
    } catch (error) {
      console.error('Auth callback exception:', error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=unexpected_error`)
    }
  }

  // No code provided
  console.log('Auth callback: no code provided')
  return NextResponse.redirect(`${origin}/`)
}