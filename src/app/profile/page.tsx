import { Header } from '@/components/Header';
import { ProfileSummary } from '@/components/ProfileSummary';
import { ProfileActivity } from '@/components/ProfileActivity';
import { ProfileAchievements } from '@/components/ProfileAchievements';
import { AICoachChat } from '@/components/ai-coach-chat';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  return (
    <>
      <Header />
      <main className="p-4 space-y-8">
        <ProfileSummary />
        <ProfileActivity />
        <ProfileAchievements />
        <AICoachChat />
      </main>
    </>
  );
}