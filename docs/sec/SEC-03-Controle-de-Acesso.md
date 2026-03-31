# SEC-03 — Controle de Acesso

  **Autenticação, Autorização e Gestão de Permissões**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Segurança                         |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Modelo de Acesso](#1-modelo-de-acesso)
  2. [Autenticação por Interface](#2-autenticação-por-interface)
  3. [Autorização e Papéis](#3-autorização-e-papéis)
  4. [Validação Hierárquica](#4-validação-hierárquica)
  5. [Controle de Acesso às API Routes](#5-controle-de-acesso-às-api-routes)
  6. [Histórico de Versões](#6-histórico-de-versões)

  ---

  ## 1. Modelo de Acesso

  O O.R.I utiliza um modelo de acesso baseado em papéis (RBAC simplificado) com dois níveis principais:

  | Nível            | Acesso                                           | Autenticação         |
  |------------------|--------------------------------------------------|----------------------|
  | Colaborador      | Bot Zoho Cliq — consultas, chamados, reset       | SSO Zoho (automático)|
  | Técnico de TI    | Painel Web TI — todas as funcionalidades          | SSO Zoho + verificação de role |

  ---

  ## 2. Autenticação por Interface

  ### 2.1 Bot Zoho Cliq (Colaborador)

  | Aspecto          | Detalhe                                              |
  |------------------|------------------------------------------------------|
  | Método           | SSO Zoho — colaborador já está autenticado no Zoho Cliq |
  | Identificação    | Campo `sender.email` do webhook                    |
  | Validação        | E-mail deve existir na tabela `colaboradores` com `status = 'ativo'` |
  | Domínio          | Deve terminar com `@proxximatelecom.com.br`         |

  ### 2.2 Painel Web TI (Técnico)

  | Aspecto          | Detalhe                                              |
  |------------------|------------------------------------------------------|
  | Método           | SSO Zoho via OAuth 2.0 (Authorization Code + PKCE)   |
  | Sessão           | JWT com expiração de 1 hora                           |
  | Verificação      | Após autenticação Zoho, verificar se e-mail pertence à equipe de TI |
  | MFA              | Obrigatório para contas de TI no Zoho                 |

  ---

  ## 3. Autorização e Papéis

  | Papel        | Permissões                                                         |
  |--------------|---------------------------------------------------------------------|
  | colaborador  | Enviar mensagem ao bot, consultar KB, abrir chamado, solicitar reset, solicitar crachá |
  | tecnico_ti   | Tudo do colaborador + painel TI completo: gestão de tarefas, chamados, KB, ativos, auditoria |
  | gestor       | Tudo do colaborador + reset de senha de subordinados diretos (validação hierárquica) |

  ### Verificação de papel no código

  ```typescript
  const TI_EMAILS = [
    'tecnico1@proxximatelecom.com.br',
    'tecnico2@proxximatelecom.com.br'
  ];

  function isTecnicoTI(email: string): boolean {
    return TI_EMAILS.includes(email.toLowerCase());
  }

  function isGestor(senderEmail: string, targetEmail: string): boolean {
    // Consulta REST API RH para verificar campo SUPERIOR
    // Ver ADR-008 para detalhes
  }
  ```

  ---

  ## 4. Validação Hierárquica

  A validação hierárquica é usada para permitir que um gestor solicite reset de senha em nome de um subordinado direto (ver ADR-008 para justificativa completa).

  ### Fluxo

  ```
  1. Gestor envia: "Preciso resetar a senha do João"
  2. O.R.I identifica o colaborador alvo (João)
  3. O.R.I consulta REST API RH: campo SUPERIOR do João
  4. Compara sender.email com SUPERIOR (case-insensitive)
  5. Se match → autorizado → cria tarefa de reset
  6. Se não match → negado → mensagem clara + audit_log
  ```

  ### Cenários

  | Cenário                                | Resultado                              |
  |----------------------------------------|----------------------------------------|
  | Sender == e-mail do próprio colaborador | Autorizado (reset para si mesmo)      |
  | Sender == campo SUPERIOR               | Autorizado (superior direto)          |
  | Sender != nenhum dos dois              | Negado — evento no audit_log          |
  | Colaborador não encontrado na API RH   | Negado                                |
  | Campo SUPERIOR vazio                   | Apenas o próprio pode solicitar        |

  ---

  ## 5. Controle de Acesso às API Routes

  | Rota                         | Quem pode acessar      | Método de validação                    |
  |------------------------------|------------------------|----------------------------------------|
  | `/api/bot/mensagem`        | Zoho Cliq (webhook)    | Validação de domínio do sender          |
  | `/api/colaboradores/sync`  | Vercel Cron            | HMAC via CRON_SECRET                    |
  | `/api/tarefas`             | Técnico TI             | SSO Zoho + verificação de role          |
  | `/api/chamados`            | Técnico TI             | SSO Zoho + verificação de role          |
  | `/api/kb/busca`            | Bot (interno)          | Chamado internamente pelas API Routes   |
  | `/api/kb/artigos`          | Técnico TI             | SSO Zoho + verificação de role          |
  | `/api/audit`               | Técnico TI             | SSO Zoho + verificação de role          |
  | `/api/relatorios`          | Técnico TI             | SSO Zoho + verificação de role          |
  | `/api/zoho/callback`       | Zoho OAuth             | Validação do authorization code         |

  ---

  ## 6. Histórico de Versões

  | Versão | Data    | Mudanças                                           |
  |--------|---------|----------------------------------------------------|
  | 1.0    | 2025-01 | Criação: modelo básico de acesso                   |
  | 3.0    | 2025-03 | Validação hierárquica, RBAC simplificado           |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
