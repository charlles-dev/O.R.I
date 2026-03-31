# SEC-04 — Auditoria e Logs

  **Política de Logging, Retenção e Análise de Eventos de Segurança**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Segurança                         |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Visão Geral](#1-visão-geral)
  2. [Eventos Auditados](#2-eventos-auditados)
  3. [Estrutura do Registro](#3-estrutura-do-registro)
  4. [Retenção e Limpeza](#4-retenção-e-limpeza)
  5. [Consultas Úteis](#5-consultas-úteis)
  6. [Alertas de Segurança](#6-alertas-de-segurança)
  7. [Histórico de Versões](#7-histórico-de-versões)

  ---

  ## 1. Visão Geral

  O sistema de auditoria do O.R.I registra todos os eventos significativos na tabela `audit_log` do Supabase. O log é **append-only** — o código de aplicação nunca executa UPDATE ou DELETE nessa tabela.

  | Aspecto          | Detalhe                                          |
  |------------------|--------------------------------------------------|
  | Tabela           | `audit_log` (schema public)                    |
  | Tipo de log      | Append-only (INSERT somente via aplicação)        |
  | Retenção         | 90 dias (limpeza automática via cron)             |
  | Acesso           | Técnicos de TI via painel (leitura)               |
  | Backup           | Incluído no backup diário do Supabase             |

  ---

  ## 2. Eventos Auditados

  ### 2.1 Eventos de Negócio

  | Ação                          | Quando                                        | Dados registrados                          |
  |-------------------------------|-----------------------------------------------|---------------------------------------------|
  | `colaborador_sincronizado`  | Após cada execução do sync                    | { novos, alterados, desligados, erros }     |
  | `triagem_ia`                | Após cada classificação pela IA               | { confianca, categoria, resolvido_por_ia }  |
  | `chamado_criado`            | Quando chamado é aberto                       | { titulo, colaborador, via (bot/painel) }   |
  | `chamado_resolvido`         | Quando chamado é marcado como resolvido       | { solucao, tecnico, tempo_resolucao }       |
  | `tarefa_criada`             | Quando tarefa manual é gerada                 | { tipo, colaborador, prioridade, sla }      |
  | `tarefa_concluida`          | Quando TI marca tarefa como concluída         | { tipo, tecnico, tempo_total, evidencia }   |
  | `kb_artigo_criado`          | Quando artigo é adicionado à KB               | { titulo, autor, categoria }                |
  | `kb_artigo_atualizado`      | Quando artigo é editado                       | { titulo, campos_alterados }                |

  ### 2.2 Eventos de Segurança

  | Ação                          | Quando                                        | Dados registrados                          |
  |-------------------------------|-----------------------------------------------|---------------------------------------------|
  | `reset_senha_solicitado`    | Solicitação de reset via bot                  | { solicitante, alvo, autorizado }           |
  | `reset_senha_negado`        | Tentativa de reset negada                     | { solicitante, alvo, motivo }               |
  | `acesso_painel_ti`          | Login no painel TI                            | { email, ip, user_agent }                   |
  | `acesso_negado_painel`      | Tentativa de acesso não autorizado ao painel  | { email, ip, motivo }                       |
  | `webhook_invalido`          | Requisição ao webhook sem autenticação válida | { ip, headers, motivo }                     |
  | `cron_nao_autorizado`       | Execução de cron sem HMAC válido              | { ip, rota }                                |

  ---

  ## 3. Estrutura do Registro

  ```json
  {
    "id": "uuid-v4",
    "acao": "triagem_ia",
    "entidade": "chamado",
    "entidade_id": "uuid-do-chamado",
    "usuario": "joao.silva@proxximatelecom.com.br",
    "ip": "189.100.xxx.xxx",
    "detalhes": {
      "confianca": 0.87,
      "categoria": "email",
      "resolvido_por_ia": true,
      "artigos_utilizados": ["uuid-1", "uuid-2"],
      "tempo_processamento_ms": 2340
    },
    "criado_em": "2025-03-15T14:30:00.000Z"
  }
  ```

  ---

  ## 4. Retenção e Limpeza

  | Aspecto              | Configuração                                    |
  |----------------------|--------------------------------------------------|
  | Período de retenção  | 90 dias                                          |
  | Limpeza automática   | Cron diário às 02:00 (`/api/audit/cleanup`)    |
  | Query de limpeza     | `DELETE FROM audit_log WHERE criado_em < now() - interval '90 days'` |
  | Backup antes de limpar| Não (dados já estão no backup diário do Supabase)|

  ---

  ## 5. Consultas Úteis

  ### Eventos de segurança das últimas 24h

  ```sql
  SELECT * FROM audit_log
  WHERE acao IN ('reset_senha_negado', 'acesso_negado_painel', 'webhook_invalido', 'cron_nao_autorizado')
    AND criado_em > now() - interval '24 hours'
  ORDER BY criado_em DESC;
  ```

  ### Taxa de resolução por IA (últimos 7 dias)

  ```sql
  SELECT
    COUNT(*) FILTER (WHERE (detalhes->>'resolvido_por_ia')::boolean = true) as resolvidos_ia,
    COUNT(*) as total,
    ROUND(100.0 * COUNT(*) FILTER (WHERE (detalhes->>'resolvido_por_ia')::boolean = true) / COUNT(*), 1) as taxa_pct
  FROM audit_log
  WHERE acao = 'triagem_ia'
    AND criado_em > now() - interval '7 days';
  ```

  ### Tarefas concluídas fora do SLA

  ```sql
  SELECT detalhes->>'tipo' as tipo, detalhes->>'tecnico' as tecnico,
         detalhes->>'tempo_total' as tempo_total
  FROM audit_log
  WHERE acao = 'tarefa_concluida'
    AND (detalhes->>'tempo_total')::int > (detalhes->>'sla_minutos')::int
    AND criado_em > now() - interval '30 days'
  ORDER BY criado_em DESC;
  ```

  ---

  ## 6. Alertas de Segurança

  | Condição                                   | Ação                               |
  |---------------------------------------------|-------------------------------------|
  | 3+ resets de senha negados em 1 hora        | Notificar TI via Zoho Cliq          |
  | Webhook inválido de IP desconhecido         | Logar + rate limit IP               |
  | Acesso ao painel fora do horário comercial  | Notificar TI                        |
  | Cron não-autorizado detectado               | Bloquear IP + notificar TI          |

  ---

  ## 7. Histórico de Versões

  | Versão | Data    | Mudanças                                        |
  |--------|---------|-------------------------------------------------|
  | 1.0    | 2025-01 | Criação: logging básico                         |
  | 3.0    | 2025-03 | Eventos de IA, alertas de segurança, consultas  |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
