import { createAdminClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import AuthorRoleSelector from '@/components/admin/AuthorRoleSelector'
import { Users, Shield, Pencil, BookOpen } from 'lucide-react'

const ROLE_CONFIG = {
  admin:  { icon: Shield,   color: 'text-[#C9963A] bg-[#C9963A]/10', label: 'Admin' },
  editor: { icon: Pencil,   color: 'text-[#2D5016] bg-[#2D5016]/10', label: 'Editor' },
  author: { icon: BookOpen, color: 'text-[#7A7162] bg-[#E8E2D9]',    label: 'Author' },
} as const

export default async function AdminAuthorsPage() {
  const supabase = createAdminClient()

  const { data: authors } = await supabase
    .from('authors')
    .select('id, name, email, role, avatar_url, bio, created_at')
    .order('created_at', { ascending: true })

  const rows = authors ?? []

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Authors"
        subtitle={`${rows.length} contributor${rows.length !== 1 ? 's' : ''}`}
      />

      <main className="flex-1 p-8">
        {/* Role legend */}
        <div className="flex flex-wrap gap-4 mb-8">
          {(['admin', 'editor', 'author'] as const).map(role => {
            const cfg = ROLE_CONFIG[role]
            const count = rows.filter(a => a.role === role).length
            return (
              <div key={role} className={`flex items-center gap-2 px-4 py-2.5 border border-[#E8E2D9] bg-white`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${cfg.color}`}>
                  <cfg.icon size={12} />
                </div>
                <div>
                  <p className="font-body text-xs font-bold text-[#1C1C1C]">{cfg.label}</p>
                  <p className="font-body text-[10px] text-[#7A7162]">{count} user{count !== 1 ? 's' : ''}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E8E2D9] overflow-hidden">
          {rows.length === 0 ? (
            <div className="py-20 text-center">
              <Users size={32} className="text-[#C4BDB4] mx-auto mb-4" />
              <p className="font-display text-2xl text-[#7A7162] italic">No authors yet.</p>
              <p className="font-body text-sm text-[#7A7162]/60 mt-2">Authors are created automatically when users sign up.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E2D9] bg-[#FAFAF9]">
                  <th className="px-6 py-3 text-left font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">Author</th>
                  <th className="px-4 py-3 text-left font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162] hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 text-left font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162] hidden lg:table-cell">Bio</th>
                  <th className="px-4 py-3 text-left font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9]">
                {rows.map(author => {
                  const cfg = ROLE_CONFIG[author.role as keyof typeof ROLE_CONFIG]
                  return (
                    <tr key={author.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {author.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={author.avatar_url} alt={author.name} className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#C9963A]/10 flex items-center justify-center font-display font-bold text-[#C9963A] text-sm">
                              {author.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <p className="font-body text-sm font-semibold text-[#1C1C1C]">{author.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="font-body text-xs text-[#7A7162]">{author.email}</span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <p className="font-body text-xs text-[#7A7162] line-clamp-2 max-w-xs">{author.bio ?? '—'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <AuthorRoleSelector
                          id={author.id}
                          currentRole={author.role as 'admin' | 'editor' | 'author'}
                        />
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
