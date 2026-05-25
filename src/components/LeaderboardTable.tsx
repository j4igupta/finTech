// Leaderboard table component
"use client";

import { Crown, Medal, Flame, TrendingUp, ChevronUp, ChevronDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface LeaderboardPlayer {
  rank: number;
  username: string;
  avatar: string;
  xp: number;
  winStreak: number;
  change: "up" | "down" | "same";
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  players: LeaderboardPlayer[];
  className?: string;
}

// Rank badge component for top 3
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="relative flex h-10 w-10 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to amber-600 animate-pulse-glow" />
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-500/30">
          <Crown className="h-4 w-4 text-yellow-900" />
        </div>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="relative flex h-10 w-10 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 opacity-60" />
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-400 shadow-lg shadow-slate-400/30">
          <Medal className="h-4 w-4 text-slate-700" />
        </div>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="relative flex h-10 w-10 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 opacity-60" />
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-600/30">
          <Medal className="h-4 w-4 text-amber-200" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center">
      <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    </div>
  );
}

// Win streak badge
function WinStreakBadge({ streak }: { streak: number }) {
  if (streak === 0) return <span className="text-muted-foreground">-</span>;
  let bgColor = "bg-secondary";
  let textColor = "text-muted-foreground";
  let borderColor = "border-border";
  if (streak >= 10) {
    bgColor = "bg-[#FF69B4]/20";
    textColor = "text-[#FF69B4]";
    borderColor = "border-[#FF69B4]/40";
  } else if (streak >= 5) {
    bgColor = "bg-[#1E90FF]/20";
    textColor = "text-[#1E90FF]";
    borderColor = "border-[#1E90FF]/40";
  } else if (streak >= 3) {
    bgColor = "bg-[#00FFAA]/20";
    textColor = "text-[#00FFAA]";
    borderColor = "border-[#00FFAA]/40";
  }
  return (
    <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1", bgColor, borderColor)}>
      <Flame className={cn("h-3.5 w-3.5", textColor)} />
      <span className={cn("text-xs font-bold", textColor)}>{streak}</span>
    </div>
  );
}

// Avatar with rank glow effect
function PlayerAvatar({ src, rank, username }: { src: string; rank: number; username: string }) {
  const glowClass =
    rank === 1
      ? "ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/30"
      : rank === 2
      ? "ring-2 ring-slate-400 shadow-lg shadow-slate-400/20"
      : rank === 3
      ? "ring-2 ring-amber-600 shadow-lg shadow-amber-600/20"
      : "ring-1 ring-border";
  return (
    <div className={cn("relative h-10 w-10 overflow-hidden rounded-full bg-secondary", glowClass)}>
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1E90FF]/30 to-[#FF69B4]/30 text-sm font-bold uppercase text-foreground">
        {username.slice(0, 2)}
      </div>
    </div>
  );
}

export function LeaderboardTable({ players, className }: LeaderboardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-card via-[#1E90FF]/5 to-[#FF69B4]/5 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#1E90FF] to-[#FF69B4]">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Global Leaderboard</h3>
            <p className="text-xs text-muted-foreground">Top traders this season</p>
          </div>
        </div>
        <Link href="/leaderboard" className="text-xs font-medium text-[#1E90FF] hover:underline">View All</Link>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-16 text-center text-xs text-muted-foreground">Rank</TableHead>
            <TableHead className="text-xs text-muted-foreground">Player</TableHead>
            <TableHead className="text-right text-xs text-muted-foreground">XP</TableHead>
            <TableHead className="text-center text-xs text-muted-foreground">Streak</TableHead>
            <TableHead className="w-12 text-center text-xs text-muted-foreground"><span className="sr-only">Trend</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player, index) => (
            <TableRow key={player.rank} className={cn(
              "border-border transition-all",
              index % 2 === 0 ? "bg-muted/5" : "",
              player.isCurrentUser && "bg-[#1E90FF]/10 hover:bg-[#1E90FF]/15 border-l-2 border-l-[#1E90FF]",
              player.rank <= 3 && !player.isCurrentUser && "bg-gradient-to-r from-card to-secondary/30",
              index === 0 && "border-t-0"
            )}>
              {/* Rank */}
              <TableCell className="text-center p-2">
                <div className="flex justify-center"><RankBadge rank={player.rank} /></div>
              </TableCell>

              {/* Player info */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <PlayerAvatar src={player.avatar} rank={player.rank} username={player.username} />
                  <div>
                    <p className={cn(
                      "font-medium",
                      player.isCurrentUser && "text-[#1E90FF]",
                      player.rank === 1 && "text-yellow-400",
                      player.rank === 2 && "text-slate-300",
                      player.rank === 3 && "text-amber-500"
                    )}>
                      {player.username}
                      {player.isCurrentUser && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
                    </p>
                    {player.rank <= 3 && (
                      <p className="text-xs text-muted-foreground">
                        {player.rank === 1 ? "Champion" : player.rank === 2 ? "Elite" : "Veteran"}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* XP */}
              <TableCell className="text-right">
                <span className={cn(
                  "font-mono font-bold",
                  player.rank === 1
                    ? "text-yellow-400"
                    : player.rank === 2
                    ? "text-slate-300"
                    : player.rank === 3
                    ? "text-amber-500"
                    : "text-foreground"
                )}>
                  {player.xp.toLocaleString()}
                </span>
                <span className="ml-1 text-xs text-muted-foreground">XP</span>
              </TableCell>

              {/* Win streak */}
              <TableCell className="text-center p-2"><WinStreakBadge streak={player.winStreak} /></TableCell>

              {/* Trend indicator */}
              <TableCell className="text-center p-2">
                {player.change === "up" && <ChevronUp className="mx-auto h-5 w-5 text-[#00FFAA]" />}
                {player.change === "down" && <ChevronDown className="mx-auto h-5 w-5 text-destructive" />}
                {player.change === "same" && <div className="mx-auto h-1 w-4 rounded-full bg-muted-foreground/30" />}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Footer */}
      <div className="border-t border-border bg-secondary/30 px-5 py-3">
        <p className="text-center text-xs text-muted-foreground">
          Season ends in <span className="font-medium text-[#FF69B4]">14 days</span>
        </p>
      </div>
    </div>
  );
}