# AI-06 — Monitoramento e Métricas de IA

  **Indicadores de Desempenho, Alertas e Dashboards**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Inteligência Artificial            |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Métricas Principais](#1-métricas-principais)
  2. [Fontes de Dados](#2-fontes-de-dados)
  3. [Relatório Semanal](#3-relatório-semanal)
  4. [Alertas](#4-alertas)
  5. [Melhoria Contínua](#5-melhoria-contínua)
  6. [Histórico de Versões](#6-histórico-de-versões)

  ---

  ## 1. Métricas Principais

  | Métrica                              | Fórmula / Query                          | Meta        | Frequência  |
  |---------------------------------------|------------------------------------------|-------------|-------------|
  | Taxa de resolução por IA              | Chamados resolvidos por IA / total       | ≥ 40%       | Semanal     |
  | Tempo médio de resposta da IA         | avg(tempo_processamento_ms)              | < 3.000ms   | Diário      |
  | Confiança média das triagens          | avg(confianca_ia)                        | ≥ 0.75      | Semanal     |
  | Taxa de feedback positivo             | util_count / (util + nao_util)           | ≥ 80%       | Semanal     |
  | Chamados escalados para GLPI          | Chamados com confiança < 0.75            | < 60%       | Semanal     |
  | Artigos da KB sem feedback            | KB com util+nao_util = 0                 | < 20%       | Mensal      |
  | Custo mensal da API Gemini            | Google AI Studio billing                 | < R$ 100    | Mensal      |

  ---

  ## 2. Fontes de Dados

  | Fonte              | Dados                                         |
  |--------------------|------------------------------------------------|
  | audit_log          | Triagens, confiança, artigos usados, resultados|
  | chamados           | Taxa de resolução, tempo de resposta            |
  | kb_artigos         | Contadores de utilidade (util/nao_util)         |
  | Vercel Functions   | Latência, error rate, invocations               |
  | Google AI Studio   | Uso de tokens, custo, rate limits               |

  ---

  ## 3. Relatório Semanal

  Gerado automaticamente pelo cron job `/api/relatorios/semanal` (segunda-feira às 08:00) e enviado ao canal TI via Zoho Cliq.

  ### Conteúdo do relatório

  ```
  📊 Relatório Semanal O.R.I — Semana de DD/MM a DD/MM

  🤖 IA
  - Triagens realizadas: 150
  - Resolvidas pela IA: 68 (45%)
  - Escaladas para TI: 82 (55%)
  - Confiança média: 0.79
  - Tempo médio de resposta: 2.1s

  📋 Chamados
  - Abertos: 82
  - Resolvidos: 75
  - Tempo médio de resolução: 3.2h
  - SLA cumprido: 91%

  📚 KB
  - Artigos publicados: 47
  - Artigos mais úteis: [Top 3]
  - Artigos com baixa avaliação: [lista]

  ⚠ Alertas
  - 2 artigos com taxa de utilidade < 50%
  - API Gemini: 42% da quota mensal utilizada
  ```

  ---

  ## 4. Alertas

  | Condição                                | Ação                                   |
  |------------------------------------------|----------------------------------------|
  | Taxa de resolução por IA < 30% (7 dias)  | Revisar artigos da KB                  |
  | Confiança média < 0.70 (7 dias)          | Verificar qualidade dos artigos         |
  | API Gemini: quota > 80%                  | Alerta de orçamento                     |
  | Tempo de resposta > 5s (média diária)    | Verificar latência da API               |
  | Fallback ativado > 5 vezes em 1 hora     | Verificar disponibilidade Gemini API    |

  ---

  ## 5. Melhoria Contínua

  ```
  1. Analisar relatório semanal
  2. Identificar categorias com baixa taxa de resolução
  3. Verificar se existem artigos na KB para essas categorias
  4. Se não → criar artigos
  5. Se sim mas taxa baixa → revisar qualidade dos artigos
  6. Monitorar na próxima semana se a taxa melhorou
  ```

  ---

  ## 6. Histórico de Versões

  | Versão | Data    | Mudanças                              |
  |--------|---------|---------------------------------------|
  | 3.0    | 2025-03 | Criação: métricas e relatório semanal |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
