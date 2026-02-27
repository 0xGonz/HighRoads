import { createServerSupabaseClient } from './supabase-server'
import type { AdminUser } from '@/types/database'
import { isDemoMode, mockAdmin } from './demo-data'

/**
 * Get the current authenticated admin user
 * Returns null if not authenticated or not an admin
 * In demo mode, returns a mock admin
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  // In demo mode, return mock admin
  if (isDemoMode) {
    return mockAdmin
  }

  const supabase = await createServerSupabaseClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (adminError || !adminUser) {
    return null
  }

  return adminUser
}

/**
 * Check if current user is authenticated as admin
 */
export async function isAuthenticated(): Promise<boolean> {
  const admin = await getCurrentAdmin()
  return admin !== null
}

/**
 * Check if current user has specific admin role
 */
export async function hasRole(requiredRole: 'admin' | 'manager' | 'staff'): Promise<boolean> {
  const admin = await getCurrentAdmin()

  if (!admin) return false

  // Role hierarchy: admin > manager > staff
  const roleHierarchy = { admin: 3, manager: 2, staff: 1 }
  return roleHierarchy[admin.role] >= roleHierarchy[requiredRole]
}

/**
 * Sign in with magic link
 * Sends an email with a login link
 */
export async function signInWithMagicLink(email: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
}

/**
 * Require admin authentication - throws redirect if not authenticated
 * Use in server components or route handlers
 */
export async function requireAuth(): Promise<AdminUser> {
  const admin = await getCurrentAdmin()

  if (!admin) {
    throw new Error('UNAUTHORIZED')
  }

  return admin
}
