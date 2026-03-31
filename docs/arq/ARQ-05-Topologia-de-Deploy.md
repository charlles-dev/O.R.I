# ARQ-05 — Topologia de Deploy

  **Ambientes, Branches, Variáveis de Ambiente e Procedimentos de Deploy**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Arquitetura e Infraestrutura       |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Ambientes](#1-ambientes)
  2. [Variáveis de Ambiente](#2-variáveis-de-ambiente)
  3. [Configuração do Vercel (vercel.json)](#3-configuração-do-vercel)
  4. [Estratégia de Branches](#4-estratégia-de-branches)
  5. [Fluxo de Deploy Completo](#5-fluxo-de-deploy-completo)
  6. [Rollback](#6-rollback)
  7. [Monitoramento Pós-Deploy](#7-monitoramento-pós-deploy)
  8. [Configuração dos Projetos Supabase](#8-configuração-dos-projetos-supabase)
  9. [Histórico de Versões](#9-histórico-de-versões)

  ---

  ## 1. Ambientes

  | Ambiente    | Branch Git       | URL                              | Banco Supabase              | Propósito                                               | Quem acessa                |
  |-------------|------------------|----------------------------------|-----------------------------|----------------------------------------------------------|----------------------------|
  | Produção    | `main`         | `https://ori-prod.vercel.app`    | Projeto "ori-prod"          | Sistema em uso real — dados reais de colaboradores        | Todos os usuários + TI     |
  | Staging     | `staging`      | `https://ori-staging.vercel.app` | Projeto "ori-staging"       | Validação pré-produção — dados de teste                   | TI + Desenvolvedores       |
  | Development | `feature/*`, `fix/*` | Preview URLs Vercel        | Supabase local (Docker)     | Desenvolvimento e testes de cada feature                  | Desenvolvedor responsável  |

  > ⚠ Nunca use credenciais de produção em ambiente de desenvolvimento ou staging. Mantenha projetos Supabase separados.

  ---

  ## 2. Variáveis de Ambiente

  Todas gerenciadas no Vercel Dashboard → Settings → Environment Variables, separadas por ambiente.

  ### 2.1 Variáveis Obrigatórias

  | Variável               | Descrição                                                  | Sensível | Rotação         |
  |------------------------|-------------------------------------------------------------|----------|-----------------|
  | `SUPABASE_URL`       | URL do projeto Supabase                                     | Não      | Não rotacionar  |
  | `SUPABASE_SERVICE_KEY`| Service role key — acesso total ao banco, bypassa RLS       | **SIM**  | A cada 6 meses  |
  | `SUPABASE_ANON_KEY`  | Anon key — uso client-side limitado pelo RLS                | Não      | Raramente       |
  | `GEMINI_API_KEY`     | API Key do Google AI Studio                                  | **SIM**  | A cada 6 meses  |
  | `ZOHO_CLIENT_ID`     | Client ID do OAuth Zoho                                      | Não      | Não rotacionar  |
  | `ZOHO_CLIENT_SECRET` | Client Secret do OAuth Zoho                                  | **SIM**  | A cada 6 meses  |
  | `ZOHO_REFRESH_TOKEN` | Refresh token OAuth Zoho                                     | **SIM**  | Quando expirar  |
  | `GLPI_API_URL`       | URL base da API REST do GLPI                                 | Não      | Não rotacionar  |
  | `GLPI_APP_TOKEN`     | App Token do GLPI                                            | **SIM**  | A cada 6 meses  |
  | `GLPI_USER_TOKEN`    | User Token da conta de serviço GLPI                          | **SIM**  | A cada 6 meses  |
  | `REST_API_RH_URL`    | URL base da REST API RH                                      | Não      | Não rotacionar  |
  | `NEXT_PUBLIC_APP_URL`| URL pública do painel                                        | Não      | Se domínio mudar|
  | `CRON_SECRET`        | Secret para autenticar cron jobs (mín. 32 chars)             | **SIM**  | A cada 6 meses  |

  ### 2.2 Diferenças entre Ambientes

  | Variável               | Produção                          | Staging                           | Dev / Local                       |
  |------------------------|-----------------------------------|-----------------------------------|-----------------------------------|
  | `SUPABASE_URL`       | Projeto Supabase produção         | Projeto Supabase staging          | `http://localhost:54321`        |
  | `SUPABASE_SERVICE_KEY`| Chave de produção (dados reais)  | Chave de staging (dados de teste) | Chave local (gerada pelo supabase start) |
  | `GEMINI_API_KEY`     | Chave de produção (billing real)  | Chave de dev (billing isolado)    | Chave de dev                      |
  | `NEXT_PUBLIC_APP_URL`| URL de produção                   | URL de staging                    | `http://localhost:3000`         |

  ### 2.3 Arquivo .env.local (desenvolvimento local)

  ```bash
  # .env.local — NUNCA comitar este arquivo
  SUPABASE_URL=http://localhost:54321
  SUPABASE_SERVICE_KEY=<gerado pelo "supabase start">
  SUPABASE_ANON_KEY=<gerado pelo "supabase start">
  GEMINI_API_KEY=<sua API key de dev>
  ZOHO_CLIENT_ID=<client ID do app de staging>
  ZOHO_CLIENT_SECRET=<client secret do app de staging>
  ZOHO_REFRESH_TOKEN=<refresh token obtido manualmente>
  GLPI_API_URL=https://glpi.proxxima.internal/apirest.php
  GLPI_APP_TOKEN=<token do ambiente de staging>
  GLPI_USER_TOKEN=<token do usuário de staging>
  REST_API_RH_URL=https://proxximatelecomquem.netlify.app
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  CRON_SECRET=dev_secret_qualquer_coisa_32chars_ok
  ```

  > **CRÍTICO:** NUNCA comitar variáveis de ambiente no repositório Git. O arquivo `.env.local` está no `.gitignore`.

  ---

  ## 3. Configuração do Vercel

  ### vercel.json

  ```json
  {
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
          { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
        ]
      }
    ],
    "crons": [
      { "path": "/api/colaboradores/sync", "schedule": "*/15 * * * *" },
      { "path": "/api/audit/cleanup", "schedule": "0 2 * * *" },
      { "path": "/api/kb/reindex", "schedule": "0 3 * * 0" },
      { "path": "/api/relatorios/semanal", "schedule": "0 8 * * 1" }
    ]
  }
  ```

  ### Cron Jobs Detalhados

  | Job                | Schedule              | Rota                          | Propósito                                                  | Em caso de falha                          |
  |--------------------|-----------------------|-------------------------------|-------------------------------------------------------------|-------------------------------------------|
  | sync-colaboradores | `*/15 * * * *`      | `/api/colaboradores/sync`   | Polling REST API RH, detecta mudanças e gera tarefas        | Tenta na próxima execução                 |
  | cleanup-audit      | `0 2 * * *`         | `/api/audit/cleanup`        | Remove entries do audit_log > 90 dias                       | Sem impacto funcional                     |
  | reindex-kb         | `0 3 * * 0`         | `/api/kb/reindex`           | Regenera embeddings da KB modificados na semana             | Artigos mantêm embeddings anteriores      |
  | relatorio-semanal  | `0 8 * * 1`         | `/api/relatorios/semanal`   | Gera e envia relatório semanal ao TI via Zoho Cliq          | TI não recebe o relatório                 |

  > ⚠ Cron jobs com frequência < 1 hora exigem plano Vercel Pro ou superior.

  ---

  ## 4. Estratégia de Branches

  | Branch            | Propósito                               | Deploy automático       | Proteção                    | Merge via               |
  |-------------------|-----------------------------------------|-------------------------|-----------------------------|-------------------------|
  | `main`          | Código de produção — sempre estável     | Vercel produção         | PR obrigatório + aprovação  | PR de staging           |
  | `staging`       | Validação pré-produção                  | Vercel staging          | PR obrigatório              | PR de feature/*         |
  | `feature/{nome}`| Desenvolvimento de nova funcionalidade  | Preview URL Vercel      | Sem restrição               | PR para staging         |
  | `fix/{nome}`    | Correção de bug não-crítico             | Preview URL Vercel      | Sem restrição               | PR para staging         |
  | `hotfix/{nome}` | Correção urgente em produção            | Preview URL Vercel      | Sem restrição               | PR direto para main     |

  ---

  ## 5. Fluxo de Deploy Completo

  ### 5.1 Deploy normal (feature → produção)

  1. Criar branch: `git checkout -b feature/nome-da-feature staging`
  2. Desenvolver seguindo os padrões de DEV-02. Commits descritivos em português
  3. Push: `git push origin feature/nome-da-feature`
  4. Vercel cria Preview URL automaticamente — testar fluxos afetados
  5. Abrir Pull Request: `feature/nome` → `staging`
  6. Code review por pelo menos 1 membro da equipe
  7. Merge em `staging` → deploy automático staging
  8. Executar checklist QA-02 no ambiente de staging
  9. Abrir Pull Request: `staging` → `main`
  10. Aprovação → Merge → deploy automático em produção (zero downtime)
  11. Validar fluxos críticos em produção
  12. Monitorar logs Vercel por 30 minutos

  ### 5.2 Hotfix em produção

  1. Criar branch a partir de `main`: `git checkout -b hotfix/descricao main`
  2. Aplicar correção mínima necessária
  3. Testar na Preview URL gerada pelo Vercel
  4. Abrir PR: `hotfix/descricao` → `main` com flag [HOTFIX]
  5. Aprovação rápida (1 revisor suficiente)
  6. Merge → deploy automático em produção
  7. Sincronizar staging: abrir PR de `main` → `staging`

  ---

  ## 6. Rollback

  O Vercel mantém histórico de todos os deployments. Em caso de problema crítico:

  1. Acessar Vercel Dashboard → Deployments
  2. Localizar último deploy estável
  3. Clicar "..." → "Promote to Production"
  4. Vercel redireciona tráfego em segundos (zero downtime)
  5. Investigar o problema no branch de feature e corrigir

  > ⚠ Rollback de banco de dados é mais complexo. Se a mudança incluiu uma migration SQL, execute a migration de rollback no Supabase ANTES de fazer o rollback do código no Vercel. Consulte BD-03.

  ---

  ## 7. Monitoramento Pós-Deploy

  ### 7.1 Checklist imediato (0-5 minutos)

  - Acessar painel TI e confirmar que carrega sem erros
  - Enviar mensagem de teste no bot Zoho Cliq e verificar resposta
  - Verificar logs Vercel: Functions → sem erros 5xx
  - Verificar Supabase: tabelas acessíveis

  ### 7.2 Monitoramento (5-30 minutos)

  - Aguardar execução do cron de sync e verificar resultado no audit_log
  - Monitorar métricas Vercel: Function Invocations, Error Rate, Duration
  - Verificar rate limits Supabase: API Usage sem pico anômalo

  ### 7.3 Alertas de problema

  | Sinal                              | Ação imediata                                         |
  |-------------------------------------|-------------------------------------------------------|
  | Erros 5xx nos logs                  | Verificar stack trace. Se crítico, rollback imediato  |
  | Bot não responde em 10+ segundos    | Verificar endpoint `/api/bot/mensagem`              |
  | Painel TI não carrega               | Verificar logs de build ou runtime                    |
  | Cron falhando por 3+ execuções      | Verificar estrutura da REST API RH                    |
  | Supabase retornando erros de auth   | Verificar SUPABASE_SERVICE_KEY                        |

  ---

  ## 8. Configuração dos Projetos Supabase

  ### 8.1 Extensões necessárias

  | Extensão    | Propósito                                           | Verificação                                    |
  |-------------|------------------------------------------------------|------------------------------------------------|
  | uuid-ossp   | Geração de UUIDs para PKs                            | `SELECT gen_random_uuid();`                  |
  | pg_trgm     | Busca por similaridade textual (trigram)              | `SELECT similarity('abc', 'abcd');`          |
  | unaccent    | Normalização de texto com acentos                    | `SELECT unaccent('café');` → `cafe`        |
  | vector      | Armazenamento e busca de vetores (KB semântica)      | `SELECT '[1,2,3]'::vector;`                  |

  ### 8.2 Configurações de autenticação

  | Configuração     | Valor recomendado                                          |
  |------------------|-------------------------------------------------------------|
  | JWT expiry       | 3600 (1 hora)                                               |
  | Email auth       | Desabilitado — O.R.I usa SSO Zoho                           |
  | Row Level Security| Habilitado em todas as tabelas sensíveis                   |
  | Realtime         | Apenas para tabelas que o painel TI precisa (ex: tarefas_manuais) |

  ---

  ## 9. Histórico de Versões

  | Versão | Data    | Mudanças                                                                          |
  |--------|---------|-----------------------------------------------------------------------------------|
  | 1.0    | 2025-01 | Criação. Dois ambientes (prod, dev). Sem cron jobs                                |
  | 2.0    | 2025-02 | Ambiente de staging adicionado. Cron de sync adicionado                            |
  | 3.0    | 2025-03 | Cron de reindexação KB e relatório semanal. GEMINI_API_KEY incluída. Variáveis do agente removidas |

  ---

  *O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
  