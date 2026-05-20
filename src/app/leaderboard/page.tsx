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
  ...Array.from({ length: 5 }, (_, i) => ({
    rank: i + 4,
    username: `Player${i + 4}`,
    avatar: `/avatars/default.png`,
    xp: Math.floor(Math.random() * 5000) + 3000,
    winStreak: Math.floor(Math.random() * 5),
    change: (['up', 'down', 'same'] as const)[Math.floor(Math.random() * 3)],
    isCurrentUser: false,
  })),
];

export default function LeaderboardPage() {
  return (
    <>
      <Header />
      {/* Pass the sample data to the table component */}
      <LeaderboardTable players={samplePlayers} />
    </>
  );
}
