-- Row Level Security Policies
-- API Routes use service_key (bypass RLS), Panel uses anon_key (enforces RLS)

-- Colaboradores: anon pode ler apenas ativos
create policy "Colaboradores leitura ativa"
  on colaboradores for select
  using (status = 'ATIVO');

-- Chamados: anon pode ler seus próprios chamados
create policy "Chamados leitura propria"
  on chamados for select
  using (colaborador_id = auth.uid());

-- Tarefas manuais: sem acesso anon
create policy "Tarefas sem acesso anon"
  on tarefas_manuais for select
  using (false);

-- KB Artigos: anon pode ler publicados/ativos
create policy "KB leitura publicados"
  on kb_artigos for select
  using (status in ('PUBLICADO', 'ATIVO'));

-- Audit log: sem acesso anon
create policy "Audit sem acesso anon"
  on audit_log for select
  using (false);

-- RFID: sem acesso anon
create policy "RFID sem acesso anon"
  on rfid_crachas for select
  using (false);

-- Ativos: sem acesso anon
create policy "Ativos sem acesso anon"
  on ativos for select
  using (false);
