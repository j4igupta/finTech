1	"use client";
2
3	import { useState, useEffect } from "react";
4	import { Zap, Clock, Trophy, Flame, Check, X } from "lucide-react";

5	interface Player {
6	  username: string;
7	  avatar: string;
8	  level: number;
9	  score: number;
10	  answered?: boolean;
11	  correct?: boolean;
12	}

13	interface Question {
14	  id: string;
15	  text: string;
16	  options: string[];
17	  correctIndex: number;
18	  category: string;
19	}

20	interface FlashBattleProps {
21	  player1: Player;
22	  player2: Player;
23	  question: Question;
24	  timeLimit?: number;
25	  roundNumber?: number;
26	  totalRounds?: number;
27	}

28	export function BattleArena({
29	  player1,
30	  player2,
31	  question,
32	  timeLimit = 15,
33	  roundNumber = 1,
34	  totalRounds = 5,
35	}: FlashBattleProps) {
36	  const [timeLeft, setTimeLeft] = useState(timeLimit);
37	  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
38	  const [showResult, setShowResult] = useState(false);
39	  const [isTimerCritical, setIsTimerCritical] = useState(false);

40	  useEffect(() => {
41	    if (timeLeft <= 0) {
42	      setShowResult(true);
43	      return;
44	    }

45	    if (timeLeft <= 5) {
46	      setIsTimerCritical(true);
47	    }

48	    const timer = setInterval(() => {
49	      setTimeLeft((prev) => prev - 1);
50	    }, 1000);

51	    return () => clearInterval(timer);
52	  }, [timeLeft]);

53	  const handleAnswer = (index: number) => {
54	    if (selectedAnswer !== null || showResult) return;
55	    setSelectedAnswer(index);
56	    setShowResult(true);
57	  };

58	  const getAnswerStyle = (index: number) => {
59	    if (!showResult) {
60	      if (selectedAnswer === index) {
61	        return "border-[#1E90FF] bg-[#1E90FF]/20 ring-2 ring-[#1E90FF]/50";
62	      }
63	      return "border-border bg-secondary/30 hover:border-[#1E90FF]/50 hover:bg-secondary/50 cursor-pointer";
64	    }

65	    if (index === question.correctIndex) {
66	      return "border-[#00FFAA] bg-[#00FFAA]/20 ring-2 ring-[#00FFAA]/50";
67	    }

68	    if (selectedAnswer === index && index !== question.correctIndex) {
69	      return "border-red-500 bg-red-500/20 ring-2 ring-red-500/50";
70	    }

71	    return "border-border bg-secondary/30 opacity-50";
72	  };

73	  const formatTime = (seconds: number) => {
74	    return seconds.toString().padStart(2, "0");
75	  };

76	  return (
77	    <div className="rounded-xl border border-border bg-card overflow-hidden">
78	      {/* Header */}
79	      <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-3">
80	        <div className="flex items-center gap-2">
81	          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF69B4] to-[#1E90FF]">
82	            <Zap className="h-4 w-4 text-white" />
83	          </div>
84	          <span className="font-bold">Flash Battle</span>
85	        </div>
86	        <div className="flex items-center gap-3">
87	          <div className="flex items-center gap-1.5 rounded-full bg-[#FF69B4]/10 px-3 py-1">
88	            <Trophy className="h-3.5 w-3.5 text-[#FF69B4]" />
89	            <span className="text-xs font-medium text-[#FF69B4]">
90	              +500 XP
91	            </span>
92	          </div>
93	          <span className="text-xs text-muted-foreground">
94	            Round {roundNumber}/{totalRounds}
95	          </span>
96	        </div>
97	      </div>

98	      {/* Player Arena */}
99	      <div className="relative px-6 py-8">
100	        {/* Background glow effects */}
101	        <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-[#1E90FF]/20 blur-3xl" />
102	        <div className="absolute right-1/4 top-1/2 translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-[#FF69B4]/20 blur-3xl" />

103	        <div className="relative flex items-center justify-center gap-4 sm:gap-8">
104	          {/* Player 1 */}
105	          <div className="flex flex-col items-center gap-3">
106	            <div className="relative">
107	              {/* Avatar ring */}
108	              <div
109	                className={`absolute -inset-1 rounded-full bg-gradient-to-br from-[#1E90FF] to-[#1E90FF]/50 ${
110	                  player1.answered && player1.correct ? "animate-pulse" : ""
111	                }`}
112	              />
113	              <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-background bg-gradient-to-br from-[#1E90FF]/20 to-[#1E90FF]/5 flex items-center justify-center overflow-hidden">
114	                <span className="text-2xl sm:text-3xl font-bold text-[#1E90FF]">
115	                  {player1.username.charAt(0)}
116	                </span>
117	              </div>
118	              {/* Level badge */}
119	              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-[#1E90FF] text-xs font-bold text-white">
120	                {player1.level}
121	              </div>
122	              {/* Answer indicator */}
123	              {player1.answered && (
124	                <div
125	                  className={`absolute -top-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full ${
126	                    player1.correct ? "bg-[#00FFAA]" : "bg-red-500"
127	                  }`}
128	                >
129	                  {player1.correct ? (
130	                    <Check className="h-3.5 w-3.5 text-black" />
131	                  ) : (
132	                    <X className="h-3.5 w-3.5 text-white" />
133	                  )}
134	                </div>
135	              )}
136	            </div>
137	            <div className="text-center">
138	              <p className="font-semibold text-sm sm:text-base">{player1.username}</p>
139	              <p className="text-lg sm:text-xl font-bold text-[#1E90FF]">
140	                {player1.score}
141	              </p>
142	            </div>
143	          </div>

144	          {/* VS Badge */}
145	          <div className="relative flex flex-col items-center gap-2">
146	            <div className="relative">
147	              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF69B4] to-[#1E90FF] blur-lg opacity-50" />
148	              <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 border-[#FF69B4]/50 bg-gradient-to-br from-[#FF69B4]/20 to-[#1E90FF]/20 backdrop-blur-sm">
149	                <span className="text-xl sm:text-2xl font-black bg-gradient-to-br from-[#FF69B4] to-[#1E90FF] bg-clip-text text-transparent">
150	                  VS
151	                </span>
152	              </div>
153	            </div>
154	            {/* Timer */}
155	            <div
156	              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
157	                isTimerCritical
158	                  ? "bg-red-500/20 border border-red-500/50"
159	                  : "bg-secondary/50 border border-border"
160	              }`}
161	            >
162	              <Clock
163	                className={`h-4 w-4 ${
164	                  isTimerCritical ? "text-red-500 animate-pulse" : "text-muted-foreground"
165	                }`}
166	              />
167	              <span
168	                className={`text-lg font-mono font-bold ${
169	                  isTimerCritical ? "text-red-500" : "text-foreground"
170	                }`}
171	              >
172	                {formatTime(timeLeft)}
173	              </span>
174	            </div>
175	          </div>

176	          {/* Player 2 */}
177	          <div className="flex flex-col items-center gap-3">
178	            <div className="relative">
179	              {/* Avatar ring */}
180	              <div
181	                className={`absolute -inset-1 rounded-full bg-gradient-to-br from-[#FF69B4] to-[#FF69B4]/50 ${
182	                  player2.answered && player2.correct ? "animate-pulse" : ""
183	                }`}
184	              />
185	              <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-background bg-gradient-to-br from-[#FF69B4]/20 to-[#FF69B4]/5 flex items-center justify-center overflow-hidden">
186	                <span className="text-2xl sm:text-3xl font-bold text-[#FF69B4]">
187	                  {player2.username.charAt(0)}
188	                </span>
189	              </div>
190	              {/* Level badge */}
191	              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-[#FF69B4] text-xs font-bold text-white">
192	                {player2.level}
193	              </div>
194	              {/* Answer indicator */}
195	              {player2.answered && (
196	                <div
197	                  className={`absolute -top-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full ${
198	                    player2.correct ? "bg-[#00FFAA]" : "bg-red-500"
199	                  }`}
200	                >
201	                  {player2.correct ? (
202	                    <Check className="h-3.5 w-3.5 text-black" />
203	                  ) : (
204	                    <X className="h-3.5 w-3.5 text-white" />
205	                  )}
206	                </div>
207	              )}
208	            </div>
209	            <div className="text-center">
210	              <p className="font-semibold text-sm sm:text-base">{player2.username}</p>
211	              <p className="text-lg sm:text-xl font-bold text-[#FF69B4]">
212	                {player2.score}
213	              </p>
214	            </div>
215	          </div>
216	        </div>

217	        {/* Streak indicator */}
218	        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5">
219	          <Flame className="h-3 w-3 text-orange-500" />
220	          <span className="text-xs font-medium text-orange-500">3 Streak</span>
221	        </div>
222	      </div>

223	      {/* Question Panel */}
224	      <div className="border-t border-border bg-secondary/20 p-4 sm:p-6">
225	        {/* Category */}
226	        <div className="mb-3 flex items-center justify-center">
227	          <span className="rounded-full bg-[#1E90FF]/10 px-3 py-1 text-xs font-medium text-[#1E90FF]">
228	            {question.category}
229	          </span>
230	        </div>

231	        {/* Question text */}
232	        <p className="mb-5 text-center text-base sm:text-lg font-medium text-balance">
233	          {question.text}
234	        </p>

235	        {/* Answer options */}
236	        <div className="grid gap-3 sm:grid-cols-2">
237	          {question.options.map((option, index) => (
238	            <button
239	              key={index}
240	              onClick={() => handleAnswer(index)}
241	              disabled={showResult}
242	              className={`relative flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${getAnswerStyle(
243	                index
244	              )}`}
245	            >
246	              <span
247	                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
248	                  showResult && index === question.correctIndex
249	                    ? "bg-[#00FFAA] text-black"
250	                    : showResult && selectedAnswer === index && index !== question.correctIndex
251	                    ? "bg-red-500 text-white"
252	                    : "bg-secondary text-muted-foreground"
253	                }`}
254	              >
255	                {String.fromCharCode(65 + index)}
256	              </span>
257	              <span className="text-sm font-medium">{option}</span>
258	              {showResult && index === question.correctIndex && (
259	                <Check className="ml-auto h-5 w-5 text-[#00FFAA]" />
260	              )}
261	              {showResult &&
262	                selectedAnswer === index &&
263	                index !== question.correctIndex && (
264	                <X className="ml-auto h-5 w-5 text-red-500" />
265	              )}
266	            </button>
267	          ))}
268	        </div>

269	        {/* Result message */}
270	        {showResult && (
271	          <div className="mt-4 text-center">
272	            {selectedAnswer === question.correctIndex ? (
273	              <p className="text-[#00FFAA] font-semibold">
274	                Correct! +100 XP
275	              </p>
276	            ) : selectedAnswer !== null ? (
277	              <p className="text-red-500 font-semibold">
278	                Wrong answer!
279	              </p>
280	            ) : (
281	              <p className="text-muted-foreground font-semibold">
282	                Time&apos;s up!
283	              </p>
284	            )}
285	          </div>
286	        )}
287	      </div>
288	    </div>
289	  );
290	}
