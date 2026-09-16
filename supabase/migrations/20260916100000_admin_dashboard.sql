-- Panel de administración: actividad y métricas agregadas (solo admin).

alter table public.profiles
  add column if not exists last_seen_at timestamptz;

comment on column public.profiles.last_seen_at is 'Última actividad conocida del usuario (login / uso de la app).';

create or replace function public.is_linkout_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) in (
    'enriquecuevas1989@gmail.com'
  );
$$;

revoke all on function public.is_linkout_admin() from public;
grant execute on function public.is_linkout_admin() to authenticated;

create or replace function public.admin_dashboard_stats()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  if not public.is_linkout_admin() then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  select json_build_object(
    'users_total', (select count(*)::int from public.profiles),
    'users_active_7d', (
      select count(*)::int from public.profiles
      where last_seen_at is not null and last_seen_at >= now() - interval '7 days'
    ),
    'users_active_30d', (
      select count(*)::int from public.profiles
      where last_seen_at is not null and last_seen_at >= now() - interval '30 days'
    ),
    'users_new_7d', (
      select count(*)::int from public.profiles
      where created_at >= now() - interval '7 days'
    ),
    'candidaturas_total', (select count(*)::int from public.candidaturas),
    'desahogos_total', (select count(*)::int from public.desahogos),
    'generated_at', now()
  ) into result;

  return result;
end;
$$;

revoke all on function public.admin_dashboard_stats() from public;
grant execute on function public.admin_dashboard_stats() to authenticated;

create or replace function public.admin_recent_users(limit_count int default 25)
returns table (
  id uuid,
  email text,
  nombre text,
  created_at timestamptz,
  last_seen_at timestamptz,
  candidaturas_count bigint,
  desahogos_count bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_linkout_admin() then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  if limit_count is null or limit_count < 1 then
    limit_count := 25;
  end if;
  if limit_count > 100 then
    limit_count := 100;
  end if;

  return query
  select
    p.id,
    p.email,
    p.nombre,
    p.created_at,
    p.last_seen_at,
    (
      select count(*)::bigint from public.candidaturas c where c.user_id = p.id
    ) as candidaturas_count,
    (
      select count(*)::bigint from public.desahogos d where d.user_id = p.id
    ) as desahogos_count
  from public.profiles p
  order by coalesce(p.last_seen_at, p.created_at) desc nulls last
  limit limit_count;
end;
$$;

revoke all on function public.admin_recent_users(int) from public;
grant execute on function public.admin_recent_users(int) to authenticated;
