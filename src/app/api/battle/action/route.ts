import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const { action, battleId, payload } = await req.json();

  switch (action) {
    case 'createBattle':
      return handleCreateBattle(payload);
    case 'joinBattle':
      return handleJoinBattle(battleId, payload);
    case 'playerAction':
      return handlePlayerAction(battleId, payload);
    case 'endBattle':
      return handleEndBattle(battleId);
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}

const JOIN_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function generateJoinCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += JOIN_CODE_ALPHABET[Math.floor(Math.random() * JOIN_CODE_ALPHABET.length)];
  }
  return code;
}

async function handleCreateBattle(payload: any) {
  const userId = payload?.userId;
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  // Insert with a fresh join_code; retry on the (unlikely) unique-violation collision.
  let battle: { id: string; join_code: string } | null = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateJoinCode();
    const { data, error } = await supabaseAdmin
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

  await supabaseAdmin.from('battle_events').insert({
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
  await supabaseAdmin.from('battle_events').insert(events);

  const endTime = new Date(now + 4 * 60_000).toISOString();
  await supabaseAdmin
    .from('battles')
    .update({ status: 'active', start_time: new Date().toISOString(), end_time: endTime })
    .eq('id', newBattleId);

  return NextResponse.json({ battleId: newBattleId, joinCode }, { status: 200 });
}

async function handleJoinBattle(_battleId: string, payload: any) {
  const userId = payload?.userId;
  const joinCode = typeof payload?.joinCode === 'string' ? payload.joinCode.toUpperCase() : null;
  if (!joinCode || !userId) {
    return NextResponse.json({ error: 'Missing joinCode or userId' }, { status: 400 });
  }

  const { data: battle, error: fetchErr } = await supabaseAdmin
    .from('battles')
    .select('id, player2_id')
    .eq('join_code', joinCode)
    .single();

  if (fetchErr) {
    return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
  }

  if (battle.player2_id) {
    return NextResponse.json({ error: 'Battle already full' }, { status: 400 });
  }

  await supabaseAdmin
    .from('battles')
    .update({ player2_id: userId })
    .eq('id', battle.id);

  return NextResponse.json({ joined: true, battleId: battle.id }, { status: 200 });
}

async function handlePlayerAction(battleId: string, payload: any) {
  const userId = payload?.userId;
  const action = payload?.action;
  const delta = payload?.delta ?? 0;

  if (!battleId || !userId || !action) {
    return NextResponse.json({ error: 'Missing battleId, userId or action' }, { status: 400 });
  }

  if (!['buy', 'sell'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
  }

  await supabaseAdmin.from('battle_events').insert({
    battle_id: battleId,
    type: 'player_action',
    payload: { user_id: userId, action, delta },
  });

  const scoreColumn = action === 'buy' ? 'player1_score' : 'player2_score';
  const { data: current } = await supabaseAdmin
    .from('battles')
    .select(scoreColumn)
    .eq('id', battleId)
    .single();

  const currentScore = (current as Record<string, number> | null)?.[scoreColumn] ?? 0;

  await supabaseAdmin
    .from('battles')
    .update({ [scoreColumn]: currentScore + delta })
    .eq('id', battleId);

  return NextResponse.json({ ok: true, action, delta }, { status: 200 });
}

async function handleEndBattle(battleId: string) {
  const { data: battle, error: fetchErr } = await supabaseAdmin
    .from('battles')
    .select('player1_score, player2_score, status')
    .eq('id', battleId)
    .single();

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 404 });
  }

  if (battle.status !== 'active') {
    return NextResponse.json({ error: 'Battle is not active' }, { status: 400 });
  }

  const player1Score = battle.player1_score ?? 0;
  const player2Score = battle.player2_score ?? 0;

  const endTime = new Date().toISOString();
  await supabaseAdmin.from('battle_events').insert({
    battle_id: battleId,
    type: 'end',
    payload: {
      winner: null,
      player1_score: player1Score,
      player2_score: player2Score,
      timestamp: endTime,
    },
  });

  await supabaseAdmin
    .from('battles')
    .update({ status: 'ended', end_time: endTime })
    .eq('id', battleId);

  return NextResponse.json(
    { ended: true, battleId, scores: { player1_score: player1Score, player2_score: player2Score } },
    { status: 200 }
  );
}
