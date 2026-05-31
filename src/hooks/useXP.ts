import { useEffect, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export const XP_PER_LEVEL = 1000;
export function levelForXp(xp: number): number {
  return Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1;
}

/**
 * The current user's XP + derived level, read from the real `profiles` table
 * and kept live via a realtime subscription on that row.
 */
export function useXP() {
  const [currentXp, setCurrentXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    let channel: RealtimeChannel | null = null;

    const applyXp = (xp: number) => {
      setCurrentXp(xp);
      setLevel(levelForXp(xp));
    };

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active || !user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', user.id)
        .maybeSingle();
      if (active && !error && data) applyXp(data.xp ?? 0);

      channel = supabase
        .channel(`profile_xp_${user.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
          (payload) => {
            const xp = (payload.new as { xp?: number })?.xp;
            if (typeof xp === 'number') applyXp(xp);
          }
        )
        .subscribe();
      // If the component unmounted while we were awaiting, tear down immediately.
      if (!active) {
        supabase.removeChannel(channel);
        channel = null;
      }
    })();

    return () => {
      active = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return { currentXp, level };
}
