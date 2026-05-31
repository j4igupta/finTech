/**
 * Pure game logic for the Flash Battle trading duel. No I/O — every function
 * here is deterministic and unit-tested (see battleGame.test.ts), which is what
 * lets both players compute an identical, fair price series client-side without
 * extra realtime infrastructure, and lets the server stay the score authority.
 */

export const BASE_PRICE = 100;
export const TICK_MS = 1000; // the price advances once per second
export const DELTA_SCALE = 10; // P&L is scaled to satisfying integer points

// --- deterministic PRNG (mulberry32 seeded by a hash of the battle id) -------
function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Price at a 0-based tick index. Deterministic for a given battle id. */
export function priceAtTick(battleId: string, tick: number): number {
  const rng = mulberry32(hashSeed(battleId));
  let price = BASE_PRICE;
  for (let i = 0; i < Math.max(0, tick); i++) {
    price = Math.max(1, price + (rng() - 0.5) * 4); // ±~2 / tick, floored at 1
  }
  return Math.round(price * 100) / 100;
}

/** Tick index for a wall-clock time relative to the battle start. */
export function tickFor(startTimeMs: number, nowMs: number): number {
  return Math.max(0, Math.floor((nowMs - startTimeMs) / TICK_MS));
}

export function priceAt(battleId: string, startTimeMs: number, nowMs: number): number {
  return priceAtTick(battleId, tickFor(startTimeMs, nowMs));
}

/** A bounded recent price series for charting. */
export function priceSeries(
  battleId: string,
  startTimeMs: number,
  nowMs: number,
  maxPoints = 40
): { tick: number; price: number }[] {
  const current = tickFor(startTimeMs, nowMs);
  const from = Math.max(0, current - maxPoints + 1);
  const out: { tick: number; price: number }[] = [];
  for (let t = from; t <= current; t++) out.push({ tick: t, price: priceAtTick(battleId, t) });
  return out;
}

// --- trading position / P&L --------------------------------------------------
export type Position = 1 | 0 | -1; // long / flat / short

export interface TradeState {
  position: Position;
  entryPrice: number;
}

export interface TradeResult extends TradeState {
  /** Realized P&L from this action, scaled to integer points (for the score). */
  delta: number;
}

/**
 * Apply a buy/sell. The action sets the desired direction (buy = long,
 * sell = short); any opposite open position is first realized into P&L.
 * Returns the realized integer delta plus the new position/entry.
 */
export function applyTrade(
  state: TradeState,
  action: 'buy' | 'sell',
  currentPrice: number
): TradeResult {
  const target: Position = action === 'buy' ? 1 : -1;

  // Realize P&L on the currently open position at the current price.
  const realized = state.position === 0 ? 0 : state.position * (currentPrice - state.entryPrice);
  const delta = Math.round(realized * DELTA_SCALE);

  // Open the new position at the current price.
  return { delta, position: target, entryPrice: currentPrice };
}

/** Resolve the winner id from final scores. Null on a tie or no opponent. */
export function winnerOf(
  player1Id: string,
  player2Id: string | null,
  player1Score: number,
  player2Score: number
): string | null {
  if (player2Id == null) return null;
  if (player1Score > player2Score) return player1Id;
  if (player2Score > player1Score) return player2Id;
  return null;
}
