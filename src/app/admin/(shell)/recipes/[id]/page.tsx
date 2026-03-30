import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import RecipeForm from '@/components/admin/RecipeForm'

export const dynamic = 'force-dynamic'

interface Props { params: { id: string } }

export default async function EditRecipePage({ params }: Props) {
  const supabase = createAdminClient()
  if (!supabase) throw new Error('Supabase client not initialized')

  const { data: recipe } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!recipe) notFound()

  return <RecipeForm recipe={recipe} />
}
