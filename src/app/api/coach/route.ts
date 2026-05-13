import { NextResponse } from 'next/server';

// Simple mock AI coach - in production, this would call an actual AI service
export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Mock responses based on keywords
    const lowerMsg = message.toLowerCase();

    let reply: string;

    if (lowerMsg.includes('portfolio') || lowerMsg.includes('investment')) {
      reply = 'Your portfolio shows a healthy diversification across sectors. Consider rebalancing if any single asset exceeds 20% of your total holdings.';
    } else if (lowerMsg.includes('risk') || lowerMsg.includes('volatile')) {
      reply = 'Current market volatility suggests maintaining a balanced approach. Consider dollar-cost averaging during market dips.';
    } else if (lowerMsg.includes('earnings') || lowerMsg.includes('report')) {
      reply = 'When reviewing earnings reports, focus on revenue growth, profit margins, and forward guidance rather than just beating estimates.';
    } else if (lowerMsg.includes('retire') || lowerMsg.includes('future')) {
      reply = 'For long-term retirement planning, maximize employer-matched contributions and consider low-cost index funds as a core holding.';
    } else if (lowerMsg.includes('tax') || lowerMsg.includes('taxes')) {
      reply = 'Tax-efficient investing strategies include holding investments for over a year to qualify for long-term capital gains rates.';
    } else {
      reply = 'I\'m here to help with your financial questions. Feel free to ask about portfolio strategy, risk management, or market concepts.';
    }

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}