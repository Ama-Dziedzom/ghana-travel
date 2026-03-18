'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUpload({ value, onChange, label = 'Cover image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setUploading(true)
      setError(null)

      const ext = file.name.split('.').pop()
      const fileName = `articles/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, { upsert: false })

      if (uploadError) {
        setError(uploadError.message)
        setUploading(false)
        return
      }

      const { data } = supabase.storage.from('images').getPublicUrl(fileName)
      onChange(data.publicUrl)
      setUploading(false)
    },
    [supabase, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    disabled: uploading,
  })

  return (
    <div className="space-y-2">
      <label className="font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">
        {label}
      </label>

      {value ? (
        <div className="relative group">
          <div className="relative aspect-video w-full overflow-hidden bg-[#E8E2D9]">
            <Image src={value} alt="Cover" fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-red-50 border border-[#E8E2D9] hover:border-red-200 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
          >
            <X size={14} className="text-red-500" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-all duration-200
            ${isDragActive
              ? 'border-[#C9963A] bg-[#C9963A]/5'
              : 'border-[#E8E2D9] hover:border-[#C9963A]/50 hover:bg-[#FAF7F2]'
            }
            ${uploading ? 'opacity-60 pointer-events-none' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <Loader2 size={24} className="text-[#C9963A] animate-spin" />
            ) : (
              <div className="w-10 h-10 bg-[#C9963A]/10 flex items-center justify-center">
                {isDragActive ? (
                  <Upload size={18} className="text-[#C9963A]" />
                ) : (
                  <ImageIcon size={18} className="text-[#C9963A]" />
                )}
              </div>
            )}
            <div>
              <p className="font-body text-sm text-[#1C1C1C]">
                {uploading
                  ? 'Uploading...'
                  : isDragActive
                  ? 'Drop the image here'
                  : 'Drag & drop or click to browse'}
              </p>
              <p className="font-body text-xs text-[#7A7162] mt-1">PNG, JPG, WebP — max 5MB</p>
            </div>
          </div>
        </div>
      )}

      {/* Manual URL input */}
      <input
        type="text"
        placeholder="Or paste an image URL..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-[#E8E2D9] px-3 py-2 font-body text-xs text-[#1C1C1C] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#C9963A] transition-colors"
      />

      {error && <p className="font-body text-xs text-red-500">{error}</p>}
    </div>
  )
}
