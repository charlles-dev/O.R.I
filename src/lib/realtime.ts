import { createClient, type RealtimeChannel } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

export const supabaseRealtime = createClient<Database>(supabaseUrl, supabaseAnonKey)

export type ChamadoUpdate = {
  id: string
  status: string
  prioridade: string
  solucao_ia?: string
  confianca_ia?: number
}

export type TarefaUpdate = {
  id: string
  status: string
  prioridade: string
  titulo: string
}

export function subscribeToChamados(
  callback: (payload: { eventType: string; new: ChamadoUpdate; old: ChamadoUpdate }) => void
): RealtimeChannel {
  return supabaseRealtime
    .channel('chamados-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chamados',
      },
      (payload) => {
        callback({
          eventType: payload.eventType,
          new: payload.new as ChamadoUpdate,
          old: payload.old as ChamadoUpdate,
        })
      }
    )
    .subscribe()
}

export function subscribeToTarefas(
  callback: (payload: { eventType: string; new: TarefaUpdate; old: TarefaUpdate }) => void
): RealtimeChannel {
  return supabaseRealtime
    .channel('tarefas-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tarefas_manuais',
      },
      (payload) => {
        callback({
          eventType: payload.eventType,
          new: payload.new as TarefaUpdate,
          old: payload.old as TarefaUpdate,
        })
      }
    )
    .subscribe()
}

export function subscribeToAuditLog(
  callback: (payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> }) => void
): RealtimeChannel {
  return supabaseRealtime
    .channel('audit-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'audit_log',
      },
      (payload) => {
        callback({
          eventType: payload.eventType,
          new: payload.new as Record<string, unknown>,
          old: {} as Record<string, unknown>,
        })
      }
    )
    .subscribe()
}

export function unsubscribe(channel: RealtimeChannel) {
  supabaseRealtime.removeChannel(channel)
}
