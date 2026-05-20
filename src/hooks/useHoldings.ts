import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

/** Hook to fetch holdings data in real time. */
export function useHoldings() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('holdings').select('*').then(({ data, error }) => {
      if (!error && data) setData(data);
    });

    const subscription = supabase
      .channel('public:holdings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'holdings' }, () => {
        supabase.from('holdings').select('*').then(({ data, error }) => {
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
