'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, UserPlus, Filter, Download } from 'lucide-react'
import type { Colaborador, Setor, StatusColaborador } from '@/types'

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [setorFilter, setSetorFilter] = useState<string>('')

  useEffect(() => {
    fetchColaboradores()
  }, [])

  async function fetchColaboradores() {
    try {
      const res = await fetch('/api/colaboradores')
      const data = await res.json()
      setColaboradores(data.colaboradores || [])
    } catch (error) {
      console.error('Error fetching colaboradores:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = colaboradores.filter((c) => {
    const matchSearch = !searchTerm || 
      c.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.matricula.includes(searchTerm) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchSetor = !setorFilter || c.setor === setorFilter
    return matchSearch && matchSetor
  })

  const statusColors: Record<StatusColaborador, string> = {
    ATIVO: 'bg-green-500/20 text-green-400',
    FERIAS: 'bg-yellow-500/20 text-yellow-400',
    LICENCA: 'bg-blue-500/20 text-blue-400',
    DESLIGADO: 'bg-red-500/20 text-red-400',
  }

  const setores: Setor[] = ['TI', 'RH', 'Financeiro', 'Comercial', 'Operacoes', 'Diretoria', 'Marketing', 'Juridico']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Colaboradores</h1>
          <p className="text-muted-foreground">Gerencie os colaboradores da empresa</p>
        </div>
        <Button className="btn-primary">
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Colaborador
        </Button>
      </div>

      <Card className="glass-panel">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, matricula ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-9"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={setorFilter}
                onChange={(e) => setSetorFilter(e.target.value)}
                className="input-field"
              >
                <option value="">Todos os setores</option>
                {setores.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <Button variant="outline" className="btn-secondary">
                <Filter className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Matricula</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nome</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Setor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Cargo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">Carregando...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">Nenhum colaborador encontrado</td>
                  </tr>
                ) : (
                  filtered.map((colab) => (
                    <tr key={colab.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-sm">{colab.matricula}</td>
                      <td className="py-3 px-4 text-sm font-medium">{colab.nome_completo}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{colab.email || '-'}</td>
                      <td className="py-3 px-4 text-sm">{colab.setor}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{colab.cargo}</td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[colab.status]}>{colab.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm" className="text-ori-pink hover:text-ori-pink/80">
                          Ver detalhes
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <p className="text-sm text-muted-foreground">
              Mostrando {filtered.length} de {colaboradores.length} colaboradores
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}