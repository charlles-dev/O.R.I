# AI-11 — Casos de Uso por Perfil

  **Como Cada Tipo de Usuário Interage com a IA do O.R.I**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Inteligência Artificial            |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Perfis de Usuário](#1-perfis-de-usuário)
  2. [Colaborador](#2-colaborador)
  3. [Gestor](#3-gestor)
  4. [Técnico de TI](#4-técnico-de-ti)
  5. [RH](#5-rh)
  6. [Matriz de Interações](#6-matriz-de-interações)
  7. [Histórico de Versões](#7-histórico-de-versões)

  ---

  ## 1. Perfis de Usuário

  | Perfil          | Quantidade estimada | Canal principal    | Interação com IA        |
  |-----------------|---------------------|--------------------|--------------------------|
  | Colaborador     | ~1.500              | Bot Zoho Cliq      | Direta (triagem, consulta KB) |
  | Gestor          | ~100                | Bot Zoho Cliq      | Indireta (validação hierárquica) |
  | Técnico de TI   | 2                   | Painel Web TI      | Indireta (resumos, relatórios) |
  | RH              | ~10                 | Bot Zoho Cliq      | Mínima (solicita crachá) |

  ---

  ## 2. Colaborador

  O colaborador é o principal usuário do bot e da IA.

  ### Casos de uso

  | #  | Caso de uso                              | Interação com IA                              | Resultado esperado                   |
  |----|------------------------------------------|-----------------------------------------------|---------------------------------------|
  | 1  | Problema técnico (e-mail, rede, VPN)     | IA classifica e sugere solução da KB          | Resolução pelo bot (≥ 40% dos casos) |
  | 2  | Consulta à KB ("como configurar VPN?")   | IA busca artigos relevantes                   | Artigo retornado ao colaborador       |
  | 3  | Feedback sobre resposta da IA            | Botões "Resolveu" / "Não resolveu"            | Melhora contínua da KB                |
  | 4  | Reset de senha (própria)                 | Sem IA — fluxo determinístico                 | Tarefa criada para TI                 |
  | 5  | Problema que IA não resolve              | IA escala para GLPI com resumo                | TI recebe chamado + resumo            |

  ### Exemplo de conversa

  ```
  Colaborador: "Não consigo acessar meu e-mail, diz que a senha está errada"

  O.R.I (IA): "Olá João! Encontrei uma solução na nossa base de conhecimento:

  📌 Como redefinir sua senha do Carbonio
  1. Acesse https://mail.proxximatelecom.com.br
  2. Clique em 'Esqueci minha senha'
  3. ...

  Isso resolveu seu problema?"

  [✓ Resolveu] [✗ Não resolveu]
  ```

  ---

  ## 3. Gestor

  O gestor interage com o bot principalmente para operações em nome de subordinados diretos.

  ### Casos de uso

  | #  | Caso de uso                              | Interação com IA                              | Resultado esperado                   |
  |----|------------------------------------------|-----------------------------------------------|---------------------------------------|
  | 1  | Reset de senha de subordinado            | Sem IA — validação hierárquica determinística  | Tarefa criada (se autorizado)        |
  | 2  | Consulta sobre status de chamado         | Sem IA — consulta ao banco                    | Status retornado ao gestor            |

  ### Validação hierárquica

  A IA **não** participa da validação hierárquica (ver ADR-008). O `HierarchyValidator` consulta a REST API RH e compara o campo SUPERIOR com o e-mail do sender. Decisão 100% determinística.

  ---

  ## 4. Técnico de TI

  O TI interage indiretamente com a IA, consumindo seus outputs no painel.

  ### Casos de uso

  | #  | Caso de uso                              | Interação com IA                              | Resultado esperado                   |
  |----|------------------------------------------|-----------------------------------------------|---------------------------------------|
  | 1  | Ver resumo de chamado escalado           | IA gerou resumo na escalação                  | Contexto rápido para o TI            |
  | 2  | Analisar relatório semanal de IA         | IA agregou métricas no relatório              | Identificar melhorias necessárias     |
  | 3  | Identificar artigos KB com baixa taxa    | Métricas de feedback (util/nao_util)          | Revisar ou despublicar artigos        |
  | 4  | Criar artigo na KB                       | IA gera embedding automaticamente             | Artigo indexado para busca semântica  |
  | 5  | Ver métricas de IA no dashboard          | Dados do audit_log + chamados                 | Monitorar performance da IA           |

  ---

  ## 5. RH

  O RH tem interação mínima com a IA.

  ### Casos de uso

  | #  | Caso de uso                              | Interação com IA                              | Resultado esperado                   |
  |----|------------------------------------------|-----------------------------------------------|---------------------------------------|
  | 1  | Solicitar cadastro de crachá RFID        | Sem IA — fluxo determinístico                 | 2 tarefas criadas para TI            |
  | 2  | Receber notificação de crachá ativo      | Sem IA — automação baseada em status          | Notificação via bot                  |

  ---

  ## 6. Matriz de Interações

  | Funcionalidade                     | Colaborador | Gestor | TI  | RH  | Usa IA |
  |------------------------------------|-------------|--------|-----|-----|--------|
  | Triagem de chamados                | ✅          | —      | —   | —   | ✅     |
  | Busca na KB                        | ✅          | —      | ✅  | —   | ✅     |
  | Reset de senha (própria)           | ✅          | —      | —   | —   | ❌     |
  | Reset de senha (subordinado)       | —           | ✅     | —   | —   | ❌     |
  | Cadastro de crachá RFID            | —           | —      | ✅  | ✅  | ❌     |
  | Gestão de tarefas manuais          | —           | —      | ✅  | —   | ❌     |
  | Resumo de chamados                 | —           | —      | ✅  | —   | ✅     |
  | Relatórios e métricas              | —           | —      | ✅  | —   | ✅     |
  | Feedback sobre IA                  | ✅          | —      | —   | —   | ❌     |
  | Manutenção da KB                   | —           | —      | ✅  | —   | ✅     |

  ---

  ## 7. Histórico de Versões

  | Versão | Data    | Mudanças                              |
  |--------|---------|---------------------------------------|
  | 3.0    | 2025-03 | Criação: casos de uso por perfil      |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
