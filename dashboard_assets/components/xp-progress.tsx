"use client";

import { TrendingUp, Zap, Trophy, Sparkles } from "lucide-react";

const ranks = [
  { name: "Rookie", minXp: 0, color: "text-muted-foreground" },
  { name: "Apprentice", minXp: 1000, color: "text-[#1E90FF]" },
  { name: "Investor", minXp: 5000, color: "text-[#00FFAA]" },
  { name: "Master", minXp: 15000, color: "text-[#FF69B4]" },
  { name: "Legend", minXp: 50000, color: "text-yellow-400" },
];

interface XPProgressBarProps {
  currentXp: number;
  level: number;
}

export function XPProgressBar({ currentXp, level }: XPProgressBarProps) {
  const currentRank = ranks.reduce(
    (acc, rank) => (currentXp >= rank.minXp ? rank : acc),
    ranks[0]
  );
  const nextRank = ranks[ranks.indexOf(currentRank) + 1];

  const xpForCurrentLevel = currentRank.minXp;
  const xpForNextLevel = nextRank?.minXp || currentRank.minXp + 10000;
  const progressInLevel = currentXp - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = Math.min(
    (progressInLevel / xpNeededForLevel) * 100,
    100
  );

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1E90FF] to-[#FF69B4] p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-card">
                <Trophy className="h-5 w-5 text-[#FF69B4]" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1E90FF] text-[10px] font-bold text-background">
              {level}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Rank</p>
            <p className={`font-semibold ${currentRank.color}`}>
              {currentRank.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1.5">
          <Zap className="h-4 w-4 text-[#FF69B4]" />
          <span className="text-sm font-medium">
            {currentXp.toLocaleString()} XP
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress to Next Rank</span>
          {nextRank && (
            <span className={nextRank.color}>{nextRank.name}</span>
          )}
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#1E90FF] via-[#FF69B4] to-[#00FFAA] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#1E90FF] via-[#FF69B4] to-[#00FFAA] blur-sm opacity-50"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{progressInLevel.toLocaleString()} XP</span>
          <span>{xpNeededForLevel.toLocaleString()} XP</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[#00FFAA]" />
        <span className="text-xs text-muted-foreground">
          Earn XP by completing daily quests and growing your portfolio
        </span>
      </div>
    </div>
  );
}

interface RankBadgeProps {
  rank: string;
  size?: "sm" | "md" | "lg";
}

export function RankBadge({ rank, size = "md" }: RankBadgeProps) {
  const rankData = ranks.find(
    (r) => r.name.toLowerCase() === rank.toLowerCase()
  );
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 font-medium ${sizeClasses[size]} ${rankData?.color || "text-muted-foreground"}`}
    >
      <TrendingUp className="h-3 w-3" />
      {rank}
    </span>
  );
}
