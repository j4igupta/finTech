import { XPProgressBar } from "@/components/xp-progress";
import { PortfolioCard } from "@/components/portfolio-card";
import { AICoachChat } from "@/components/ai-coach-chat";
import { DailyQuests } from "@/components/daily-quests";
import { HoldingsList } from "@/components/holdings-list";
import { Leaderboard } from "@/components/leaderboard";
import { FlashBattle } from "@/components/flash-battle";
import { PlayerProfileCard } from "@/components/player-profile-card";
import { Bell, Settings, User, Gamepad2, Trophy, Zap } from "lucide-react";

// Sample data
const portfolioData = [
  { date: "Jan 1", value: 12400 },
  { date: "Jan 5", value: 12800 },
  { date: "Jan 10", value: 12200 },
  { date: "Jan 15", value: 13100 },
  { date: "Jan 20", value: 13800 },
  { date: "Jan 25", value: 14200 },
  { date: "Jan 30", value: 13900 },
  { date: "Feb 5", value: 14500 },
  { date: "Feb 10", value: 15200 },
  { date: "Feb 15", value: 14847 },
];

const quests = [
  {
    id: "1",
    title: "Daily Login",
    description: "Check your portfolio today",
    xpReward: 50,
    progress: 1,
    total: 1,
    completed: true,
    icon: "flame" as const,
  },
  {
    id: "2",
    title: "Investment Insight",
    description: "Read 3 market news articles",
    xpReward: 100,
    progress: 2,
    total: 3,
    completed: false,
    icon: "target" as const,
  },
  {
    id: "3",
    title: "Portfolio Review",
    description: "Check all your holdings",
    xpReward: 75,
    progress: 0,
    total: 1,
    completed: false,
    icon: "clock" as const,
  },
  {
    id: "4",
    title: "First Trade",
    description: "Execute a buy or sell order",
    xpReward: 200,
    progress: 0,
    total: 1,
    completed: false,
    icon: "gift" as const,
  },
];

const holdings = [
  {
    id: "1",
    name: "Bitcoin",
    symbol: "BTC",
    value: 8234.56,
    change: 2.34,
    allocation: 55,
    icon: "btc" as const,
  },
  {
    id: "2",
    name: "US Dollar",
    symbol: "USD",
    value: 3500.0,
    change: 0,
    allocation: 24,
    icon: "usd" as const,
  },
  {
    id: "3",
    name: "Tech Stocks",
    symbol: "TECH",
    value: 3112.44,
    change: -1.12,
    allocation: 21,
    icon: "stock" as const,
  },
];

const achievements = [
  { id: "1", name: "First Investment", icon: "🚀", unlocked: true },
  { id: "2", name: "Week Streak", icon: "🔥", unlocked: true },
  { id: "3", name: "Diversifier", icon: "🎯", unlocked: true },
  { id: "4", name: "Diamond Hands", icon: "💎", unlocked: false },
  { id: "5", name: "Whale", icon: "🐋", unlocked: false },
];

const leaderboardPlayers = [
  {
    rank: 1,
    username: "CryptoKing",
    avatar: "/avatars/1.png",
    xp: 125840,
    winStreak: 14,
    change: "same" as const,
  },
  {
    rank: 2,
    username: "WolfOfWallet",
    avatar: "/avatars/2.png",
    xp: 118320,
    winStreak: 8,
    change: "up" as const,
  },
  {
    rank: 3,
    username: "DiamondHands",
    avatar: "/avatars/3.png",
    xp: 105750,
    winStreak: 12,
    change: "down" as const,
  },
  {
    rank: 4,
    username: "BullRunner",
    avatar: "/avatars/4.png",
    xp: 98430,
    winStreak: 5,
    change: "up" as const,
  },
  {
    rank: 5,
    username: "MoonShot",
    avatar: "/avatars/5.png",
    xp: 87650,
    winStreak: 0,
    change: "down" as const,
  },
  {
    rank: 127,
    username: "Player One",
    avatar: "/avatars/user.png",
    xp: 7250,
    winStreak: 3,
    change: "up" as const,
    isCurrentUser: true,
  },
];

const flashBattlePlayers = {
  player1: {
    username: "Player One",
    avatar: "/avatars/user.png",
    level: 12,
    score: 200,
  },
  player2: {
    username: "DiamondHands",
    avatar: "/avatars/3.png",
    level: 24,
    score: 150,
    answered: true,
    correct: true,
  },
};

const flashBattleQuestion = {
  id: "1",
  category: "Stock Market",
  text: "What does P/E ratio stand for in stock valuation?",
  options: [
    "Profit/Earnings",
    "Price/Earnings",
    "Performance/Equity",
    "Principal/Expense",
  ],
  correctIndex: 1,
};

