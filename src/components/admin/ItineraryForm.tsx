'use client'

import { useState, useTransition } from 'react'
import { createItinerary, updateItinerary } from '@/lib/actions/itineraries'
import ImageUpload from './ImageUpload'
import type { Itinerary, ItineraryDay } from '@/lib/supabase/types'
import {
  Loader2, AlertCircle, Save, Globe,
  Plus, Trash2, ChevronDown, ChevronUp, GripVertical, RefreshCw,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

interface DayStop {
  morning: string
  afternoon: string
  evening: string
  eat: string
  stay: string
}

interface DayEntry {
  day_number: number
  title: string
  stops: DayStop
}

interface ItineraryWithDays extends Itinerary {
  itinerary_days?: ItineraryDay[]
}

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

function DayCard({
  day,
  index,
  onChange,
  onRemove,
}: {
  day: DayEntry
  index: number
  onChange: (updated: DayEntry) => void
  onRemove: () => void
}) {
  const [open, setOpen] = useState(true)

  function updateStop(key: keyof DayStop, value: string) {
    onChange({ ...day, stops: { ...day.stops, [key]: value } })
  }

  return (
    <div className="border border-[#E8E2D9] bg-white">
      {/* Day header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E8E2D9] bg-[#FAFAF9]">
        <GripVertical size={14} className="text-[#C4BDB4] shrink-0" />
        <span className="font-body text-[10px] uppercase tracking-widest font-bold text-[#C9963A] shrink-0">
          Day {day.day_number}
        </span>
        <input
          type="text"
          value={day.title}
          onChange={e => onChange({ ...day, title: e.target.value })}
          placeholder={`Day ${day.day_number} title...`}
          className="flex-1 bg-transparent border-0 font-body text-sm text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none"
        />
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="p-1 text-[#7A7162] hover:text-[#1C1C1C] transition-colors"
          >
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 text-[#7A7162] hover:text-red-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {open && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['morning', 'afternoon', 'evening'] as const).map(slot => (
            <div key={slot} className="space-y-1">
              <label className="font-body text-[10px] uppercase tracking-widest font-bold text-[#7A7162] capitalize">{slot}</label>
              <textarea
                rows={2}
                value={day.stops[slot]}
                onChange={e => updateStop(slot, e.target.value)}
                placeholder={`${slot.charAt(0).toUpperCase() + slot.slice(1)} activities...`}
                className="w-full bg-[#FAFAF9] border border-[#E8E2D9] px-3 py-2 font-body text-xs text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] resize-none transition-colors"
              />
            </div>
          ))}
          <div className="space-y-1">
            <label className="font-body text-[10px] uppercase tracking-widest font-bold text-[#7A7162]">🍽 Where to Eat</label>
            <textarea
              rows={2}
              value={day.stops.eat}
              onChange={e => updateStop('eat', e.target.value)}
              placeholder="Restaurant or local spot..."
              className="w-full bg-[#FAFAF9] border border-[#E8E2D9] px-3 py-2 font-body text-xs text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] resize-none transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="font-body text-[10px] uppercase tracking-widest font-bold text-[#7A7162]">🏨 Where to Stay</label>
            <textarea
              rows={2}
              value={day.stops.stay}
              onChange={e => updateStop('stay', e.target.value)}
              placeholder="Hotel, guesthouse, or area..."
              className="w-full bg-[#FAFAF9] border border-[#E8E2D9] px-3 py-2 font-body text-xs text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] resize-none transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function ItineraryForm({ itinerary }: { itinerary?: ItineraryWithDays }) {
  const isEdit = !!itinerary

  const [title, setTitle]             = useState(itinerary?.title ?? '')
  const [slug, setSlug]               = useState(itinerary?.slug ?? '')
  const [isSlugModified, setIsSlugModified] = useState(false)
  const [summary, setSummary]         = useState(itinerary?.summary ?? '')
  const [coverImage, setCoverImage]   = useState(itinerary?.cover_image ?? '')
  const [mapEmbedUrl, setMapEmbedUrl] = useState(itinerary?.map_embed_url ?? '')
  const [duration, setDuration]       = useState(itinerary?.duration ?? 3)
  const [bestSeason, setBestSeason]   = useState(itinerary?.best_season ?? '')
  const [regions, setRegions]         = useState((itinerary?.regions ?? []).join(', '))
  const [vibeTags, setVibeTags]       = useState((itinerary?.vibe_tags ?? []).join(', '))
  const [error, setError]             = useState<string | null>(null)
  const [isPending, startTransition]  = useTransition()
  const [pendingAction, setPendingAction] = useState<'draft' | 'published' | null>(null)

  // Initialise days from existing data
  const [days, setDays] = useState<DayEntry[]>(() => {
    if (itinerary?.itinerary_days && itinerary.itinerary_days.length > 0) {
      return itinerary.itinerary_days
        .sort((a, b) => a.day_number - b.day_number)
        .map(d => ({
          day_number: d.day_number,
          title: d.title ?? '',
          stops: {
            morning:   (d.stops as Record<string, string>)?.morning   ?? '',
            afternoon: (d.stops as Record<string, string>)?.afternoon ?? '',
            evening:   (d.stops as Record<string, string>)?.evening   ?? '',
            eat:       (d.stops as Record<string, string>)?.eat       ?? '',
            stay:      (d.stops as Record<string, string>)?.stay      ?? '',
          },
        }))
    }
    return []
  })

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

  function addDay() {
    const nextNum = days.length > 0 ? Math.max(...days.map(d => d.day_number)) + 1 : 1
    setDays(prev => [
      ...prev,
      { day_number: nextNum, title: '', stops: { morning: '', afternoon: '', evening: '', eat: '', stay: '' } },
    ])
    setDuration(nextNum)
  }

  function removeDay(index: number) {
    setDays(prev => {
      const updated = prev.filter((_, i) => i !== index)
      // Renumber days sequentially
      return updated.map((d, i) => ({ ...d, day_number: i + 1 }))
    })
  }

  function updateDay(index: number, updated: DayEntry) {
    setDays(prev => prev.map((d, i) => (i === index ? updated : d)))
  }

  async function handleSave(status: 'draft' | 'published') {
    setError(null)
    setPendingAction(status)

    const formData = new FormData()
    formData.set('title', title)
    formData.set('slug', slug)
    formData.set('summary', summary)
    formData.set('cover_image', coverImage)
    formData.set('map_embed_url', mapEmbedUrl)
    formData.set('duration', String(duration))
    formData.set('best_season', bestSeason)
    formData.set('regions', regions)
    formData.set('vibe_tags', vibeTags)
    formData.set('days', JSON.stringify(days))
    formData.set('status', status)

    startTransition(async () => {
      const result = isEdit
        ? await updateItinerary(itinerary.id, formData)
        : await createItinerary(formData)

      if (result?.error) {
        setError(result.error)
        toast.error(`Error: ${result.error}`)
        setPendingAction(null)
      } else {
        toast.success(`Itinerary ${status === 'published' ? 'published' : 'saved as draft'}`)
      }
    })
  }

  const isLoading = isPending

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-[#E8E2D9] sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/admin/itineraries" className="font-body text-xs text-[#7A7162] hover:text-[#1C1C1C] transition-colors">
            ← Itineraries
          </Link>
          <span className="text-[#E8E2D9]">/</span>
          <h1 className="font-display text-xl text-[#1C1C1C]">
            {isEdit ? itinerary.title : 'New Itinerary'}
          </h1>
          {itinerary?.status && (
            <span className={`font-body text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${
              itinerary.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-[#E8E2D9] text-[#7A7162]'
            }`}>{itinerary.status}</span>
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
            {isEdit && itinerary.status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_300px]">
        {/* Left: main content */}
        <div className="p-8 space-y-6 border-r border-[#E8E2D9]">
          <FormField label="Title">
            <input type="text" value={title} onChange={e => handleTitleChange(e.target.value)}
              placeholder="3 Days in Accra: The Heart of Ghana"
              className="w-full bg-white border border-[#E8E2D9] px-4 py-3 font-display text-xl text-[#1C1C1C] placeholder:font-body placeholder:text-sm placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] transition-colors" />
          </FormField>

          <FormField label="Slug" hint="URL-safe identifier — auto-generated from title.">
            <div className="flex items-center group/slug">
              <span className="font-body text-xs text-[#7A7162] bg-[#F5F3EF] border border-r-0 border-[#E8E2D9] px-3 py-3 whitespace-nowrap">/itineraries/</span>
              <div className="flex-1 relative">
                <input type="text" value={slug} onChange={e => handleSlugChange(e.target.value)} placeholder="3-days-in-accra"
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

          <FormField label="Summary" hint="Brief description shown in itinerary cards.">
            <textarea rows={4} value={summary} onChange={e => setSummary(e.target.value)}
              placeholder="A journey through Ghana's coastal history and lush tropical rainforests..."
              className="w-full bg-white border border-[#E8E2D9] px-4 py-3 font-body text-sm text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] resize-none transition-colors" />
          </FormField>

          {/* Days section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">
                Day-by-Day Itinerary ({days.length} day{days.length !== 1 ? 's' : ''})
              </label>
              <button type="button" onClick={addDay} id="add-day-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C9963A]/10 text-[#C9963A] font-body text-xs font-bold uppercase tracking-widest hover:bg-[#C9963A]/20 transition-colors">
                <Plus size={12} /> Add Day
              </button>
            </div>

            {days.length === 0 ? (
              <div className="border-2 border-dashed border-[#E8E2D9] py-10 text-center">
                <p className="font-body text-sm text-[#7A7162]">No days added yet.</p>
                <button type="button" onClick={addDay}
                  className="mt-2 font-body text-xs text-[#C9963A] hover:underline">
                  Add your first day →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {days.map((day, index) => (
                  <DayCard
                    key={day.day_number}
                    day={day}
                    index={index}
                    onChange={updated => updateDay(index, updated)}
                    onRemove={() => removeDay(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: settings */}
        <div className="p-6 bg-[#FAFAF9] space-y-6">
          <FormField label="Duration (days)">
            <input type="number" min={1} max={30} value={duration} onChange={e => setDuration(parseInt(e.target.value) || 1)}
              className="w-full bg-white border border-[#E8E2D9] px-4 py-3 font-body text-sm text-[#1C1C1C] focus:outline-none focus:border-[#C9963A] transition-colors" />
          </FormField>

          <FormField label="Best Season" hint="e.g. Dry season (Nov – March)">
            <input type="text" value={bestSeason} onChange={e => setBestSeason(e.target.value)}
              placeholder="Dry season (Nov – March)"
              className="w-full bg-white border border-[#E8E2D9] px-4 py-3 font-body text-sm text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] transition-colors" />
          </FormField>

          <FormField label="Regions" hint="Comma-separated, e.g. Greater Accra, Central Region">
            <input type="text" value={regions} onChange={e => setRegions(e.target.value)}
              placeholder="Greater Accra, Central Region"
              className="w-full bg-white border border-[#E8E2D9] px-4 py-3 font-body text-sm text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] transition-colors" />
          </FormField>

          <FormField label="Vibe Tags" hint="Comma-separated, e.g. History, Beaches, Nature">
            <input type="text" value={vibeTags} onChange={e => setVibeTags(e.target.value)}
              placeholder="History, Beaches, Nature"
              className="w-full bg-white border border-[#E8E2D9] px-4 py-3 font-body text-sm text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] transition-colors" />
          </FormField>

          <FormField label="Map Embed URL" hint="Google Maps embed URL (optional)">
            <input type="text" value={mapEmbedUrl} onChange={e => setMapEmbedUrl(e.target.value)}
              placeholder="https://www.google.com/maps/embed?..."
              className="w-full bg-white border border-[#E8E2D9] px-4 py-3 font-body text-xs text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] transition-colors" />
          </FormField>

          <ImageUpload value={coverImage} onChange={setCoverImage} label="Cover Image" />
        </div>
      </div>
    </div>
  )
}
