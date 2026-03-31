# POP-03 — Onboarding de Colaborador

  **Procedimento Operacional Padrão — Do Sync à Conta Pronta**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Processos e Operação               |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Visão Geral](#1-visão-geral)
  2. [Trigger Automático](#2-trigger-automático)
  3. [Tarefas Geradas](#3-tarefas-geradas)
  4. [Checklist Completo de Onboarding](#4-checklist-completo-de-onboarding)
  5. [SLAs](#5-slas)
  6. [Histórico de Versões](#6-histórico-de-versões)

  ---

  ## 1. Visão Geral

  O onboarding de um novo colaborador na Proxxima Telecom é disparado automaticamente quando o sync com a REST API RH detecta uma matrícula nova. O O.R.I gera todas as tarefas necessárias para que o TI configure as contas e acessos do novo colaborador.

  ---

  ## 2. Trigger Automático

  ```
  Cron (15 min) → /api/colaboradores/sync
    → GET REST API RH
    → Compara com tabela colaboradores
    → Matrícula nova detectada
    → INSERT em colaboradores
    → Gera tarefas de onboarding
    → Notifica TI via Zoho Cliq
  ```

  ---

  ## 3. Tarefas Geradas

  | Tarefa                       | Condição                          | Prioridade | SLA     |
  |------------------------------|-----------------------------------|------------|---------|
  | `carbonio_criar_conta`     | EMAIL DO FUNCIONARIO vazio na API | Alta       | 60 min  |
  | `zentyal_criar_usuario`    | Sempre                            | Alta       | 60 min  |

  > ℹ Se o colaborador já vem com e-mail preenchido na REST API RH, a tarefa `carbonio_criar_conta` não é gerada (conta já existe).

  ---

  ## 4. Checklist Completo de Onboarding

  | #  | Tarefa                              | Sistema       | Automático | SLA     |
  |----|--------------------------------------|---------------|------------|---------|
  | 1  | Detectar novo colaborador            | O.R.I (sync)  | Sim        | 15 min  |
  | 2  | Criar conta de e-mail Carbonio       | Carbonio      | Não (card) | 60 min  |
  | 3  | Criar usuário no Zentyal             | Zentyal       | Não (card) | 60 min  |
  | 4  | Adicionar ao grupo Samba correto     | Zentyal       | Não (card) | incluso |
  | 5  | Solicitar crachá RFID (RH faz)      | Bot O.R.I     | Parcial    | 240 min |
  | 6  | Cadastrar RFID no iNControl          | iNControl     | Não (card) | 120 min |
  | 7  | Cadastrar RFID no Topdata            | Topdata Inner | Não (card) | 120 min |
  | 8  | Boas-vindas via bot Zoho Cliq        | O.R.I         | Sim        | Imediato|

  ---

  ## 5. SLAs

  | Métrica                                | Valor alvo      |
  |----------------------------------------|-----------------|
  | Tempo entre admissão e sync            | ≤ 15 minutos    |
  | Tempo entre sync e contas prontas      | ≤ 2 horas       |
  | Tempo total (admissão → tudo pronto)   | ≤ 4 horas       |

  ---

  ## 6. Histórico de Versões

  | Versão | Data    | Mudanças                                           |
  |--------|---------|----------------------------------------------------|
  | 1.0    | 2025-01 | Criação: onboarding básico                         |
  | 3.0    | 2025-03 | Detecção automática, tarefas com cards, SLAs       |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
