import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Body shape for /api/battle/action.
 *
 * Notably, there is NO `userId` field — the server derives the authenticated
 * user from the request cookies via supabase.auth.getUser(). Anything the
 * client claims about its own identity is ignored.
 */
type BattleActionBody =
  | { action: 'createBattle'; battleId?: string; payload?: Record<string, unknown> }
  | {
      action: 'joinBattle';
      battleId?: string;
      payload?: { joinCode?: string } & Record<string, unknown>;
    }
  | {
      action: 'playerAction';
      battleId: string;
      payload?: { action?: 'buy' | 'sell'; delta?: number } & Record<string, unknown>;
    }
  | { action: 'endBattle'; battleId: string; payload?: Record<string, unknown> };

export async function POST(req: Request) {
  // Server-side auth check: derive user identity from cookies, never from the
  // request body. RLS (Box 2) gates DB access, but we also fail fast at the
  // edge with a clean 401 when there's no session.
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: BattleActionBody;
  try {
    body = (await req.json()) as BattleActionBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body || typeof (body as { action?: unknown }).action !== 'string') {
    return NextResponse.json({ error: 'Missing action' }, { status: 400 });
  }

  switch (body.action) {
    case 'createBattle':
      return handleCreateBattle(supabase, user.id);
    case 'joinBattle':
      return handleJoinBattle(supabase, user.id, body.payload);
    case 'playerAction':
      return handlePlayerAction(supabase, user.id, body.battleId, body.payload);
    case 'endBattle':
      return handleEndBattle(supabase, user.id, body.battleId);
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}

type AuthedSupabase = Awaited<ReturnType<typeof createClient>>;

const JOIN_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function generateJoinCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += JOIN_CODE_ALPHABET[Math.floor(Math.random() * JOIN_CODE_ALPHABET.length)];
  }
  return code;
}

async function handleCreateBattle(supabase: AuthedSupabase, userId: string) {
  // Insert with a fresh join_code; retry on the (unlikely) unique-violation collision.
  let battle: { id: string; join_code: string } | null = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateJoinCode();
    const { data, error } = await supabase
      .from('battles')
      .insert({ player1_id: userId, join_code: candidate })
      .select('id, join_code')
      .single();

    if (!error) {
      battle = data as { id: string; join_code: string };
      break;
    }
    if (error.code !== '23505') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  if (!battle) {
    return NextResponse.json({ error: 'Could not allocate join code' }, { status: 500 });
  }

  const newBattleId = battle.id;
  const joinCode = battle.join_code;

  await supabase.from('battle_events').insert({
    battle_id: newBattleId,
    type: 'start',
    payload: { timestamp: new Date().toISOString() },
  });

  const now = Date.now();
  const events = [];
  for (let i = 1; i <= 3; i++) {
    const eventTime = new Date(now + i * 60_000);
    events.push({
      battle_id: newBattleId,
      type: 'price_update',
      payload: {
        price: 100 + i * 5,
        timestamp: eventTime.toISOString(),
      },
    });
  }
  await supabase.from('battle_events').insert(events);

  const endTime = new Date(now + 4 * 60_000).toISOString();
  await supabase
    .from('battles')
    .update({ status: 'active', start_time: new Date().toISOString(), end_time: endTime })
    .eq('id', newBattleId);

  return NextResponse.json({ battleId: newBattleId, joinCode }, { status: 200 });
}

