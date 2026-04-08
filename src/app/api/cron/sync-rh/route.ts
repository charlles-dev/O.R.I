import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyHmacSignature } from '@/lib/security'

const CRON_SECRET = process.env.CRON_SECRET!

export async function GET(request: NextRequest) {
  const signature = request.headers.get('x-cron-signature')
  if (!signature || !verifyHmacSignature(CRON_SECRET, signature, '/api/cron/sync-rh')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { syncRHEmployees } = await import('@/lib/rh-sync')
    const result = await syncRHEmployees()

    await supabaseAdmin.from('audit_log').insert({
      acao: 'ATUALIZAR_COLABORADOR',
      tabela_afetada: 'colaboradores',
      detalhes: result,
    })

    return NextResponse.json({
      success: true,
      synced: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Sync RH error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}