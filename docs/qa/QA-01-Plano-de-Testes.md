# QA-01 — Plano de Testes

  **Estratégia, Cenários e Cobertura de Testes do O.R.I v3.0**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Qualidade                         |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Estratégia de Testes](#1-estratégia-de-testes)
  2. [Cenários Críticos](#2-cenários-críticos)
  3. [Testes por Módulo](#3-testes-por-módulo)
  4. [Testes de Integração](#4-testes-de-integração)
  5. [Testes de IA](#5-testes-de-ia)
  6. [Histórico de Versões](#6-histórico-de-versões)

  ---

  ## 1. Estratégia de Testes

  | Tipo de teste   | Ferramenta      | Cobertura                                  |
  |-----------------|-----------------|---------------------------------------------|
  | Unitário        | Jest / Vitest   | Lógica de negócio em /lib                   |
  | Integração      | Jest + Supabase | API Routes + banco de dados                 |
  | E2E (manual)    | Checklist manual| Fluxos completos (bot, painel, sync)        |
  | IA              | Testes manuais  | Precisão da triagem com casos reais          |

  ---

  ## 2. Cenários Críticos

  | #  | Cenário                                          | Prioridade | Tipo          |
  |----|--------------------------------------------------|------------|---------------|
  | 1  | Sync detecta novo colaborador e gera tarefas     | Alta       | Integração    |
  | 2  | Sync detecta desligamento e gera offboarding     | Alta       | Integração    |
  | 3  | Bot recebe mensagem e IA responde corretamente   | Alta       | E2E + IA      |
  | 4  | Bot recebe mensagem e IA escala para GLPI        | Alta       | E2E + IA      |
  | 5  | Gestor solicita reset para subordinado — autorizado | Alta    | Integração    |
  | 6  | Colaborador tenta reset de outro — negado        | Alta       | Integração    |
  | 7  | Cron job sem HMAC é rejeitado (401)              | Alta       | Segurança     |
  | 8  | KB busca semântica retorna artigos relevantes    | Média      | IA            |
  | 9  | Tarefa concluída com evidência é registrada      | Média      | Integração    |
  | 10 | Cadastro de crachá RFID duplicado é rejeitado    | Média      | Integração    |

  ---

  ## 3. Testes por Módulo

  ### 3.1 Módulo de Colaboradores

  | Caso de teste                              | Entrada                      | Resultado esperado              |
  |--------------------------------------------|------------------------------|----------------------------------|
  | Sync com 0 mudanças                        | API RH idêntica ao Supabase  | 0 tarefas, log "0 novos"        |
  | Sync com 1 novo colaborador                | Matrícula nova na API RH     | 1 INSERT + tarefas onboarding   |
  | Sync com 1 desligamento                    | STATUS=DESLIGADO na API RH   | UPDATE status + offboarding     |
  | Sync com API RH indisponível               | Timeout na API RH            | Log de erro, retry na próxima   |

  ### 3.2 Módulo de Bot

  | Caso de teste                              | Mensagem                     | Resultado esperado              |
  |--------------------------------------------|------------------------------|----------------------------------|
  | Mensagem genérica (triagem)                | "Não acesso meu e-mail"      | Triagem IA + resposta ou GLPI   |
  | Pedido de reset de senha (próprio)         | "Quero resetar minha senha"  | Tarefa carbonio_reset_senha     |
  | Pedido de reset (gestor para subordinado)  | "Resetar senha do João"      | Validação hierárquica → tarefa  |
  | Pedido de reset (não-autorizado)           | "Resetar senha do João"      | Negado + audit_log              |
  | Cadastro de crachá                         | "Cadastrar crachá A1B2C3"    | Validação RFID + 2 tarefas      |
  | Sender fora do domínio                     | sender: @gmail.com           | Erro 403                        |

  ### 3.3 Módulo de KB

  | Caso de teste                              | Entrada                      | Resultado esperado              |
  |--------------------------------------------|------------------------------|----------------------------------|
  | Busca com texto similar a artigo existente | "problema com VPN"           | Artigos sobre VPN retornados    |
  | Busca sem artigos relevantes               | "problema inventado xyz"     | Lista vazia                     |
  | Criar artigo gera embedding                | POST /api/kb/artigos         | Artigo com embedding preenchido |

  ---

  ## 4. Testes de Integração

  | Integração                | Teste                                         |
  |---------------------------|-----------------------------------------------|
  | O.R.I → REST API RH      | Sync retorna dados válidos e processa         |
  | O.R.I → GLPI              | Chamado criado no GLPI retorna ID             |
  | O.R.I → Gemini API        | Triagem retorna JSON válido com confiança     |
  | O.R.I → Zoho Cliq         | Bot responde mensagem de teste em < 8s        |
  | O.R.I → Supabase          | CRUD funcional em todas as tabelas            |

  ---

  ## 5. Testes de IA

  ### Precisão da triagem

  | Tipo de chamado       | Exemplos testados | Taxa de acerto esperada |
  |-----------------------|-------------------|-------------------------|
  | E-mail (Carbonio)     | 20                | ≥ 90%                   |
  | Rede/VPN              | 15                | ≥ 85%                   |
  | Hardware              | 10                | ≥ 80%                   |
  | Acesso/senha          | 15                | ≥ 90%                   |

  ### Teste de fallback

  | Cenário                    | Resultado esperado                    |
  |----------------------------|---------------------------------------|
  | Gemini API retorna erro    | Chamado criado no GLPI sem triagem    |
  | Gemini retorna JSON inválido | Chamado criado no GLPI sem triagem  |
  | Latência > 10s             | Timeout + chamado para GLPI           |

  ---

  ## 6. Histórico de Versões

  | Versão | Data    | Mudanças                                 |
  |--------|---------|------------------------------------------|
  | 1.0    | 2025-01 | Criação: plano básico                    |
  | 3.0    | 2025-03 | Testes de IA, cenários de segurança      |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