async function handleJoinBattle(
  supabase: AuthedSupabase,
  userId: string,
  payload: { joinCode?: string } | undefined
) {
  const joinCode =
    typeof payload?.joinCode === 'string' ? payload.joinCode.toUpperCase() : null;
  if (!joinCode) {
    return NextResponse.json({ error: 'Missing joinCode' }, { status: 400 });
  }

  // Find the open lobby via the per-request authenticated client. RLS policy
  // `battles_select_open_lobby` lets ANY signed-in user see a battle whose
  // status='waiting' AND player2_id IS NULL — even though they are not yet a
  // player on it. That's the entire point of the policy.
  const { data: battle, error: fetchErr } = await supabase
    .from('battles')
    .select('id, player1_id, player2_id, status')
    .eq('join_code', joinCode)
    .maybeSingle();

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }
  if (!battle) {
    return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
  }
  if (battle.player2_id) {
    return NextResponse.json({ error: 'Battle already full' }, { status: 400 });
  }
  if (battle.player1_id === userId) {
    return NextResponse.json({ error: 'Cannot join your own battle' }, { status: 400 });
  }
  if (battle.status !== 'active') {
    return NextResponse.json({ error: 'battle is no longer joinable' }, { status: 409 });
  }

  // Use a service-role client for this specific transition since the RLS policy
  // `battles_update_participant` only permits updates when auth.uid() is already
  // player1_id or player2_id. The joiner is neither yet. We've already verified
  // the caller's identity via getUser() above.
  const { supabaseAdmin } = await import('@/lib/supabaseAdmin');
  const { error: updateErr } = await supabaseAdmin
    .from('battles')
    .update({ player2_id: userId })
    .eq('id', battle.id)
    .eq('status', 'active')
    .is('player2_id', null);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ joined: true, battleId: battle.id }, { status: 200 });
}

async function handlePlayerAction(
  supabase: AuthedSupabase,
  userId: string,
  battleId: string | undefined,
  payload: { action?: 'buy' | 'sell'; delta?: number } | undefined
) {
  const action = payload?.action;
  const delta = payload?.delta ?? 0;

  if (!battleId || !action) {
    return NextResponse.json({ error: 'Missing battleId or action' }, { status: 400 });
  }
  if (!['buy', 'sell'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
  }

  // Defense in depth: confirm the caller is a player on this battle and the
  // battle is active. With RLS this is mostly redundant on the read, but the
  // explicit guard lets us return 403 instead of a silent zero-rows update.
  const { data: battleRow, error: lookupErr } = await supabase
    .from('battles')
    .select('id, player1_id, player2_id, status')
    .eq('id', battleId)
    .maybeSingle();

  if (lookupErr) {
    return NextResponse.json({ error: lookupErr.message }, { status: 500 });
  }
  if (!battleRow) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  if (battleRow.player1_id !== userId && battleRow.player2_id !== userId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  if (battleRow.status !== 'active') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  await supabase.from('battle_events').insert({
    battle_id: battleId,
    type: 'player_action',
    payload: { user_id: userId, action, delta },
  });

  const scoreColumn = action === 'buy' ? 'player1_score' : 'player2_score';
  const { data: current } = await supabase
    .from('battles')
    .select(scoreColumn)
    .eq('id', battleId)
    .single();

  const currentScore = (current as Record<string, number> | null)?.[scoreColumn] ?? 0;

  await supabase
    .from('battles')
    .update({ [scoreColumn]: currentScore + delta })
    .eq('id', battleId);

  return NextResponse.json({ ok: true, action, delta }, { status: 200 });
}

async function handleEndBattle(
  supabase: AuthedSupabase,
  userId: string,
  battleId: string | undefined
) {
  if (!battleId) {
    return NextResponse.json({ error: 'Missing battleId' }, { status: 400 });
  }

  const { data: battle, error: fetchErr } = await supabase
    .from('battles')
    .select('player1_id, player2_id, player1_score, player2_score, status')
    .eq('id', battleId)
    .maybeSingle();

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }
  if (!battle) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  if (battle.player1_id !== userId && battle.player2_id !== userId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  if (battle.status !== 'active') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const player1Score = battle.player1_score ?? 0;
  const player2Score = battle.player2_score ?? 0;

  const endTime = new Date().toISOString();
  await supabase.from('battle_events').insert({
    battle_id: battleId,
    type: 'end',
    payload: {
      winner: null,
      player1_score: player1Score,
      player2_score: player2Score,
      timestamp: endTime,
    },
  });

  await supabase
    .from('battles')
    .update({ status: 'ended', end_time: endTime })
    .eq('id', battleId);

  return NextResponse.json(
    { ended: true, battleId, scores: { player1_score: player1Score, player2_score: player2Score } },
    { status: 200 }
  );
}
