"use client";
2
3	import { useState, useRef, useEffect } from "react";
4	import { Bot, Send, X, Sparkles, ChevronDown } from "lucide-react";
5	import { Button } from "@/components/ui/button";
6
7	interface Message {
8	  id: string;
9	  role: "user" | "assistant";
10	  content: string;
1}
12
	const suggestions = [
13	  "How can I grow my portfolio?",
14	  "What&apos;s my risk level?",
15	  "Tips for earning more XP?",
16	];

17	export function CoachChat() {
18	  const [isOpen, setIsOpen] = useState(false);
19	  const [messages, setMessages] = useState<Message[]>([
20	    {
2      id: "1",
22	      role: "assistant",
23	      content:
24	        "Hey champion! 🎮 I&apos;m your AI finance coach. Ready to level up your investing game? Ask me anything about your portfolio, strategies, or how to earn more XP!",
25	    },
26	  ]);
27	  const [input, setInput] = useState("");
28	  const [isTyping, setIsTyping] = useState(false);
29	  const messagesEndRef = useRef<HTMLDivElement>(null);

30	  const scrollToBottom = () => {
3    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
32	  };

33	  useEffect(() => {
34	    scrollToBottom();
35	  }, [messages]);

36	  const handleSend = async () => {
37	    if (!input.trim()) return;

38	    const userMessage: Message = {
39	      id: Date.now().toString(),
40	      role: "user",
4      content: input,
42	    };

43	    setMessages((prev) => [...prev, userMessage]);
44	    setInput("");
45	    setIsTyping(true);

46	    // Simulate AI response
47	    setTimeout(() => {
48	      const responses = [
49	        "Great question! 💡 Based on your portfolio, I&apos;d recommend diversifying into tech and green energy. This could boost your XP by completing the &apos;Diversification Quest&apos;!",
50	        "Looking at your risk profile, you&apos;re playing it safe - which is smart! 🛡️ Want me to suggest some low-risk, high-reward opportunities?",
5        "You&apos;re on fire! 🔥 Your weekly trading streak is at 5 days. Keep it up for a bonus 500 XP reward!",
52	        "Pro tip: Set up recurring investments to unlock the &apos;Consistency Badge&apos; and earn passive XP every month! 🏆",
53	      ];

54	      const assistantMessage: Message = {
55	        id: (Date.now() + 1).toString(),
56	        role: "assistant",
57	        content: responses[Math.floor(Math.random() * responses.length)],
58	      };

59	      setMessages((prev) => [...prev, assistantMessage]);
60	      setIsTyping(false);
6    }, 1500);
62	  };

63	  return (
64	    <>
65	      {/* Floating button */}
66	      <button
67	        onClick={() => setIsOpen(true)}
68	        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1E90FF] to-[#FF69B4] shadow-lg shadow-[#1E90FF]/25 transition-all hover:scale-105 hover:shadow-[#1E90FF]/40 ${
69	          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
70	        }`}
7      >
72	        <Bot className="h-6 w-6 text-white" />
73	        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#00FFAA] text-[10px] font-bold text-background">
74	          AI
75	        </span>
76	      </button>

77	      {/* Chat window */}
78	      <div
79	        className={`fixed bottom-6 right-6 z-50 flex w-80 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-[#1E90FF]/10 transition-all duration-300 sm:w-96 ${
80	          isOpen
8            ? "scale-100 opacity-100"
82	            : "pointer-events-none scale-95 opacity-0"
83	        }`}
84	        style={{ height: isOpen ? "480px" : "0" }}
85	      >
86	        {/* Header */}
87	        <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-[#1E90FF]/10 to-[#FF69B4]/10 px-4 py-3">
88	          <div className="flex items-center gap-3">
89	            <div className="relative">
90	              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#1E90FF] to-[#FF69B4]">
9                <Bot className="h-4 w-4 text-white" />
92	              </div>
93	              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-[#00FFAA]" />
94	            </div>
95	            <div>
96	              <p className="font-semibold text-sm">Finance Coach</p>
97	              <p className="text-xs text-[#00FFAA]">Online • Ready to help</p>
98	            </div>
99	          </div>
100	          <div className="flex items-center gap-1">
10            <Button
102	              variant="ghost"
103	              size="icon"
104	              className="h-8 w-8 text-muted-foreground hover:text-foreground"
105	              onClick={() => setIsOpen(false)}
106	            >
107	              <ChevronDown className="h-4 w-4" />
108	            </Button>
109	            <Button
110	              variant="ghost"
11              size="icon"
112	              className="h-8 w-8 text-muted-foreground hover:text-foreground"
113	              onClick={() => setIsOpen(false)}
114	            >
115	              <X className="h-4 w-4" />
116	            </Button>
117	          </div>
118	        </div>

119	        {/* Messages */}
120	        <div className="flex-1 overflow-y-auto p-4 space-y-4">
12          {messages.map((message) => (
122	            <div
123	              key={message.id}
124	              className={`flex ${
125	                message.role === "user" ? "justify-end" : "justify-start"
126	              }`}
127	            >
128	              <div
129	                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
130	                  message.role === "user"
13                    ? "bg-gradient-to-r from-[#1E90FF] to-[#1E90FF]/80 text-white"
132	                    : "bg-secondary text-secondary-foreground"
133	                }`}
134	              >
135	                {message.content}
136	              </div>
137	            </div>
138	          ))}
139	          {isTyping && (
140	            <div className="flex justify-start">
14              <div className="flex items-center gap-1 rounded-2xl bg-secondary px-4 py-3">
142	                <span className="h-2 w-2 animate-bounce rounded-full bg-[#1E90FF]" style={{ animationDelay: "0ms" }} />
143	                <span className="h-2 w-2 animate-bounce rounded-full bg-[#FF69B4]" style={{ animationDelay: "150ms" }} />
144	                <span className="h-2 w-2 animate-bounce rounded-full bg-[#00FFAA]" style={{ animationDelay: "300ms" }} />
145	              </div>
146	            </div>
147	          )}
148	          <div ref={messagesEndRef} />
149	        </div>

150	        {/* Suggestions */}
15        {messages.length === 1 && (
152	          <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
153	            {suggestions.map((suggestion, i) => (
154	              <button
155	                key={i}
156	                onClick={() => setInput(suggestion.replace(/&apos;/g, "'"))}
157	                className="flex-shrink-0 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-[#1E90FF]/50 hover:text-foreground"
158	              >
159	                {suggestion.replace(/&apos;/g, "'")}
160	              </button>
16            ))}
162	          </div>
163	        )}

164	        {/* Input */}
165	        <div className="border-t border-border p-3">
166	          <div className="flex items-center gap-2">
167	            <div className="relative flex-1">
168	              <input
169	                type="text"
170	                value={input}
17                onChange={(e) => setInput(e.target.value)}
172	                onKeyDown={(e) => e.key === "Enter" && handleSend()}
173	                placeholder="Ask your coach..."
174	                className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 pr-10 text-sm placeholder:text-muted-foreground focus:border-[#1E90FF]/50 focus:outline-none focus:ring-1 focus:ring-[#1E90FF]/50"
175	              />
176	              <Sparkles className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF69B4]/50" />
177	            </div>
178	            <Button
179	              size="icon"
180	              onClick={handleSend}
18              disabled={!input.trim()}
182	              className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#1E90FF] to-[#FF69B4] text-white hover:opacity-90 disabled:opacity-50"
183	            >
184	              <Send className="h-4 w-4" />
185	            </Button>
186	          </div>
187	        </div>
188	      </div>
189	    </>
190	  );
19}
