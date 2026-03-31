# DEV-01 — Guia de Ambiente Local

  **Setup de Desenvolvimento, Dependências e Primeiros Passos**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Desenvolvimento                   |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Pré-requisitos](#1-pré-requisitos)
  2. [Setup Inicial](#2-setup-inicial)
  3. [Banco de Dados Local (Supabase)](#3-banco-de-dados-local)
  4. [Variáveis de Ambiente](#4-variáveis-de-ambiente)
  5. [Executando o Projeto](#5-executando-o-projeto)
  6. [Testando Localmente](#6-testando-localmente)
  7. [Troubleshooting](#7-troubleshooting)
  8. [Histórico de Versões](#8-histórico-de-versões)

  ---

  ## 1. Pré-requisitos

  | Ferramenta       | Versão mínima | Instalação                              |
  |------------------|---------------|-----------------------------------------|
  | Node.js          | 18 LTS        | `nvm install 18`                      |
  | npm              | 9+            | Incluído no Node.js                     |
  | Docker Desktop   | 24.0+         | docker.com (necessário para Supabase local) |
  | Supabase CLI     | 1.100+        | `npm install -g supabase`             |
  | Git              | 2.30+         | Gerenciador de versão                   |
  | VS Code          | Recomendado   | Editor com extensões TypeScript + ESLint |

  ---

  ## 2. Setup Inicial

  ```bash
  # 1. Clonar o repositório
  git clone https://github.com/proxxima-telecom/ori.git
  cd ori

  # 2. Instalar dependências
  npm install

  # 3. Copiar variáveis de ambiente
  cp .env.example .env.local

  # 4. Iniciar Supabase local
  supabase start

  # 5. Aplicar migrations
  supabase db reset

  # 6. Iniciar o servidor de desenvolvimento
  npm run dev
  ```

  O painel estará disponível em `http://localhost:3000`.

  ---

  ## 3. Banco de Dados Local

  ### Iniciar Supabase local

  ```bash
  supabase start
  ```

  Saída:
  ```
  API URL: http://localhost:54321
  DB URL: postgresql://postgres:postgres@localhost:54322/postgres
  Studio URL: http://localhost:54323
  anon key: eyJ...
  service_role key: eyJ...
  ```

  ### Acessar o banco

  - **Supabase Studio:** `http://localhost:54323` (interface web)
  - **psql:** `psql postgresql://postgres:postgres@localhost:54322/postgres`

  ### Resetar o banco

  ```bash
  supabase db reset    # Recria tudo do zero (migrations + seed)
  ```

  ### Parar o Supabase

  ```bash
  supabase stop
  ```

  ---

  ## 4. Variáveis de Ambiente

  Editar o arquivo `.env.local` com as credenciais locais. Ver ARQ-05 para lista completa.

  ```bash
  SUPABASE_URL=http://localhost:54321
  SUPABASE_SERVICE_KEY=<copiado de "supabase start">
  SUPABASE_ANON_KEY=<copiado de "supabase start">
  GEMINI_API_KEY=<sua API key de desenvolvimento>
  # ... demais variáveis
  ```

  ---

  ## 5. Executando o Projeto

  ```bash
  npm run dev       # Inicia Next.js em modo de desenvolvimento
  npm run build     # Build de produção
  npm run start     # Inicia build de produção
  npm run lint      # Executa ESLint
  npm run type-check # Verifica tipos TypeScript
  ```

  ---

  ## 6. Testando Localmente

  ### Testar o bot (simulando webhook Zoho)

  ```bash
  curl -X POST http://localhost:3000/api/bot/mensagem \
    -H "Content-Type: application/json" \
    -d '{
      "sender": { "email": "tecnico1@proxximatelecom.com.br", "name": "Técnico" },
      "chat_id": "test_chat",
      "text": "Não consigo acessar meu e-mail"
    }'
  ```

  ### Testar o sync de colaboradores

  ```bash
  curl -X POST http://localhost:3000/api/colaboradores/sync \
    -H "Authorization: Bearer dev_secret_qualquer_coisa_32chars_ok"
  ```

  ---

  ## 7. Troubleshooting

  | Problema                              | Solução                                       |
  |----------------------------------------|------------------------------------------------|
  | `supabase start` falha               | Verificar Docker está rodando                  |
  | Porta 3000 em uso                      | `lsof -i :3000` e matar processo              |
  | Supabase migration falha               | `supabase db reset` para recomeçar             |
  | API key inválida do Gemini             | Verificar se a key está ativa no Google AI Studio |
  | Tipos TypeScript com erro              | `npm run type-check` para diagnóstico          |

  ---

  ## 8. Histórico de Versões

  | Versão | Data    | Mudanças                                  |
  |--------|---------|-------------------------------------------|
  | 1.0    | 2025-01 | Criação: setup básico                     |
  | 3.0    | 2025-03 | Supabase local, Gemini API key, scripts   |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
