import { createAdminClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import Link from 'next/link'
import RecipeDeleteButton from '@/components/admin/RecipeDeleteButton'
import { Plus, Pencil, Eye, Clock, Users } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const STATUS_STYLES = {
  published: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  draft:     'bg-[#E8E2D9] text-[#7A7162] border-[#E2DCD3]',
} as const

const DIFFICULTY_COLOURS = {
  easy:   'text-emerald-600 bg-emerald-50',
  medium: 'text-amber-600 bg-amber-50',
  hard:   'text-red-600 bg-red-50',
} as const

export default async function AdminRecipesPage() {
  const supabase = createAdminClient()

  const { data: recipes } = await supabase
    .from('recipes')
    .select('id, title, slug, category, difficulty, prep_time, cook_time, servings, status, updated_at')
    .order('updated_at', { ascending: false })

  const rows = recipes ?? []

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Recipes"
        subtitle={`${rows.length} recipe${rows.length !== 1 ? 's' : ''} total`}
      />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 text-xs font-body">
            <span className="text-[#7A7162]">{rows.filter(r => r.status === 'published').length} published</span>
            <span className="text-[#7A7162]">·</span>
            <span className="text-[#7A7162]">{rows.filter(r => r.status === 'draft').length} drafts</span>
          </div>
          <Link href="/admin/recipes/new" id="new-recipe-btn"
            className="flex items-center gap-2 bg-[#1C1C1C] text-white font-body text-xs font-bold uppercase tracking-widest px-5 py-3 hover:bg-[#C9963A] transition-colors">
            <Plus size={14} /> New Recipe
          </Link>
        </div>

        <div className="bg-white border border-[#E8E2D9] overflow-hidden">
          {rows.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-2xl text-[#7A7162] italic mb-4">No recipes yet.</p>
              <Link href="/admin/recipes/new" className="font-body text-sm text-[#C9963A] hover:underline">
                Add your first recipe →
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E2D9] bg-[#FAFAF9]">
                  <th className="px-6 py-3 text-left font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">Title</th>
                  <th className="px-4 py-3 text-left font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162] hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 text-left font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162] hidden lg:table-cell">Details</th>
                  <th className="px-4 py-3 text-left font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">Status</th>
                  <th className="px-4 py-3 text-right font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9]">
                {rows.map(row => (
                  <tr key={row.id} className="hover:bg-[#FAF7F2] transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-body text-sm font-semibold text-[#1C1C1C] group-hover:text-[#C9963A] transition-colors">{row.title}</p>
                      <p className="font-body text-[10px] text-[#7A7162] mt-0.5">/taste/{row.slug}</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <span className="font-body text-xs text-[#7A7162] capitalize">{row.category?.replace('-', ' ')}</span>
                        {row.difficulty && (
                          <div>
                            <span className={`font-body text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded ${DIFFICULTY_COLOURS[row.difficulty as keyof typeof DIFFICULTY_COLOURS] ?? 'text-[#7A7162]'}`}>
                              {row.difficulty}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-3 text-[#7A7162]">
                        {(row.prep_time || row.cook_time) && (
                          <span className="flex items-center gap-1 font-body text-xs">
                            <Clock size={11} />
                            {(row.prep_time ?? 0) + (row.cook_time ?? 0)} min
                          </span>
                        )}
                        {row.servings && (
                          <span className="flex items-center gap-1 font-body text-xs">
                            <Users size={11} />
                            {row.servings}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`font-body text-[9px] uppercase tracking-widest font-bold px-2 py-1 border rounded-full ${STATUS_STYLES[row.status as keyof typeof STATUS_STYLES]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {row.status === 'published' && (
                          <Link href={`/taste/${row.slug}`} target="_blank"
                            className="p-1.5 text-[#7A7162] hover:text-[#1C1C1C] transition-colors" title="View on site">
                            <Eye size={14} />
                          </Link>
                        )}
                        <Link href={`/admin/recipes/${row.id}`} className="p-1.5 text-[#7A7162] hover:text-[#C9963A] transition-colors" title="Edit">
                          <Pencil size={14} />
                        </Link>
                        <RecipeDeleteButton id={row.id} title={row.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
