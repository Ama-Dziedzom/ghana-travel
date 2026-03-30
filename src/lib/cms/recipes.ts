import { createClient } from '@supabase/supabase-js'
import type { Recipe } from '@/lib/supabase/types'
import { allRecipes } from 'contentlayer/generated'

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

const mapContentlayerRecipe = (r: any): Recipe => ({
  id: r.slug,
  title: r.title,
  slug: r.slug,
  category: r.category,
  description: r.description || null,
  cover_image: r.coverImage || null,
  prep_time: r.prepTime || null,
  cook_time: r.cookTime || null,
  servings: r.servings || null,
  difficulty: r.difficulty || null,
  ingredients: r.ingredients || null,
  instructions: r.instructions || null,
  tips: r.tips || null,
  status: 'published' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
})

export async function getRecipes(): Promise<Recipe[]> {
  const client = publicClient()
  if (client) {
    const { data: dbData, error } = await client
      .from('recipes')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[getRecipes] Supabase error:', error)
    } else if (dbData && dbData.length > 0) {
      console.log(`[getRecipes] Fetched ${dbData.length} recipes from Supabase`)
      return dbData
    } else {
      console.log('[getRecipes] Supabase returned 0 recipes.')
    }
  }

  // Fallback to local
  console.log(`[getRecipes] Falling back to local Contentlayer recipes (${allRecipes.length})`)
  return allRecipes.map((r: any) => mapContentlayerRecipe(r))
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const client = publicClient()
  if (client) {
    const { data: dbData, error } = await client
      .from('recipes')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()

    if (error) {
      console.error(`[getRecipeBySlug] Supabase error for ${slug}:`, error)
    } else if (dbData) {
      console.log(`[getRecipeBySlug] Fetched recipe "${slug}" from Supabase`)
      return dbData
    }
  }

  // Fallback to local
  const localDoc = allRecipes.find((r: any) => r.slug === slug)
  if (localDoc) {
    console.log(`[getRecipeBySlug] Found "${slug}" in local Contentlayer recipes`)
    return mapContentlayerRecipe(localDoc)
  }

  console.warn(`[getRecipeBySlug] Recipe "${slug}" not found in Supabase or Local`)
  return null
}
