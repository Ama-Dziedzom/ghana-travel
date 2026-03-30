import { createClient } from '@supabase/supabase-js'
import type { Itinerary, ItineraryDay } from '@/lib/supabase/types'

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
  if (!client) return []

  const { data, error } = await client
    .from('itineraries')
    .select('*')
    .eq('status', 'published')
    .order('duration', { ascending: false })

  if (error || !data) {
    console.error('[getItineraries] Supabase error:', error)
    return []
  }
  return data
}

export async function getItineraryBySlug(
  slug: string
): Promise<(Itinerary & { days: ItineraryDay[] }) | null> {
  const client = publicClient()
  if (!client) {
    console.error('[getItineraryBySlug] No Supabase client — env vars missing')
    return null
  }

  const { data, error } = await client
    .from('itineraries')
    .select('*, itinerary_days(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) {
    console.error('[getItineraryBySlug] Supabase error for slug:', slug, error)
    return null
  }

  if (!data) {
    console.error('[getItineraryBySlug] No itinerary found for slug:', slug)
    return null
  }

  const { itinerary_days, ...itinerary } = data as Itinerary & { itinerary_days: ItineraryDay[] }
  // Sort days by day_number
  const sortedDays = (itinerary_days ?? []).sort((a, b) => a.day_number - b.day_number)
  return { ...itinerary, days: sortedDays }
}
