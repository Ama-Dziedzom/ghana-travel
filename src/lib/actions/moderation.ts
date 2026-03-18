'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveComment(id: string): Promise<{ error?: string } | void> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('comments').update({ status: 'approved' }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/comments')
}

export async function rejectComment(id: string): Promise<{ error?: string } | void> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('comments').update({ status: 'rejected' }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/comments')
}

export async function deleteComment(id: string): Promise<{ error?: string } | void> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('comments').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/comments')
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
