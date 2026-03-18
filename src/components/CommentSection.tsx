import { createClient } from '@/lib/supabase/server'
import CommentForm from '@/components/CommentForm'
import { MessageSquare, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface CommentSectionProps {
  articleId: string
  articleSlug: string
}

interface CommentRow {
  id: string
  body: string
  guest_name: string | null
  created_at: string
}

export default async function CommentSection({
  articleId,
  articleSlug,
}: CommentSectionProps) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('comments')
    .select('id, body, guest_name, created_at')
    .eq('article_id', articleId)
    .eq('status', 'approved')
    .order('created_at', { ascending: true })

  const comments: CommentRow[] = (data ?? []) as CommentRow[]

  return (
    <section className="mt-20 border-t border-border pt-16 space-y-16">
      {/* Section heading */}
      <div className="flex items-center gap-4">
        <span className="font-body text-[10px] uppercase font-bold tracking-[0.3em] text-accent">
          Discussion
        </span>
        <div className="flex-1 h-px bg-border" />
        <span className="flex items-center gap-1.5 font-body text-[10px] uppercase tracking-wider text-muted">
          <MessageSquare size={12} />
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      {/* Approved comments list */}
      {comments.length > 0 ? (
        <ul className="space-y-8">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-5">
              {/* Avatar circle */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <User size={16} className="text-accent" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-3 mb-2">
                  <span className="font-body text-xs font-bold uppercase tracking-wider text-text">
                    {comment.guest_name ?? 'Anonymous'}
                  </span>
                  <span className="font-body text-[10px] text-muted uppercase tracking-widest">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="font-body text-sm text-text/80 leading-relaxed whitespace-pre-wrap">
                  {comment.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 text-muted">
          <MessageSquare size={28} className="mx-auto mb-3 opacity-30" />
          <p className="font-body text-sm">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}

      {/* Leave a comment */}
      <div>
        <h2 className="font-display text-2xl md:text-3xl text-text mb-8">
          Leave a comment
        </h2>
        <CommentForm articleId={articleId} articleSlug={articleSlug} />
      </div>
    </section>
  )
}
