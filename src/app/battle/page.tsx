import { Header } from '@/components/Header';
import { BattleArena } from '@/components/BattleArena';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function BattlePage() {
  return (
    <ProtectedRoute>
      <BattleContent />
    </ProtectedRoute>
  );
}

function BattleContent() {
  return (
    <>
      <Header />
      <main className="p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Flash Battle</h1>
        <BattleArena />
      </main>
    </>
  );
}
