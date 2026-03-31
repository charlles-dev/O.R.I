# BD-01 — DDL Supabase Completo

  **Definição de Tabelas, Índices, Tipos e Extensões**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Banco de Dados                     |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Visão Geral do Schema](#1-visão-geral-do-schema)
  2. [Extensões PostgreSQL](#2-extensões-postgresql)
  3. [Tipos Customizados (ENUM)](#3-tipos-customizados-enum)
  4. [Tabelas](#4-tabelas)
  5. [Índices](#5-índices)
  6. [Funções e Triggers](#6-funções-e-triggers)
  7. [Histórico de Versões](#7-histórico-de-versões)

  ---

  ## 1. Visão Geral do Schema

  O banco de dados do O.R.I v3.0 é hospedado no **Supabase** (PostgreSQL 15 gerenciado) com a extensão **pgvector** para busca semântica. Todas as tabelas estão no schema `public`.

  ### Diagrama de Relacionamentos

  ```
  colaboradores ──┬── chamados (colaborador_id)
                  ├── tarefas_manuais (colaborador_id)
                  ├── rfid_crachas (colaborador_id)
                  └── ativos (responsavel_id)

  kb_artigos ──── kb_artigos_feedback (artigo_id)

  audit_log (tabela independente — registra todos os eventos)
  ```

  ---

  ## 2. Extensões PostgreSQL

  ```sql
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE EXTENSION IF NOT EXISTS "pg_trgm";
  CREATE EXTENSION IF NOT EXISTS "unaccent";
  CREATE EXTENSION IF NOT EXISTS "vector";
  ```

  ---

  ## 3. Tipos Customizados (ENUM)

  ```sql
  CREATE TYPE status_colaborador AS ENUM ('ativo', 'desligado', 'ferias', 'afastado');
  CREATE TYPE status_chamado AS ENUM ('aberto', 'em_andamento', 'resolvido', 'fechado', 'cancelado');
  CREATE TYPE prioridade AS ENUM ('baixa', 'media', 'alta', 'critica');
  CREATE TYPE tipo_tarefa AS ENUM (
    'carbonio_criar_conta', 'carbonio_reset_senha', 'carbonio_suspender',
    'zentyal_criar_usuario', 'zentyal_trocar_grupo', 'zentyal_reset_senha', 'zentyal_desativar',
    'rfid_cadastrar_incontrol', 'rfid_cadastrar_topdata',
    'offboarding_completo'
  );
  CREATE TYPE status_tarefa AS ENUM ('pendente', 'em_andamento', 'concluida', 'cancelada');
  CREATE TYPE status_ativo AS ENUM ('em_uso', 'disponivel', 'em_manutencao', 'descartado');
  CREATE TYPE tipo_ativo AS ENUM ('notebook', 'desktop', 'monitor', 'impressora', 'telefone', 'headset', 'outro');
  ```

  ---

  ## 4. Tabelas

  ### 4.1 colaboradores

  Fonte de verdade: REST API RH (`proxximatelecomquem.netlify.app`). Sincronizada a cada 15 minutos pelo cron `/api/colaboradores/sync`.

  ```sql
  CREATE TABLE colaboradores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricula VARCHAR(20) UNIQUE NOT NULL,
    nome_completo VARCHAR(200) NOT NULL,
    email_corporativo VARCHAR(200) UNIQUE,
    email_pessoal VARCHAR(200),
    setor VARCHAR(100) NOT NULL,
    cargo VARCHAR(150),
    filial VARCHAR(100) NOT NULL,
    superior_email VARCHAR(200),
    data_admissao DATE,
    status status_colaborador DEFAULT 'ativo',
    dados_api_rh JSONB DEFAULT '{}',
    criado_em TIMESTAMPTZ DEFAULT now(),
    atualizado_em TIMESTAMPTZ DEFAULT now()
  );
  ```

  ### 4.2 chamados

  Chamados técnicos criados pelo bot ou TI. Sincronizados com o GLPI quando necessário.

  ```sql
  CREATE TABLE chamados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    colaborador_id UUID REFERENCES colaboradores(id),
    glpi_ticket_id INTEGER,
    titulo VARCHAR(300) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(100),
    prioridade prioridade DEFAULT 'media',
    status status_chamado DEFAULT 'aberto',
    confianca_ia FLOAT,
    resposta_ia TEXT,
    artigos_utilizados UUID[],
    resolvido_por_ia BOOLEAN DEFAULT false,
    tecnico_responsavel VARCHAR(200),
    solucao TEXT,
    criado_em TIMESTAMPTZ DEFAULT now(),
    atualizado_em TIMESTAMPTZ DEFAULT now(),
    fechado_em TIMESTAMPTZ
  );
  ```

  ### 4.3 tarefas_manuais

  Fila de tarefas para operações que exigem ação manual do TI em sistemas internos.

  ```sql
  CREATE TABLE tarefas_manuais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    colaborador_id UUID REFERENCES colaboradores(id),
    tipo tipo_tarefa NOT NULL,
    prioridade prioridade DEFAULT 'media',
    status status_tarefa DEFAULT 'pendente',
    dados JSONB NOT NULL DEFAULT '{}',
    tecnico_responsavel VARCHAR(200),
    evidencia TEXT,
    sla_minutos INTEGER NOT NULL DEFAULT 120,
    criado_em TIMESTAMPTZ DEFAULT now(),
    iniciado_em TIMESTAMPTZ,
    concluido_em TIMESTAMPTZ
  );
  ```

  ### 4.4 kb_artigos

  Base de conhecimento com embeddings vetoriais para busca semântica via pgvector.

  ```sql
  CREATE TABLE kb_artigos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(300) NOT NULL,
    conteudo TEXT NOT NULL,
    categoria VARCHAR(100),
    tags TEXT[] DEFAULT '{}',
    embedding vector(768),
    publicado BOOLEAN DEFAULT true,
    util_count INTEGER DEFAULT 0,
    nao_util_count INTEGER DEFAULT 0,
    autor VARCHAR(200),
    criado_em TIMESTAMPTZ DEFAULT now(),
    atualizado_em TIMESTAMPTZ DEFAULT now()
  );
  ```

  ### 4.5 kb_artigos_feedback

  Feedback dos colaboradores sobre a utilidade dos artigos sugeridos pela IA.

  ```sql
  CREATE TABLE kb_artigos_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artigo_id UUID REFERENCES kb_artigos(id) ON DELETE CASCADE,
    chamado_id UUID REFERENCES chamados(id),
    colaborador_id UUID REFERENCES colaboradores(id),
    util BOOLEAN NOT NULL,
    comentario TEXT,
    criado_em TIMESTAMPTZ DEFAULT now()
  );
  ```

  ### 4.6 rfid_crachas

  Crachás RFID dos colaboradores para controle de acesso e ponto.

  ```sql
  CREATE TABLE rfid_crachas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    colaborador_id UUID REFERENCES colaboradores(id),
    codigo_rfid VARCHAR(50) UNIQUE NOT NULL,
    ativo BOOLEAN DEFAULT true,
    cadastrado_incontrol BOOLEAN DEFAULT false,
    cadastrado_topdata BOOLEAN DEFAULT false,
    criado_em TIMESTAMPTZ DEFAULT now(),
    atualizado_em TIMESTAMPTZ DEFAULT now()
  );
  ```

  ### 4.7 ativos

  Inventário de equipamentos de TI associados a colaboradores.

  ```sql
  CREATE TABLE ativos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo tipo_ativo NOT NULL,
    marca VARCHAR(100),
    modelo VARCHAR(150),
    numero_serie VARCHAR(100) UNIQUE,
    patrimonio VARCHAR(50) UNIQUE,
    status status_ativo DEFAULT 'disponivel',
    responsavel_id UUID REFERENCES colaboradores(id),
    localizacao VARCHAR(200),
    notas TEXT,
    criado_em TIMESTAMPTZ DEFAULT now(),
    atualizado_em TIMESTAMPTZ DEFAULT now()
  );
  ```

  ### 4.8 audit_log

  Log de auditoria imutável para todas as ações do sistema.

  ```sql
  CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    acao VARCHAR(100) NOT NULL,
    entidade VARCHAR(50),
    entidade_id UUID,
    usuario VARCHAR(200),
    ip VARCHAR(45),
    detalhes JSONB DEFAULT '{}',
    criado_em TIMESTAMPTZ DEFAULT now()
  );
  ```

  ---

  ## 5. Índices

  ```sql
  -- Colaboradores
  CREATE INDEX idx_colaboradores_email ON colaboradores(email_corporativo);
  CREATE INDEX idx_colaboradores_matricula ON colaboradores(matricula);
  CREATE INDEX idx_colaboradores_setor ON colaboradores(setor);
  CREATE INDEX idx_colaboradores_status ON colaboradores(status);

  -- Chamados
  CREATE INDEX idx_chamados_colaborador ON chamados(colaborador_id);
  CREATE INDEX idx_chamados_status ON chamados(status);
  CREATE INDEX idx_chamados_criado ON chamados(criado_em DESC);
  CREATE INDEX idx_chamados_glpi ON chamados(glpi_ticket_id);

  -- Tarefas
  CREATE INDEX idx_tarefas_status ON tarefas_manuais(status);
  CREATE INDEX idx_tarefas_tipo ON tarefas_manuais(tipo);
  CREATE INDEX idx_tarefas_prioridade ON tarefas_manuais(prioridade);
  CREATE INDEX idx_tarefas_criado ON tarefas_manuais(criado_em DESC);

  -- KB — busca semântica vetorial
  CREATE INDEX idx_kb_embedding ON kb_artigos
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

  -- KB — busca textual trigram
  CREATE INDEX idx_kb_titulo_trgm ON kb_artigos USING gin (titulo gin_trgm_ops);
  CREATE INDEX idx_kb_conteudo_trgm ON kb_artigos USING gin (conteudo gin_trgm_ops);

  -- Audit log
  CREATE INDEX idx_audit_acao ON audit_log(acao);
  CREATE INDEX idx_audit_criado ON audit_log(criado_em DESC);
  CREATE INDEX idx_audit_entidade ON audit_log(entidade, entidade_id);

  -- RFID
  CREATE INDEX idx_rfid_colaborador ON rfid_crachas(colaborador_id);
  CREATE INDEX idx_rfid_codigo ON rfid_crachas(codigo_rfid);

  -- Ativos
  CREATE INDEX idx_ativos_responsavel ON ativos(responsavel_id);
  CREATE INDEX idx_ativos_status ON ativos(status);
  ```

  ---

  ## 6. Funções e Triggers

  ### 6.1 Atualização automática de `atualizado_em`

  ```sql
  CREATE OR REPLACE FUNCTION update_atualizado_em()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.atualizado_em = now();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- Aplicado a todas as tabelas com coluna atualizado_em
  CREATE TRIGGER trg_colaboradores_updated BEFORE UPDATE ON colaboradores
    FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();
  CREATE TRIGGER trg_chamados_updated BEFORE UPDATE ON chamados
    FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();
  CREATE TRIGGER trg_tarefas_updated BEFORE UPDATE ON tarefas_manuais
    FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();
  CREATE TRIGGER trg_kb_updated BEFORE UPDATE ON kb_artigos
    FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();
  CREATE TRIGGER trg_rfid_updated BEFORE UPDATE ON rfid_crachas
    FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();
  CREATE TRIGGER trg_ativos_updated BEFORE UPDATE ON ativos
    FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();
  ```

  ### 6.2 Busca semântica na KB

  ```sql
  CREATE OR REPLACE FUNCTION kb_busca_semantica(
    query_embedding vector(768),
    limite INTEGER DEFAULT 5,
    threshold FLOAT DEFAULT 0.75
  )
  RETURNS TABLE (
    id UUID, titulo VARCHAR, conteudo TEXT,
    categoria VARCHAR, similaridade FLOAT
  ) AS $$
  BEGIN
    RETURN QUERY
    SELECT
      ka.id, ka.titulo, ka.conteudo, ka.categoria,
      1 - (ka.embedding <=> query_embedding) AS similaridade
    FROM kb_artigos ka
    WHERE ka.publicado = true
      AND ka.embedding IS NOT NULL
      AND 1 - (ka.embedding <=> query_embedding) >= threshold
    ORDER BY ka.embedding <=> query_embedding
    LIMIT limite;
  END;
  $$ LANGUAGE plpgsql;
  ```

  ---

  ## 7. Histórico de Versões

  | Versão | Data    | Mudanças                                                     |
  |--------|---------|--------------------------------------------------------------|
  | 1.0    | 2025-01 | Criação: colaboradores, chamados, tarefas_manuais, audit_log |
  | 2.0    | 2025-02 | Adicionado rfid_crachas, ativos                               |
  | 3.0    | 2025-03 | Adicionado kb_artigos com pgvector, kb_artigos_feedback, função kb_busca_semantica |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
