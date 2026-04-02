export default function NewLogPage() {
  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-matcha-700">Log a Matcha</h1>
      <p className="text-gray-500">
        Rate your experience across five taste dimensions.
      </p>

      {/* TODO: Matcha selector (search/autocomplete) */}
      {/* TODO: TasteSlider x5 (umami, sweetness, bitterness, grassiness, creaminess) */}
      {/* TODO: StarRating for overall rating */}
      {/* TODO: Notes textarea */}
      {/* TODO: Submit via log-service.createLog() */}

      <div className="text-center py-12 text-gray-400">
        <p>Logging form coming soon</p>
      </div>
    </div>
  );
}
