import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Create auth user
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    // Insert profile record (todo: move to edge function)
    const { error: dbError } = await supabase.from('profiles').insert({
      id: (await supabase.auth.getUser()).data.user?.id,
      username,
    });
    if (dbError) setError(dbError.message);
    else setError(null);
    // TODO: redirect after successful sign‑up
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded bg-gray-800 p-6">
        <h2 className="mb-4 text-center text-2xl font-bold text-white">Sign Up</h2>
        {error && <p className="mb-2 text-red-400">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-3 w-full rounded bg-gray-700 p-2 text-white"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded bg-gray-700 p-2 text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 w-full rounded bg-gray-700 p-2 text-white"
          required
        />
        <button
          type="submit"
          className="w-full rounded bg-primary py-2 font-semibold hover:bg-primary/80"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
