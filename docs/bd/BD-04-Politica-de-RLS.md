# BD-04 — Política de Row Level Security (RLS)

  **Regras de Acesso por Linha no Supabase PostgreSQL**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Banco de Dados                     |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Visão Geral do RLS no O.R.I](#1-visão-geral-do-rls-no-ori)
  2. [Chaves do Supabase e Permissões](#2-chaves-do-supabase-e-permissões)
  3. [Políticas por Tabela](#3-políticas-por-tabela)
  4. [Testes de RLS](#4-testes-de-rls)
  5. [Boas Práticas](#5-boas-práticas)
  6. [Histórico de Versões](#6-histórico-de-versões)

  ---

  ## 1. Visão Geral do RLS no O.R.I

  O Row Level Security (RLS) do PostgreSQL é a primeira linha de defesa do banco de dados. Mesmo que uma query chegue ao Supabase, o RLS garante que ela só acesse as linhas autorizadas.

  ### Modelo de Acesso do O.R.I

  | Ator                  | Chave utilizada        | RLS aplicado | Nível de acesso                                |
  |-----------------------|------------------------|--------------|------------------------------------------------|
  | API Routes (Vercel)   | `SUPABASE_SERVICE_KEY`| **Bypassa RLS** | Acesso total — toda lógica de autorização está no código |
  | Painel Web TI (client)| `SUPABASE_ANON_KEY`  | **RLS ativo**   | Leitura limitada — operações via API Routes     |
  | Supabase Dashboard    | Admin (console)        | Bypassa RLS  | Manutenção direta pelo TI                       |

  > ⚠ **IMPORTANTE:** As API Routes usam a `service_role key` que bypassa o RLS. A segurança nas API Routes é garantida pelo código (middleware de autenticação Zoho, validação de HMAC para cron jobs, etc.). O RLS protege contra acesso direto ao banco via `anon key`.

  ---

  ## 2. Chaves do Supabase e Permissões

  | Chave               | Propósito                                               | Bypassa RLS | Onde é usada             |
  |----------------------|----------------------------------------------------------|-------------|--------------------------|
  | `anon key`         | Operações client-side com RLS ativo                      | Não         | Painel Web (frontend)     |
  | `service_role key` | Operações server-side com acesso total                   | Sim         | API Routes (Vercel)       |

  ---

  ## 3. Políticas por Tabela

  ### 3.1 colaboradores

  ```sql
  ALTER TABLE colaboradores ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "anon_read_basic_info" ON colaboradores
    FOR SELECT USING (
      status = 'ativo'
    );

  CREATE POLICY "service_full_access" ON colaboradores
    FOR ALL USING (true)
    WITH CHECK (true);
  ```

  | Política              | Operação | Quem                | Regra                                    |
  |------------------------|----------|---------------------|------------------------------------------|
  | anon_read_basic_info   | SELECT   | anon key            | Apenas colaboradores ativos               |
  | service_full_access    | ALL      | service_role key    | Acesso total (bypassa RLS automaticamente)|

  ### 3.2 chamados

  ```sql
  ALTER TABLE chamados ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "anon_read_own_chamados" ON chamados
    FOR SELECT USING (
      colaborador_id IN (
        SELECT id FROM colaboradores
        WHERE email_corporativo = auth.jwt()->>'email'
      )
    );
  ```

  ### 3.3 tarefas_manuais

  ```sql
  ALTER TABLE tarefas_manuais ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "anon_no_access" ON tarefas_manuais
    FOR ALL USING (false);
  ```

  > Tarefas manuais são acessíveis apenas via API Routes (service key). Nenhum acesso via anon key.

  ### 3.4 kb_artigos

  ```sql
  ALTER TABLE kb_artigos ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "anon_read_published" ON kb_artigos
    FOR SELECT USING (publicado = true);
  ```

  ### 3.5 audit_log

  ```sql
  ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "anon_no_access" ON audit_log
    FOR ALL USING (false);
  ```

  > audit_log é restrito — apenas leitura via API Routes por técnicos autenticados.

  ### 3.6 rfid_crachas e ativos

  ```sql
  ALTER TABLE rfid_crachas ENABLE ROW LEVEL SECURITY;
  ALTER TABLE ativos ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "anon_no_access" ON rfid_crachas FOR ALL USING (false);
  CREATE POLICY "anon_no_access" ON ativos FOR ALL USING (false);
  ```

  ---

  ## 4. Testes de RLS

  ### 4.1 Testar com anon key

  ```bash
  curl -X GET "https://ori-prod.supabase.co/rest/v1/colaboradores?status=eq.ativo" \
    -H "apikey: sua-anon-key" \
    -H "Authorization: Bearer sua-anon-key"
  # Deve retornar apenas colaboradores ativos

  curl -X GET "https://ori-prod.supabase.co/rest/v1/audit_log" \
    -H "apikey: sua-anon-key"
  # Deve retornar 0 registros (RLS bloqueia)

  curl -X DELETE "https://ori-prod.supabase.co/rest/v1/colaboradores?id=eq.uuid-do-registro" \
    -H "apikey: sua-anon-key"
  # Deve falhar (sem política de DELETE para anon)
  ```

  ### 4.2 Verificar que RLS está ativo

  ```sql
  SELECT tablename, rowsecurity
  FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY tablename;
  ```

  Todas as tabelas devem ter `rowsecurity = true`.

  ---

  ## 5. Boas Práticas

  | Prática                                      | Motivo                                          |
  |-----------------------------------------------|--------------------------------------------------|
  | Sempre habilitar RLS em novas tabelas          | Proteção por padrão                              |
  | Testar políticas com anon key após cada change | Verificar que restrições funcionam                |
  | Preferir políticas restritivas por padrão      | Abrir acesso explicitamente, não implicitamente   |
  | Documentar cada política                       | Facilita auditoria e manutenção                   |
  | Não depender apenas do RLS para segurança      | O código também deve validar autorização          |

  ---

  ## 6. Histórico de Versões

  | Versão | Data    | Mudanças                                         |
  |--------|---------|--------------------------------------------------|
  | 1.0    | 2025-01 | Criação: políticas para colaboradores e chamados |
  | 3.0    | 2025-03 | Políticas para kb_artigos, rfid_crachas, ativos  |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
