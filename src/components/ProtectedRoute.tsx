"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import EmailVerificationNotice from "./EmailVerificationNotice";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      // Not authenticated, redirect to sign‑in
      router.replace("/auth/sign-in");
    }
  }, [loading, session, router]);

  if (loading) return null; // or a loading spinner

  // If user exists but email not verified, show notice
  if (user && !(user as any).email_confirmed_at) {
    return <EmailVerificationNotice />;
  }

  return <>{children}</>;
}
