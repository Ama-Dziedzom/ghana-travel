'use server'

import { createAdminClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'
import { revalidatePath } from 'next/cache'

interface SubmitCommentPayload {
  article_id: string
  article_slug: string
  guest_name: string
  guest_email?: string
  body: string
}

export async function submitComment(
  payload: SubmitCommentPayload
): Promise<{ success: boolean; error?: string }> {
  const { article_slug, guest_name, guest_email, body } = payload

  // ── Server-side validation ────────────────────────────────────────────────
  if (!guest_name.trim())
    return { success: false, error: 'Name is required.' }
  if (!body.trim())
    return { success: false, error: 'Comment cannot be empty.' }
  if (body.trim().length < 5)
    return { success: false, error: 'Comment is too short (minimum 5 characters).' }
  if (body.trim().length > 2000)
    return { success: false, error: 'Comment is too long (max 2000 characters).' }
  if (guest_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest_email.trim()))
    return { success: false, error: 'Please enter a valid email address.' }

  const supabase = createAdminClient()

  // Always look up the real UUID from Supabase using the article slug.
  // The article_id passed from the client may be a slug string (local MDX
  // fallback) which Postgres would reject on the UUID foreign-key constraint.
  const { data: articleRow, error: articleErr } = await supabase
    .from('articles')
    .select('id')
    .eq('slug', article_slug)
    .maybeSingle()

  if (articleErr || !articleRow) {
    return {
      success: false,
      error: "This article isn't in the database yet — comments aren't available for it right now.",
    }
  }

  // ── Insert comment ────────────────────────────────────────────────────────
  const insert: Database['public']['Tables']['comments']['Insert'] = {
    article_id: articleRow.id,         // guaranteed real UUID
    guest_name: guest_name.trim(),
    guest_email: guest_email?.trim() || null,
    body: body.trim(),
    status: 'pending',
  }

  const { error: insertErr } = await supabase.from('comments').insert(insert)

  if (insertErr) {
    console.error('[submitComment]', insertErr)
    return { success: false, error: 'Failed to submit comment. Please try again.' }
  }

  revalidatePath(`/explore/${article_slug}`)

  return { success: true }
}
