"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { NavBar } from "./NavBar";

/**
 * Renders the global app navigation, but only where it belongs: for a
 * signed-in user on an in-app route. It is hidden on the auth screens
 * (/auth/*) and on the public landing page (/), which carry their own headers.
 */
export function AppChrome() {
  const pathname = usePathname();
  const { session, loading } = useAuth();

  if (loading || !session) return null;
  if (pathname === "/" || pathname.startsWith("/auth")) return null;

  return <NavBar />;
}
