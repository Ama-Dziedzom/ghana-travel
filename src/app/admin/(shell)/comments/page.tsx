import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminCommentsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Comments" subtitle="Moderate reader comments" />
      <main className="flex-1 p-8">
        <div className="bg-white border border-[#E8E2D9] p-12 text-center">
          <p className="font-display text-2xl text-[#7A7162] italic">
            Comment moderation coming in Phase 9.
          </p>
        </div>
      </main>
    </div>
  )
}
