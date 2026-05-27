-- Migration: wire battles + battle_events into Supabase auth.
--
--   1. Convert battles.player1_id / battles.player2_id from text to uuid and
--      add foreign keys to auth.users(id) on delete cascade.
--   2. Enable RLS on both tables.
--   3. Add permissive policies so a user can only see / mutate battles they
--      participate in -- with one extra carve-out so a prospective joiner can
--      look up an open lobby (status='waiting', player2_id is null) by code.
--
-- Note on the data wipe below: the existing battles / battle_events rows in
-- this dev project were created with non-uuid player ids (e.g. random
-- nicknames) and migrating them with USING (player_id::uuid) would fail. We
-- intentionally clear those tables before the ALTER. No real-user data exists
-- yet, so this is safe.

begin;

-- battle_events FK on battles cascades, but be explicit about ordering anyway.
delete from public.battle_events;
delete from public.battles;

alter table public.battles
  alter column player1_id type uuid using player1_id::uuid;

alter table public.battles
  alter column player2_id type uuid using player2_id::uuid;

-- Preserve the NOT NULL constraint on player1_id (already not null from 0002);
-- player2_id stays nullable so a battle can be in "waiting for opponent" state.

-- Foreign keys to auth.users. Wrapped in DO/EXCEPTION so the migration is
-- idempotent if the constraints already exist.
do $$
begin
  alter table public.battles
    add constraint battles_player1_id_fkey
    foreign key (player1_id) references auth.users(id) on delete cascade;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.battles
    add constraint battles_player2_id_fkey
    foreign key (player2_id) references auth.users(id) on delete cascade;
exception when duplicate_object then null;
end $$;

commit;

-- ----------------------------------------------------------------------------
-- Enable RLS
-- ----------------------------------------------------------------------------
alter table public.battles enable row level security;
alter table public.battle_events enable row level security;

-- ----------------------------------------------------------------------------
-- battles policies
-- ----------------------------------------------------------------------------

-- A user can see battles they're a participant in.
create policy "battles_select_participant" on public.battles
  for select
  using (auth.uid() = player1_id or auth.uid() = player2_id);

-- Additionally, any authenticated user may look up an OPEN LOBBY battle
-- (status='waiting' and no opponent yet). Multiple permissive policies are
-- OR-combined by Postgres, so the effective rule is:
--   "I can read battles I'm in, OR battles that are still open."
-- This lets a joiner resolve a join_code -> battle row before they've been
-- written into the battle as player2.
create policy "battles_select_open_lobby" on public.battles
  for select
  to authenticated
  using (status = 'waiting' and player2_id is null);

-- A user can create a battle, but only as player1 (the creator).
create policy "battles_insert_self_as_player1" on public.battles
  for insert
  with check (auth.uid() = player1_id);

-- Either player can update the battle (score updates, joining as player2,
-- ending the battle, etc.).
create policy "battles_update_participant" on public.battles
  for update
  using (auth.uid() = player1_id or auth.uid() = player2_id)
  with check (auth.uid() = player1_id or auth.uid() = player2_id);

-- No delete policy: deletes are denied. Battles are cleaned up by cascade
-- when a user is removed from auth.users.

-- ----------------------------------------------------------------------------
-- battle_events policies
-- ----------------------------------------------------------------------------

-- A user can read events for battles they participate in.
create policy "battle_events_select_participant" on public.battle_events
  for select
  using (
    battle_id in (
      select id from public.battles
      where auth.uid() = player1_id or auth.uid() = player2_id
    )
  );

-- A user can append events only to battles they participate in.
create policy "battle_events_insert_participant" on public.battle_events
  for insert
  with check (
    battle_id in (
      select id from public.battles
      where auth.uid() = player1_id or auth.uid() = player2_id
    )
  );

-- No update / delete policies: battle events are append-only.
