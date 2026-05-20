"use client";

import {
  Trophy,
  Zap,
  Shield,
  Sword,
  Target,
  Flame,
  Star,
  Crown,
  TrendingUp,
  TrendingDown,
  Clock,
  Award,
  Coins,
  BookOpen,
} from "lucide-react";

const ranks = [
  { name: "Rookie", minXp: 0, icon: Shield, color: "text-muted-foreground", bgColor: "bg-muted/30" },
  { name: "Apprentice", minXp: 1000, icon: Sword, color: "text-[#1E90FF]", bgColor: "bg-[#1E90FF]/10" },
  { name: "Investor", minXp: 5000, icon: Target, color: "text-[#00FFAA]", bgColor: "bg-[#00FFAA]/10" },
  { name: "Master", minXp: 15000, icon: Crown, color: "text-[#FF69B4]", bgColor: "bg-[#FF69B4]/10" },
  { name: "Legend", minXp: 50000, icon: Star, color: "text-yellow-400", bgColor: "bg-yellow-400/10" },
];

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: string;
}

interface Activity {
  id: string;
  type: "xp_gain" | "achievement" | "trade" | "quest" | "level_up" | "streak";
  title: string;
  description: string;
  timestamp: string;
  xp?: number;
}

interface PlayerStats {
  totalTrades: number;
  winRate: number;
  streak: number;
  questsCompleted: number;
  daysActive: number;
}

interface PlayerProfileCardProps {
  username: string;
  avatar?: string;
  level: number;
  currentXp: number;
  achievements: Achievement[];
  recentActivity: Activity[];
  stats: PlayerStats;
  joinedDate: string;
}

