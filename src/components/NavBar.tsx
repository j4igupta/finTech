import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/battle', label: 'Flash Battle' },
  { href: '/quests', label: 'Quests' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/profile', label: 'Profile' },
];

export function NavBar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <ul className="flex justify-center space-x-4 p-2 text-sm text-gray-300">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
