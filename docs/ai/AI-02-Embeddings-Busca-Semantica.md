# AI-02 — Embeddings e Busca Semântica

  **Geração de Vetores, Indexação HNSW e Busca por Similaridade**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Inteligência Artificial            |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [O que são Embeddings](#1-o-que-são-embeddings)
  2. [Modelo de Embedding](#2-modelo-de-embedding)
  3. [Geração de Embeddings](#3-geração-de-embeddings)
  4. [Armazenamento (pgvector)](#4-armazenamento-pgvector)
  5. [Índice HNSW](#5-índice-hnsw)
  6. [Busca Semântica](#6-busca-semântica)
  7. [Reindexação](#7-reindexação)
  8. [Histórico de Versões](#8-histórico-de-versões)

  ---

  ## 1. O que são Embeddings

  Embeddings são representações numéricas (vetores) de textos que capturam seu significado semântico. Textos com significado similar produzem vetores próximos no espaço multidimensional. Isso permite buscar por **significado** em vez de por palavras exatas.

  **Exemplo:** "Não consigo acessar meu e-mail" e "Problema para entrar no Carbonio" produzem vetores próximos, mesmo sem compartilhar palavras.

  ---

  ## 2. Modelo de Embedding

  | Aspecto         | Detalhe                              |
  |-----------------|--------------------------------------|
  | Modelo          | Google text-embedding-004            |
  | Dimensão        | 768 floats                           |
  | API key         | Mesma do Gemini (`GEMINI_API_KEY`) |
  | Endpoint        | `/v1beta/models/text-embedding-004:embedContent` |
  | Limite de input | 2.048 tokens (~1.500 palavras)       |

  ---

  ## 3. Geração de Embeddings

  ### Quando gerar

  | Evento                           | Ação                                         |
  |----------------------------------|----------------------------------------------|
  | Artigo da KB criado              | Gerar embedding do título + conteúdo         |
  | Artigo da KB editado             | Regenerar embedding                          |
  | Mensagem do colaborador no bot   | Gerar embedding da mensagem (para busca)     |
  | Reindexação semanal              | Regenerar todos os embeddings modificados     |

  ### Código de geração

  ```typescript
  import { GoogleGenerativeAI } from '@google/generative-ai';

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

  async function gerarEmbedding(texto: string): Promise<number[]> {
    const result = await model.embedContent(texto);
    return result.embedding.values; // float[768]
  }
  ```

  ---

  ## 4. Armazenamento (pgvector)

  ### Coluna de embedding

  ```sql
  -- Na tabela kb_artigos
  embedding vector(768)
  ```

  ### Inserção

  ```sql
  UPDATE kb_artigos
  SET embedding = '[0.012, -0.045, ...]'::vector
  WHERE id = 'uuid-do-artigo';
  ```

  ---

  ## 5. Índice HNSW

  ```sql
  CREATE INDEX idx_kb_embedding ON kb_artigos
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);
  ```

  | Parâmetro          | Valor | Significado                                    |
  |--------------------|-------|------------------------------------------------|
  | m                  | 16    | Conexões por nó — mais = melhor recall, mais memória |
  | ef_construction    | 64    | Candidatos na construção — mais = índice melhor, build mais lento |
  | Operação           | cosine| Similaridade de cosseno (0 a 1)                |

  Adequado para até **5.000 artigos** com latência de busca < 50ms.

  ---

  ## 6. Busca Semântica

  ### Função SQL

  ```sql
  SELECT id, titulo, conteudo, categoria,
         1 - (embedding <=> query_embedding) AS similaridade
  FROM kb_artigos
  WHERE publicado = true
    AND embedding IS NOT NULL
    AND 1 - (embedding <=> query_embedding) >= 0.75
  ORDER BY embedding <=> query_embedding
  LIMIT 5;
  ```

  ### Threshold de similaridade

  | Faixa            | Interpretação                           |
  |------------------|-----------------------------------------|
  | ≥ 0.90           | Muito similar — provavelmente relevante |
  | 0.75 – 0.89      | Similar — possivelmente relevante       |
  | < 0.75           | Pouco similar — descartado              |

  ---

  ## 7. Reindexação

  Cron job semanal (`/api/kb/reindex`, domingo às 03:00) regenera embeddings de artigos modificados na última semana.

  ```
  1. SELECT artigos WHERE atualizado_em > now() - interval '7 days'
  2. Para cada artigo: regenerar embedding via text-embedding-004
  3. UPDATE kb_artigos SET embedding = novo_vetor
  4. Log no audit_log: acao=kb_reindexado, detalhes={ artigos: N }
  ```

  ---

  ## 8. Histórico de Versões

  | Versão | Data    | Mudanças                         |
  |--------|---------|----------------------------------|
  | 3.0    | 2025-03 | Criação: embeddings + pgvector   |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
