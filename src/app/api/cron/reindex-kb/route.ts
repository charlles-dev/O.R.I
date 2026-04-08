import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyHmacSignature } from '@/lib/security'

const CRON_SECRET = process.env.CRON_SECRET!

export async function GET(request: NextRequest) {
  const signature = request.headers.get('x-cron-signature')
  if (!signature || !verifyHmacSignature(CRON_SECRET, signature, '/api/cron/reindex-kb')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { generateEmbedding } = await import('@/lib/gemini')

    const { data: articles } = await supabaseAdmin
      .from('kb_artigos')
      .select('id, titulo, conteudo')
      .eq('status', 'ATIVO')
      .is('embedding', null)

    if (!articles || articles.length === 0) {
      return NextResponse.json({ success: true, message: 'No articles to index' })
    }

    for (const article of articles) {
      const textToEmbed = `${article.titulo}\n\n${article.conteudo}`
      const embedding = await generateEmbedding(textToEmbed)

      await supabaseAdmin
        .from('kb_artigos')
        .update({ embedding })
        .eq('id', article.id)
    }

    return NextResponse.json({
      success: true,
      indexed: articles.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Reindex KB error:', error)
    return NextResponse.json({ error: 'Reindex failed' }, { status: 500 })
  }
}