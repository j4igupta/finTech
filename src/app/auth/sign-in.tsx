'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Provider } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard');
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  const handleOAuth = async (provider: Provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback/${provider}`,
      },
    });
  };

  return (
    <div className="bg-gray-900 flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        {error && <p className="mb-2 text-red-400">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-2 rounded border"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-2 rounded border"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign In
        </button>
        <div className="mt-4 text-center text-sm text-gray-400">
          Or sign in with:
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            className="p-2 bg-white rounded border text-gray-700 hover:bg-gray-200"
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('github')}
            className="p-2 bg-white rounded border text-gray-700 hover:bg-gray-200"
          >
            GitHub
          </button>
        </div>
      </form>
    </div>
  );
}