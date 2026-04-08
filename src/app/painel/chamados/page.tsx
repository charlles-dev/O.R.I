'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, Plus, ExternalLink } from 'lucide-react'
import type { Chamado, Prioridade, StatusChamado } from '@/types'

export default function ChamadosPage() {
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  useEffect(() => {
    fetchChamados()
  }, [])

  async function fetchChamados() {
    try {
      const res = await fetch('/api/chamados')
      const data = await res.json()
      setChamados(data.chamados || [])
    } catch (error) {
      console.error('Error fetching chamados:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = chamados.filter((c) => {
    const matchSearch = !searchTerm || 
      c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = !statusFilter || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const priorityColors: Record<Prioridade, string> = {
    URGENTE: 'bg-red-500/20 text-red-400',
    ALTA: 'bg-orange-500/20 text-orange-400',
    MEDIA: 'bg-yellow-500/20 text-yellow-400',
    BAIXA: 'bg-blue-500/20 text-blue-400',
  }

  const statusColors: Record<StatusChamado, string> = {
    ABERTO: 'bg-ori-pink/20 text-ori-pink',
    EM_ANDAMENTO: 'bg-ori-blue/20 text-ori-blue',
    AGUARDANDO_USUARIO: 'bg-yellow-500/20 text-yellow-400',
    RESOLVIDO: 'bg-green-500/20 text-green-400',
    FECHADO: 'bg-gray-500/20 text-gray-400',
  }

  const statusOptions: StatusChamado[] = ['ABERTO', 'EM_ANDAMENTO', 'AGUARDANDO_USUARIO', 'RESOLVIDO', 'FECHADO']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chamados</h1>
          <p className="text-muted-foreground">Gerencie os chamados do GLPI</p>
        </div>
        <Button className="btn-primary" onClick={() => window.open(process.env.NEXT_PUBLIC_GLPI_URL || '#', '_blank')}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Abrir GLPI
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {statusOptions.map((status) => {
          const count = chamados.filter((c) => c.status === status).length
          return (
            <Card key={status} className="glass-panel">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{status.replace('_', ' ')}</p>
                <p className="text-2xl font-bold">{count}</p>
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
                placeholder="Buscar por titulo ou descricao..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="">Todos os status</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Carregando...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Nenhum chamado encontrado</p>
            ) : (
              filtered.map((chamado) => (
                <div
                  key={chamado.id}
                  className="flex items-center justify-between rounded-lg border border-white/10 p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{chamado.titulo}</p>
                      {chamado.glpi_id && (
                        <span className="text-xs text-muted-foreground">#{chamado.glpi_id}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{chamado.descricao || 'Sem descricao'}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {chamado.categoria && <span className="mr-2">{chamado.categoria}</span>}
                      {new Date(chamado.criado_em).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge className={priorityColors[chamado.prioridade]}>{chamado.prioridade}</Badge>
                    <Badge className={statusColors[chamado.status]}>{chamado.status.replace('_', ' ')}</Badge>
                    {chamado.resolvido_por_ia && (
                      <Badge className="bg-ori-aqua/20 text-ori-aqua">IA</Badge>
                    )}
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