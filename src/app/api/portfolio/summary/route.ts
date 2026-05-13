import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400 });
    }

    // Fetch portfolio summary from Supabase
    const { data: portfolio, error } = await supabaseAdmin
      .from('portfolios')
      .select('net_worth, cash, positions, diversification, volatility, win_rate, sharpe_ratio, unrealized_gains')
      .eq('user_id', userId)
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}