import { NextRequest, NextResponse } from 'next/server'
import { verifyZohoDomain, verifyHmacSignature } from '@/lib/security'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { triageMessage, generateEmbedding } from '@/lib/gemini'
import { sendTriageCard, sendNotification } from '@/lib/zoho'
import { createTicket } from '@/lib/glpi'
import type { Prioridade, StatusChamado } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || ''
    if (!verifyZohoDomain(origin)) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 401 })
    }

    const body = await request.json()
    const { chatId, userName, userEmail, message, messageId } = body

    const emailMatch = userEmail?.match(/@proxximatelecom\.com\.br$/)
    if (!emailMatch) {
      return NextResponse.json({ error: 'Invalid domain' }, { status: 400 })
    }

    const { data: collaborator } = await supabaseAdmin
      .from('colaboradores')
      .select('*')
      .eq('email', userEmail)
      .eq('status', 'ATIVO')
      .single()

    const { data: kbArticles } = await supabaseAdmin
      .from('kb_artigos')
      .select('id, titulo, conteudo, categoria, tags')
      .eq('status', 'ATIVO')
      .not('embedding', 'is', null)
      .order('visualizacoes', { ascending: false })
      .limit(5)

    let kbContext = ''
    const kbForTriage: { id: string; titulo: string; similarity: number }[] = []

    if (kbArticles && kbArticles.length > 0 && collaborator) {
      const embedding = await generateEmbedding(message)

      const { data: semanticResults } = await supabaseAdmin.rpc('kb_busca_semantica', {
        query_embedding: embedding,
        match_threshold: 0.75,
        match_count: 5,
      })

      if (semanticResults && semanticResults.length > 0) {
        kbContext = semanticResults
          .map((a: { titulo: string; conteudo: string }) => `## ${a.titulo}\n${a.conteudo.substring(0, 500)}`)
          .join('\n\n')

        kbForTriage.push(
          ...semanticResults.slice(0, 3).map((a: { id: string; titulo: string; similarity: number }) => ({
            id: a.id,
            titulo: a.titulo,
            similarity: a.similarity,
          }))
        )
      }
    }

    const triageResult = await triageMessage(message, kbContext)

    const priorityMap: Record<Prioridade, number> = {
      BAIXA: 1,
      MEDIA: 3,
      ALTA: 4,
      URGENTE: 5,
    }

    const statusMap: Record<string, StatusChamado> = {
      resolved: 'RESOLVIDO',
      escalated: 'ABERTO',
    }

    let glpiId: number | undefined
    let dbStatus: StatusChamado = 'ABERTO'
    let solvedByAI = false

    if (!triageResult.deve_escalar && triageResult.confianca >= 0.75) {
      dbStatus = 'RESOLVIDO'
      solvedByAI = true

      await supabaseAdmin.from('chamados').insert({
        colaborador_id: collaborator?.id,
        titulo: message.substring(0, 300),
        descricao: message,
        categoria: triageResult.categoria,
        prioridade: triageResult.prioridade,
        status: dbStatus,
        solucao_ia: triageResult.solucao_sugerida,
        confianca_ia: triageResult.confianca,
        resolvido_por_ia: true,
        resolvido_em: new Date().toISOString(),
      })

      await sendTriageCard(
        chatId,
        message.substring(0, 50),
        triageResult.categoria,
        triageResult.confianca,
        triageResult.solucao_sugerida,
        false,
      )
    } else {
      const glpiResult = await createTicket({
        name: message.substring(0, 200),
        content: `Mensagem: ${message}\n\nCategoria: ${triageResult.categoria}\nConfianca IA: ${(triageResult.confianca * 100).toFixed(0)}%\n\nSolucao Sugerida:\n${triageResult.solucao_sugerida}`,
        categories_id: 8,
        urgency: priorityMap[triageResult.prioridade] || 3,
      })

      if (glpiResult.id) {
        glpiId = glpiResult.id
      }

      const { data: ticket } = await supabaseAdmin.from('chamados').insert({
        glpi_id: glpiId,
        colaborador_id: collaborator?.id,
        titulo: message.substring(0, 300),
        descricao: message,
        categoria: triageResult.categoria,
        prioridade: triageResult.prioridade,
        status: dbStatus,
        solucao_ia: triageResult.solucao_sugerida,
        confianca_ia: triageResult.confianca,
        resolvido_por_ia: false,
      }).select().single()

      if (triageResult.kb_artigos.length > 0) {
        await supabaseAdmin.from('kb_artigos').update({
          visualizacoes: kbArticles.find((a: { id: string }) => a.id === triageResult.kb_artigos[0]?.id)?.visualizacoes + 1 || 1,
        }).eq('id', triageResult.kb_artigos[0].id)
      }

      await sendTriageCard(
        chatId,
        message.substring(0, 50),
        triageResult.categoria,
        triageResult.confianca,
        triageResult.solucao_sugerida,
        true,
        glpiId,
      )

      if (triageResult.kb_artigos.length > 0) {
        await sendNotification(
          chatId,
          'Artigos Relacionados',
          `Veja estes artigos da base de conhecimento:\n${triageResult.kb_artigos.map((a: { titulo: string }) => `- ${a.titulo}`).join('\n')}`,
          'info',
        )
      }
    }

    await supabaseAdmin.from('audit_log').insert({
      acao: solvedByAI ? 'RESOLVER_CHAMADO_IA' : 'CRIAR_CHAMADO',
      tabela_afetada: 'chamados',
      registro_id: ticket?.id,
      usuario_id: collaborator?.id,
      detalhes: {
        chatId,
        messageId,
        kbArticles: kbForTriage,
        glpiId,
      },
    })

    return NextResponse.json({ success: true, solvedByAI, glpiId })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}