const playerAchievements = [
  { id: "1", name: "First Investment", description: "Made your first trade", icon: "🚀", unlocked: true, rarity: "common" as const, unlockedAt: "Jan 15, 2024" },
  { id: "2", name: "Week Streak", description: "Login for 7 days straight", icon: "🔥", unlocked: true, rarity: "common" as const, unlockedAt: "Jan 22, 2024" },
  { id: "3", name: "Diversifier", description: "Hold 5 different assets", icon: "🎯", unlocked: true, rarity: "rare" as const, unlockedAt: "Feb 1, 2024" },
  { id: "4", name: "Quiz Master", description: "Win 10 Flash Battles", icon: "🧠", unlocked: true, rarity: "rare" as const, unlockedAt: "Feb 10, 2024" },
  { id: "5", name: "Diamond Hands", description: "Hold through a 20% dip", icon: "💎", unlocked: false, rarity: "epic" as const },
  { id: "6", name: "Whale", description: "Reach $100k portfolio", icon: "🐋", unlocked: false, rarity: "legendary" as const },
];

const playerActivity = [
  { id: "1", type: "xp_gain" as const, title: "Daily Login Bonus", description: "Checked your portfolio today", timestamp: "2 hours ago", xp: 50 },
  { id: "2", type: "quest" as const, title: "Quest Completed", description: "Read 3 market news articles", timestamp: "3 hours ago", xp: 100 },
  { id: "3", type: "trade" as const, title: "Trade Executed", description: "Bought 0.05 BTC at $43,250", timestamp: "5 hours ago", xp: 75 },
  { id: "4", type: "level_up" as const, title: "Level Up!", description: "Reached Level 12", timestamp: "Yesterday", xp: 500 },
  { id: "5", type: "streak" as const, title: "Streak Extended", description: "3-day login streak achieved", timestamp: "Yesterday", xp: 150 },
  { id: "6", type: "achievement" as const, title: "Achievement Unlocked", description: "Quiz Master - Win 10 Flash Battles", timestamp: "2 days ago", xp: 250 },
];

const playerStats = {
  totalTrades: 47,
  winRate: 68,
  streak: 3,
  questsCompleted: 24,
  daysActive: 45,
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#1E90FF] to-[#FF69B4]">
              <Gamepad2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Fin<span className="text-[#1E90FF]">Quest</span>
            </span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#"
              className="text-sm font-medium text-foreground transition-colors hover:text-[#1E90FF]"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-[#1E90FF]"
            >
              Portfolio
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-[#1E90FF]"
            >
              Quests
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-[#1E90FF]"
            >
              Leaderboard
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#FF69B4]" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <Settings className="h-5 w-5" />
            </button>
            <button className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#1E90FF] to-[#FF69B4]">
              <User className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Welcome section */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, <span className="text-[#1E90FF]">Player One</span>
            </h1>
            <p className="mt-1 text-muted-foreground">
              {"Your portfolio is looking strong today. Keep up the momentum!"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-[#00FFAA]/30 bg-[#00FFAA]/10 px-4 py-2">
              <Zap className="h-4 w-4 text-[#00FFAA]" />
              <span className="text-sm font-medium text-[#00FFAA]">
                +350 XP Today
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#FF69B4]/30 bg-[#FF69B4]/10 px-4 py-2">
              <Trophy className="h-4 w-4 text-[#FF69B4]" />
              <span className="text-sm font-medium text-[#FF69B4]">#127</span>
            </div>
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* XP Progress */}
            <XPProgressBar currentXp={7250} level={12} />

            {/* Portfolio card */}
            <PortfolioCard
              totalValue={14847.0}
              change={647.32}
              changePercent={4.56}
              data={portfolioData}
            />

            {/* Flash Battle */}
            <FlashBattle
              player1={flashBattlePlayers.player1}
              player2={flashBattlePlayers.player2}
              question={flashBattleQuestion}
              timeLimit={15}
              roundNumber={3}
              totalRounds={5}
            />

            {/* Holdings */}
            <HoldingsList assets={holdings} />

            {/* Leaderboard */}
            <Leaderboard players={leaderboardPlayers} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Daily Quests */}
            <DailyQuests quests={quests} />

            {/* Player Profile Card */}
            <PlayerProfileCard
              username="Player One"
              level={12}
              currentXp={7250}
              achievements={playerAchievements}
              recentActivity={playerActivity}
              stats={playerStats}
              joinedDate="Jan 2024"
            />

            {/* Achievements */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Achievements</h3>
                <button className="text-xs text-[#1E90FF] hover:underline">
                  View All
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`group relative flex h-14 w-14 items-center justify-center rounded-xl border transition-all ${
                      achievement.unlocked
                        ? "border-[#FF69B4]/30 bg-gradient-to-br from-[#FF69B4]/10 to-[#1E90FF]/10 hover:border-[#FF69B4]/50"
                        : "border-border bg-secondary/30 opacity-40"
                    }`}
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="absolute -bottom-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                      {achievement.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Total Trades</p>
                <p className="mt-1 text-2xl font-bold text-[#1E90FF]">47</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Win Rate</p>
                <p className="mt-1 text-2xl font-bold text-[#00FFAA]">68%</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Coach Chat */}
      <AICoachChat />
    </div>
  );
}
