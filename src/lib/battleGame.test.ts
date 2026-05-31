import { describe, it, expect } from 'vitest';
import {
  priceAtTick,
  tickFor,
  applyTrade,
  winnerOf,
  BASE_PRICE,
  TICK_MS,
} from './battleGame';

describe('priceAtTick', () => {
  it('starts at the base price at tick 0', () => {
    expect(priceAtTick('battle-abc', 0)).toBe(BASE_PRICE);
  });

  it('is deterministic for a given battle id + tick', () => {
    expect(priceAtTick('battle-abc', 10)).toBe(priceAtTick('battle-abc', 10));
  });

  it('produces different series for different battle ids', () => {
    expect(priceAtTick('battle-abc', 20)).not.toBe(priceAtTick('battle-xyz', 20));
  });

  it('never goes to zero or below', () => {
    for (let t = 0; t < 300; t++) {
      expect(priceAtTick('battle-floor', t)).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('tickFor', () => {
  it('is 0 at the start', () => {
    expect(tickFor(1000, 1000)).toBe(0);
  });
  it('advances one tick per TICK_MS', () => {
    expect(tickFor(0, TICK_MS * 5)).toBe(5);
  });
  it('never goes negative', () => {
    expect(tickFor(5000, 1000)).toBe(0);
  });
});

describe('applyTrade', () => {
  it('opening from flat realizes no P&L and sets the position', () => {
    const r = applyTrade({ position: 0, entryPrice: BASE_PRICE }, 'buy', 105);
    expect(r.delta).toBe(0);
    expect(r.position).toBe(1);
    expect(r.entryPrice).toBe(105);
  });

  it('closing a long at a higher price is a positive delta', () => {
    // long opened at 100, now flipping at 110 -> +10 * scale
    const r = applyTrade({ position: 1, entryPrice: 100 }, 'sell', 110);
    expect(r.delta).toBeGreaterThan(0);
    expect(r.position).toBe(-1);
  });

  it('closing a long at a lower price is a negative delta', () => {
    const r = applyTrade({ position: 1, entryPrice: 100 }, 'sell', 90);
    expect(r.delta).toBeLessThan(0);
  });

  it('a short profits when price falls', () => {
    const r = applyTrade({ position: -1, entryPrice: 100 }, 'buy', 90);
    expect(r.delta).toBeGreaterThan(0);
  });
});

describe('winnerOf', () => {
  it('returns player1 when ahead', () => {
    expect(winnerOf('p1', 'p2', 30, 10)).toBe('p1');
  });
  it('returns player2 when ahead', () => {
    expect(winnerOf('p1', 'p2', 5, 50)).toBe('p2');
  });
  it('returns null on a tie', () => {
    expect(winnerOf('p1', 'p2', 20, 20)).toBeNull();
  });
  it('returns null when there is no opponent', () => {
    expect(winnerOf('p1', null, 100, 0)).toBeNull();
  });
});
