import { ReactNode } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Example global store – will be expanded for auth, profile, XP, etc.
export const useStore = create(
  devtools(() => ({
    // Placeholder state
    user: null as null | { id: string; name: string },
    setUser: (user: any) => {}
  }))
);

export function Providers({ children }: { children: ReactNode }) {
  // Add any context providers (e.g., ThemeProvider, SupabaseProvider) here.
  return <>{children}</>;
}
