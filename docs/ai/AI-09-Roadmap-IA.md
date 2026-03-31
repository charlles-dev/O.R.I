# AI-09 — Roadmap de IA

  **Evolução Planejada do Módulo de Inteligência Artificial**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Inteligência Artificial            |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Visão de Longo Prazo](#1-visão-de-longo-prazo)
  2. [Fases do Roadmap](#2-fases-do-roadmap)
  3. [Backlog de Melhorias](#3-backlog-de-melhorias)
  4. [Critérios de Priorização](#4-critérios-de-priorização)
  5. [Histórico de Versões](#5-histórico-de-versões)

  ---

  ## 1. Visão de Longo Prazo

  O módulo de IA deve evoluir para ser cada vez mais autônomo na resolução de chamados, reduzindo progressivamente a carga sobre a equipe de TI. A meta de longo prazo é alcançar **60-70% de resolução automática**, sem sacrificar qualidade ou segurança.

  ---

  ## 2. Fases do Roadmap

  ### Fase 1 — v3.0 (atual, 2025 Q1)

  | Item                                    | Status      |
  |------------------------------------------|-------------|
  | Triagem de chamados com Gemini 2.5 Flash | ✅ Implementado |
  | Busca semântica na KB com pgvector       | ✅ Implementado |
  | Feedback loop (util/nao_util)            | ✅ Implementado |
  | Fallback para GLPI sem IA                | ✅ Implementado |
  | Resumos automáticos                      | ✅ Implementado |
  | Relatório semanal de métricas            | ✅ Implementado |

  ### Fase 2 — v3.1 (2025 Q2-Q3)

  | Item                                    | Status      |
  |------------------------------------------|-------------|
  | Análise de sentimento nas mensagens      | 📋 Planejado |
  | Sugestão de artigos KB para o TI criar   | 📋 Planejado |
  | Multi-turn conversations no bot          | 📋 Planejado |
  | Dashboard de métricas de IA no painel    | 📋 Planejado |
  | Fine-tuning com dados históricos         | 📋 Em avaliação |

  ### Fase 3 — v4.0 (2026)

  | Item                                    | Status      |
  |------------------------------------------|-------------|
  | Automação condicional (se API disponível) | 📋 Planejado |
  | Integração com mais LLMs (fallback)      | 📋 Planejado |
  | Análise preditiva de chamados            | 📋 Planejado |
  | RAG avançado com chunks de documentos     | 📋 Planejado |
  | Bot proativo (detecta problemas antes)   | 🔬 Pesquisa  |

  ---

  ## 3. Backlog de Melhorias

  | ID   | Melhoria                                    | Impacto | Esforço | Prioridade |
  |------|----------------------------------------------|---------|---------|------------|
  | IM-1 | Multi-turn: bot mantém contexto da conversa  | Alto    | Médio   | Alta       |
  | IM-2 | Sugestão automática de novos artigos KB      | Médio   | Baixo   | Alta       |
  | IM-3 | Análise de sentimento (detectar frustração)  | Médio   | Baixo   | Média      |
  | IM-4 | Cache de embeddings para queries frequentes  | Baixo   | Baixo   | Média      |
  | IM-5 | A/B testing de prompts                       | Alto    | Alto    | Baixa      |
  | IM-6 | Classificação multi-label (mais de 1 categoria) | Médio | Médio  | Baixa      |
  | IM-7 | Integração com Anthropic Claude como fallback | Médio  | Médio   | Baixa      |

  ---

  ## 4. Critérios de Priorização

  | Critério             | Peso |
  |----------------------|------|
  | Impacto na taxa de resolução por IA | 40%  |
  | Esforço de implementação            | 30%  |
  | Risco técnico                       | 20%  |
  | Custo operacional adicional         | 10%  |

  ---

  ## 5. Histórico de Versões

  | Versão | Data    | Mudanças                    |
  |--------|---------|-----------------------------|
  | 3.0    | 2025-03 | Criação: roadmap inicial    |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
