import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

/**
 * Browser-side Supabase client.
 * Safe to import in Client Components — uses the public anon key.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
