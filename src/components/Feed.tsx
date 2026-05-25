"use client";

import { useEffect, useState } from 'react';
import { getFeedItems, FeedItem } from '@/lib/realData';
import { FeedCard } from '@/components/FeedCard';

export function Feed() {
  const [items, setItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    getFeedItems()
      .then(setItems)
      .catch((e) => {
        console.error('Failed to load feed items', e);
        setItems([]);
      });
  }, []);

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <FeedCard key={item.id} item={item as FeedItem} />
      ))}
    </section>
  );
}
