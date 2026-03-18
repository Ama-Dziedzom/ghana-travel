'use client'

import { useState, useTransition } from 'react'
import dynamic from 'next/dynamic'
import { createArticle, updateArticle } from '@/lib/actions/articles'
import ImageUpload from './ImageUpload'
import type { Article } from '@/lib/supabase/types'
import { Loader2, AlertCircle, Save, Globe, ChevronDown } from 'lucide-react'
import Link from 'next/link'

// Dynamically import the MDX editor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const CATEGORIES = [
  { value: 'culture', label: 'Culture' },
  { value: 'history', label: 'History' },
  { value: 'festivals', label: 'Festivals' },
  { value: 'neighbourhoods', label: 'Neighbourhoods' },
]

interface ArticleFormProps {
  article?: Article
}

function slugify(str: string) {
  return str
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
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

export default function ArticleForm({ article }: ArticleFormProps) {
  const isEdit = !!article

  const [title, setTitle]           = useState(article?.title ?? '')
  const [slug, setSlug]             = useState(article?.slug ?? '')
  const [category, setCategory]     = useState(article?.category ?? 'culture')
  const [excerpt, setExcerpt]       = useState(article?.excerpt ?? '')
  const [coverImage, setCoverImage] = useState(article?.cover_image ?? '')
  const [body, setBody]             = useState(article?.body_mdx ?? '')
  const [readTime, setReadTime]     = useState(article?.read_time ?? 5)
  const [error, setError]           = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [pendingAction, setPendingAction] = useState<'draft' | 'published' | null>(null)

  function handleTitleChange(value: string) {
    setTitle(value)
    // Auto-generate slug only for new articles
    if (!isEdit) setSlug(slugify(value))
  }

  async function handleSave(status: 'draft' | 'published') {
    setError(null)
    setPendingAction(status)

    const formData = new FormData()
    formData.set('title', title)
    formData.set('slug', slug)
    formData.set('category', category)
    formData.set('excerpt', excerpt)
    formData.set('cover_image', coverImage)
    formData.set('body_mdx', body)
    formData.set('read_time', String(readTime))
    formData.set('status', status)

    startTransition(async () => {
      const result = isEdit
        ? await updateArticle(article.id, formData)
        : await createArticle(formData)

      if (result?.error) {
        setError(result.error)
        setPendingAction(null)
      }
    })
  }

  const isLoading = isPending

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-[#E8E2D9] sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/articles"
            className="font-body text-xs text-[#7A7162] hover:text-[#1C1C1C] transition-colors"
          >
            ← Articles
          </Link>
          <span className="text-[#E8E2D9]">/</span>
          <h1 className="font-display text-xl text-[#1C1C1C]">
            {isEdit ? article.title : 'New Article'}
          </h1>
          {article?.status && (
            <span className={`font-body text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${
              article.status === 'published'
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-[#E8E2D9] text-[#7A7162]'
            }`}>
              {article.status}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {error && (
            <div className="flex items-center gap-2 text-red-600 font-body text-xs">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={isLoading}
            id="save-draft-btn"
            className="flex items-center gap-2 px-4 py-2 border border-[#E8E2D9] bg-white font-body text-xs font-bold uppercase tracking-widest text-[#7A7162] hover:bg-[#FAF7F2] transition-colors disabled:opacity-50"
          >
            {isLoading && pendingAction === 'draft'
              ? <Loader2 size={12} className="animate-spin" />
              : <Save size={12} />
            }
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={isLoading}
            id="publish-btn"
            className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] text-white font-body text-xs font-bold uppercase tracking-widest hover:bg-[#C9963A] transition-colors disabled:opacity-50"
          >
            {isLoading && pendingAction === 'published'
              ? <Loader2 size={12} className="animate-spin" />
              : <Globe size={12} />
            }
            {isEdit && article.status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px]">
        {/* Left: MDX Editor */}
        <div className="p-8 space-y-6 border-r border-[#E8E2D9]">
          <FormField label="Title" hint="The article headline shown to readers.">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="The Art of Kente: More Than Just a Fabric"
              className="w-full bg-white border border-[#E8E2D9] px-4 py-3 font-display text-xl text-[#1C1C1C] placeholder:text-[#C4BDB4] placeholder:font-body placeholder:text-sm focus:outline-none focus:border-[#C9963A] transition-colors"
            />
          </FormField>

          <FormField label="Slug" hint="URL-safe identifier — auto-generated from title.">
            <div className="flex items-center">
              <span className="font-body text-xs text-[#7A7162] bg-[#F5F3EF] border border-r-0 border-[#E8E2D9] px-3 py-3 whitespace-nowrap">
                /explore/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="the-art-of-kente"
                className="flex-1 bg-white border border-[#E8E2D9] px-4 py-3 font-body text-sm text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] transition-colors"
              />
            </div>
          </FormField>

          <FormField label="Excerpt" hint="Short description shown in article cards and SEO.">
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Discover the deep symbolism woven into every thread of Ghana's most iconic textile..."
              className="w-full bg-white border border-[#E8E2D9] px-4 py-3 font-body text-sm text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] transition-colors resize-none"
            />
          </FormField>

          {/* MDX Body */}
          <FormField label="Content (MDX)">
            <div data-color-mode="light" className="min-h-[400px]">
              <MDEditor
                value={body}
                onChange={(val) => setBody(val ?? '')}
                height={450}
                preview="edit"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>
          </FormField>
        </div>

        {/* Right: Settings panel */}
        <div className="p-6 bg-[#FAFAF9] space-y-6">
          <FormField label="Category">
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'culture' | 'history' | 'festivals' | 'neighbourhoods')}
                className="w-full appearance-none bg-white border border-[#E8E2D9] px-4 py-3 pr-8 font-body text-sm text-[#1C1C1C] focus:outline-none focus:border-[#C9963A] transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7162] pointer-events-none" />
            </div>
          </FormField>

          <FormField label="Est. Read Time" hint="Minutes to read.">
            <input
              type="number"
              min={1}
              max={60}
              value={readTime}
              onChange={(e) => setReadTime(parseInt(e.target.value) || 5)}
              className="w-full bg-white border border-[#E8E2D9] px-4 py-3 font-body text-sm text-[#1C1C1C] focus:outline-none focus:border-[#C9963A] transition-colors"
            />
          </FormField>

          <ImageUpload
            value={coverImage}
            onChange={setCoverImage}
            label="Cover Image"
          />
        </div>
      </div>
    </div>
  )
}
