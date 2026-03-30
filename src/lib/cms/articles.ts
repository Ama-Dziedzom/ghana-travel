import { createClient } from '@supabase/supabase-js'
import type { Article } from '@/lib/supabase/types'

// Public read client — anon key + RLS. No session cookies needed for public reads.
// Returns null when env vars are missing (e.g. during Vercel builds without Supabase configured).
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

type ArticleWithAuthor = Article & { _author_name: string | null }

function withAuthorName(data: (Article & { authors?: { name: string } | null })[]): ArticleWithAuthor[] {
  return data.map(({ authors, ...a }) => ({
    ...a,
    _author_name: authors?.name ?? null,
  }))
}

export async function getArticles(): Promise<ArticleWithAuthor[]> {
  const client = publicClient()
  if (!client) return []

  const { data, error } = await client
    .from('articles')
    .select('*, authors(name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error || !data) {
    console.error('[getArticles] Supabase error:', error)
    return []
  }
  return withAuthorName(data as (Article & { authors?: { name: string } | null })[])
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithAuthor | null> {
  const client = publicClient()
  if (!client) {
    console.error('[getArticleBySlug] No Supabase client — env vars missing')
    return null
  }

  const { data, error } = await client
    .from('articles')
    .select('*, authors(name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) {
    console.error('[getArticleBySlug] Supabase error for slug:', slug, error)
    return null
  }

  if (!data) {
    console.error('[getArticleBySlug] No article found for slug:', slug)
    return null
  }

  const { authors, ...article } = data as Article & { authors?: { name: string } | null }
  return { ...article, _author_name: authors?.name ?? null }
}

