import { supabaseAdmin } from '../../src/lib/supabaseAdmin';

/**
 * Edge Function for Flash‑Battle engine.
 * Handles create, join, player actions, and ending battles.
 */
export const handler = async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const { action, battleId, payload } = await req.json();

  switch (action) {
    case 'createBattle':
      return await handleCreateBattle(payload);
    case 'joinBattle':
      return await handleJoinBattle(battleId, payload);
    case 'playerAction':
      return await handlePlayerAction(battleId, payload);
    case 'endBattle':
      return await handleEndBattle(battleId);
    default:
      return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
  }
};

/** Create a new battle, insert start event and deterministic price updates */
async function handleCreateBattle(payload: any) {
  const userId = payload?.userId;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400 });
  }

  // Insert battle row (status = waiting initially, creator is player1)
  const { data: battle, error: insertErr } = await supabaseAdmin
    .from('battles')
    .insert({ player1_id: userId })
    .select()
    .single();

  if (insertErr) {
    return new Response(JSON.stringify({ error: insertErr.message }), { status: 500 });
  }

  const newBattleId = battle.id as string;

  // Insert a start event
  await supabaseAdmin.from('battle_events').insert({
    battle_id: newBattleId,
    type: 'start',
    payload: { timestamp: new Date().toISOString() },
  });

  // Deterministic price‑update events (3 events, 60 s apart)
  const now = Date.now();
  const events = [];
  for (let i = 1; i <= 3; i++) {
    const eventTime = new Date(now + i * 60_000);
    events.push({
      battle_id: newBattleId,
      type: 'price_update',
      payload: {
        price: 100 + i * 5, // simple deterministic price curve
        timestamp: eventTime.toISOString(),
      },
    });
  }
  await supabaseAdmin.from('battle_events').insert(events);

  // Mark battle as active and set its end_time (after last event)
  const endTime = new Date(now + 4 * 60_000);
  await supabaseAdmin
    .from('battles')
    .update({ status: 'active', start_time: new Date(), end_time: endTime })
    .eq('id', newBattleId);

  return new Response(JSON.stringify({ battleId: newBattleId }), { status: 200 });
}

/** Join an existing battle as player2 */
async function handleJoinBattle(battleId: string, payload: any) {
  const userId = payload?.userId;
  if (!battleId || !userId) {
    return new Response(JSON.stringify({ error: 'Missing battleId or userId' }), { status: 400 });
  }

  // Fetch battle to check if it exists and is still joinable
  const { data: battle, error: fetchErr } = await supabaseAdmin
    .from('battles')
    .select('id, player2_id')
    .eq('id', battleId)
    .single();

  if (fetchErr) {
    return new Response(JSON.stringify({ error: fetchErr.message }), { status: 404 });
  }

  // If battle already full, reject
  if (battle.player2_id) {
    return new Response(JSON.stringify({ error: 'Battle already full' }), { status: 400 });
  }

  // Add player2 to the battle
  await supabaseAdmin
    .from('battles')
    .update({ player2_id: userId })
    .eq('id', battleId);

  return new Response(JSON.stringify({ joined: true, battleId }), { status: 200 });
}

/** Handle player action (buy / sell) */
async function handlePlayerAction(battleId: string, payload: any) {
  const userId = payload?.userId;
  const action = payload?.action; // expected: 'buy' or 'sell'
  const delta = payload?.delta ?? 0; // numeric change to portfolio score

  if (!battleId || !userId || !action) {
    return new Response(JSON.stringify({ error: 'Missing battleId, userId or action' }), { status: 400 });
  }

  // Validate action type
  if (!['buy', 'sell'].includes(action)) {
    return new Response(JSON.stringify({ error: 'Invalid action type' }), { status: 400 });
  }

  // Insert a player_action event
  await supabaseAdmin.from('battle_events').insert({
    battle_id: battleId,
    type: 'player_action',
    payload: {
      user_id: userId,
      action: action,
      delta: delta,
    },
  });

  // Update the appropriate player's score column on battles table
  const scoreColumn = action === 'buy' ? 'player1_score' : 'player2_score';
  await supabaseAdmin
    .from('battles')
    .update({ [scoreColumn]: (await supabaseAdmin.from('battles').select(scoreColumn).eq('id', battleId).single<{ [scoreColumn]?: number }>().data)?.[scoreColumn] ?? 0 } + delta)
    .eq('id', battleId);

  return new Response(JSON.stringify({ ok: true, action, delta }), { status: 200 });
}

/** End the battle, compute final scores, insert final event */
async function handleEndBattle(battleId: string) {
  // Fetch battle row
  const { data: battle, error: fetchErr } = await supabaseAdmin
    .from('battles')
    .select('player1_score, player2_score, status')
    .eq('id', battleId)
    .single();

  if (fetchErr) {
    return new Response(JSON.stringify({ error: fetchErr.message }), { status: 404 });
  }

  if (battle.status !== 'active') {
    return new Response(JSON.stringify({ error: 'Battle is not active' }), { status: 400 });
  }

  // Determine final scores
  const player1Score = battle.player1_score ?? 0;
  const player2Score = battle.player2_score ?? 0;

  // Insert final event with scores
  const endTime = new Date().toISOString();
  await supabaseAdmin.from('battle_events').insert({
    battle_id: battleId,
    type: 'end',
    payload: {
      winner: null, // could be determined by comparing scores
      player1_score: player1Score,
      player2_score: player2_score,
      timestamp: endTime,
    },
  });

  // Mark battle as completed
  await supabaseAdmin
    .from('battles')
    .update({ status: 'ended', end_time: endTime })
    .eq('id', battleId);

  return new Response(JSON.stringify({ ended: true, battleId, scores: { player1_score: player1Score, player2_score: player2_score } }), { status: 200 });
}