import { NextResponse } from 'next/server';

// Proxy to the Supabase edge function `battle_engine`
export async function POST(req: Request) {
  const body = await req.json();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

  const response = await fetch(`${supabaseUrl}/functions/v1/battle_engine`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseServiceKey,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
