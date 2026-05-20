'use client';

import * as React from 'react';

interface PortfolioData {
  netWorth: number;
  cash: number;
  positions: number;
  diversification: number;
  volatility: number;
  winRate: number;
  sharpeRatio: number;
  unrealizedGains: number;
}

export function PortfolioSummary() {
  const [data, setData] = React.useState<PortfolioData | null>(null);

  React.useEffect(() => {
    // Placeholder – replace with actual Supabase query
    const mock: PortfolioData = {
      netWorth: 123456,
      cash: 20000,
      positions: 8,
      diversification: 0.73,
      volatility: 0.12,
      winRate: 0.58,
      sharpeRatio: 1.3,
      unrealizedGains: 4500,
    };
    setData(mock);
  }, []);

  if (!data) return <p className="text-gray-300">Loading portfolio…</p>;

  return (
    <section className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-white font-medium mb-2">Net Worth</h3>
        <p className="text-primary text-2xl">${data.netWorth.toLocaleString()}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-white font-medium mb-2">Cash</h3>
        <p className="text-primary text-xl">${data.cash.toLocaleString()}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-white font-medium mb-2">Positions</h3>
        <p className="text-gray-200">{data.positions}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-white font-medium mb-2">Diversification</h3>
        <p className="text-gray-200">{(data.diversification * 100).toFixed(0)}%</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-white font-medium mb-2">Volatility</h3>
        <p className="text-gray-200">{(data.volatility * 100).toFixed(1)}%</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-white font-medium mb-2">Win Rate</h3>
        <p className="text-gray-200">{(data.winRate * 100).toFixed(0)}%</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-white font-medium mb-2">Sharpe Ratio</h3>
        <p className="text-gray-200">{data.sharpeRatio.toFixed(2)}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-white font-medium mb-2">Unrealized Gains</h3>
        <p className="text-gray-200">${data.unrealizedGains.toLocaleString()}</p>
      </div>
    </section>
  );
}
