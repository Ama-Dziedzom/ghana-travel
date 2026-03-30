import { createClient } from '@supabase/supabase-js'
import type { Recipe } from '@/lib/supabase/types'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

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
  if (client) {
    const { data, error } = await client
      .from('recipes')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (data && !error && data.length > 0) {
      return data
    }
  }

  // Fallback to local
  return getLocalRecipes()
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const client = publicClient()
  if (client) {
    const { data, error } = await client
      .from('recipes')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()

    if (data && !error) {
      return data
    }
  }

  // Fallback to local
  const local = await getLocalRecipes()
  return local.find((r) => r.slug === slug) ?? null
}

async function getLocalRecipes(): Promise<Recipe[]> {
  const indexPath = join(process.cwd(), '.contentlayer/generated/Recipe/_index.json')
  if (!existsSync(indexPath)) return []

  try {
    const recipes = JSON.parse(readFileSync(indexPath, 'utf8'))
    return recipes.map((r: any) => ({
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
    }))
  } catch (err) {
    console.error('Error reading local recipes:', err)
    return []
  }
}
