"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, PenLine, Search, User, type LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/catalog", label: "Catalog", icon: Search },
  { href: "/log", label: "Log", icon: PenLine },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/discover", label: "Discover", icon: BookOpen },
];

/**
 * Bottom navigation bar for mobile-first layout.
 * Highlights the active route.
 */
export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-warm-200 px-4 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={`flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "text-matcha-700"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
