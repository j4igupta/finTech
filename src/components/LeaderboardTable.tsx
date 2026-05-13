'use client';

import { useState, useEffect } from 'react';
import { mockLeaderboard } from '@/lib/mockData';

interface Player {
  id: string;
  username: string;
  rank: string;
  xp: number;
  netWorth: number;
  winRate: number;
  streak: number;
}

export function LeaderboardTable() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [category, setCategory] = useState<string>('net_worth');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPlayers(mockLeaderboard);
      setLoading(false);
    }, 500);
  }, []);

  const getSortedPlayers = () => {
    switch (category) {
      case 'net_worth':
        return [...players].sort((a, b) => b.netWorth - a.netWorth);
      case 'win_rate':
        return [...players].sort((a, b) => b.winRate - a.winRate);
      case 'streak':
        return [...players].sort((a, b) => b.streak - a.streak);
      case 'xp':
        return [...players].sort((a, b) => b.xp - a.xp);
      default:
        return players;
    }
  };

  const sortedPlayers = getSortedPlayers();
  const currentUser = sortedPlayers.find(p => p.username === 'InvestorPro');

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          {['net_worth', 'win_rate', 'streak', 'xp'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                category === cat
                  ? 'bg-primary text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {currentUser && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
          <div className="flex justify-between items-center text-white">
            <div>
              <span className="font-semibold">{currentUser.username}</span>
              <span className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs">
                Rank: {currentUser.rank}
              </span>
            </div>
            <div className="text-sm">
              <span className="mr-4">
                {category === 'net_worth' && `$${currentUser.netWorth.toLocaleString()}`}
                {category === 'win_rate' && `${currentUser.winRate}%`}
                {category === 'streak' && `${currentUser.streak} days`}
                {category === 'xp' && `${currentUser.xp} XP`}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th className="p-2">#</th>
              <th className="p-2">Player</th>
              <th className="p-2">Rank</th>
              <th className="p-2">Win Rate</th>
              <th className="p-2">Streak</th>
              <th className="p-2">XP</th>
              <th className="p-2 text-right">Net Worth</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  Loading leaderboard...
                </td>
              </tr>
            ) : sortedPlayers.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No players yet
                </td>
              </tr>
            ) : (
              sortedPlayers.map((player, index) => (
                <tr
                  key={player.id}
                  className={`border-b border-gray-700 hover:bg-gray-700/50 transition-colors ${
                    player.username === 'InvestorPro' ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="p-2 text-gray-400">
                    {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                  </td>
                  <td className="p-2 text-white font-medium">{player.username}</td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                      {player.rank}
                    </span>
                  </td>
                  <td className="p-2 text-gray-300">{player.winRate}%</td>
                  <td className="p-2 text-gray-300">
                    <span className="flex items-center gap-1">
                      🔥 {player.streak}
                    </span>
                  </td>
                  <td className="p-2 text-gray-300">{player.xp}</td>
                  <td className="p-2 text-gray-300 text-right">
                    ${player.netWorth.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}