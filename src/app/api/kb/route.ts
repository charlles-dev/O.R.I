import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { generateEmbedding } from '@/lib/gemini'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ articles: [] })
  }

  try {
    const embedding = await generateEmbedding(query)

    const { data: results } = await supabaseAdmin.rpc('kb_busca_semantica', {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 10,
    })

    return NextResponse.json({ articles: results || [] })
  } catch (error) {
    console.error('Search KB error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const body = await request.json()

    const { data: article, error } = await supabaseAdmin
      .from('kb_artigos')
      .insert({
        titulo: body.titulo,
        conteudo: body.conteudo,
        categoria: body.categoria,
        tags: body.tags || [],
        status: 'RASCUNHO',
        autor_id: userId,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ article })
  } catch (error) {
    console.error('Create KB article error:', error)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (updates.conteudo) {
      const embedding = await generateEmbedding(`${updates.titulo}\n\n${updates.conteudo}`)
      updates.embedding = embedding
    }

    if (updates.status === 'PUBLICADO') {
      updates.publicado_em = new Date().toISOString()
    }

    const { data: article, error } = await supabaseAdmin
      .from('kb_artigos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ article })
  } catch (error) {
    console.error('Update KB article error:', error)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('kb_artigos')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}