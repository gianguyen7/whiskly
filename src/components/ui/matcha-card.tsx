import type { Matcha } from "@/models/matcha";
import Link from "next/link";

interface MatchaCardProps {
  matcha: Matcha;
}

/**
 * Display card for a matcha in the catalog.
 * Shows name, brand, type, and a mini taste profile summary.
 */
export function MatchaCard({ matcha }: MatchaCardProps) {
  return (
    <Link
      href={`/catalog/${matcha.id}`}
      className="block p-4 rounded-xl border border-matcha-200 bg-white hover:shadow-md hover:border-matcha-400 transition-all"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">{matcha.name}</h3>
          <p className="text-sm text-gray-500">{matcha.brand}</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-matcha-100 text-matcha-800 capitalize">
          {matcha.type}
        </span>
      </div>
      {matcha.region && (
        <p className="text-xs text-gray-400 mt-1">{matcha.region}</p>
      )}
      {matcha.description && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {matcha.description}
        </p>
      )}
    </Link>
  );
}
