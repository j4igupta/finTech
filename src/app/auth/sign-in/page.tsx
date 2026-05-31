"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

type SignInValues = z.infer<typeof signInSchema>;

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const urlError = searchParams.get("error");
  const resetSuccess = searchParams.get("reset") === "success";

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendState, setResendState] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [resendError, setResendError] = useState<string | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: SignInValues) => {
    setSubmitError(null);
    setNeedsVerification(false);
    setResendState("idle");
    setResendError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      if (error.message === "Email not confirmed") {
        setNeedsVerification(true);
      } else {
        setSubmitError(error.message);
      }
      return;
    }

    router.replace(next);
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setOauthError(null);
    setOauthLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (error) {
      setOauthError(error.message);
      setOauthLoading(false);
    }
  };

  const handleResend = async () => {
    const email = getValues("email");
    if (!email) {
      setResendError("Enter your email above first.");
      setResendState("error");
      return;
    }
    setResendState("sending");
    setResendError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    if (error) {
      setResendError(error.message);
      setResendState("error");
      return;
    }
    setResendState("sent");
  };

  const urlErrorMessage =
    urlError === "verification-failed"
      ? "We couldn't verify that link. Please try signing in or request a new verification email."
      : urlError === "missing-code"
        ? "That verification link was invalid. Please try again."
        : null;

  return (
    <div className="max-w-md mx-auto mt-24 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            New here?{" "}
            <Link
              href="/auth/sign-up"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Create an account
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resetSuccess && (
            <Alert className="mb-4">
              <AlertDescription>
                Password updated. Sign in with your new password.
              </AlertDescription>
            </Alert>
          )}
          {urlErrorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{urlErrorMessage}</AlertDescription>
            </Alert>
          )}
          {needsVerification && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                <div>Please verify your email before signing in.</div>
                <div className="mt-2">
                  Didn&apos;t get the link?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendState === "sending"}
                    className="underline underline-offset-4 disabled:opacity-50"
                  >
                    {resendState === "sending"
                      ? "Sending…"
                      : resendState === "sent"
                        ? "Sent — check your inbox"
                        : "Resend verification email"}
                  </button>
                </div>
                {resendError && (
                  <div className="mt-1 text-xs">{resendError}</div>
                )}
              </AlertDescription>
            </Alert>
          )}
          {submitError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>
          {oauthError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{oauthError}</AlertDescription>
            </Alert>
          )}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={oauthLoading}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 48 48"
              className="mr-2 h-4 w-4"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>
            {oauthLoading ? "Redirecting…" : "Continue with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto mt-24 px-4 text-muted-foreground">Loading…</div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
