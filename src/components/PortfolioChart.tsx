'use client';

import { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface PortfolioPoint {
  date: string;
  value: number;
}

type Status = 'loading' | 'ready' | 'error';

export function PortfolioChart() {
  const [data, setData] = useState<PortfolioPoint[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let active = true;
    async function fetchHistory() {
      try {
        const res = await fetch('/api/portfolio/history');
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const points = (await res.json()) as PortfolioPoint[];
        if (!active) return;
        setData(Array.isArray(points) ? points : []);
        setStatus('ready');
      } catch {
        if (active) setStatus('error');
      }
    }
    fetchHistory();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mb-6 rounded-lg border border-border bg-card p-4 shadow-md">
      <h3 className="mb-2 font-medium text-foreground">Portfolio Growth</h3>
      {status === 'loading' && <p className="text-muted-foreground">Loading chart…</p>}
      {status === 'error' && (
        <p className="text-sm text-red-400">Couldn&apos;t load portfolio history. Try again later.</p>
      )}
      {status === 'ready' && data.length === 0 && (
        <p className="text-sm text-muted-foreground">No portfolio history yet.</p>
      )}
      {status === 'ready' && data.length > 0 && (
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
