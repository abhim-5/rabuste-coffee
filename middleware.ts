import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Define protected routes
    const protectedRoutes = ['/profile', '/complete-profile', '/points']
    const staffRoutes = ['/dashboard', '/staff']
    const adminRoutes = ['/admin']
    
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
    const isStaffRoute = staffRoutes.some(route => pathname.startsWith(route))
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

    if (isProtectedRoute || isStaffRoute || isAdminRoute) {
      const supabase = await createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        // Redirect unauthenticated users to home
        return NextResponse.redirect(new URL('/', request.url))
      }

      // Check role-based access for staff and admin routes
      if (isStaffRoute || isAdminRoute) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (!profile) {
          return NextResponse.redirect(new URL('/', request.url))
        }

        // Check staff access
        if (isStaffRoute && !['staff', 'admin', 'superadmin'].includes(profile.role)) {
          return NextResponse.redirect(new URL('/', request.url))
        }

        // Check admin access
        if (isAdminRoute && !['admin', 'superadmin'].includes(profile.role)) {
          return NextResponse.redirect(new URL('/', request.url))
        }
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}