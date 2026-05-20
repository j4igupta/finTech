1	"use client";
2
3	import { CheckCircle2, Circle, Gift, Flame, Target, Clock } from "lucide-react";
4
5	interface Quest {
6	  id: string;
7	  title: string;
8	  description: string;
9	  xpReward: number;
10	  progress: number;
11	  total: number;
12	  completed: boolean;
13	  icon: "flame" | "target" | "gift" | "clock";
14	}

15	const iconMap = {
16	  flame: Flame,
17	  target: Target,
18	  gift: Gift,
19	  clock: Clock,
20	};

21	interface DailyQuestsProps {
22	  quests: Quest[];
23	}

24	export function QuestList({ quests }: DailyQuestsProps) {
25	  const completedCount = quests.filter((q) => q.completed).length;

26	  return (
27	    <div className="rounded-xl border border-border bg-card p-5">
28	      <div className="flex items-center justify-between mb-4">
29	        <div>
30	          <h3 className="font-semibold">Daily Quests</h3>
31	          <p className="text-xs text-muted-foreground">
32	            {completedCount}/{quests.length} completed
33	          </p>
34	        </div>
35	        <div className="flex items-center gap-1.5 rounded-full bg-[#FF69B4]/10 px-3 py-1.5">
36	          <Flame className="h-4 w-4 text-[#FF69B4]" />
37	          <span className="text-xs font-medium text-[#FF69B4]">3 day streak</span>
38	        </div>
39	      </div>

40	      <div className="space-y-3">
41	        {quests.map((quest) => {
42	          const Icon = iconMap[quest.icon];
43	          return (
44	            <div
45	              key={quest.id}
	              className={`group relative rounded-lg border p-3 transition-all ${
46	                quest.completed
47	                  ? "border-[#00FFAA]/30 bg-[#00FFAA]/5"
48	                  : "border-border bg-secondary/30 hover:border-[#1E90FF]/30"
49	              }`}
50	            >
51	              <div className="flex items-start gap-3">
52	                <div
53	                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
54	                    quest.completed
55	                      ? "bg-[#00FFAA]/20 text-[#00FFAA]"
56	                      : "bg-secondary text-muted-foreground"
57	                  }`}
58	                >
59	                  <Icon className="h-4 w-4" />
60	                </div>
61	                <div className="flex-1 min-w-0">
62	                  <div className="flex items-center justify-between gap-2">
63	                    <p
64	                      className={`text-sm font-medium ${
65	                        quest.completed ? "text-[#00FFAA]" : ""
66	                      }`}
67	                    >
68	                      {quest.title}
69	                    </p>
70	                    <div className="flex items-center gap-1 flex-shrink-0">
71	                      {quest.completed ? (
72	                        <CheckCircle2 className="h-4 w-4 text-[#00FFAA]" />
73	                      ) : (
74	                        <Circle className="h-4 w-4 text-muted-foreground" />
75	                      )}
76	                    </div>
77	                  </div>
78	                  <p className="text-xs text-muted-foreground mt-0.5">
79	                    {quest.description}
80	                  </p>
81	                  <div className="flex items-center justify-between mt-2">
82	                    <div className="flex-1 mr-3">
83	                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
84	                        <div
85	                          className={`h-full rounded-full transition-all ${
86	                            quest.completed
87	                              ? "bg-[#00FFAA]"
88	                              : "bg-gradient-to-r from-[#1E90FF] to-[#FF69B4]"
89	                          }`}
90	                          style={{
91	                            width: `${(quest.progress / quest.total) * 100}%`,
92	                          }}
93	                        />
94	                      </div>
95	                    </div>
96	                    <span className="text-xs font-medium text-[#FF69B4]">
97	                      +{quest.xpReward} XP
98	                    </span>
99	                  </div>
100	                </div>
101	              </div>
102	            </div>
103	          );
104	        })}
105	      </div>
106	    </div>
107	  );
108	}
