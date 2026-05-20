"use client";

import { Header } from '@/components/Header';
import { Feed } from '@/components/Feed';
import { XPBar } from '@/components/XPBar';

export default function Dashboard() {
  return (
    <>
      <Header />
      <XPBar currentXP={0} nextLevelXP={1000} />
      <main className="p-4">
        <Feed />
      </main>
    </>
  );
}
