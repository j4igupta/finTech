import '@/styles/globals.css';
import { Providers } from '@/lib/providers';
import { NavBar } from '@/components/NavBar';
import { Header } from '@/components/Header';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: 'Financial MMO Platform',
  description: 'Gamified financial literacy platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("dark bg-gray-900 text-white", "font-sans", geist.variable)} suppressHydrationWarning>
      <head />
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
