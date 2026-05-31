/**
 * Client-side wrapper for the Flash-Battle engine.
 * Talks to the Next.js API route at /api/battle/action and subscribes to
 * Supabase Realtime for the current battle.
 *
 * The server derives the acting user from cookies via supabase.auth.getUser()
 * (and the DB RPCs re-derive it via auth.uid()), so this wrapper does NOT accept
 * or send a userId. The browser client is the SSR browser client (from
 * `@/lib/supabase/client`) so the auth session cookie is in scope for realtime
 * subscriptions and RLS.
 *
 * Two realtime streams are tracked on one channel:
 *   - battle_events  (append-only log: start / player_action / end)
 *   - battles row    (authoritative scores + status, kept server-side)
 */

import { createClient } from './supabase/client';
import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';

export interface BattleEvent {
  type: string;
  payload: any;
}

export interface BattleState {
  id: string;
  player1_id: string;
  player2_id: string | null;
  player1_score: number;
  player2_score: number;
  status: string;
  start_time: string | null;
  end_time: string | null;
}

export class BattleEngine {
  private supabase: SupabaseClient = createClient();
  private channel: RealtimeChannel | null = null;
  private eventListeners: ((event: BattleEvent) => void)[] = [];
  private stateListeners: ((state: BattleState) => void)[] = [];
  private battleId: string | null = null;

  get id() {
    return this.battleId;
  }

  /** The current authenticated user's id (needed to know which player you are). */
  async getUserId(): Promise<string | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    return user?.id ?? null;
  }

  /** Register an event-log listener; returns an unsubscribe function. */
  onEvent(fn: (event: BattleEvent) => void): () => void {
    this.eventListeners.push(fn);
    return () => {
      this.eventListeners = this.eventListeners.filter((f) => f !== fn);
    };
  }

  /** Register an authoritative-state listener; returns an unsubscribe function. */
  onState(fn: (state: BattleState) => void): () => void {
    this.stateListeners.push(fn);
    return () => {
      this.stateListeners = this.stateListeners.filter((f) => f !== fn);
    };
  }

  /** Create a new battle and start listening. Returns the uuid + join code. */
  async createBattle(): Promise<{ battleId: string; joinCode: string } | null> {
    const data = await this.post({ action: 'createBattle' });
    if (!data?.battleId || !data?.joinCode) return null;
    await this.connect(data.battleId);
    return { battleId: data.battleId, joinCode: data.joinCode };
  }

  /** Join an existing battle by its short join code. Returns the uuid. */
  async joinBattle(joinCode: string): Promise<string | null> {
    const data = await this.post({
      action: 'joinBattle',
      payload: { joinCode: joinCode.trim().toUpperCase() },
    });
    if (!data?.joined || !data?.battleId) return null;
    await this.connect(data.battleId);
    return data.battleId;
  }

  async playerAction(action: 'buy' | 'sell', delta: number): Promise<boolean> {
    if (!this.battleId) {
      console.error('playerAction called with no active battle');
      return false;
    }
    const data = await this.post({
      action: 'playerAction',
      battleId: this.battleId,
      payload: { action, delta },
    });
    return !!data?.ok;
  }

  async endBattle(): Promise<{ winner: string | null } | null> {
    if (!this.battleId) return null;
    const data = await this.post({ action: 'endBattle', battleId: this.battleId });
    if (!data?.ended) return null;
    return { winner: data.winner ?? null };
  }

  /** Fetch the current authoritative battle row (e.g. on (re)connect). */
  async fetchState(): Promise<BattleState | null> {
    if (!this.battleId) return null;
    const { data, error } = await this.supabase
      .from('battles')
      .select('id, player1_id, player2_id, player1_score, player2_score, status, start_time, end_time')
      .eq('id', this.battleId)
      .maybeSingle();
    if (error || !data) return null;
    return data as BattleState;
  }

  async disconnect() {
    if (this.channel) {
      const status = await this.channel.unsubscribe();
      if (status !== 'ok') console.error('Realtime unsubscribe error', status);
      this.supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.battleId = null;
  }

  private async connect(battleId: string) {
    await this.disconnect();
    this.battleId = battleId;
    this.channel = this.supabase.channel(`battle_${battleId}`);

    // Append-only event log.
    this.channel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'battle_events', filter: `battle_id=eq.${battleId}` },
      (payload) => {
        const event = payload.new as BattleEvent;
        this.eventListeners.forEach((fn) => fn(event));
      }
    );

    // Authoritative battle-row updates (scores, status transitions).
    this.channel.on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'battles', filter: `id=eq.${battleId}` },
      (payload) => {
        const state = payload.new as BattleState;
        this.stateListeners.forEach((fn) => fn(state));
      }
    );

    this.channel.subscribe((status) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.error('Realtime subscribe error', status);
      }
    });

    // Seed listeners with the current state immediately.
    const initial = await this.fetchState();
    if (initial) this.stateListeners.forEach((fn) => fn(initial));
  }

  private async post(body: any): Promise<any | null> {
    const res = await fetch('/api/battle/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      let message = `Battle action failed (${res.status})`;
      try {
        const err = await res.json();
        if (err?.error) message = err.error;
      } catch {
        /* non-JSON error body */
      }
      const error = new Error(message);
      (error as Error & { status?: number }).status = res.status;
      throw error;
    }
    return res.json();
  }
}
