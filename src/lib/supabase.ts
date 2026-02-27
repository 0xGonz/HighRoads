import { createBrowserClient } from '@supabase/ssr'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Creates a Supabase client for use in browser/client components
 * Use this in 'use client' components
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
