import Image from 'next/image';

export interface FeedItem {
  id: string;
  headline: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
  impact: string;
}

export function FeedCard({ item }: { item: FeedItem }) {
  const sentimentColor =
    item.sentiment === 'positive'
      ? 'text-green-400'
      : item.sentiment === 'negative'
      ? 'text-red-400'
      : 'text-gray-400';

  return (
    <article className="rounded-lg bg-gray-800 p-4 shadow-md">
      <h3 className="text-lg font-semibold text-white mb-2">{item.headline}</h3>
      <p className={`text-sm ${sentimentColor} mb-1`}>Sentiment: {item.sentiment}</p>
      <p className="text-sm text-gray-300 mb-2">{item.summary}</p>
      <p className="text-xs text-gray-500">Impact: {item.impact}</p>
    </article>
  );
}
