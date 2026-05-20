1	"use client";
2
3	import {
4	  Trophy,
5	  Zap,
6	  Shield,
7	  Sword,
8	  Target,
9	  Flame,
10	  Star,
11	  Crown,
12	  TrendingUp,
13	  TrendingDown,
14	  Clock,
15	  Award,
16	  Coins,
17	  BookOpen,
18	} from "lucide-react";
19
20	const ranks = [
21	  { name: "Rookie", minXp: 0, icon: Shield, color: "text-muted-foreground", bgColor: "bg-muted/30" },
22	  { name: "Apprentice", minXp: 1000, icon: Sword, color: "text-[#1E90FF]", bgColor: "bg-[#1E90FF]/10" },
23	  { name: "Investor", minXp: 5000, icon: Target, color: "text-[#00FFAA]", bgColor: "bg-[#00FFAA]/10" },
24	  { name: "Master", minXp: 15000, icon: Crown, color: "text-[#FF69B4]", bgColor: "bg-[#FF69B4]/10" },
25	  { name: "Legend", minXp: 50000, icon: Star, color: "text-yellow-400", bgColor: "bg-yellow-400/10" },
26	];

27	interface Achievement {
28	  id: string;
29	  name: string;
30	  description: string;
31	  icon: string;
32	  unlocked: boolean;
33	  rarity: "common" | "rare" | "epic" | "legendary";
34	  unlockedAt?: string;
35	}

36	interface Activity {
37	  id: string;
38	  type: "xp_gain" | "achievement" | "trade" | "quest" | "level_up" | "streak";
39	  title: string;
40	  description: string;
41	  timestamp: string;
42	  xp?: number;
43}

44	interface PlayerStats {
45  totalTrades: number;
46  winRate: number;
47  streak: number;
48  questsCompleted: number;
49  daysActive: number;
50}

51	interface PlayerProfileCardProps {
52  username: string;
53  avatar?: string;
54  level: number;
55  currentXp: number;
56  achievements: Achievement[];
57  recentActivity: Activity[];
58  stats: PlayerStats;
59  joinedDate: string;
60}

