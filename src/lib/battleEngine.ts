/**
 * Minimal client‑side wrapper for the Flash‑Battle engine.
 * It uses Supabase Realtime to listen to battle events and expose a simple API
 * for starting a battle, joining a battle, and sending player actions.
 *
 * The actual game logic (event generation, scoring, etc.) will live in a
 * Supabase Edge Function (`supabase/functions/battle_engine.ts`). This file
 * only deals with the real‑time channel and local state management.
 */

import { supabase } from './supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface BattleEvent {
  type: string; // e.g. "start", "price_update", "player_action", "end"
  payload: any;
}

export class BattleEngine {
  private channel: RealtimeChannel | null = null;
  private listeners: ((event: BattleEvent) => void)[] = [];

  constructor(private battleId: string) {}

  /** Connect to the realtime channel for this battle */
  async connect() {
    this.channel = supabase.channel(`public:battle_events_${this.battleId}`);
    this.channel.on('postgres_changes', { event: '*', schema: 'public', table: 'battle_events' }, (payload) => {
      const event: BattleEvent = payload.new as any; // new row contains the event data
      this.listeners.forEach((fn) => fn(event));
    });
    this.channel.subscribe((status) => {
      if (status === 'CHANNEL_ERROR') console.error('Realtime subscribe error', status);
    });
  }

  /** Disconnect from the channel */
  async disconnect() {
    if (this.channel) {
      const status = await this.channel.unsubscribe();
      if (status !== 'ok') console.error('Realtime unsubscribe error', status);
      this.channel = null;
    }
  }

  /** Register a listener for battle events */
  onEvent(fn: (event: BattleEvent) => void) {
    this.listeners.push(fn);
  }

  /** Send a player action to the server edge function */
  async sendAction(action: string, payload: any) {
    const res = await fetch('/api/battle/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ battleId: this.battleId, action, payload }),
    });
    if (!res.ok) {
      console.error('Failed to send battle action', await res.text());
    }
  }
}
