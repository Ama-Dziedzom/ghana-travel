import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminAuthorsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Authors" subtitle="Manage contributors and roles" />
      <main className="flex-1 p-8">
        <div className="bg-white border border-[#E8E2D9] p-12 text-center">
          <p className="font-display text-2xl text-[#7A7162] italic">
            Author management coming in Phase 10.
          </p>
        </div>
      </main>
    </div>
  )
}
