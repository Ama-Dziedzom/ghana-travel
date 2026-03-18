'use client'

import { useState, useTransition } from 'react'
import { updateAuthorRole } from '@/lib/actions/moderation'
import { Loader2, ChevronDown } from 'lucide-react'

const ROLES = ['author', 'editor', 'admin'] as const
type Role = typeof ROLES[number]

interface AuthorRoleSelectorProps {
  id: string
  currentRole: Role
}

export default function AuthorRoleSelector({ id, currentRole }: AuthorRoleSelectorProps) {
  const [role, setRole] = useState<Role>(currentRole)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleChange(newRole: Role) {
    setRole(newRole)
    setSaved(false)
    startTransition(async () => {
      await updateAuthorRole(id, newRole)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          value={role}
          onChange={e => handleChange(e.target.value as Role)}
          disabled={isPending}
          className="appearance-none bg-white border border-[#E8E2D9] px-3 py-1.5 pr-7 font-body text-xs text-[#1C1C1C] focus:outline-none focus:border-[#C9963A] transition-colors disabled:opacity-60 capitalize"
        >
          {ROLES.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
        </select>
        {isPending
          ? <Loader2 size={10} className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-[#7A7162]" />
          : <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7A7162] pointer-events-none" />
        }
      </div>
      {saved && <span className="font-body text-[10px] text-emerald-600 font-bold">Saved</span>}
    </div>
  )
}
