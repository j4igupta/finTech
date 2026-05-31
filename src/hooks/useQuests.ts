import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Live daily quests for the current user. The backing `quests` table is not
 * part of the schema yet, so this degrades gracefully to an empty list.
 */
export function useQuests(): any[] {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const load = async () => {
      const { data: rows, error } = await supabase.from('quests').select('*');
      if (active && !error && rows) setData(rows);
    };
    load();

    const channel = supabase
      .channel('public:quests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quests' }, () => load())
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return data;
}
