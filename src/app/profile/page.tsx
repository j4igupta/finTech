import { Header } from '@/components/Header';
import { ProfileSummary } from '@/components/ProfileSummary';
import { ProfileActivity } from '@/components/ProfileActivity';
import { ProfileAchievements } from '@/components/ProfileAchievements';
import { CoachChat } from '@/components/CoachChat';

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main className="p-4 space-y-8">
        <ProfileSummary />
        <ProfileActivity />
        <ProfileAchievements />
        <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">AI Financial Coach</h2>
          <CoachChat />
        </section>
      </main>
    </>
  );
}