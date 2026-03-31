# ARQ-01 — Diagrama de Arquitetura C4

**Modelo C4 — Contexto, Containers, Componentes e Código**

| Campo       | Valor                              |
|-------------|-------------------------------------|
| Versão      | v3.0                               |
| Categoria   | Arquitetura e Infraestrutura       |
| Ano         | 2025                               |

> 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

---

## Sumário

1. [Introdução](#1-introdução)
2. [Nível 1 — Contexto do Sistema](#2-nível-1--contexto-do-sistema)
3. [Nível 2 — Containers](#3-nível-2--containers)
4. [Nível 3 — Componentes (API Routes)](#4-nível-3--componentes-api-routes)
5. [Nível 4 — Código (Fluxos Críticos)](#5-nível-4--código-fluxos-críticos)
6. [Decisões Arquiteturais](#6-decisões-arquiteturais)
7. [Restrições e Premissas](#7-restrições-e-premissas)
8. [Glossário](#8-glossário)
9. [Histórico de Versões](#9-histórico-de-versões)

---

## 1. Introdução

Este documento descreve a arquitetura completa do sistema **O.R.I** (Operações, Recursos e Inteligência) utilizando o **modelo C4** — uma abordagem hierárquica de documentação arquitetural que organiza a descrição do sistema em quatro níveis progressivos de detalhe: Contexto, Containers, Componentes e Código.

O O.R.I é a plataforma interna de TI da **Proxxima Telecom**, composta por um bot conversacional integrado ao Zoho Cliq, um painel web administrativo e um módulo de inteligência artificial baseado no Google Gemini 2.5 Flash. O sistema atende mais de 1.500 colaboradores distribuídos em múltiplas filiais, com uma equipe de apenas 2 técnicos de TI.

### Mudanças na versão 3.0 (atual)

- Agente interno removido completamente — nenhum serviço Node.js roda na rede interna
- Todas as operações de sistemas internos (Carbonio, Zentyal, iNControl, Topdata) são filas manuais no painel TI
- Módulo de IA adicionado — Google Gemini 2.5 Flash via API REST direto do Vercel
- Arquitetura 100% em nuvem para toda a lógica automatizada

---

## 2. Nível 1 — Contexto do Sistema

O diagrama de contexto mostra o O.R.I como uma caixa preta, situando-o no ecossistema da Proxxima Telecom: quais pessoas interagem com o sistema e quais sistemas externos ele se conecta.

### 2.1 Atores (Usuários)

| Ator          | Perfil                                      | Canal de Acesso        | Principais Interações                                                                                  |
|---------------|----------------------------------------------|------------------------|--------------------------------------------------------------------------------------------------------|
| Colaborador   | Qualquer funcionário ativo da Proxxima       | Bot no Zoho Cliq       | Abertura de chamados, consulta à KB, solicitação de reset de senha Carbonio, notificações de onboarding |
| Técnico de TI | Equipe de TI (2 pessoas)                     | Painel web O.R.I       | Gestão de chamados, execução de tarefas manuais, administração da KB, auditoria, cadastro de ativos e crachás RFID |
| Gestor        | Superior direto de colaborador               | Bot no Zoho Cliq       | Solicitação de reset de senha em nome de subordinado direto (validação hierárquica)                     |
| RH            | Recursos Humanos                             | Bot no Zoho Cliq       | Solicitação de cadastro de crachá RFID para novos colaboradores                                        |

### 2.2 Sistemas Externos

| Sistema          | Tipo                                              | Integração                              | Responsabilidade                                                                                      |
|------------------|----------------------------------------------------|-----------------------------------------|--------------------------------------------------------------------------------------------------------|
| REST API RH      | API externa — Netlify (proxximatelecomquem.netlify.app) | Automática — polling a cada 15 min      | Fonte de verdade sobre colaboradores: nome, e-mail, setor, filial, hierarquia e status de vínculo      |
| Zoho Cliq        | SaaS — Zoho One Enterprise (connect.proxxima.net)  | Automática — OAuth 2.0 + Webhook        | Interface de mensagens para todos os usuários. O O.R.I opera como bot registrado na organização Zoho   |
| GLPI             | Self-hosted — rede da Proxxima                     | Automática — API REST                   | Sistema oficial de chamados técnicos. O O.R.I cria e atualiza chamados automaticamente quando a IA não resolve |
| Google Gemini AI | API nuvem — Google AI Studio                       | Automática — REST via Vercel            | LLM para triagem de chamados em tempo real, geração de embeddings para busca semântica e resumos automáticos |
| Carbonio         | Self-hosted — rede interna                         | Manual — TI acessa painel web           | Servidor de e-mail corporativo. Operações (criar conta, reset senha, suspender) executadas manualmente pelo TI |
| Zentyal          | Self-hosted — Máquina A                            | Manual — TI acessa :8443                | NAS e diretório de usuários (grupos Samba por setor). Operações executadas manualmente pelo TI via interface web |
| iNControl        | On-premise — Máquina B                             | Manual — TI acessa localhost            | Sistema de controle de acesso físico (RFID). Cadastro de pessoas e credenciais executado manualmente pelo TI |
| Topdata Inner    | On-premise — LAN                                   | Manual — TI acessa diretamente          | Sistema de ponto eletrônico e controle de catracas. Cadastro de funcionários e RFID executado manualmente pelo TI |

> ℹ **NOTA:** O Zentyal, iNControl e Topdata não possuem integração automática com o O.R.I. O sistema coleta os dados necessários e os apresenta formatados no card da tarefa no painel TI, mas a execução é sempre manual pelo técnico.

---

## 3. Nível 2 — Containers

O diagrama de containers expande o sistema O.R.I mostrando seus processos/serviços distintos (containers), as tecnologias utilizadas e como eles se comunicam entre si.

### 3.1 Containers do Sistema

| Container      | Tecnologia                              | Hospedagem          | Responsabilidade Principal                                                                                |
|----------------|-----------------------------------------|----------------------|-----------------------------------------------------------------------------------------------------------|
| Bot Zoho Cliq  | Zoho Cliq Bot API + Webhook             | Nuvem — Zoho         | Interface conversacional de todos os usuários. Recebe mensagens, aciona triagem com IA, gerencia fluxos de reset de senha, crachá e chamados |
| Painel Web TI  | Next.js 14 — App Router                 | Nuvem — Vercel       | Interface administrativa da equipe de TI. Central de Tarefas, gestão de chamados, administração da KB, cadastro de ativos, auditoria e relatórios |
| API Routes     | Vercel Serverless Functions (Node.js)    | Nuvem — Vercel       | Cérebro do sistema. Lógica de negócio central: validações, sync com REST API RH, chamadas ao Gemini, geração de tarefas manuais, integração com GLPI e Zoho |
| Banco de Dados | Supabase — PostgreSQL 15 + pgvector     | Nuvem — Supabase     | Persistência de todos os dados: colaboradores, chamados, tarefas manuais, KB (com embeddings), ativos, crachás RFID, audit log |
| Módulo IA      | Google Gemini 2.5 Flash + text-embedding-004 | Nuvem — Google AI | Triagem de chamados em tempo real, geração de vetores para busca semântica na KB, resumos automáticos e análise de padrões |

### 3.2 Fluxos de Comunicação

Todos os containers se comunicam exclusivamente via HTTPS. Não existe tráfego automatizado cruzando o perímetro da rede interna da Proxxima.

| De              | Para              | Protocolo                   | Descrição do Fluxo                                                                                |
|-----------------|-------------------|-----------------------------|-----------------------------------------------------------------------------------------------------|
| Zoho Cliq       | API Routes (Vercel)| HTTPS POST — Webhook        | Mensagem do colaborador dispara POST para `/api/bot/mensagem`                                      |
| API Routes      | Zoho Cliq         | HTTPS POST — OAuth 2.0      | Bot responde ao colaborador via POST `/api/v2/bots/{name}/message`                                 |
| API Routes      | Supabase          | HTTPS — service_role key    | Leitura e escrita de todos os dados (colaboradores, chamados, tarefas, KB)                          |
| API Routes      | Google Gemini AI  | HTTPS REST — API key        | Triagem de chamados (`generateContent`) e geração de embeddings (`embedContent`)                    |
| API Routes      | REST API RH       | HTTPS GET — polling          | Sync de colaboradores a cada 15 minutos via Vercel Cron                                             |
| API Routes      | GLPI              | HTTPS REST — App Token       | Criação e atualização de chamados quando IA não resolve                                             |
| Painel Web TI   | API Routes        | HTTPS — Next.js fetch        | Todas as ações do painel passam pelas API Routes (nunca Supabase direto)                            |

---

## 4. Nível 3 — Componentes (API Routes)

O diagrama de componentes detalha o interior do container API Routes, o qual concentra toda a lógica de negócio do O.R.I.

| Componente          | Rota(s)                         | Método(s)        | Descrição Detalhada                                                                                    |
|---------------------|---------------------------------|------------------|--------------------------------------------------------------------------------------------------------|
| Bot Message Handler | `/api/bot/mensagem`             | POST             | Ponto de entrada de todas as mensagens do Zoho Cliq. Identifica o colaborador pelo e-mail do sender, roteia para o fluxo correto (triagem, reset senha, crachá, consulta) e aciona o Gemini para classificação inicial |
| AI Triage Engine    | `/api/bot/mensagem` (interno)   | —                | Componente interno chamado pelo Bot Handler. Gera embedding da mensagem, busca artigos relevantes no pgvector, monta prompt contextualizado e chama Gemini 2.5 Flash. Decide se resolve pelo bot ou cria chamado no GLPI |
| Task Manager        | `/api/tarefas`                  | GET, POST, PATCH | CRUD da fila de tarefas manuais. GET retorna tarefas filtradas por tipo/status/prioridade. POST cria nova tarefa (sistema ou bot). PATCH atualiza status, técnico responsável e evidência |
| Ticket Manager      | `/api/chamados`                 | GET, POST, PATCH | Gestão de chamados integrada ao GLPI. POST cria chamado local + chamado no GLPI. PATCH sincroniza status. GET retorna chamados com filtros |
| Collaborator Sync   | `/api/colaboradores/sync`       | POST (Cron)      | Sync com REST API RH. Detecta novos colaboradores (gera tarefas de onboarding), mudanças de setor (gera `zentyal_trocar_grupo`) e desligamentos (gera tarefas de offboarding) |
| KB Search           | `/api/kb/busca`                 | POST             | Busca semântica na KB usando pgvector. Recebe texto livre, gera embedding via Gemini text-embedding-004, executa query de similaridade de cosseno no Supabase e retorna top-5 artigos relevantes |
| KB Admin            | `/api/kb/artigos`               | GET, POST, PUT, DELETE | CRUD de artigos da KB. Na criação/edição, gera embedding automaticamente. Controla publicação, categorização e métricas de utilidade (`util_count`) |
| Zoho OAuth Handler  | `/api/zoho/callback`            | GET              | Callback do fluxo OAuth 2.0 do Zoho. Troca o authorization code por access_token e refresh_token      |
| Audit Logger        | `/api/audit`                    | POST             | Registra todos os eventos relevantes no `audit_log` do Supabase: ações do TI, triagens da IA, mudanças de status, tentativas de acesso não autorizado |
| Reports Engine      | `/api/relatorios`               | GET              | Gera relatórios de SLA, taxa de resolução por bot, chamados por categoria e artigos da KB com baixo desempenho |

---

## 5. Nível 4 — Código (Fluxos Críticos)

### 5.1 Fluxo de Triagem de Chamado com IA

Este é o fluxo mais frequente do sistema. Ocorre a cada mensagem recebida pelo bot que não é uma solicitação de reset de senha ou cadastro de crachá.

| #  | Etapa                     | Executado por                        | Detalhe                                                                                      |
|----|---------------------------|---------------------------------------|-----------------------------------------------------------------------------------------------|
| 1  | Receber mensagem          | Zoho Cliq → POST `/api/bot/mensagem` | Payload: `{ sender.email, chat_id, text }`                                                   |
| 2  | Identificar colaborador   | API Route → Supabase                 | `SELECT * FROM colaboradores WHERE email_corporativo = sender.email`                          |
| 3  | Gerar embedding da mensagem | API Route → Google Gemini           | POST `/v1beta/models/text-embedding-004:embedContent` com o texto da mensagem                 |
| 4  | Buscar artigos relevantes | API Route → Supabase pgvector        | `SELECT ... ORDER BY embedding <=> $vetor LIMIT 5 WHERE similaridade > 0.75`                  |
| 5  | Montar prompt contextual  | API Route (interno)                  | Combina: instruções do sistema + dados do colaborador + texto da mensagem + artigos KB encontrados |
| 6  | Chamar Gemini para triagem| API Route → Google Gemini            | POST `/v1beta/models/gemini-2.5-flash:generateContent` com `responseMimeType: application/json` |
| 7  | Parsear resposta JSON     | API Route (interno)                  | Extrai: `categoria`, `prioridade`, `confianca` (0–1), `resposta_colaborador`, `requer_ti` (boolean) |
| 8a | Alta confiança (≥ 0.75)   | API Route → Zoho Cliq                | Envia resposta ao colaborador com card interativo: botões "✓ Resolveu" e "✗ Não resolveu"     |
| 8b | Baixa confiança (< 0.75)  | API Route → GLPI + Zoho Cliq         | Cria chamado no GLPI e notifica o TI. Informa ao colaborador que o TI foi acionado            |
| 9  | Registrar triagem         | API Route → Supabase `audit_log`     | Persiste: pergunta, resposta, confiança, artigos usados, resultado (resolveu/não resolveu)    |

### 5.2 Fluxo de Onboarding Automático

Disparado automaticamente pelo Vercel Cron a cada 15 minutos quando o sync detecta um novo colaborador na REST API RH.

1. Cron job aciona `POST /api/colaboradores/sync` com header `X-Cron-Signature` para autenticação HMAC
2. API Route faz GET na REST API RH e compara matrícula/e-mail com tabela `colaboradores` no Supabase
3. Para cada colaborador novo: INSERT em `colaboradores` com os dados da API RH
4. Verifica campo `EMAIL DO FUNCIONARIO` na REST API
5. Se e-mail vazio → INSERT em `tarefas_manuais`: tipo=`carbonio_criar_conta`, prioridade=alta, dados=`{ nome, email_sugerido, setor, filial }`
6. INSERT em `tarefas_manuais`: tipo=`zentyal_criar_usuario`, prioridade=alta, dados=`{ username sugerido, nome, email, grupo_destino }`
7. Notifica equipe de TI via Zoho Cliq: "Novo colaborador [nome] detectado. 2 tarefas criadas na Central."
8. INSERT em `audit_log`: acao=`colaborador_sincronizado`, detalhes=`{ novos: N, alterados: M, desligados: K }`

---

## 6. Decisões Arquiteturais

> Para o registro formal de ADRs, consulte o documento **ARQ-04**.

### 6.1 100% Nuvem — Sem Agente Interno

| Aspecto                | Detalhe                                                                                       |
|------------------------|-----------------------------------------------------------------------------------------------|
| Decisão                | Remover completamente o agente Node.js que rodava na Máquina B da rede interna                |
| Contexto               | O agente v1.0/v2.0 automatizava operações no Carbonio (SOAP), Zentyal, iNControl e Topdata. Com 2 técnicos de TI, a manutenção do agente consumia mais esforço do que o benefício gerado |
| Consequência positiva  | Zero infraestrutura interna para o O.R.I. Deploy, rollback e manutenção 100% via Vercel Dashboard |
| Consequência negativa  | Operações antes automáticas (criar conta Carbonio, reset senha) agora dependem de ação humana do TI |
| Mitigação              | SLAs definidos por tipo de tarefa, notificações automáticas ao TI, cards com dados prontos para copiar |

### 6.2 Supabase como Banco e Vetor Store

| Aspecto              | Detalhe                                                                                       |
|----------------------|-----------------------------------------------------------------------------------------------|
| Decisão              | Usar Supabase (PostgreSQL gerenciado) com extensão pgvector para dados relacionais e busca semântica |
| Motivo               | Elimina a necessidade de um serviço de vetores separado (Pinecone, Weaviate, Qdrant). Um único banco cobre: dados estruturados, busca semântica, RLS nativo e API REST out-of-the-box |
| Alternativa rejeitada| MongoDB Atlas + Pinecone separados — mais custo, mais complexidade operacional                |

### 6.3 Vercel como Plataforma de Deploy

| Aspecto          | Detalhe                                                                                       |
|------------------|-----------------------------------------------------------------------------------------------|
| Decisão          | Hospedar o painel TI (Next.js) e todas as API Routes no Vercel                                |
| Motivo           | Deploy automático a cada push, preview URLs por branch, serverless functions com escalabilidade automática, edge network global, integração nativa com Next.js e Cron Jobs gerenciados |
| Custo vs. benefício | Vercel Pro (~$20/mês) vs. VPS dedicada: Vercel elimina custo de administração de servidor   |

### 6.4 Google Gemini 2.5 Flash como LLM

| Aspecto          | Detalhe                                                                                       |
|------------------|-----------------------------------------------------------------------------------------------|
| Decisão          | Google Gemini 2.5 Flash para geração de texto e text-embedding-004 para embeddings            |
| Motivo principal | Custo-benefício: modelo rápido e econômico com janela de contexto de 1M tokens                |
| Latência         | 1–3 segundos para prompts de triagem — adequado para uso em tempo real no bot                 |
| Mesmo ecossistema| text-embedding-004 usa a mesma API key — simplifica gestão de credenciais                     |

---

## 7. Restrições e Premissas

### 7.1 Restrições Técnicas

- O Zentyal não expõe API REST acessível de fora da rede interna — integração automática não é viável sem VPN ou tunnel
- O Carbonio expõe API SOAP na porta 7071, mas sem o agente interno não há serviço para chamá-la — operação manual via painel web Carbonio
- O iNControl e o Topdata Inner não possuem API documentada para integração remota segura
- A REST API RH é pública (sem autenticação) — qualquer um com a URL pode consultá-la; o O.R.I trata os dados como autoritativos mas não como confidenciais

### 7.2 Premissas de Operação

- A equipe de TI monitora o painel O.R.I pelo menos uma vez a cada 30 minutos durante o horário comercial
- O bot Zoho Cliq está sempre disponível (SLA Zoho One Enterprise)
- O Vercel e o Supabase têm SLA de 99,9% — falhas são raras e tratadas por retry automático
- A API key do Gemini tem quota suficiente para o volume de chamados da Proxxima (estimado em 50–200 triagens/dia)
- Os sistemas internos (Carbonio, Zentyal, iNControl, Topdata) estão disponíveis durante o horário comercial

---

## 8. Glossário

| Termo             | Definição                                                                                     |
|--------------------|-----------------------------------------------------------------------------------------------|
| Container (C4)     | No modelo C4, um "container" é qualquer processo separado ou armazenamento de dados que compõe um sistema — não confundir com containers Docker |
| pgvector           | Extensão do PostgreSQL que adiciona suporte a vetores de alta dimensão e operações de similaridade (busca semântica) |
| Embedding          | Representação numérica (vetor) de um texto que captura seu significado semântico. Textos similares têm vetores próximos |
| HNSW               | Hierarchical Navigable Small World — algoritmo de indexação para busca aproximada de vizinhos mais próximos em alta dimensão |
| ADR                | Architecture Decision Record — documento que registra uma decisão arquitetural importante      |
| Vercel Serverless  | Funções Node.js hospedadas no Vercel que escalam automaticamente, sem gerenciamento de servidor |
| SLA                | Service Level Agreement — acordo de nível de serviço que define o tempo máximo para conclusão de uma tarefa |
| OAuth 2.0          | Protocolo de autorização usado para integração com o Zoho. Permite que o O.R.I aja em nome da organização Zoho |

---

## 9. Histórico de Versões

| Versão | Data    | Autor       | Mudanças                                                                                      |
|--------|---------|-------------|-----------------------------------------------------------------------------------------------|
| 1.0    | 2025-01 | TI Proxxima | Criação do documento. Arquitetura com agente interno e 4 adaptadores                          |
| 2.0    | 2025-02 | TI Proxxima | Zentyal, iNControl e Topdata passam para fila manual. Agente mantido apenas para Carbonio     |
| 3.0    | 2025-03 | TI Proxxima | Remoção completa do agente interno. Adição do módulo de IA (Gemini 2.5 Flash). Arquitetura 100% nuvem |

---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
