import { createAdminClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import Link from 'next/link'
import ArticleDeleteButton from '@/components/admin/ArticleDeleteButton'
import { Plus, Pencil, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const STATUS_STYLES = {
  published: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  draft:     'bg-[#E8E2D9] text-[#7A7162] border-[#E2DCD3]',
}

export default async function AdminArticlesPage() {
  const supabase = createAdminClient()

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, category, status, published_at, updated_at, read_time')
    .order('updated_at', { ascending: false })

  const rows = articles ?? []

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Articles"
        subtitle={`${rows.length} article${rows.length !== 1 ? 's' : ''} total`}
      />

      <main className="flex-1 p-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 text-xs font-body">
            <span className="text-[#7A7162]">
              {rows.filter(a => a.status === 'published').length} published
            </span>
            <span className="text-[#7A7162]">·</span>
            <span className="text-[#7A7162]">
              {rows.filter(a => a.status === 'draft').length} drafts
            </span>
          </div>
          <Link
            href="/admin/articles/new"
            id="new-article-btn"
            className="flex items-center gap-2 bg-[#1C1C1C] text-white font-body text-xs font-bold uppercase tracking-widest px-5 py-3 hover:bg-[#C9963A] transition-colors"
          >
            <Plus size={14} />
            New Article
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E8E2D9] overflow-hidden">
          {rows.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-2xl text-[#7A7162] italic mb-4">No articles yet.</p>
              <Link href="/admin/articles/new" className="font-body text-sm text-[#C9963A] hover:underline">
                Write your first article →
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E2D9] bg-[#FAFAF9]">
                  <th className="px-6 py-3 text-left font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">Title</th>
                  <th className="px-4 py-3 text-left font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162] hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 text-left font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">Status</th>
                  <th className="px-4 py-3 text-left font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162] hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-right font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9]">
                {rows.map((article) => (
                  <tr key={article.id} className="hover:bg-[#FAF7F2] transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-body text-sm font-semibold text-[#1C1C1C] group-hover:text-[#C9963A] transition-colors line-clamp-1">
                          {article.title}
                        </p>
                        <p className="font-body text-[10px] text-[#7A7162] mt-0.5">
                          /explore/{article.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="font-body text-xs text-[#7A7162] capitalize">{article.category}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`font-body text-[9px] uppercase tracking-widest font-bold px-2 py-1 border rounded-full ${STATUS_STYLES[article.status as keyof typeof STATUS_STYLES]}`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="font-body text-xs text-[#7A7162]">
                        {article.updated_at ? formatDate(article.updated_at) : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {article.status === 'published' && (
                          <Link
                            href={`/explore/${article.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#7A7162] hover:text-[#1C1C1C] transition-colors"
                            title="View on site"
                          >
                            <Eye size={14} />
                          </Link>
                        )}
                        <Link
                          href={`/admin/articles/${article.id}`}
                          className="p-1.5 text-[#7A7162] hover:text-[#C9963A] transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </Link>
                        <ArticleDeleteButton id={article.id} title={article.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
