import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { generateSummary } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { ticketId } = await request.json()

    if (!ticketId) {
      return NextResponse.json({ error: 'ticketId is required' }, { status: 400 })
    }

    const { data: ticket } = await supabaseAdmin
      .from('chamados')
      .select('*, colaborador:nome_completo')
      .eq('id', ticketId)
      .single()

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    const summary = await generateSummary(
      ticket.titulo,
      ticket.descricao || '',
      [],
    )

    await supabaseAdmin
      .from('chamados')
      .update({ solucao_ia: summary.resumo })
      .eq('id', ticketId)

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Generate summary error:', error)
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ticketId = searchParams.get('ticketId')

  if (!ticketId) {
    return NextResponse.json({ error: 'ticketId is required' }, { status: 400 })
  }

  const { data: ticket } = await supabaseAdmin
    .from('chamados')
    .select('solucao_ia')
    .eq('id', ticketId)
    .single()

  return NextResponse.json(ticket?.solucao_ia || null)
}