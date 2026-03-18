import { createClient } from '@supabase/supabase-js'
import type { Article } from '@/lib/supabase/types'

// Public read client — anon key + RLS. No session cookies needed for public reads.
function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

type ArticleWithAuthor = Article & { _author_name: string | null }

function withAuthorName(data: (Article & { authors?: { name: string } | null })[]): ArticleWithAuthor[] {
  return data.map(({ authors, ...a }) => ({
    ...a,
    _author_name: authors?.name ?? null,
  }))
}

export async function getArticles(): Promise<ArticleWithAuthor[]> {
  const { data, error } = await publicClient()
    .from('articles')
    .select('*, authors(name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error || !data) return getLocalArticles()
  return withAuthorName(data as (Article & { authors?: { name: string } | null })[])
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithAuthor | null> {
  const { data, error } = await publicClient()
    .from('articles')
    .select('*, authors(name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error || !data) {
    const local = await getLocalArticles()
    return local.find((a) => a.slug === slug) ?? null
  }

  const { authors, ...article } = data as Article & { authors?: { name: string } | null }
  return { ...article, _author_name: authors?.name ?? null }
}

// ─── Local MDX fallback (dev/emergency only) ──────────────────────────────────
async function getLocalArticles(): Promise<ArticleWithAuthor[]> {
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
      _author_name: data.author ?? null,
    }
  })
}
