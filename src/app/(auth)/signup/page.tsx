export default function SignupPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-matcha-700">Create account</h1>
          <p className="text-sm text-gray-500">
            Start your matcha discovery journey
          </p>
        </div>

        {/* TODO: Implement signup form with Supabase auth */}
        <form className="space-y-4">
          <div>
            <label htmlFor="display-name" className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              id="display-name"
              type="text"
              placeholder="Your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-matcha-500 focus:border-transparent"
            />
          </div>
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
              placeholder="Create a password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-matcha-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-matcha-600 text-white font-medium hover:bg-matcha-700 transition-colors"
          >
            Create Account
          </button>
        </form>
      </div>
    </main>
  );
}
