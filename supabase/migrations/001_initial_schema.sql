-- O.R.I v3.0 - Database Schema
-- Supabase PostgreSQL with pgvector

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";
create extension if not exists "unaccent";
create extension if not exists "vector";

-- ENUM Types
create type setor_enum as enum ('TI', 'RH', 'Financeiro', 'Comercial', 'Operacoes', 'Diretoria', 'Marketing', 'Juridico');
create type status_colaborador_enum as enum ('ATIVO', 'FERIAS', 'LICENCA', 'DESLIGADO');
create type prioridade_enum as enum ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');
create type status_chamado_enum as enum ('ABERTO', 'EM_ANDAMENTO', 'AGUARDANDO_USUARIO', 'RESOLVIDO', 'FECHADO');
create type status_tarefa_enum as enum ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');
create type tipo_tarefa_enum as enum ('carbonio_criar_conta', 'carbonio_suspender', 'zentyal_criar_usuario', 'zentyal_desativar', 'zentyal_alterar_grupo', 'incontrol_cadastrar_cracha', 'topdata_cadastrar_cracha', 'offboarding_completo', 'outro');
create type categoria_kb_enum as enum ('email', 'rede', 'vpn', 'acesso', 'hardware', 'software', 'ponto', 'geral');
create type status_kb_enum as enum ('RASCUNHO', 'PUBLICADO', 'ATIVO', 'REVISAR', 'DESATIVADO');
create type acao_audit_enum as enum ('CRIAR_COLABORADOR', 'ATUALIZAR_COLABORADOR', 'DESATIVAR_COLABORADOR', 'CRIAR_CHAMADO', 'ATUALIZAR_CHAMADO', 'RESOLVER_CHAMADO_IA', 'CRIAR_TAREFA', 'CONCLUIR_TAREFA', 'CRIAR_KB', 'ATUALIZAR_KB', 'LOGIN', 'LOGOUT', 'RESET_SENHA', 'CADASTRAR_ATIVO', 'CADASTRAR_CRACHA');

-- Tables

