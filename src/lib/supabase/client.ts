import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

/**
 * Browser-side Supabase client.
 * Safe to import in Client Components — uses the public anon key.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (process.env.NODE_ENV !== 'development' && typeof window !== 'undefined') {
    console.log(`[SUPABASE_CLIENT] Initializing with URL: ${url?.split('.')[0]}...`)
  }

  if (!url || !key) throw new Error('Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY)')

  return createBrowserClient<Database>(url, key)
}
