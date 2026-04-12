"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
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
      <main className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <Link
            href="/login"
            className="text-sm text-matcha-600 font-medium inline-flex items-center gap-1"
          >
            ‹ Back
          </Link>

          <div className="space-y-2 pt-4">
            <div className="text-4xl">✉️</div>
            <h2 className="text-xl font-bold text-matcha-700">
              Check your email
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
              If an account exists for {submittedEmail}, we&apos;ve sent a
              password reset link. Check your inbox and spam folder.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-block w-full py-3 rounded-xl bg-matcha-600 text-white font-medium hover:bg-matcha-700 transition-colors text-center"
          >
            Back to Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-sm space-y-6">
        <Link
          href="/login"
          className="text-sm text-matcha-600 font-medium inline-flex items-center gap-1"
        >
          ‹ Back
        </Link>

        <div className="text-center space-y-2">
          <img src="/logo.svg" alt="" className="w-10 h-10 mx-auto" />
          <h1 className="text-xl font-bold text-matcha-700">
            Reset your password
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
            Enter the email address you used to create your account and
            we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {state.error && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl"
          >
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full h-11 px-3.5 border border-warm-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-matcha-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-matcha-600 text-white font-medium hover:bg-matcha-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </main>
  );
}
