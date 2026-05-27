"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(10, "Password must be at least 10 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one digit."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

type GateState = "allowed" | "expired";

export default function ResetPasswordPage() {
  const router = useRouter();
  // Default to "expired" — secure by default. We only flip to "allowed" when
  // Supabase fires PASSWORD_RECOVERY, proving the user came in via a valid
  // recovery code exchange.
  const [gate, setGate] = useState<GateState>("expired");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    const supabase = createClient();
    let resolved = false;

    // We don't trust getSession() alone: a stale authenticated session would
    // otherwise let any signed-in user reset the password without proving
    // possession of the recovery email. Only the PASSWORD_RECOVERY event
    // (fired by Supabase after the recovery code is exchanged) is proof.
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") {
          resolved = true;
          setGate("allowed");
        }
      },
    );

    // If we haven't observed PASSWORD_RECOVERY within 2s, the listener is no
    // longer useful — we already render "expired" as the default. We still
    // honor a late event (resolved isn't needed at unmount; the listener
    // updates state directly above).
    const timeoutId = setTimeout(() => {
      // No-op: gate is already "expired" by default. This timeout exists only
      // to mark that we've waited long enough for an initial event.
      void resolved;
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      subscription.subscription.unsubscribe();
    };
  }, []);

  const onSubmit = async (values: ResetPasswordValues) => {
    setSubmitError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      setSubmitError(error.message);
      return;
    }

    // Kill the recovery session so the user must sign in fresh with the new password.
    await supabase.auth.signOut();
    router.replace("/auth/sign-in?reset=success");
  };

  if (gate === "expired") {
    return (
      <div className="max-w-md mx-auto mt-24 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Reset link expired</CardTitle>
            <CardDescription>
              This password reset link is no longer valid. Request a new link
              to continue.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => router.push("/auth/forgot-password")}
            >
              Request a new reset link
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-24 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Set a new password</CardTitle>
          <CardDescription>
            Choose a strong password you haven&apos;t used before.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Set new password"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Link
            href="/auth/sign-in"
            className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground"
          >
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
