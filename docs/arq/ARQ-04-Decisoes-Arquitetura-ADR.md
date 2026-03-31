# ARQ-04 — Decisões de Arquitetura (ADR)

  **Architecture Decision Records — Contexto, Alternativas e Justificativas**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Arquitetura e Infraestrutura       |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Sobre este Documento](#1-sobre-este-documento)
  2. [ADR-001 — Remoção Completa do Agente Interno](#2-adr-001--remoção-completa-do-agente-interno)
  3. [ADR-002 — Google Gemini 2.5 Flash como LLM Principal](#3-adr-002--google-gemini-25-flash-como-llm-principal)
  4. [ADR-003 — Supabase com pgvector para KB Semântica](#4-adr-003--supabase-com-pgvector-para-kb-semântica)
  5. [ADR-004 — Vercel como Plataforma de Deploy](#5-adr-004--vercel-como-plataforma-de-deploy)
  6. [ADR-005 — Next.js como Framework do Painel TI](#6-adr-005--nextjs-como-framework-do-painel-ti)
  7. [ADR-006 — Zentyal sem Integração Automática](#7-adr-006--zentyal-sem-integração-automática)
  8. [ADR-007 — iNControl e Topdata como Tarefas Semiautomatizadas](#8-adr-007--incontrol-e-topdata-como-tarefas-semiautomatizadas)
  9. [ADR-008 — Validação Hierárquica Determinística (sem IA)](#9-adr-008--validação-hierárquica-determinística-sem-ia)
  10. [Histórico de Versões](#10-histórico-de-versões)

  ---

  ## 1. Sobre este Documento

  Este documento registra as **Architecture Decision Records (ADRs)** do sistema O.R.I. Cada ADR documenta uma decisão arquitetural significativa: o contexto que gerou a necessidade, as alternativas consideradas, a decisão tomada, as consequências esperadas e o status atual.

  ### Status possíveis

  | Status      | Significado                                                      |
  |-------------|------------------------------------------------------------------|
  | Proposto    | Decisão em discussão — ainda não implementada                    |
  | Aceito      | Decisão tomada e implementada — é o estado atual do sistema       |
  | Substituído | Decisão que foi aceita mas foi superada por uma decisão posterior |
  | Obsoleto    | Decisão que não se aplica mais                                    |
  | Rejeitado   | Alternativa que foi explicitamente descartada                     |

  ### Índice de Decisões

  | ADR     | Título                                              | Status  | Impacto |
  |---------|------------------------------------------------------|---------|---------|
  | ADR-001 | Remoção completa do agente interno (v2 → v3)         | Aceito  | Alto    |
  | ADR-002 | Gemini 2.5 Flash como LLM principal                  | Aceito  | Alto    |
  | ADR-003 | Supabase com pgvector para KB semântica              | Aceito  | Médio   |
  | ADR-004 | Vercel como plataforma de deploy                     | Aceito  | Alto    |
  | ADR-005 | Next.js como framework do painel TI                  | Aceito  | Médio   |
  | ADR-006 | Zentyal sem integração automática                    | Aceito  | Alto    |
  | ADR-007 | iNControl e Topdata como tarefas semiautomatizadas   | Aceito  | Médio   |
  | ADR-008 | Validação hierárquica determinística (sem IA)         | Aceito  | Alto    |

  ---

  ## 2. ADR-001 — Remoção Completa do Agente Interno

  | Campo      | Valor                                    |
  |------------|------------------------------------------|
  | ID         | ADR-001                                  |
  | Data       | Março de 2025                            |
  | Status     | Aceita — implementada na v3.0            |
  | Supercede  | N/A                                      |

  ### Contexto

  O O.R.I v1.0 e v2.0 operavam com um agente interno: um serviço Node.js (`proxxibot-agente`) rodando na Máquina B, gerenciado via systemd. Este agente atuava como ponte entre a nuvem (Vercel) e os sistemas internos. O agente v2.0 gerenciava apenas o Carbonio (SOAP :7071).

  Responsabilidades operacionais que o agente mantinha:
  - Serviço systemd com restart automático
  - Gestão de segredos locais (.env com CARBONIO_PASS, SUPABASE_KEY, HMAC_SECRET)
  - Regra de firewall para IPs do Vercel (lista que muda periodicamente)
  - Certificado self-signed do Carbonio (erros intermitentes)
  - Lógica de idempotência e controle de UUIDs
  - Manutenção de dependências Node.js na Máquina B

  ### Problema

  Com apenas 2 técnicos para 1.500+ colaboradores, qualquer overhead de manutenção de infraestrutura tem custo real. O agente representava um ponto único de falha, e o ganho de automação (2-3 tarefas manuais por semana) não compensava o custo de manutenção.

  ### Alternativas Consideradas

  | Alternativa                    | Descrição                                                | Decisão   |
  |-------------------------------|----------------------------------------------------------|-----------|
  | A — Manter o agente           | Continuar com Node.js na Máquina B, investindo em monitoramento | Rejeitada |
  | B — Cloudflare Tunnel         | Expor sistemas internos via tunnel seguro                 | Rejeitada — política de segurança veta |
  | C — VPN site-to-site          | VPN entre Vercel e rede interna                           | Rejeitada — Vercel Serverless não suporta |
  | **D — Fila manual no painel** | Bot coleta dados, cria card formatado, TI executa         | **Aceita** |

  ### Consequências

  | Tipo     | Consequência                                                                              |
  |----------|-------------------------------------------------------------------------------------------|
  | Positivo | Arquitetura 100% nuvem — zero serviços on-premise para o O.R.I                           |
  | Positivo | Simplicidade operacional — deploy, rollback e manutenção 100% via Vercel Dashboard        |
  | Positivo | Transparência total — cada operação tem card, evidência registrada, timestamp e técnico    |
  | Positivo | Segurança — sem segredos no disco da Máquina B, sem regras de firewall para IPs externos  |
  | Negativo | Operações antes automáticas agora dependem de ação humana                                  |
  | Mitigação| SLAs definidos por tipo de tarefa (30-120 min) com alertas automáticos via Zoho Cliq       |
  | Mitigação| Cards com botões "Copiar" — execução manual reduzida a 2-5 minutos por tarefa              |

  ---

  ## 3. ADR-002 — Google Gemini 2.5 Flash como LLM Principal

  | Campo  | Valor                                    |
  |--------|------------------------------------------|
  | ID     | ADR-002                                  |
  | Data   | Março de 2025                            |
  | Status | Aceita — implementada na v3.0            |

  ### Contexto

  A v3.0 introduz um módulo de IA para triagem de chamados em tempo real e busca semântica na KB. A escolha do LLM impacta custo, latência, qualidade e complexidade de integração.

  ### Comparativo de Modelos

  | Modelo           | Provedor    | Custo     | Contexto  | Latência   | Embedding                     | Decisão                |
  |------------------|-------------|-----------|-----------|------------|-------------------------------|------------------------|
  | Gemini 2.5 Flash | Google AI   | Baixo     | 1M tokens | < 1-3s     | text-embedding-004 (mesma key)| **Escolhido**          |
  | Gemini 2.5 Pro   | Google AI   | Alto      | 1M tokens | 3-8s       | Mesmo ecossistema              | Custo excessivo         |
  | GPT-4o mini      | OpenAI      | Médio     | 128K      | 2-4s       | text-embedding-3-small         | Contexto menor, custo maior |
  | Claude 3 Haiku   | Anthropic   | Baixo-médio| 200K     | 1-3s       | Não tem — serviço externo      | Sem embedding nativo    |
  | Llama 3 (self)   | Meta        | Zero/call | Varia     | Alta (GPU) | Requer infraestrutura          | GPU local inviável      |

  ### Justificativa

  - **Contexto de 1M tokens:** permite incluir múltiplos artigos da KB completos no prompt sem truncamento
  - **Custo por token:** significativamente inferior ao Gemini Pro
  - **Latência muito baixa:** ideal para uso em tempo real no bot
  - **Ecossistema Google:** text-embedding-004 usa a mesma API key, simplificando gestão
  - **Qualidade em PT-BR:** classificação correta em 90%+ dos casos de teste
  - **`responseMimeType: "application/json"`** força resposta JSON puro sem markdown

  ### Consequências

  | Aspecto                | Detalhe                                                                        |
  |------------------------|--------------------------------------------------------------------------------|
  | Dependência de fornecedor | Dependência do Google AI. Fallback implementado — se API falhar, chamado vai direto para GLPI |
  | Custo operacional      | Novo custo recorrente. Alerta configurado em 80% do orçamento mensal           |
  | Privacidade de dados   | Conteúdo dos chamados é enviado ao Google — ver AI-08 para política            |
  | Portabilidade          | GeminiClient em `/lib/gemini.ts` isola toda a lógica — trocar modelo exige mudança apenas neste arquivo |

  ---

  ## 4. ADR-003 — Supabase com pgvector para KB Semântica

  | Campo  | Valor                           |
  |--------|----------------------------------|
  | ID     | ADR-003                         |
  | Data   | Janeiro/Março de 2025            |
  | Status | Aceita — em uso desde v1.0, ampliada na v3.0 com pgvector |

  ### Decisão

  Usar Supabase (PostgreSQL gerenciado) com extensão pgvector. Um único banco cobre dados estruturados, busca semântica, RLS nativo e API REST out-of-the-box.

  | Critério            | Supabase + pgvector              | PostgreSQL + Pinecone          | MongoDB Atlas + Pinecone      |
  |---------------------|-----------------------------------|-------------------------------|-------------------------------|
  | Custo mensal        | ~$25/mês (tudo incluído)          | ~$50-100/mês                  | ~$60-120/mês                  |
  | Complexidade        | Baixa — zero ops                  | Alta — VPS, backups, updates  | Média — 2 serviços            |
  | Vector search       | pgvector nativo no mesmo banco    | Pinecone separado              | Atlas Vector Search           |
  | RLS                 | Nativo no PostgreSQL              | Implementação manual           | Não nativo                    |
  | Decisão             | **Escolhido**                     | Rejeitado                      | Rejeitado                     |

  Índice HNSW configurado com `m=16`, `ef_construction=64`. Adequado para até 5.000 artigos com latência < 50ms.

  ---

  ## 5. ADR-004 — Vercel como Plataforma de Deploy

  | Campo  | Valor                           |
  |--------|----------------------------------|
  | ID     | ADR-004                         |
  | Data   | Janeiro de 2025                  |
  | Status | Aceita — em uso desde v1.0       |

  ### Decisão e Justificativa

  | Recurso Vercel              | Valor para o O.R.I                                                  |
  |-----------------------------|----------------------------------------------------------------------|
  | Deploy automático por push  | Commit na main → produção automaticamente                            |
  | Preview URLs por branch     | Cada feature recebe URL única para teste                             |
  | Serverless Functions        | API Routes escalam automaticamente, custo zero quando sem requisições |
  | Edge Network global         | Painel TI carrega rápido de qualquer filial                           |
  | Cron Jobs gerenciados       | Sync com REST API RH configurado via `vercel.json`                 |
  | Rollback instantâneo        | Um clique no Dashboard reverte deploy anterior                        |
  | Zero downtime deploy        | Deploys não interrompem o serviço                                     |

  Alternativa rejeitada: VPS dedicada (DigitalOcean / AWS EC2) — custo de manutenção operacional incompatível com equipe de 2 pessoas.

  ---

  ## 6. ADR-005 — Next.js como Framework do Painel TI

  | Campo  | Valor                           |
  |--------|----------------------------------|
  | ID     | ADR-005                         |
  | Data   | Janeiro de 2025                  |
  | Status | Aceita — em uso desde v1.0       |

  ### Decisão

  Next.js 14 (App Router) unifica frontend e backend em um único repositório e plataforma de deploy.

  | Aspecto                      | Detalhe                                                              |
  |------------------------------|----------------------------------------------------------------------|
  | Full-stack em um repo        | Frontend (painel TI) e backend (API Routes) no mesmo repositório     |
  | App Router (Server Components)| Componentes renderizados no servidor reduzem bundle JS no cliente   |
  | API Routes como backend      | Elimina necessidade de Express.js separado                           |
  | TypeScript nativo             | Tipagem estática reduz bugs em runtime                               |
  | Integração Vercel nativa      | Vercel detecta Next.js automaticamente                               |

  Alternativas rejeitadas: (1) React SPA + API Express separada — dois deploys. (2) Remix — ecossistema menor.

  ---

  ## 7. ADR-006 — Zentyal sem Integração Automática

  | Campo  | Valor                           |
  |--------|----------------------------------|
  | ID     | ADR-006                         |
  | Data   | 2025 — válido desde v2.0, mantido na v3.0 |
  | Status | Aceita                          |

  ### Contexto

  A porta 8443 do Zentyal não é acessível de fora do segmento de rede onde o servidor está instalado. Causa: VLAN/firewall que isola o segmento do Zentyal — o isolamento é intencional e a abertura da regra foi negada pela equipe de infraestrutura.

  ### Decisão

  Todas as operações Zentyal são tarefas manuais no painel O.R.I. O TI acessa `https://192.168.1.20:8443` diretamente no navegador.

  | Aspecto           | Detalhe                                                              |
  |--------------------|----------------------------------------------------------------------|
  | Operações afetadas | Criar usuário, trocar grupo, reset de senha, desativar usuário       |
  | SLAs definidos     | Criar: 60 min, Trocar grupo: 120 min, Reset: 30 min, Desativar: 60 min |
  | Dados no card      | Username sugerido, nome, grupo destino com normalização (`grp_{local}`) |
  | Revisão futura     | Se acesso de rede viabilizado, arquivo `zentyal.js` mantido como esqueleto |

  ---

  ## 8. ADR-007 — iNControl e Topdata como Tarefas Semiautomatizadas

  | Campo  | Valor                           |
  |--------|----------------------------------|
  | ID     | ADR-007                         |
  | Data   | 2025 — válido desde v2.0         |
  | Status | Aceita                          |

  ### Contexto

  O iNControl não possui API REST documentada (integração precisaria ser reverse-engineered). O Topdata Inner usa protocolo proprietário sem documentação para integração externa.

  ### Decisão

  O bot coleta nome, e-mail, código RFID, setor e filial. O sistema cria dois cards na Central de Tarefas: `rfid_cadastrar_incontrol` e `rfid_cadastrar_topdata`. Cada card tem dados formatados com botões "Copiar" e guia passo a passo.

  | Aspecto              | Detalhe                                                              |
  |----------------------|----------------------------------------------------------------------|
  | Tempo de execução    | 3-5 minutos por sistema com dados prontos no card                    |
  | Dependência          | Crachá só fica ativo quando AMBOS os cards forem concluídos com evidência |
  | Notificação          | Quando ambos concluídos, bot notifica o RH automaticamente           |
  | Revisão futura       | Se API documentada for obtida, automação pode ser adicionada sem mudança na arquitetura |

  ---

  ## 9. ADR-008 — Validação Hierárquica Determinística (sem IA)

  | Campo  | Valor                           |
  |--------|----------------------------------|
  | ID     | ADR-008                         |
  | Data   | 2025 — novo na v3.0              |
  | Status | Aceita                          |

  ### Contexto

  O bot permite que um gestor solicite reset de senha em nome de um subordinado direto. A validação hierárquica é feita de forma determinística (código), não por IA.

  ### Por que NÃO usar IA para validação hierárquica

  - **Segurança crítica:** controle de acesso não pode ter margem de erro de 5-10%
  - **Dado estruturado:** campo SUPERIOR na REST API RH contém o e-mail do superior direto — comparação de strings
  - **Auditabilidade:** decisão de controle de acesso deve ser explicável e determinística
  - **Latência:** chamada adicional ao Gemini aumentaria latência desnecessariamente

  ### Implementação

  `HierarchyValidator` consulta a REST API RH em tempo real, extrai o campo SUPERIOR e compara com o e-mail do sender Zoho. Comparação case-insensitive. Toda tentativa (sucedida ou negada) é registrada no `audit_log`.

  | Cenário                                | Comportamento                                    |
  |----------------------------------------|--------------------------------------------------|
  | Sender == e-mail do próprio colaborador | Autorizado — reset para si mesmo                |
  | Sender == campo SUPERIOR               | Autorizado — superior direto para subordinado    |
  | Sender != nenhum dos dois              | Negado — mensagem clara, evento no audit_log     |
  | Colaborador não encontrado             | Negado — pode estar desligado                    |
  | Campo SUPERIOR vazio                   | Apenas o próprio pode solicitar                  |

  ---

  ## 10. Histórico de Versões

  | Versão | Data    | Mudanças                                                            |
  |--------|---------|---------------------------------------------------------------------|
  | 1.0    | 2025-01 | Criação. ADR-003 (Supabase), ADR-004 (Vercel), ADR-005 (Next.js)   |
  | 2.0    | 2025-02 | Contexto da simplificação do agente adicionado                       |
  | 3.0    | 2025-03 | ADR-001 (remoção agente), ADR-002 (Gemini 2.5 Flash), ADR-008 (validação hierárquica) adicionados |

  ---

  *O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
  