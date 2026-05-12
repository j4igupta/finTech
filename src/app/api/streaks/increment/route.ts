import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get current streak record
    const { data: streakData, error: fetchError } = await supabaseAdmin
      .from('streaks')
      .select('current_streak, longest_streak, last_completed_at')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows returned
      return NextResponse.json(
        { error: 'Failed to fetch streak data' },
        { status: 500 }
      );
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    let currentStreak = 0;
    let longestStreak = 0;

    if (streakData) {
      const lastCompleted = new Date(streakData.last_completed_at);
      const lastCompletedDate = lastCompleted.toISOString().split('T')[0];
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDate = yesterday.toISOString().split('T')[0];

      // If last completion was yesterday, increment streak
      if (lastCompletedDate === yesterdayDate) {
        currentStreak = streakData.current_streak + 1;
      }
      // If last completion was today, streak remains the same
      else if (lastCompletedDate === today) {
        currentStreak = streakData.current_streak;
      }
      // Otherwise reset streak to 1
      else {
        currentStreak = 1;
      }

      longestStreak = Math.max(streakData.longest_streak, currentStreak);
    } else {
      // First time completing a streak
      currentStreak = 1;
      longestStreak = 1;
    }

    // Upsert streak record
    const { error: upsertError } = await supabaseAdmin
      .from('streaks')
      .upsert({
        user_id: userId,
        current_streak: currentStreak,
        longest_streak: longestStreak,
        last_completed_at: now.toISOString(),
      });

    if (upsertError) {
      return NextResponse.json(
        { error: 'Failed to update streak' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      currentStreak,
      longestStreak,
      lastCompletedAt: now.toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}