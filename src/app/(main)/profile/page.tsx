export default function ProfilePage() {
  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-matcha-700">Taste Profile</h1>
      <p className="text-gray-500">
        Your personal matcha taste profile, built from your logs.
      </p>

      {/* TODO: Fetch profile from profile-service */}
      {/* TODO: RadarChart with user's taste averages */}
      {/* TODO: Stats: total logs, favorite dimensions */}
      {/* TODO: Link to recommendations if log_count >= 3 */}

      <div className="text-center py-12 text-gray-400">
        <p>Log at least 3 matchas to see your taste profile.</p>
      </div>
    </div>
  );
}
