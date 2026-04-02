"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: "/catalog", label: "Catalog", icon: "search" },
  { href: "/log", label: "Log", icon: "edit" },
  { href: "/profile", label: "Profile", icon: "user" },
  { href: "/discover", label: "Discover", icon: "book" },
];

/**
 * Bottom navigation bar for mobile-first layout.
 * Highlights the active route.
 */
export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "text-matcha-700"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <NavIcon name={item.icon} active={isActive} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const strokeColor = active ? "currentColor" : "currentColor";
  const strokeWidth = active ? 2.5 : 2;

  const icons: Record<string, React.ReactNode> = {
    search: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    edit: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    user: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    book: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  };

  return <>{icons[name]}</>;
}
