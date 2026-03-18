import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ArticleForm from '@/components/admin/ArticleForm'

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
