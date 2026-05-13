"use client";

import { Header } from '@/components/Header';
import { Feed } from '@/components/Feed';
import { XPBar } from '@/components/XPBar';

export default function Dashboard() {
  return (
    <>
      <Header />
      <XPBar />
      <main className="p-4">
        <Feed />
      </main>
    </>
  );
}