61	export function PlayerProfileCard({
62  username,
63  avatar,
64  level,
65  currentXp,
66  achievements,
67  recentActivity,
68  stats,
69  joinedDate,
70}: PlayerProfileCardProps) {
71  const currentRank = ranks.reduce(
72    (acc, rank) => (currentXp >= rank.minXp ? rank : acc),
73    ranks[0]
74  );
75  const nextRank = ranks[ranks.indexOf(currentRank) + 1];
76  const RankIcon = currentRank.icon;

77  const xpForCurrentLevel = currentRank.minXp;
78  const xpForNextLevel = nextRank?.minXp || currentRank.minXp + 10000;
79  const progressInLevel = currentXp - xpForCurrentLevel;
80  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
81  const progressPercent = Math.min(
82    (progressInLevel / xpNeededForLevel) * 100,
83    100
84  );

85  const rarityStyles = {
86    common: "border-muted-foreground/30 bg-muted/20",
87    rare: "border-[#1E90FF]/40 bg-[#1E90FF]/10",
88    epic: "border-[#FF69B4]/40 bg-[#FF69B4]/10",
89    legendary: "border-yellow-400/40 bg-yellow-400/10 shadow-[0_0_12px_rgba(250,204,21,0.15)]",
90  };

91  const rarityGlow = {
92    common: "",
93    rare: "hover:shadow-[0_0_12px_rgba(30,144,255,0.3)]",
94    epic: "hover:shadow-[0_0_12px_rgba(255,105,180,0.3)]",
95    legendary: "hover:shadow-[0_0_16px_rgba(250,204,21,0.4)]",
96  };

97  const activityIcons = {
98    xp_gain: Zap,
99    achievement: Award,
100   trade: Coins,
101   quest: Target,
102   level_up: TrendingUp,
103   streak: Flame,
104 };

105   const activityColors = {
106   xp_gain: "text-[#00FFAA]",
107   achievement: "text-[#FF69B4]",
108   trade: "text-[#1E90FF]",
109   quest: "text-yellow-400",
110   level_up: "text-[#FF69B4]",
111   streak: "text-orange-500",
112 };

113   return (
114   <div className="rounded-xl border border-border bg-card overflow-hidden">
115     {/* Header Banner */}
116     <div className="relative h-24 bg-gradient-to-r from-[#1E90FF]/20 via-[#FF69B4]/20 to-[#00FFAA]/20">
117       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

118       {/* Rank Badge in corner */}
119       <div className="absolute top-3 right-3">
120         <div className={`flex items-center gap-1.5 rounded-full border border-border ${currentRank.bgColor} px-3 py-1`}>
121           <RankIcon className={`h-3.5 w-3.5 ${currentRank.color}`} />
122           <span className={`text-xs font-semibold ${currentRank.color}`}>
123             {currentRank.name}
124           </span>
125         </div>
126       </div>
127     </div>

128     {/* Profile Info */}
129     <div className="relative px-5 pb-5">
130       {/* Avatar */}
131       <div className="absolute -top-10 left-5">
132         <div className="relative">
133           <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#1E90FF] via-[#FF69B4] to-[#00FFAA] p-[3px]">
134             <div className="flex h-full w-full items-center justify-center rounded-full bg-card text-2xl font-bold">
135               {avatar ? (
136                 <img
137                   src={avatar}
138                   alt={username}
139                   className="h-full w-full rounded-full object-cover"
140                 />
141               ) : (
142                 <span className="bg-gradient-to-br from-[#1E90FF] to-[#FF69B4] bg-clip-text text-transparent">
143                   {username.slice(0, 2).toUpperCase()}
144                 </span>
145               )}
146             </div>
147           </div>
148           {/* Level Badge */}
149           <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#1E90FF] to-[#FF69B4] text-xs font-bold text-white shadow-lg">
150             {level}
151           </div>
152         </div>
153       </div>

154       {/* Username and join date */}
155       <div className="ml-24 pt-2">
156         <h2 className="text-xl font-bold">{username}</h2>
157         <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
158           <Clock className="h-3 w-3" />
159           <span>Joined {joinedDate}</span>
160         </div>
161       </div>

162       {/* XP Progress Bar */}
163       <div className="mt-5 space-y-2">
164         <div className="flex items-center justify-between">
165           <div className="flex items-center gap-2">
166             <Zap className="h-4 w-4 text-[#FF69B4]" />
167             <span className="text-sm font-medium">
168               {currentXp.toLocaleString()} XP
169             </span>
170           </div>
171           {nextRank && (
172             <span className="text-xs text-muted-foreground">
173               {(xpForNextLevel - currentXp).toLocaleString()} XP to{" "}
               <span className={nextRank.color}>{nextRank.name}</span>
174             </span>
175           )}
176         </div>
177         <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
178           <div
179             className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#1E90FF] via-[#FF69B4] to-[#00FFAA] transition-all duration-500"
180             style={{ width: `${progressPercent}%` }}
181           />
182           <div
183             className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#1E90FF] via-[#FF69B4] to-[#00FFAA] blur-sm opacity-50"
184             style={{ width: `${progressPercent}%` }}
185           />
186         </div>
187       </div>

188       {/* Stats Row */}
189       <div className="mt-5 grid grid-cols-5 gap-2">
190         <div className="flex flex-col items-center rounded-lg border border-border bg-secondary/30 p-2">
191           <span className="text-lg font-bold text-[#1E90FF]">{stats.totalTrades}</span>
192           <span className="text-[10px] text-muted-foreground">Trades</span>
193         </div>
194         <div className="flex flex-col items-center rounded-lg border border-border bg-secondary/30 p-2">
195           <span className="text-lg font-bold text-[#00FFAA]">{stats.winRate}%</span>
196           <span className="text-[10px] text-muted-foreground">Win Rate</span>
197         </div>
198         <div className="flex flex-col items-center rounded-lg border border-border bg-secondary/30 p-2">
199           <div className="flex items-center gap-1">
200             <Flame className="h-3.5 w-3.5 text-orange-500" />
201             <span className="text-lg font-bold text-orange-500">{stats.streak}</span>
202           </div>
203           <span className="text-[10px] text-muted-foreground">Streak</span>
204         </div>
205         <div className="flex flex-col items-center rounded-lg border border-border bg-secondary/30 p-2">
206           <span className="text-lg font-bold text-[#FF69B4]">{stats.questsCompleted}</span>
207           <span className="text-[10px] text-muted-foreground">Quests</span>
208         </div>
209         <div className="flex flex-col items-center rounded-lg border border-border bg-secondary/30 p-2">
210           <span className="text-lg font-bold text-yellow-400">{stats.daysActive}</span>
211           <span className="text-[10px] text-muted-foreground">Days</span>
212         </div>
213       </div>

214       {/* Achievement Badge Grid */}
215       <div className="mt-5">
216         <div className="flex items-center justify-between mb-3">
217           <div className="flex items-center gap-2">
218             <Trophy className="h-4 w-4 text-[#FF69B4]" />
219             <h3 className="font-semibold">Achievements</h3>
220           </div>
221           <span className="text-xs text-muted-foreground">
222             {achievements.filter((a) => a.unlocked).length}/{achievements.length} Unlocked
223           </span>
224         </div>
225         <div className="grid grid-cols-6 gap-2">
226           {achievements.map((achievement) => (
227             <div
228               key={achievement.id}
229               className={`group relative flex h-12 w-14 items-center justify-center rounded-lg border transition-all duration-200 ${
230                 achievement.unlocked
231                   ? `${rarityStyles[achievement.rarity]} ${rarityGlow[achievement.rarity]}`
232                   : "border-border bg-secondary/20 opacity-40 grayscale"
233               }`}
234             >
235               <span className="text-2xl">{achievement.icon}</span>
236
237               {/* Tooltip */}
238               <div className="absolute -top-16 left-1/2 z-20 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
239                 <div className="whitespace-nowrap rounded-lg bg-popover border border-border px-3 py-2 shadow-xl">
240                   <p className="font-semibold">{achievement.name}</p>
241                   <p className="text-muted-foreground">{achievement.description}</p>
242                   {achievement.unlocked && achievement.unlockedAt && (
243                     <p className="text-[#00FFAA] mt-1">{achievement.unlockedAt}</p>
244                   )}
245                 </div>
246                 <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-popover" />
247               </div>
248             </div>
249           ))}
250         </div>
251       </div>

252       {/* Recent Activity Feed */}
253       <div className="mt-5">
254         <div className="flex items-center gap-2 mb-3">
255           <BookOpen className="h-4 w-4 text-[#1E90FF]" />
256           <h3 className="font-semibold">Recent Activity</h3>
257         </div>
258         <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
259           {recentActivity.map((activity) => {
260             const ActivityIcon = activityIcons[activity.type];
261             return (
262               <div
263                 key={activity.id}
264                 className="flex items-start gap-3 rounded-lg border border-border bg-secondary/20 p-3 transition-colors hover:bg-secondary/40"
265               >
266                 <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary ${activityColors[activity.type]}`}>
267                   <ActivityIcon className="h-4 w-4" />
268                 </div>
269                 <div className="flex-1 min-w-0">
270                   <div className="flex items-center justify-between gap-2">
271                     <p className="text-sm font-medium truncate">{activity.title}</p>
272                     {activity.xp && (
273                       <span className="shrink-0 text-xs font-semibold text-[#00FFAA]">
274                         +{activity.xp} XP
275                       </span>
276                     )}
277                   </div>
278                   <p className="text-xs text-muted-foreground truncate">
279                     {activity.description}
280                   </p>
281                   <p className="text-[10px] text-muted-foreground/60 mt-1">
282                     {activity.timestamp}
283                   </p>
284                 </div>
285               </div>
286             );
287           })}
288         </div>
289       </div>
290     </div>
291   );
292 }