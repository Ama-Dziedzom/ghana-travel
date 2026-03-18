'use client'

import { useTransition, useState } from 'react'
import { approveComment, rejectComment, deleteComment } from '@/lib/actions/moderation'
import { CheckCircle, XCircle, Trash2, Loader2 } from 'lucide-react'

interface CommentActionsProps {
  id: string
  currentStatus: string
}

export default function CommentActions({ id, currentStatus }: CommentActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function run(action: 'approve' | 'reject' | 'delete') {
    setActiveAction(action)
    startTransition(async () => {
      if (action === 'approve') await approveComment(id)
      else if (action === 'reject') await rejectComment(id)
      else await deleteComment(id)
      setActiveAction(null)
      setConfirmDelete(false)
    })
  }

  if (confirmDelete) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded px-2 py-1">
        <span className="font-body text-[10px] text-red-600">Delete?</span>
        <button onClick={() => run('delete')} disabled={isPending}
          className="font-body text-[10px] font-bold text-red-600 hover:text-red-800 disabled:opacity-50">
          {isPending && activeAction === 'delete' ? <Loader2 size={10} className="animate-spin" /> : 'Yes'}
        </button>
        <button onClick={() => setConfirmDelete(false)} className="font-body text-[10px] text-[#7A7162]">No</button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {currentStatus !== 'approved' && (
        <button onClick={() => run('approve')} disabled={isPending} title="Approve"
          className="p-1.5 text-emerald-600 hover:text-emerald-700 disabled:opacity-50 transition-colors">
          {isPending && activeAction === 'approve'
            ? <Loader2 size={14} className="animate-spin" />
            : <CheckCircle size={14} />}
        </button>
      )}
      {currentStatus !== 'rejected' && (
        <button onClick={() => run('reject')} disabled={isPending} title="Reject"
          className="p-1.5 text-amber-600 hover:text-amber-700 disabled:opacity-50 transition-colors">
          {isPending && activeAction === 'reject'
            ? <Loader2 size={14} className="animate-spin" />
            : <XCircle size={14} />}
        </button>
      )}
      <button onClick={() => setConfirmDelete(true)} disabled={isPending} title="Delete permanently"
        className="p-1.5 text-[#7A7162] hover:text-red-500 disabled:opacity-50 transition-colors">
        <Trash2 size={14} />
      </button>
    </div>
  )
}
