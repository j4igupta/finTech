1	"use client";
2
3	import { Crown, Medal, Flame, TrendingUp, ChevronUp, ChevronDown } from "lucide-react";
4	import {
5	  Table,
6	  TableBody,
7	  TableCell,
8	  TableHead,
9	  TableHeader,
10	  TableRow,
11	} from "@/components/ui/table";
12	import { cn } from "@/lib/utils";

13	interface LeaderboardPlayer {
14	  rank: number;
15	  username: string;
16	  avatar: string;
17	  xp: number;
18	  winStreak: number;
19	  change: "up" | "down" | "same";
20	  isCurrentUser?: boolean;
21	}

22	interface LeaderboardProps {
23	  players: LeaderboardPlayer[];
24	  className?: string;
25	}

26	// Rank badge component for top 3
27	function RankBadge({ rank }: { rank: number }) {
28	  if (rank === 1) {
29	    return (
30	      <div className="relative flex h-10 w-10 items-center justify-center">
31	        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to amber-600 animate-pulse-glow" />
32	        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-500/30">
33	          <Crown className="h-4 w-4 text-yellow-900" />
34	        </div>
35	      </div>
36	    );
37	  }

38	  if (rank === 2) {
39	    return (
40	      <div className="relative flex h-10 w-10 items-center justify-center">
41	        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 opacity-60" />
42	        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-400 shadow-lg shadow-slate-400/30">
43	          <Medal className="h-4 w-4 text-slate-700" />
44	        </div>
45	      </div>
46	    );
47	  }

48	  if (rank === 3) {
49	    return (
50	      <div className="relative flex h-10 w-10 items-center justify-center">
51	        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 opacity-60" />
52	        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-600/30">
53	          <Medal className="h-4 w-4 text-amber-200" />
54	        </div>
55	      </div>
56	    );
57	  }

58	  return (
59	    <div className="flex h-10 w-10 items-center justify-center">
60	      <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
61	    </div>
62	  );
63	}

64	// Win streak badge
65	function WinStreakBadge({ streak }: { streak: number }) {
66	  if (streak === 0) return <span className="text-muted-foreground">-</span>;

67	  let bgColor = "bg-secondary";
68	  let textColor = "text-muted-foreground";
69	  let borderColor = "border-border";

70	  if (streak >= 10) {
71	    bgColor = "bg-[#FF69B4]/20";
72	    textColor = "text-[#FF69B4]";
73	    borderColor = "border-[#FF69B4]/40";
74	  } else if (streak >= 5) {
75	    bgColor = "bg-[#1E90FF]/20";
76	    textColor = "text-[#1E90FF]";
77	    borderColor = "border-[#1E90FF]/40";
78	  } else if (streak >= 3) {
79	    bgColor = "bg-[#00FFAA]/20";
80	    textColor = "text-[#00FFAA]";
81	    borderColor = "border-[#00FFAA]/40";
82	  }

83	  return (
84	    <div
85	      className={cn(
86	        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
87	        bgColor,
88	        borderColor
89	      )}
90	    >
91	      <Flame className={cn("h-3.5 w-3.5", textColor)} />
92	      <span className={cn("text-xs font-bold", textColor)}>{streak}</span>
93	    </div>
94	  );
95	}

96	// Avatar with rank glow effect
97	function PlayerAvatar({
98	  src,
99	  rank,
100	  username,
101	}: {
102	  src: string;
103	  rank: number;
104	  username: string;
105	}) {
106	  const glowClass =
107	    rank === 1
108	      ? "ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/30"
109	      : rank === 2
110	      ? "ring-2 ring-slate-400 shadow-lg shadow-slate-400/20"
111	      : rank === 3
112	      ? "ring-2 ring-amber-600 shadow-lg shadow-amber-600/20"
113	      : "ring-1 ring-border";

114	  return (
115	    <div
116	      className={cn(
117	        "relative h-10 w-10 overflow-hidden rounded-full bg-secondary",
118	        glowClass
119	      )}
120	    >
121	      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1E90FF]/30 to-[#FF69B4]/30 text-sm font-bold uppercase text-foreground">
122	        {username.slice(0, 2)}
123	      </div>
124	    </div>
125	  );
126	}

