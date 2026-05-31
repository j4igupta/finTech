"use client";

import { useEffect, useState } from 'react';
import { getFeedItems, FeedItem } from '@/lib/realData';
import { FeedCard, type FeedItem as DisplayFeedItem } from '@/components/FeedCard';

type Status = 'loading' | 'ready' | 'error';

export function Feed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let active = true;
    getFeedItems()
      .then((data) => {
        if (!active) return;
        setItems(data);
        setStatus('ready');
      })
      .catch((e) => {
        console.error('Failed to load feed items', e);
        if (!active) return;
        setStatus('error');
      });
    return () => {
      active = false;
    };
  }, []);

  if (status === 'loading') {
    return <p className="text-sm text-muted-foreground">Loading feed…</p>;
  }
  if (status === 'error') {
    return <p className="text-sm text-red-400">Couldn&apos;t load the feed right now.</p>;
  }
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing in your feed yet.</p>;
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <FeedCard key={item.id} item={item as DisplayFeedItem} />
      ))}
    </section>
  );
}
