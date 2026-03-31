import { createClient } from '@supabase/supabase-js'
import type { Article } from '@/lib/supabase/types'
import { allArticles } from 'contentlayer/generated'

// Public read client — anon key + RLS. No session cookies needed for public reads.
function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (process.env.NODE_ENV !== 'development') {
    console.log(`[ARTICLES_CMS] Public client URL: ${url?.split('.')[0]}...`)
  }

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

const mapContentlayerArticle = (a: any): ArticleWithAuthor => ({
  id: a.slug,
  title: a.title,
  slug: a.slug,
  category: a.category,
  excerpt: a.excerpt || null,
  cover_image: a.coverImage || null,
  author_id: null,
  published_at: a.publishedAt || null,
  read_time: a.readTime || null,
  body_mdx: a.body.raw,
  status: 'published' as const,
  created_at: a.publishedAt || new Date().toISOString(),
  updated_at: a.publishedAt || new Date().toISOString(),
  _author_name: a.author || null,
})

export async function getArticles(): Promise<ArticleWithAuthor[]> {
  const client = publicClient()
  if (client) {
    const { data: dbData, error } = await client
      .from('articles')
      .select('*, authors(name)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) {
      console.error('[getArticles] Supabase error:', error)
    } else if (dbData && dbData.length > 0) {
      console.log(`[getArticles] Fetched ${dbData.length} articles from Supabase`)
      return withAuthorName(dbData as any)
    } else {
      console.log('[getArticles] Supabase returned 0 articles.')
    }
  } else {
    console.warn('[getArticles] No Supabase client — checking env vars')
  }

  // Fallback to Contentlayer
  console.log(`[getArticles] Falling back to local Contentlayer articles (${allArticles.length})`)
  return allArticles.map((a: any) => mapContentlayerArticle(a))
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithAuthor | null> {
  const client = publicClient()
  if (client) {
    const { data: dbData, error } = await client
      .from('articles')
      .select('*, authors(name)')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()

    if (error) {
      console.error(`[getArticleBySlug] Supabase error for ${slug}:`, error)
    } else if (dbData) {
      console.log(`[getArticleBySlug] Fetched article "${slug}" from Supabase`)
      const { authors, ...article } = dbData as any
      return { ...article, _author_name: authors?.name ?? null }
    }
  }

  // Fallback to local
  const localDoc = allArticles.find((a: any) => a.slug === slug)
  if (localDoc) {
    console.log(`[getArticleBySlug] Found "${slug}" in local Contentlayer articles`)
    return mapContentlayerArticle(localDoc)
  }

  console.warn(`[getArticleBySlug] Article "${slug}" not found in Supabase or Local`)
  return null
}
