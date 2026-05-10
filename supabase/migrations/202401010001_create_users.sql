-- Migration: create users table
create table public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  username text not null,
  avatar_url text,
  rank text default 'Bronze',
  xp integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS policy – only authenticated users can select their own record
create policy "allow select own" on public.users
  for select using (auth.uid() = id);
