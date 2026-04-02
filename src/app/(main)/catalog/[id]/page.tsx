interface MatchaDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchaDetailPage({ params }: MatchaDetailPageProps) {
  const { id } = await params;

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-matcha-700">Matcha Detail</h1>
      <p className="text-sm text-gray-400">ID: {id}</p>

      {/* TODO: Fetch matcha by ID from matcha-service */}
      {/* TODO: Display full details, taste profile radar chart */}
      {/* TODO: Button to log this matcha */}
      {/* TODO: Show user's previous logs for this matcha */}

      <div className="text-center py-12 text-gray-400">
        <p>Detail view coming soon</p>
      </div>
    </div>
  );
}
