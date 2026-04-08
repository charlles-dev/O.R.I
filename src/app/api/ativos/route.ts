import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const tipo = searchParams.get('tipo')

  try {
    let query = supabaseAdmin.from('ativos').select('*')

    if (status) query = query.eq('status', status)
    if (tipo) query = query.eq('tipo', tipo)

    const { data, error } = await query.order('nome')

    if (error) throw error

    return NextResponse.json({ ativos: data || [] })
  } catch (error) {
    console.error('Error fetching ativos:', error)
    return NextResponse.json({ error: 'Failed to fetch ativos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const body = await request.json()

    const { data, error } = await supabaseAdmin
      .from('ativos')
      .insert({
        ...body,
      })
      .select()
      .single()

    if (error) throw error

    await supabaseAdmin.from('audit_log').insert({
      acao: 'CADASTRAR_ATIVO',
      tabela_afetada: 'ativos',
      registro_id: data.id,
      usuario_id: userId,
      detalhes: body,
    })

    return NextResponse.json({ ativo: data })
  } catch (error) {
    console.error('Error creating ativo:', error)
    return NextResponse.json({ error: 'Failed to create ativo' }, { status: 500 })
  }
}