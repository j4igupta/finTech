// Mock data for the platform - replaces database calls for easier implementation

export const mockFeedItems = [
  {
    id: '1',
    headline: 'Federal Reserve unexpectedly raises interest rates.',
    sentiment: 'neutral',
    summary: 'Higher rates could cool inflation but may hurt growth stocks.',
    impact: 'Tech sector down 2% on average.',
  },
  {
    id: '2',
    headline: 'Apple releases new iPhone with AI camera features.',
    sentiment: 'positive',
    summary: 'Expect a surge in consumer tech stocks.',
    impact: 'Market cap +1.5% for AAPL.',
  },
  {
    id: '3',
    headline: 'Crypto market sees 10% weekly dip.',
    sentiment: 'negative',
    summary: 'Risk-off sentiment spreads to altcoins.',
    impact: 'BTC drops 8%, ETH drops 12%.',
  },
];

// Quest data - simulates the quests table
export const mockQuests = [
  {
    id: 'q1',
    title: 'Read 2 earnings summaries',
    description: 'Read the latest earnings reports from major companies and understand their implications.',
    reward_xp: 50,
    is_active: true,
  },
  {
    id: 'q2',
    title: 'Diversify into healthcare',
    description: 'Invest in at least one healthcare sector ETF or stock.',
    reward_xp: 75,
    is_active: true,
  },
  {
    id: 'q3',
    title: 'Maintain volatility below 5%',
    description: 'Keep your portfolio volatility below 5% for a full trading day.',
    reward_xp: 100,
    is_active: true,
  },
  {
    id: 'q4',
    title: 'Complete a Flash Battle',
    description: 'Join and finish a Flash Battle against another player.',
    reward_xp: 150,
    is_active: true,
  },
  {
    id: 'q5',
    title: 'Achieve 3-day streak',
    description: 'Complete quests for 3 consecutive days.',
    reward_xp: 200,
    is_active: true,
  },
];

// Mock recent activity - simulates activity feed
export const mockRecentActivity = [
  {
    id: 'act1',
    type: 'quest_complete',
    description: 'Completed "Read 2 earnings summaries" quest',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    xp_gained: 50,
  },
  {
    id: 'act2',
    type: 'battle_win',
    description: 'Won Flash Battle against TraderX',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    xp_gained: 100,
  },
  {
    id: 'act3',
    type: 'streak_milestone',
    description: 'Reached 5-day streak!',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    xp_gained: 0,
  },
  {
    id: 'act4',
    type: 'portfolio_update',
    description: 'Portfolio value increased by 3.2%',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    xp_gained: 20,
  },
];

// Mock achievements - simulates achievements table
export const mockAchievements = [
  {
    id: 'ach1',
    title: 'First Steps',
    description: 'Complete your first quest',
    icon: '🎯',
    earned: true,
    earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ach2',
    title: 'Battle Novice',
    description: 'Win your first Flash Battle',
    icon: '⚔️',
    earned: true,
    earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ach3',
    title: 'Diversification Expert',
    description: 'Complete 5 different quest types',
    icon: '📊',
    earned: false,
  },
  {
    id: 'ach4',
    title: 'Streak Master',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    earned: false,
  },
  {
    id: 'ach5',
    title: 'Market Analyst',
    description: 'Achieve 500 XP',
    icon: '📈',
    earned: false,
  },
];

// Mock portfolio history - simulates a portfolio_history time-series table
// 12 monthly snapshots ending near PortfolioSummary's netWorth (123,456)
export const mockPortfolioHistory = [
  { date: '2025-06-01', value: 100000 },
  { date: '2025-07-01', value: 102450 },
  { date: '2025-08-01', value: 99820 },
  { date: '2025-09-01', value: 104300 },
  { date: '2025-10-01', value: 108150 },
  { date: '2025-11-01', value: 106700 },
  { date: '2025-12-01', value: 111200 },
  { date: '2026-01-01', value: 114800 },
  { date: '2026-02-01', value: 113100 },
  { date: '2026-03-01', value: 117950 },
  { date: '2026-04-01', value: 120480 },
  { date: '2026-05-01', value: 123456 },
];

// Mock user data
export const mockUser = {
  id: 'user1',
  username: 'InvestorPro',
  rank: 'Silver',
  xp: 0,
  level: 1,
  streak: 1,
};