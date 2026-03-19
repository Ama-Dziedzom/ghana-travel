import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ArticleForm from '@/components/admin/ArticleForm'

// Force dynamic rendering so we always fetch fresh article data.
// Without this, Next.js may cache the page because createAdminClient()
// doesn't read cookies, making the fetch appear "static".
export const dynamic = 'force-dynamic'

interface EditArticlePageProps {
  params: { id: string }
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const supabase = createAdminClient()

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!article) notFound()

  return <ArticleForm article={article} />
}
