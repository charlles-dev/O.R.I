import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyHmacSignature } from '@/lib/security'

const CRON_SECRET = process.env.CRON_SECRET!

export async function GET(request: NextRequest) {
  const signature = request.headers.get('x-cron-signature')
  if (!signature || !verifyHmacSignature(CRON_SECRET, signature, '/api/cron/cleanup-audit')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 90)

    const { error } = await supabaseAdmin
      .from('audit_log')
      .delete()
      .lt('criado_em', cutoffDate.toISOString())

    if (error) throw error

    return NextResponse.json({
      success: true,
      deleted: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Cleanup audit error:', error)
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
  }
}