-- Supabase Realtime Configuration
-- Habilita Realtime nas tabelas do O.R.I

-- Habilitar Realtime na tabela chamados
alter publication supabase_realtime add table chamados;

-- Habilitar Realtime na tabela tarefas_manuais
alter publication supabase_realtime add table tarefas_manuais;

-- Habilitar Realtime na tabela kb_artigos
alter publication supabase_realtime add table kb_artigos;

-- Habilitar Realtime na tabela audit_log
alter publication supabase_realtime add table audit_log;
