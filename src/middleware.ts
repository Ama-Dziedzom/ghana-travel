import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Only run auth logic on admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const isLoginPage = pathname === '/admin/login'

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase error — treat as unauthenticated
  }

  // /admin/login: let it through always (no redirect loop possible)
  if (isLoginPage) {
    return supabaseResponse
  }

  // All other /admin/* routes: require authentication
  if (!user) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  // Only run middleware on /admin routes — keeps it fast and avoids
  // interfering with public pages or static assets
  matcher: ['/admin', '/admin/:path*'],
}

