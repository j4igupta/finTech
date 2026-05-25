import { Header } from '@/components/Header';
import { PortfolioSummary } from '@/components/PortfolioSummary';
import { PortfolioChart } from '@/components/PortfolioChart';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function PortfolioPage() {
  return (
    <ProtectedRoute>
      <PortfolioContent />
    </ProtectedRoute>
  );
}

function PortfolioContent() {
  return (
    <>
      <Header />
      <main className="p-4">
        <PortfolioSummary />
        <PortfolioChart />
      </main>
    </>
  );
}
