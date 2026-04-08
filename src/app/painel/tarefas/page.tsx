'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import type { TarefaManual, Prioridade, StatusTarefa, TipoTarefa } from '@/types'

export default function TarefasPage() {
  const [tarefas, setTarefas] = useState<TarefaManual[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('')

  useEffect(() => {
    fetchTarefas()
  }, [])

  async function fetchTarefas() {
    try {
      const res = await fetch('/api/tarefas')
      const data = await res.json()
      setTarefas(data.tarefas || [])
    } catch (error) {
      console.error('Error fetching tarefas:', error)
    } finally {
      setLoading(false)
    }
  }

  async function completeTask(id: string) {
    try {
      await fetch('/api/tarefas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'CONCLUIDA' }),
      })
      fetchTarefas()
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  const filtered = tarefas.filter((t) => !filter || t.status === filter)

  const priorityColors: Record<Prioridade, string> = {
    URGENTE: 'bg-red-500/20 text-red-400',
    ALTA: 'bg-orange-500/20 text-orange-400',
    MEDIA: 'bg-yellow-500/20 text-yellow-400',
    BAIXA: 'bg-blue-500/20 text-blue-400',
  }

  const statusIcons: Record<StatusTarefa, typeof CheckCircle> = {
    PENDENTE: Clock,
    EM_ANDAMENTO: AlertTriangle,
    CONCLUIDA: CheckCircle,
    CANCELADA: XCircle,
  }

  const statusColors: Record<StatusTarefa, string> = {
    PENDENTE: 'bg-yellow-500/20 text-yellow-400',
    EM_ANDAMENTO: 'bg-ori-blue/20 text-ori-blue',
    CONCLUIDA: 'bg-green-500/20 text-green-400',
    CANCELADA: 'bg-gray-500/20 text-gray-400',
  }

  const taskTypeLabels: Record<TipoTarefa, string> = {
    carbonio_criar_conta: 'Criar Email',
    carbonio_suspender: 'Suspender Email',
    zentyal_criar_usuario: 'Criar Usuario Rede',
    zentyal_desativar: 'Desativar Rede',
    zentyal_alterar_grupo: 'Alterar Grupo',
    incontrol_cadastrar_cracha: 'Cadastrar Cracha iNControl',
    topdata_cadastrar_cracha: 'Cadastrar Cracha Topdata',
    offboarding_completo: 'Offboarding',
    outro: 'Outro',
  }

  const slaStatus = (tarefa: TarefaManual) => {
    if (!tarefa.sla_limite || tarefa.status === 'CONCLUIDA') return null
    const sla = new Date(tarefa.sla_limite)
    const now = new Date()
    const diff = sla.getTime() - now.getTime()
    if (diff < 0) return 'expired'
    if (diff < 30 * 60 * 1000) return 'warning'
    return 'ok'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tarefas Manuais</h1>
          <p className="text-muted-foreground">Gerencie as tarefas de infraestrutura</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'].map((status) => {
          const count = tarefas.filter((t) => t.status === status).length
          return (
            <button
              key={status}
              onClick={() => setFilter(filter === status ? '' : status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status ? 'bg-ori-pink/20 text-ori-pink' : 'bg-white/5 text-muted-foreground hover:bg-white/10'
              }`}
            >
              {status.replace('_', ' ')} ({count})
            </button>
          )
        })}
      </div>

      <Card className="glass-panel">
        <CardContent className="p-6">
          <div className="space-y-4">
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Carregando...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Nenhuma tarefa encontrada</p>
            ) : (
              filtered.map((tarefa) => {
                const StatusIcon = statusIcons[tarefa.status]
                const sla = slaStatus(tarefa)
                return (
                  <div
                    key={tarefa.id}
                    className="flex items-center justify-between rounded-lg border border-white/10 p-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-5 w-5 ${statusColors[tarefa.status].split(' ')[1]}`} />
                        <p className="font-medium truncate">{tarefa.titulo}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>{taskTypeLabels[tarefa.tipo]}</span>
                        {tarefa.colaborador_id && <span>Colaborador: {tarefa.colaborador_id}</span>}
                        {tarefa.sla_limite && (
                          <span className={sla === 'expired' ? 'text-red-400' : sla === 'warning' ? 'text-yellow-400' : ''}>
                            SLA: {new Date(tarefa.sla_limite).toLocaleString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge className={priorityColors[tarefa.prioridade]}>{tarefa.prioridade}</Badge>
                      <Badge className={statusColors[tarefa.status]}>
                        {tarefa.status.replace('_', ' ')}
                      </Badge>
                      {tarefa.status === 'PENDENTE' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="btn-secondary"
                          onClick={() => completeTask(tarefa.id)}
                        >
                          Concluir
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}