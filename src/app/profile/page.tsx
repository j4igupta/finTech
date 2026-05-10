import { Header } from '@/components/Header';
import { ProfileSummary } from '@/components/ProfileSummary';

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main className="p-4">
        <ProfileSummary />
        {/* TODO: Add recent activity, achievements, etc. */}
      </main>
    </>
  );
}
