"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Profile {
  username: string;
  rank: string;
  xp: number;
  avatar_url: string | null;
}

export function ProfileSummary() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (active) {
          setError('Not signed in.');
          setLoading(false);
        }
        return;
      }
      const { data, error: err } = await supabase
        .from('profiles')
        .select('username, rank, xp, avatar_url')
        .eq('id', user.id)
        .maybeSingle();
      if (!active) return;
      if (err) setError(err.message);
      else setProfile((data as Profile) ?? null);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
        Loading profile…
      </section>
    );
  }

  if (error || !profile) {
    return (
      <section className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
        {error ?? 'No profile found.'}
      </section>
    );
  }

  const initials = (profile.username || '??').slice(0, 2).toUpperCase();

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1E90FF]/30 to-[#FF69B4]/30 text-xl font-bold text-foreground">
          {initials}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{profile.username}</h2>
          <p className="text-sm text-muted-foreground">
            Rank: <span className="text-[#1E90FF]">{profile.rank}</span> ·{' '}
            <span className="text-[#00FFAA]">{profile.xp.toLocaleString()} XP</span>
          </p>
        </div>
      </div>
    </section>
  );
}
