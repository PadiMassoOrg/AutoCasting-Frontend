-- =============================================================================
-- Auto Casting — shared runtime app config (maintenance warning banner)
-- =============================================================================
-- ONE Supabase table, read directly by the web Frontend and the Mobile app via
-- the Supabase client + Realtime. No backend, no config.json, no app restart:
-- flipping a value in the Supabase Table Editor propagates to every open client
-- within seconds (Realtime), and to any client that loads afterwards (initial
-- read). This is the single source of truth for the maintenance warning.
--
-- WHAT THIS DOES: shows a dismissible top banner warning users that maintenance
-- is coming on a given date (maintenance windows are just an app re-bootstrap
-- during a release). There is NO time, NO "live maintenance" state and NO
-- full-screen block.
--
-- The banner TEXT is fixed and translated in the apps (i18n key
-- "maintenance.scheduled" -> "Entraremos en mantenimiento el <fecha>.").
-- An operator edits exactly TWO fields in the Table Editor:
--   * maintenance_warning : true/false  (show the banner)
--   * maintenance_at       : date        (the day maintenance will happen — date only)
--
-- Run this once in the Supabase project (SQL Editor). It is idempotent and also
-- migrates earlier versions of this table.
-- Project: qmtzkcmnmhvmaerqhaex  (same project already used for profile media)
-- =============================================================================

-- 1) Table -- single row, id is always 1 -----------------------------------
create table if not exists public.app_config (
  id                   smallint primary key default 1,
  -- Show the "maintenance is coming" banner.
  maintenance_warning  boolean not null default false,
  -- The day maintenance will happen. DATE only (no time, no timezone). Mandatory
  -- with a far-future default so the Table Editor never shows an empty field;
  -- the operator just moves the date forward.
  maintenance_at       date    not null default date '2028-01-01',
  updated_at           timestamptz not null default now(),
  constraint app_config_singleton check (id = 1)
);

-- 1b) Migrate from earlier shapes, if present ----------------------------
alter table public.app_config add column if not exists maintenance_warning boolean not null default false;
-- carry an old "maintenance_mode" flag over to "maintenance_warning", then drop it
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'app_config' and column_name = 'maintenance_mode'
  ) then
    update public.app_config set maintenance_warning = coalesce(maintenance_mode, false) where id = 1;
    alter table public.app_config drop column maintenance_mode;
  end if;
end;
$$;
-- normalise maintenance_at to a NOT NULL date column
alter table public.app_config add column if not exists maintenance_at date;
update public.app_config set maintenance_at = date '2028-01-01' where maintenance_at is null;
alter table public.app_config
  alter column maintenance_at type date using maintenance_at::date,
  alter column maintenance_at set default date '2028-01-01',
  alter column maintenance_at set not null;
alter table public.app_config drop column if exists maintenance_message;
alter table public.app_config drop column if exists maintenance_blocking;

-- 2) Seed the single row -------------------------------------------------
insert into public.app_config (id, maintenance_warning, maintenance_at)
values (1, false, date '2028-01-01')
on conflict (id) do nothing;

-- 3) Keep updated_at fresh on every change -----------------------------
create or replace function public.app_config_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_app_config_touch on public.app_config;
create trigger trg_app_config_touch
  before update on public.app_config
  for each row execute function public.app_config_touch_updated_at();

-- 4) Row Level Security ----------------------------------------------
-- Everyone (including logged-out visitors on the public catalog) may READ.
-- Nobody may write through the anon/auth API — writes happen only in the
-- Supabase dashboard (Table Editor) or via the service_role key.
alter table public.app_config enable row level security;

drop policy if exists "app_config read for anon and authenticated" on public.app_config;
create policy "app_config read for anon and authenticated"
  on public.app_config
  for select
  to anon, authenticated
  using (true);

-- 5) Realtime ------------------------------------------------------
-- Add the table to the realtime publication so open apps get UPDATE events.
do $$
begin
  alter publication supabase_realtime add table public.app_config;
exception
  when duplicate_object then null;
end;
$$;

-- =============================================================================
-- HOW TO USE (operator runbook)
-- =============================================================================
-- Warn users that maintenance is coming:
--   Table Editor -> app_config -> row id=1 -> set
--     maintenance_warning = true
--     maintenance_at      = 2026-01-16   (the day — date only)
--   -> Save.  Banner on web + mobile within seconds:
--      "Entraremos en mantenimiento el 16 de enero de 2026."
--
-- After the maintenance is done (or to hide the banner):
--   maintenance_warning = false  -> Save.  Banner disappears everywhere.
--   (Leave maintenance_at as-is; it does nothing while the flag is false.)
-- =============================================================================
