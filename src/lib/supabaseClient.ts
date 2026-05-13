// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: We use the ANON key here so it is safe for the browser
// and respects your database security rules.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);