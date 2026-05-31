"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Streaks } from '@/components/Streaks';
import { createClient } from '@/lib/supabase/client';
import { formatNumber } from '@/lib/format';

const MotionLink = motion(Link);

export function Header() {
  const [profile, setProfile] = useState<{ username: string; rank: string; xp: number } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('username, rank, xp')
        .eq('id', user.id)
        .maybeSingle();
      if (active && data) setProfile(data as { username: string; rank: string; xp: number });
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between border-b border-border bg-card px-6 py-4"
    >
      <MotionLink
        href="/dashboard"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold tracking-tight text-foreground"
      >
        Fin<span className="text-[#1E90FF]">Quest</span>
      </MotionLink>

      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center gap-4"
      >
        <Streaks />
        {profile && (
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-full bg-[#00FFAA]/10 px-3 py-1 font-medium text-[#00FFAA]">
              {formatNumber(profile.xp)} XP
            </span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{profile.username}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1E90FF]/30 to-[#FF69B4]/30 text-xs font-bold uppercase text-foreground">
                {(profile.username || '??').slice(0, 2)}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.header>
  );
}
