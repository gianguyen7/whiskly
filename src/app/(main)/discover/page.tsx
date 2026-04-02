export default function DiscoverPage() {
  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-matcha-700">Discover</h1>
      <p className="text-gray-500">
        Articles about matcha pairings, preparation, origins, and guides.
      </p>

      {/* TODO: Fetch articles from article-service */}
      {/* TODO: Category filter tabs */}
      {/* TODO: Article cards with title, category, summary */}
      {/* TODO: Personalized article recommendations based on taste profile */}

      <div className="text-center py-12 text-gray-400">
        <p>Content articles coming soon</p>
      </div>
    </div>
  );
}
