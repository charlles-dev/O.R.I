# AI-04 — Triagem de Chamados com IA

  **Classificação Automática, Confiança e Decisão de Escalação**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Inteligência Artificial            |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Fluxo de Triagem](#1-fluxo-de-triagem)
  2. [Prompt de Triagem](#2-prompt-de-triagem)
  3. [Resposta Estruturada](#3-resposta-estruturada)
  4. [Limiar de Confiança](#4-limiar-de-confiança)
  5. [Feedback Loop](#5-feedback-loop)
  6. [Fallback](#6-fallback)
  7. [Métricas](#7-métricas)
  8. [Histórico de Versões](#8-histórico-de-versões)

  ---

  ## 1. Fluxo de Triagem

  ```
  1. Mensagem recebida pelo bot
  2. Gerar embedding da mensagem (text-embedding-004)
  3. Buscar top 5 artigos relevantes na KB (pgvector, similaridade ≥ 0.75)
  4. Montar prompt: instruções + dados do colaborador + artigos + mensagem
  5. Chamar Gemini 2.5 Flash com responseMimeType: "application/json"
  6. Parsear resposta JSON
  7. Decidir: resolver pelo bot (≥ 0.75) ou escalar para GLPI (< 0.75)
  8. Registrar triagem no audit_log
  ```

  ---

  ## 2. Prompt de Triagem

  O prompt enviado ao Gemini é composto por 4 seções:

  ### 2.1 Instruções do sistema

  ```
  Você é o O.R.I, assistente de TI da Proxxima Telecom.
  Analise a mensagem do colaborador e classifique o chamado.
  Use APENAS os artigos da KB fornecidos como contexto.
  Se nenhum artigo for relevante, classifique com baixa confiança.
  Responda SEMPRE em JSON no formato especificado.
  ```

  ### 2.2 Dados do colaborador

  ```
  Colaborador: João da Silva
  Setor: Suporte Técnico
  Filial: Matriz
  E-mail: joao.silva@proxximatelecom.com.br
  ```

  ### 2.3 Artigos da KB (top 5)

  ```
  --- Artigo 1 (similaridade: 0.92) ---
  Título: Como acessar o Carbonio remotamente
  Conteúdo: ...
  --- Artigo 2 (similaridade: 0.85) ---
  ...
  ```

  ### 2.4 Mensagem do colaborador

  ```
  "Não consigo acessar meu e-mail desde ontem, diz que a senha está errada"
  ```

  ---

  ## 3. Resposta Estruturada

  O Gemini retorna JSON puro graças a `responseMimeType: "application/json"`:

  ```json
  {
    "categoria": "email",
    "prioridade": "alta",
    "confianca": 0.87,
    "resposta_colaborador": "Olá João! Pelo que você descreveu, parece ser um problema de senha expirada no Carbonio. Tente os seguintes passos: 1. Acesse https://mail.proxximatelecom.com.br ...",
    "requer_ti": false,
    "artigos_utilizados": ["uuid-artigo-1", "uuid-artigo-2"],
    "resumo_tecnico": "Provável senha expirada no Carbonio. Artigo de reset de senha aplicável."
  }
  ```

  ### Campos da resposta

  | Campo                  | Tipo    | Descrição                                         |
  |------------------------|---------|----------------------------------------------------|
  | categoria              | string  | email, rede, vpn, acesso, hardware, software, geral|
  | prioridade             | string  | baixa, media, alta, critica                         |
  | confianca              | float   | 0.0 a 1.0 — confiança da IA na resposta            |
  | resposta_colaborador   | string  | Texto para enviar ao colaborador via bot             |
  | requer_ti              | boolean | Se o problema requer intervenção manual do TI        |
  | artigos_utilizados     | UUID[]  | IDs dos artigos da KB usados na resposta             |
  | resumo_tecnico         | string  | Resumo para o TI (se for escalado)                   |

  ---

  ## 4. Limiar de Confiança

  | Confiança      | Ação                                                  |
  |----------------|-------------------------------------------------------|
  | ≥ 0.75         | Bot envia resposta ao colaborador com botões de feedback |
  | < 0.75         | Cria chamado no GLPI + notifica TI                     |
  | = 0.0          | Erro ou fora do escopo → GLPI direto                   |

  ---

  ## 5. Feedback Loop

  Quando a IA responde com confiança ≥ 0.75, o colaborador recebe botões:

  - **✓ Resolveu** → chamado fechado, artigo recebe `util_count++`
  - **✗ Não resolveu** → chamado criado no GLPI, artigo recebe `nao_util_count++`

  Esse loop melhora a qualidade da KB ao longo do tempo.

  ---

  ## 6. Fallback

  | Cenário                      | Comportamento                              |
  |------------------------------|---------------------------------------------|
  | Gemini API indisponível      | Chamado vai direto para GLPI sem triagem    |
  | Gemini retorna JSON inválido | Log de erro + chamado para GLPI              |
  | Gemini timeout (> 10s)       | Timeout → chamado para GLPI                  |
  | Nenhum artigo na KB          | IA responde com baixa confiança → GLPI       |

  ---

  ## 7. Métricas

  | Métrica                              | Meta           |
  |---------------------------------------|----------------|
  | Taxa de resolução por IA              | ≥ 40%          |
  | Tempo médio de resposta da IA         | < 3 segundos   |
  | Precisão da classificação (categoria) | ≥ 85%          |
  | Taxa de feedback positivo             | ≥ 80%          |

  ---

  ## 8. Histórico de Versões

  | Versão | Data    | Mudanças                              |
  |--------|---------|---------------------------------------|
  | 3.0    | 2025-03 | Criação: triagem completa com Gemini  |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
