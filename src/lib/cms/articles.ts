import { createClient } from '@/lib/supabase/server'
import type { Article } from '@/lib/supabase/types'

// ─── Fallback: read from local MDX files (used before Supabase is connected) ──
// This keeps the website working in development before env vars are set.

async function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('xxxx')) {
    return null
  }
  return createClient()
}

export async function getArticles(): Promise<Article[]> {
  const supabase = await getSupabaseClient()

  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (!error && data) return data
  }

  // Fallback to local MDX files
  return getLocalArticles()
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await getSupabaseClient()

  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (!error && data) return data
  }

  // Fallback to local MDX files
  const articles = await getLocalArticles()
  return articles.find((a) => a.slug === slug) ?? null
}

// ─── Local MDX file reading (development fallback) ────────────────────────────
async function getLocalArticles(): Promise<Article[]> {
  const fs = await import('fs')
  const path = await import('path')
  const matter = (await import('gray-matter')).default

  const contentDir = path.join(process.cwd(), 'content', 'articles')

  if (!fs.existsSync(contentDir)) return []

  const files = fs.readdirSync(contentDir).filter((f: string) => f.endsWith('.mdx'))

  return files.map((file: string) => {
    const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8')
    const { data, content } = matter(raw)
    return {
      id: data.slug,
      title: data.title ?? '',
      slug: data.slug ?? file.replace('.mdx', ''),
      category: data.category ?? 'culture',
      excerpt: data.excerpt ?? null,
      cover_image: data.coverImage ?? null,
      author_id: null,
      published_at: data.publishedAt ?? null,
      read_time: data.readTime ?? null,
      body_mdx: content,
      status: 'published' as const,
      created_at: data.publishedAt ?? new Date().toISOString(),
      updated_at: data.publishedAt ?? new Date().toISOString(),
      // Non-DB convenience field for display
      _author_name: data.author ?? null,
    } as Article & { _author_name: string | null }
  })
}
