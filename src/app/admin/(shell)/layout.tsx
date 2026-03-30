import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

// This layout only wraps /admin/* pages that require authentication.
// /admin/login is in a sibling group and is NOT wrapped by this layout.

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  if (!supabase) throw new Error('Supabase client not initialized')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )
}
