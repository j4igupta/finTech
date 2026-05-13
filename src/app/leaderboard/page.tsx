import { Header } from '@/components/Header';
import { LeaderboardTable } from '@/components/LeaderboardTable';

export default function LeaderboardPage() {
  return (
    <>
      <Header />
      <main className="p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Leaderboards</h1>
        <LeaderboardTable />
      </main>
    </>
  );
}