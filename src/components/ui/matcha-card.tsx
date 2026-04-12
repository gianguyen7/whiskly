import type { Matcha } from "@/models/matcha";
import Link from "next/link";
import { Droplets } from "lucide-react";

interface MatchaCardProps {
  matcha: Matcha;
}

function formatPrice(pricePerGram: number): string {
  return `$${pricePerGram.toFixed(2)}/g`;
}

function getTasteHighlights(matcha: Matcha): string[] {
  const dimensions: { key: keyof Matcha; label: string }[] = [
    { key: "umami", label: "Umami" },
    { key: "sweetness", label: "Sweet" },
    { key: "bitterness", label: "Bitter" },
    { key: "grassiness", label: "Grassy" },
    { key: "creaminess", label: "Creamy" },
  ];

  return dimensions
    .filter((d) => {
      const val = matcha[d.key];
      return typeof val === "number" && val >= 3.5;
    })
    .sort((a, b) => ((matcha[b.key] as number) ?? 0) - ((matcha[a.key] as number) ?? 0))
    .slice(0, 2)
    .map((d) => d.label);
}

export function MatchaCard({ matcha }: MatchaCardProps) {
  const highlights = getTasteHighlights(matcha);

  return (
    <Link
      href={`/catalog/${matcha.id}`}
      className="block rounded-2xl border border-warm-200 bg-white hover:shadow-md hover:border-matcha-300 transition-all overflow-hidden"
    >
      <div className="p-4 space-y-2.5">
        {/* Top row: name + type + price */}
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <h3 className="font-bold text-[15px] text-gray-900 truncate">
              {matcha.name}
            </h3>
            <p className="text-sm text-gray-400">{matcha.brand}</p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-matcha-50 text-matcha-700 font-semibold capitalize">
              {matcha.type}
            </span>
            {matcha.price_per_gram != null && (
              <span className="text-[11px] font-semibold text-gray-500">
                {formatPrice(matcha.price_per_gram)}
              </span>
            )}
          </div>
        </div>

        {/* Taste notes + good for tags */}
        {(highlights.length > 0 || (matcha.good_for && matcha.good_for.length > 0)) && (
          <div className="flex flex-wrap gap-1.5">
            {highlights.map((h) => (
              <span
                key={h}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warm-100 text-gray-600 uppercase tracking-wider"
              >
                {h}
              </span>
            ))}
            {matcha.good_for?.map((g) => (
              <span
                key={g}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-matcha-50 text-matcha-600 capitalize"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Milk pairing */}
        {matcha.milk_pairing && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <Droplets size={12} className="text-blue-400 flex-shrink-0" />
            <span className="text-[11px] text-gray-500">
              Best with <span className="font-semibold text-gray-600">{matcha.milk_pairing}</span>
            </span>
          </div>
        )}

        {/* Description */}
        {matcha.description && (
          <p className="text-[13px] text-gray-500 leading-snug line-clamp-2">
            {matcha.description}
          </p>
        )}
      </div>
    </Link>
  );
}
