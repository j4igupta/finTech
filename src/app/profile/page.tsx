import { Header } from '@/components/Header';
import { ProfileSummary } from '@/components/ProfileSummary';
import { ProfileActivity } from '@/components/ProfileActivity';
import { ProfileAchievements } from '@/components/ProfileAchievements';

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main className="p-4 space-y-8">
        <ProfileSummary />
        <ProfileActivity />
        <ProfileAchievements />
      </main>
    </>
  );
}
