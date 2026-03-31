# POP-01 — Cadastro de Crachá RFID

  **Procedimento Operacional Padrão — Solicitação, Validação e Cadastro em iNControl e Topdata**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Processos e Operação               |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Objetivo](#1-objetivo)
  2. [Atores Envolvidos](#2-atores-envolvidos)
  3. [Pré-requisitos](#3-pré-requisitos)
  4. [Fluxo Completo](#4-fluxo-completo)
  5. [Dados Necessários](#5-dados-necessários)
  6. [SLAs](#6-slas)
  7. [Troubleshooting](#7-troubleshooting)
  8. [Histórico de Versões](#8-histórico-de-versões)

  ---

  ## 1. Objetivo

  Padronizar o processo de cadastro de crachá RFID para novos colaboradores da Proxxima Telecom, garantindo que o crachá seja cadastrado nos dois sistemas de controle (iNControl e Topdata Inner) dentro do SLA.

  ---

  ## 2. Atores Envolvidos

  | Ator                | Responsabilidade                                          |
  |---------------------|-----------------------------------------------------------|
  | RH / Gestor         | Solicitar cadastro via bot Zoho Cliq                      |
  | Bot O.R.I           | Coletar dados, validar RFID, criar tarefas                |
  | Técnico de TI       | Executar cadastro nos sistemas iNControl e Topdata         |
  | Colaborador         | Receber crachá físico do RH                                |

  ---

  ## 3. Pré-requisitos

  - Colaborador deve estar ativo na tabela `colaboradores` (sync com REST API RH)
  - Código RFID deve ser único (não cadastrado para outro colaborador)
  - Técnico de TI deve ter acesso à Máquina B (iNControl) e à LAN (Topdata)

  ---

  ## 4. Fluxo Completo

  ### 4.1 Solicitação (RH/Gestor → Bot)

  1. RH envia mensagem ao bot: "Cadastrar crachá para João da Silva, código A1B2C3D4E5"
  2. Bot identifica o colaborador pelo nome
  3. Bot valida unicidade do código RFID no Supabase
  4. Se RFID já existe → responde com erro e orienta
  5. Se ok → INSERT em `rfid_crachas` com `cadastrado_incontrol=false`, `cadastrado_topdata=false`

  ### 4.2 Criação de Tarefas (Bot → Painel TI)

  6. Bot cria tarefa `rfid_cadastrar_incontrol` com dados formatados
  7. Bot cria tarefa `rfid_cadastrar_topdata` com dados formatados
  8. Bot notifica canal TI: "2 tarefas de crachá RFID criadas para João da Silva"
  9. Bot responde ao RH: "Solicitação recebida. O TI será notificado."

  ### 4.3 Execução (TI → Sistemas)

  10. TI abre tarefa `rfid_cadastrar_incontrol` no painel
  11. TI acessa iNControl na Máquina B → cadastra pessoa → associa RFID
  12. TI marca tarefa como concluída com screenshot
  13. O.R.I atualiza `rfid_crachas`: `cadastrado_incontrol = true`
  14. TI abre tarefa `rfid_cadastrar_topdata` no painel
  15. TI acessa Topdata Inner → cadastra funcionário → associa RFID
  16. TI marca tarefa como concluída com screenshot
  17. O.R.I atualiza `rfid_crachas`: `cadastrado_topdata = true`

  ### 4.4 Conclusão

  18. O.R.I detecta que ambos os campos são `true`
  19. O.R.I marca `rfid_crachas.ativo = true`
  20. Bot notifica RH: "Crachá de João da Silva está ativo nos sistemas de acesso"

  ---

  ## 5. Dados Necessários

  | Dado            | Fonte                  | Obrigatório | Validação                |
  |-----------------|------------------------|-------------|--------------------------|
  | Nome completo   | Tabela colaboradores    | Sim         | Deve existir como ativo  |
  | E-mail          | Tabela colaboradores    | Sim         | Match com sender ou RH   |
  | Código RFID     | Informado pelo RH       | Sim         | Único no Supabase        |
  | Setor           | Tabela colaboradores    | Sim         | Determina permissões     |
  | Filial          | Tabela colaboradores    | Sim         | Determina local de acesso|

  ---

  ## 6. SLAs

  | Tarefa                        | SLA      | Alerta 50%  | Alerta 100%  |
  |-------------------------------|----------|-------------|--------------|
  | `rfid_cadastrar_incontrol`  | 120 min  | 60 min      | 120 min      |
  | `rfid_cadastrar_topdata`    | 120 min  | 60 min      | 120 min      |
  | Total (ambos concluídos)      | 240 min  | —           | —            |

  ---

  ## 7. Troubleshooting

  | Problema                                | Solução                                     |
  |------------------------------------------|----------------------------------------------|
  | Código RFID já cadastrado                | Verificar a quem pertence. Se inativo, liberar |
  | Colaborador não encontrado no Supabase   | Aguardar próximo sync (15 min) ou sync manual  |
  | iNControl indisponível                   | Verificar se Máquina B está ligada              |
  | Topdata Inner não aceita o RFID          | Verificar formato do código (hex vs decimal)    |

  ---

  ## 8. Histórico de Versões

  | Versão | Data    | Mudanças                                  |
  |--------|---------|-------------------------------------------|
  | 2.0    | 2025-02 | Criação: processo manual com cards        |
  | 3.0    | 2025-03 | Notificação automática ao RH na conclusão |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
