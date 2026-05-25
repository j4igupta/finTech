// Configuration helper for environment variables
// Exposes API keys and provider selector used by the real data service.

export const config = {
  // Market data provider: "alphaVantage" or "finnhub"
  provider: (process.env.MARKET_DATA_PROVIDER ?? 'alphaVantage') as 'alphaVantage' | 'finnhub',

  // Alpha Vantage API key (free tier). Must be set in .env
  alphaVantageKey: process.env.ALPHA_VANTAGE_API_KEY ?? '',

  // Finnhub API key. Must be set in .env
  finnhubKey: process.env.FINNHUB_API_KEY ?? '',
};
