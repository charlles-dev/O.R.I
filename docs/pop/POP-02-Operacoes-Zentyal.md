# POP-02 — Operações Zentyal

  **Procedimento Operacional Padrão — Criar Usuário, Trocar Grupo, Reset de Senha, Desativar**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Processos e Operação               |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Visão Geral](#1-visão-geral)
  2. [Acesso ao Zentyal](#2-acesso-ao-zentyal)
  3. [Criar Usuário](#3-criar-usuário)
  4. [Trocar Grupo (Mudança de Setor)](#4-trocar-grupo)
  5. [Reset de Senha](#5-reset-de-senha)
  6. [Desativar Usuário (Offboarding)](#6-desativar-usuário)
  7. [SLAs](#7-slas)
  8. [Histórico de Versões](#8-histórico-de-versões)

  ---

  ## 1. Visão Geral

  O Zentyal (Máquina A) gerencia o diretório de usuários Samba e os compartilhamentos de arquivo por setor. Todas as operações são manuais, mas os dados necessários são fornecidos pelo O.R.I via cards na Central de Tarefas.

  ---

  ## 2. Acesso ao Zentyal

  | Campo      | Valor                                      |
  |------------|---------------------------------------------|
  | URL        | `https://192.168.1.20:8443`             |
  | Rede       | LAN apenas (requer VPN para acesso remoto)  |
  | Credenciais| Admin do Zentyal (TI)                       |

  ---

  ## 3. Criar Usuário

  **Tarefa O.R.I:** `zentyal_criar_usuario`

  ### Dados no card

  | Campo             | Exemplo                                |
  |-------------------|----------------------------------------|
  | Nome completo     | João da Silva                          |
  | Username sugerido | joao.silva                             |
  | E-mail            | joao.silva@proxximatelecom.com.br      |
  | Grupo destino     | grp_suporte                            |

  ### Passos

  1. Acessar Zentyal → Users and Computers → Users
  2. Clicar "Add User"
  3. Preencher: First Name, Last Name, Username (do card), Password (temporária)
  4. Salvar
  5. Ir para Groups → selecionar grupo do card (ex: `grp_suporte`)
  6. Adicionar o novo usuário ao grupo
  7. Verificar que o compartilhamento de arquivo do grupo está acessível
  8. Marcar tarefa como concluída no painel O.R.I com evidência

  ---

  ## 4. Trocar Grupo

  **Tarefa O.R.I:** `zentyal_trocar_grupo`

  ### Dados no card

  | Campo             | Exemplo                                |
  |-------------------|----------------------------------------|
  | Nome              | Maria Souza                            |
  | Grupo atual       | grp_comercial                          |
  | Grupo destino     | grp_rh                                 |

  ### Passos

  1. Acessar Zentyal → Groups → selecionar grupo atual
  2. Remover o usuário do grupo atual
  3. Ir para o grupo destino → adicionar o usuário
  4. Verificar permissões dos compartilhamentos
  5. Marcar tarefa como concluída

  ---

  ## 5. Reset de Senha

  **Tarefa O.R.I:** `zentyal_reset_senha`

  1. Acessar Zentyal → Users → localizar o usuário
  2. Editar → definir nova senha temporária
  3. Salvar
  4. Comunicar a senha temporária ao colaborador (via TI, pessoalmente ou por telefone)
  5. Marcar tarefa como concluída

  ---

  ## 6. Desativar Usuário

  **Tarefa O.R.I:** `zentyal_desativar`

  1. Acessar Zentyal → Users → localizar o usuário
  2. Desabilitar a conta (não excluir — manter para histórico)
  3. Remover de todos os grupos
  4. Verificar que acesso aos compartilhamentos foi revogado
  5. Marcar tarefa como concluída

  ---

  ## 7. SLAs

  | Operação            | SLA       |
  |---------------------|-----------|
  | Criar usuário       | 60 min    |
  | Trocar grupo        | 120 min   |
  | Reset de senha      | 30 min    |
  | Desativar usuário   | 60 min    |

  ---

  ## 8. Histórico de Versões

  | Versão | Data    | Mudanças                           |
  |--------|---------|------------------------------------|
  | 2.0    | 2025-02 | Criação: procedimentos manuais     |
  | 3.0    | 2025-03 | Cards com dados formatados, SLAs   |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
