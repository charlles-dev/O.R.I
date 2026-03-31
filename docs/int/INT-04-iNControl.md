# INT-04 — Integração iNControl

  **Sistema de Controle de Acesso Físico — Operação Manual com Cards Formatados**

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
  6. [Evidência de Conclusão](#6-evidência-de-conclusão)
  7. [Histórico de Versões](#7-histórico-de-versões)

  ---

  ## 1. Visão Geral

  O **iNControl** é o sistema de controle de acesso físico da Proxxima Telecom, rodando na Máquina B da rede interna. Gerencia catracas, portas e leitores RFID. Na v3.0, todas as operações são realizadas manualmente pelo TI com dados formatados pelo O.R.I.

  | Aspecto              | Detalhe                                          |
  |----------------------|--------------------------------------------------|
  | Localização          | Máquina B — rede interna (LAN)                   |
  | Acesso               | Navegador → `localhost:8080` na Máquina B   |
  | Integração O.R.I     | **Manual** — card formatado no painel TI          |
  | Tipo de tarefa       | `rfid_cadastrar_incontrol`                      |
  | SLA                  | 120 minutos (padrão)                              |

  ---

  ## 2. Por que Não Há Integração Automática

  O iNControl não possui API REST documentada para integração externa. A integração precisaria ser construída por reverse-engineering do protocolo proprietário, o que foi descartado por:

  - Risco de quebra em atualizações do software
  - Custo de manutenção de integração não-documentada
  - Necessidade de agente on-premise (eliminado na v3.0 — ver ADR-001)

  ---

  ## 3. Fluxo de Operação

  ```
  1. Colaborador/RH solicita cadastro de crachá via bot Zoho Cliq
  2. Bot coleta: nome, e-mail, código RFID, setor, filial
  3. O.R.I valida unicidade do código RFID no Supabase
  4. O.R.I cria tarefa tipo=rfid_cadastrar_incontrol no painel TI
  5. Card exibe dados formatados com botão "Copiar"
  6. TI acessa iNControl na Máquina B
  7. TI cadastra pessoa e credencial RFID
  8. TI marca tarefa como concluída com evidência (screenshot)
  ```

  ---

  ## 4. Dados Fornecidos pelo O.R.I

  O card da tarefa `rfid_cadastrar_incontrol` exibe:

  | Campo         | Valor de exemplo                              |
  |---------------|------------------------------------------------|
  | Nome          | João da Silva                                  |
  | E-mail        | joao.silva@proxximatelecom.com.br              |
  | Código RFID   | A1B2C3D4E5                                     |
  | Setor         | Suporte Técnico                                |
  | Filial        | Matriz                                         |
  | Data admissão | 2024-03-15                                     |

  ---

  ## 5. Guia Passo a Passo para o TI

  1. Acessar iNControl na Máquina B: `localhost:8080`
  2. Navegar para **Cadastro de Pessoas**
  3. Clicar em **Nova Pessoa**
  4. Preencher campos (copiar do card O.R.I)
  5. Ir para aba **Credenciais**
  6. Adicionar credencial RFID com o código do card
  7. Definir permissões de acesso conforme setor/filial
  8. Salvar
  9. Tirar screenshot da tela de confirmação
  10. Voltar ao painel O.R.I → marcar tarefa como concluída → anexar evidência

  ---

  ## 6. Evidência de Conclusão

  | Campo              | Obrigatório | Descrição                                  |
  |--------------------|-------------|---------------------------------------------|
  | Screenshot         | Sim         | Captura da tela do iNControl com cadastro   |
  | Observações        | Não         | Notas adicionais (ex: permissões especiais) |
  | Data/hora conclusão| Automático  | Registrado pelo sistema ao marcar concluída |

  ---

  ## 7. Histórico de Versões

  | Versão | Data    | Mudanças                                        |
  |--------|---------|-------------------------------------------------|
  | 2.0    | 2025-02 | Criação: migração de automação para manual       |
  | 3.0    | 2025-03 | Cards formatados com botão Copiar, SLA definido  |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
