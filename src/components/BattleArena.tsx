// Flash Battle arena — real cross-user trading duel wired to BattleEngine.
"use client";

import * as React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Zap, Trophy, Copy, Check, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { BattleEngine, type BattleState, type BattleEvent } from "@/lib/battleEngine";
import {
  applyTrade,
  priceAt,
  priceSeries,
  winnerOf,
  BASE_PRICE,
  type TradeState,
} from "@/lib/battleGame";

type Phase = "lobby" | "waiting" | "active" | "ended";

export function BattleArena() {
  const engineRef = useRef<BattleEngine | null>(null);
  if (engineRef.current === null) engineRef.current = new BattleEngine();
  const engine = engineRef.current;

  const [phase, setPhase] = useState<Phase>("lobby");
  const [userId, setUserId] = useState<string | null>(null);
  const [state, setState] = useState<BattleState | null>(null);
  const [joinCode, setJoinCode] = useState<string>("");
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<BattleEvent[]>([]);
  const [now, setNow] = useState<number>(Date.now());

  const tradeRef = useRef<TradeState>({ position: 0, entryPrice: BASE_PRICE });
  const endRequested = useRef(false);

  // Subscribe once. The engine seeds state on connect and pushes updates after.
  useEffect(() => {
    engine.getUserId().then(setUserId);
    const offState = engine.onState((s) => {
      setState(s);
      if (s.status === "active") setPhase("active");
      else if (s.status === "ended") setPhase("ended");
    });
    const offEvent = engine.onEvent((e) => setEvents((prev) => [...prev, e]));
    return () => {
      offState();
      offEvent();
      engine.disconnect();
    };
  }, [engine]);

  // Wall clock for the countdown + price ticker while a battle is live.
  useEffect(() => {
    if (phase !== "active") return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [phase]);

  const startMs = state?.start_time ? Date.parse(state.start_time) : null;
  const endMs = state?.end_time ? Date.parse(state.end_time) : null;
  const battleId = state?.id ?? null;
  const currentPrice =
    battleId && startMs ? priceAt(battleId, startMs, now) : BASE_PRICE;
  const remainingMs = endMs ? Math.max(0, endMs - now) : null;

  // Auto-end once the clock runs out (idempotent server-side, so a double call
  // from both players is harmless).
  useEffect(() => {
    if (phase === "active" && remainingMs === 0 && !endRequested.current) {
      endRequested.current = true;
      engine.endBattle().catch((e) => setError(e.message));
    }
  }, [phase, remainingMs, engine]);

  const handleCreate = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await engine.createBattle();
      if (res) {
        setCreatedCode(res.joinCode);
        setPhase("waiting");
      } else {
        setError("Could not create battle.");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [engine]);

  const handleJoin = useCallback(async () => {
    const code = joinCode.trim();
    if (!code) return;
    setBusy(true);
    setError(null);
    try {
      const id = await engine.joinBattle(code);
      if (!id) setError("Could not join battle.");
      // phase flips to "active" via the state subscription.
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [engine, joinCode]);

  const handleTrade = useCallback(
    async (action: "buy" | "sell") => {
      if (!battleId || !startMs) return;
      const price = priceAt(battleId, startMs, Date.now());
      const result = applyTrade(tradeRef.current, action, price);
      tradeRef.current = { position: result.position, entryPrice: result.entryPrice };
      try {
        await engine.playerAction(action, result.delta);
      } catch (e) {
        setError((e as Error).message);
      }
    },
    [engine, battleId, startMs]
  );

  const copyCode = useCallback(() => {
    if (!createdCode) return;
    navigator.clipboard?.writeText(createdCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [createdCode]);

  // ---- derived view state ----
  const isPlayer1 = !!(state && userId && state.player1_id === userId);
  const myScore = state ? (isPlayer1 ? state.player1_score : state.player2_score) : 0;
  const oppScore = state ? (isPlayer1 ? state.player2_score : state.player1_score) : 0;
  const winnerId = state
    ? winnerOf(state.player1_id, state.player2_id, state.player1_score, state.player2_score)
    : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {phase === "lobby" && (
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Zap className="h-5 w-5 text-[#FF69B4]" /> Flash Battle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="mb-2 text-sm text-muted-foreground">
                Start a new duel and share the code with a friend.
              </p>
              <Button
                onClick={handleCreate}
                disabled={busy}
                className="w-full bg-gradient-to-r from-[#1E90FF] to-[#FF69B4] text-white hover:opacity-90"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Battle"}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Join with a code.</p>
              <div className="flex gap-2">
                <input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  maxLength={6}
                  placeholder="ABC123"
                  className="flex-1 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 font-mono uppercase tracking-widest text-foreground placeholder:text-muted-foreground focus:border-[#1E90FF]/50 focus:outline-none"
                />
                <Button onClick={handleJoin} disabled={busy || !joinCode.trim()} variant="outline">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "waiting" && (
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="text-center text-foreground">Waiting for opponent…</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-6">
            <Loader2 className="h-8 w-8 animate-spin text-[#1E90FF]" />
            <p className="text-sm text-muted-foreground">Share this code:</p>
            <button
              onClick={copyCode}
              className="flex items-center gap-3 rounded-xl border border-[#1E90FF]/40 bg-[#1E90FF]/10 px-6 py-3 font-mono text-2xl font-bold tracking-[0.3em] text-[#1E90FF]"
            >
              {createdCode}
              {copied ? <Check className="h-5 w-5 text-[#00FFAA]" /> : <Copy className="h-5 w-5" />}
            </button>
            <p className="text-xs text-muted-foreground">The duel starts the moment they join.</p>
          </CardContent>
        </Card>
      )}

      {(phase === "active" || phase === "ended") && state && (
        <Card className="overflow-hidden rounded-2xl border-border bg-card">
          {/* Scoreboard */}
          <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-6 py-4">
            <Scorebox label="You" score={myScore} color="#1E90FF" />
            <div className="text-center">
              {phase === "active" && remainingMs !== null ? (
                <>
                  <div className="font-mono text-2xl font-bold text-foreground">
                    {formatClock(remainingMs)}
                  </div>
                  <div className="text-xs text-muted-foreground">remaining</div>
                </>
              ) : (
                <Trophy className="mx-auto h-7 w-7 text-[#FFD700]" />
              )}
            </div>
            <Scorebox label="Opponent" score={oppScore} color="#FF69B4" align="right" />
          </div>

          <CardContent className="space-y-5 py-6">
            {phase === "active" && (
              <>
                <div className="text-center">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Market price
                  </div>
                  <div className="text-4xl font-bold text-foreground">
                    ${currentPrice.toFixed(2)}
                  </div>
                  <PriceSparkline battleId={state.id} startMs={startMs!} now={now} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleTrade("buy")}
                    className="h-14 bg-[#00FFAA] text-black hover:bg-[#00FFAA]/90"
                  >
                    <TrendingUp className="mr-2 h-5 w-5" /> Buy / Long
                  </Button>
                  <Button
                    onClick={() => handleTrade("sell")}
                    className="h-14 bg-[#FF69B4] text-white hover:bg-[#FF69B4]/90"
                  >
                    <TrendingDown className="mr-2 h-5 w-5" /> Sell / Short
                  </Button>
                </div>
                <Progress
                  value={remainingMs !== null && endMs && startMs ? (remainingMs / (endMs - startMs)) * 100 : 0}
                  className="w-full"
                />
              </>
            )}

            {phase === "ended" && (
              <div className="space-y-2 py-4 text-center">
                <div className="text-3xl font-bold">
                  {winnerId == null ? (
                    <span className="text-muted-foreground">It&apos;s a tie!</span>
                  ) : winnerId === userId ? (
                    <span className="text-[#00FFAA]">You win! 🎉</span>
                  ) : (
                    <span className="text-[#FF69B4]">You lost</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Final score — You {myScore} · Opponent {oppScore}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPhase("lobby");
                    setState(null);
                    setEvents([]);
                    setCreatedCode(null);
                    setJoinCode("");
                    endRequested.current = false;
                    tradeRef.current = { position: 0, entryPrice: BASE_PRICE };
                    engine.disconnect();
                  }}
                >
                  Back to lobby
                </Button>
              </div>
            )}

            {/* Event feed */}
            {events.length > 0 && (
              <div className="max-h-40 overflow-y-auto rounded-lg border border-border bg-secondary/20 p-3 text-xs">
                {events
                  .slice(-12)
                  .reverse()
                  .map((e, i) => (
                    <div key={i} className="flex justify-between py-0.5 text-muted-foreground">
                      <span>{e.type.replace("_", " ")}</span>
                      {e.payload?.action && (
                        <span className="font-mono">
                          {e.payload.action} {e.payload.delta >= 0 ? "+" : ""}
                          {e.payload.delta}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Scorebox({
  label,
  score,
  color,
  align = "left",
}: {
  label: string;
  score: number;
  color: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold" style={{ color }}>
        {score}
      </div>
    </div>
  );
}

function PriceSparkline({ battleId, startMs, now }: { battleId: string; startMs: number; now: number }) {
  const series = priceSeries(battleId, startMs, now, 40);
  if (series.length < 2) return null;
  const prices = series.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const w = 280;
  const h = 48;
  const pts = series
    .map((p, i) => {
      const x = (i / (series.length - 1)) * w;
      const y = h - ((p.price - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mx-auto mt-2 h-12 w-full max-w-[280px]">
      <polyline points={pts} fill="none" stroke="#1E90FF" strokeWidth="2" />
    </svg>
  );
}

function formatClock(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
