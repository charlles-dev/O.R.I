'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus, BookOpen, ThumbsUp, ThumbsDown, Eye } from 'lucide-react'
import type { KBArtigo, CategoriaKB, StatusKB } from '@/types'

export default function KnowledgeBasePage() {
  const [artigos, setArtigos] = useState<KBArtigo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  useEffect(() => {
    fetchArtigos()
  }, [])

  async function fetchArtigos() {
    try {
      const res = await fetch('/api/kb')
      const data = await res.json()
      setArtigos(data.articles || [])
    } catch (error) {
      console.error('Error fetching artigos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = artigos.filter((a) => {
    const matchSearch = !searchTerm || 
      a.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = !categoryFilter || a.categoria === categoryFilter
    return matchSearch && matchCategory
  })

  const categoryColors: Record<CategoriaKB, string> = {
    email: 'bg-blue-500/20 text-blue-400',
    rede: 'bg-green-500/20 text-green-400',
    vpn: 'bg-purple-500/20 text-purple-400',
    acesso: 'bg-ori-pink/20 text-ori-pink',
    hardware: 'bg-orange-500/20 text-orange-400',
    software: 'bg-cyan-500/20 text-cyan-400',
    ponto: 'bg-yellow-500/20 text-yellow-400',
    geral: 'bg-gray-500/20 text-gray-400',
  }

  const statusColors: Record<StatusKB, string> = {
    RASCUNHO: 'bg-gray-500/20 text-gray-400',
    PUBLICADO: 'bg-ori-blue/20 text-ori-blue',
    ATIVO: 'bg-green-500/20 text-green-400',
    REVISAR: 'bg-yellow-500/20 text-yellow-400',
    DESATIVADO: 'bg-red-500/20 text-red-400',
  }

  const categories: CategoriaKB[] = ['email', 'rede', 'vpn', 'acesso', 'hardware', 'software', 'ponto', 'geral']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">Gerencie os artigos da base de conhecimento</p>
        </div>
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Artigo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {categories.map((cat) => {
          const count = artigos.filter((a) => a.categoria === cat && a.status === 'ATIVO').length
          return (
            <Card key={cat} className="glass-panel">
              <CardContent className="p-4 flex items-center justify-between">
                <span className="text-sm capitalize">{cat}</span>
                <span className="text-lg font-bold">{count}</span>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="glass-panel">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-9"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
            >
              <option value="">Todas as categorias</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Carregando...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Nenhum artigo encontrado</p>
            ) : (
              filtered.map((artigo) => (
                <div
                  key={artigo.id}
                  className="flex items-start justify-between rounded-lg border border-white/10 p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <p className="font-medium truncate">{artigo.titulo}</p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {artigo.conteudo.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {artigo.visualizacoes}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {artigo.feedback_positivo}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsDown className="h-3 w-3" />
                        {artigo.feedback_negativo}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge className={categoryColors[artigo.categoria]}>{artigo.categoria}</Badge>
                    <Badge className={statusColors[artigo.status]}>{artigo.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}