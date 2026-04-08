import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyHmacSignature } from '@/lib/security'
import { refreshZohoToken } from '@/lib/zoho'

const CRON_SECRET = process.env.CRON_SECRET!

export async function GET(request: NextRequest) {
  const signature = request.headers.get('x-cron-signature')
  if (!signature || !verifyHmacSignature(CRON_SECRET, signature, '/api/cron/refresh-zoho-token')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const success = await refreshZohoToken()

    return NextResponse.json({
      success,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Refresh Zoho token error:', error)
    return NextResponse.json({ error: 'Token refresh failed' }, { status: 500 })
  }
}