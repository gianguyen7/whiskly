import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="max-w-md space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-matcha-700 tracking-tight">
            Whiskly
          </h1>
          <p className="text-lg text-gray-500">
            Discover your matcha taste profile
          </p>
        </div>

        <p className="text-gray-600">
          Log your matcha experiences, build a personal taste profile, and get
          recommendations matched to your palate.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-matcha-600 text-white font-medium hover:bg-matcha-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-matcha-300 text-matcha-700 font-medium hover:bg-matcha-50 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
