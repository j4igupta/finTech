"use client";

import { mockFeedItems } from '@/lib/mockData';
import { FeedCard } from '@/components/FeedCard';

export function Feed() {
  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {mockFeedItems.map((item) => (
        <FeedCard key={item.id} item={item} />
      ))}
    </section>
  );
}
