import { supabaseAdmin } from './supabase-admin'
import type { Colaborador } from '@/types'

const RH_API_URL = 'https://proxximatelecomquem.netlify.app'

export async function fetchRHEmployees(): Promise<Colaborador[]> {
  const response = await fetch(RH_API_URL, {
    next: { revalidate: 900 },
  })

  if (!response.ok) {
    throw new Error(`RH API failed: ${response.statusText}`)
  }

  const data = await response.json()
  return mapRHEmployees(data)
}

function mapRHEmployees(data: Record<string, unknown>[]): Colaborador[] {
  return data.map((emp) => ({
    id: '',
    matricula: String(emp.matricula || emp.MATRICULA || ''),
    nome_completo: String(emp.nome || emp.NOME || ''),
    email: emp.email ? String(emp.email) : null,
    cpf: emp.cpf ? String(emp.cpf) : null,
    setor: normalizeSetor(String(emp.setor || emp.SETOR || 'TI')),
    cargo: String(emp.cargo || emp.CARGO || ''),
    gestor_nome: emp.gestor ? String(emp.gestor) : null,
    gestor_email: emp.gestor_email ? String(emp.gestor_email) : null,
    filial: emp.filial ? String(emp.filial) : null,
    data_admissao: emp.data_admissao ? String(emp.data_admissao) : new Date().toISOString().split('T')[0],
    data_desligamento: null,
    status: normalizeStatus(String(emp.status || emp.STATUS || 'ATIVO')),
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString(),
  }))
}

function normalizeSetor(value: string): Colaborador['setor'] {
  const map: Record<string, Colaborador['setor']> = {
    TI: 'TI',
    RH: 'RH',
    FINANCEIRO: 'Financeiro',
    COMERCIAL: 'Comercial',
    OPERACOES: 'Operacoes',
    DIRETORIA: 'Diretoria',
    MARKETING: 'Marketing',
    JURIDICO: 'Juridico',
  }
  return map[value.toUpperCase()] || 'TI'
}

function normalizeStatus(value: string): Colaborador['status'] {
  const upper = value.toUpperCase()
  if (upper === 'DESLIGADO' || upper === 'D') return 'DESLIGADO'
  if (upper === 'FERIAS' || upper === 'F') return 'FERIAS'
  if (upper === 'LICENCA' || upper === 'L') return 'LICENCA'
  return 'ATIVO'
}

export async function syncRHEmployees(): Promise<{
  new: number
  updated: number
  departed: number
  tasks: number
}> {
  const employees = await fetchRHEmployees()

  const { data: existing, error } = await supabaseAdmin
    .from('colaboradores')
    .select('matricula, status')

  if (error) throw error

  const existingMap = new Map(existing.map((e) => [e.matricula, e]))
  let newCount = 0
  let updatedCount = 0
  let departedCount = 0
  let taskCount = 0

  for (const emp of employees) {
    const exists = existingMap.get(emp.matricula)

    if (!exists) {
      const { data, error: insertError } = await supabaseAdmin
        .from('colaboradores')
        .insert(emp)
        .select()
        .single()

      if (insertError) {
        console.error(`Error inserting ${emp.matricula}:`, insertError)
        continue
      }

      newCount++
      taskCount += await createOnboardingTasks(data.id, emp)
    } else if (exists.status === 'ATIVO' && emp.status === 'DESLIGADO') {
      await supabaseAdmin
        .from('colaboradores')
        .update({ status: 'DESLIGADO', data_desligamento: new Date().toISOString().split('T')[0] })
        .eq('matricula', emp.matricula)

      departedCount++
      taskCount += await createOffboardingTasks(emp.matricula)
    } else if (exists.status !== emp.status) {
      await supabaseAdmin
        .from('colaboradores')
        .update({ status: emp.status })
        .eq('matricula', emp.matricula)

      updatedCount++
    }
  }

  await supabaseAdmin
    .from('colaboradores')
    .update({ status: 'DESLIGADO', data_desligamento: new Date().toISOString().split('T')[0] })
    .in('matricula', Array.from(existingMap.keys()).filter((m) => !employees.some((e) => e.matricula === m)))
    .eq('status', 'ATIVO')

  return { new: newCount, updated: updatedCount, departed: departedCount, tasks: taskCount }
}

async function createOnboardingTasks(colaboradorId: string, emp: Colaborador): Promise<number> {
  const tasks = []

  if (!emp.email) {
    tasks.push({
      colaborador_id: colaboradorId,
      tipo: 'carbonio_criar_conta',
      titulo: `Criar conta Carbonio - ${emp.nome_completo}`,
      descricao: `Criar conta de email para ${emp.nome_completo} (${emp.setor})`,
      prioridade: 'ALTA' as const,
      status: 'PENDENTE' as const,
      sla_limite: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    })
  }

  tasks.push({
    colaborador_id: colaboradorId,
    tipo: 'zentyal_criar_usuario',
    titulo: `Criar usuario Zentyal - ${emp.nome_completo}`,
    descricao: `Criar usuario de rede para ${emp.nome_completo} (${emp.setor})`,
    prioridade: 'ALTA' as const,
    status: 'PENDENTE' as const,
    sla_limite: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
  })

  if (tasks.length > 0) {
    const { error } = await supabaseAdmin.from('tarefas_manuais').insert(tasks)
    if (error) console.error('Error creating onboarding tasks:', error)
  }

  return tasks.length
}

async function createOffboardingTasks(matricula: string): Promise<number> {
  const { data: colaborador } = await supabaseAdmin
    .from('colaboradores')
    .select('id, nome_completo')
    .eq('matricula', matricula)
    .single()

  if (!colaborador) return 0

  const tasks = [
    {
      colaborador_id: colaborador.id,
      tipo: 'carbonio_suspender',
      titulo: `Suspender email Carbonio - ${colaborador.nome_completo}`,
      descricao: `Suspender conta de email do colaborador desligado`,
      prioridade: 'URGENTE' as const,
      status: 'PENDENTE' as const,
      sla_limite: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
    {
      colaborador_id: colaborador.id,
      tipo: 'zentyal_desativar',
      titulo: `Desativar usuario Zentyal - ${colaborador.nome_completo}`,
      descricao: `Desativar acesso de rede do colaborador desligado`,
      prioridade: 'URGENTE' as const,
      status: 'PENDENTE' as const,
      sla_limite: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
    {
      colaborador_id: colaborador.id,
      tipo: 'offboarding_completo',
      titulo: `Checklist offboarding - ${colaborador.nome_completo}`,
      descricao: `Completar checklist de offboarding`,
      prioridade: 'ALTA' as const,
      status: 'PENDENTE' as const,
      sla_limite: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const { error } = await supabaseAdmin.from('tarefas_manuais').insert(tasks)
  if (error) {
    console.error('Error creating offboarding tasks:', error)
    return 0
  }

  return tasks.length
}
