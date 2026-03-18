'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Helper: look up the article slug for a given comment id.
 * Used to revalidate the public article page when comment status changes.
 */
async function getArticleSlugForComment(supabase: ReturnType<typeof createAdminClient>, commentId: string) {
  const { data } = await supabase
    .from('comments')
    .select('article_id, articles(slug)')
    .eq('id', commentId)
    .maybeSingle()

  const row = data as { articles?: { slug: string } | null } | null
  return row?.articles?.slug ?? null
}

export async function approveComment(id: string): Promise<{ error?: string } | void> {
  const supabase = createAdminClient()
  const slug = await getArticleSlugForComment(supabase, id)
  const { error } = await supabase.from('comments').update({ status: 'approved' }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/comments')
  if (slug) revalidatePath(`/explore/${slug}`)
}

export async function rejectComment(id: string): Promise<{ error?: string } | void> {
  const supabase = createAdminClient()
  const slug = await getArticleSlugForComment(supabase, id)
  const { error } = await supabase.from('comments').update({ status: 'rejected' }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/comments')
  if (slug) revalidatePath(`/explore/${slug}`)
}

export async function deleteComment(id: string): Promise<{ error?: string } | void> {
  const supabase = createAdminClient()
  const slug = await getArticleSlugForComment(supabase, id)
  const { error } = await supabase.from('comments').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/comments')
  if (slug) revalidatePath(`/explore/${slug}`)
}

export async function updateAuthorRole(
  id: string,
  role: 'admin' | 'editor' | 'author'
): Promise<{ error?: string } | void> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('authors').update({ role }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/authors')
}
