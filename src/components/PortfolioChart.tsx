'use client';

import { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface PortfolioPoint {
  date: string;
  value: number;
}

export function PortfolioChart() {
  const [data, setData] = useState<PortfolioPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const res = await fetch('/api/portfolio/history');
      const points: PortfolioPoint[] = await res.json();
      setData(points);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  return (
    <section className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-white font-medium mb-2">Portfolio Growth</h3>
      {loading ? (
        <p className="text-gray-300">Loading chart…</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#00FFAA" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
