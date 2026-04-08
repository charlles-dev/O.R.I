'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

interface UseRealtimeOptions<T> {
  table: 'chamados' | 'tarefas_manuais' | 'kb_artigos' | 'audit_log'
  filter?: string
  onInsert?: (record: T) => void
  onUpdate?: (record: T, oldRecord: T) => void
  onDelete?: (record: T) => void
}

export function useRealtime<T>({
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete,
}: UseRealtimeOptions<T>) {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const channel = supabase
      .channel(`${table}-realtime-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          ...(filter && { filter }),
        },
        (payload) => {
          const record = payload.new as T
          const oldRecord = payload.old as T

          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(record)
              break
            case 'UPDATE':
              onUpdate?.(record, oldRecord)
              break
            case 'DELETE':
              onDelete?.(record)
              break
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, filter, onInsert, onUpdate, onDelete])

  return { isConnected }
}

export function useChamadosRealtime(onUpdate?: (chamado: unknown) => void) {
  return useRealtime({
    table: 'chamados',
    onUpdate: (newRecord, oldRecord) => onUpdate?.(newRecord),
  })
}

export function useTarefasRealtime(onUpdate?: (tarefa: unknown) => void) {
  return useRealtime({
    table: 'tarefas_manuais',
    onUpdate: (newRecord, oldRecord) => onUpdate?.(newRecord),
  })
}

export function useAuditRealtime(onInsert?: (log: unknown) => void) {
  return useRealtime({
    table: 'audit_log',
    onInsert: (record) => onInsert?.(record),
  })
}

export function useFilesUpload() {
  const [uploading, setUploading] = useState(false)

  const uploadFile = useCallback(async (file: File, tarefaId: string): Promise<string | null> => {
    setUploading(true)

    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `${tarefaId}/${Date.now()}_${file.name}`

      const { data, error } = await supabase.storage
        .from('evidencias')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        console.error('Upload error:', error)
        return null
      }

      const { data: urlData } = supabase.storage
        .from('evidencias')
        .getPublicUrl(path)

      return urlData.publicUrl
    } catch (error) {
      console.error('Upload error:', error)
      return null
    } finally {
      setUploading(false)
    }
  }, [])

  return { uploadFile, uploading }
}