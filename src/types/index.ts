export type Setor = 'TI' | 'RH' | 'Financeiro' | 'Comercial' | 'Operacoes' | 'Diretoria' | 'Marketing' | 'Juridico'

export type StatusColaborador = 'ATIVO' | 'FERIAS' | 'LICENCA' | 'DESLIGADO'

export type Prioridade = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'

export type StatusChamado = 'ABERTO' | 'EM_ANDAMENTO' | 'AGUARDANDO_USUARIO' | 'RESOLVIDO' | 'FECHADO'

export type StatusTarefa = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA'

export type TipoTarefa =
  | 'carbonio_criar_conta'
  | 'carbonio_suspender'
  | 'zentyal_criar_usuario'
  | 'zentyal_desativar'
  | 'zentyal_alterar_grupo'
  | 'incontrol_cadastrar_cracha'
  | 'topdata_cadastrar_cracha'
  | 'offboarding_completo'
  | 'outro'

export type CategoriaKB = 'email' | 'rede' | 'vpn' | 'acesso' | 'hardware' | 'software' | 'ponto' | 'geral'

export type StatusKB = 'RASCUNHO' | 'PUBLICADO' | 'ATIVO' | 'REVISAR' | 'DESATIVADO'

export type AcaoAudit =
  | 'CRIAR_COLABORADOR'
  | 'ATUALIZAR_COLABORADOR'
  | 'DESATIVAR_COLABORADOR'
  | 'CRIAR_CHAMADO'
  | 'ATUALIZAR_CHAMADO'
  | 'RESOLVER_CHAMADO_IA'
  | 'CRIAR_TAREFA'
  | 'CONCLUIR_TAREFA'
  | 'CRIAR_KB'
  | 'ATUALIZAR_KB'
  | 'LOGIN'
  | 'LOGOUT'
  | 'RESET_SENHA'
  | 'CADASTRAR_ATIVO'
  | 'CADASTRAR_CRACHA'

export interface Colaborador {
  id: string
  matricula: string
  nome_completo: string
  email: string | null
  cpf: string | null
  setor: Setor
  cargo: string
  gestor_nome: string | null
  gestor_email: string | null
  filial: string | null
  data_admissao: string
  data_desligamento: string | null
  status: StatusColaborador
  criado_em: string
  atualizado_em: string
}

export interface Chamado {
  id: string
  glpi_id: number | null
  colaborador_id: string | null
  titulo: string
  descricao: string | null
  categoria: string | null
  prioridade: Prioridade
  status: StatusChamado
  solucao_ia: string | null
  confianca_ia: number | null
  resolvido_por_ia: boolean
  criado_em: string
  atualizado_em: string
  resolvido_em: string | null
  colaborador?: Colaborador
}

export interface TarefaManual {
  id: string
  colaborador_id: string | null
  tipo: TipoTarefa
  titulo: string
  descricao: string | null
  prioridade: Prioridade
  status: StatusTarefa
  dados_execucao: Record<string, unknown> | null
  evidencias: Record<string, unknown> | null
  responsavel_id: string | null
  criado_em: string
  atualizado_em: string
  concluida_em: string | null
  sla_limite: string | null
  colaborador?: Colaborador
}

export interface KBArtigo {
  id: string
  titulo: string
  conteudo: string
  categoria: CategoriaKB
  tags: string[]
  embedding: number[] | null
  status: StatusKB
  autor_id: string | null
  visualizacoes: number
  feedback_positivo: number
  feedback_negativo: number
  criado_em: string
  atualizado_em: string
  publicado_em: string | null
}

export interface KBArtigoFeedback {
  id: string
  artigo_id: string
  colaborador_id: string | null
  positivo: boolean
  comentario: string | null
  criado_em: string
}

export interface RFIDCracha {
  id: string
  colaborador_id: string
  uid_cracha: string
  sistema: string
  status: string
  criado_em: string
  ativado_em: string | null
}

export interface Ativo {
  id: string
  nome: string
  tipo: string
  numero_serie: string | null
  patrimonio: string | null
  colaborador_id: string | null
  status: string
  observacoes: string | null
  criado_em: string
  atualizado_em: string
}

export interface AuditLog {
  id: string
  acao: AcaoAudit
  tabela_afetada: string | null
  registro_id: string | null
  usuario_id: string | null
  detalhes: Record<string, unknown> | null
  ip_address: string | null
  criado_em: string
}

export interface TriageResult {
  categoria: string
  confianca: number
  solucao_sugerida: string
  kb_artigos: { id: string; titulo: string; similarity: number }[]
  deve_escalar: boolean
  prioridade: Prioridade
}

export interface GeminiSummary {
  resumo: string
  acoes_recomendadas: string[]
  contexto_relevante: string
}
