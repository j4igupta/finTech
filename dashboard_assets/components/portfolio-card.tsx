"use client";

import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PortfolioCardProps {
  totalValue: number;
  change: number;
  changePercent: number;
  data: { date: string; value: number }[];
}

export function PortfolioCard({
  totalValue,
  change,
  changePercent,
  data,
}: PortfolioCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
      {/* Glow effect */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#1E90FF]/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#00FFAA]/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#1E90FF]/20 to-[#00FFAA]/20 border border-[#1E90FF]/30">
              <Wallet className="h-5 w-5 text-[#1E90FF]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              <p className="text-2xl font-bold tracking-tight">
                ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              isPositive
                ? "bg-[#00FFAA]/10 text-[#00FFAA]"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {isPositive ? "+" : ""}
              {changePercent.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="h-32 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E90FF" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#1E90FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis hide domain={["dataMin - 100", "dataMax + 100"]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
                        <p className="text-xs text-muted-foreground">
                          {payload[0].payload.date}
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          ${Number(payload[0].value).toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#1E90FF"
                strokeWidth={2}
                fill="url(#portfolioGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>24h Change</span>
          <span
            className={isPositive ? "text-[#00FFAA]" : "text-red-400"}
          >
            {isPositive ? "+" : ""}${Math.abs(change).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}
