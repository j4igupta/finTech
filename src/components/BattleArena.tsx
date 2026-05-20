// Battle Arena – revamped UI using the extracted component library
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { FlashBattle } from "@/components/FlashBattle";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function BattleArena() {
  const [battleId] = useState(() => `battle-${Date.now()}`);
  const [events, setEvents] = React.useState<Array<{ type: string; payload: any; timestamp: string }>>([]);
  const [countdown, setCountdown] = React.useState("Starting battle...");

  // Simulate a simple event loop (replace with real engine later)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newEvent = {
        type: "price_update",
        payload: { price: Math.floor(100 + Math.random() * 20) },
        timestamp: now.toISOString(),
      };
      setEvents(prev => [...prev, newEvent]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simple countdown based on the last event timestamp
  useEffect(() => {
    if (events.length === 0) return;
    const last = new Date(events[events.length - 1].timestamp).getTime();
    const diff = Math.max(0, 30_000 - (Date.now() - last)); // 30 s from last event
    const sec = Math.floor(diff / 1000);
    setCountdown(`${sec}s remaining`);
  }, [events]);

  const handleAction = (action: "buy" | "sell") => {
    const now = new Date();
    const evt = {
      type: "player_action",
      payload: { action, price: Math.floor(100 + Math.random() * 20) },
      timestamp: now.toISOString(),
    };
    setEvents(prev => [...prev, evt]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="bg-card text-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">Battle Arena #{battleId}</CardTitle>
        </CardHeader>
        <CardContent>
          <FlashBattle battleId={battleId} onAction={handleAction} />
        </CardContent>
      </Card>

      {/* Event Timeline */}
      <Card className="bg-card text-foreground">
        <CardHeader>
          <CardTitle>Battle Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            {events.map((e, i) => (
              <div key={i} className="text-sm py-1 border-b border-muted">
                <strong>{e.type}</strong> – {new Date(e.timestamp).toLocaleTimeString()}
                {e.payload?.price && <span className="ml-2">price: {e.payload.price}</span>}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Countdown */}
      <div className="text-center text-lg font-medium text-foreground">{countdown}</div>
    </div>
  );
}
