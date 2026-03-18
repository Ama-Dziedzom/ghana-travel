// This layout wraps ALL /admin/* routes including /admin/login.
// It intentionally has NO auth check here — the login page must be
// able to render freely. Auth protection lives in (shell)/layout.tsx
// which only wraps the authenticated dashboard pages.

export const metadata = {
  title: 'Admin — Ghana Trails CMS',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
