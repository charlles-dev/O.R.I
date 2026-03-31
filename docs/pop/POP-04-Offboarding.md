# POP-04 — Offboarding de Colaborador

  **Procedimento Operacional Padrão — Detecção de Desligamento e Revogação de Acessos**

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
  4. [Checklist de Offboarding](#4-checklist-de-offboarding)
  5. [SLAs](#5-slas)
  6. [Histórico de Versões](#6-histórico-de-versões)

  ---

  ## 1. Visão Geral

  O offboarding é disparado automaticamente quando o sync detecta que o STATUS do colaborador na REST API RH mudou para DESLIGADO. O O.R.I gera todas as tarefas necessárias para revogar os acessos do ex-colaborador.

  ---

  ## 2. Trigger Automático

  ```
  Cron (15 min) → /api/colaboradores/sync
    → STATUS = 'DESLIGADO' detectado
    → UPDATE colaboradores: status = 'desligado'
    → Gera tarefas de offboarding
    → Notifica TI via Zoho Cliq: "Desligamento detectado: [nome]"
  ```

  ---

  ## 3. Tarefas Geradas

  | Tarefa                       | Prioridade | SLA     | Ação                                    |
  |------------------------------|------------|---------|------------------------------------------|
  | `carbonio_suspender`       | Alta       | 30 min  | Suspender conta de e-mail (não deletar)  |
  | `zentyal_desativar`        | Alta       | 60 min  | Desabilitar usuário e revogar grupos      |
  | `offboarding_completo`     | Média      | 120 min | Checklist geral: devolver equipamentos, desativar crachá, revogar acessos restantes |

  ---

  ## 4. Checklist de Offboarding

  | #  | Item                                     | Sistema         | Automático | Urgência |
  |----|------------------------------------------|-----------------|------------|----------|
  | 1  | Detectar desligamento                    | O.R.I (sync)    | Sim        | Imediato |
  | 2  | Suspender conta Carbonio                 | Carbonio        | Não (card) | 30 min   |
  | 3  | Desativar usuário Zentyal                | Zentyal         | Não (card) | 60 min   |
  | 4  | Revogar acesso Samba (remover grupos)    | Zentyal         | Não (card) | incluso  |
  | 5  | Desativar crachá RFID no iNControl       | iNControl       | Não (card) | 120 min  |
  | 6  | Desativar ponto no Topdata              | Topdata Inner   | Não (card) | 120 min  |
  | 7  | Recolher equipamentos (ativos)           | Painel TI       | Parcial    | 1 dia    |
  | 8  | Atualizar tabela `ativos`              | O.R.I           | Não (TI)   | 1 dia    |
  | 9  | Marcar `rfid_crachas.ativo = false`    | O.R.I           | Sim (ao concluir cards) | Auto |

  ---

  ## 5. SLAs

  | Métrica                                  | Valor alvo        |
  |------------------------------------------|-------------------|
  | Suspensão de e-mail                      | ≤ 30 minutos      |
  | Revogação de acessos de rede             | ≤ 60 minutos      |
  | Checklist completo (todos os acessos)    | ≤ 4 horas         |
  | Recolhimento de equipamentos             | ≤ 1 dia útil      |

  ---

  ## 6. Histórico de Versões

  | Versão | Data    | Mudanças                                        |
  |--------|---------|-------------------------------------------------|
  | 1.0    | 2025-01 | Criação: processo básico                        |
  | 3.0    | 2025-03 | Detecção automática, checklist com SLAs         |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
