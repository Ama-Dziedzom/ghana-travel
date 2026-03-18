'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell, Search } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface AdminHeaderProps {
  title: string
  subtitle?: string
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'GT'

  return (
    <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-[#E8E2D9]">
      {/* Page title */}
      <div>
        <h1 className="font-display text-2xl text-[#1C1C1C] leading-none">{title}</h1>
        {subtitle && (
          <p className="font-body text-xs text-[#7A7162] mt-1">{subtitle}</p>
        )}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* User avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#E8E2D9]">
          <div className="text-right hidden sm:block">
            <p className="font-body text-xs font-semibold text-[#1C1C1C] leading-none">{user?.email ?? '—'}</p>
            <p className="font-body text-[10px] text-[#7A7162] uppercase tracking-wider mt-0.5">Admin</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#C9963A]/10 border border-[#C9963A]/20 flex items-center justify-center shrink-0">
            <span className="font-display text-sm text-[#C9963A] font-semibold">{initials}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
