'use client';

import { useState } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function CoachChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI financial coach. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const response = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    const data = await response.json();
    const assistantMessage: Message = { role: 'assistant', content: data.reply };
    setMessages(prev => [...prev, assistantMessage]);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-white font-semibold mb-2">AI Financial Coach</h3>
      <div className="h-64 overflow-y-auto mb-2 p-2 bg-gray-900 rounded">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span
              className={`inline-block p-2 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-gray-700 text-gray-200'
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a financial question…"
          className="flex-1 p-2 rounded border border-gray-600 bg-gray-700 text-white"
        />
        <button
          onClick={sendMessage}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
        >
          Send
        </button>
      </div>
    </div>
  );
}