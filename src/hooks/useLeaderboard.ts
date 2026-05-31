import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface LeaderboardPlayer {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  xp: number;
  winStreak: number;
  change: 'up' | 'down' | 'same';
  isCurrentUser: boolean;
}

/**
 * Live leaderboard built from the real `profiles` table, ordered by XP.
 * winStreak/change aren't tracked yet, so they default to neutral values.
 */
export function useLeaderboard() {
  const [data, setData] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: rows, error: err } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, xp')
        .order('xp', { ascending: false })
        .limit(100);
      if (!active) return;
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      setData(
        (rows ?? []).map((r, i) => ({
          id: r.id as string,
          rank: i + 1,
          username: (r.username as string) ?? 'player',
          avatar: (r.avatar_url as string) ?? '',
          xp: (r.xp as number) ?? 0,
          winStreak: 0,
          change: 'same' as const,
          isCurrentUser: user?.id === r.id,
        }))
      );
      setError(null);
      setLoading(false);
    };

    load();

    const channel = supabase
      .channel('profiles_leaderboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => load())
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { data, loading, error };
}
