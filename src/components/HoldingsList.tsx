1	"use client";
2
3	import { ArrowUpRight, ArrowDownRight, Bitcoin, DollarSign, TrendingUp } from "lucide-react";
4
5	interface Asset {
6	  id: string;
7	  name: string;
8	  symbol: string;
9	  value: number;
10	  change: number;
11	  allocation: number;
12	  icon: "btc" | "usd" | "stock";
13	}

14	const iconMap = {
15	  btc: Bitcoin,
16	  usd: DollarSign,
17	  stock: TrendingUp,
18	};

19	interface HoldingsListProps {
20	  assets: Asset[];
21	}

22	export function HoldingsList({ assets }: HoldingsListProps) {
23	  return (
24	    <div className="rounded-xl border border-border bg-card p-5">
25	      <div className="flex items-center justify-between mb-4">
26	        <h3 className="font-semibold">Holdings</h3>
27	        <button className="text-xs text-[#1E90FF] hover:underline">View All</button>
28	      </div>

29	      <div className="space-y-3">
30	        {assets.map((asset) => {
31	          const Icon = iconMap[asset.icon];
32	          const isPositive = asset.change >= 0;

33	          return (
34	            <div
35	              key={asset.id}
	              className="group flex items-center justify-between rounded-lg border border-transparent bg-secondary/30 p-3 transition-all hover:border-border hover:bg-secondary/50"
36	            >
37	              <div className="flex items-center gap-3">
38	                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#1E90FF]/20 to-[#FF69B4]/20 border border-[#1E90FF]/20">
39	                  <Icon className="h-5 w-5 text-[#1E90FF]" />
40	                </div>
41	                <div>
42	                  <p className="text-sm font-medium">{asset.name}</p>
43	                  <p className="text-xs text-muted-foreground">{asset.symbol}</p>
44	                </div>
45	              </div>

46	              <div className="text-right">
47	                <p className="text-sm font-medium">
48	                  ${asset.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
49	                </p>
50	                <div
51	                  className={`flex items-center justify-end gap-0.5 text-xs ${
52	                    isPositive ? "text-[#00FFAA]" : "text-red-400"
53	                  }`}
54	                >
55	                  {isPositive ? (
56	                    <ArrowUpRight className="h-3 w-3" />
57	                  ) : (
58	                    <ArrowDownRight className="h-3 w-3" />
59	                  )}
60	                  <span>{isPositive ? "+" : ""}{asset.change.toFixed(2)}%</span>
61	                </div>
62	              </div>
63	            </div>
64	          );
65	        })}
66	      </div>

67	      {/* Allocation bar */}
68	      <div className="mt-4">
69	        <p className="text-xs text-muted-foreground mb-2">Allocation</p>
70	        <div className="flex h-2 w-full overflow-hidden rounded-full">
71	          {assets.map((asset, i) => {
72	            const colors = ["#1E90FF", "#FF69B4", "#00FFAA", "#FFD700"];
73	            return (
74	              <div
75	                key={asset.id}
76	                className="h-full transition-all"
77	                style={{
78	                  width: `${asset.allocation}%`,
79	                  backgroundColor: colors[i % colors.length],
80	                }}
81	              />
82	            );
83	          })}
84	        </div>
85	        <div className="flex items-center justify-between mt-2">
86	          {assets.map((asset, i) => {
87	            const colors = ["#1E90FF", "#FF69B4", "#00FFAA", "#FFD700"];
88	            return (
89	              <div key={asset.id} className="flex items-center gap-1.5">
90	                <span
91	                  className="h-2 w-2 rounded-full"
92	                  style={{ backgroundColor: colors[i % colors.length] }}
93	                />
94	                <span className="text-xs text-muted-foreground">
95	                  {asset.symbol} {asset.allocation}%
96	                </span>
97	              </div>
98	            );
99	          })}
100	        </div>
101	      </div>
102	    </div>
103	  );
104	}