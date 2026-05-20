'use client';

import { useState, useEffect } from 'react';
import { BattleEngine } from '@/lib/battleEngine';
import { formatCountdown } from '@/lib/utils';
import { playSound } from '@/lib/sound';

type TimelineEvent = { type: string; payload: any; timestamp: string };

export function BattleArena() {
  const [engine] = useState(() => new BattleEngine());
  const [battleId, setBattleId] = useState<string | null>(null);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [joinInput, setJoinInput] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [countdown, setCountdown] = useState('No active battle');

  useEffect(() => {
    const unsub = engine.onEvent((evt) => {
      const ts = evt.payload?.timestamp ?? new Date().toISOString();
      setEvents((prev) => [
        ...prev,
        { type: evt.type, payload: evt.payload, timestamp: new Date(ts).toISOString() },
      ]);

      if (evt.type === 'player_action') playSound('battle_action');
      else if (evt.type === 'end') playSound('battle_end');
      else if (evt.type === 'start') playSound('battle_start');
    });

    return () => {
      unsub();
      engine.disconnect();
    };
  }, [engine]);

  useEffect(() => {
    const tick = () => {
      if (!battleId) {
        setCountdown('No active battle');
        return;
      }
      const next = events
        .slice()
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .find((e) => new Date(e.timestamp) > new Date());

      if (next) {
        setCountdown(formatCountdown(new Date(next.timestamp).getTime() - Date.now()));
      } else {
        setCountdown('No upcoming events');
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [events, battleId]);

  const handleCreate = async () => {
    const result = await engine.createBattle('user1');
    if (result) {
      setEvents([]);
      setBattleId(result.battleId);
      setShareCode(result.joinCode);
      setJoinError(null);
    }
  };

  const handleJoin = async () => {
    const code = joinInput.trim().toUpperCase();
    if (!code) return;
    const id = await engine.joinBattle(code, 'user2');
    if (id) {
      setEvents([]);
      setBattleId(id);
      setShareCode(code);
      setJoinError(null);
    } else {
      setJoinError('Could not join — check the code and try again.');
    }
  };

  const handleAction = async (action: 'buy' | 'sell') => {
    await engine.playerAction('user1', action, action === 'buy' ? 10 : -5);
  };

  const inBattle = battleId !== null;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md max-w-md mx-auto">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex gap-2">
          <button
            onClick={handleCreate}
            disabled={inBattle}
            className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
          >
            Create Battle
          </button>
          <button
            onClick={() => handleAction('buy')}
            disabled={!inBattle}
            className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
          >
            Buy
          </button>
          <button
            onClick={() => handleAction('sell')}
            disabled={!inBattle}
            className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
          >
            Sell
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={joinInput}
            onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
            placeholder="Join code (e.g. AB23CD)"
            maxLength={6}
            disabled={inBattle}
            className="flex-1 px-2 py-1 bg-gray-900 text-white rounded text-sm font-mono tracking-widest disabled:opacity-50"
          />
          <button
            onClick={handleJoin}
            disabled={inBattle || !joinInput.trim()}
            className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
          >
            Join
          </button>
        </div>
        {joinError && !inBattle && (
          <div className="text-sm text-red-400">{joinError}</div>
        )}
      </div>

      {shareCode && (
        <div className="text-sm text-white mb-1">
          Share code:{' '}
          <span className="font-mono font-bold tracking-widest text-primary">{shareCode}</span>
        </div>
      )}
      {battleId && (
        <div className="text-xs text-gray-400 mb-2 font-mono break-all">
          Battle: {battleId}
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-white font-semibold">Battle Timeline</h3>
        <div className="overflow-y-auto max-h-32 bg-gray-900 p-2 rounded">
          {events.map((e, i) => (
            <div key={i} className="text-sm text-gray-300 border-b border-gray-700 py-1">
              <strong>{e.type}</strong> at {new Date(e.timestamp).toLocaleTimeString()}
              {e.payload?.price !== undefined && (
                <div className="ml-2 text-sm">{e.payload.price}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="text-lg text-white mt-2">
        <div className="text-gray-300">{countdown}</div>
      </div>
    </div>
  );
}
