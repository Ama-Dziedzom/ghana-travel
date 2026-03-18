'use client'

import { useState, useTransition } from 'react'
import { deleteRecipe } from '@/lib/actions/recipes'
import { Trash2, Loader2 } from 'lucide-react'

export default function RecipeDeleteButton({ id, title }: { id: string; title: string }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    startTransition(async () => {
      const result = await deleteRecipe(id)
      if (result?.error) { setError(result.error); setConfirming(false) }
    })
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded px-2 py-1">
        <span className="font-body text-[10px] text-red-600">Delete?</span>
        <button onClick={handleDelete} disabled={isPending}
          className="font-body text-[10px] font-bold text-red-600 hover:text-red-800 disabled:opacity-50">
          {isPending ? <Loader2 size={10} className="animate-spin" /> : 'Yes'}
        </button>
        <button onClick={() => setConfirming(false)} className="font-body text-[10px] text-[#7A7162]">No</button>
        {error && <span className="font-body text-[10px] text-red-500">{error}</span>}
      </div>
    )
  }

  return (
    <button onClick={() => setConfirming(true)} title={`Delete "${title}"`}
      className="p-1.5 text-[#7A7162] hover:text-red-500 transition-colors">
      <Trash2 size={14} />
    </button>
  )
}
