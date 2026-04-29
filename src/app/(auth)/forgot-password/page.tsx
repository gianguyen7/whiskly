"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { forgotPassword, type AuthResult } from "../actions";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const [state, formAction, isPending] = useActionState<AuthResult, FormData>(
    async (_prev, formData) => {
      const result = await forgotPassword(formData);
      if (!result.error) {
        setSubmittedEmail((formData.get("email") as string)?.trim() || "");
        setSent(true);
      }
      return result;
    },
    {}
  );

  if (sent) {
    return (
      <main className="flex flex-col min-h-screen bg-paper">
        <div className="px-7 pt-[70px]">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-matcha-800 mb-4"
          >
            <ChevronRight size={12} className="rotate-180" /> Back
          </Link>

          <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-mute mt-6">
            Check your inbox
          </p>
          <h1
            className="font-display text-[44px] leading-[1.05] tracking-tight text-ink mt-1.5"
            style={{ fontWeight: 400 }}
          >
            Link{" "}
            <span className="italic text-matcha-800" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}>
              sent.
            </span>
          </h1>
          <p className="font-sans text-[14px] text-ink-soft leading-relaxed mt-3 max-w-[290px]">
            If an account exists for {submittedEmail}, we&apos;ve sent a
            password reset link. Check your inbox and spam folder.
          </p>
        </div>

        <div className="px-7 mt-8">
          <Link
            href="/login"
            className="flex items-center justify-between w-full px-5 py-4 rounded-full bg-matcha-800 text-matcha-50 font-sans font-semibold text-[15px]"
          >
            Back to Sign In
            <ChevronRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-paper">
      <div className="px-7 pt-[70px]">
        <Link
          href="/login"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-card border border-[rgba(27,29,24,0.12)] mb-5"
        >
          <ChevronRight size={16} className="text-ink rotate-180" />
        </Link>

        <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-mute">
          Lost your way
        </p>
        <h1
          className="font-display text-[44px] leading-[1.05] tracking-tight text-ink mt-1.5"
          style={{ fontWeight: 400 }}
        >
          Reset,{" "}
          <span className="italic text-matcha-800" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}>
            quietly.
          </span>
        </h1>
        <p className="font-sans text-[14px] text-ink-soft leading-relaxed mt-3 max-w-[290px]">
          We&apos;ll send a one-time link to your inbox. It expires in 15 minutes &mdash; for safety, of course.
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

      <form action={formAction} className="px-7 pt-8 space-y-4">
        <div>
          <label className="text-label text-ink-soft mb-1.5 block">
            Email on file
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3.5 bg-card border border-[rgba(27,29,24,0.12)] rounded-[14px] font-sans text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-matcha-800 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-between w-full px-5 py-4 rounded-full bg-matcha-800 text-matcha-50 font-sans font-semibold text-[15px] transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {isPending ? "Sending..." : "Send reset link"}
          <ChevronRight size={18} />
        </button>
      </form>

      {/* While you wait tip */}
      <div className="mx-7 mt-6">
        <div className="bg-card rounded-[14px] border border-[rgba(27,29,24,0.12)] p-4">
          <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-soft mb-1.5">
            While you wait
          </p>
          <p
            className="font-serif italic text-[15px] text-ink leading-snug"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
          >
            Try the steam method: 70&deg;C, 60 seconds, eyes closed.
          </p>
        </div>
      </div>
    </main>
  );
}