export function PlayerProfileCard({
  username,
  avatar,
  level,
  currentXp,
  achievements,
  recentActivity,
  stats,
  joinedDate,
}: PlayerProfileCardProps) {
  const currentRank = ranks.reduce(
    (acc, rank) => (currentXp >= rank.minXp ? rank : acc),
    ranks[0]
  );
  const nextRank = ranks[ranks.indexOf(currentRank) + 1];
  const RankIcon = currentRank.icon;

  const xpForCurrentLevel = currentRank.minXp;
  const xpForNextLevel = nextRank?.minXp || currentRank.minXp + 10000;
  const progressInLevel = currentXp - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = Math.min(
    (progressInLevel / xpNeededForLevel) * 100,
    100
  );

  const rarityStyles = {
    common: "border-muted-foreground/30 bg-muted/20",
    rare: "border-[#1E90FF]/40 bg-[#1E90FF]/10",
    epic: "border-[#FF69B4]/40 bg-[#FF69B4]/10",
    legendary: "border-yellow-400/40 bg-yellow-400/10 shadow-[0_0_12px_rgba(250,204,21,0.15)]",
  };

  const rarityGlow = {
    common: "",
    rare: "hover:shadow-[0_0_12px_rgba(30,144,255,0.3)]",
    epic: "hover:shadow-[0_0_12px_rgba(255,105,180,0.3)]",
    legendary: "hover:shadow-[0_0_16px_rgba(250,204,21,0.4)]",
  };

  const activityIcons = {
    xp_gain: Zap,
    achievement: Award,
    trade: Coins,
    quest: Target,
    level_up: TrendingUp,
    streak: Flame,
  };

  const activityColors = {
    xp_gain: "text-[#00FFAA]",
    achievement: "text-[#FF69B4]",
    trade: "text-[#1E90FF]",
    quest: "text-yellow-400",
    level_up: "text-[#FF69B4]",
    streak: "text-orange-500",
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header Banner */}
      <div className="relative h-24 bg-gradient-to-r from-[#1E90FF]/20 via-[#FF69B4]/20 to-[#00FFAA]/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        
        {/* Rank Badge in corner */}
        <div className="absolute top-3 right-3">
          <div className={`flex items-center gap-1.5 rounded-full border border-border ${currentRank.bgColor} px-3 py-1`}>
            <RankIcon className={`h-3.5 w-3.5 ${currentRank.color}`} />
            <span className={`text-xs font-semibold ${currentRank.color}`}>
              {currentRank.name}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="relative px-5 pb-5">
        {/* Avatar */}
        <div className="absolute -top-10 left-5">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#1E90FF] via-[#FF69B4] to-[#00FFAA] p-[3px]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-card text-2xl font-bold">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={username}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="bg-gradient-to-br from-[#1E90FF] to-[#FF69B4] bg-clip-text text-transparent">
                    {username.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            {/* Level Badge */}
            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#1E90FF] to-[#FF69B4] text-xs font-bold text-white shadow-lg">
              {level}
            </div>
          </div>
        </div>

        {/* Username and join date */}
        <div className="ml-24 pt-2">
          <h2 className="text-xl font-bold">{username}</h2>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Joined {joinedDate}</span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#FF69B4]" />
              <span className="text-sm font-medium">
                {currentXp.toLocaleString()} XP
              </span>
            </div>
            {nextRank && (
              <span className="text-xs text-muted-foreground">
                {(xpForNextLevel - currentXp).toLocaleString()} XP to{" "}
                <span className={nextRank.color}>{nextRank.name}</span>
              </span>
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
        </div>

        {/* Stats Row */}
        <div className="mt-5 grid grid-cols-5 gap-2">
          <div className="flex flex-col items-center rounded-lg border border-border bg-secondary/30 p-2">
            <span className="text-lg font-bold text-[#1E90FF]">{stats.totalTrades}</span>
            <span className="text-[10px] text-muted-foreground">Trades</span>
          </div>
          <div className="flex flex-col items-center rounded-lg border border-border bg-secondary/30 p-2">
            <span className="text-lg font-bold text-[#00FFAA]">{stats.winRate}%</span>
            <span className="text-[10px] text-muted-foreground">Win Rate</span>
          </div>
          <div className="flex flex-col items-center rounded-lg border border-border bg-secondary/30 p-2">
            <div className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              <span className="text-lg font-bold text-orange-500">{stats.streak}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Streak</span>
          </div>
          <div className="flex flex-col items-center rounded-lg border border-border bg-secondary/30 p-2">
            <span className="text-lg font-bold text-[#FF69B4]">{stats.questsCompleted}</span>
            <span className="text-[10px] text-muted-foreground">Quests</span>
          </div>
          <div className="flex flex-col items-center rounded-lg border border-border bg-secondary/30 p-2">
            <span className="text-lg font-bold text-yellow-400">{stats.daysActive}</span>
            <span className="text-[10px] text-muted-foreground">Days</span>
          </div>
        </div>

        {/* Achievement Badge Grid */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#FF69B4]" />
              <h3 className="font-semibold">Achievements</h3>
            </div>
            <span className="text-xs text-muted-foreground">
              {achievements.filter((a) => a.unlocked).length}/{achievements.length} Unlocked
            </span>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`group relative flex h-12 w-full items-center justify-center rounded-lg border transition-all duration-200 ${
                  achievement.unlocked
                    ? `${rarityStyles[achievement.rarity]} ${rarityGlow[achievement.rarity]}`
                    : "border-border bg-secondary/20 opacity-40 grayscale"
                }`}
              >
                <span className="text-xl">{achievement.icon}</span>
                
                {/* Tooltip */}
                <div className="absolute -top-16 left-1/2 z-20 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                  <div className="whitespace-nowrap rounded-lg bg-popover border border-border px-3 py-2 text-xs shadow-xl">
                    <p className="font-semibold">{achievement.name}</p>
                    <p className="text-muted-foreground">{achievement.description}</p>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-[#00FFAA] mt-1">{achievement.unlockedAt}</p>
                    )}
                  </div>
                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-popover" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-[#1E90FF]" />
            <h3 className="font-semibold">Recent Activity</h3>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
            {recentActivity.map((activity) => {
              const ActivityIcon = activityIcons[activity.type];
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-secondary/20 p-3 transition-colors hover:bg-secondary/40"
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary ${activityColors[activity.type]}`}>
                    <ActivityIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      {activity.xp && (
                        <span className="shrink-0 text-xs font-semibold text-[#00FFAA]">
                          +{activity.xp} XP
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
