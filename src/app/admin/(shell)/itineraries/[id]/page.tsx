import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ItineraryForm from '@/components/admin/ItineraryForm'

export const dynamic = 'force-dynamic'

interface Props { params: { id: string } }

export default async function EditItineraryPage({ params }: Props) {
  const supabase = createAdminClient()
  if (!supabase) throw new Error('Supabase client not initialized')

  const { data: itinerary } = await supabase
    .from('itineraries')
    .select('*, itinerary_days(*)')
    .eq('id', params.id)
    .single()

  if (!itinerary) notFound()

  return <ItineraryForm itinerary={itinerary} />
}
