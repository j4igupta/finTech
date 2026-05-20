1	"use client";
2
3	import { TrendingUp, Zap, Trophy, Sparkles } from "lucide-react";

4	const ranks = [
5	  { name: "Rookie", minXp: 0, color: "text-muted-foreground" },
6	  { name: "Apprentice", minXp: 1000, color: "text-[#1E90FF]" },
7	  { name: "Investor", minXp: 5000, color: "text-[#00FFAA]" },
8	  { name: "Master", minXp: 15000, color: "text-[#FF69B4]" },
9	  { name: "Legend", minXp: 50000, color: "text-yellow-400" },
10	];

11	interface XPProgressBarProps {
12	  currentXp: number;
13	  level: number;
14	}

15	export function XPBar({ currentXp, level }: XPProgressBarProps) {
16	  const currentRank = ranks.reduce(
17	    (acc, rank) => (currentXp >= rank.minXp ? rank : acc),
18	    ranks[0]
19	  );
20	  const nextRank = ranks[ranks.indexOf(currentRank) + 1];

21	  const xpForCurrentLevel = currentRank.minXp;
22	  const xpForNextLevel = nextRank?.minXp || currentRank.minXp + 10000;
23	  const progressInLevel = currentXp - xpForCurrentLevel;
24	  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
25	  const progressPercent = Math.min(
26	    (progressInLevel / xpNeededForLevel) * 100,
27	    100
28	  );

29	  return (
30	    <div className="rounded-xl border border-border bg-card p-5">
31	      <div className="flex items-center justify-between mb-4">
32	        <div className="flex items-center gap-3">
33	          <div className="relative">
34	            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1E90FF] to-[#FF69B4] p-0.5">
35	              <div className="flex h-full w-full items-center justify-center rounded-full bg-card">
36	                <Trophy className="h-5 w-5 text-[#FF69B4]" />
37	              </div>
38	            </div>
39	            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1E90FF] text-[10px] font-bold text-background">
40	              {level}
41	            </div>
42	          </div>
43	          <div>
44	            <p className="text-sm text-muted-foreground">Current Rank</p>
45	            <p className={`font-semibold ${currentRank.color}`}>
46	              {currentRank.name}
47	            </p>
48	          </div>
49	        </div>
50	        <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1.5">
51	          <Zap className="h-4 w-4 text-[#FF69B4]" />
52	          <span className="text-sm font-medium">
53	            {currentXp.toLocaleString()} XP
54	          </span>
55	        </div>
56	      </div>

57	      <div className="space-y-2">
58	        <div className="flex items-center justify-between text-xs">
59	          <span className="text-muted-foreground">Progress to Next Rank</span>
60	          {nextRank && (
61	            <span className={nextRank.color}>{nextRank.name}</span>
62	          )}
63	        </div>
64	        <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
65	          <div
66	            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#1E90FF] via-[#FF69B4] to-[#00FFAA] transition-all duration-500"
67	            style={{ width: `${progressPercent}%` }}
68	          />
69	          <div
70	            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#1E90FF] via-[#FF69B4] to-[#00FFAA] blur-sm opacity-50"
71	            style={{ width: `${progressPercent}%` }}
72	          />
73	        </div>
74	        <div className="flex items-center justify-between text-xs text-muted-foreground">
75	          <span>{progressInLevel.toLocaleString()} XP</span>
76	          <span>{xpNeededForLevel.toLocaleString()} XP</span>
77	        </div>
78	      </div>

79	      <div className="mt-4 flex items-center gap-2">
80	        <Sparkles className="h-4 w-4 text-[#00FFAA]" />
81	        <span className="text-xs text-muted-foreground">
82	          Earn XP by completing daily quests and growing your portfolio
83	        </span>
84	      </div>
85	    </div>
86	  );
87	}
