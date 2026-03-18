import { createAdminClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import CommentActions from '@/components/admin/CommentActions'
import { MessageSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  classes: 'bg-amber-50 text-amber-700 border-amber-100' },
  approved: { label: 'Approved', classes: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  rejected: { label: 'Rejected', classes: 'bg-red-50 text-red-700 border-red-100' },
} as const

export default async function AdminCommentsPage() {
  const supabase = createAdminClient()

  const { data: comments } = await supabase
    .from('comments')
    .select('id, body, status, created_at, guest_name, guest_email, article_id, articles(title, slug)')
    .order('created_at', { ascending: false })

  const rows = (comments ?? [] as unknown) as Array<{
    id: string
    body: string
    status: string
    created_at: string
    guest_name: string | null
    guest_email: string | null
    article_id: string
    articles: { title: string; slug: string } | null
  }>

  const pending  = rows.filter(c => c.status === 'pending').length
  const approved = rows.filter(c => c.status === 'approved').length
  const rejected = rows.filter(c => c.status === 'rejected').length

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Comments"
        subtitle={`${rows.length} total — ${pending} pending moderation`}
      />

      <main className="flex-1 p-8">
        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Pending', count: pending, colour: 'text-amber-600 bg-amber-50 border-amber-100' },
            { label: 'Approved', count: approved, colour: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            { label: 'Rejected', count: rejected, colour: 'text-red-600 bg-red-50 border-red-100' },
          ].map(s => (
            <div key={s.label} className={`border p-5 text-center ${s.colour}`}>
              <p className="font-display text-4xl leading-none mb-1">{s.count}</p>
              <p className="font-body text-[10px] uppercase tracking-widest font-bold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E8E2D9] overflow-hidden">
          {rows.length === 0 ? (
            <div className="py-20 text-center">
              <MessageSquare size={32} className="text-[#C4BDB4] mx-auto mb-4" />
              <p className="font-display text-2xl text-[#7A7162] italic">No comments yet.</p>
              <p className="font-body text-sm text-[#7A7162]/60 mt-2">Comments will appear here once readers submit them.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E2D9] bg-[#FAFAF9]">
                  <th className="px-6 py-3 text-left font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">Comment</th>
                  <th className="px-4 py-3 text-left font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162] hidden md:table-cell">Article</th>
                  <th className="px-4 py-3 text-left font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162] hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-left font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">Status</th>
                  <th className="px-4 py-3 text-right font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9]">
                {rows.map(comment => {
                  const cfg = STATUS_CONFIG[comment.status as keyof typeof STATUS_CONFIG]
                  return (
                    <tr key={comment.id} className={`hover:bg-[#FAF7F2] transition-colors ${comment.status === 'pending' ? 'bg-amber-50/30' : ''}`}>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="font-body text-sm text-[#1C1C1C] line-clamp-2">{comment.body}</p>
                        <p className="font-body text-[10px] text-[#7A7162] mt-1">
                          {comment.guest_name ?? 'Anonymous'}
                          {comment.guest_email && ` · ${comment.guest_email}`}
                        </p>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <p className="font-body text-xs text-[#7A7162] line-clamp-2">
                          {comment.articles?.title ?? 'Unknown article'}
                        </p>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="font-body text-xs text-[#7A7162]">{formatDate(comment.created_at)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`font-body text-[9px] uppercase tracking-widest font-bold px-2 py-1 border rounded-full ${cfg?.classes ?? ''}`}>
                          {cfg?.label ?? comment.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end">
                          <CommentActions id={comment.id} currentStatus={comment.status} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
