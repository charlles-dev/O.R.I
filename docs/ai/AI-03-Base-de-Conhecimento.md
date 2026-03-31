# AI-03 — Base de Conhecimento (KB)

  **Estrutura, Ciclo de Vida e Manutenção de Artigos**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Inteligência Artificial            |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Propósito da KB](#1-propósito-da-kb)
  2. [Estrutura de um Artigo](#2-estrutura-de-um-artigo)
  3. [Ciclo de Vida](#3-ciclo-de-vida)
  4. [Categorias](#4-categorias)
  5. [Métricas de Qualidade](#5-métricas-de-qualidade)
  6. [Boas Práticas para Redação](#6-boas-práticas-para-redação)
  7. [Manutenção](#7-manutenção)
  8. [Histórico de Versões](#8-histórico-de-versões)

  ---

  ## 1. Propósito da KB

  A Base de Conhecimento é o **"cérebro"** da IA do O.R.I. Quando um colaborador envia uma mensagem ao bot, a IA busca artigos relevantes na KB para fundamentar sua resposta. Sem artigos, a IA não tem contexto e não consegue responder com qualidade.

  | Métrica          | Impacto                                               |
  |------------------|--------------------------------------------------------|
  | KB vazia         | IA responde de forma genérica — baixa taxa de resolução |
  | KB com artigos   | IA contextualiza e sugere soluções específicas          |
  | KB bem mantida   | Taxa de resolução por IA ≥ 40%                          |

  ---

  ## 2. Estrutura de um Artigo

  | Campo           | Tipo       | Descrição                                          |
  |-----------------|------------|-----------------------------------------------------|
  | Título          | Texto      | Descrição clara do problema ou procedimento          |
  | Conteúdo        | Markdown   | Solução completa, passo a passo                      |
  | Categoria       | Texto      | Área do problema (email, rede, vpn, hardware, etc.)  |
  | Tags            | Lista      | Palavras-chave para busca (ex: ["carbonio", "smtp"]) |
  | Publicado       | Boolean    | Se visível para a IA na busca semântica              |
  | Embedding       | Vector(768)| Gerado automaticamente pelo text-embedding-004       |

  ---

  ## 3. Ciclo de Vida

  ```
  Rascunho → Publicado → Ativo (usado pela IA)
                            ↓
                      Feedback negativo recorrente
                            ↓
                      Revisão → Atualizar ou Despublicar
  ```

  ---

  ## 4. Categorias

  | Categoria     | Exemplos de artigos                                    |
  |---------------|--------------------------------------------------------|
  | email         | "Como acessar o Carbonio remotamente", "Recuperar e-mail excluído" |
  | rede          | "VPN não conecta", "Internet lenta na filial X"        |
  | vpn           | "Configurar VPN no Windows", "Erro de certificado VPN" |
  | acesso        | "Não consigo entrar no Zentyal", "Senha expirada"      |
  | hardware      | "Impressora não imprime", "Monitor sem sinal"           |
  | software      | "Office não ativa", "Erro no sistema X"                 |
  | ponto         | "Crachá não registra ponto", "Ajuste de marcação"       |
  | geral         | Artigos que não se encaixam em outra categoria           |

  ---

  ## 5. Métricas de Qualidade

  | Métrica               | Cálculo                              | Meta           |
  |-----------------------|---------------------------------------|----------------|
  | Taxa de utilidade     | util_count / (util_count + nao_util_count) | ≥ 80%      |
  | Artigos publicados    | COUNT WHERE publicado = true         | ≥ 50           |
  | Artigos sem embedding | COUNT WHERE embedding IS NULL        | 0              |
  | Artigos sem feedback  | COUNT WHERE util_count + nao_util_count = 0 | < 20%   |

  ---

  ## 6. Boas Práticas para Redação

  | Prática                                    | Motivo                                    |
  |---------------------------------------------|-------------------------------------------|
  | Título descritivo e específico              | Ajuda a IA a encontrar o artigo relevante |
  | Passos numerados com detalhes               | Colaborador consegue seguir sozinho        |
  | Incluir screenshots quando possível         | Reduz ambiguidade                         |
  | Usar linguagem simples e direta             | Público não-técnico (colaboradores)        |
  | Incluir variações do problema no início     | Melhora a busca semântica                 |
  | Atualizar quando procedimento mudar         | Evitar artigos desatualizados              |
  | Marcar artigos inúteis como despublicados   | Não poluir resultados da IA                |

  ---

  ## 7. Manutenção

  | Atividade                    | Frequência     | Responsável |
  |------------------------------|----------------|-------------|
  | Revisar artigos com baixa taxa de utilidade | Semanal | TI     |
  | Criar artigos para problemas recorrentes | Contínuo    | TI          |
  | Reindexar embeddings                     | Semanal (cron) | Automático |
  | Despublicar artigos obsoletos            | Mensal         | TI          |

  ---

  ## 8. Histórico de Versões

  | Versão | Data    | Mudanças                                |
  |--------|---------|-----------------------------------------|
  | 3.0    | 2025-03 | Criação: KB semântica com embeddings    |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
