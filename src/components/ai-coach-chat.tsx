"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "How can I grow my portfolio?",
  "What's my risk level?",
  "Tips for earning more XP?",
];

export function AICoachChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hey champion! 🎮 I'm your AI finance coach. Ready to level up your investing game? Ask me anything about your portfolio, strategies, or how to earn more XP!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };

    // History sent to the model (exclude the just-added message; the API appends it).
    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });
      const data = await res.json().catch(() => ({}));
      const content = res.ok
        ? data.reply
        : data.error || "Something went wrong reaching the coach.";

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I couldn't connect right now. Check your connection and try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1E90FF] to-[#FF69B4] shadow-lg shadow-[#1E90FF]/25 transition-all hover:scale-105 hover:shadow-[#1E90FF]/40 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <Bot className="h-6 w-6 text-white" />
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#00FFAA] text-[10px] font-bold text-background">
          AI
        </span>
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex w-80 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-[#1E90FF]/10 transition-all duration-300 sm:w-96 ${
          isOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
        style={{ height: isOpen ? "480px" : "0" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-[#1E90FF]/10 to-[#FF69B4]/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#1E90FF] to-[#FF69B4]">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-[#00FFAA]" />
            </div>
            <div>
              <p className="font-semibold text-sm">Finance Coach</p>
              <p className="text-xs text-[#00FFAA]">Online • Ready to help</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-[#1E90FF] to-[#1E90FF]/80 text-white"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl bg-secondary px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#1E90FF]" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#FF69B4]" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#00FFAA]" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => setInput(suggestion)}
                className="flex-shrink-0 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-[#1E90FF]/50 hover:text-foreground"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask your coach..."
                className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 pr-10 text-sm placeholder:text-muted-foreground focus:border-[#1E90FF]/50 focus:outline-none focus:ring-1 focus:ring-[#1E90FF]/50"
              />
              <Sparkles className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF69B4]/50" />
            </div>
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim()}
              className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#1E90FF] to-[#FF69B4] text-white hover:opacity-90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
