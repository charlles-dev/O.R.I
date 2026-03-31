# INT-02 — Integração REST API RH

  **Polling, Sync de Colaboradores e Detecção de Mudanças**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Integrações                        |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Visão Geral](#1-visão-geral)
  2. [Endpoint e Autenticação](#2-endpoint-e-autenticação)
  3. [Estrutura dos Dados](#3-estrutura-dos-dados)
  4. [Fluxo de Sync](#4-fluxo-de-sync)
  5. [Detecção de Mudanças](#5-detecção-de-mudanças)
  6. [Geração de Tarefas Automáticas](#6-geração-de-tarefas-automáticas)
  7. [Tratamento de Erros](#7-tratamento-de-erros)
  8. [Monitoramento](#8-monitoramento)
  9. [Histórico de Versões](#9-histórico-de-versões)

  ---

  ## 1. Visão Geral

  A **REST API RH** (`proxximatelecomquem.netlify.app`) é a fonte de verdade sobre os colaboradores da Proxxima Telecom. O O.R.I realiza polling a cada 15 minutos via Vercel Cron para detectar admissões, desligamentos e mudanças de setor.

  | Aspecto              | Detalhe                                                    |
  |----------------------|------------------------------------------------------------|
  | URL base             | `https://proxximatelecomquem.netlify.app`                |
  | Autenticação         | **Nenhuma** — API pública (sem token, sem basic auth)       |
  | Formato              | JSON                                                        |
  | Método               | GET                                                         |
  | Frequência de polling| A cada 15 minutos (Vercel Cron)                             |
  | Rota no O.R.I        | `/api/colaboradores/sync` (POST com HMAC)                 |

  > ⚠ **ATENÇÃO:** A REST API RH é pública. Qualquer pessoa com a URL pode consultar os dados. O O.R.I trata os dados como autoritativos mas não como confidenciais.

  ---

  ## 2. Endpoint e Autenticação

  ### Request

  ```http
  GET https://proxximatelecomquem.netlify.app/api/colaboradores
  ```

  ### Response (200 OK)

  ```json
  [
    {
      "MATRICULA": "12345",
      "NOME COMPLETO": "João da Silva",
      "EMAIL DO FUNCIONARIO": "joao.silva@proxximatelecom.com.br",
      "SETOR": "Suporte Técnico",
      "CARGO": "Analista de Suporte",
      "FILIAL": "Matriz",
      "SUPERIOR": "maria.souza@proxximatelecom.com.br",
      "DATA ADMISSAO": "2024-03-15",
      "STATUS": "ATIVO"
    }
  ]
  ```

  ---

  ## 3. Estrutura dos Dados

  ### Mapeamento API RH → Supabase

  | Campo REST API RH        | Coluna Supabase            | Transformação                              |
  |--------------------------|-----------------------------|--------------------------------------------|
  | MATRICULA                | matricula                  | Direto — chave natural de comparação        |
  | NOME COMPLETO            | nome_completo              | Direto                                      |
  | EMAIL DO FUNCIONARIO     | email_corporativo          | Direto — pode ser vazio (sem conta Carbonio)|
  | SETOR                    | setor                      | Direto                                      |
  | CARGO                    | cargo                      | Direto                                      |
  | FILIAL                   | filial                     | Direto                                      |
  | SUPERIOR                 | superior_email             | Direto — e-mail do superior direto          |
  | DATA ADMISSAO            | data_admissao              | Parse para DATE                             |
  | STATUS                   | status                     | Mapeamento: ATIVO→ativo, DESLIGADO→desligado|
  | *(todos os campos)*      | dados_api_rh               | JSON completo para referência futura        |

  ---

  ## 4. Fluxo de Sync

  ### 4.1 Trigger (Vercel Cron)

  ```
  */15 * * * *  →  POST /api/colaboradores/sync
  ```

  O Vercel envia um header `X-Cron-Signature` que a API Route valida com HMAC-SHA256 usando `CRON_SECRET`.

  ### 4.2 Algoritmo de Sync

  ```
  1. GET todos os colaboradores da REST API RH
  2. SELECT todos os colaboradores do Supabase
  3. Para cada registro na API RH:
     a. Se matrícula NÃO existe no Supabase → NOVO (INSERT)
     b. Se matrícula existe e dados mudaram → ALTERADO (UPDATE)
     c. Se status mudou para DESLIGADO → DESLIGAMENTO (UPDATE + gerar offboarding)
  4. Para cada registro no Supabase não presente na API RH:
     → Marcar como 'desligado' (presunção)
  5. Registrar resultado no audit_log
  ```

  ---

  ## 5. Detecção de Mudanças

  | Tipo de mudança     | Campos comparados                  | Ação gerada                                    |
  |---------------------|------------------------------------|-------------------------------------------------|
  | Novo colaborador    | Matrícula não existe no Supabase   | INSERT + tarefas de onboarding                  |
  | Mudança de setor    | SETOR diferente                    | UPDATE + tarefa `zentyal_trocar_grupo`         |
  | Mudança de filial   | FILIAL diferente                   | UPDATE + tarefa `zentyal_trocar_grupo`         |
  | Desligamento        | STATUS = DESLIGADO                 | UPDATE + tarefas de offboarding                  |
  | Atualização de dados| Qualquer campo diferente           | UPDATE na tabela colaboradores                   |

  ---

  ## 6. Geração de Tarefas Automáticas

  ### 6.1 Onboarding (novo colaborador)

  | Tarefa                      | Condição                              | Prioridade | SLA     |
  |-----------------------------|----------------------------------------|------------|---------|
  | `carbonio_criar_conta`    | EMAIL DO FUNCIONARIO vazio             | Alta       | 60 min  |
  | `zentyal_criar_usuario`   | Sempre para novo colaborador           | Alta       | 60 min  |

  ### 6.2 Offboarding (desligamento)

  | Tarefa                      | Condição                              | Prioridade | SLA     |
  |-----------------------------|----------------------------------------|------------|---------|
  | `carbonio_suspender`      | Sempre para desligamento               | Alta       | 30 min  |
  | `zentyal_desativar`       | Sempre para desligamento               | Alta       | 30 min  |
  | `offboarding_completo`    | Checklist completo de desligamento     | Média      | 120 min |

  ---

  ## 7. Tratamento de Erros

  | Erro                          | Comportamento                                     |
  |-------------------------------|---------------------------------------------------|
  | API RH indisponível (timeout) | Retry na próxima execução (15 min). Log no audit_log |
  | Resposta malformada (não-JSON)| Abortar sync. Log de erro. Alerta ao TI           |
  | Matrícula duplicada na API RH | Usar primeiro registro encontrado. Log de warning   |
  | Supabase indisponível         | Abortar sync. Retry na próxima execução            |

  ---

  ## 8. Monitoramento

  | Métrica                             | Onde verificar                          | Alerta                      |
  |--------------------------------------|------------------------------------------|-----------------------------|
  | Sync executou com sucesso            | audit_log: acao=colaborador_sincronizado | Ausência por 1h = alerta    |
  | Novos colaboradores detectados       | audit_log: detalhes.novos > 0            | Notificação automática TI   |
  | Desligamentos detectados             | audit_log: detalhes.desligados > 0       | Notificação automática TI   |
  | Erros de sync                        | Vercel Functions logs                    | Erro 5xx = investigar       |

  ---

  ## 9. Histórico de Versões

  | Versão | Data    | Mudanças                                          |
  |--------|---------|---------------------------------------------------|
  | 1.0    | 2025-01 | Criação: sync básico                              |
  | 3.0    | 2025-03 | Detecção de desligamento, geração de tarefas automáticas, HMAC no cron |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
