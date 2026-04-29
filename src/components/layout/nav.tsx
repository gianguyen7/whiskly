"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, BookOpen, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/for-you", label: "Today", icon: Home },
  { href: "/catalog", label: "Catalog", icon: Search },
  { href: "/log", label: "Log", icon: Plus },
  { href: "/discover", label: "Journal", icon: BookOpen },
  { href: "/profile", label: "Me", icon: User },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-safe pointer-events-none">
      {/* Gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/95 to-transparent" />

      {/* Pill container */}
      <div className="relative mx-auto max-w-lg mb-2 pointer-events-auto">
        <nav
          className="flex justify-between items-center bg-card rounded-full px-3.5 py-2.5"
          style={{
            boxShadow:
              "0 10px 30px rgba(27,29,24,0.1), 0 0 0 1px rgba(27,29,24,0.06)",
          }}
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/log"
                ? false
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            if (item.href === "/log") {
              return (
                <Link
                  key={item.href}
                  href="/log/new"
                  aria-label="Log a sip"
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-matcha-800 active:scale-95 transition-transform"
                >
                  <Plus size={22} strokeWidth={2} className="text-matcha-50" />
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className="flex flex-col items-center gap-0.5 px-2.5 py-1.5"
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={isActive ? "text-ink" : "text-ink-mute"}
                />
                <span
                  className="font-mono text-[8px] font-medium tracking-widest uppercase"
                  style={{ color: isActive ? "var(--ink)" : "var(--ink-mute)" }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
