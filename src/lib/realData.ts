// Real data service that replaces the static mockData.
// It mirrors the exports of `mockData.ts` so existing UI code can be switched
// with minimal changes. In development or when API keys are missing it falls
// back to the original mock data.

import { config } from '@/lib/config';
import { mockFeedItems, mockRecentActivity, mockAchievements, mockPortfolioHistory } from './mockData';
import { fetchTimeSeries } from './alphaVantage';
import { fetchQuote } from './finnhub';

// DTO definition (must stay compatible with mock data shapes)
export interface FeedItem {
  id: string;
  headline: string;
  sentiment: string;
  summary: string;
  impact: string;
}

/** Get feed items (news / market headlines). */
export async function getFeedItems(): Promise<FeedItem[]> {
  if (config.provider === 'alphaVantage' && config.alphaVantageKey) {
    // Example: fetch a single symbol's time series and map to a FeedItem
    // Here we just fetch AAPL as a placeholder.
    try {
      return await fetchTimeSeries('AAPL');
    } catch (e) {
      console.error('AlphaVantage fetch failed, falling back to mock', e);
    }
  } else if (config.provider === 'finnhub' && config.finnhubKey) {
    try {
      return await fetchQuote('AAPL');
    } catch (e) {
      console.error('Finnhub fetch failed, falling back to mock', e);
    }
  }
  // Fallback – return the static mock data
  return mockFeedItems as FeedItem[];
}

/** Recent activity feed – currently still mock data. */
export function getRecentActivity() {
  // In a real implementation we would call an endpoint; for now we reuse mock.
  return mockRecentActivity;
}

/** Achievements – still mock data for now. */
export function getAchievements() {
  return mockAchievements;
}

/** Portfolio history – still mock data for now. */
export function getPortfolioHistory() {
  return mockPortfolioHistory;
}
