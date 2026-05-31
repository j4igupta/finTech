// src/app/dashboard/page.tsx
"use client";

import { XPProgressBar } from "@/components/xp-progress";
import { PortfolioCard } from "@/components/portfolio-card";
import { AICoachChat } from "@/components/ai-coach-chat";
import { DailyQuests } from "@/components/daily-quests";
import { HoldingsList } from "@/components/holdings-list";
import { Leaderboard } from "@/components/leaderboard";
import { FlashBattle } from "@/components/flash-battle";
import { PlayerProfileCard } from "@/components/player-profile-card";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useQuests } from "@/hooks/useQuests";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useHoldings } from "@/hooks/useHoldings";
import { useXP } from "@/hooks/useXP"; // optional hook for XP progress

import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  // Real‑time data from Supabase
  const portfolio = usePortfolio();
  const quests = useQuests();
  const { data: leaderboardPlayers } = useLeaderboard();
  const holdings = useHoldings();
  const { currentXp, level } = useXP(); // assume a hook that provides XP info

  // Fallbacks if Supabase tables are missing or empty
  const portfolioData = portfolio.length ? portfolio : [];
  const questList = quests.length ? quests : [];
  const holdingsList = holdings.length ? holdings : [];

  // Example calculations – adapt as needed based on actual table schema
  const totalValue = portfolioData.reduce((sum, p) => sum + (p.value ?? 0), 0);
  const change = portfolioData.length ? portfolioData[portfolioData.length - 1].change ?? 0 : 0;
  const changePercent = portfolioData.length ? (change / totalValue) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#1E90FF] to-[#FF69B4]">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L2 7v6c0 5 3.8 9.7 9 10 5.2-.3 9-5 9-10V7L12 2z"/></svg>
            </div>
            <span className="text-xl font-bold tracking-tight">
              Fin<span className="text-[#1E90FF]">Quest</span>
            </span>
          </div>
          {/* Nav omitted for brevity – NavBar component is rendered globally */}
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* XP Progress */}
        <XPProgressBar currentXp={currentXp ?? 0} level={level ?? 1} />

        {/* Portfolio card */}
        <PortfolioCard totalValue={totalValue} change={change} changePercent={changePercent} data={portfolioData} />

        {/* Flash Battle */}
        <FlashBattle
          player1={{ username: "Player One", avatar: "/avatars/user.png", level: 12, score: 200 }}
          player2={{ username: "DiamondHands", avatar: "/avatars/3.png", level: 24, score: 150, answered: true, correct: true }}
          question={{ id: "1", category: "Stock Market", text: "What does P/E ratio stand for in stock valuation?", options: ["Profit/Earnings", "Price/Earnings", "Performance/Equity", "Principal/Expense"], correctIndex: 1 }}
          timeLimit={15}
          roundNumber={3}
          totalRounds={5}
        />

        {/* Holdings */}
        <HoldingsList assets={holdingsList} />

        {/* Leaderboard */}
        <Leaderboard players={leaderboardPlayers} />

        {/* Daily Quests */}
        <DailyQuests quests={questList} />

        {/* Player Profile Card */}
        <PlayerProfileCard
          username="Player One"
          level={level ?? 1}
          currentXp={currentXp ?? 0}
          achievements={[]}
          recentActivity={[]}
          stats={{ totalTrades: 0, winRate: 0, streak: 0, questsCompleted: 0, daysActive: 0 }}
          joinedDate="Jan 2024"
        />
      </main>

      {/* AI Coach Chat */}
      <AICoachChat />
    </div>
  );
}
