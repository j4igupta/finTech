'use client';

import React, { useState, useEffect } from 'react';
import { BattleEngine } from '@/lib/battleEngine';
import { formatCountdown } from '@/lib/utils';
import { playSound } from '@/lib/sound';

export function BattleArena() {
  const [battleId] = useState(() => `battle-${Date.now()}`);
  const [events, setEvents] = useState<{ type: string; payload: any; timestamp: string }[]>([]);
  const [engine, setEngine] = useState<BattleEngine | null>(null);
  const [countdown, setCountdown] = useState<string>('Starting battle...');

  useEffect(() => {
    // Initialize engine
    const newEngine = new BattleEngine(battleId);
    setEngine(newEngine);

    // Connect to realtime
    newEngine.onEvent((evt) => {
      const eventData = {
        type: evt.type,
        payload: evt.payload,
        timestamp: new Date(evt.payload.timestamp).toISOString()
      };
      setEvents(prev => [...prev, eventData]);

      // Play sound for certain event types
      if (evt.type === 'player_action') {
        playSound('battle_action');
      } else if (evt.type === 'end') {
        playSound('battle_end');
      } else if (evt.type === 'start') {
        playSound('battle_start');
      }
    });

    // Connect to BATTLE event channel
    newEngine.connect();

    // Cleanup: disconnect on unmount
    return () => {
      newEngine.disconnect();
    };
  }, [battleId, engine]);

  // Calculate next countdown from events
  useEffect(() => {
    const sortedEvents = events.slice().sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const nextEvent = sortedEvents.find((e) => new Date(e.timestamp) > new Date());

    if (nextEvent) {
      const delta = new Date(nextEvent.timestamp).getTime() - Date.now();
      setCountdown(formatCountdown(delta));
    } else {
      setCountdown('No upcoming events');
    }

    // Update every second
    const interval = setInterval(() => {
      const sortedEvents = events.slice().sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      const nextEvent = sortedEvents.find((e) => new Date(e.timestamp) > new Date());

      if (nextEvent) {
        const delta = new Date(nextEvent.timestamp).getTime() - Date.now();
        setCountdown(formatCountdown(delta));
      } else {
        setCountdown('No upcoming events');
      }
    }, 1000);

    // Cleanup interval
    return () => clearInterval(interval);
  }, [events]);

  // Handle battle actions
  const handleStart = async () => {
    if (!engine) return;
    await engine.sendAction('createBattle', { userId: 'user1' });
  };

  const handleJoin = async () => {
    if (!engine) return;
    await engine.sendAction('joinBattle', { userId: 'user2' });
  };

  const handleAction = async (action: 'buy' | 'sell') => {
    if (!engine) return;
    await engine.sendAction('playerAction', { userId: 'user1', action, delta: action === 'buy' ? 10 : -5 });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md max-w-md mx-auto">
      {/* Battle Controls */}
      <div className="flex gap-2 mb-4">
        <button onClick={handleStart} className="px-3 py-1 bg-primary text-white rounded">
          Create Battle
        </button>
        <button onClick={handleJoin} className="px-3 py-1 bg-primary text-white rounded">
          Join Battle
        </button>
        <button onClick={() => handleAction('buy')} className="px-3 py-1 bg-primary text-white rounded">
          Buy
        </button>
        <button onClick={() => handleAction('sell')} className="px-3 py-1 bg-primary text-white rounded">
          Sell
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-white font-semibold">Battle Timeline</h3>
        <div className="overflow-y-auto max-h-32 bg-gray-900 p-2 rounded">
          {events.map((e, i) => (
            <div key={i} className="text-sm text-gray-300 border-b border-gray-700 py-1">
              <strong>{e.type}</strong> at {new Date(e.timestamp).toLocaleTimeString()}
              <div className="ml-2 text-sm">{e.payload.price}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-lg text-white mt-2">
        {/* Countdown Timer */}
        <div className="text-gray-300">
          {countdown}
        </div>
      </div>
    </div>
  );
}