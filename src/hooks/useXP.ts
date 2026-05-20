import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

/** Hook to fetch user's XP and level in real time.
 * Assumes a Supabase table named 'users' with columns 'xp' and 'level' keyed by the current user ID.
 */
export function useXP() {
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);

  useEffect(() => {
    // Replace with actual user identification logic as needed.
    const userId = 'user1'; // placeholder
    const fetch = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('xp, level')
        .eq('id', userId)
        .single();
      if (!error && data) {
        setXp(data.xp ?? 0);
        setLevel(data.level ?? 1);
      }
    };
    fetch();

    const subscription = supabase
      .channel('public:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        if (payload.new && payload.new.id === userId) {
          setXp(payload.new.xp ?? 0);
          setLevel(payload.new.level ?? 1);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return { currentXp: xp, level };
}
