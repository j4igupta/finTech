// Finnhub API client
// Provides thin wrappers for the endpoints we need.
// Returns data shaped to match our internal DTOs.

import { config } from './config';

// Simple in‑memory rate‑limit tracker (30 requests per minute for free tier)
let lastCall = 0;
const MIN_INTERVAL = 60_000 / 30; // 2 seconds

async function rateLimitedFetch(url: string): Promise<any> {
  const now = Date.now();
  const wait = MIN_INTERVAL - (now - lastCall);
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait));
  }
  lastCall = Date.now();
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Finnhub request failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchQuote(symbol: string): Promise<FeedItem[]> {
  const apiKey = config.finnhubKey;
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`;
  const data = await rateLimitedFetch(url);
  // Finnhub returns { c: current price, ... }
  if (data.c === undefined) {
    throw new Error('Unexpected Finnhub format');
  }
  const item: FeedItem = {
    id: `${symbol}-${Date.now()}`,
    headline: `${symbol} price ${data.c}`,
    sentiment: 'neutral',
    summary: `Current quote for ${symbol}`,
    impact: `Price: $${data.c}`,
  };
  return [item];
}

// Reuse DTO from alphaVantage (same shape)
export interface FeedItem {
  id: string;
  headline: string;
  sentiment: string;
  summary: string;
  impact: string;
}
