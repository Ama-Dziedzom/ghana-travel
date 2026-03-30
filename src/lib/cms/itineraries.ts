import { createClient } from '@supabase/supabase-js'
import type { Itinerary, ItineraryDay } from '@/lib/supabase/types'
import { allItineraries } from 'contentlayer/generated'

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

const mapContentlayerItinerary = (i: any): (Itinerary & { days: ItineraryDay[] }) => {
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
}

export async function getItineraries(): Promise<Itinerary[]> {
  const client = publicClient()
  if (client) {
    const { data: dbData, error } = await client
      .from('itineraries')
      .select('*')
      .eq('status', 'published')
      .order('duration', { ascending: false })

    if (error) {
      console.error('[getItineraries] Supabase error:', error)
    } else if (dbData && dbData.length > 0) {
      console.log(`[getItineraries] Fetched ${dbData.length} itineraries from Supabase`)
      return dbData
    } else {
      console.log('[getItineraries] Supabase returned 0 itineraries.')
    }
  }

  // Fallback to local
  console.log(`[getItineraries] Falling back to local Contentlayer itineraries (${allItineraries.length})`)
  return allItineraries.map(mapContentlayerItinerary)
}

export async function getItineraryBySlug(
  slug: string
): Promise<(Itinerary & { days: ItineraryDay[] }) | null> {
  const client = publicClient()
  if (client) {
    const { data: dbData, error } = await client
      .from('itineraries')
      .select('*, itinerary_days(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()

    if (error) {
      console.error(`[getItineraryBySlug] Supabase error for ${slug}:`, error)
    } else if (dbData) {
      console.log(`[getItineraryBySlug] Fetched itinerary "${slug}" from Supabase`)
      const { itinerary_days, ...itinerary } = dbData as any
      const sortedDays = (itinerary_days ?? []).sort((a, b) => a.day_number - b.day_number)
      return { ...itinerary, days: sortedDays } as any
    }
  }

  // Fallback to local
  const localDoc = allItineraries.find((i) => i.slug === slug)
  if (localDoc) {
    console.log(`[getItineraryBySlug] Found "${slug}" in local Contentlayer itineraries`)
    return mapContentlayerItinerary(localDoc)
  }

  console.warn(`[getItineraryBySlug] Itinerary "${slug}" not found in Supabase or Local`)
  return null
}
