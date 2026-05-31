import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Live holdings for the current user. The backing `holdings` table is not part
 * of the schema yet, so this degrades gracefully to an empty list.
 */
export function useHoldings(): any[] {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const load = async () => {
      const { data: rows, error } = await supabase.from('holdings').select('*');
      if (active && !error && rows) setData(rows);
    };
    load();

    const channel = supabase
      .channel('public:holdings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'holdings' }, () => load())
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return data;
}
