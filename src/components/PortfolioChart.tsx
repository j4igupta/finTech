import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Placeholder data – replace with real portfolio time‑series
const data = [
  { date: '2024-01-01', value: 100000 },
  { date: '2024-02-01', value: 102500 },
  { date: '2024-03-01', value: 101200 },
  { date: '2024-04-01', value: 105300 },
  { date: '2024-05-01', value: 108000 },
];

export function PortfolioChart() {
  return (
    <section className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-white font-medium mb-2">Portfolio Growth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="date" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#00FFAA" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
