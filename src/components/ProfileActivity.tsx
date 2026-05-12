import { useState, useEffect } from 'react';
import { mockRecentActivity } from '@/lib/mockData';

export function ProfileActivity() {
  const [activities, setActivities] = useState(mockRecentActivity);

  useEffect(() => {
    // Simulate fetching from API
    setTimeout(() => {
      setActivities(mockRecentActivity);
    }, 500);
  }, []);

  return (
    <section className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
      <ul className="space-y-3">
        {activities.map((activity) => {
          const date = new Date(activity.timestamp);
          const timeAgo = Math.round((Date.now() - date.getTime()) / (1000 * 60)); // minutes ago
          return (
            <li key={activity.id} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="text-gray-300">
                  {activity.description}
                  {activity.xp_gained > 0 && (
                    <span className="ml-2 text-primary">+{activity.xp_gained} XP</span>
                  )}
                </div>
                <span className="text-sm text-gray-500">{timeAgo} min ago</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}