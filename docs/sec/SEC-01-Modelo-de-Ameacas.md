# SEC-01 — Modelo de Ameaças

  **Identificação de Ameaças, Vetores de Ataque e Mitigações**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Segurança                         |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Escopo](#1-escopo)
  2. [Ativos Críticos](#2-ativos-críticos)
  3. [Superfície de Ataque](#3-superfície-de-ataque)
  4. [Ameaças Identificadas (STRIDE)](#4-ameaças-identificadas-stride)
  5. [Matriz de Risco](#5-matriz-de-risco)
  6. [Mitigações Implementadas](#6-mitigações-implementadas)
  7. [Ameaças Residuais](#7-ameaças-residuais)
  8. [Histórico de Versões](#8-histórico-de-versões)

  ---

  ## 1. Escopo

  Este modelo de ameaças cobre toda a arquitetura do O.R.I v3.0: componentes em nuvem (Vercel, Supabase, Google AI, Zoho), interfaces de comunicação e dados em trânsito e em repouso.

  **Fora do escopo:** ameaças aos sistemas internos (Carbonio, Zentyal, iNControl, Topdata) como infraestrutura independente do O.R.I.

  ---

  ## 2. Ativos Críticos

  | Ativo                           | Classificação | Impacto se comprometido                          |
  |----------------------------------|---------------|--------------------------------------------------|
  | Dados de colaboradores (PII)     | Confidencial  | Exposição de dados pessoais — violação LGPD       |
  | Credenciais de serviço (secrets) | Crítico       | Acesso total ao sistema — RCE, data exfiltration  |
  | Base de conhecimento (KB)        | Interno       | Perda de conteúdo — impacto operacional           |
  | Audit log                        | Interno       | Perda de rastreabilidade                          |
  | Conteúdo de chamados             | Confidencial  | Exposição de problemas internos                    |
  | Refresh token Zoho               | Crítico       | Impersonação do bot para 1.500+ colaboradores     |

  ---

  ## 3. Superfície de Ataque

  | Ponto de entrada              | Exposição       | Autenticação                                  |
  |-------------------------------|-----------------|-----------------------------------------------|
  | Webhook Zoho → Vercel         | Internet        | Validação de domínio do sender                 |
  | API Routes (Vercel)           | Internet        | HMAC, OAuth, validação de headers              |
  | REST API RH (Netlify)         | Internet        | **Nenhuma** — API pública                      |
  | Supabase REST API             | Internet        | anon key + RLS / service key (server-side)     |
  | Google Gemini API             | Internet        | API key (server-side, não exposta ao client)   |
  | Vercel Dashboard              | Internet        | Login com MFA (conta Vercel do TI)             |
  | Supabase Dashboard            | Internet        | Login com MFA (conta Supabase do TI)           |

  ---

  ## 4. Ameaças Identificadas (STRIDE)

  ### S — Spoofing (falsificação de identidade)

  | Ameaça                                    | Probabilidade | Impacto | Mitigação                                    |
  |-------------------------------------------|---------------|---------|----------------------------------------------|
  | Atacante envia webhook fake ao Vercel      | Média         | Alto    | Validação de domínio + HMAC para cron jobs    |
  | Atacante falsifica sender.email no Zoho     | Baixa         | Alto    | Zoho controla autenticação interna            |
  | Bot responde a e-mail fora do domínio      | Média         | Médio   | Filtro: sender deve terminar com @proxximatelecom.com.br |

  ### T — Tampering (adulteração)

  | Ameaça                                    | Probabilidade | Impacto | Mitigação                                    |
  |-------------------------------------------|---------------|---------|----------------------------------------------|
  | Modificação de dados em trânsito           | Baixa         | Alto    | TLS em todas as comunicações                  |
  | SQL injection via input do bot             | Média         | Crítico | Parameterized queries (Supabase SDK)          |
  | Modificação de artigos KB sem autorização  | Baixa         | Médio   | RLS + autenticação no painel TI               |

  ### R — Repudiation (negação)

  | Ameaça                                    | Probabilidade | Impacto | Mitigação                                    |
  |-------------------------------------------|---------------|---------|----------------------------------------------|
  | TI nega ter executado uma tarefa           | Baixa         | Médio   | audit_log com IP, timestamp, evidência        |
  | Colaborador nega ter enviado mensagem      | Baixa         | Baixo   | Log do Zoho + audit_log                       |

  ### I — Information Disclosure (vazamento)

  | Ameaça                                    | Probabilidade | Impacto | Mitigação                                    |
  |-------------------------------------------|---------------|---------|----------------------------------------------|
  | Exposição da REST API RH (dados pessoais)  | **Alta**      | Alto    | Sem mitigação — API é pública por design      |
  | Vazamento de secrets via logs              | Média         | Crítico | Secrets nunca em logs — .env no .gitignore    |
  | Exposição de dados via prompt da IA        | Média         | Médio   | Dados mínimos no prompt, política AI-08       |
  | Supabase anon key exposta                  | Alta          | Baixo   | RLS ativo — anon key tem acesso limitado      |

  ### D — Denial of Service (negação de serviço)

  | Ameaça                                    | Probabilidade | Impacto | Mitigação                                    |
  |-------------------------------------------|---------------|---------|----------------------------------------------|
  | DDoS no Vercel                             | Baixa         | Alto    | CDN Vercel + rate limiting                    |
  | Exaustão de quota Gemini API               | Média         | Médio   | Alerta em 80% do orçamento, fallback GLPI     |
  | Spam no bot Zoho                           | Baixa         | Baixo   | Rate limiting por sender                      |

  ### E — Elevation of Privilege (escalação)

  | Ameaça                                    | Probabilidade | Impacto | Mitigação                                    |
  |-------------------------------------------|---------------|---------|----------------------------------------------|
  | Colaborador tenta reset de senha alheia    | Média         | Alto    | HierarchyValidator — validação determinística |
  | Acesso ao painel TI por não-autorizado     | Baixa         | Alto    | Autenticação Zoho SSO + verificação de role    |

  ---

  ## 5. Matriz de Risco

  | Risco                         | Probabilidade | Impacto | Nível    | Status               |
  |-------------------------------|---------------|---------|----------|----------------------|
  | REST API RH pública (PII)     | Alta          | Alto    | **ALTO** | Aceito (fora do controle O.R.I) |
  | Vazamento de secrets          | Média         | Crítico | **ALTO** | Mitigado             |
  | SQL injection                 | Média         | Crítico | **ALTO** | Mitigado             |
  | Webhook falsificado           | Média         | Alto    | MÉDIO    | Mitigado             |
  | Escalação via reset de senha  | Média         | Alto    | MÉDIO    | Mitigado (ADR-008)   |
  | DDoS no Vercel                | Baixa         | Alto    | MÉDIO    | Parcialmente mitigado|
  | Exaustão de quota Gemini      | Média         | Médio   | MÉDIO    | Mitigado             |

  ---

  ## 6. Mitigações Implementadas

  | Mitigação                              | Ameaça coberta                       | Implementação                             |
  |-----------------------------------------|--------------------------------------|-------------------------------------------|
  | HMAC-SHA256 para cron jobs              | Webhook falsificado                  | INT-07                                    |
  | RLS no Supabase                         | Acesso não autorizado ao banco       | BD-04                                     |
  | Validação hierárquica determinística    | Escalação via reset de senha         | ADR-008                                   |
  | TLS em todas as comunicações            | Interceptação de dados               | Vercel/Supabase/Zoho nativo               |
  | Parameterized queries                   | SQL injection                        | Supabase SDK (@supabase/supabase-js)      |
  | Secrets em variáveis de ambiente        | Vazamento de credenciais             | Vercel env vars (encrypted at rest)       |
  | Rate limiting por sender                | Spam/DDoS no bot                     | Middleware no API Route                   |
  | Fallback GLPI sem IA                    | Indisponibilidade da API Gemini      | Código de fallback                        |
  | Audit log imutável                      | Negação de ações                     | audit_log com INSERT only (no UPDATE/DELETE para app) |

  ---

  ## 7. Ameaças Residuais

  | Ameaça                               | Por que não foi mitigada                          | Risco aceito   |
  |----------------------------------------|---------------------------------------------------|----------------|
  | REST API RH é pública                  | Infraestrutura de RH — fora do controle do O.R.I  | Sim — risco aceito pela diretoria |
  | Dados de chamados enviados ao Google   | Necessário para triagem com IA — ver AI-08         | Sim — com política de privacidade |
  | Supabase anon key é pública            | Padrão do Supabase — protegido por RLS             | Sim — risco baixo                 |

  ---

  ## 8. Histórico de Versões

  | Versão | Data    | Mudanças                                            |
  |--------|---------|-----------------------------------------------------|
  | 1.0    | 2025-01 | Criação: modelo básico                              |
  | 3.0    | 2025-03 | Adicionado IA como vetor, STRIDE completo, matriz   |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
