export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      colaboradores: {
        Row: {
          id: string
          matricula: string
          nome_completo: string
          email: string | null
          cpf: string | null
          setor: 'TI' | 'RH' | 'Financeiro' | 'Comercial' | 'Operacoes' | 'Diretoria' | 'Marketing' | 'Juridico'
          cargo: string
          gestor_nome: string | null
          gestor_email: string | null
          filial: string | null
          data_admissao: string
          data_desligamento: string | null
          status: 'ATIVO' | 'FERIAS' | 'LICENCA' | 'DESLIGADO'
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          matricula: string
          nome_completo: string
          email?: string | null
          cpf?: string | null
          setor: 'TI' | 'RH' | 'Financeiro' | 'Comercial' | 'Operacoes' | 'Diretoria' | 'Marketing' | 'Juridico'
          cargo: string
          gestor_nome?: string | null
          gestor_email?: string | null
          filial?: string | null
          data_admissao: string
          data_desligamento?: string | null
          status?: 'ATIVO' | 'FERIAS' | 'LICENCA' | 'DESLIGADO'
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          matricula?: string
          nome_completo?: string
          email?: string | null
          cpf?: string | null
          setor?: 'TI' | 'RH' | 'Financeiro' | 'Comercial' | 'Operacoes' | 'Diretoria' | 'Marketing' | 'Juridico'
          cargo?: string
          gestor_nome?: string | null
          gestor_email?: string | null
          filial?: string | null
          data_admissao?: string
          data_desligamento?: string | null
          status?: 'ATIVO' | 'FERIAS' | 'LICENCA' | 'DESLIGADO'
          criado_em?: string
          atualizado_em?: string
        }
      }
      chamados: {
        Row: {
          id: string
          glpi_id: number | null
          colaborador_id: string | null
          titulo: string
          descricao: string | null
          categoria: string | null
          prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'
          status: 'ABERTO' | 'EM_ANDAMENTO' | 'AGUARDANDO_USUARIO' | 'RESOLVIDO' | 'FECHADO'
          solucao_ia: string | null
          confianca_ia: number | null
          resolvido_por_ia: boolean
          criado_em: string
          atualizado_em: string
          resolvido_em: string | null
        }
        Insert: {
          id?: string
          glpi_id?: number | null
          colaborador_id?: string | null
          titulo: string
          descricao?: string | null
          categoria?: string | null
          prioridade?: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'
          status?: 'ABERTO' | 'EM_ANDAMENTO' | 'AGUARDANDO_USUARIO' | 'RESOLVIDO' | 'FECHADO'
          solucao_ia?: string | null
          confianca_ia?: number | null
          resolvido_por_ia?: boolean
          criado_em?: string
          atualizado_em?: string
          resolvido_em?: string | null
        }
        Update: {
          id?: string
          glpi_id?: number | null
          colaborador_id?: string | null
          titulo?: string
          descricao?: string | null
          categoria?: string | null
          prioridade?: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'
          status?: 'ABERTO' | 'EM_ANDAMENTO' | 'AGUARDANDO_USUARIO' | 'RESOLVIDO' | 'FECHADO'
          solucao_ia?: string | null
          confianca_ia?: number | null
          resolvido_por_ia?: boolean
          criado_em?: string
          atualizado_em?: string
          resolvido_em?: string | null
        }
      }
      tarefas_manuais: {
        Row: {
          id: string
          colaborador_id: string | null
          tipo: 'carbonio_criar_conta' | 'carbonio_suspender' | 'zentyal_criar_usuario' | 'zentyal_desativar' | 'zentyal_alterar_grupo' | 'incontrol_cadastrar_cracha' | 'topdata_cadastrar_cracha' | 'offboarding_completo' | 'outro'
          titulo: string
          descricao: string | null
          prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'
          status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA'
          dados_execucao: Json | null
          evidencias: Json | null
          responsavel_id: string | null
          criado_em: string
          atualizado_em: string
          concluida_em: string | null
          sla_limite: string | null
        }
        Insert: {
          id?: string
          colaborador_id?: string | null
          tipo: 'carbonio_criar_conta' | 'carbonio_suspender' | 'zentyal_criar_usuario' | 'zentyal_desativar' | 'zentyal_alterar_grupo' | 'incontrol_cadastrar_cracha' | 'topdata_cadastrar_cracha' | 'offboarding_completo' | 'outro'
          titulo: string
          descricao?: string | null
          prioridade?: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'
          status?: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA'
          dados_execucao?: Json | null
          evidencias?: Json | null
          responsavel_id?: string | null
          criado_em?: string
          atualizado_em?: string
          concluida_em?: string | null
          sla_limite?: string | null
        }
        Update: {
          id?: string
          colaborador_id?: string | null
          tipo?: 'carbonio_criar_conta' | 'carbonio_suspender' | 'zentyal_criar_usuario' | 'zentyal_desativar' | 'zentyal_alterar_grupo' | 'incontrol_cadastrar_cracha' | 'topdata_cadastrar_cracha' | 'offboarding_completo' | 'outro'
          titulo?: string
          descricao?: string | null
          prioridade?: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'
          status?: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA'
          dados_execucao?: Json | null
          evidencias?: Json | null
          responsavel_id?: string | null
          criado_em?: string
          atualizado_em?: string
          concluida_em?: string | null
          sla_limite?: string | null
        }
      }
      kb_artigos: {
        Row: {
          id: string
          titulo: string
          conteudo: string
          categoria: 'email' | 'rede' | 'vpn' | 'acesso' | 'hardware' | 'software' | 'ponto' | 'geral'
          tags: string[]
          embedding: string | null
          status: 'RASCUNHO' | 'PUBLICADO' | 'ATIVO' | 'REVISAR' | 'DESATIVADO'
          autor_id: string | null
          visualizacoes: number
          feedback_positivo: number
          feedback_negativo: number
          criado_em: string
          atualizado_em: string
          publicado_em: string | null
        }
        Insert: {
          id?: string
          titulo: string
          conteudo: string
          categoria: 'email' | 'rede' | 'vpn' | 'acesso' | 'hardware' | 'software' | 'ponto' | 'geral'
          tags?: string[]
          embedding?: string | null
          status?: 'RASCUNHO' | 'PUBLICADO' | 'ATIVO' | 'REVISAR' | 'DESATIVADO'
          autor_id?: string | null
          visualizacoes?: number
          feedback_positivo?: number
          feedback_negativo?: number
          criado_em?: string
          atualizado_em?: string
          publicado_em?: string | null
        }
        Update: {
          id?: string
          titulo?: string
          conteudo?: string
          categoria?: 'email' | 'rede' | 'vpn' | 'acesso' | 'hardware' | 'software' | 'ponto' | 'geral'
          tags?: string[]
          embedding?: string | null
          status?: 'RASCUNHO' | 'PUBLICADO' | 'ATIVO' | 'REVISAR' | 'DESATIVADO'
          autor_id?: string | null
          visualizacoes?: number
          feedback_positivo?: number
          feedback_negativo?: number
          criado_em?: string
          atualizado_em?: string
          publicado_em?: string | null
        }
      }
      kb_artigos_feedback: {
        Row: {
          id: string
          artigo_id: string
          colaborador_id: string | null
          positivo: boolean
          comentario: string | null
          criado_em: string
        }
        Insert: {
          id?: string
          artigo_id: string
          colaborador_id?: string | null
          positivo: boolean
          comentario?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          artigo_id?: string
          colaborador_id?: string | null
          positivo?: boolean
          comentario?: string | null
          criado_em?: string
        }
      }
      rfid_crachas: {
        Row: {
          id: string
          colaborador_id: string
          uid_cracha: string
          sistema: string
          status: string
          criado_em: string
          ativado_em: string | null
        }
        Insert: {
          id?: string
          colaborador_id: string
          uid_cracha: string
          sistema: string
          status?: string
          criado_em?: string
          ativado_em?: string | null
        }
        Update: {
          id?: string
          colaborador_id?: string
          uid_cracha?: string
          sistema?: string
          status?: string
          criado_em?: string
          ativado_em?: string | null
        }
      }
      ativos: {
        Row: {
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
        Insert: {
          id?: string
          nome: string
          tipo: string
          numero_serie?: string | null
          patrimonio?: string | null
          colaborador_id?: string | null
          status?: string
          observacoes?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          tipo?: string
          numero_serie?: string | null
          patrimonio?: string | null
          colaborador_id?: string | null
          status?: string
          observacoes?: string | null
          criado_em?: string
          atualizado_em?: string
        }
      }
      audit_log: {
        Row: {
          id: string
          acao: 'CRIAR_COLABORADOR' | 'ATUALIZAR_COLABORADOR' | 'DESATIVAR_COLABORADOR' | 'CRIAR_CHAMADO' | 'ATUALIZAR_CHAMADO' | 'RESOLVER_CHAMADO_IA' | 'CRIAR_TAREFA' | 'CONCLUIR_TAREFA' | 'CRIAR_KB' | 'ATUALIZAR_KB' | 'LOGIN' | 'LOGOUT' | 'RESET_SENHA' | 'CADASTRAR_ATIVO' | 'CADASTRAR_CRACHA'
          tabela_afetada: string | null
          registro_id: string | null
          usuario_id: string | null
          detalhes: Json | null
          ip_address: string | null
          criado_em: string
        }
        Insert: {
          id?: string
          acao: 'CRIAR_COLABORADOR' | 'ATUALIZAR_COLABORADOR' | 'DESATIVAR_COLABORADOR' | 'CRIAR_CHAMADO' | 'ATUALIZAR_CHAMADO' | 'RESOLVER_CHAMADO_IA' | 'CRIAR_TAREFA' | 'CONCLUIR_TAREFA' | 'CRIAR_KB' | 'ATUALIZAR_KB' | 'LOGIN' | 'LOGOUT' | 'RESET_SENHA' | 'CADASTRAR_ATIVO' | 'CADASTRAR_CRACHA'
          tabela_afetada?: string | null
          registro_id?: string | null
          usuario_id?: string | null
          detalhes?: Json | null
          ip_address?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          acao?: 'CRIAR_COLABORADOR' | 'ATUALIZAR_COLABORADOR' | 'DESATIVAR_COLABORADOR' | 'CRIAR_CHAMADO' | 'ATUALIZAR_CHAMADO' | 'RESOLVER_CHAMADO_IA' | 'CRIAR_TAREFA' | 'CONCLUIR_TAREFA' | 'CRIAR_KB' | 'ATUALIZAR_KB' | 'LOGIN' | 'LOGOUT' | 'RESET_SENHA' | 'CADASTRAR_ATIVO' | 'CADASTRAR_CRACHA'
          tabela_afetada?: string | null
          registro_id?: string | null
          usuario_id?: string | null
          detalhes?: Json | null
          ip_address?: string | null
          criado_em?: string
        }
      }
    }
    Views: Record<never, never>
    Functions: {
      kb_busca_semantica: {
        Args: {
          query_embedding: number[]
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          titulo: string
          conteudo: string
          categoria: string
          tags: string[]
          visualizacoes: number
          feedback_positivo: number
          feedback_negativo: number
          similarity: number
        }[]
      }
    }
    Enums: Record<never, never>
  }
}
