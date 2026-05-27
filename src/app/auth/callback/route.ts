import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/dashboard";

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/sign-in?error=missing-code", url.origin),
    );
  }

  const supabase = await createClient();
  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        new URL("/auth/sign-in?error=verification-failed", url.origin),
      );
    }
  } catch {
    return NextResponse.redirect(
      new URL("/auth/sign-in?error=verification-failed", url.origin),
    );
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
