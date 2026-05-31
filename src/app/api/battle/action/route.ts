import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Body shape for /api/battle/action.
 *
 * Notably, there is NO `userId` field — the server derives the authenticated
 * user from the request cookies via supabase.auth.getUser(), and the database
 * RPCs re-derive it via auth.uid(). Anything the client claims about its own
 * identity is ignored.
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
  // request body. The RPCs gate DB access via auth.uid(), but we also fail fast
  // at the edge with a clean 401 when there's no session.
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
      return handleJoinBattle(supabase, body.payload);
    case 'playerAction':
      return handlePlayerAction(supabase, body.battleId, body.payload);
    case 'endBattle':
      return handleEndBattle(supabase, body.battleId);
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}

type AuthedSupabase = Awaited<ReturnType<typeof createClient>>;

/** Map a Postgres/RPC error (SQLSTATE in `code`) to an HTTP status + message. */
function rpcError(error: { code?: string; message?: string }): NextResponse {
  const map: Record<string, number> = {
    '28000': 401, // not authenticated
    '42501': 403, // forbidden (not a participant)
    P0001: 400, // cannot join your own battle
    P0002: 409, // battle no longer joinable / already full
    P0003: 404, // battle not found
    P0010: 400, // invalid action
    P0011: 409, // battle not active
    P0012: 409, // battle has ended
  };
  const status = (error.code && map[error.code]) || 500;
  return NextResponse.json({ error: error.message ?? 'Battle action failed' }, { status });
}

const JOIN_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function generateJoinCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += JOIN_CODE_ALPHABET[Math.floor(Math.random() * JOIN_CODE_ALPHABET.length)];
  }
  return code;
}

async function handleCreateBattle(supabase: AuthedSupabase, userId: string) {
  // Insert with a fresh join_code; retry on the (unlikely) unique-violation
  // collision. The battle starts in 'waiting' (the column default) and only
  // becomes 'active' when an opponent joins via the join_battle RPC — that
  // transition is what lets the open-lobby RLS policy expose it to a joiner.
  let battle: { id: string; join_code: string } | null = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateJoinCode();
    const { data, error } = await supabase
      .from('battles')
      .insert({ player1_id: userId, join_code: candidate, status: 'waiting' })
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

  return NextResponse.json({ battleId: battle.id, joinCode: battle.join_code }, { status: 200 });
}

async function handleJoinBattle(
  supabase: AuthedSupabase,
  payload: { joinCode?: string } | undefined
) {
  const joinCode = typeof payload?.joinCode === 'string' ? payload.joinCode.trim() : '';
  if (!joinCode) {
    return NextResponse.json({ error: 'Missing joinCode' }, { status: 400 });
  }

  // Atomic claim of the open lobby. The RPC self-authorizes via auth.uid() and
  // performs the waiting->active transition in a single UPDATE, so two racing
  // joiners cannot both succeed.
  const { data, error } = await supabase.rpc('join_battle', { p_join_code: joinCode });
  if (error) {
    return rpcError(error);
  }

  return NextResponse.json({ joined: true, battleId: data as string }, { status: 200 });
}

async function handlePlayerAction(
  supabase: AuthedSupabase,
  battleId: string | undefined,
  payload: { action?: 'buy' | 'sell'; delta?: number } | undefined
) {
  const action = payload?.action;
  const delta = Math.trunc(payload?.delta ?? 0);

  if (!battleId || !action) {
    return NextResponse.json({ error: 'Missing battleId or action' }, { status: 400 });
  }
  if (!['buy', 'sell'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
  }
  if (!Number.isFinite(delta) || Math.abs(delta) > 1_000_000) {
    return NextResponse.json({ error: 'Invalid delta' }, { status: 400 });
  }

  // The RPC verifies participant + active + not-expired, and atomically adds
  // delta to the ACTING player's own score (so you can never score for your
  // opponent, and concurrent actions don't clobber each other).
  const { data, error } = await supabase.rpc('apply_battle_action', {
    p_battle_id: battleId,
    p_action: action,
    p_delta: delta,
  });
  if (error) {
    return rpcError(error);
  }

  return NextResponse.json({ ok: true, action, delta, score: data as number }, { status: 200 });
}

async function handleEndBattle(supabase: AuthedSupabase, battleId: string | undefined) {
  if (!battleId) {
    return NextResponse.json({ error: 'Missing battleId' }, { status: 400 });
  }

  // The RPC resolves the winner, awards XP to both profiles, and marks the
  // battle ended — idempotently, so a double-call won't double-award.
  const { data, error } = await supabase.rpc('end_battle', { p_battle_id: battleId });
  if (error) {
    return rpcError(error);
  }

  const result = data as {
    player1_score: number;
    player2_score: number;
    winner: string | null;
  };
  return NextResponse.json(
    {
      ended: true,
      battleId,
      winner: result.winner,
      scores: { player1_score: result.player1_score, player2_score: result.player2_score },
    },
    { status: 200 }
  );
}
