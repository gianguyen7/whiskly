"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { login, type AuthResult } from "../actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<AuthResult, FormData>(
    async (_prev, formData) => login(formData),
    {}
  );

  return (
    <main className="flex flex-col min-h-screen bg-paper">
      <div className="px-7 pt-[70px]">
        <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-mute">
          Welcome back
        </p>
        <h1 className="font-display text-[44px] leading-[1.05] tracking-tight text-ink mt-1.5" style={{ fontWeight: 400 }}>
          Sign{" "}
          <span className="font-display italic text-matcha-800" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}>
            in.
          </span>
        </h1>
      </div>

      {state.error && (
        <div
          role="alert"
          className="mx-7 mt-4 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-2xl"
        >
          {state.error}
        </div>
      )}

      <form action={formAction} className="px-7 pt-8 space-y-3.5">
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
            placeholder="Your password"
            className="w-full px-4 py-3.5 bg-card border border-[rgba(27,29,24,0.12)] rounded-[14px] font-sans text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-matcha-800 focus:border-transparent"
          />
          <div className="text-right mt-1.5">
            <Link
              href="/forgot-password"
              className="font-sans text-xs font-semibold text-matcha-800"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-between w-full px-5 py-4 rounded-full bg-matcha-800 text-matcha-50 font-sans font-semibold text-[15px] transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {isPending ? "Signing in..." : "Sign in"}
            <ChevronRight size={18} />
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-2.5 px-7 my-5">
        <div className="flex-1 h-px bg-[rgba(27,29,24,0.12)]" />
        <span className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-mute">
          or
        </span>
        <div className="flex-1 h-px bg-[rgba(27,29,24,0.12)]" />
      </div>

      {/* OAuth */}
      <div className="px-7 space-y-2.5">
        <button className="flex items-center justify-center w-full px-5 py-3.5 rounded-full bg-transparent border border-ink text-ink font-sans font-semibold text-[14px]">
          Continue with Apple
        </button>
        <button className="flex items-center justify-center w-full px-5 py-3.5 rounded-full bg-transparent border border-ink text-ink font-sans font-semibold text-[14px]">
          Continue with Google
        </button>
      </div>

      {/* Footer */}
      <div className="mt-auto pb-10 text-center">
        <p className="font-sans text-[13px] text-ink-mute">
          New here?{" "}
          <Link href="/signup" className="text-ink font-semibold">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
