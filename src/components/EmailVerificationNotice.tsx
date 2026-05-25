"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthProvider";

export default function EmailVerificationNotice() {
  const { user } = useAuth();
  const [status, setStatus] = useState<string>("");

  const resend = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
    }).catch(() => ({ error: { message: 'Failed' } }));
    if (error) {
      setStatus(`Error: ${error.message}`);
    } else {
      setStatus("Verification email sent. Check your inbox.");
    }
  };

  return (
    <div className="bg-yellow-900 text-yellow-100 p-4 rounded mb-4">
      <p className="mb-2">
        Please verify your email address ({user?.email}) to access this feature.
      </p>
      <button
        onClick={resend}
        className="bg-yellow-700 hover:bg-yellow-600 text-white px-3 py-1 rounded"
      >
        Resend Verification Email
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
