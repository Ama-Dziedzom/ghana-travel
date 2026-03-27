import { createClient } from '@supabase/supabase-js'
import type { Itinerary, ItineraryDay } from '@/lib/supabase/types'

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export async function getItineraries(): Promise<Itinerary[]> {
  const client = publicClient()
  if (!client) return getLocalItineraries()

  const { data, error } = await client
    .from('itineraries')
    .select('*')
    .eq('status', 'published')
    .order('duration', { ascending: false })

  if (error || !data) return getLocalItineraries()
  return data
}

export async function getItineraryBySlug(
  slug: string
): Promise<(Itinerary & { days: ItineraryDay[] }) | null> {
  const client = publicClient()
  if (!client) {
    const all = await getLocalItineraries()
    const found = all.find((i) => i.slug === slug)
    return found ? { ...found, days: (found as Itinerary & { days: ItineraryDay[] }).days ?? [] } : null
  }

  const { data, error } = await client
    .from('itineraries')
    .select('*, itinerary_days(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error || !data) {
    const all = await getLocalItineraries()
    const found = all.find((i) => i.slug === slug)
    return found ? { ...found, days: (found as Itinerary & { days: ItineraryDay[] }).days ?? [] } : null
  }

  const { itinerary_days, ...itinerary } = data as Itinerary & { itinerary_days: ItineraryDay[] }
  // Sort days by day_number
  const sortedDays = (itinerary_days ?? []).sort((a, b) => a.day_number - b.day_number)
  return { ...itinerary, days: sortedDays }
}

// ─── Local MDX fallback ────────────────────────────────────────────────────────
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
