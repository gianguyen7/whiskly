"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type AuthResult } from "../actions";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<AuthResult, FormData>(
    async (_prev, formData) => signup(formData),
    {}
  );

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <img src="/logo.svg" alt="" className="w-10 h-10 mx-auto" />
          <h1 className="text-2xl font-bold text-matcha-700">whiskly</h1>
          <p className="text-sm text-gray-500">Start your matcha journey</p>
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
              htmlFor="displayName"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Display Name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              placeholder="Your name"
              className="w-full h-11 px-3.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-matcha-500 focus:border-transparent"
            />
          </div>
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
              className="w-full h-11 px-3.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-matcha-500 focus:border-transparent"
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
              minLength={8}
              placeholder="Create a password"
              className="w-full h-11 px-3.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-matcha-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">
              Must be at least 8 characters
            </p>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-matcha-600 text-white font-medium hover:bg-matcha-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-matcha-600 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
