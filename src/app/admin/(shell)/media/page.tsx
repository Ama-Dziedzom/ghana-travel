import { createAdminClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import MediaLibraryClient from '@/components/admin/MediaLibraryClient'

export const dynamic = 'force-dynamic'

export default async function AdminMediaPage() {
  const supabase = createAdminClient()

  // List all files from Supabase Storage 'images' bucket (inside the 'uploads' folder)
  const { data: fileList } = await supabase.storage.from('images').list('uploads', {
    limit: 200,
    offset: 0,
    sortBy: { column: 'updated_at', order: 'desc' },
  })

  const files = (fileList ?? [])
    .filter(f => f.name !== '.emptyFolderPlaceholder' && f.metadata && (f.metadata as any).mimetype)
    .map(f => ({
      name: f.name,
      id: f.id ?? f.name,
      updated_at: f.updated_at ?? '',
      metadata: f.metadata as { size?: number; mimetype?: string } | undefined,
      publicUrl: supabase.storage.from('images').getPublicUrl(`uploads/${f.name}`).data.publicUrl,
    }))

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Media Library"
        subtitle="All images uploaded to Supabase Storage"
      />
      <main className="flex-1 p-8">
        <MediaLibraryClient initialFiles={files} />
      </main>
    </div>
  )
}
