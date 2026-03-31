# INT-05 — Integração Zoho Cliq

  **Bot Conversacional, OAuth 2.0 e API de Mensagens**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Integrações                        |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Visão Geral](#1-visão-geral)
  2. [Autenticação OAuth 2.0](#2-autenticação-oauth-20)
  3. [Webhook do Bot](#3-webhook-do-bot)
  4. [API de Mensagens](#4-api-de-mensagens)
  5. [Cards Interativos](#5-cards-interativos)
  6. [Notificações Automáticas](#6-notificações-automáticas)
  7. [Tratamento de Erros](#7-tratamento-de-erros)
  8. [Histórico de Versões](#8-histórico-de-versões)

  ---

  ## 1. Visão Geral

  O **Zoho Cliq** é a plataforma de comunicação interna da Proxxima Telecom (Zoho One Enterprise). O O.R.I opera como bot registrado na organização, sendo a interface principal para os 1.500+ colaboradores.

  | Aspecto              | Detalhe                                          |
  |----------------------|--------------------------------------------------|
  | Plataforma           | Zoho One Enterprise (connect.proxxima.net)       |
  | Bot name             | `O.R.I`                                        |
  | Autenticação         | OAuth 2.0 (Authorization Code Grant)             |
  | Webhook              | POST para `/api/bot/mensagem` no Vercel        |
  | Direção              | Bidirecional: recebe mensagens + envia respostas |

  ---

  ## 2. Autenticação OAuth 2.0

  ### 2.1 Fluxo

  ```
  1. Admin Zoho autoriza o app O.R.I → Zoho retorna authorization code
  2. O.R.I troca code por access_token + refresh_token via /oauth/v2/token
  3. access_token é usado para chamadas à API (expira em 1h)
  4. refresh_token é usado para renovar access_token (expira em ~1 ano)
  ```

  ### 2.2 Endpoints OAuth

  | Endpoint              | URL                                                    |
  |------------------------|--------------------------------------------------------|
  | Authorize              | `https://accounts.zoho.com/oauth/v2/auth`           |
  | Token                  | `https://accounts.zoho.com/oauth/v2/token`          |
  | Callback (O.R.I)       | `/api/zoho/callback`                                 |

  ### 2.3 Scopes necessários

  | Scope                          | Motivo                              |
  |--------------------------------|--------------------------------------|
  | `ZohoCliq.Bots.ALL`         | Operar como bot                     |
  | `ZohoCliq.Messages.ALL`     | Enviar e receber mensagens           |
  | `ZohoCliq.Channels.READ`    | Ler informações de canais            |

  ### 2.4 Renovação de Token

  O código do O.R.I renova o `access_token` automaticamente usando o `refresh_token` quando recebe 401. O `refresh_token` é armazenado em variável de ambiente no Vercel.

  ---

  ## 3. Webhook do Bot

  ### Configuração no Zoho

  | Campo              | Valor                                              |
  |--------------------|----------------------------------------------------|
  | Webhook URL        | `https://ori-prod.vercel.app/api/bot/mensagem`     |
  | Método             | POST                                                |
  | Content-Type       | application/json                                    |
  | Eventos            | message.received                                    |

  ### Payload recebido

  ```json
  {
    "sender": {
      "email": "joao.silva@proxximatelecom.com.br",
      "name": "João da Silva"
    },
    "chat_id": "cliq_chat_12345",
    "text": "Não consigo acessar meu e-mail",
    "type": "message"
  }
  ```

  ### Processamento

  ```
  1. Extrair sender.email → identificar colaborador no Supabase
  2. Se colaborador não encontrado → responder pedindo que use e-mail corporativo
  3. Analisar texto para determinar fluxo:
     - Contém "senha" ou "reset" → fluxo de reset de senha
     - Contém "crachá" ou "RFID" → fluxo de cadastro de crachá
     - Qualquer outro → fluxo de triagem com IA
  4. Processar fluxo e responder via API de Mensagens
  ```

  ---

  ## 4. API de Mensagens

  ### Enviar mensagem ao colaborador

  ```http
  POST https://cliq.zoho.com/api/v2/bots/{bot_name}/message
  Authorization: Zoho-oauthtoken {access_token}
  Content-Type: application/json

  {
    "text": "Encontrei uma solução para seu problema!",
    "chat_id": "{chat_id}"
  }
  ```

  ### Enviar card interativo

  ```json
  {
    "text": "",
    "card": {
      "title": "Triagem de Chamado",
      "theme": "modern-inline"
    },
    "slides": [
      {
        "type": "text",
        "data": "Encontrei o seguinte na base de conhecimento:\n\n**Como acessar o Carbonio remotamente**\n..."
      },
      {
        "type": "buttons",
        "buttons": [
          { "label": "✓ Resolveu", "action": { "type": "invoke.function", "data": { "name": "feedback", "value": "util" } } },
          { "label": "✗ Não resolveu", "action": { "type": "invoke.function", "data": { "name": "feedback", "value": "nao_util" } } }
        ]
      }
    ]
  }
  ```

  ---

  ## 5. Cards Interativos

  | Card                          | Quando aparece                                      | Botões                            |
  |-------------------------------|-----------------------------------------------------|-----------------------------------|
  | Resultado de triagem          | Após IA analisar mensagem do colaborador             | ✓ Resolveu / ✗ Não resolveu      |
  | Confirmação de reset de senha | Quando gestor solicita reset para subordinado        | Confirmar / Cancelar              |
  | Status de crachá              | Quando RH solicita cadastro de crachá                | Nenhum (informativo)              |
  | Notificação de tarefa         | Quando tarefa é criada para o TI                     | Abrir no Painel                   |

  ---

  ## 6. Notificações Automáticas

  | Evento                              | Destinatário | Mensagem                                                |
  |---------------------------------------|-------------|----------------------------------------------------------|
  | Novo colaborador detectado            | Canal TI    | "Novo colaborador [nome] detectado. [N] tarefas criadas" |
  | Tarefa pendente há mais de 50% do SLA | Técnico     | "Tarefa [tipo] de [nome] está em 50% do SLA"            |
  | Tarefa SLA excedido                   | Canal TI    | "⚠ SLA excedido: tarefa [tipo] de [nome]"               |
  | Chamado criado no GLPI                | Canal TI    | "Chamado #[ID] criado no GLPI para [nome]"               |
  | Desligamento detectado                | Canal TI    | "Desligamento detectado: [nome]. Tarefas de offboarding criadas" |

  ---

  ## 7. Tratamento de Erros

  | Erro                         | Comportamento                                     |
  |------------------------------|---------------------------------------------------|
  | Zoho API indisponível        | Log erro + retry em 30s. Máximo 3 tentativas       |
  | access_token expirado (401)  | Renovação automática com refresh_token             |
  | refresh_token expirado       | Alerta ao TI para reautorizar o app                |
  | Webhook timeout (> 10s)      | Zoho retenta. O.R.I deve responder em < 8s         |
  | Colaborador não encontrado   | Resposta genérica pedindo e-mail corporativo        |

  ---

  ## 8. Histórico de Versões

  | Versão | Data    | Mudanças                                           |
  |--------|---------|----------------------------------------------------|
  | 1.0    | 2025-01 | Criação: bot básico com notificações               |
  | 3.0    | 2025-03 | Cards interativos, triagem com IA, feedback loop   |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
