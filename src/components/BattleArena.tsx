// Battle Arena – revamped UI using the extracted component library
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { FlashBattle } from "@/components/flash-battle";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function BattleArena() {
  const [battleId, setBattleId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setBattleId(`battle-${Date.now()}`);
  }, []);
  const [events, setEvents] = React.useState<Array<{ type: string; payload: any; timestamp: string }>>([]);
  const [countdown, setCountdown] = React.useState("Starting battle...");
  const [progress, setProgress] = React.useState(0);

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
    setProgress(1 - diff / 30000);
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

  const getEventColor = (type: string) => {
    switch (type) {
      case "player_action":
        return "bg-primary text-primary-foreground";
      case "price_update":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-white">
            Battle Arena #{battleId}
          </CardTitle>
          <Badge variant="secondary">LIVE</Badge>
        </CardHeader>
        <CardContent>
          <FlashBattle
            battleId={battleId}
            onAction={handleAction}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Timeline */}
        <Card className="lg:col-span-2 bg-card text-foreground rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Battle Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-4 w-0.5 bg-gradient-to-b from-primary to-accent rounded-full"></div>

                {events.map((e, i) => (
                  <div key={i} className="relative pl-12 pr-4 py-2">
                    <div className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center -mt-4">
                      <Badge variant="outline" className={`text-xs ${getEventColor(e.type)}`}>
                        {e.type === "player_action" ? "P" : "U"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <strong className="text-sm">{e.type.replace("_", " ")}</strong>
                        {e.payload?.price && (
                          <span className="ml-2 text-sm font-mono">
                            $ {e.payload.price}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(e.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Countdown & Stats */}
        <div className="space-y-6">
          {/* Countdown Card */}
          <Card className="bg-gradient-to-br from-accent to-muted rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-center text-white">Time Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">{countdown}</div>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-white/80 mt-2">Next event in</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-card text-foreground rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-center">Battle Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-xs text-muted-foreground">Actions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">8</div>
                  <div className="text-xs text-muted-foreground">Updates</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="bg-card text-foreground rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-center">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => handleAction("buy")}
                  className="w-24 h-12 flex items-center justify-center"
                >
                  Buy
                </Button>
                <Button
                  onClick={() => handleAction("sell")}
                  className="w-24 h-12 flex items-center justify-center"
                  variant="outline"
                >
                  Sell
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}