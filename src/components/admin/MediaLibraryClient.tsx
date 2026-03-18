'use client'

import { useState, useCallback, useTransition } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { Upload, Loader2, Copy, CheckCheck, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface MediaFile {
  name: string
  id: string
  updated_at: string
  metadata?: { size?: number; mimetype?: string }
  publicUrl: string
}

export default function MediaLibraryClient({ initialFiles }: { initialFiles: MediaFile[] }) {
  const [files, setFiles] = useState<MediaFile[]>(initialFiles)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    setUploadError(null)

    for (const file of acceptedFiles) {
      const ext = file.name.split('.').pop()
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadErr } = await supabase.storage.from('images').upload(path, file)
      if (uploadErr) { setUploadError(uploadErr.message); continue }

      const { data: urlData } = supabase.storage.from('images').getPublicUrl(path)
      const newFile: MediaFile = {
        name: path,
        id: path,
        updated_at: new Date().toISOString(),
        publicUrl: urlData.publicUrl,
      }
      setFiles(prev => [newFile, ...prev])
    }
    setUploading(false)
  }, [supabase])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
    disabled: uploading,
  })

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  async function deleteFile(name: string) {
    setDeleting(name)
    const { error } = await supabase.storage.from('images').remove([name])
    if (!error) setFiles(prev => prev.filter(f => f.name !== name))
    setDeleting(null)
  }

  return (
    <div className="space-y-8">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-sm p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragActive ? 'border-[#C9963A] bg-[#C9963A]/5' : 'border-[#E8E2D9] hover:border-[#C9963A]/50 hover:bg-[#FAF7F2]'
        } ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {uploading
            ? <Loader2 size={28} className="text-[#C9963A] animate-spin" />
            : <Upload size={28} className="text-[#7A7162]" />
          }
          <p className="font-body text-sm text-[#1C1C1C]">
            {uploading ? 'Uploading...' : isDragActive ? 'Drop images here' : 'Drag & drop images, or click to browse'}
          </p>
          <p className="font-body text-xs text-[#7A7162]">PNG, JPG, WebP, GIF</p>
        </div>
      </div>

      {uploadError && (
        <div className="bg-red-50 border border-red-100 text-red-700 font-body text-sm px-4 py-3">{uploadError}</div>
      )}

      {/* Grid */}
      {files.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-2xl text-[#7A7162] italic">No images yet.</p>
          <p className="font-body text-sm text-[#7A7162]/60 mt-2">Upload your first image above.</p>
        </div>
      ) : (
        <>
          <p className="font-body text-[10px] uppercase tracking-widest font-bold text-[#7A7162]">
            {files.length} image{files.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {files.map(file => (
              <div key={file.id} className="group relative bg-[#E8E2D9] aspect-square overflow-hidden">
                <Image
                  src={file.publicUrl}
                  alt={file.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-3">
                  <p className="font-body text-[10px] text-white/70 text-center line-clamp-2 break-all">{file.name}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyUrl(file.publicUrl)}
                      title="Copy URL"
                      className="w-8 h-8 bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      {copied === file.publicUrl
                        ? <CheckCheck size={14} className="text-emerald-400" />
                        : <Copy size={14} className="text-white" />
                      }
                    </button>
                    <button
                      onClick={() => deleteFile(file.name)}
                      disabled={deleting === file.name}
                      title="Delete"
                      className="w-8 h-8 bg-red-500/60 hover:bg-red-500/80 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      {deleting === file.name
                        ? <Loader2 size={14} className="text-white animate-spin" />
                        : <Trash2 size={14} className="text-white" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
