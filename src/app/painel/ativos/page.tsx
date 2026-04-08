'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus, HardDrive, User, Tag } from 'lucide-react'
import type { Ativo } from '@/types'

export default function AtivosPage() {
  const [ativos, setAtivos] = useState<Ativo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAtivos()
  }, [])

  async function fetchAtivos() {
    try {
      const res = await fetch('/api/ativos')
      const data = await res.json()
      setAtivos(data.ativos || [])
    } catch (error) {
      console.error('Error fetching ativos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = ativos.filter((a) => 
    !searchTerm || 
    a.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.patrimonio?.includes(searchTerm) ||
    a.numero_serie?.includes(searchTerm)
  )

  const statusColors: Record<string, string> = {
    DISPONIVEL: 'bg-green-500/20 text-green-400',
    EM_USO: 'bg-ori-blue/20 text-ori-blue',
    MANUTENCAO: 'bg-yellow-500/20 text-yellow-400',
    DESCARTADO: 'bg-gray-500/20 text-gray-400',
  }

  const typeLabels: Record<string, string> = {
    NOTEBOOK: 'Notebook',
    DESKTOP: 'Desktop',
    MONITOR: 'Monitor',
    IMPRESSORA: 'Impressora',
    TELEFONE: 'Telefone',
    TABLET: 'Tablet',
    ACESSORIO: 'Acessorio',
    OUTRO: 'Outro',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ativos</h1>
          <p className="text-muted-foreground">Gerencie os ativos de TI</p>
        </div>
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Ativo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {['DISPONIVEL', 'EM_USO', 'MANUTENCAO', 'DESCARTADO'].map((status) => {
          const count = ativos.filter((a) => a.status === status).length
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
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, patrimonio ou serie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nome</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tipo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Patrimonio</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Responsavel</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">Carregando...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">Nenhum ativo encontrado</td>
                  </tr>
                ) : (
                  filtered.map((ativo) => (
                    <tr key={ativo.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4 text-muted-foreground" />
                          <span>{ativo.nome}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{typeLabels[ativo.tipo] || ativo.tipo}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{ativo.patrimonio || '-'}</td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[ativo.status] || 'bg-gray-500/20 text-gray-400'}>
                          {ativo.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {ativo.colaborador_id ? 'Atribuido' : 'Sem responsavel'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}