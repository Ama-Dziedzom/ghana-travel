import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from './types'

/**
 * Server-side Supabase client (anon key + user session from cookies).
 * Use in Server Components and Route Handlers for user-facing data.
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (process.env.NODE_ENV !== 'development') {
    console.log(`[SUPABASE_SERVER] Initializing with URL: ${url?.split('.')[0]}...`)
  }

  if (!url || !key) throw new Error('Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY)')

  const cookieStore = await cookies()

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Ignore in Server Components — session refresh is handled by middleware.
        }
      },
    },
  })
}

/**
 * Server-side admin Supabase client using the service role key.
 * Uses the plain supabase-js client (NOT the SSR wrapper) so the service role
 * is never overridden by user session cookies. Bypasses ALL RLS policies.
 *
 * NEVER expose this to the browser. Use only in server-only admin contexts.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (process.env.NODE_ENV !== 'development') {
    console.log(`[SUPABASE_ADMIN] Initializing with URL: ${url?.split('.')[0]}...`)
  }

  if (!url || !key) throw new Error('Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)')

  return createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
