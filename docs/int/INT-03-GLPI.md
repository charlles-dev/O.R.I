# INT-03 — Integração GLPI

  **Criação e Sincronização de Chamados via API REST**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Integrações                        |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Visão Geral](#1-visão-geral)
  2. [Autenticação](#2-autenticação)
  3. [Endpoints Utilizados](#3-endpoints-utilizados)
  4. [Fluxo de Criação de Chamado](#4-fluxo-de-criação-de-chamado)
  5. [Mapeamento de Campos](#5-mapeamento-de-campos)
  6. [Sincronização de Status](#6-sincronização-de-status)
  7. [Tratamento de Erros](#7-tratamento-de-erros)
  8. [Histórico de Versões](#8-histórico-de-versões)

  ---

  ## 1. Visão Geral

  O **GLPI** é o sistema oficial de chamados técnicos da Proxxima Telecom (self-hosted). O O.R.I integra-se ao GLPI via API REST para criar chamados quando a triagem de IA não resolve o problema do colaborador (confiança < 0.75).

  | Aspecto          | Detalhe                                                 |
  |------------------|---------------------------------------------------------|
  | URL base         | `https://glpi.proxximatelecom.local/apirest.php`                      |
  | Autenticação     | App Token + User Token (conta de serviço `ori-bot`)   |
  | Formato          | JSON                                                     |
  | Direção          | O.R.I → GLPI (escrita) e O.R.I ← GLPI (leitura de status)|
  | Quando é usado   | Quando a IA classifica um chamado com confiança < 0.75   |

  ---

  ## 2. Autenticação

  ### Headers obrigatórios

  ```http
  Content-Type: application/json
  App-Token: {GLPI_APP_TOKEN}
  Authorization: user_token {GLPI_USER_TOKEN}
  ```

  ### Iniciar sessão (se necessário)

  ```http
  GET /apirest.php/initSession
  App-Token: {GLPI_APP_TOKEN}
  Authorization: user_token {GLPI_USER_TOKEN}
  ```

  Response: `{ "session_token": "abc123" }`

  ---

  ## 3. Endpoints Utilizados

  | Operação             | Método | Endpoint                           | Descrição                           |
  |----------------------|--------|-------------------------------------|--------------------------------------|
  | Criar chamado        | POST   | `/apirest.php/Ticket`            | Cria novo ticket no GLPI             |
  | Buscar chamado       | GET    | `/apirest.php/Ticket/{id}`       | Consulta dados de um ticket          |
  | Atualizar chamado    | PUT    | `/apirest.php/Ticket/{id}`       | Atualiza status ou campos            |
  | Adicionar followup   | POST   | `/apirest.php/Ticket/{id}/ITILFollowup` | Adiciona comentário ao ticket |
  | Buscar categorias    | GET    | `/apirest.php/ITILCategory`      | Lista categorias disponíveis         |

  ---

  ## 4. Fluxo de Criação de Chamado

  ```
  1. IA classifica chamado com confiança < 0.75
  2. API Route formata payload para GLPI
  3. POST /apirest.php/Ticket com dados do chamado
  4. GLPI retorna { "id": 12345 }
  5. O.R.I salva glpi_ticket_id = 12345 na tabela chamados
  6. O.R.I notifica TI via Zoho Cliq: "Chamado #12345 criado no GLPI"
  7. O.R.I informa colaborador: "Seu chamado foi encaminhado ao TI"
  ```

  ### Payload de criação

  ```json
  {
    "input": {
      "name": "[ORI] Problema de acesso ao e-mail",
      "content": "Colaborador: João da Silva\nSetor: Suporte\n\nDescrição: Não consigo acessar meu e-mail desde ontem...",
      "urgency": 3,
      "type": 1,
      "itilcategories_id": 5,
      "_users_id_requester": 0
    }
  }
  ```

  ---

  ## 5. Mapeamento de Campos

  ### Prioridade O.R.I → Urgência GLPI

  | Prioridade O.R.I | Urgência GLPI | Valor |
  |-------------------|---------------|-------|
  | baixa             | Muito baixa   | 1     |
  | media             | Média         | 3     |
  | alta              | Alta          | 4     |
  | critica           | Muito alta    | 5     |

  ### Categoria O.R.I → Categoria GLPI

  | Categoria IA      | Categoria GLPI (itilcategories_id) |
  |-------------------|------------------------------------|
  | email             | 5 (E-mail / Carbonio)              |
  | rede              | 8 (Rede / Infraestrutura)          |
  | acesso            | 12 (Acesso / Permissões)           |
  | hardware          | 15 (Hardware / Equipamentos)       |
  | software          | 18 (Software / Aplicações)         |
  | vpn               | 10 (VPN / Acesso Remoto)           |
  | ponto             | 20 (Ponto / Crachá RFID)          |
  | geral             | 1 (Geral)                          |

  > ℹ Os IDs acima refletem a configuração atual do GLPI da Proxxima Telecom. Se forem alterados no GLPI, atualizar a constante `GLPI_CATEGORY_MAP` em `src/lib/glpi.ts`.

  ---

  ## 6. Sincronização de Status

  | Status GLPI      | Status O.R.I     | Direção de sync          |
  |------------------|-------------------|--------------------------|
  | Novo             | aberto            | GLPI → O.R.I             |
  | Em atendimento   | em_andamento      | GLPI → O.R.I             |
  | Solucionado      | resolvido         | GLPI → O.R.I             |
  | Fechado          | fechado           | GLPI → O.R.I             |

  ---

  ## 7. Tratamento de Erros

  | Erro                     | Comportamento                                      |
  |--------------------------|---------------------------------------------------|
  | GLPI indisponível        | Chamado salvo localmente (glpi_ticket_id = NULL). Retry manual via painel |
  | Token expirado/inválido  | Log de erro + alerta ao TI para renovar tokens     |
  | Categoria não encontrada | Criar chamado sem categoria. Log de warning         |
  | Chamado duplicado        | Verificar por título + colaborador antes de criar   |

  ---

  ## 8. Histórico de Versões

  | Versão | Data    | Mudanças                                |
  |--------|---------|-----------------------------------------|
  | 1.0    | 2025-01 | Criação: integração básica GLPI         |
  | 3.0    | 2025-03 | Triagem IA antes de criar chamado GLPI  |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
