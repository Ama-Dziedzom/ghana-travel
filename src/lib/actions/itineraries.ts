'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function slugify(str: string) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// ── CREATE ────────────────────────────────────────────────────────────────────
export async function createItinerary(formData: FormData): Promise<{ error?: string } | void> {
  const supabase = createAdminClient()

  const title         = (formData.get('title') as string).trim()
  const slug          = ((formData.get('slug') as string) || slugify(title)).trim()
  const summary       = (formData.get('summary') as string) || null
  const cover_image   = (formData.get('cover_image') as string) || null
  const map_embed_url = (formData.get('map_embed_url') as string) || null
  const duration      = parseInt(formData.get('duration') as string) || null
  const best_season   = (formData.get('best_season') as string) || null
  const status        = formData.get('status') as 'draft' | 'published'

  const regionsRaw  = (formData.get('regions') as string) || ''
  const vibeTagsRaw = (formData.get('vibe_tags') as string) || ''
  const regions     = regionsRaw.split(',').map(s => s.trim()).filter(Boolean)
  const vibe_tags   = vibeTagsRaw.split(',').map(s => s.trim()).filter(Boolean)

  // Parse days JSON from form
  const daysJson = (formData.get('days') as string) || '[]'
  let days: Array<{ day_number: number; title: string; stops: Record<string, string> }> = []
  try { days = JSON.parse(daysJson) } catch { /* ignore */ }

  if (!title) return { error: 'Title is required.' }
  if (!slug)  return { error: 'Slug is required.' }

  const { data: itinerary, error } = await supabase
    .from('itineraries')
    .insert({ title, slug, summary, cover_image, map_embed_url, duration, best_season, regions, vibe_tags, status })
    .select('id')
    .single()

  if (error) return { error: error.message }

  // Insert days
  if (days.length > 0) {
    const { error: daysError } = await supabase.from('itinerary_days').insert(
      days.map(d => ({ itinerary_id: itinerary.id, day_number: d.day_number, title: d.title, stops: d.stops }))
    )
    if (daysError) return { error: `Saved itinerary but failed to save days: ${daysError.message}` }
  }

  revalidatePath('/admin/itineraries')
  revalidatePath('/admin')
  revalidatePath('/itineraries')
  redirect('/admin/itineraries')
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
export async function updateItinerary(
  id: string,
  formData: FormData,
): Promise<{ error?: string } | void> {
  const supabase = createAdminClient()

  const title         = (formData.get('title') as string).trim()
  const slug          = (formData.get('slug') as string).trim()
  const summary       = (formData.get('summary') as string) || null
  const cover_image   = (formData.get('cover_image') as string) || null
  const map_embed_url = (formData.get('map_embed_url') as string) || null
  const duration      = parseInt(formData.get('duration') as string) || null
  const best_season   = (formData.get('best_season') as string) || null
  const status        = formData.get('status') as 'draft' | 'published'

  const regionsRaw  = (formData.get('regions') as string) || ''
  const vibeTagsRaw = (formData.get('vibe_tags') as string) || ''
  const regions     = regionsRaw.split(',').map(s => s.trim()).filter(Boolean)
  const vibe_tags   = vibeTagsRaw.split(',').map(s => s.trim()).filter(Boolean)

  const daysJson = (formData.get('days') as string) || '[]'
  let days: Array<{ day_number: number; title: string; stops: Record<string, string> }> = []
  try { days = JSON.parse(daysJson) } catch { /* ignore */ }

  if (!title) return { error: 'Title is required.' }
  if (!slug)  return { error: 'Slug is required.' }

  const { error } = await supabase
    .from('itineraries')
    .update({ title, slug, summary, cover_image, map_embed_url, duration, best_season, regions, vibe_tags, status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  // Replace all days (delete + re-insert = simple and correct)
  await supabase.from('itinerary_days').delete().eq('itinerary_id', id)

  if (days.length > 0) {
    const { error: daysError } = await supabase.from('itinerary_days').insert(
      days.map(d => ({ itinerary_id: id, day_number: d.day_number, title: d.title, stops: d.stops }))
    )
    if (daysError) return { error: `Saved itinerary but failed to save days: ${daysError.message}` }
  }

  revalidatePath('/admin/itineraries')
  revalidatePath('/admin')
  revalidatePath(`/itineraries/${slug}`)
  revalidatePath('/itineraries')
  redirect('/admin/itineraries')
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function deleteItinerary(id: string): Promise<{ error?: string } | void> {
  const supabase = createAdminClient()
  // Days have ON DELETE CASCADE so they're auto-removed
  const { error } = await supabase.from('itineraries').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/itineraries')
  revalidatePath('/admin')
  revalidatePath('/itineraries')
}
