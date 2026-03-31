# DEV-03 — Deploy e CI/CD

  **Pipeline de Integração e Entrega Contínua via Vercel**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Desenvolvimento                   |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Visão Geral do Pipeline](#1-visão-geral-do-pipeline)
  2. [Integração Contínua (CI)](#2-integração-contínua)
  3. [Entrega Contínua (CD)](#3-entrega-contínua)
  4. [Pipeline Detalhado](#4-pipeline-detalhado)
  5. [Migrations no Pipeline](#5-migrations-no-pipeline)
  6. [Histórico de Versões](#6-histórico-de-versões)

  ---

  ## 1. Visão Geral do Pipeline

  O O.R.I utiliza o Vercel como plataforma de CI/CD integrada. Cada push no repositório Git dispara automaticamente um build e deploy.

  ```
  Push → Vercel detecta → Build → Checks → Deploy
  ```

  | Branch            | Ambiente            | Automático |
  |-------------------|-----------------------|------------|
  | `feature/*`     | Preview URL           | Sim        |
  | `staging`       | Staging               | Sim        |
  | `main`          | Produção              | Sim        |

  ---

  ## 2. Integração Contínua

  ### Checks executados em cada PR

  | Check              | Ferramenta | Quando             |
  |--------------------|------------|---------------------|
  | TypeScript         | tsc        | Cada push           |
  | ESLint             | eslint     | Cada push           |
  | Build              | next build | Cada push (Vercel)  |
  | Preview deploy     | Vercel     | Cada PR             |

  ### Scripts locais

  ```bash
  npm run lint          # ESLint
  npm run type-check    # TypeScript
  npm run build         # Build completo
  ```

  ---

  ## 3. Entrega Contínua

  ### Deploy automático

  - Merge em `staging` → deploy em staging
  - Merge em `main` → deploy em produção

  ### Zero downtime

  O Vercel utiliza blue-green deployments internamente — novas versões são servidas sem interrupção.

  ---

  ## 4. Pipeline Detalhado

  ### Feature → Staging → Produção

  ```
  1. Desenvolver em feature/nome
  2. Push → Vercel cria Preview URL
  3. Testar na Preview URL
  4. Abrir PR: feature/nome → staging
  5. Code review + aprovação
  6. Merge → deploy staging automático
  7. Validar em staging (QA-02)
  8. Abrir PR: staging → main
  9. Aprovação → merge → deploy produção
  10. Monitorar 30 min (ARQ-05 §7)
  ```

  ### Hotfix

  ```
  1. Criar hotfix/nome a partir de main
  2. Corrigir + push → Preview URL
  3. PR: hotfix/nome → main [HOTFIX]
  4. Aprovação rápida → merge → produção
  5. Sincronizar: main → staging
  ```

  ---

  ## 5. Migrations no Pipeline

  | Etapa          | Responsabilidade                                  |
  |----------------|--------------------------------------------------|
  | Antes do merge | Verificar que migrations rodam localmente          |
  | Após merge em staging | Aplicar migration no Supabase staging       |
  | Validação em staging | Testar fluxos afetados pela mudança de schema |
  | Após merge em main | Aplicar migration no Supabase produção         |

  > ⚠ Migrations **não** são aplicadas automaticamente pelo Vercel. O TI deve aplicar manualmente via Supabase CLI.

  ---

  ## 6. Histórico de Versões

  | Versão | Data    | Mudanças                                |
  |--------|---------|-----------------------------------------|
  | 1.0    | 2025-01 | Criação: pipeline básico                |
  | 3.0    | 2025-03 | Staging adicionado, hotfix flow         |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
