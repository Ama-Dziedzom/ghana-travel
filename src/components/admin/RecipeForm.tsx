'use client'

import { useState, useTransition } from 'react'
import { createRecipe, updateRecipe } from '@/lib/actions/recipes'
import ImageUpload from './ImageUpload'
import type { Recipe } from '@/lib/supabase/types'
import { Loader2, AlertCircle, Save, Globe, Plus, Trash2, GripVertical, ChevronDown, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

const CATEGORIES = [
  { value: 'soups', label: 'Soups' },
  { value: 'rice-dishes', label: 'Rice Dishes' },
  { value: 'street-food', label: 'Street Food' },
  { value: 'drinks', label: 'Drinks' },
  { value: 'snacks', label: 'Snacks' },
]

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
] as const

function slugify(str: string) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-')
}

function FormField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">{label}</label>
      {children}
      {hint && <p className="font-body text-[10px] text-[#7A7162]/60">{hint}</p>}
    </div>
  )
}

// Reusable dynamic ordered list — for both ingredients and instructions
function DynamicList({
  items,
  onChange,
  placeholder,
  numbered = false,
}: {
  items: string[]
  onChange: (items: string[]) => void
  placeholder: string
  numbered?: boolean
}) {
  function addItem() {
    onChange([...items, ''])
  }

  function updateItem(index: number, value: string) {
    onChange(items.map((item, i) => (i === index ? value : item)))
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="flex items-center gap-1.5 mt-2.5 shrink-0">
            <GripVertical size={14} className="text-[#C4BDB4]" />
            {numbered && (
              <span className="font-body text-xs font-bold text-[#C9963A] w-5 text-center">{index + 1}</span>
            )}
          </div>
          <textarea
            rows={numbered ? 2 : 1}
            value={item}
            onChange={e => updateItem(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-white border border-[#E8E2D9] px-3 py-2 font-body text-sm text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] resize-none transition-colors"
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="mt-2 p-1.5 text-[#7A7162] hover:text-red-500 transition-colors shrink-0"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1.5 px-3 py-2 w-full border border-dashed border-[#E8E2D9] text-[#7A7162] hover:border-[#C9963A] hover:text-[#C9963A] transition-colors font-body text-xs"
      >
        <Plus size={12} /> Add {numbered ? 'step' : 'ingredient'}
      </button>
    </div>
  )
}

export default function RecipeForm({ recipe }: { recipe?: Recipe }) {
  const isEdit = !!recipe

  const [title, setTitle]           = useState(recipe?.title ?? '')
  const [slug, setSlug]             = useState(recipe?.slug ?? '')
  const [isSlugModified, setIsSlugModified] = useState(false)
  const [category, setCategory]     = useState(recipe?.category ?? 'soups')
  const [description, setDescription] = useState(recipe?.description ?? '')
  const [coverImage, setCoverImage] = useState(recipe?.cover_image ?? '')
  const [prepTime, setPrepTime]     = useState(recipe?.prep_time ?? 15)
  const [cookTime, setCookTime]     = useState(recipe?.cook_time ?? 30)
  const [servings, setServings]     = useState(recipe?.servings ?? 4)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(recipe?.difficulty ?? 'medium')
  const [tips, setTips]             = useState(recipe?.tips ?? '')
  const [ingredients, setIngredients]   = useState<string[]>(recipe?.ingredients ?? [''])
  const [instructions, setInstructions] = useState<string[]>(recipe?.instructions ?? [''])
  const [error, setError]               = useState<string | null>(null)
  const [isPending, startTransition]    = useTransition()
  const [pendingAction, setPendingAction] = useState<'draft' | 'published' | null>(null)

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!isSlugModified && !isEdit) {
      setSlug(slugify(value))
    }
  }

  function handleSlugChange(value: string) {
    setIsSlugModified(true)
    setSlug(slugify(value))
  }

  function handleResetSlug() {
    setIsSlugModified(false)
    setSlug(slugify(title))
  }

  async function handleSave(status: 'draft' | 'published') {
    setError(null)
    setPendingAction(status)

    const formData = new FormData()
    formData.set('title', title)
    formData.set('slug', slug)
    formData.set('category', category)
    formData.set('description', description)
    formData.set('cover_image', coverImage)
    formData.set('prep_time', String(prepTime))
    formData.set('cook_time', String(cookTime))
    formData.set('servings', String(servings))
    formData.set('difficulty', difficulty)
    formData.set('tips', tips)
    formData.set('ingredients', JSON.stringify(ingredients.filter(Boolean)))
    formData.set('instructions', JSON.stringify(instructions.filter(Boolean)))
    formData.set('status', status)

    startTransition(async () => {
      const result = isEdit
        ? await updateRecipe(recipe.id, formData)
        : await createRecipe(formData)

      if (result?.error) {
        setError(result.error)
        toast.error(`Error: ${result.error}`)
        setPendingAction(null)
      } else {
        toast.success(`Recipe ${status === 'published' ? 'published' : 'saved as draft'}`)
      }
    })
  }

  const isLoading = isPending

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-[#E8E2D9] sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/admin/recipes" className="font-body text-xs text-[#7A7162] hover:text-[#1C1C1C] transition-colors">
            ← Recipes
          </Link>
          <span className="text-[#E8E2D9]">/</span>
          <h1 className="font-display text-xl text-[#1C1C1C]">
            {isEdit ? recipe.title : 'New Recipe'}
          </h1>
          {recipe?.status && (
            <span className={`font-body text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${
              recipe.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-[#E8E2D9] text-[#7A7162]'
            }`}>{recipe.status}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {error && (
            <div className="flex items-center gap-2 text-red-600 font-body text-xs">
              <AlertCircle size={14} /><span>{error}</span>
            </div>
          )}
          <button type="button" onClick={() => handleSave('draft')} disabled={isLoading} id="save-draft-btn"
            className="flex items-center gap-2 px-4 py-2 border border-[#E8E2D9] bg-white font-body text-xs font-bold uppercase tracking-widest text-[#7A7162] hover:bg-[#FAF7F2] transition-colors disabled:opacity-50">
            {isLoading && pendingAction === 'draft' ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Save Draft
          </button>
          <button type="button" onClick={() => handleSave('published')} disabled={isLoading} id="publish-btn"
            className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] text-white font-body text-xs font-bold uppercase tracking-widest hover:bg-[#C9963A] transition-colors disabled:opacity-50">
            {isLoading && pendingAction === 'published' ? <Loader2 size={12} className="animate-spin" /> : <Globe size={12} />}
            {isEdit && recipe.status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_300px]">
        {/* Left: main content */}
        <div className="p-8 space-y-8 border-r border-[#E8E2D9]">
          <FormField label="Title">
            <input type="text" value={title} onChange={e => handleTitleChange(e.target.value)}
              placeholder="Ghanaian Jollof Rice"
              className="w-full bg-white border border-[#E8E2D9] px-4 py-3 font-display text-xl text-[#1C1C1C] placeholder:font-body placeholder:text-sm placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] transition-colors" />
          </FormField>

          <FormField label="Slug" hint="URL-safe identifier — auto-generated from title.">
            <div className="flex items-center group/slug">
              <span className="font-body text-xs text-[#7A7162] bg-[#F5F3EF] border border-r-0 border-[#E8E2D9] px-3 py-3 whitespace-nowrap">/taste/</span>
              <div className="flex-1 relative">
                <input type="text" value={slug} onChange={e => handleSlugChange(e.target.value)} placeholder="ghanaian-jollof-rice"
                  className="w-full bg-white border border-[#E8E2D9] px-4 py-3 pr-10 font-body text-sm text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] transition-colors" />
                {(isSlugModified || (isEdit && slug !== slugify(title))) && (
                  <button
                    type="button"
                    onClick={handleResetSlug}
                    title="Reset to title-based slug"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#C4BDB4] hover:text-[#C9963A] transition-colors"
                  >
                    <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                  </button>
                )}
              </div>
            </div>
          </FormField>

          <FormField label="Description" hint="Brief description shown in recipe cards.">
            <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}
              placeholder="The ultimate party rice — smoky, spicy, and deeply flavourful..."
              className="w-full bg-white border border-[#E8E2D9] px-4 py-3 font-body text-sm text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] resize-none transition-colors" />
          </FormField>

          {/* Ingredients */}
          <FormField label={`Ingredients (${ingredients.filter(Boolean).length})`}>
            <DynamicList
              items={ingredients}
              onChange={setIngredients}
              placeholder="e.g. 2 cups long-grain rice"
            />
          </FormField>

          {/* Instructions */}
          <FormField label={`Steps (${instructions.filter(Boolean).length})`}>
            <DynamicList
              items={instructions}
              onChange={setInstructions}
              placeholder="Describe this step..."
              numbered
            />
          </FormField>

          {/* Tips */}
          <FormField label="Tips & Notes" hint="Optional chef's tips shown at the bottom of the recipe.">
            <textarea rows={3} value={tips} onChange={e => setTips(e.target.value)}
              placeholder="Serve immediately for best results. The key to perfect jollof..."
              className="w-full bg-white border border-[#E8E2D9] px-4 py-3 font-body text-sm text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] resize-none transition-colors" />
          </FormField>
        </div>

        {/* Right: settings */}
        <div className="p-6 bg-[#FAFAF9] space-y-6">
          <FormField label="Category">
            <div className="relative">
              <select value={category} onChange={e => setCategory(e.target.value as typeof category)}
                className="w-full appearance-none bg-white border border-[#E8E2D9] px-4 py-3 pr-8 font-body text-sm text-[#1C1C1C] focus:outline-none focus:border-[#C9963A] transition-colors">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7162] pointer-events-none" />
            </div>
          </FormField>

          <FormField label="Difficulty">
            <div className="flex gap-2">
              {DIFFICULTIES.map(d => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDifficulty(d.value)}
                  className={`flex-1 py-2 font-body text-xs font-bold uppercase tracking-widest border transition-colors ${
                    difficulty === d.value
                      ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                      : 'bg-white text-[#7A7162] border-[#E8E2D9] hover:border-[#1C1C1C]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </FormField>

          <div className="grid grid-cols-3 gap-3">
            <FormField label="Prep (min)">
              <input type="number" min={0} value={prepTime} onChange={e => setPrepTime(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-[#E8E2D9] px-3 py-2.5 font-body text-sm text-[#1C1C1C] focus:outline-none focus:border-[#C9963A] transition-colors text-center" />
            </FormField>
            <FormField label="Cook (min)">
              <input type="number" min={0} value={cookTime} onChange={e => setCookTime(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-[#E8E2D9] px-3 py-2.5 font-body text-sm text-[#1C1C1C] focus:outline-none focus:border-[#C9963A] transition-colors text-center" />
            </FormField>
            <FormField label="Serves">
              <input type="number" min={1} value={servings} onChange={e => setServings(parseInt(e.target.value) || 1)}
                className="w-full bg-white border border-[#E8E2D9] px-3 py-2.5 font-body text-sm text-[#1C1C1C] focus:outline-none focus:border-[#C9963A] transition-colors text-center" />
            </FormField>
          </div>

          <ImageUpload value={coverImage} onChange={setCoverImage} label="Cover Image" />
        </div>
      </div>
    </div>
  )
}
