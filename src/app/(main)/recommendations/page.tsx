export default function RecommendationsPage() {
  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-matcha-700">Recommendations</h1>
      <p className="text-gray-500">
        Matchas selected for your taste profile using cosine similarity.
      </p>

      {/* TODO: Check hasEnoughLogsForRecommendations() */}
      {/* TODO: Fetch from recommendation-service */}
      {/* TODO: Display recommended matcha cards with similarity scores */}

      <div className="text-center py-12 text-gray-400">
        <p>Recommendations coming soon</p>
      </div>
    </div>
  );
}
