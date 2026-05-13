import { useState, useEffect } from 'react';

export function Streaks() {
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);

  useEffect(() => {
    const fetchStreak = async () => {
      const response = await fetch('/api/streaks');
      if (response.ok) {
        const data = await response.json();
        setCurrentStreak(data.currentStreak || 0);
        setLongestStreak(data.longestStreak || 0);
      }
    };
    fetchStreak();
  }, []);

  return (
    <div className="text-sm text-gray-300 flex items-center gap-2">
      <span>🔥 {currentStreak} days</span>
      <span className="text-gray-500">/ {longestStreak} max</span>
    </div>
  );
}