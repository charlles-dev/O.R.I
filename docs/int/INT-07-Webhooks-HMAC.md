# INT-07 — Webhooks e Autenticação HMAC

  **Segurança de Webhooks, Assinatura de Cron Jobs e Validação de Payloads**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Integrações                        |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Visão Geral](#1-visão-geral)
  2. [HMAC-SHA256 para Cron Jobs](#2-hmac-sha256-para-cron-jobs)
  3. [Webhook do Zoho Cliq](#3-webhook-do-zoho-cliq)
  4. [Webhook do GLPI](#4-webhook-do-glpi)
  5. [Implementação de Verificação HMAC](#5-implementação-de-verificação-hmac)
  6. [Boas Práticas](#6-boas-práticas)
  7. [Histórico de Versões](#7-histórico-de-versões)

  ---

  ## 1. Visão Geral

  O O.R.I recebe dados de múltiplas fontes via webhooks e cron jobs. Cada fonte requer validação para garantir que a requisição é legítima.

  | Fonte              | Rota                           | Método de validação           |
  |--------------------|---------------------------------|-------------------------------|
  | Vercel Cron        | `/api/colaboradores/sync`    | HMAC-SHA256 via `CRON_SECRET`|
  | Vercel Cron        | `/api/audit/cleanup`         | HMAC-SHA256 via `CRON_SECRET`|
  | Vercel Cron        | `/api/kb/reindex`            | HMAC-SHA256 via `CRON_SECRET`|
  | Zoho Cliq          | `/api/bot/mensagem`          | Verificação do header Zoho     |
  | GLPI (se configurado)| `/api/glpi/webhook`         | App Token do GLPI              |

  ---

  ## 2. HMAC-SHA256 para Cron Jobs

  ### Funcionamento

  O Vercel Cron envia um header `Authorization: Bearer {CRON_SECRET}` em cada execução de cron job. A API Route valida esse header antes de processar.

  ### Validação

  ```typescript
  // /api/colaboradores/sync (route handler)
  export async function POST(req: Request) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token !== process.env.CRON_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Processar sync...
  }
  ```

  ### Geração do CRON_SECRET

  ```bash
  openssl rand -hex 32
  # Resultado: 64 caracteres hexadecimais
  # Armazenar como variável de ambiente no Vercel
  ```

  ---

  ## 3. Webhook do Zoho Cliq

  ### Validação

  O webhook do Zoho Cliq envia o payload com headers que permitem verificar a origem.

  ```typescript
  export async function POST(req: Request) {
    const body = await req.json();

    // Verificar que o payload tem a estrutura esperada
    if (!body.sender?.email || !body.text) {
      return Response.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Verificar que o sender é um e-mail do domínio da Proxxima
    if (!body.sender.email.endsWith('@proxximatelecom.com.br')) {
      return Response.json({ error: 'Unauthorized domain' }, { status: 403 });
    }

    // Processar mensagem...
  }
  ```

  ---

  ## 4. Webhook do GLPI

  Se configurado para notificações de status de chamado:

  ```typescript
  export async function POST(req: Request) {
    const appToken = req.headers.get('app-token');

    if (appToken !== process.env.GLPI_WEBHOOK_TOKEN) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Processar atualização de status...
  }
  ```

  ---

  ## 5. Implementação de Verificação HMAC

  ### Função genérica de validação HMAC

  ```typescript
  import { createHmac, timingSafeEqual } from 'crypto';

  function verifyHmac(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    const expected = createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const sigBuffer = Buffer.from(signature, 'hex');
    const expBuffer = Buffer.from(expected, 'hex');

    if (sigBuffer.length !== expBuffer.length) return false;
    return timingSafeEqual(sigBuffer, expBuffer);
  }
  ```

  > ⚠ **IMPORTANTE:** Sempre usar `timingSafeEqual` para comparar hashes. Comparação com `===` é vulnerável a timing attacks.

  ---

  ## 6. Boas Práticas

  | Prática                                    | Motivo                                      |
  |---------------------------------------------|----------------------------------------------|
  | Usar CRON_SECRET com mínimo 32 caracteres   | Resistência a brute force                     |
  | Rotacionar secrets a cada 6 meses           | Limitar impacto de vazamento                  |
  | Validar payload ANTES de processar           | Evitar injeção de dados maliciosos            |
  | Logar tentativas de acesso inválido          | Detectar ataques e abusos                     |
  | Usar timing-safe comparison para HMAC        | Prevenir timing attacks                       |
  | Rate limiting nos endpoints webhook          | Prevenir DoS                                  |

  ---

  ## 7. Histórico de Versões

  | Versão | Data    | Mudanças                                        |
  |--------|---------|-------------------------------------------------|
  | 1.0    | 2025-01 | Criação: validação básica de cron               |
  | 3.0    | 2025-03 | HMAC-SHA256, validação Zoho, rate limiting       |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
