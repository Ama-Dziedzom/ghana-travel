import { createClient } from '@/lib/supabase/server'
import type { Recipe } from '@/lib/supabase/types'

async function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('xxxx')) {
    return null
  }
  return createClient()
}

export async function getRecipes(): Promise<Recipe[]> {
  const supabase = await getSupabaseClient()

  if (supabase) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (!error && data) return data
  }

  return getLocalRecipes()
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const supabase = await getSupabaseClient()

  if (supabase) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (!error && data) return data
  }

  const recipes = await getLocalRecipes()
  return recipes.find((r) => r.slug === slug) ?? null
}

// ─── Local MDX file reading (development fallback) ────────────────────────────
async function getLocalRecipes(): Promise<Recipe[]> {
  const fs = await import('fs')
  const path = await import('path')
  const matter = (await import('gray-matter')).default

  const contentDir = path.join(process.cwd(), 'content', 'recipes')

  if (!fs.existsSync(contentDir)) return []

  const files = fs.readdirSync(contentDir).filter((f: string) => f.endsWith('.mdx'))

  return files.map((file: string) => {
    const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8')
    const { data } = matter(raw)
    return {
      id: data.slug,
      title: data.title ?? '',
      slug: data.slug ?? file.replace('.mdx', ''),
      category: data.category ?? 'soups',
      description: data.description ?? null,
      cover_image: data.coverImage ?? null,
      prep_time: data.prepTime ?? null,
      cook_time: data.cookTime ?? null,
      servings: data.servings ?? null,
      difficulty: data.difficulty ?? null,
      ingredients: data.ingredients ?? null,
      instructions: data.instructions ?? null,
      tips: data.tips ?? null,
      status: 'published' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Recipe
  })
}
