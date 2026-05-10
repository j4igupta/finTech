import Link from 'next/link';
import { NetWorth } from '@/components/NetWorth';

export function Header() {
  return (
    <header className="flex items-center justify-between py-4 px-6 bg-gray-800 border-b border-gray-700">
      <Link href="/" className="text-2xl font-semibold text-primary">
        Financial MMO
      </Link>
      {/* Right side: NetWorth, Rank, XP, Avatar */}
      <div className="flex items-center space-x-4">
        <NetWorth />
        <span className="text-sm text-gray-300">Rank: Bronze</span>
        <span className="text-sm text-gray-300">XP: 0/1000</span>
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-600" />
      </div>
    </header>
  );
}
