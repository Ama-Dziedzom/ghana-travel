'use client'

import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2, ImageIcon, Images, CheckCircle2, Link as LinkIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

interface StorageFile {
  name: string
  publicUrl: string
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function ImagePickerModal({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void
  onClose: () => void
}) {
  const [library, setLibrary] = useState<StorageFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [hovered, setHovered] = useState<string | null>(null)
  const supabase = createClient()

  // Load library on mount
  useEffect(() => {
    async function loadLibrary() {
      setLoading(true)
      // List files inside the 'uploads' folder where images are actually stored
      const { data } = await supabase.storage.from('images').list('uploads', {
        limit: 200,
        sortBy: { column: 'updated_at', order: 'desc' },
      })
      const files = (data ?? [])
        .filter(f => f.name !== '.emptyFolderPlaceholder' && f.metadata && (f.metadata as any).mimetype)
        .map(f => ({
          name: f.name,
          publicUrl: supabase.storage.from('images').getPublicUrl(`uploads/${f.name}`).data.publicUrl,
        }))
      setLibrary(files)
      setLoading(false)
    }
    loadLibrary()
  }, [supabase])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)

    const ext = file.name.split('.').pop()
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage.from('images').upload(path, file, { upsert: false })
    if (error) {
      setUploadError(error.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('images').getPublicUrl(path)
    // Prepend to library and auto-select
    setLibrary(prev => [{ name: path, publicUrl: data.publicUrl }, ...prev])
    setUploading(false)
    onSelect(data.publicUrl) // auto-select + close
  }, [supabase, onSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
    maxFiles: 1,
    disabled: uploading,
  })

  function handleUrlSubmit() {
    const trimmed = urlInput.trim()
    if (trimmed) onSelect(trimmed)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-[5vh] bottom-[5vh] md:inset-x-[10%] lg:inset-x-[15%] z-50 flex flex-col bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D9] shrink-0">
          <div className="flex items-center gap-2">
            <Images size={16} className="text-[#C9963A]" />
            <h2 className="font-body text-sm font-bold uppercase tracking-widest text-[#1C1C1C]">Choose Image</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7A7162] hover:text-[#1C1C1C] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Upload zone */}
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162] mb-3">
              Upload New File
            </p>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? 'border-[#C9963A] bg-[#C9963A]/5'
                  : 'border-[#E8E2D9] hover:border-[#C9963A]/60 hover:bg-[#FAF7F2]'
              } ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="flex items-center justify-center gap-3">
                {uploading
                  ? <Loader2 size={18} className="text-[#C9963A] animate-spin" />
                  : <Upload size={18} className="text-[#7A7162]" />
                }
                <p className="font-body text-sm text-[#1C1C1C]">
                  {uploading
                    ? 'Uploading…'
                    : isDragActive
                    ? 'Drop image here'
                    : 'Drag & drop a file, or click to browse from your computer'}
                </p>
              </div>
              {uploadError && (
                <p className="font-body text-xs text-red-500 mt-2">{uploadError}</p>
              )}
            </div>
          </div>

          {/* Library grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">
                Media Library
              </p>
              {!loading && (
                <span className="font-body text-[10px] text-[#7A7162]">{library.length} image{library.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={24} className="text-[#C9963A] animate-spin" />
              </div>
            ) : library.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-[#E8E2D9]">
                <p className="font-body text-sm text-[#7A7162]">No images in library yet.</p>
                <p className="font-body text-xs text-[#7A7162]/60 mt-1">Upload one above to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {library.map(file => (
                  <button
                    key={file.name}
                    type="button"
                    onClick={() => onSelect(file.publicUrl)}
                    onMouseEnter={() => setHovered(file.name)}
                    onMouseLeave={() => setHovered(null)}
                    className="relative aspect-square bg-[#E8E2D9] overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[#C9963A]"
                    title={file.name}
                  >
                    <Image
                      src={file.publicUrl}
                      alt={file.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 33vw, 20vw"
                    />
                    {/* Hover select overlay */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ${hovered === file.name ? 'opacity-100 bg-[#C9963A]/40' : 'opacity-0'}`}>
                      <CheckCircle2 size={28} className="text-white drop-shadow-md" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* URL fallback */}
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162] mb-3">
              <LinkIcon size={10} className="inline mr-1" />
              Paste an External URL
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
                placeholder="https://example.com/image.jpg"
                className="flex-1 bg-white border border-[#E8E2D9] px-3 py-2.5 font-body text-xs text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] transition-colors"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                className="px-4 py-2.5 bg-[#1C1C1C] text-white font-body text-xs font-bold uppercase tracking-widest hover:bg-[#C9963A] transition-colors disabled:opacity-40"
              >
                Use
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ImageUpload({ value, onChange, label = 'Cover Image' }: ImageUploadProps) {
  const [modalOpen, setModalOpen] = useState(false)

  function handleSelect(url: string) {
    onChange(url)
    setModalOpen(false)
  }

  return (
    <div className="space-y-2">
      <label className="font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">
        {label}
      </label>

      {value ? (
        /* Preview */
        <div className="relative group">
          <div className="relative aspect-video w-full overflow-hidden bg-[#E8E2D9]">
            <Image src={value} alt="Cover" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-3 py-1.5 bg-white font-body text-[10px] font-bold uppercase tracking-widest text-[#1C1C1C] hover:bg-[#C9963A] hover:text-white transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-white hover:bg-red-50 transition-colors"
              title="Remove image"
            >
              <X size={12} className="text-red-500" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty state — single CTA */
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="w-full border-2 border-dashed border-[#E8E2D9] hover:border-[#C9963A]/60 hover:bg-[#FAF7F2] py-8 flex flex-col items-center gap-2 transition-all duration-200 group"
        >
          <div className="w-10 h-10 bg-[#C9963A]/10 group-hover:bg-[#C9963A]/20 flex items-center justify-center transition-colors">
            <ImageIcon size={18} className="text-[#C9963A]" />
          </div>
          <p className="font-body text-sm text-[#1C1C1C]">Choose Image</p>
          <p className="font-body text-[10px] text-[#7A7162]">Upload new · Pick from library · Paste URL</p>
        </button>
      )}

      {modalOpen && (
        <ImagePickerModal onSelect={handleSelect} onClose={() => setModalOpen(false)} />
      )}
    </div>
  )
}
