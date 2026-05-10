import { Header } from '@/components/Header';
import { QuestList } from '@/components/QuestList';

export default function QuestsPage() {
  return (
    <>
      <Header />
      <main className="p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Daily Quests</h1>
        <QuestList />
      </main>
    </>
  );
}
