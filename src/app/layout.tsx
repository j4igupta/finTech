import '@/styles/globals.css';
import { Providers } from '@/lib/providers';
import { AuthProvider } from '@/components/AuthProvider';
import { AppChrome } from '@/components/AppChrome';
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
      <head>
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
        </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Providers>
            <AppChrome />
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
