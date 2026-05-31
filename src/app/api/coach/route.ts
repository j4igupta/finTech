import { NextResponse } from 'next/server';

// AI finance coach backed by Google Gemini (free tier). The API key lives only
// on the server (GEMINI_API_KEY) and is never exposed to the browser.
const MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const TIMEOUT_MS = 20_000;
const MAX_MESSAGE_LEN = 2000;

const SYSTEM_PROMPT = `You are an upbeat AI finance coach inside a gamified investing app for young investors.
Keep replies concise (2-4 sentences), encouraging, and practical. Explain concepts simply.
You are NOT a licensed financial advisor: never guarantee returns, and for specific personal
decisions gently suggest consulting a professional. Stay on finance, investing, and the app's
gamified features (XP, quests, streaks, battles).`;

interface CoachMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  let body: { message?: unknown; history?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  if (!message) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LEN) {
    return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI coach is not configured yet (missing GEMINI_API_KEY).' },
      { status: 503 }
    );
  }

  // Build conversation: trailing slice of prior turns + the new user message.
  const history: CoachMessage[] = Array.isArray(body?.history)
    ? (body.history as unknown[])
        .filter(
          (m): m is CoachMessage =>
            !!m &&
            typeof (m as CoachMessage).content === 'string' &&
            ((m as CoachMessage).role === 'user' || (m as CoachMessage).role === 'assistant')
        )
        .slice(-10)
    : [];

  const contents = [
    ...history.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content.slice(0, MAX_MESSAGE_LEN) }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
      }),
      signal: controller.signal,
    });

    if (res.status === 429) {
      return NextResponse.json(
        { error: 'The coach is a bit busy right now — try again in a moment.' },
        { status: 429 }
      );
    }
    if (!res.ok) {
      console.error('Gemini error', res.status, await res.text().catch(() => ''));
      return NextResponse.json({ error: 'The coach is unavailable right now.' }, { status: 502 });
    }

    const data = await res.json();
    const reply: string =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? '')
        .join('')
        .trim() ?? '';

    if (!reply) {
      // e.g. blocked by safety filters
      return NextResponse.json(
        { error: "I couldn't answer that one — try rephrasing your question." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      return NextResponse.json({ error: 'The coach took too long to respond.' }, { status: 504 });
    }
    console.error('Coach request failed', e);
    return NextResponse.json({ error: 'Failed to reach the coach.' }, { status: 500 });
  } finally {
    clearTimeout(timer);
  }
}
