-- Migration: create battles + battle_events tables for the Flash Battle engine

create table if not exists public.battles (
  id uuid primary key default gen_random_uuid(),
  player1_id text not null,
  player2_id text,
  player1_score integer not null default 0,
  player2_score integer not null default 0,
  status text not null default 'waiting',
  start_time timestamptz,
  end_time timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.battle_events (
  id uuid primary key default gen_random_uuid(),
  battle_id uuid not null references public.battles(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists battle_events_battle_id_idx on public.battle_events(battle_id);
create index if not exists battle_events_created_at_idx on public.battle_events(created_at);

-- Enable Realtime on battle_events so the client can subscribe via postgres_changes.
-- Wrapped in DO/EXCEPTION so re-running is safe if the table is already published.
do $$
begin
  alter publication supabase_realtime add table public.battle_events;
exception when duplicate_object then null;
end $$;

-- For now keep RLS off so the anon-key realtime subscription succeeds.
-- Tighten with policies once auth is wired up.
alter table public.battles disable row level security;
alter table public.battle_events disable row level security;
