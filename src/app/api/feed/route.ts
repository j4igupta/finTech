import { NextResponse } from 'next/server';
import { mockFeedItems } from '@/lib/mockData';

export async function GET() {
  // In a real app replace mock data with a Supabase query
  return NextResponse.json(mockFeedItems);
}
