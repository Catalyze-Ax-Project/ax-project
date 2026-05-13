import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE = 'ax_session'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/login' || pathname.startsWith('/login/')) {
    return NextResponse.next()
  }

  const session = req.cookies.get(SESSION_COOKIE)?.value
  if (session) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|logo.png).*)'],
}
