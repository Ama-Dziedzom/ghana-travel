import { createClient } from '@supabase/supabase-js'
import type { Itinerary, ItineraryDay } from '@/lib/supabase/types'
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

export async function getItineraries(): Promise<Itinerary[]> {
  const client = publicClient()
  if (client) {
    const { data, error } = await client
      .from('itineraries')
      .select('*')
      .eq('status', 'published')
      .order('duration', { ascending: false })

    if (data && !error && data.length > 0) {
      return data
    }
  }

  // Fallback to local
  return getLocalItineraries()
}

export async function getItineraryBySlug(
  slug: string
): Promise<(Itinerary & { days: ItineraryDay[] }) | null> {
  const client = publicClient()
  if (client) {
    const { data, error } = await client
      .from('itineraries')
      .select('*, itinerary_days(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()

    if (data && !error) {
      const { itinerary_days, ...itinerary } = data as Itinerary & { itinerary_days: ItineraryDay[] }
      const sortedDays = (itinerary_days ?? []).sort((a, b) => a.day_number - b.day_number)
      return { ...itinerary, days: sortedDays }
    }
  }

  // Fallback to local
  const local = await getLocalItineraries()
  return local.find((i) => i.slug === slug) ?? null
}

async function getLocalItineraries(): Promise<(Itinerary & { days: ItineraryDay[] })[]> {
  const indexPath = join(process.cwd(), '.contentlayer/generated/Itinerary/_index.json')
  if (!existsSync(indexPath)) return []

  try {
    const itineraries = JSON.parse(readFileSync(indexPath, 'utf8'))
    return itineraries.map((i: any) => {
      const days = (i.days || []).map((d: any, idx: number) => ({
        id: `${i.slug}-day-${idx}`,
        itinerary_id: i.slug,
        day_number: d.day ?? idx + 1,
        title: d.title ?? `Day ${d.day ?? idx + 1}`,
        stops: {
          morning: d.morning ?? null,
          afternoon: d.afternoon ?? null,
          evening: d.evening ?? null,
          eat: d.eat ?? null,
          stay: d.stay ?? null,
        },
      }))

      return {
        id: i.slug,
        title: i.title,
        slug: i.slug,
        duration: i.duration || null,
        regions: i.regions || null,
        vibe_tags: i.vibeTags || null,
        best_season: i.bestSeason || null,
        cover_image: i.coverImage || null,
        summary: i.summary || null,
        map_embed_url: i.mapEmbedUrl || null,
        status: 'published' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        days,
      }
    })
  } catch (err) {
    console.error('Error reading local itineraries:', err)
    return []
  }
}
