import { createClient } from '@supabase/supabase-js'
import type { Article } from '@/lib/supabase/types'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

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
  if (client) {
    const { data, error } = await client
      .from('articles')
      .select('*, authors(name)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (data && !error && data.length > 0) {
      return withAuthorName(data as (Article & { authors?: { name: string } | null })[])
    }
  }

  // Fallback to Contentlayer data
  return getLocalArticles()
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithAuthor | null> {
  const client = publicClient()
  if (client) {
    const { data, error } = await client
      .from('articles')
      .select('*, authors(name)')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()

    if (data && !error) {
      const { authors, ...article } = data as Article & { authors?: { name: string } | null }
      return { ...article, _author_name: authors?.name ?? null }
    }
  }

  // Fallback to local
  const local = await getLocalArticles()
  return local.find((a) => a.slug === slug) ?? null
}

async function getLocalArticles(): Promise<ArticleWithAuthor[]> {
  const indexPath = join(process.cwd(), '.contentlayer/generated/Article/_index.json')
  if (!existsSync(indexPath)) return []

  try {
    const articles = JSON.parse(readFileSync(indexPath, 'utf8'))
    return articles.map((a: any) => ({
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
    }))
  } catch (err) {
    console.error('Error reading local articles:', err)
    return []
  }
}
