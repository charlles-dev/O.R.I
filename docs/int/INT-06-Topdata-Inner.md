# INT-06 — Integração Topdata Inner

  **Sistema de Ponto Eletrônico — Operação Manual com Cards Formatados**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Integrações                        |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Visão Geral](#1-visão-geral)
  2. [Por que Não Há Integração Automática](#2-por-que-não-há-integração-automática)
  3. [Fluxo de Operação](#3-fluxo-de-operação)
  4. [Dados Fornecidos pelo O.R.I](#4-dados-fornecidos-pelo-ori)
  5. [Guia Passo a Passo para o TI](#5-guia-passo-a-passo-para-o-ti)
  6. [Relação com iNControl](#6-relação-com-incontrol)
  7. [Histórico de Versões](#7-histórico-de-versões)

  ---

  ## 1. Visão Geral

  O **Topdata Inner** é o sistema de ponto eletrônico e controle de catracas da Proxxima Telecom. Funciona na rede local (LAN). Na v3.0, o cadastro de funcionários e crachás RFID é realizado manualmente pelo TI.

  | Aspecto              | Detalhe                                          |
  |----------------------|--------------------------------------------------|
  | Localização          | LAN Proxxima                                     |
  | Acesso               | Aplicação na rede local                          |
  | Integração O.R.I     | **Manual** — card formatado no painel TI          |
  | Tipo de tarefa       | `rfid_cadastrar_topdata`                        |
  | SLA                  | 120 minutos (padrão)                              |

  ---

  ## 2. Por que Não Há Integração Automática

  O Topdata Inner utiliza protocolo proprietário sem documentação pública para integração externa. A comunicação com as catracas usa protocolo binário específico.

  ---

  ## 3. Fluxo de Operação

  ```
  1. Solicitação de crachá entra pelo bot (ou RH solicita via bot)
  2. O.R.I valida unicidade do código RFID
  3. Cria tarefa tipo=rfid_cadastrar_topdata
  4. Card exibe dados formatados com guia passo a passo
  5. TI acessa Topdata Inner na LAN
  6. TI cadastra funcionário e associa RFID
  7. TI marca tarefa como concluída com evidência
  ```

  ---

  ## 4. Dados Fornecidos pelo O.R.I

  | Campo         | Valor de exemplo                              |
  |---------------|------------------------------------------------|
  | Nome          | João da Silva                                  |
  | Matrícula     | 12345                                          |
  | Código RFID   | A1B2C3D4E5                                     |
  | Setor         | Suporte Técnico                                |
  | Filial        | Matriz                                         |
  | Turno         | Comercial (08:00-18:00)                        |

  ---

  ## 5. Guia Passo a Passo para o TI

  1. Acessar Topdata Inner na rede local
  2. Navegar para **Cadastro de Funcionários**
  3. Clicar em **Novo Funcionário**
  4. Preencher: nome, matrícula, setor (copiar do card O.R.I)
  5. Ir para aba **Biometria / RFID**
  6. Inserir código RFID do card
  7. Configurar horários conforme turno do colaborador
  8. Salvar
  9. Tirar screenshot da tela de confirmação
  10. Voltar ao painel O.R.I → marcar tarefa como concluída → anexar evidência

  ---

  ## 6. Relação com iNControl

  O crachá RFID precisa ser cadastrado em **ambos** os sistemas:

  | Sistema      | Controla                              | Tarefa O.R.I                |
  |--------------|---------------------------------------|-----------------------------|
  | iNControl    | Catracas e portas (acesso físico)     | `rfid_cadastrar_incontrol`|
  | Topdata Inner| Ponto eletrônico (jornada de trabalho)| `rfid_cadastrar_topdata`  |

  O crachá só fica **ativo** quando ambas as tarefas são concluídas. Quando ambas concluídas, o bot notifica o RH automaticamente.

  ---

  ## 7. Histórico de Versões

  | Versão | Data    | Mudanças                                        |
  |--------|---------|-------------------------------------------------|
  | 2.0    | 2025-02 | Criação: migração de automação para manual       |
  | 3.0    | 2025-03 | Cards formatados, guia passo a passo, SLA        |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
