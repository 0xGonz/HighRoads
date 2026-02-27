import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/admin'

  if (code) {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error)
      // Redirect to login with error
      return NextResponse.redirect(
        new URL('/admin/login?error=auth_failed', requestUrl.origin)
      )
    }

    // Check if user is an admin
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!adminUser) {
        // User exists but is not an admin - sign them out
        await supabase.auth.signOut()
        return NextResponse.redirect(
          new URL('/admin/login?error=not_authorized', requestUrl.origin)
        )
      }
    }

    // Successful login - redirect to admin dashboard
    return NextResponse.redirect(new URL(next, requestUrl.origin))
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL('/admin/login', requestUrl.origin))
}
