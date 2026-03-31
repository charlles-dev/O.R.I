# ARQ-02 — Infraestrutura de Rede

  **Segmentos, Máquinas, Fluxos e Regras de Firewall**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Arquitetura e Infraestrutura       |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Introdução](#1-introdução)
  2. [Visão Geral dos Segmentos de Rede](#2-visão-geral-dos-segmentos-de-rede)
  3. [Inventário Detalhado de Máquinas Internas](#3-inventário-detalhado-de-máquinas-internas)
  4. [Fluxos de Rede Detalhados](#4-fluxos-de-rede-detalhados)
  5. [Regras de Firewall](#5-regras-de-firewall)
  6. [Referência Rápida de Portas e Serviços](#6-referência-rápida-de-portas-e-serviços)
  7. [DNS e Nomes de Host](#7-dns-e-nomes-de-host)
  8. [VPN e Acesso Remoto](#8-vpn-e-acesso-remoto)
  9. [Histórico de Versões](#9-histórico-de-versões)

  ---

  ## 1. Introdução

  Este documento descreve toda a infraestrutura de rede do sistema O.R.I na versão 3.0, cobrindo os segmentos de rede utilizados, o inventário de máquinas relevantes, os fluxos de comunicação entre sistemas, e as regras de firewall aplicadas.

  A principal característica da versão 3.0 é a **eliminação completa do tráfego automatizado** que cruzava o perímetro da rede interna da Proxxima Telecom. Com a remoção do agente interno, toda a lógica automatizada do O.R.I opera exclusivamente na nuvem. Os sistemas internos (Carbonio, Zentyal, iNControl, Topdata) continuam existindo e sendo utilizados, mas são acessados manualmente pelo TI.

  > ⚠ **ATENÇÃO:** A Máquina B (antiga hospedeira do agente Node.js) não é mais necessária para o funcionamento do O.R.I. O serviço `proxxibot-agente` deve ser desativado e removido.

  ---

  ## 2. Visão Geral dos Segmentos de Rede

  | Segmento                 | Sistemas / Serviços                                         | Acesso Externo                  | Automatizado pelo O.R.I | Responsável          |
  |--------------------------|--------------------------------------------------------------|---------------------------------|--------------------------|----------------------|
  | Nuvem — Vercel           | Painel Web TI (Next.js), API Routes, Cron Jobs               | Sim — HTTPS público (443)       | Sim — toda lógica de negócio | Vercel (gerenciado)  |
  | Nuvem — Supabase         | PostgreSQL 15, pgvector, Storage, Realtime                   | Sim — HTTPS com service_role key | Sim — persistência de dados | Supabase (gerenciado)|
  | Nuvem — Google AI        | Gemini 2.5 Flash, text-embedding-004                         | Sim — HTTPS com API key          | Sim — triagem e embeddings   | Google (gerenciado)  |
  | Nuvem — Zoho             | Zoho Cliq Bot, Zoho One Enterprise                           | Sim — HTTPS / OAuth 2.0         | Sim — bot e convites         | Zoho (gerenciado)    |
  | Rede interna — Carbonio  | Carbonio mail server (porta 443 web, 7071 SOAP)              | Porta 443 exposta (cliente web)  | Não — operação manual pelo TI | TI Proxxima          |
  | Rede interna — Máquina A | Zentyal (NAS + diretório Samba)                              | Não — LAN/VPN apenas             | Não — operação manual pelo TI | TI Proxxima          |
  | Rede interna — Máquina B | iNControl, Topdata Inner (agente O.R.I desativado)           | Não — LAN apenas                 | Não — operação manual pelo TI | TI Proxxima          |

  ---

  ## 3. Inventário Detalhado de Máquinas Internas

  ### 3.1 Servidor Carbonio

  | Campo               | Valor                                                        |
  |----------------------|--------------------------------------------------------------|
  | Função               | Servidor de e-mail corporativo self-hosted da Proxxima Telecom |
  | Hostname             | `srv-carbonio`                                       |
  | IP fixo              | `192.168.1.10`                                             |
  | Sistema operacional  | Ubuntu 22.04 LTS                                             |
  | Porta 443            | Cliente web Carbonio — https://mail.proxximatelecom.com.br    |
  | Porta 25/587         | SMTP para envio de e-mail                                     |
  | Porta 993            | IMAP sobre TLS — acesso por clientes de e-mail                |
  | Porta 7071           | API admin SOAP — NÃO utilizada pelo O.R.I v3.0 — LAN apenas  |
  | Acesso pelo TI       | Painel admin Carbonio em `https://192.168.1.10:8443` ou SSH |
  | Operações O.R.I      | Criar conta, reset de senha, suspender conta — todas manuais   |

  ### 3.2 Máquina A — Zentyal

  | Campo               | Valor                                                        |
  |----------------------|--------------------------------------------------------------|
  | Função               | NAS e diretório de usuários Samba, organizado por grupos de setor |
  | Hostname             | `srv-zentyal`                                      |
  | IP fixo              | `192.168.1.20`                                            |
  | Sistema operacional  | Zentyal Server (baseado em Ubuntu)                            |
  | Porta 8443           | Interface web administrativa do Zentyal — LAN pelo TI         |
  | Porta 445 (SMB)      | Acesso aos compartilhamentos de arquivo pelos colaboradores    |
  | Porta 389/636        | LDAP/LDAPS — diretório de usuários                            |
  | Estrutura de grupos  | `grp_ti`, `grp_rh`, `grp_financeiro`, `grp_comercial`, `grp_dev`, `grp_suporte`, `grp_{local}` |

  ### 3.3 Máquina B — iNControl e Topdata Inner

  | Campo               | Valor                                                        |
  |----------------------|--------------------------------------------------------------|
  | Função               | Hospeda sistemas de controle de acesso físico e ponto eletrônico |
  | Hostname             | `srv-incontrol`                                      |
  | IP fixo              | `192.168.1.30`                                            |
  | Sistema operacional  | Windows Server 2019                                           |
  | iNControl            | `localhost:8080` — acesso local pelo TI        |
  | Topdata Inner        | `192.168.1.40:9090` — acesso na LAN        |
  | Agente O.R.I         | **DESATIVADO** — o serviço `proxxibot-agente` foi removido na v3.0 |

  > ✓ **DICA:** Após migração v3.0: (1) Desativar serviço: `sudo systemctl disable --now proxxibot-agente`. (2) Remover regra de firewall Vercel → porta agente. (3) Revogar HMAC_SECRET e SUPABASE_KEY do .env do agente.

  ---

  ## 4. Fluxos de Rede Detalhados

  ### 4.1 Fluxos Automáticos (100% nuvem)

  | #  | Origem                | Destino                    | Porta | Protocolo            | Frequência               | Descrição                                                  |
  |----|------------------------|---------------------------|-------|----------------------|---------------------------|------------------------------------------------------------|
  | F1 | Zoho Cliq              | Vercel — `/api/bot/mensagem` | 443 | HTTPS POST           | A cada mensagem do bot     | Webhook: colaborador → Zoho → Vercel                       |
  | F2 | Vercel — API Route     | Zoho Cliq API              | 443   | HTTPS POST (OAuth)   | Em resposta a F1           | Bot responde ao colaborador                                |
  | F3 | Vercel — API Route     | Supabase                   | 443   | HTTPS (service key)  | Contínuo                   | Todas as operações de banco de dados                       |
  | F4 | Vercel — Cron Job      | REST API RH (Netlify)      | 443   | HTTPS GET            | A cada 15 min              | Polling para sync de colaboradores                         |
  | F5 | Vercel — API Route     | Google Gemini AI           | 443   | HTTPS REST (API key) | Por triagem de chamado     | `generateContent` + `embedContent`                     |
  | F6 | Vercel — API Route     | GLPI                       | 443   | HTTPS REST (App Token)| Quando IA não resolve      | Cria e atualiza chamados                                   |
  | F7 | Vercel — Cron Job      | `/api/audit/cleanup`     | 443   | HTTPS POST (HMAC)    | Diariamente às 02:00       | Limpeza de audit_log > 90 dias                             |
  | F8 | Vercel — Cron Job      | `/api/kb/reindex`        | 443   | HTTPS POST (HMAC)    | Domingo às 03:00           | Reindexação de embeddings da KB                            |

  ### 4.2 Fluxos Manuais (TI acessa diretamente)

  | Sistema Destino          | Como o TI acessa                                      | Operações                                           |
  |--------------------------|-------------------------------------------------------|-----------------------------------------------------|
  | Carbonio (painel admin)  | Navegador → `https://192.168.1.10:8443`            | Criar conta, reset de senha, suspender conta         |
  | Zentyal (interface web)  | Navegador → `https://192.168.1.20:8443`           | Criar usuário, trocar grupo, reset senha, desativar  |
  | iNControl                | Navegador → `localhost:8080` na Máquina B | Cadastrar pessoa, ativar credencial RFID            |
  | Topdata Inner            | Aplicação na LAN — `192.168.1.40:9090`   | Cadastrar funcionário, associar RFID                 |

  ---

  ## 5. Regras de Firewall

  ### 5.1 Regras Inbound (entrada na rede interna)

  | #   | Origem                     | Destino              | Porta         | Ação     | Motivo                                                          |
  |-----|----------------------------|----------------------|---------------|----------|-----------------------------------------------------------------|
  | R01 | Qualquer (internet)        | `192.168.1.10`    | 443 TCP       | PERMITIR | Acesso ao cliente web Carbonio                                   |
  | R02 | Qualquer (internet)        | `192.168.1.10`    | 25, 587 TCP   | PERMITIR | SMTP para recebimento e envio de e-mail                          |
  | R03 | Qualquer (internet)        | `192.168.1.10`    | 993 TCP       | PERMITIR | IMAP sobre TLS para clientes de e-mail                           |
  | R04 | IPs da LAN interna         | `192.168.1.10`    | 7071 TCP      | PERMITIR | API SOAP admin — acesso apenas da LAN. NÃO expor para internet   |
  | R05 | IPs da LAN interna         | `192.168.1.20`   | 8443 TCP      | PERMITIR | Interface admin Zentyal — acesso apenas da LAN                   |
  | R06 | IPs da LAN + VPN           | `192.168.1.20`   | 445 TCP       | PERMITIR | Samba SMB — acesso dos colaboradores aos compartilhamentos        |
  | R07 | **REMOVIDA**               | `192.168.1.30`   | `9443` | **REMOVER** | Regra legada do agente v1.0/v2.0 — deve ser removida na v3.0 |
  | R08 | Qualquer                   | Qualquer             | Qualquer      | NEGAR    | Regra padrão de negação                                          |

  > ⚠ **ATENÇÃO:** A regra R07 (Vercel → Máquina B porta do agente) deve ser REMOVIDA. Deixar essa regra ativa representa uma superfície de ataque desnecessária.

  ---

  ## 6. Referência Rápida de Portas e Serviços

  | Serviço                | Máquina / Provedor     | Porta  | Exposto externamente | Automatizado pelo O.R.I | Quem usa                |
  |------------------------|------------------------|--------|----------------------|--------------------------|-------------------------|
  | Painel Web TI          | Vercel (CDN global)    | 443    | Sim — HTTPS          | N/A (frontend)           | TI Proxxima             |
  | API Routes             | Vercel Serverless      | 443    | Sim — HTTPS          | Sim — toda automação     | Bot, Cron, Painel       |
  | Bot Zoho Cliq          | Zoho One Enterprise    | 443    | Sim — OAuth          | Sim                      | Todos colaboradores     |
  | Supabase (DB)          | Supabase Cloud         | 443    | Sim (com service key)| Sim                      | API Routes              |
  | Google Gemini API      | Google AI Studio       | 443    | Sim (com API key)    | Sim                      | API Routes              |
  | GLPI (chamados)        | Self-hosted Proxxima   | 443/80 | Depende da config.   | Sim (API REST)           | API Routes, TI          |
  | Carbonio web           | Servidor Carbonio LAN  | 443    | Sim — cliente web    | Não (manual TI)          | Colaboradores, TI       |
  | Carbonio admin         | Servidor Carbonio LAN  | 8443   | Não — LAN apenas     | Não                      | TI                      |
  | Zentyal admin web      | Máquina A LAN          | 8443   | Não — LAN apenas     | Não (manual TI)          | TI                      |
  | Zentyal Samba/SMB      | Máquina A LAN          | 445    | Não — LAN/VPN        | Não                      | Colaboradores LAN/VPN   |
  | iNControl              | Máquina B LAN          | Varia  | Não — LAN apenas     | Não (manual TI)          | TI                      |
  | Topdata Inner          | LAN Proxxima           | Varia  | Não — LAN apenas     | Não (manual TI)          | TI                      |
  | Agente O.R.I (legado)  | Máquina B LAN          | Legado | **DESATIVADO**       | **DESATIVADO**           | N/A — removido v3.0     |

  ---

  ## 7. DNS e Nomes de Host

  | Hostname / URL                       | Resolve para                  | Uso                                            |
  |--------------------------------------|-------------------------------|-------------------------------------------------|
  | mail.proxximatelecom.com.br          | `192.168.1.10` (IP público)| Acesso ao cliente web Carbonio                  |
  | connect.proxxima.net                 | Infraestrutura Zoho (CDN)    | Acesso ao Zoho Cliq pela equipe                 |
  | `ori-prod.vercel.app`               | CDN Vercel (edge)            | Painel TI e API Routes em produção              |
  | `ori-staging.vercel.app`            | CDN Vercel (edge)            | Ambiente de staging                             |
  | proxximatelecomquem.netlify.app      | Netlify CDN                  | REST API RH — fonte de verdade de colaboradores |
  | `192.168.1.20`                  | IP fixo LAN                  | Zentyal — acesso direto na LAN                  |
  | `192.168.1.10`                   | IP fixo LAN (+ roteado)     | Servidor Carbonio                               |

  ---

  ## 8. VPN e Acesso Remoto

  | Recurso                         | Requer VPN?          | Alternativa sem VPN               |
  |----------------------------------|----------------------|-----------------------------------|
  | Bot Zoho Cliq (O.R.I)           | Não — via internet   | N/A                               |
  | Painel Web TI (O.R.I)           | Não — via internet   | N/A                               |
  | Cliente web Carbonio (e-mail)   | Não — HTTPS público  | N/A                               |
  | Compartilhamentos Samba         | Sim — porta 445 LAN  | Sem alternativa — VPN obrigatória |
  | Interface admin Zentyal          | Sim — porta 8443 LAN | Sem alternativa — VPN obrigatória |
  | iNControl e Topdata             | Sim — LAN apenas     | Sem alternativa — acesso físico   |

  ---

  ## 9. Histórico de Versões

  | Versão | Data    | Mudanças                                                                                    |
  |--------|---------|---------------------------------------------------------------------------------------------|
  | 1.0    | 2025-01 | Criação. Agente interno na Máquina B com 4 adaptadores. Firewall com regra Vercel → Máquina B |
  | 2.0    | 2025-02 | Zentyal, iNControl e Topdata removidos do agente. Máquina B ainda hospedava agente para Carbonio |
  | 3.0    | 2025-03 | Remoção completa do agente. Regra de firewall Vercel → Máquina B removida                   |

  ---

  *O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
  