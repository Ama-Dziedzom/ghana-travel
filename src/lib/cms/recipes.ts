import { createClient } from '@supabase/supabase-js'
import type { Recipe } from '@/lib/supabase/types'

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, cache: 'no-store' }),
    },
  })
}

export async function getRecipes(): Promise<Recipe[]> {
  const client = publicClient()
  if (!client) return []

  const { data, error } = await client
    .from('recipes')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error || !data) {
    console.error('[getRecipes] Supabase error:', error)
    return []
  }
  return data
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const client = publicClient()
  if (!client) {
    console.error('[getRecipeBySlug] No Supabase client — env vars missing')
    return null
  }

  const { data, error } = await client
    .from('recipes')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) {
    console.error('[getRecipeBySlug] Supabase error for slug:', slug, error)
    return null
  }

  if (!data) {
    console.error('[getRecipeBySlug] No recipe found for slug:', slug)
    return null
  }

  return data
}
