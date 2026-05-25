import { Header } from '@/components/Header';
import { QuestList } from '@/components/QuestList';

const sampleQuests = [
  {
    id: "q1",
    title: "Trade 5 stocks",
    description: "Complete 5 trades today.",
    xpReward: 100,
    progress: 2,
    total: 5,
    completed: false,
    icon: "flame",
  },
  {
    id: "q2",
    title: "Earn $500 profit",
    description: "Make $500 profit in a day.",
    xpReward: 200,
    progress: 1,
    total: 1,
    completed: true,
    icon: "target",
  },
  {
    id: "q3",
    title: "Log in 7 days",
    description: "Consecutive login streak.",
    xpReward: 150,
    progress: 4,
    total: 7,
    completed: false,
    icon: "gift",
  },
];

import ProtectedRoute from '@/components/ProtectedRoute';

export default function QuestsPage() {
  return (
    <ProtectedRoute>
      <QuestsContent />
    </ProtectedRoute>
  );
}

function QuestsContent() {
  return (
    <>
      <Header />
      <main className="p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Daily Quests</h1>
        <QuestList quests={sampleQuests} />
      </main>
    </>
  );
}
