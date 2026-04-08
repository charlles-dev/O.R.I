import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const { data: tickets } = await supabaseAdmin
      .from('chamados')
      .select('id, titulo, status, prioridade, criado_em, colaborador:colaboradores(nome_completo)')
      .order('criado_em', { ascending: false })
      .limit(10)

    const formattedTickets = (tickets || []).map((t) => ({
      id: t.id,
      titulo: t.titulo,
      status: t.status,
      prioridade: t.prioridade,
      criado_em: t.criado_em,
      nome_colaborador: t.colaborador?.nome_completo || null,
    }))

    return NextResponse.json({ tickets: formattedTickets })
  } catch (error) {
    console.error('Recent tickets error:', error)
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}