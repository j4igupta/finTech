/**
 * Placeholder Edge Function for Flash‑Battle engine.
 * This function will be invoked for actions such as:
 *   - createBattle
 *   - joinBattle
 *   - playerAction
 *   - endBattle
 * It should insert rows into the `battles` and `battle_events` tables and
 * optionally publish realtime events.
 *
 * The implementation below is minimal – it validates the request, routes
 * to a stub handler, and returns a JSON response. Replace the TODOs with the
 * actual game logic (deterministic event timeline, scoring, etc.).
 */

export const handler = async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const { action, battleId, payload } = await req.json();

  // Simple routing based on action name
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

async function handleCreateBattle(payload: any) {
  // TODO: Insert a row into `battles` with initial state, return the new ID
  const newBattleId = 'placeholder-battle-id';
  // Insert a starting event for realtime listeners
  // await supabase.from('battle_events').insert({ battle_id: newBattleId, type: 'start', payload: {} });
  return new Response(JSON.stringify({ battleId: newBattleId }), { status: 200 });
}

async function handleJoinBattle(battleId: string, payload: any) {
  // TODO: Add the user to the battle (e.g., insert into a participants table)
  return new Response(JSON.stringify({ joined: true, battleId }), { status: 200 });
}

async function handlePlayerAction(battleId: string, payload: any) {
  // TODO: Validate action, compute its effect, insert a battle_event row
  // Example event: { type: 'player_action', payload: { userId, action, details } }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

async function handleEndBattle(battleId: string) {
  // TODO: Compute final scores, insert a final event, mark battle as completed
  return new Response(JSON.stringify({ ended: true, battleId }), { status: 200 });
}