127	export function Leaderboard({ players, className }: LeaderboardProps) {
128	  return (
129	    <div
130	      className={cn(
131	        "rounded-xl border border-border bg-card overflow-hidden",
132	        className
133	      )}
134	    >
135	      {/* Header */}
136	      <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-card via-[#1E90FF]/5 to-[#FF69B4]/5 p-5">
137	        <div className="flex items-center gap-3">
138	          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#1E90FF] to-[#FF69B4]">
139	            <TrendingUp className="h-5 w-5 text-white" />
140	          </div>
141	          <div>
142	            <h3 className="font-semibold text-foreground">Global Leaderboard</h3>
143	            <p className="text-xs text-muted-foreground">Top traders this season</p>
144	          </div>
145	        </div>
146	        <button className="text-xs font-medium text-[#1E90FF] hover:underline">
147	          View All
148	        </button>
149	      </div>

150	      {/* Table */}
151	      <Table>
152	        <TableHeader>
153	          <TableRow className="border-border hover:bg-transparent">
154	            <TableHead className="w-16 text-center text-xs text-muted-foreground">
155	              Rank
156	            </TableHead>
157	            <TableHead className="text-xs text-muted-foreground">Player</TableHead>
158	            <TableHead className="text-right text-xs text-muted-foreground">XP</TableHead>
159	            <TableHead className="text-center text-xs text-muted-foreground">
160	              Streak
161	            </TableHead>
162	            <TableHead className="w-12 text-center text-xs text-muted-foreground">
163	              <span className="sr-only">Trend</span>
164	            </TableHead>
165	          </TableRow>
166	        </TableHeader>
167	        <TableBody>
168	          {players.map((player, index) => (
169	            <TableRow
170	              key={player.rank}
171	              className={cn(
172	                "border-border transition-all",
173	                player.isCurrentUser &&
174	                  "bg-[#1E90FF]/10 hover:bg-[#1E90FF]/15 border-l-2 border-l-[#1E90FF]",
175	                player.rank <= 3 &&
176	                  !player.isCurrentUser &&
177	                  "bg-gradient-to-r from-card to-secondary/30",
178	                index === 0 && "border-t-0"
179	              )}
180	            >
181	              {/* Rank */}
182	              <TableCell className="text-center">
183	                <div className="flex justify-center">
184	                  <RankBadge rank={player.rank} />
185	                </div>
186	              </TableCell>

187	              {/* Player info */}
188	              <TableCell>
189	                <div className="flex items-center gap-3">
190	                  <PlayerAvatar
191	                    src={player.avatar}
192	                    rank={player.rank}
193	                    username={player.username}
194	                  />
195	                  <div>
196	                    <p
197	                      className={cn(
198	                        "font-medium",
199	                        player.isCurrentUser && "text-[#1E90FF]",
200	                        player.rank === 1 && "text-yellow-400",
201	                        player.rank === 2 && "text-slate-300",
202	                        player.rank === 3 && "text-amber-500"
203	                      )}
204	                    >
205	                      {player.username}
206	                      {player.isCurrentUser && (
207	                        <span className="ml-2 text-xs text-muted-foreground">(You)</span>
208	                      )}
209	                    </p>
210	                    {player.rank <= 3 && (
211	                      <p className="text-xs text-muted-foreground">
212	                        {player.rank === 1
213	                          ? "Champion"
214	                          : player.rank === 2
215	                          ? "Elite"
216	                          : "Veteran"}
217	                      </p>
218	                    )}
219	                  </div>
220	                </div>
221	              </TableCell>

222	              {/* XP */}
223	              <TableCell className="text-right">
224	                <span
225	                  className={cn(
226	                    "font-mono font-bold",
227	                    player.rank === 1
228	                      ? "text-yellow-400"
229	                      : player.rank === 2
230	                      ? "text-slate-300"
231	                      : player.rank === 3
232	                      ? "text-amber-500"
233	                      : "text-foreground"
234	                  )}
235	                >
236	                  {player.xp.toLocaleString()}
237	                </span>
238	                <span className="ml-1 text-xs text-muted-foreground">XP</span>
239	              </TableCell>

240	              {/* Win streak */}
241	              <TableCell className="text-center">
242	                <WinStreakBadge streak={player.winStreak} />
243	              </TableCell>

244	              {/* Trend indicator */}
245	              <TableCell className="text-center">
246	                {player.change === "up" && (
247	                  <ChevronUp className="mx-auto h-5 w-5 text-[#00FFAA]" />
248	                )}
249	                {player.change === "down" && (
250	                  <ChevronDown className="mx-auto h-5 w-5 text-destructive" />
251	                )}
252	                {player.change === "same" && (
253	                  <div className="mx-auto h-1 w-4 rounded-full bg-muted-foreground/30" />
254	                )}
255	              </TableCell>
256	            </TableRow>
257	          ))}
258	        </TableBody>
259	      </Table>

260	      {/* Footer with current user position if not in top list */}
261	      <div className="border-t border-border bg-secondary/30 px-5 py-3">
262	        <p className="text-center text-xs text-muted-foreground">
263	          Season ends in <span className="font-medium text-[#FF69B4]">14 days</span>
264	        </p>
265	      </div>
266	    </div>
267	  );
268	}
