import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Portfolio history for the current user. The backing `portfolio` table is not
 * part of the schema yet, so this degrades gracefully to an empty series rather
 * than throwing — wire up the table and this starts returning live data.
 */
export function usePortfolio(): any[] {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const load = async () => {
      const { data: rows, error } = await supabase.from('portfolio').select('*');
      if (active && !error && rows) setData(rows);
    };
    load();

    const channel = supabase
      .channel('public:portfolio')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio' }, () => load())
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return data;
}
