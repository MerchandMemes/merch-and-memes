import { NextRequest, NextResponse } from 'next/server'

async function expectedToken(): Promise<string> {
  const pw = process.env.ADMIN_PASSWORD ?? ''
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw))
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return out === 0
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Login page and its endpoint stay reachable
  if (pathname === '/admin/login' || pathname === '/api/admin-login') {
    return NextResponse.next()
  }

  // Fail open if the variable is missing, rather than locking you out
  if (!process.env.ADMIN_PASSWORD) {
    console.warn('ADMIN_PASSWORD not set — admin routes are unprotected')
    return NextResponse.next()
  }

  const cookie = req.cookies.get('admin_session')?.value ?? ''
  const ok = cookie !== '' && safeEqual(cookie, await expectedToken())
  if (ok) return NextResponse.next()

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = req.nextUrl.clone()
  url.pathname = '/admin/login'
  url.search = `?next=${encodeURIComponent(pathname)}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin/:path*', '/api/moderate', '/api/moderate-comment'],
}
