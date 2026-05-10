import '@/styles/globals.css';
import { Providers } from '@/lib/providers';
import { NavBar } from '@/components/NavBar';
import { Header } from '@/components/Header';

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
    <html lang="en" className="dark bg-gray-900 text-white" suppressHydrationWarning>
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
