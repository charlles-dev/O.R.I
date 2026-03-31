# AI-01 — Visão Geral do Módulo de IA

  **Arquitetura, Capacidades e Fluxos do Módulo de Inteligência Artificial**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Inteligência Artificial            |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Introdução](#1-introdução)
  2. [Capacidades](#2-capacidades)
  3. [Stack de IA](#3-stack-de-ia)
  4. [Arquitetura do Módulo](#4-arquitetura-do-módulo)
  5. [Fluxo de Dados](#5-fluxo-de-dados)
  6. [Limitações](#6-limitações)
  7. [Histórico de Versões](#7-histórico-de-versões)

  ---

  ## 1. Introdução

  O módulo de IA é uma novidade da v3.0 do O.R.I. Utiliza o **Google Gemini 2.5 Flash** para processamento de linguagem natural em português brasileiro, combinado com **busca semântica vetorial** via pgvector no Supabase.

  O objetivo principal é **reduzir a carga operacional** da equipe de TI (2 técnicos para 1.500+ colaboradores) automatizando a triagem e resolução de chamados recorrentes.

  ---

  ## 2. Capacidades

  | Capacidade                   | Descrição                                                | Documentação detalhada |
  |------------------------------|-----------------------------------------------------------|------------------------|
  | Triagem de chamados          | Classificação automática de chamados por categoria e prioridade | AI-04               |
  | Busca semântica na KB        | Encontra artigos relevantes por similaridade de significado | AI-02                 |
  | Sugestão de solução          | Sugere solução ao colaborador baseada em artigos da KB     | AI-04                 |
  | Resumos automáticos          | Resumo de chamados longos para o TI                        | AI-05                 |
  | Análise de padrões           | Identificação de problemas recorrentes (relatório semanal) | AI-06                 |

  ---

  ## 3. Stack de IA

  | Componente                 | Tecnologia                    | Uso                              |
  |----------------------------|-------------------------------|----------------------------------|
  | LLM (geração de texto)     | Google Gemini 2.5 Flash       | Triagem, sugestões, resumos      |
  | Embeddings                 | Google text-embedding-004     | Vetorização de textos para busca |
  | Vector store               | Supabase pgvector             | Armazenamento e busca de vetores |
  | Índice vetorial            | HNSW (m=16, ef=64)           | Busca aproximada eficiente       |
  | Dimensão dos vetores       | 768 floats                   | Padrão do text-embedding-004     |

  ---

  ## 4. Arquitetura do Módulo

  ```
  Mensagem do colaborador
      ↓
  [text-embedding-004] → Gera embedding do texto
      ↓
  [pgvector] → Busca artigos similares (top 5, similaridade ≥ 0.75)
      ↓
  [Gemini 2.5 Flash] → Prompt contextualizado (sistema + artigos + mensagem)
      ↓
  Resposta JSON { categoria, prioridade, confianca, resposta, requer_ti }
      ↓
  Se confiança ≥ 0.75 → Bot responde ao colaborador
  Se confiança < 0.75 → Cria chamado no GLPI
  ```

  ---

  ## 5. Fluxo de Dados

  | Etapa | Dado                          | De                | Para               | Formato           |
  |-------|-------------------------------|--------------------|--------------------|---------------------|
  | 1     | Texto da mensagem             | Zoho Cliq          | API Route          | String (PT-BR)     |
  | 2     | Embedding da mensagem         | API Route          | Google AI          | float[768]         |
  | 3     | Query de similaridade         | API Route          | Supabase pgvector  | SQL + vector       |
  | 4     | Artigos relevantes            | Supabase           | API Route          | JSON               |
  | 5     | Prompt contextualizado        | API Route          | Google Gemini      | String (prompt)    |
  | 6     | Resposta de triagem           | Google Gemini      | API Route          | JSON (structured)  |
  | 7     | Resposta ao colaborador       | API Route          | Zoho Cliq          | Card interativo    |

  ---

  ## 6. Limitações

  | Limitação                                | Impacto                                     | Mitigação                        |
  |------------------------------------------|---------------------------------------------|----------------------------------|
  | IA pode errar (~10% dos casos)           | Colaborador recebe resposta errada           | Botões de feedback + fallback    |
  | Dados são enviados ao Google             | Privacidade — ver AI-08                      | Dados mínimos no prompt          |
  | Dependência de API externa               | Indisponibilidade = sem triagem              | Fallback direto para GLPI        |
  | Qualidade depende da KB                  | KB vazia = IA sem contexto                   | Manutenção contínua da KB        |
  | Latência variável (1-5s)                 | Colaborador espera no bot                    | Mensagem "processando..."        |

  ---

  ## 7. Histórico de Versões

  | Versão | Data    | Mudanças                                  |
  |--------|---------|-------------------------------------------|
  | 3.0    | 2025-03 | Criação do módulo de IA completo          |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
