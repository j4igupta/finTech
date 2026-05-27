import { NextResponse } from 'next/server';
import { getFeedItems } from '@/lib/realData';

export async function GET() {
  try {
    const items = await getFeedItems();
    return NextResponse.json(items);
  } catch (e) {
    console.error('Error fetching feed items', e);
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
  }
}
