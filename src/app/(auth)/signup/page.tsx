"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { signup, type AuthResult } from "../actions";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<AuthResult, FormData>(
    async (_prev, formData) => signup(formData),
    {}
  );

  return (
    <main className="flex flex-col min-h-screen bg-paper">
      <div className="px-7 pt-[70px]">
        <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-mute">
          Begin a journal
        </p>
        <h1 className="font-display text-[44px] leading-[1.05] tracking-tight text-ink mt-1.5" style={{ fontWeight: 400 }}>
          Make it{" "}
          <span className="font-display italic text-matcha-800" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}>
            yours.
          </span>
        </h1>
        <p className="font-sans text-[14px] leading-relaxed text-ink-soft mt-3 max-w-[280px]">
          Three steps. We&apos;ll learn your palate from there.
        </p>
      </div>

      {state.error && (
        <div
          role="alert"
          className="mx-7 mt-4 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-2xl"
        >
          {state.error}
        </div>
      )}

      <form action={formAction} className="px-7 pt-7 space-y-3.5">
        <div>
          <label className="text-label text-ink-soft mb-1.5 block">Display name</label>
          <input
            name="displayName"
            type="text"
            required
            placeholder="Your name"
            className="w-full px-4 py-3.5 bg-card border border-[rgba(27,29,24,0.12)] rounded-[14px] font-serif italic text-[17px] text-ink focus:outline-none focus:ring-2 focus:ring-matcha-800 focus:border-transparent"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
          />
        </div>
        <div>
          <label className="text-label text-ink-soft mb-1.5 block">Email</label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3.5 bg-card border border-[rgba(27,29,24,0.12)] rounded-[14px] font-sans text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-matcha-800 focus:border-transparent"
          />
        </div>
        <div>
          <label className="text-label text-ink-soft mb-1.5 block">Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Create a password"
            className="w-full px-4 py-3.5 bg-card border border-[rgba(27,29,24,0.12)] rounded-[14px] font-sans text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-matcha-800 focus:border-transparent"
          />
          <p className="text-xs text-ink-mute mt-1">
            Must be at least 8 characters
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-between w-full px-5 py-4 rounded-full bg-matcha-800 text-matcha-50 font-sans font-semibold text-[15px] transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {isPending ? "Creating account..." : "Continue to palate"}
            <ChevronRight size={18} />
          </button>
        </div>
      </form>

      <div className="mt-auto pb-10 text-center">
        <p className="font-sans text-[13px] text-ink-mute">
          Already a member?{" "}
          <Link href="/login" className="text-ink font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
