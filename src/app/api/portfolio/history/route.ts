import { NextResponse } from 'next/server';
import { mockPortfolioHistory } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(mockPortfolioHistory);
}
