import Link from "next/link";

export default function LogHistoryPage() {
  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-matcha-700">My Logs</h1>
        <Link
          href="/log/new"
          className="px-4 py-2 rounded-xl bg-matcha-600 text-white text-sm font-medium hover:bg-matcha-700 transition-colors"
        >
          + New Log
        </Link>
      </div>
      <p className="text-gray-500">Your matcha tasting history.</p>

      {/* TODO: Fetch logs from log-service */}
      {/* TODO: Log entry cards with date, matcha name, rating */}

      <div className="text-center py-12 text-gray-400">
        <p>No logs yet. Start logging your matcha experiences!</p>
      </div>
    </div>
  );
}
