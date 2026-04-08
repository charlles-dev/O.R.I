import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha sao obrigatorios' }, { status: 400 })
    }

    if (!email.endsWith('@proxximatelecom.com.br') && !email.endsWith('@proxxima.net')) {
      return NextResponse.json({ error: 'Use email corporativo' }, { status: 400 })
    }

    const { data: collaborator, error } = await supabaseAdmin
      .from('colaboradores')
      .select('id, email, nome_completo, setor, cargo, status')
      .eq('email', email.toLowerCase())
      .eq('status', 'ATIVO')
      .single()

    if (error || !collaborator) {
      return NextResponse.json({ error: 'Colaborador nao encontrado' }, { status: 401 })
    }

    const token = collaborator.id

    await supabaseAdmin.from('audit_log').insert({
      acao: 'LOGIN',
      tabela_afetada: 'colaboradores',
      registro_id: collaborator.id,
      detalhes: { email },
    })

    return NextResponse.json({
      token,
      user: {
        id: collaborator.id,
        nome: collaborator.nome_completo,
        email: collaborator.email,
        setor: collaborator.setor,
        cargo: collaborator.cargo,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}