# BD-02 — Dicionário de Dados

  **Descrição Detalhada de Cada Coluna, Tipos e Regras de Negócio**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Banco de Dados                     |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Convenções](#1-convenções)
  2. [colaboradores](#2-colaboradores)
  3. [chamados](#3-chamados)
  4. [tarefas_manuais](#4-tarefas_manuais)
  5. [kb_artigos](#5-kb_artigos)
  6. [kb_artigos_feedback](#6-kb_artigos_feedback)
  7. [rfid_crachas](#7-rfid_crachas)
  8. [ativos](#8-ativos)
  9. [audit_log](#9-audit_log)
  10. [Histórico de Versões](#10-histórico-de-versões)

  ---

  ## 1. Convenções

  | Convenção        | Regra                                                          |
  |------------------|----------------------------------------------------------------|
  | Nomenclatura     | snake_case para tabelas e colunas                              |
  | PKs              | UUID v4 gerado pelo PostgreSQL (`gen_random_uuid()`)         |
  | FKs              | Sufixo `_id`, ex: `colaborador_id`                        |
  | Timestamps       | `TIMESTAMPTZ` com default `now()` — sempre UTC             |
  | Soft delete      | NÃO utilizado — registros são atualizados (status) ou preservados |
  | Enums            | Tipos PostgreSQL customizados — validação no banco             |
  | JSON             | `JSONB` para dados semi-estruturados com indexação GIN       |

  ---

  ## 2. colaboradores

  Tabela central — representa todo colaborador ativo ou desligado da Proxxima Telecom.

  | Coluna             | Tipo                | Null | Default            | Descrição                                                                |
  |--------------------|---------------------|------|---------------------|--------------------------------------------------------------------------|
  | id                 | UUID                | N    | gen_random_uuid()   | Identificador único interno                                               |
  | matricula          | VARCHAR(20)         | N    | —                   | Matrícula do RH — UNIQUE — vem da REST API RH                            |
  | nome_completo      | VARCHAR(200)        | N    | —                   | Nome completo do colaborador                                              |
  | email_corporativo  | VARCHAR(200)        | S    | —                   | E-mail @proxximatelecom — pode ser NULL para colaboradores recém-admitidos sem conta Carbonio |
  | email_pessoal      | VARCHAR(200)        | S    | —                   | E-mail pessoal — backup de contato                                        |
  | setor              | VARCHAR(100)        | N    | —                   | Setor/departamento: TI, RH, Financeiro, Comercial, Suporte, etc.          |
  | cargo              | VARCHAR(150)        | S    | —                   | Cargo na empresa                                                          |
  | filial             | VARCHAR(100)        | N    | —                   | Filial de lotação — usada para determinar grupo Zentyal (`grp_{local}`) |
  | superior_email     | VARCHAR(200)        | S    | —                   | E-mail do superior direto — vem do campo SUPERIOR da REST API RH          |
  | data_admissao      | DATE                | S    | —                   | Data de admissão                                                          |
  | status             | status_colaborador  | N    | 'ativo'             | ativo / desligado / ferias / afastado                                     |
  | dados_api_rh       | JSONB               | N    | '{}'                | Campos extras da REST API RH que não têm coluna dedicada                  |
  | criado_em          | TIMESTAMPTZ         | N    | now()               | Timestamp de criação do registro                                          |
  | atualizado_em      | TIMESTAMPTZ         | N    | now()               | Timestamp da última atualização (trigger automático)                      |

  ### Regras de Negócio

  - A matrícula é a chave natural — usada para identificar o colaborador na REST API RH
  - O e-mail corporativo é NULL quando o colaborador é detectado sem conta Carbonio. Nesse caso, o sync gera tarefa `carbonio_criar_conta`
  - O campo `superior_email` é usado pelo `HierarchyValidator` para verificar delegação de reset de senha (ver ADR-008)

  ---

  ## 3. chamados

  | Coluna               | Tipo             | Null | Default   | Descrição                                                            |
  |----------------------|------------------|------|-----------|----------------------------------------------------------------------|
  | id                   | UUID             | N    | auto      | Identificador único                                                   |
  | colaborador_id       | UUID (FK)        | S    | —         | Colaborador que abriu o chamado                                       |
  | glpi_ticket_id       | INTEGER          | S    | —         | ID do ticket no GLPI (NULL se não sincronizado)                       |
  | titulo               | VARCHAR(300)     | N    | —         | Título do chamado (pode ser gerado pela IA)                           |
  | descricao            | TEXT             | N    | —         | Descrição completa do problema                                        |
  | categoria            | VARCHAR(100)     | S    | —         | Categoria classificada pela IA (rede, email, acesso, hardware, etc.)  |
  | prioridade           | prioridade       | N    | 'media'   | baixa / media / alta / critica                                        |
  | status               | status_chamado   | N    | 'aberto'  | aberto / em_andamento / resolvido / fechado / cancelado               |
  | confianca_ia         | FLOAT            | S    | —         | Índice de confiança da IA (0.0 a 1.0). >= 0.75 = alta confiança      |
  | resposta_ia          | TEXT             | S    | —         | Resposta gerada pelo Gemini para o colaborador                        |
  | artigos_utilizados   | UUID[]           | S    | —         | IDs dos artigos da KB usados no prompt de triagem                     |
  | resolvido_por_ia     | BOOLEAN          | N    | false     | true se o colaborador clicou "✓ Resolveu" no card do bot              |
  | tecnico_responsavel  | VARCHAR(200)     | S    | —         | E-mail do técnico que assumiu o chamado                               |
  | solucao              | TEXT             | S    | —         | Solução aplicada pelo TI (quando resolvido manualmente)               |
  | criado_em            | TIMESTAMPTZ      | N    | now()     | Timestamp de criação                                                  |
  | atualizado_em        | TIMESTAMPTZ      | N    | now()     | Timestamp da última atualização                                       |
  | fechado_em           | TIMESTAMPTZ      | S    | —         | Timestamp de fechamento                                               |

  ---

  ## 4. tarefas_manuais

  | Coluna               | Tipo          | Null | Default   | Descrição                                                            |
  |----------------------|---------------|------|-----------|----------------------------------------------------------------------|
  | id                   | UUID          | N    | auto      | Identificador único                                                   |
  | colaborador_id       | UUID (FK)     | S    | —         | Colaborador alvo da tarefa                                            |
  | tipo                 | tipo_tarefa   | N    | —         | Tipo de operação (carbonio_criar_conta, zentyal_criar_usuario, etc.)  |
  | prioridade           | prioridade    | N    | 'media'   | Prioridade da tarefa                                                  |
  | status               | status_tarefa | N    | 'pendente'| pendente / em_andamento / concluida / cancelada                       |
  | dados                | JSONB         | N    | '{}'      | Dados formatados para exibir no card (nome, email_sugerido, etc.)     |
  | tecnico_responsavel  | VARCHAR(200)  | S    | —         | Técnico que assumiu a tarefa                                          |
  | evidencia            | TEXT          | S    | —         | Texto ou URL da evidência de conclusão (screenshot, link)             |
  | sla_minutos          | INTEGER       | N    | 120       | Prazo em minutos para conclusão                                       |
  | criado_em            | TIMESTAMPTZ   | N    | now()     | Timestamp de criação                                                  |
  | iniciado_em          | TIMESTAMPTZ   | S    | —         | Timestamp de início pelo técnico                                      |
  | concluido_em         | TIMESTAMPTZ   | S    | —         | Timestamp de conclusão                                                |

  ---

  ## 5. kb_artigos

  | Coluna          | Tipo          | Null | Default | Descrição                                                            |
  |-----------------|---------------|------|---------|----------------------------------------------------------------------|
  | id              | UUID          | N    | auto    | Identificador único                                                   |
  | titulo          | VARCHAR(300)  | N    | —       | Título do artigo                                                      |
  | conteudo        | TEXT          | N    | —       | Conteúdo completo do artigo (Markdown)                                |
  | categoria       | VARCHAR(100)  | S    | —       | Categoria do artigo (rede, email, vpn, impressora, etc.)              |
  | tags            | TEXT[]        | N    | '{}'    | Tags para busca e filtragem                                           |
  | embedding       | vector(768)   | S    | —       | Vetor de embedding gerado pelo text-embedding-004                     |
  | publicado       | BOOLEAN       | N    | true    | Se visível para busca semântica                                       |
  | util_count      | INTEGER       | N    | 0       | Contador de feedbacks positivos                                       |
  | nao_util_count  | INTEGER       | N    | 0       | Contador de feedbacks negativos                                       |
  | autor           | VARCHAR(200)  | S    | —       | Autor/responsável pelo artigo                                         |
  | criado_em       | TIMESTAMPTZ   | N    | now()   | Timestamp de criação                                                  |
  | atualizado_em   | TIMESTAMPTZ   | N    | now()   | Timestamp da última atualização                                       |

  ---

  ## 6. kb_artigos_feedback

  | Coluna         | Tipo      | Null | Default | Descrição                                            |
  |----------------|-----------|------|---------|------------------------------------------------------|
  | id             | UUID      | N    | auto    | Identificador único                                   |
  | artigo_id      | UUID (FK) | N    | —       | Artigo avaliado (CASCADE on DELETE)                   |
  | chamado_id     | UUID (FK) | S    | —       | Chamado em que o artigo foi utilizado                 |
  | colaborador_id | UUID (FK) | S    | —       | Colaborador que deu o feedback                        |
  | util           | BOOLEAN   | N    | —       | true = artigo resolveu, false = não resolveu          |
  | comentario     | TEXT      | S    | —       | Comentário opcional do colaborador                    |
  | criado_em      | TIMESTAMPTZ | N  | now()   | Timestamp do feedback                                 |

  ---

  ## 7. rfid_crachas

  | Coluna              | Tipo      | Null | Default | Descrição                                            |
  |---------------------|-----------|------|---------|------------------------------------------------------|
  | id                  | UUID      | N    | auto    | Identificador único                                   |
  | colaborador_id      | UUID (FK) | N    | —       | Colaborador dono do crachá                            |
  | codigo_rfid         | VARCHAR(50)| N   | —       | Código RFID único — validado para unicidade           |
  | ativo               | BOOLEAN   | N    | true    | Se o crachá está ativo                                |
  | cadastrado_incontrol| BOOLEAN   | N    | false   | Se o TI já cadastrou no iNControl                     |
  | cadastrado_topdata  | BOOLEAN   | N    | false   | Se o TI já cadastrou no Topdata Inner                 |
  | criado_em           | TIMESTAMPTZ | N  | now()   | Timestamp de criação                                  |
  | atualizado_em       | TIMESTAMPTZ | N  | now()   | Timestamp da última atualização                       |

  ---

  ## 8. ativos

  | Coluna         | Tipo         | Null | Default      | Descrição                                        |
  |----------------|--------------|------|--------------|--------------------------------------------------|
  | id             | UUID         | N    | auto         | Identificador único                               |
  | tipo           | tipo_ativo   | N    | —            | notebook / desktop / monitor / impressora / etc.  |
  | marca          | VARCHAR(100) | S    | —            | Marca do equipamento                              |
  | modelo         | VARCHAR(150) | S    | —            | Modelo do equipamento                             |
  | numero_serie   | VARCHAR(100) | S    | —            | Número de série (UNIQUE)                          |
  | patrimonio     | VARCHAR(50)  | S    | —            | Número de patrimônio (UNIQUE)                     |
  | status         | status_ativo | N    | 'disponivel' | em_uso / disponivel / em_manutencao / descartado  |
  | responsavel_id | UUID (FK)    | S    | —            | Colaborador que está usando                       |
  | localizacao    | VARCHAR(200) | S    | —            | Local físico (filial + sala)                      |
  | notas          | TEXT         | S    | —            | Observações livres                                |
  | criado_em      | TIMESTAMPTZ  | N    | now()        | Timestamp de criação                              |
  | atualizado_em  | TIMESTAMPTZ  | N    | now()        | Timestamp da última atualização                   |

  ---

  ## 9. audit_log

  | Coluna      | Tipo         | Null | Default | Descrição                                              |
  |-------------|--------------|------|---------|--------------------------------------------------------|
  | id          | UUID         | N    | auto    | Identificador único                                     |
  | acao        | VARCHAR(100) | N    | —       | Ação registrada (triagem_ia, tarefa_concluida, etc.)    |
  | entidade    | VARCHAR(50)  | S    | —       | Tipo da entidade afetada (chamado, tarefa, colaborador)  |
  | entidade_id | UUID         | S    | —       | ID da entidade afetada                                  |
  | usuario     | VARCHAR(200) | S    | —       | E-mail do usuário que executou a ação                   |
  | ip          | VARCHAR(45)  | S    | —       | IP de origem da requisição                              |
  | detalhes    | JSONB        | N    | '{}'    | Detalhes adicionais em formato livre                    |
  | criado_em   | TIMESTAMPTZ  | N    | now()   | Timestamp do evento                                     |

  ### Ações Registradas

  | Ação                        | Descrição                                          |
  |-----------------------------|----------------------------------------------------|
  | `colaborador_sincronizado`| Resultado do sync com REST API RH                  |
  | `triagem_ia`              | Classificação feita pela IA no bot                 |
  | `chamado_criado`          | Novo chamado criado (via bot ou painel)             |
  | `chamado_resolvido`       | Chamado marcado como resolvido                     |
  | `tarefa_criada`           | Nova tarefa manual gerada pelo sistema             |
  | `tarefa_concluida`        | Tarefa marcada como concluída com evidência        |
  | `kb_artigo_criado`        | Novo artigo adicionado à KB                        |
  | `reset_senha_solicitado`  | Solicitação de reset de senha via bot              |
  | `reset_senha_negado`      | Tentativa de reset negada (validação hierárquica)  |
  | `cracha_solicitado`       | Solicitação de cadastro de crachá RFID             |

  ---

  ## 10. Histórico de Versões

  | Versão | Data    | Mudanças                                                    |
  |--------|---------|-------------------------------------------------------------|
  | 1.0    | 2025-01 | Criação — tabelas base                                       |
  | 2.0    | 2025-02 | rfid_crachas e ativos adicionados                            |
  | 3.0    | 2025-03 | kb_artigos com pgvector, kb_artigos_feedback, enums atualizados |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
