import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

/**
 * Hook to fetch portfolio history data in real time.
 * Assumes a Supabase table named 'portfolio' with columns matching the expected shape.
 */
export function usePortfolio() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Initial fetch
    supabase
      .from('portfolio')
      .select('*')
      .then(({ data, error }) => {
        if (!error && data) setData(data);
      });

    // Real‑time subscription
    const subscription = supabase
      .channel('public:portfolio')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio' }, (payload) => {
        // Simple refetch on any change
        supabase.from('portfolio').select('*').then(({ data, error }) => {
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
