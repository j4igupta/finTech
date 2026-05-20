import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

/** Hook to fetch quests in real time. */
export function useQuests() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('quests').select('*').then(({ data, error }) => {
      if (!error && data) setData(data);
    });

    const subscription = supabase
      .channel('public:quests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quests' }, () => {
        supabase.from('quests').select('*').then(({ data, error }) => {
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
