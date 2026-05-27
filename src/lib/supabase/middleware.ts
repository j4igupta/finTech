import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/portfolio",
  "/battle",
  "/quests",
  "/leaderboard",
  "/profile",
];

const AUTH_PATHS = ["/auth/sign-in", "/auth/sign-up"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Refresh the session so cookies stay fresh for Server Components / route handlers.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Skip redirect logic for API routes — route handlers should return 401
  // (JSON) themselves rather than receive a 307 HTML redirect.
  if (pathname.startsWith("/api/")) {
    return response;
  }

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  // Unauthenticated user hitting a protected path → redirect to sign-in,
  // preserving the original path + query string in `next` so they can be
  // sent back after signing in.
  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/sign-in";
    redirectUrl.search = "";
    const originalPathWithQuery =
      request.nextUrl.pathname + (request.nextUrl.search ?? "");
    redirectUrl.searchParams.set("next", originalPathWithQuery);
    const redirectResponse = NextResponse.redirect(redirectUrl, 307);
    // Carry forward any cookies the SSR client set during session refresh.
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  // Authenticated user hitting sign-in or sign-up → bounce to dashboard.
  // /auth/forgot-password and /auth/reset-password remain accessible.
  if (user && AUTH_PATHS.includes(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    const redirectResponse = NextResponse.redirect(redirectUrl, 307);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  return response;
}
