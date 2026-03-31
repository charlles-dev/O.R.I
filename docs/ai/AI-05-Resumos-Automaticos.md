# AI-05 — Resumos Automáticos

  **Geração de Resumos de Chamados para o TI via Gemini**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Inteligência Artificial            |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Propósito](#1-propósito)
  2. [Quando Gerar Resumos](#2-quando-gerar-resumos)
  3. [Prompt de Resumo](#3-prompt-de-resumo)
  4. [Formato do Resumo](#4-formato-do-resumo)
  5. [Histórico de Versões](#5-histórico-de-versões)

  ---

  ## 1. Propósito

  Chamados podem ter descrições longas e conversas extensas entre o colaborador e o bot. O resumo automático condensa essas informações em um texto curto e acionável para o TI.

  ---

  ## 2. Quando Gerar Resumos

  | Cenário                                  | Trigger                               |
  |------------------------------------------|----------------------------------------|
  | Chamado escalado para o TI               | Automaticamente ao criar chamado GLPI  |
  | Chamado com > 3 mensagens no bot         | Automaticamente na escalação           |
  | Relatório semanal                        | Resumo de todos os chamados da semana  |
  | Sob demanda                              | TI clica "Gerar resumo" no painel      |

  ---

  ## 3. Prompt de Resumo

  ```
  Resuma o seguinte chamado de TI em no máximo 3 frases.
  Inclua: problema principal, ações já tentadas, e próximo passo recomendado.

  Chamado:
  Título: {titulo}
  Colaborador: {nome} ({setor})
  Descrição: {descricao}
  Histórico de mensagens: {mensagens}
  Resposta da IA (se houver): {resposta_ia}
  ```

  ---

  ## 4. Formato do Resumo

  ```
  **Problema:** Colaborador não consegue acessar e-mail desde ontem (senha incorreta).
  **Tentativas:** IA sugeriu reset de senha pelo Carbonio — colaborador reportou que não funcionou.
  **Recomendação:** Verificar se conta está bloqueada no Carbonio admin (porta 8443).
  ```

  ---

  ## 5. Histórico de Versões

  | Versão | Data    | Mudanças                        |
  |--------|---------|---------------------------------|
  | 3.0    | 2025-03 | Criação: resumos com Gemini     |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
