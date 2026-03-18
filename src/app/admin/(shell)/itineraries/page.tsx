import AdminHeader from '@/components/admin/AdminHeader'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function AdminItinerariesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Itineraries" subtitle="Manage curated travel itineraries" />
      <main className="flex-1 p-8">
        <div className="flex justify-end mb-6">
          <Link
            href="/admin/itineraries/new"
            id="new-itinerary-btn"
            className="flex items-center gap-2 bg-[#1C1C1C] text-white font-body text-xs font-bold uppercase tracking-widest px-5 py-3 hover:bg-[#C9963A] transition-colors"
          >
            <Plus size={14} />
            New Itinerary
          </Link>
        </div>
        <div className="bg-white border border-[#E8E2D9] p-12 text-center">
          <p className="font-display text-2xl text-[#7A7162] italic">
            Itinerary management coming in Phase 6.
          </p>
        </div>
      </main>
    </div>
  )
}
