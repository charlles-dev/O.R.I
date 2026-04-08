import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const prioridade = searchParams.get('prioridade')

  try {
    let query = supabaseAdmin.from('chamados').select('*, colaborador:colaboradores(nome_completo, email)')

    if (status) query = query.eq('status', status)
    if (prioridade) query = query.eq('prioridade', prioridade)

    const { data, error } = await query.order('criado_em', { ascending: false })

    if (error) throw error

    return NextResponse.json({ chamados: data || [] })
  } catch (error) {
    console.error('Error fetching chamados:', error)
    return NextResponse.json({ error: 'Failed to fetch chamados' }, { status: 500 })
  }
}