-- Supabase Storage Configuration
-- Cria buckets para armazenar evidências e uploads

-- Bucket para evidências de tarefas
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'evidencias',
  'evidencias',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
)
on conflict (id) do nothing;

-- Bucket para uploads genéricos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'uploads',
  'uploads',
  false,
  52428800,
  array['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
)
on conflict (id) do nothing;

-- Policies de acesso

-- Evidencias: apenas técnicos de TI podem fazer upload
create policy "Upload evidencias"
  on storage.objects for insert
  with check (bucket_id = 'evidencias');

-- Evidencias: todos podem visualizar
create policy "View evidencias"
  on storage.objects for select
  using (bucket_id = 'evidencias');

-- Uploads: apenas authenticated podem fazer upload
create policy "Upload private"
  on storage.objects for insert
  with check (bucket_id = 'uploads' and auth.role() = 'authenticated');

-- Uploads: apenas owner pode ver seus arquivos
create policy "View own uploads"
  on storage.objects for select
  using (bucket_id = 'uploads' and (storage.foldername(name))[1] = auth.uid()::text);
