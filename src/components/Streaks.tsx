"use client";

import { useState, useEffect } from 'react';

export function Streaks() {
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);

  useEffect(() => {
    let active = true;
    const fetchStreak = async () => {
      try {
        const response = await fetch('/api/streaks');
        if (!response.ok) return; // endpoint not available yet — show defaults
        const data = await response.json();
        if (!active) return;
        setCurrentStreak(Number(data.currentStreak) || 0);
        setLongestStreak(Number(data.longestStreak) || 0);
      } catch {
        // network/parse failure — keep defaults, don't crash the header
      }
    };
    fetchStreak();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>🔥 {currentStreak} days</span>
      <span className="text-muted-foreground/60">/ {longestStreak} max</span>
    </div>
  );
}
