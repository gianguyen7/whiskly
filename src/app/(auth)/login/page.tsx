export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-matcha-700">Welcome back</h1>
          <p className="text-sm text-gray-500">
            Sign in to continue to Whiskly
          </p>
        </div>

        {/* TODO: Implement login form with Supabase auth */}
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-matcha-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-matcha-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-matcha-600 text-white font-medium hover:bg-matcha-700 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
