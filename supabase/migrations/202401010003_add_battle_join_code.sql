-- Migration: add a short, human-typable join code to battles.
-- The id column stays as the canonical uuid; join_code is a 6-char string
-- that users can type into the "Join Battle" UI.

alter table public.battles add column if not exists join_code text;

-- Unique so we can look battles up by code; nullable so existing rows survive.
do $$
begin
  alter table public.battles add constraint battles_join_code_key unique (join_code);
exception when duplicate_object then null;
end $$;
