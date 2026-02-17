import Link from 'next/link';

const Header = () => (
  <header className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
    <Link
      href="/"
      className="text-xl font-semibold text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
    >
      StreetSmart
    </Link>
  </header>
);

export default Header;