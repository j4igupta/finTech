-- Migration: race-safe Flash Battle RPCs (join / action / end) with server-side
-- winner determination and XP award.
--
-- Why this exists (pre-deploy debug pass): the previous flow had three bugs that
-- this migration fixes at the database layer, where they can be made atomic:
--   * score was credited by buy/sell instead of by WHO acted (wrong player scored)
--   * score update was a non-atomic read-modify-write (lost concurrent deltas)
--   * join used a service-role bypass with no row-count check (TOCTOU double-join)
--   * battles never resolved a winner or awarded XP, and ignored end_time
--
-- All functions are SECURITY DEFINER and self-authorize via auth.uid(), so the
-- API route only has to forward the authenticated call. Must run AFTER
-- 202605260001 (profiles) and 202605260002 (battles -> auth.users + RLS).

-- ----------------------------------------------------------------------------
-- join_battle: atomically claim an open lobby as player2 and start the clock.
-- A single conditional UPDATE is the lock: only one caller can flip a given
-- waiting row, so concurrent joiners can't both succeed.
-- ----------------------------------------------------------------------------
create or replace function public.join_battle(p_join_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_code text := upper(coalesce(p_join_code, ''));
  v_battle_id uuid;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  if v_code = '' then
    raise exception 'missing join code' using errcode = 'P0003';
  end if;

  update public.battles
     set player2_id = v_uid,
         status     = 'active',
         start_time = now(),
         end_time   = now() + interval '4 minutes'
   where join_code  = v_code
     and status     = 'waiting'
     and player2_id is null
     and player1_id <> v_uid
  returning id into v_battle_id;

  if v_battle_id is null then
    -- Disambiguate the failure for a clearer client message.
    if exists (select 1 from public.battles where join_code = v_code and player1_id = v_uid) then
      raise exception 'cannot join your own battle' using errcode = 'P0001';
    elsif exists (select 1 from public.battles where join_code = v_code) then
      raise exception 'battle is no longer joinable' using errcode = 'P0002';
    else
      raise exception 'battle not found' using errcode = 'P0003';
    end if;
  end if;

  insert into public.battle_events (battle_id, type, payload)
  values (
    v_battle_id,
    'start',
    jsonb_build_object('player2_id', v_uid, 'timestamp', now(),
                       'end_time', (now() + interval '4 minutes'))
  );

  return v_battle_id;
end;
$$;

-- ----------------------------------------------------------------------------
-- apply_battle_action: append the action event and atomically add delta to the
-- ACTING player's own score. `for update` + `score = score + delta` removes the
-- read-modify-write race. Enforces participant, active status, and expiry.
-- Returns the acting player's new score.
-- ----------------------------------------------------------------------------
create or replace function public.apply_battle_action(
  p_battle_id uuid,
  p_action    text,
  p_delta     integer
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_battle public.battles%rowtype;
  v_new_score integer;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  if p_action not in ('buy', 'sell') then
    raise exception 'invalid action' using errcode = 'P0010';
  end if;

  select * into v_battle from public.battles where id = p_battle_id for update;
  if not found then
    raise exception 'battle not found' using errcode = 'P0003';
  end if;
  if v_uid <> v_battle.player1_id and v_uid <> coalesce(v_battle.player2_id, '00000000-0000-0000-0000-000000000000'::uuid) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if v_battle.status <> 'active' then
    raise exception 'battle not active' using errcode = 'P0011';
  end if;
  if v_battle.end_time is not null and now() > v_battle.end_time then
    raise exception 'battle has ended' using errcode = 'P0012';
  end if;

  insert into public.battle_events (battle_id, type, payload)
  values (
    p_battle_id,
    'player_action',
    jsonb_build_object('user_id', v_uid, 'action', p_action, 'delta', p_delta, 'timestamp', now())
  );

  if v_uid = v_battle.player1_id then
    update public.battles set player1_score = player1_score + p_delta
      where id = p_battle_id returning player1_score into v_new_score;
  else
    update public.battles set player2_score = player2_score + p_delta
      where id = p_battle_id returning player2_score into v_new_score;
  end if;

  return v_new_score;
end;
$$;

-- ----------------------------------------------------------------------------
-- end_battle: resolve the winner from final scores, award XP to both profiles,
-- and mark the battle ended. Idempotent: a second call returns the same result
-- without double-awarding XP.
-- ----------------------------------------------------------------------------
create or replace function public.end_battle(p_battle_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_battle public.battles%rowtype;
  v_winner uuid;
  v_p1_xp integer := 0;
  v_p2_xp integer := 0;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  select * into v_battle from public.battles where id = p_battle_id for update;
  if not found then
    raise exception 'battle not found' using errcode = 'P0003';
  end if;
  if v_uid <> v_battle.player1_id and v_uid <> coalesce(v_battle.player2_id, '00000000-0000-0000-0000-000000000000'::uuid) then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  v_winner := case
    when v_battle.player1_score > v_battle.player2_score then v_battle.player1_id
    when v_battle.player2_score > v_battle.player1_score then v_battle.player2_id
    else null
  end;

  -- Already resolved: return the same result, no further XP.
  if v_battle.status = 'ended' then
    return jsonb_build_object(
      'battleId', p_battle_id, 'status', 'ended', 'alreadyEnded', true,
      'player1_score', v_battle.player1_score, 'player2_score', v_battle.player2_score,
      'winner', v_winner
    );
  end if;

  if v_winner = v_battle.player1_id then
    v_p1_xp := 500; v_p2_xp := 100;
  elsif v_winner = v_battle.player2_id then
    v_p1_xp := 100; v_p2_xp := 500;
  else
    v_p1_xp := 250; v_p2_xp := 250; -- tie / no opponent
  end if;

  update public.profiles set xp = xp + v_p1_xp where id = v_battle.player1_id;
  if v_battle.player2_id is not null then
    update public.profiles set xp = xp + v_p2_xp where id = v_battle.player2_id;
  end if;

  update public.battles set status = 'ended', end_time = now() where id = p_battle_id;

  insert into public.battle_events (battle_id, type, payload)
  values (
    p_battle_id,
    'end',
    jsonb_build_object('winner', v_winner, 'player1_score', v_battle.player1_score,
                       'player2_score', v_battle.player2_score, 'timestamp', now())
  );

  return jsonb_build_object(
    'battleId', p_battle_id, 'status', 'ended', 'alreadyEnded', false,
    'player1_score', v_battle.player1_score, 'player2_score', v_battle.player2_score,
    'winner', v_winner
  );
end;
$$;

grant execute on function public.join_battle(text) to authenticated;
grant execute on function public.apply_battle_action(uuid, text, integer) to authenticated;
grant execute on function public.end_battle(uuid) to authenticated;
