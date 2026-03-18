import { createClient } from '@supabase/supabase-js'
import type { Recipe } from '@/lib/supabase/types'

function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function getRecipes(): Promise<Recipe[]> {
  const { data, error } = await publicClient()
    .from('recipes')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error || !data) return getLocalRecipes()
  return data
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const { data, error } = await publicClient()
    .from('recipes')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error || !data) {
    const local = await getLocalRecipes()
    return local.find((r) => r.slug === slug) ?? null
  }

  return data
}

// ─── Local MDX fallback ────────────────────────────────────────────────────────
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
