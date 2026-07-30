-- Columnas usadas por el frontend que pueden faltar en proyectos antiguos.
alter table public.candidaturas
  add column if not exists empresa_url text;

alter table public.candidaturas
  add column if not exists historial_cambios text[] default '{}'::text[];

alter table public.candidaturas
  add column if not exists notas text;

alter table public.profiles
  add column if not exists puntos integer default 0;

alter table public.profiles
  add column if not exists nivel integer default 1;
