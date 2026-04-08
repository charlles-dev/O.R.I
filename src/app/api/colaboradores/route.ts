import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const setor = searchParams.get('setor')
  const status = searchParams.get('status')

  try {
    let query = supabaseAdmin.from('colaboradores').select('*')

    if (setor) query = query.eq('setor', setor)
    if (status) query = query.eq('status', status)
    else query = query.eq('status', 'ATIVO')

    const { data, error } = await query.order('nome_completo')

    if (error) throw error

    return NextResponse.json({ colaboradores: data || [] })
  } catch (error) {
    console.error('Error fetching colaboradores:', error)
    return NextResponse.json({ error: 'Failed to fetch colaboradores' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabaseAdmin
      .from('colaboradores')
      .insert(body)
      .select()
      .single()

    if (error) throw error

    await supabaseAdmin.from('audit_log').insert({
      acao: 'CRIAR_COLABORADOR',
      tabela_afetada: 'colaboradores',
      registro_id: data.id,
      detalhes: body,
    })

    return NextResponse.json({ colaborador: data })
  } catch (error) {
    console.error('Error creating colaborador:', error)
    return NextResponse.json({ error: 'Failed to create colaborador' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()

    const { data, error } = await supabaseAdmin
      .from('colaboradores')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    await supabaseAdmin.from('audit_log').insert({
      acao: 'ATUALIZAR_COLABORADOR',
      tabela_afetada: 'colaboradores',
      registro_id: id,
      detalhes: updates,
    })

    return NextResponse.json({ colaborador: data })
  } catch (error) {
    console.error('Error updating colaborador:', error)
    return NextResponse.json({ error: 'Failed to update colaborador' }, { status: 500 })
  }
}