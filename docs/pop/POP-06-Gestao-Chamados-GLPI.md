# POP-06 — Gestão de Chamados GLPI

  **Procedimento Operacional Padrão — Ciclo de Vida do Chamado no O.R.I + GLPI**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Processos e Operação               |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Ciclo de Vida do Chamado](#1-ciclo-de-vida-do-chamado)
  2. [Abertura de Chamado](#2-abertura-de-chamado)
  3. [Triagem com IA](#3-triagem-com-ia)
  4. [Atendimento pelo TI](#4-atendimento-pelo-ti)
  5. [Encerramento](#5-encerramento)
  6. [Métricas](#6-métricas)
  7. [Histórico de Versões](#7-histórico-de-versões)

  ---

  ## 1. Ciclo de Vida do Chamado

  ```
  Colaborador → Bot Zoho → Triagem IA → Alta confiança? 
    Sim → Responde pelo bot → Resolveu? Sim → Fechado
                                          Não → Cria chamado GLPI
    Não → Cria chamado GLPI → TI atende → Resolve → Fecha
  ```

  ### Status possíveis

  | Status        | Significado                                        |
  |---------------|----------------------------------------------------|
  | aberto        | Chamado criado, aguardando atribuição               |
  | em_andamento  | TI assumiu o chamado                                |
  | resolvido     | Solução aplicada, aguardando confirmação             |
  | fechado       | Chamado encerrado (confirmado ou timeout)            |
  | cancelado     | Chamado cancelado pelo colaborador ou TI             |

  ---

  ## 2. Abertura de Chamado

  ### 2.1 Via Bot (automático)

  - Colaborador envia mensagem ao bot
  - IA classifica com confiança < 0.75
  - O.R.I cria chamado no Supabase + GLPI
  - Notifica TI via Zoho Cliq

  ### 2.2 Via Painel TI (manual)

  - TI acessa Painel → Chamados → Novo Chamado
  - Preenche: colaborador, descrição, categoria, prioridade
  - Chamado criado localmente (opcional: sincronizar com GLPI)

  ---

  ## 3. Triagem com IA

  | Resultado IA             | Ação                                              |
  |--------------------------|---------------------------------------------------|
  | Confiança ≥ 0.75         | Bot responde com solução + botões de feedback      |
  | Colaborador clica "Resolveu" | Chamado fechado, artigo recebe `util_count++`  |
  | Colaborador clica "Não resolveu" | Chamado criado no GLPI, TI notificado       |
  | Confiança < 0.75         | Chamado criado diretamente no GLPI                 |
  | Erro na API Gemini       | Chamado criado no GLPI (fallback sem IA)           |

  ---

  ## 4. Atendimento pelo TI

  1. TI recebe notificação via Zoho Cliq
  2. Acessa Painel O.R.I → Chamados → chamado em questão
  3. Clica "Assumir" → status muda para `em_andamento`
  4. Analisa descrição e resposta da IA (se disponível)
  5. Investiga e resolve o problema
  6. Preenche campo "Solução" no chamado
  7. Marca como "Resolvido"
  8. Chamado é sincronizado com GLPI

  ---

  ## 5. Encerramento

  | Cenário                                   | Ação                          |
  |-------------------------------------------|-------------------------------|
  | Colaborador confirma resolução            | Chamado fechado               |
  | Sem resposta do colaborador por 7 dias    | Fechamento automático         |
  | Problema recorrente resolvido             | Criar artigo na KB            |

  ---

  ## 6. Métricas

  | Métrica                                   | Meta          |
  |-------------------------------------------|---------------|
  | Tempo médio de primeira resposta          | ≤ 30 minutos  |
  | Tempo médio de resolução                  | ≤ 4 horas     |
  | Taxa de resolução por IA                  | ≥ 40%         |
  | Satisfação do colaborador (feedback bot)  | ≥ 80% positivo|
  | Chamados sem atribuição por > 1 hora      | 0             |

  ---

  ## 7. Histórico de Versões

  | Versão | Data    | Mudanças                                        |
  |--------|---------|-------------------------------------------------|
  | 1.0    | 2025-01 | Criação: gestão básica de chamados              |
  | 3.0    | 2025-03 | Triagem com IA, feedback loop, métricas         |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
