'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function NetWorth() {
  const [netWorth, setNetWorth] = useState<number | null>(null);

  // TODO: replace with proper store / API call
  useEffect(() => {
    async function fetchNetWorth() {
      // Placeholder: fetch from a fictional "profiles" view
      const { data, error } = await supabase
        .from('profiles')
        .select('net_worth')
        .single();
      if (!error && data) setNetWorth(data.net_worth);
    }
    fetchNetWorth();
  }, []);

  return (
    <div className="text-sm text-gray-200">
      Net Worth: {netWorth !== null ? `$${netWorth.toLocaleString()}` : '—'}
    </div>
  );
}
