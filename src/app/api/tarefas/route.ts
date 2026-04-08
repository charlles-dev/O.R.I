import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  try {
    let query = supabaseAdmin.from('tarefas_manuais').select('*')

    if (status) query = query.eq('status', status)
    else query = query.neq('status', 'CANCELADA')

    const { data, error } = await query
      .order('sla_limite', { ascending: true })
      .order('prioridade', { ascending: false })
      .order('criado_em', { ascending: false })

    if (error) throw error

    return NextResponse.json({ tarefas: data || [] })
  } catch (error) {
    console.error('Error fetching tarefas:', error)
    return NextResponse.json({ error: 'Failed to fetch tarefas' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status, evidencias } = await request.json()

    const updates: Record<string, unknown> = { status }
    if (status === 'CONCLUIDA') {
      updates.concluida_em = new Date().toISOString()
    }
    if (evidencias) {
      updates.evidencias = evidencias
    }

    const { data, error } = await supabaseAdmin
      .from('tarefas_manuais')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    await supabaseAdmin.from('audit_log').insert({
      acao: 'CONCLUIR_TAREFA',
      tabela_afetada: 'tarefas_manuais',
      registro_id: id,
      detalhes: { status, evidencias },
    })

    return NextResponse.json({ tarefa: data })
  } catch (error) {
    console.error('Error updating tarefa:', error)
    return NextResponse.json({ error: 'Failed to update tarefa' }, { status: 500 })
  }
}