# SEC-02 — Gestão de Segredos

  **Armazenamento, Rotação e Acesso a Credenciais e API Keys**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Segurança                         |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Inventário de Segredos](#1-inventário-de-segredos)
  2. [Armazenamento](#2-armazenamento)
  3. [Política de Rotação](#3-política-de-rotação)
  4. [Acesso e Permissões](#4-acesso-e-permissões)
  5. [O que Fazer em Caso de Vazamento](#5-o-que-fazer-em-caso-de-vazamento)
  6. [Checklist de Segurança](#6-checklist-de-segurança)
  7. [Histórico de Versões](#7-histórico-de-versões)

  ---

  ## 1. Inventário de Segredos

  | Segredo                  | Provedor         | Comprometimento se vazado                                  | Criticidade |
  |--------------------------|-------------------|------------------------------------------------------------|-------------|
  | SUPABASE_SERVICE_KEY     | Supabase          | Acesso total ao banco — bypassa RLS                        | Crítica     |
  | GEMINI_API_KEY           | Google AI Studio  | Uso indevido da quota — custos financeiros                 | Alta        |
  | ZOHO_CLIENT_SECRET       | Zoho              | Criação de tokens OAuth indevidos                          | Alta        |
  | ZOHO_REFRESH_TOKEN       | Zoho              | Impersonação do bot para todos os colaboradores            | Crítica     |
  | GLPI_APP_TOKEN           | GLPI              | Criação de chamados falsos                                 | Média       |
  | GLPI_USER_TOKEN          | GLPI              | Operações no GLPI em nome da conta de serviço              | Média       |
  | CRON_SECRET              | Interno           | Execução de cron jobs por terceiros                        | Alta        |

  ---

  ## 2. Armazenamento

  | Local                     | Uso                              | Segurança                                   |
  |---------------------------|----------------------------------|----------------------------------------------|
  | Vercel Environment Variables | Produção e staging             | Encrypted at rest, scoped por ambiente        |
  | .env.local (desenvolvimento) | Desenvolvimento local          | Arquivo local, no .gitignore                  |
  | Supabase Dashboard         | Visualização de keys Supabase   | Login com MFA obrigatório                     |
  | Google AI Studio           | Gerenciamento da API key         | Login com conta Google do TI                  |

  ### Regras fundamentais

  - **NUNCA** comitar segredos no repositório Git
  - **NUNCA** logar segredos no console ou em arquivos de log
  - **NUNCA** expor service keys no código client-side (frontend)
  - **NUNCA** compartilhar segredos via chat, e-mail ou mensagem
  - `.env.local` deve estar no `.gitignore`

  ---

  ## 3. Política de Rotação

  | Segredo                  | Frequência de rotação | Procedimento                                        |
  |--------------------------|------------------------|------------------------------------------------------|
  | SUPABASE_SERVICE_KEY     | A cada 6 meses         | Gerar nova key no Supabase Dashboard → atualizar Vercel env → deploy |
  | GEMINI_API_KEY           | A cada 6 meses         | Revogar key antiga no Google AI Studio → criar nova → atualizar Vercel |
  | ZOHO_CLIENT_SECRET       | A cada 6 meses         | Regenerar no Zoho API Console → atualizar Vercel     |
  | ZOHO_REFRESH_TOKEN       | Quando expirar (~1 ano)| Reautorizar o app → novo refresh token → atualizar Vercel |
  | GLPI_APP_TOKEN           | A cada 6 meses         | Revogar no GLPI → criar novo → atualizar Vercel     |
  | CRON_SECRET              | A cada 6 meses         | `openssl rand -hex 32` → atualizar Vercel          |

  ### Checklist de rotação

  1. Gerar/regenerar o novo segredo no provedor
  2. Atualizar a variável no Vercel (staging primeiro)
  3. Fazer deploy em staging e validar
  4. Atualizar em produção
  5. Revogar o segredo antigo no provedor
  6. Registrar rotação no audit_log

  ---

  ## 4. Acesso e Permissões

  | Quem                      | Acesso a segredos                          |
  |---------------------------|---------------------------------------------|
  | Técnico de TI 1           | Vercel Dashboard, Supabase Dashboard        |
  | Técnico de TI 2           | Vercel Dashboard, Supabase Dashboard        |
  | Código server-side        | Via `process.env` nas API Routes           |
  | Código client-side        | **NUNCA** — apenas NEXT_PUBLIC_* (não-sensíveis) |
  | Vercel Cron               | Via environment variables                    |

  ---

  ## 5. O que Fazer em Caso de Vazamento

  ### Procedimento de emergência

  1. **Imediato (0-15 min):** Revogar o segredo comprometido no provedor
  2. **Em seguida (15-30 min):** Gerar novo segredo e atualizar no Vercel
  3. **Verificar (30-60 min):** Auditar logs por uso indevido do segredo vazado
  4. **Documentar:** Registrar incidente com: o que vazou, como, impacto, ações tomadas

  ### Ações por tipo de segredo

  | Segredo vazado         | Ação adicional                                              |
  |------------------------|------------------------------------------------------------|
  | SUPABASE_SERVICE_KEY   | Verificar audit_log do Supabase por queries não-autorizadas|
  | ZOHO_REFRESH_TOKEN     | Verificar se mensagens foram enviadas em nome do bot       |
  | GEMINI_API_KEY         | Verificar billing do Google AI Studio por uso anômalo       |

  ---

  ## 6. Checklist de Segurança

  - [ ] .env.local está no .gitignore
  - [ ] Nenhum segredo hardcoded no código
  - [ ] Nenhum segredo em logs
  - [ ] Todas as variáveis sensíveis estão no Vercel env vars
  - [ ] MFA ativo em Vercel, Supabase e Google AI Studio
  - [ ] Rotação de segredos em dia (última rotação < 6 meses)
  - [ ] service_role key usada apenas server-side
  - [ ] NEXT_PUBLIC_* não contém dados sensíveis

  ---

  ## 7. Histórico de Versões

  | Versão | Data    | Mudanças                                        |
  |--------|---------|-------------------------------------------------|
  | 1.0    | 2025-01 | Criação: inventário básico                      |
  | 3.0    | 2025-03 | GEMINI_API_KEY adicionada, remoção de secrets do agente |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
