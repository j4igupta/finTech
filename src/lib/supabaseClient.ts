import { createClient } from '@supabase/supabase-js';

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!envUrl || !envAnonKey) {
  // SSR would crash on createClient('') — fall back to placeholders so dev boots.
  // Real queries will fail at the network layer; consumers already handle errors.
  // See TODO.md ("Configure Supabase env vars") to wire up a real backend.
  console.warn(
    '[supabaseClient] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. ' +
      'Using placeholder credentials — Supabase queries will fail silently. See TODO.md.',
  );
}

export const supabase = createClient(
  envUrl ?? 'https://placeholder.supabase.co',
  envAnonKey ?? 'placeholder-anon-key',
);
