# POP-05 — Guia do Técnico de TI

  **Manual Operacional Diário — Rotinas, Prioridades e Uso do Painel O.R.I**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Processos e Operação               |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Perfil e Responsabilidades](#1-perfil-e-responsabilidades)
  2. [Rotina Diária](#2-rotina-diária)
  3. [Usando o Painel O.R.I](#3-usando-o-painel-ori)
  4. [Priorizando Tarefas](#4-priorizando-tarefas)
  5. [Executando Tarefas Manuais](#5-executando-tarefas-manuais)
  6. [Gerenciando Chamados](#6-gerenciando-chamados)
  7. [Administrando a KB](#7-administrando-a-kb)
  8. [Dicas e Boas Práticas](#8-dicas-e-boas-práticas)
  9. [Histórico de Versões](#9-histórico-de-versões)

  ---

  ## 1. Perfil e Responsabilidades

  A equipe de TI da Proxxima Telecom é composta por **2 técnicos** que atendem **1.500+ colaboradores** distribuídos em múltiplas filiais.

  | Responsabilidade            | Ferramenta                    |
  |-----------------------------|-------------------------------|
  | Monitorar Central de Tarefas | Painel O.R.I                 |
  | Executar tarefas manuais     | Carbonio, Zentyal, iNControl, Topdata |
  | Gerenciar chamados           | Painel O.R.I + GLPI          |
  | Manter KB atualizada         | Painel O.R.I                 |
  | Monitorar audit log          | Painel O.R.I                 |
  | Gerenciar ativos             | Painel O.R.I                 |

  ---

  ## 2. Rotina Diária

  ### Início do dia (08:00)

  1. Acessar Painel O.R.I → Dashboard
  2. Verificar tarefas pendentes (prioridade alta primeiro)
  3. Verificar chamados não atribuídos
  4. Verificar relatório semanal (segundas-feiras)

  ### Durante o dia

  5. Monitorar notificações Zoho Cliq do O.R.I
  6. Executar tarefas conforme SLA (priorizar por urgência)
  7. Responder chamados que a IA não resolveu
  8. Atualizar KB com soluções recorrentes

  ### Final do dia (17:00)

  9. Verificar que não há tarefas com SLA excedido
  10. Atualizar status de chamados em andamento
  11. Registrar evidências de tarefas concluídas

  ---

  ## 3. Usando o Painel O.R.I

  ### Seções do painel

  | Seção              | Funcionalidade                                     |
  |--------------------|----------------------------------------------------|
  | Dashboard          | Resumo: tarefas pendentes, chamados, métricas       |
  | Central de Tarefas | Fila de tarefas manuais com filtros                 |
  | Chamados           | Lista de chamados com status e filtros              |
  | KB (Base de Conhecimento) | CRUD de artigos, métricas de utilidade       |
  | Colaboradores      | Lista de colaboradores sincronizados                |
  | Ativos             | Inventário de equipamentos                          |
  | Auditoria          | Log de eventos do sistema                           |
  | Relatórios         | Relatórios de SLA, taxa de IA, métricas             |

  ---

  ## 4. Priorizando Tarefas

  | Prioridade | Cor     | Exemplos de tarefas                        | SLA típico |
  |------------|---------|---------------------------------------------|------------|
  | Crítica    | 🔴      | Offboarding urgente, brecha de segurança    | 30 min     |
  | Alta       | 🟠      | Criar conta, reset de senha                 | 60 min     |
  | Média      | 🟡      | Trocar grupo, cadastrar crachá              | 120 min    |
  | Baixa      | 🟢      | Atualizar KB, configurar impressora          | 1 dia      |

  ### Regra geral de priorização

  1. Tarefas com SLA prestes a expirar
  2. Tarefas de prioridade alta e crítica
  3. Chamados não atribuídos
  4. Tarefas de prioridade média
  5. Tarefas de prioridade baixa e melhorias na KB

  ---

  ## 5. Executando Tarefas Manuais

  Cada card de tarefa mostra:
  - **Tipo:** operação a ser executada (ex: `carbonio_criar_conta`)
  - **Colaborador:** nome e e-mail
  - **Dados:** campos necessários com botão "Copiar"
  - **SLA:** tempo restante com indicador visual
  - **Guia:** instruções passo a passo

  ### Workflow

  1. Clicar em "Assumir" → tarefa é atribuída a você
  2. Status muda para "Em andamento"
  3. Seguir instruções do card
  4. Ao concluir → clicar "Concluir" → preencher evidência
  5. Tarefa registrada no audit_log

  ---

  ## 6. Gerenciando Chamados

  - Chamados com `resolvido_por_ia = false` precisam de atenção manual
  - Verificar resposta da IA — às vezes pode ser útil como ponto de partida
  - Após resolver, atualizar o GLPI (se sincronizado)
  - Se o problema é recorrente → criar artigo na KB

  ---

  ## 7. Administrando a KB

  | Ação                  | Quando                                          |
  |-----------------------|-------------------------------------------------|
  | Criar artigo          | Problema recorrente sem solução na KB            |
  | Editar artigo         | Solução desatualizada ou incompleta              |
  | Despublicar artigo    | Artigo com `nao_util_count` alto               |
  | Monitorar métricas    | Semanalmente — identificar artigos pouco úteis   |

  ---

  ## 8. Dicas e Boas Práticas

  - Mantenha o painel aberto durante o dia — as notificações Zoho complementam
  - Use os botões "Copiar" dos cards — evite redigitar dados
  - Registre sempre evidências (screenshots) — protege o TI em auditorias
  - Se a IA está errando frequentemente → revisar/atualizar os artigos da KB
  - Documente soluções criativas na KB para futuras referências

  ---

  ## 9. Histórico de Versões

  | Versão | Data    | Mudanças                                   |
  |--------|---------|--------------------------------------------|
  | 1.0    | 2025-01 | Criação: guia básico                       |
  | 3.0    | 2025-03 | Cards, SLAs, rotina diária, priorização    |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
