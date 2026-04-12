"use client";

import { logout } from "@/app/(auth)/actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="w-full py-2.5 rounded-xl border border-warm-300 text-gray-700 text-sm font-medium hover:bg-warm-100 transition-colors"
      >
        Log out
      </button>
    </form>
  );
}
