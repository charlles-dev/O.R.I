'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Ticket,
  ListTodo,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Activity,
} from 'lucide-react'

interface DashboardStats {
  colaboradores: number
  chamadosAbertos: number
  tarefasPendentes: number
  resolvidosIA: number
  ticketMedia: number
  taxaResolucao: number
}

interface RecentTicket {
  id: string
  titulo: string
  status: string
  prioridade: string
  criado_em: string
  nome_colaborador?: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    colaboradores: 0,
    chamadosAbertos: 0,
    tarefasPendentes: 0,
    resolvidosIA: 0,
    ticketMedia: 0,
    taxaResolucao: 0,
  })
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, ticketsRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/recent-tickets'),
        ])

        const statsData = await statsRes.json()
        const ticketsData = await ticketsRes.json()

        setStats(statsData)
        setRecentTickets(ticketsData.tickets || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statCards = [
    {
      title: 'Colaboradores Ativos',
      value: stats.colaboradores,
      icon: Users,
      color: 'text-ori-blue',
      bgColor: 'bg-ori-blue/10',
    },
    {
      title: 'Chamados Abertos',
      value: stats.chamadosAbertos,
      icon: Ticket,
      color: 'text-ori-pink',
      bgColor: 'bg-ori-pink/10',
    },
    {
      title: 'Tarefas Pendentes',
      value: stats.tarefasPendentes,
      icon: ListTodo,
      color: 'text-ori-aqua',
      bgColor: 'bg-ori-aqua/10',
    },
    {
      title: 'Resolvidos pela IA',
      value: stats.resolvidosIA,
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
  ]

  const priorityColors: Record<string, string> = {
    URGENTE: 'bg-red-500/20 text-red-400',
    ALTA: 'bg-orange-500/20 text-orange-400',
    MEDIA: 'bg-yellow-500/20 text-yellow-400',
    BAIXA: 'bg-blue-500/20 text-blue-400',
  }

  const statusColors: Record<string, string> = {
    ABERTO: 'bg-ori-pink/20 text-ori-pink',
    EM_ANDAMENTO: 'bg-ori-blue/20 text-ori-blue',
    RESOLVIDO: 'bg-green-400/20 text-green-400',
    FECHADO: 'bg-gray-500/20 text-gray-400',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visao geral do sistema O.R.I</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="glass-panel">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Chamados Recentes</CardTitle>
            <Badge variant="outline" className="bg-ori-blue/10 text-ori-blue">
              <Activity className="h-3 w-3 mr-1" />
              Tempo Real
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum chamado recente
                </p>
              ) : (
                recentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{ticket.titulo}</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.nome_colaborador || 'Sem atribuicao'} - {new Date(ticket.criado_em).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge className={priorityColors[ticket.prioridade]}>
                        {ticket.prioridade}
                      </Badge>
                      <Badge className={statusColors[ticket.status]}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Metricas de IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-ori-aqua" />
                <span className="text-sm">Taxa de Resolucao</span>
              </div>
              <span className="text-lg font-bold text-ori-aqua">{stats.taxaResolucao}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-ori-blue" />
                <span className="text-sm">Tempo Medio de Resposta</span>
              </div>
              <span className="text-lg font-bold text-ori-blue">{stats.ticketMedia}s</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-ori-pink" />
                <span className="text-sm">Chamados Escalados</span>
              </div>
              <span className="text-lg font-bold text-ori-pink">
                {stats.chamadosAbertos - stats.resolvidosIA}
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-ori-pink to-ori-aqua"
                style={{ width: `${stats.taxaResolucao}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}