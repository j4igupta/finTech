import { useState } from 'react';
import { mockQuests } from '@/lib/mockData';

interface Quest {
  id: string;
  title: string;
  description: string;
  reward_xp: number;
  is_active: boolean;
}

interface UserState {
  xp: number;
  streak: number;
}

export function QuestList() {
  const [quests] = useState<Quest[]>(mockQuests);
  const [userState, setUserState] = useState<UserState>({
    xp: 0,
    streak: 1,
  });
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);

  const handleCompleteQuest = async (questId: string) => {
    if (completedQuests.includes(questId)) return;

    // Simulate API call
    const response = await fetch('/api/quests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questId }),
    });

    const data = await response.json();

    if (data.completed) {
      const quest = quests.find((q) => q.id === questId);
      if (quest) {
        // Update XP
        setUserState((prev) => ({
          ...prev,
          xp: prev.xp + quest.reward_xp,
          streak: prev.streak + 1, // Increment streak on quest completion
        }));

        // Mark as completed
        setCompletedQuests((prev) => [...prev, questId]);
      }
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="mb-6 p-4 bg-gray-700 rounded-lg">
        <div className="flex justify-between text-white">
          <span>XP: {userState.xp}</span>
          <span>Streak: {userState.streak} days</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-4">Daily Quests</h2>
      <div className="space-y-3">
        {quests.map((quest) => (
          <div key={quest.id} className={[
            'p-4 rounded-lg transition-all duration-200',
            'bg-gray-700 hover:bg-gray-600 cursor-pointer',
            completedQuests.includes(quest.id) &&
              'bg-green-900 border border-green-600'
            ]
          }>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">
                  {quest.title}
                  {completedQuests.includes(quest.id) && (
                    <span className="ml-2 text-green-400 text-sm">✓ Completed</span>
                  )}
                </h3>
                <p className="text-gray-300 text-sm mb-2">{quest.description}</p>
                <div className="flex items-center gap-2">
                  <span className="bg-primary text-primary-900 px-2 py-1 rounded text-xs font-medium">
                    +{quest.reward_xp} XP
                  </span>
                  <span className="text-gray-400 text-xs">
                    Daily Quest
                  </span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}