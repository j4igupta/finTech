'use client';

import { useState, useEffect } from 'react';
import { mockAchievements } from '@/lib/mockData';

export function ProfileAchievements() {
  const [achievements, setAchievements] = useState(mockAchievements);

  useEffect(() => {
    // Simulate fetching from API
    setTimeout(() => {
      setAchievements(mockAchievements);
    }, 300);
  }, []);

  return (
    <section className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-4">Achievements</h3>
      <div className="grid grid-cols-2 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`p-4 rounded-lg transition-all duration-200 ${
              ach.earned
                ? 'bg-green-900 border border-green-600'
                : 'bg-gray-800 border border-gray-700'
            }`}
          >
            <div className="text-2xl mb-2">{ach.icon}</div>
            <h4 className="text-white font-medium">{ach.title}</h4>
            <p className="text-gray-300 text-sm mt-1">{ach.description}</p>
            {ach.earned && (
              <div className="mt-2 text-green-400 text-sm">Earned!</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}