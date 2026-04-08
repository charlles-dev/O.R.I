import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyHmacSignature } from '@/lib/security'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api/cron/')) {
    const cronSecret = process.env.CRON_SECRET
    const signature = request.headers.get('x-cron-signature')

    if (!cronSecret || !signature) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = request.method === 'GET' ? pathname : await request.text()
    if (!verifyHmacSignature(cronSecret, signature, payload)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  if (pathname.startsWith('/api/webhook/')) {
    const origin = request.headers.get('origin') || ''
    if (!origin.includes('zoho') && !origin.includes('glpi')) {
      const signature = request.headers.get('x-signature')
      if (!signature) {
        const isZoho = pathname.includes('zoho')
        if (isZoho) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }
  }

  if (pathname.startsWith('/painel/')) {
    const token = request.cookies.get('session_token')?.value

    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const { data: session, error } = await supabaseAdmin
      .from('colaboradores')
      .select('id, email, setor, cargo')
      .eq('id', token)
      .single()

    if (error || !session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', session.id)
    requestHeaders.set('x-user-setor', session.setor)
    requestHeaders.set('x-user-cargo', session.cargo)

    return NextResponse.next({
      request: { headers: requestHeaders },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/cron/:path*', '/api/webhook/:path*', '/painel/:path*'],
}