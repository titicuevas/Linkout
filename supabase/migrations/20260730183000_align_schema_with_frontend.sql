-- Bootstrap / alineación del esquema LinkOut
-- Seguro en proyectos nuevos (crea tablas) y en existentes (añade columnas faltantes).

create extension if not exists "pgcrypto";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  nombre text,
  puntos integer default 0,
  nivel integer default 1,
  created_at timestamptz default now()
);

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists nombre text;
alter table public.profiles add column if not exists puntos integer default 0;
alter table public.profiles add column if not exists nivel integer default 1;
alter table public.profiles add column if not exists created_at timestamptz default now();

-- Candidaturas
create table if not exists public.candidaturas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  empresa text not null,
  empresa_url text,
  puesto text not null,
  estado text not null,
  fecha date not null,
  fecha_actualizacion date default current_date,
  salario_anual integer,
  franja_salarial text,
  tipo_trabajo text,
  ubicacion text,
  origen text,
  feedback text,
  notas text,
  historial_cambios text[] default '{}'::text[],
  created_at timestamptz default now()
);

alter table public.candidaturas add column if not exists empresa_url text;
alter table public.candidaturas add column if not exists fecha_actualizacion date default current_date;
alter table public.candidaturas add column if not exists salario_anual integer;
alter table public.candidaturas add column if not exists franja_salarial text;
alter table public.candidaturas add column if not exists tipo_trabajo text;
alter table public.candidaturas add column if not exists ubicacion text;
alter table public.candidaturas add column if not exists origen text;
alter table public.candidaturas add column if not exists feedback text;
alter table public.candidaturas add column if not exists notas text;
alter table public.candidaturas add column if not exists historial_cambios text[] default '{}'::text[];
alter table public.candidaturas add column if not exists created_at timestamptz default now();

-- Diario personal
create table if not exists public.desahogos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  texto text not null,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.candidaturas enable row level security;
alter table public.desahogos enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "candidaturas_all_own" on public.candidaturas;
drop policy if exists "desahogos_all_own" on public.desahogos;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "candidaturas_all_own"
  on public.candidaturas for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "desahogos_all_own"
  on public.desahogos for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
