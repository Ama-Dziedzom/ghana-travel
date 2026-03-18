import { createClient } from '@/lib/supabase/server'
import type { Itinerary, ItineraryDay } from '@/lib/supabase/types'

async function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('xxxx')) {
    return null
  }
  return createClient()
}

export async function getItineraries(): Promise<Itinerary[]> {
  const supabase = await getSupabaseClient()

  if (supabase) {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('status', 'published')
      .order('duration', { ascending: false })

    if (!error && data) return data
  }

  return getLocalItineraries()
}

export async function getItineraryBySlug(
  slug: string
): Promise<(Itinerary & { days: ItineraryDay[] }) | null> {
  const supabase = await getSupabaseClient()

  if (supabase) {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*, itinerary_days(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (!error && data) {
      const { itinerary_days, ...itinerary } = data as Itinerary & { itinerary_days: ItineraryDay[] }
      return { ...itinerary, days: itinerary_days ?? [] }
    }
  }

  const all = await getLocalItineraries()
  const found = all.find((i) => i.slug === slug)
  if (!found) return null
  return { ...found, days: (found as Itinerary & { days: ItineraryDay[] }).days ?? [] }
}

// ─── Local MDX file reading (development fallback) ────────────────────────────
async function getLocalItineraries(): Promise<(Itinerary & { days: ItineraryDay[] })[]> {
  const fs = await import('fs')
  const path = await import('path')
  const matter = (await import('gray-matter')).default

  const contentDir = path.join(process.cwd(), 'content', 'itineraries')

  if (!fs.existsSync(contentDir)) return []

  const files = fs.readdirSync(contentDir).filter((f: string) => f.endsWith('.mdx'))

  return files.map((file: string) => {
    const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8')
    const { data, content } = matter(raw)

    const days: ItineraryDay[] = (data.days ?? []).map(
      (d: { day: number; title: string; morning?: string; afternoon?: string; evening?: string; eat?: string; stay?: string }, idx: number) => ({
        id: `${data.slug}-day-${idx}`,
        itinerary_id: data.slug,
        day_number: d.day ?? idx + 1,
        title: d.title ?? `Day ${d.day ?? idx + 1}`,
        stops: {
          morning: d.morning ?? null,
          afternoon: d.afternoon ?? null,
          evening: d.evening ?? null,
          eat: d.eat ?? null,
          stay: d.stay ?? null,
        },
      })
    )

    return {
      id: data.slug,
      title: data.title ?? '',
      slug: data.slug ?? file.replace('.mdx', ''),
      duration: data.duration ?? null,
      regions: data.regions ?? null,
      vibe_tags: data.vibeTags ?? null,
      best_season: data.bestSeason ?? null,
      cover_image: data.coverImage ?? null,
      summary: data.summary ?? content.trim().split('\n')[0] ?? null,
      map_embed_url: data.mapEmbedUrl ?? null,
      status: 'published' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      days,
    }
  })
}
