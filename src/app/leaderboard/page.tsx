"use client";

import { Header } from '@/components/Header';
import { LeaderboardTable } from '@/components/LeaderboardTable';

// Sample player data for the leaderboard UI
const samplePlayers = [
  {
    rank: 1,
    username: 'ChampionUser',
    avatar: '/avatars/champion.png',
    xp: 12000,
    winStreak: 10,
    change: 'up' as const,
    isCurrentUser: false,
  },
  {
    rank: 2,
    username: 'EliteTrader',
    avatar: '/avatars/elite.png',
    xp: 9500,
    winStreak: 5,
    change: 'same' as const,
    isCurrentUser: false,
  },
  {
    rank: 3,
    username: 'VeteranGuru',
    avatar: '/avatars/veteran.png',
    xp: 8000,
    winStreak: 3,
    change: 'down' as const,
    isCurrentUser: true,
  },
  // Additional placeholder entries
  { rank: 4, username: 'Player4', avatar: '/avatars/default.png', xp: 3500, winStreak: 2, change: 'up' as const, isCurrentUser: false },
    { rank: 5, username: 'Player5', avatar: '/avatars/default.png', xp: 3400, winStreak: 1, change: 'down' as const, isCurrentUser: false },
    { rank: 6, username: 'Player6', avatar: '/avatars/default.png', xp: 3300, winStreak: 0, change: 'same' as const, isCurrentUser: false },
    { rank: 7, username: 'Player7', avatar: '/avatars/default.png', xp: 3200, winStreak: 3, change: 'up' as const, isCurrentUser: false },
    { rank: 8, username: 'Player8', avatar: '/avatars/default.png', xp: 3100, winStreak: 2, change: 'down' as const, isCurrentUser: false }
];

import ProtectedRoute from '@/components/ProtectedRoute';

export default function LeaderboardPage() {
  return (
    <ProtectedRoute>
      <LeaderboardContent />
    </ProtectedRoute>
  );
}

function LeaderboardContent() {
  return (
    <>
      <Header />
      {/* Pass the sample data to the table component */}
      <LeaderboardTable players={samplePlayers} />
    </>
  );
}
