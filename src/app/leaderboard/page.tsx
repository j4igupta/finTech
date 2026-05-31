"use client";

import { Header } from '@/components/Header';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function LeaderboardPage() {
  return (
    <ProtectedRoute>
      <LeaderboardContent />
    </ProtectedRoute>
  );
}

function LeaderboardContent() {
  const { data, loading, error } = useLeaderboard();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl p-4">
        {loading ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
            Loading leaderboard…
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-10 text-center text-red-400">
            Couldn&apos;t load the leaderboard. {error}
          </div>
        ) : data.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
            No players yet — be the first to earn XP in a Flash Battle!
          </div>
        ) : (
          <LeaderboardTable players={data} />
        )}
      </main>
    </>
  );
}
