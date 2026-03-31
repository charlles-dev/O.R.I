# DEV-04 — Estrutura do Projeto

  **Organização de Diretórios, Módulos e Dependências**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Desenvolvimento                   |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Árvore de Diretórios](#1-árvore-de-diretórios)
  2. [Descrição dos Módulos](#2-descrição-dos-módulos)
  3. [Dependências Principais](#3-dependências-principais)
  4. [Scripts npm](#4-scripts-npm)
  5. [Histórico de Versões](#5-histórico-de-versões)

  ---

  ## 1. Árvore de Diretórios

  ```
  ori/
  ├── src/
  │   ├── app/                     # Next.js App Router
  │   │   ├── (painel)/            # Grupo de rotas do painel TI
  │   │   │   ├── dashboard/       # Dashboard principal
  │   │   │   ├── tarefas/         # Central de Tarefas
  │   │   │   ├── chamados/        # Gestão de Chamados
  │   │   │   ├── kb/              # Base de Conhecimento
  │   │   │   ├── colaboradores/   # Lista de colaboradores
  │   │   │   ├── ativos/          # Inventário de equipamentos
  │   │   │   └── auditoria/       # Log de auditoria
  │   │   ├── api/                 # API Routes (serverless functions)
  │   │   │   ├── bot/mensagem/    # Webhook do Zoho Cliq
  │   │   │   ├── colaboradores/   # Sync e CRUD de colaboradores
  │   │   │   ├── tarefas/         # CRUD de tarefas
  │   │   │   ├── chamados/        # CRUD de chamados
  │   │   │   ├── kb/              # Busca e CRUD de artigos
  │   │   │   ├── audit/           # Logging e cleanup
  │   │   │   ├── relatorios/      # Geração de relatórios
  │   │   │   └── zoho/            # OAuth callback
  │   │   ├── layout.tsx           # Layout raiz
  │   │   └── globals.css          # Estilos globais (Tailwind)
  │   ├── components/              # Componentes React reutilizáveis
  │   │   ├── ui/                  # Componentes base (Button, Card, etc.)
  │   │   ├── tarefas/             # Componentes de tarefas
  │   │   ├── chamados/            # Componentes de chamados
  │   │   ├── kb/                  # Componentes da KB
  │   │   └── layout/              # Header, Sidebar, Footer
  │   ├── lib/                     # Lógica de negócio e clientes
  │   │   ├── supabase.ts          # Cliente Supabase
  │   │   ├── gemini.ts            # Cliente Gemini (GeminiClient)
  │   │   ├── zoho.ts              # Cliente Zoho Cliq
  │   │   ├── glpi.ts              # Cliente GLPI
  │   │   ├── validators.ts        # HierarchyValidator, HMAC
  │   │   └── utils.ts             # Utilitários gerais
  │   └── types/                   # Definições de tipos TypeScript
  │       ├── index.ts             # Tipos globais
  │       └── database.ts          # Tipos do schema Supabase
  ├── supabase/
  │   ├── migrations/              # Migrations SQL
  │   ├── seed.sql                 # Dados de seed
  │   └── config.toml              # Configuração Supabase
  ├── public/                      # Assets estáticos
  ├── docs/                        # Documentação (esta pasta)
  ├── .env.example                 # Template de variáveis de ambiente
  ├── .env.local                   # Variáveis locais (git-ignored)
  ├── .gitignore
  ├── next.config.js
  ├── tailwind.config.ts
  ├── tsconfig.json
  ├── vercel.json                  # Configuração Vercel (cron, headers)
  └── package.json
  ```

  ---

  ## 2. Descrição dos Módulos

  | Módulo             | Responsabilidade                                       |
  |--------------------|--------------------------------------------------------|
  | `src/app/api/`   | API Routes — toda lógica de backend                   |
  | `src/app/(painel)/`| Páginas do painel TI (Server + Client Components)   |
  | `src/lib/`       | Clientes de serviços externos e lógica de negócio      |
  | `src/components/`| UI reutilizável — sem lógica de negócio                |
  | `src/types/`     | Definições TypeScript compartilhadas                   |
  | `supabase/`      | Schema do banco (migrations) e configuração local      |

  ---

  ## 3. Dependências Principais

  | Pacote                    | Versão | Uso                                  |
  |---------------------------|--------|--------------------------------------|
  | next                      | 14.x   | Framework full-stack                 |
  | react / react-dom         | 18.x   | UI library                          |
  | @supabase/supabase-js     | 2.x    | Cliente Supabase                    |
  | @google/generative-ai     | 0.x    | SDK Gemini                          |
  | tailwindcss               | 3.x    | CSS utility-first                   |
  | zod                       | 3.x    | Validação de schema                 |
  | typescript                | 5.x    | Linguagem                           |
  | eslint                    | 8.x    | Linting                             |

  ---

  ## 4. Scripts npm

  | Script           | Comando                  | Uso                          |
  |------------------|--------------------------|------------------------------|
  | `dev`          | `next dev`             | Desenvolvimento local         |
  | `build`        | `next build`           | Build de produção             |
  | `start`        | `next start`           | Iniciar build de produção     |
  | `lint`         | `next lint`            | Verificar ESLint              |
  | `type-check`   | `tsc --noEmit`         | Verificar TypeScript          |

  ---

  ## 5. Histórico de Versões

  | Versão | Data    | Mudanças                                  |
  |--------|---------|-------------------------------------------|
  | 1.0    | 2025-01 | Criação: estrutura inicial                |
  | 3.0    | 2025-03 | Módulo de IA (gemini.ts), tipos atualizados|
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
