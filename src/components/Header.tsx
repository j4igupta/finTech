"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { NetWorth } from '@/components/NetWorth';
import { Streaks } from '@/components/Streaks';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 1. Create a custom motion-enabled Next.js Link component
const MotionLink = motion(Link);

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between py-4 px-6 bg-gray-800 border-b border-gray-700"
    >
      {/* 2. Use your new MotionLink here instead of motion.link */}
      <MotionLink
        href="/"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-semibold text-primary"
      >
        Financial MMO
      </MotionLink>
      
      {/* Right side: NetWorth, Rank, XP, Avatar */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center space-x-4"
      >
        <NetWorth />
        <Streaks />
      </motion.div>
    </motion.header>
  );
}