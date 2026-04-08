import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { uploadEvidenciaFromBase64 } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const body = await request.json()
    const { tarefaId, arquivo, mimeType } = body

    if (!tarefaId || !arquivo) {
      return NextResponse.json({ error: 'tarefaId e arquivo sao obrigatorios' }, { status: 400 })
    }

    const result = await uploadEvidenciaFromBase64(arquivo, tarefaId, mimeType)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    const { data: tarefa } = await supabaseAdmin
      .from('tarefas_manuais')
      .select('evidencias')
      .eq('id', tarefaId)
      .single()

    const currentEvidencias = tarefa?.evidencias || []
    const newEvidencias = [...currentEvidencias, { url: result.url, path: result.path, uploadedAt: new Date().toISOString() }]

    await supabaseAdmin
      .from('tarefas_manuais')
      .update({ evidencias: newEvidencias })
      .eq('id', tarefaId)

    await supabaseAdmin.from('audit_log').insert({
      acao: 'CONCLUIR_TAREFA',
      tabela_afetada: 'tarefas_manuais',
      registro_id: tarefaId,
      usuario_id: userId,
      detalhes: { action: 'upload_evidencia', path: result.path },
    })

    return NextResponse.json({ url: result.url, path: result.path })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tarefaId = searchParams.get('tarefaId')
  const path = searchParams.get('path')

  if (!tarefaId || !path) {
    return NextResponse.json({ error: 'tarefaId e path sao obrigatorios' }, { status: 400 })
  }

  const { deleteEvidencia } = await import('@/lib/storage')
  const success = await deleteEvidencia(path)

  if (!success) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }

  const { data: tarefa } = await supabaseAdmin
    .from('tarefas_manuais')
    .select('evidencias')
    .eq('id', tarefaId)
    .single()

  const filtered = (tarefa?.evidencias || []).filter((e: { path: string }) => e.path !== path)

  await supabaseAdmin
    .from('tarefas_manuais')
    .update({ evidencias: filtered })
    .eq('id', tarefaId)

  return NextResponse.json({ success: true })
}