create table colaboradores (
  id uuid primary key default uuid_generate_v4(),
  matricula varchar(20) unique not null,
  nome_completo varchar(200) not null,
  email varchar(200) unique,
  cpf varchar(14),
  setor setor_enum not null,
  cargo varchar(100) not null,
  gestor_nome varchar(200),
  gestor_email varchar(200),
  filial varchar(100),
  data_admissao date not null,
  data_desligamento date,
  status status_colaborador_enum not null default 'ATIVO',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table chamados (
  id uuid primary key default uuid_generate_v4(),
  glpi_id integer unique,
  colaborador_id uuid references colaboradores(id) on delete set null,
  titulo varchar(300) not null,
  descricao text,
  categoria varchar(100),
  prioridade prioridade_enum not null default 'MEDIA',
  status status_chamado_enum not null default 'ABERTO',
  solucao_ia text,
  confianca_ia numeric(3,2),
  resolvido_por_ia boolean not null default false,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  resolvido_em timestamptz
);

create table tarefas_manuais (
  id uuid primary key default uuid_generate_v4(),
  colaborador_id uuid references colaboradores(id) on delete set null,
  tipo tipo_tarefa_enum not null,
  titulo varchar(300) not null,
  descricao text,
  prioridade prioridade_enum not null default 'MEDIA',
  status status_tarefa_enum not null default 'PENDENTE',
  dados_execucao jsonb,
  evidencias jsonb,
  responsavel_id uuid references colaboradores(id) on delete set null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  concluida_em timestamptz,
  sla_limite timestamptz
);

create table kb_artigos (
  id uuid primary key default uuid_generate_v4(),
  titulo varchar(300) not null,
  conteudo text not null,
  categoria categoria_kb_enum not null,
  tags text[],
  embedding vector(768),
  status status_kb_enum not null default 'RASCUNHO',
  autor_id uuid references colaboradores(id) on delete set null,
  visualizacoes integer not null default 0,
  feedback_positivo integer not null default 0,
  feedback_negativo integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  publicado_em timestamptz
);

create table kb_artigos_feedback (
  id uuid primary key default uuid_generate_v4(),
  artigo_id uuid references kb_artigos(id) on delete cascade not null,
  colaborador_id uuid references colaboradores(id) on delete set null,
  positivo boolean not null,
  comentario text,
  criado_em timestamptz not null default now()
);

create table rfid_crachas (
  id uuid primary key default uuid_generate_v4(),
  colaborador_id uuid references colaboradores(id) on delete cascade not null,
  uid_cracha varchar(50) unique not null,
  sistema varchar(50) not null,
  status varchar(20) not null default 'PENDENTE',
  criado_em timestamptz not null default now(),
  ativado_em timestamptz
);

create table ativos (
  id uuid primary key default uuid_generate_v4(),
  nome varchar(200) not null,
  tipo varchar(100) not null,
  numero_serie varchar(100),
  patrimonio varchar(100) unique,
  colaborador_id uuid references colaboradores(id) on delete set null,
  status varchar(50) not null default 'DISPONIVEL',
  observacoes text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table audit_log (
  id uuid primary key default uuid_generate_v4(),
  acao acao_audit_enum not null,
  tabela_afetada varchar(100),
  registro_id uuid,
  usuario_id uuid references colaboradores(id) on delete set null,
  detalhes jsonb,
  ip_address inet,
  criado_em timestamptz not null default now()
);

-- Indexes

create index idx_colaboradores_matricula on colaboradores(matricula);
create index idx_colaboradores_status on colaboradores(status);
create index idx_colaboradores_email on colaboradores(email);
create index idx_colaboradores_setor on colaboradores(setor);

create index idx_chamados_status on chamados(status);
create index idx_chamados_prioridade on chamados(prioridade);
create index idx_chamados_colaborador on chamados(colaborador_id);
create index idx_chamados_glpi on chamados(glpi_id);
create index idx_chamados_criado_em on chamados(criado_em desc);
create index idx_chamados_resolvido_ia on chamados(resolvido_por_ia);

create index idx_tarefas_status on tarefas_manuais(status);
create index idx_tarefas_tipo on tarefas_manuais(tipo);
create index idx_tarefas_prioridade on tarefas_manuais(prioridade);
create index idx_tarefas_colaborador on tarefas_manuais(colaborador_id);
create index idx_tarefas_sla on tarefas_manuais(sla_limite);

create index idx_kb_status on kb_artigos(status);
create index idx_kb_categoria on kb_artigos(categoria);
create index idx_kb_titulo_trgm on kb_artigos using gin(titulo gin_trgm_ops);
create index idx_kb_conteudo_trgm on kb_artigos using gin(conteudo gin_trgm_ops);
create index idx_kb_embedding on kb_artigos using hnsw(embedding vector_cosine_ops) with (m = 16, ef_construction = 64);

create index idx_rfid_colaborador on rfid_crachas(colaborador_id);
create index idx_rfid_uid on rfid_crachas(uid_cracha);

create index idx_ativos_colaborador on ativos(colaborador_id);
create index idx_ativos_status on ativos(status);
create index idx_ativos_patrimonio on ativos(patrimonio);

create index idx_audit_acao on audit_log(acao);
create index idx_audit_usuario on audit_log(usuario_id);
create index idx_audit_criado_em on audit_log(criado_em desc);

-- Functions

create or replace function update_atualizado_em()
returns trigger as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_colaboradores_atualizado_em before update on colaboradores
  for each row execute function update_atualizado_em();

create trigger trg_chamados_atualizado_em before update on chamados
  for each row execute function update_atualizado_em();

create trigger trg_tarefas_atualizado_em before update on tarefas_manuais
  for each row execute function update_atualizado_em();

create trigger trg_kb_atualizado_em before update on kb_artigos
  for each row execute function update_atualizado_em();

create trigger trg_ativos_atualizado_em before update on ativos
  for each row execute function update_atualizado_em();

create or replace function kb_busca_semantica(
  query_embedding vector(768),
  match_threshold float = 0.75,
  match_count int = 5
)
returns table (
  id uuid,
  titulo varchar,
  conteudo text,
  categoria categoria_kb_enum,
  tags text[],
  visualizacoes integer,
  feedback_positivo integer,
  feedback_negativo integer,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    kb_artigos.id,
    kb_artigos.titulo,
    kb_artigos.conteudo,
    kb_artigos.categoria,
    kb_artigos.tags,
    kb_artigos.visualizacoes,
    kb_artigos.feedback_positivo,
    kb_artigos.feedback_negativo,
    1 - (kb_artigos.embedding <=> query_embedding) as similarity
  from kb_artigos
  where kb_artigos.status = 'ATIVO'
    and kb_artigos.embedding is not null
    and 1 - (kb_artigos.embedding <=> query_embedding) > match_threshold
  order by kb_artigos.embedding <=> query_embedding
  limit match_count;
end;
$$;
