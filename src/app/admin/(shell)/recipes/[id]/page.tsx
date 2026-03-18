import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import RecipeForm from '@/components/admin/RecipeForm'

interface Props { params: { id: string } }

export default async function EditRecipePage({ params }: Props) {
  const supabase = createAdminClient()

  const { data: recipe } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!recipe) notFound()

  return <RecipeForm recipe={recipe} />
}
