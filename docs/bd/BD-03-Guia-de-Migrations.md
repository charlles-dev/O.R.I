# BD-03 — Guia de Migrations

  **Processo de Criação, Aplicação e Rollback de Migrations Supabase**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Banco de Dados                     |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Pré-requisitos](#1-pré-requisitos)
  2. [Estrutura de Migrations](#2-estrutura-de-migrations)
  3. [Criando uma Migration](#3-criando-uma-migration)
  4. [Aplicando Migrations](#4-aplicando-migrations)
  5. [Rollback de Migrations](#5-rollback-de-migrations)
  6. [Boas Práticas](#6-boas-práticas)
  7. [Troubleshooting](#7-troubleshooting)
  8. [Histórico de Versões](#8-histórico-de-versões)

  ---

  ## 1. Pré-requisitos

  | Ferramenta     | Versão mínima | Instalação                           |
  |----------------|---------------|---------------------------------------|
  | Supabase CLI   | 1.100+        | `npm install -g supabase`           |
  | Docker Desktop | 24.0+         | Necessário para Supabase local        |
  | Node.js        | 18 LTS        | Runtime do projeto                    |

  ### Verificação

  ```bash
  supabase --version       # Deve retornar >= 1.100
  supabase status          # Deve mostrar banco local rodando
  ```

  ---

  ## 2. Estrutura de Migrations

  ```
  supabase/
    migrations/
      20250101000000_initial_schema.sql
      20250115000000_add_kb_artigos.sql
      20250201000000_add_rfid_crachas.sql
      20250301000000_add_pgvector_kb.sql
    seed.sql
    config.toml
  ```

  ### Convenção de nomes

  ```
  {YYYYMMDDHHMMSS}_{descricao_em_snake_case}.sql
  ```

  ---

  ## 3. Criando uma Migration

  ### 3.1 Gerar arquivo de migration

  ```bash
  supabase migration new add_coluna_exemplo
  ```

  Cria: `supabase/migrations/{timestamp}_add_coluna_exemplo.sql`

  ### 3.2 Escrever SQL da migration

  ```sql
  -- supabase/migrations/{timestamp}_add_coluna_exemplo.sql

  -- UP: Adicionar coluna
  ALTER TABLE colaboradores ADD COLUMN telefone VARCHAR(20);

  -- Comentário para rollback:
  -- DOWN: ALTER TABLE colaboradores DROP COLUMN telefone;
  ```

  ### 3.3 Testar localmente

  ```bash
  supabase db reset          # Recria o banco local e aplica todas as migrations
  supabase migration list    # Verifica o status de todas as migrations
  ```

  ---

  ## 4. Aplicando Migrations

  ### 4.1 Ambiente local

  ```bash
  supabase db reset    # Aplica todas as migrations do zero (destrutivo)
  ```

  ### 4.2 Staging

  ```bash
  supabase db push --db-url "$SUPABASE_STAGING_DB_URL"
  ```

  ### 4.3 Produção

  ```bash
  # SEMPRE aplicar em staging primeiro e validar
  supabase db push --db-url "$SUPABASE_PROD_DB_URL"
  ```

  > ⚠ **CRÍTICO:** Nunca aplique migrations diretamente em produção sem testar em staging primeiro.

  ### 4.4 Verificação pós-aplicação

  ```bash
  supabase migration list --db-url "$DB_URL"
  ```

  Resultado esperado: todas as migrations com status "Applied".

  ---

  ## 5. Rollback de Migrations

  O Supabase CLI não tem rollback automático. O processo é manual.

  ### 5.1 Criar migration de rollback

  ```bash
  supabase migration new rollback_add_coluna_exemplo
  ```

  ### 5.2 Escrever SQL inverso

  ```sql
  -- Reverter a migration anterior
  ALTER TABLE colaboradores DROP COLUMN IF EXISTS telefone;
  ```

  ### 5.3 Aplicar rollback

  ```bash
  # Em staging primeiro
  supabase db push --db-url "$SUPABASE_STAGING_DB_URL"

  # Validar em staging

  # Depois em produção
  supabase db push --db-url "$SUPABASE_PROD_DB_URL"
  ```

  ### 5.4 Relação com rollback de código (Vercel)

  Se o rollback de código no Vercel precisa de schema antigo:

  1. **Primeiro:** aplicar migration de rollback no Supabase
  2. **Depois:** fazer rollback do código no Vercel

  Ver ARQ-05 para o procedimento completo de rollback.

  ---

  ## 6. Boas Práticas

  | Prática                              | Motivo                                              |
  |---------------------------------------|------------------------------------------------------|
  | Uma responsabilidade por migration     | Facilita rollback granular                           |
  | Sempre incluir SQL de rollback em comentário | Referência rápida para emergências              |
  | Migrations devem ser idempotentes quando possível | `IF NOT EXISTS`, `IF EXISTS`              |
  | Nunca alterar uma migration já aplicada | Criar nova migration corretiva                     |
  | Testar com `supabase db reset` localmente | Garante que todas rodam na ordem                |
  | Migrations aditivas são preferíveis    | Adicionar colunas é mais seguro que remover          |
  | Dados devem ser migrados com a estrutura | Se adicionar coluna NOT NULL, fornecer DEFAULT    |

  ---

  ## 7. Troubleshooting

  | Problema                                | Solução                                              |
  |------------------------------------------|------------------------------------------------------|
  | Migration falha em `db push`           | Verificar SQL syntax, testar localmente primeiro      |
  | Migration foi aplicada parcialmente      | Verificar estado do schema, aplicar correção manual   |
  | Conflito entre migration local e remota  | Usar `supabase migration repair` com cautela        |
  | Coluna NOT NULL sem default falha        | Adicionar DEFAULT ou preencher dados antes de NOT NULL|
  | Índice HNSW demora a criar              | Normal para datasets grandes — planejar janela de manutenção |

  ---

  ## 8. Histórico de Versões

  | Versão | Data    | Mudanças                                       |
  |--------|---------|------------------------------------------------|
  | 1.0    | 2025-01 | Criação do guia de migrations                  |
  | 3.0    | 2025-03 | Adicionado seção de rollback e relação com Vercel |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
