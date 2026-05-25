// Alpha Vantage API client
// Provides thin wrappers for the endpoints we need.
// Returns data shaped to match our internal DTOs.

import { config } from './config';

// Simple in‑memory rate‑limit tracker (5 requests per minute for free tier)
let lastCall = 0;
const MIN_INTERVAL = 60_000 / 5; // 12 seconds

async function rateLimitedFetch(url: string): Promise<any> {
  const now = Date.now();
  const wait = MIN_INTERVAL - (now - lastCall);
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait));
  }
  lastCall = Date.now();
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Alpha Vantage request failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchTimeSeries(symbol: string): Promise<FeedItem[]> {
  const apiKey = config.alphaVantageKey;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${encodeURIComponent(
    symbol,
  )}&apikey=${apiKey}`;
  const data = await rateLimitedFetch(url);
  // Transform Alpha Vantage response to our FeedItem shape
  const series = data['Time Series (Daily)'];
  if (!series) {
    throw new Error('Unexpected Alpha Vantage format');
  }
  // Take the latest entry
  const latestDate = Object.keys(series)[0];
  const day = series[latestDate];
  const item: FeedItem = {
    id: `${symbol}-${latestDate}`,
    headline: `${symbol} price ${day['4. close']}`,
    sentiment: 'neutral',
    summary: `Daily close for ${symbol}`,
    impact: `Price: $${day['4. close']}`,
  };
  return [item];
}

// DTO used throughout the app (mirrors mockFeedItems)
export interface FeedItem {
  id: string;
  headline: string;
  sentiment: string;
  summary: string;
  impact: string;
}
