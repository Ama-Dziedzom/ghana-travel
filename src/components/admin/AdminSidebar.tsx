'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Map,
  ChefHat,
  MessageSquare,
  Users,
  ImageIcon,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'Articles',
    href: '/admin/articles',
    icon: FileText,
  },
  {
    label: 'Itineraries',
    href: '/admin/itineraries',
    icon: Map,
  },
  {
    label: 'Recipes',
    href: '/admin/recipes',
    icon: ChefHat,
  },
  {
    label: 'Comments',
    href: '/admin/comments',
    icon: MessageSquare,
  },
  {
    label: 'Authors',
    href: '/admin/authors',
    icon: Users,
  },
  {
    label: 'Media',
    href: '/admin/media',
    icon: ImageIcon,
  },
]

import Image from 'next/image'

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-[#0F0E0C] border-r border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-4 px-6 py-10 border-b border-white/5 h-20 overflow-hidden">
        <div className="relative w-40 h-40 shrink-0">
          <Image
            src="/logo-dark-bg.png"
            alt="Ghana. CMS"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              id={`admin-nav-${item.label.toLowerCase()}`}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm transition-all duration-200',
                isActive
                  ? 'bg-[#C9963A]/10 text-[#C9963A]'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5'
              )}
            >
              <item.icon
                size={16}
                className={cn(
                  'shrink-0 transition-colors',
                  isActive ? 'text-[#C9963A]' : 'text-white/30 group-hover:text-white/60'
                )}
              />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1 h-4 bg-[#C9963A] rounded-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-200 group"
        >
          <ExternalLink size={14} className="shrink-0" />
          <span>View Site</span>
        </Link>
        <button
          id="admin-logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm text-white/30 hover:text-red-400 hover:bg-red-900/10 transition-all duration-200 group"
        >
          <LogOut size={14} className="shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}
