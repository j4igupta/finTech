import Link from 'next/link';
import { motion } from 'framer-motion';
import { NetWorth } from '@/components/NetWorth';
import { Streaks } from '@/components/Streaks';

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between py-4 px-6 bg-gray-800 border-b border-gray-700"
    >
      <motion.link
        href="/"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-semibold text-primary"
      >
        Financial MMO
      </link>
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
