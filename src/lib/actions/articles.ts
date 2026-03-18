'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// ── Get current user's author ID ──────────────────────────────────────────────
async function getCurrentAuthorId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()
  const { data } = await admin
    .from('authors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  return data?.id ?? null
}

// ── CREATE ────────────────────────────────────────────────────────────────────
export async function createArticle(formData: FormData): Promise<{ error?: string } | void> {
  const supabase = createAdminClient()
  const author_id = await getCurrentAuthorId()

  const title       = (formData.get('title') as string).trim()
  const slug        = ((formData.get('slug') as string) || slugify(title)).trim()
  const category    = formData.get('category') as string
  const excerpt     = (formData.get('excerpt') as string) || null
  const cover_image = (formData.get('cover_image') as string) || null
  const body_mdx    = (formData.get('body_mdx') as string) || null
  const read_time   = parseInt(formData.get('read_time') as string) || null
  const status      = formData.get('status') as 'draft' | 'published'
  const published_at = status === 'published' ? new Date().toISOString() : null

  if (!title) return { error: 'Title is required.' }
  if (!slug)  return { error: 'Slug is required.' }

  const { error } = await supabase.from('articles').insert({
    title, slug, category, excerpt, cover_image,
    body_mdx, read_time, status, published_at,
    author_id,
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/articles')
  revalidatePath('/admin')
  revalidatePath('/explore')
  redirect('/admin/articles')
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
export async function updateArticle(
  id: string,
  formData: FormData,
): Promise<{ error?: string } | void> {
  const supabase = createAdminClient()

  const title       = (formData.get('title') as string).trim()
  const slug        = (formData.get('slug') as string).trim()
  const category    = formData.get('category') as string
  const excerpt     = (formData.get('excerpt') as string) || null
  const cover_image = (formData.get('cover_image') as string) || null
  const body_mdx    = (formData.get('body_mdx') as string) || null
  const read_time   = parseInt(formData.get('read_time') as string) || null
  const newStatus   = formData.get('status') as 'draft' | 'published'

  if (!title) return { error: 'Title is required.' }
  if (!slug)  return { error: 'Slug is required.' }

  // Only set published_at if transitioning to published for the first time
  const { data: existing } = await supabase
    .from('articles')
    .select('published_at, status')
    .eq('id', id)
    .single()

  const published_at =
    newStatus === 'published' && existing?.status === 'draft'
      ? new Date().toISOString()
      : existing?.published_at ?? null

  const { error } = await supabase
    .from('articles')
    .update({
      title, slug, category, excerpt, cover_image,
      body_mdx, read_time, status: newStatus, published_at,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/articles')
  revalidatePath('/admin')
  revalidatePath(`/explore/${slug}`)
  revalidatePath('/explore')
  redirect('/admin/articles')
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function deleteArticle(id: string): Promise<{ error?: string } | void> {
  const supabase = createAdminClient()

  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/articles')
  revalidatePath('/admin')
  revalidatePath('/explore')
}
