// Central re‑exports for TypeScript types
export type User = {
  id: string;
  username: string;
  avatarUrl?: string;
  rank: string;
  xp: number;
};

export type Portfolio = {
  userId: string;
  cash: number;
  holdings: Record<string, number>; // ticker → shares
  netWorth: number;
};
