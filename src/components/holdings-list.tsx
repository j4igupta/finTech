"use client";

import { ArrowUpRight, ArrowDownRight, Bitcoin, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Asset {
  id: string;
  name: string;
  symbol: string;
  value: number;
  change: number;
  allocation: number;
  icon: "btc" | "usd" | "stock";
}

const iconMap = {
  btc: Bitcoin,
  usd: DollarSign,
  stock: TrendingUp,
};

interface HoldingsListProps {
  assets: Asset[];
}

export function HoldingsList({ assets }: HoldingsListProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Holdings</h3>
        <Link href="/holdings" className="text-xs text-[#1E90FF] hover:underline">View All</Link>
      </div>

      <div className="space-y-3">
        {assets.map((asset) => {
          const Icon = iconMap[asset.icon];
          const isPositive = asset.change >= 0;

          return (
            <div
              key={asset.id}
              className="group flex items-center justify-between rounded-lg border border-transparent bg-secondary/30 p-3 transition-all hover:border-border hover:bg-secondary/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#1E90FF]/20 to-[#FF69B4]/20 border border-[#1E90FF]/20">
                  <Icon className="h-5 w-5 text-[#1E90FF]" />
                </div>
                <div>
                  <p className="text-sm font-medium">{asset.name}</p>
                  <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium">
                  ${asset.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <div
                  className={`flex items-center justify-end gap-0.5 text-xs ${
                    isPositive ? "text-[#00FFAA]" : "text-red-400"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  <span>{isPositive ? "+" : ""}{asset.change.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Allocation bar */}
      <div className="mt-4">
        <p className="text-xs text-muted-foreground mb-2">Allocation</p>
        <div className="flex h-2 w-full overflow-hidden rounded-full">
          {assets.map((asset, i) => {
            const colors = ["#1E90FF", "#FF69B4", "#00FFAA", "#FFD700"];
            return (
              <div
                key={asset.id}
                className="h-full transition-all"
                style={{
                  width: `${asset.allocation}%`,
                  backgroundColor: colors[i % colors.length],
                }}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-2">
          {assets.map((asset, i) => {
            const colors = ["#1E90FF", "#FF69B4", "#00FFAA", "#FFD700"];
            return (
              <div key={asset.id} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
                <span className="text-xs text-muted-foreground">
                  {asset.symbol} {asset.allocation}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
