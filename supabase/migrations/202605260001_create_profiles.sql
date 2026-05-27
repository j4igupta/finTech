-- Migration: create public.profiles keyed on auth.users(id), plus a trigger
-- that auto-creates a profile row on signup, and RLS policies for the table.
--
-- Note: the older public.users table (migration 0001) is orphaned and left as-is.
-- All app code writes/reads via this profiles table from now on.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar_url text,
  rank text not null default 'Bronze',
  xp int not null default 0,
  created_at timestamptz not null default now()
);

-- Note: username is `unique not null`, which already creates a btree index
-- on (username) automatically. No extra index needed.

-- ----------------------------------------------------------------------------
-- handle_new_user(): runs after a new row is inserted into auth.users.
-- Creates a matching profiles row using the email's local-part as the default
-- username. On collision (very unlikely), append a short hash suffix derived
-- from the user id so retries deterministically resolve to a unique value.
-- SECURITY DEFINER so it can insert into public.profiles regardless of who
-- triggered the signup; search_path is pinned to public to prevent hijacking.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  final_username text;
begin
  base_username := split_part(coalesce(new.email, ''), '@', 1);
  if base_username is null or base_username = '' then
    base_username := 'user_' || substr(md5(new.id::text), 1, 6);
  end if;

  final_username := base_username;

  -- If the base username is already taken, append a short id-derived suffix.
  if exists (select 1 from public.profiles where username = final_username) then
    final_username := base_username || '_' || substr(md5(new.id::text), 1, 4);
  end if;

  insert into public.profiles (id, username)
  values (new.id, final_username);

  return new;
end;
$$;

-- Trigger: fire after a new auth.users row is created.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Any authenticated user can read every profile row. The leaderboard and
-- battle UIs need other users' public info (username, avatar, rank, xp).
create policy "profiles_select_authenticated" on public.profiles
  for select
  using (auth.role() = 'authenticated');

-- A user can update only their own profile row.
create policy "profiles_update_own" on public.profiles
  for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- No insert policy: profile rows are created exclusively by the
-- handle_new_user() trigger (which runs as SECURITY DEFINER and bypasses RLS).
-- User code must never insert directly. RLS denies by default with no policy.

-- No delete policy: cleanup is handled by `on delete cascade` from auth.users.
