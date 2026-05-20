import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

/** Hook to fetch leaderboard data in real time. */
export function useLeaderboard() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('leaderboard').select('*').then(({ data, error }) => {
      if (!error && data) setData(data);
    });

    const subscription = supabase
      .channel('public:leaderboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard' }, () => {
        supabase.from('leaderboard').select('*').then(({ data, error }) => {
          if (!error && data) setData(data);
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return data;
}
