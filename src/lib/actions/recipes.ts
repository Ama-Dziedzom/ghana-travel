'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function slugify(str: string) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-')
}

function parseList(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch { return [] }
}

// ── CREATE ────────────────────────────────────────────────────────────────────
export async function createRecipe(formData: FormData): Promise<{ error?: string } | void> {
  const supabase = createAdminClient()

  const title = (formData.get('title') as string).trim()
  const slug = ((formData.get('slug') as string) || slugify(title)).trim()
  const category = formData.get('category') as string
  const description = (formData.get('description') as string) || null
  const cover_image = (formData.get('cover_image') as string) || null
  const prep_time = parseInt(formData.get('prep_time') as string) || null
  const cook_time = parseInt(formData.get('cook_time') as string) || null
  const servings = parseInt(formData.get('servings') as string) || null
  const difficulty = (formData.get('difficulty') as string) || null
  const tips = (formData.get('tips') as string) || null
  const status = formData.get('status') as 'draft' | 'published'
  const ingredients = parseList(formData.get('ingredients') as string)
  const instructions = parseList(formData.get('instructions') as string)

  if (!title) return { error: 'Title is required.' }
  if (!slug) return { error: 'Slug is required.' }

  const { error } = await supabase.from('recipes').insert({
    title, slug, category, description, cover_image,
    prep_time, cook_time, servings, difficulty, tips,
    ingredients, instructions, status,
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/recipes')
  revalidatePath('/admin')
  revalidatePath('/taste')
  redirect('/admin/recipes')
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
export async function updateRecipe(
  id: string,
  formData: FormData,
): Promise<{ error?: string } | void> {
  const supabase = createAdminClient()

  const title = (formData.get('title') as string).trim()
  const slug = (formData.get('slug') as string).trim()
  const category = formData.get('category') as string
  const description = (formData.get('description') as string) || null
  const cover_image = (formData.get('cover_image') as string) || null
  const prep_time = parseInt(formData.get('prep_time') as string) || null
  const cook_time = parseInt(formData.get('cook_time') as string) || null
  const servings = parseInt(formData.get('servings') as string) || null
  const difficulty = (formData.get('difficulty') as string) || null
  const tips = (formData.get('tips') as string) || null
  const status = formData.get('status') as 'draft' | 'published'
  const ingredients = parseList(formData.get('ingredients') as string)
  const instructions = parseList(formData.get('instructions') as string)

  if (!title) return { error: 'Title is required.' }
  if (!slug) return { error: 'Slug is required.' }

  const { error } = await supabase
    .from('recipes')
    .update({
      title, slug, category, description, cover_image,
      prep_time, cook_time, servings, difficulty, tips,
      ingredients, instructions, status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/recipes')
  revalidatePath('/admin')
  revalidatePath(`/taste/${slug}`)
  revalidatePath('/taste')
  redirect('/admin/recipes')
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function deleteRecipe(id: string): Promise<{ error?: string } | void> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('recipes').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/recipes')
  revalidatePath('/admin')
  revalidatePath('/taste')
}
