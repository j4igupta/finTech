import { Header } from '@/components/Header';
import { PortfolioSummary } from '@/components/PortfolioSummary';
import { PortfolioChart } from '@/components/PortfolioChart';

export default function PortfolioPage() {
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
