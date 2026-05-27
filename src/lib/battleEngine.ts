/**
 * Client-side wrapper for the Flash-Battle engine.
 * Talks to the Next.js API route at /api/battle/action and subscribes to
 * Supabase Realtime for events belonging to the current battle.
 *
 * The server derives the acting user from cookies via supabase.auth.getUser(),
 * so this wrapper does NOT accept or send a userId. The browser client is the
 * SSR browser client (from `@/lib/supabase/client`) so the auth session cookie
 * is in scope for realtime subscriptions.
 */

import { createClient } from './supabase/client';
import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';

export interface BattleEvent {
  type: string;
  payload: any;
}

export class BattleEngine {
  private supabase: SupabaseClient = createClient();
  private channel: RealtimeChannel | null = null;
  private listeners: ((event: BattleEvent) => void)[] = [];
  private battleId: string | null = null;

  get id() {
    return this.battleId;
  }

  /** Register a listener; returns an unsubscribe function. */
  onEvent(fn: (event: BattleEvent) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((f) => f !== fn);
    };
  }

  /** Create a new battle and start listening to its events. Returns the real
   *  uuid + the short join code to share with another player. */
  async createBattle(): Promise<{ battleId: string; joinCode: string } | null> {
    const data = await this.post({ action: 'createBattle' });
    if (!data?.battleId || !data?.joinCode) return null;
    await this.connect(data.battleId);
    return { battleId: data.battleId, joinCode: data.joinCode };
  }

  /** Join an existing battle by its short join code. Returns the real uuid. */
  async joinBattle(joinCode: string): Promise<string | null> {
    const data = await this.post({
      action: 'joinBattle',
      payload: { joinCode: joinCode.toUpperCase() },
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

  async endBattle(): Promise<boolean> {
    if (!this.battleId) return false;
    const data = await this.post({ action: 'endBattle', battleId: this.battleId });
    return !!data?.ended;
  }

  async disconnect() {
    if (this.channel) {
      const status = await this.channel.unsubscribe();
      if (status !== 'ok') console.error('Realtime unsubscribe error', status);
      this.channel = null;
    }
    this.battleId = null;
  }

  private async connect(battleId: string) {
    if (this.channel) {
      await this.channel.unsubscribe();
      this.channel = null;
    }
    this.battleId = battleId;
    this.channel = this.supabase.channel(`public:battle_events_${battleId}`);
    this.channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'battle_events',
        filter: `battle_id=eq.${battleId}`,
      },
      (payload) => {
        const event = payload.new as BattleEvent;
        this.listeners.forEach((fn) => fn(event));
      }
    );
    this.channel.subscribe((status) => {
      if (status === 'CHANNEL_ERROR') console.error('Realtime subscribe error', status);
    });
  }

  private async post(body: any): Promise<any | null> {
    const res = await fetch('/api/battle/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error('Failed to send battle action', await res.text());
      return null;
    }
    return res.json();
  }
}
