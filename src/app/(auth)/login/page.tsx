"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthResult } from "../actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<AuthResult, FormData>(
    async (_prev, formData) => login(formData),
    {}
  );

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <img src="/logo.svg" alt="" className="w-10 h-10 mx-auto" />
          <h1 className="text-2xl font-bold text-matcha-700">whiskly</h1>
          <p className="text-sm text-gray-500">Welcome back</p>
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
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Your password"
              className="w-full h-11 px-3.5 border border-warm-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-matcha-500 focus:border-transparent"
            />
            <div className="text-right mt-1.5">
              <Link
                href="/forgot-password"
                className="text-sm text-matcha-600 font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-matcha-600 text-white font-medium hover:bg-matcha-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-matcha-600 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
