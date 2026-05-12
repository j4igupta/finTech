import { mockQuests } from '@/lib/mockData';

// Simplified API route that doesn't require Supabase
// This version will work even with minimal backend support

export async function GET() {
  // Just return our mock data
  return NextResponse.json(mockQuests);
}

// Mock completion endpoint
export async function POST(req: Request) {
  const { questId } = await req.json();

  // Simulated XP award (no database calls)
  const xpReward = mockQuests.find((q) => q.id === questId)?.reward_xp || 50;

  // Return simplified success response
  return NextResponse.json({ completed: true, xpReward });
}