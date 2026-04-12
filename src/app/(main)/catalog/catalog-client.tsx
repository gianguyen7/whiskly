"use client";

import { useState, useDeferredValue, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import type { Matcha } from "@/models/matcha";
import { MatchaCard } from "@/components/ui/matcha-card";

const TYPES = [
  { value: "all", label: "All" },
  { value: "ceremonial", label: "Ceremonial" },
  { value: "premium", label: "Premium" },
  { value: "culinary", label: "Culinary" },
  { value: "latte", label: "Latte" },
  { value: "other", label: "Other" },
];

const TASTE_NOTES = ["Umami", "Sweet", "Bitter", "Grassy", "Creamy"];

const GOOD_FOR = ["Latte", "Usucha", "Koicha", "Cold Brew", "Baking", "Smoothie"];

const PRICE_TIERS = [
  { value: "budget", label: "$ Budget", max: 0.5 },
  { value: "mid", label: "$$ Mid", max: 1.0 },
  { value: "premium", label: "$$$ Premium", max: 2.0 },
  { value: "luxury", label: "$$$$ Luxury", max: Infinity },
];

interface CatalogClientProps {
  initialMatchas: Matcha[];
  totalCount: number;
  initialSearch: string;
  initialType: string;
  pageSize: number;
}

export function CatalogClient({
  initialMatchas,
  totalCount,
  initialSearch,
  initialType,
  pageSize,
}: CatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [activeType, setActiveType] = useState(initialType);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [selectedGoodFor, setSelectedGoodFor] = useState<string[]>([]);
  const [selectedPriceTier, setSelectedPriceTier] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);

  const activeFilterCount =
    selectedNotes.length +
    selectedGoodFor.length +
    (selectedPriceTier ? 1 : 0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (deferredSearch) params.set("q", deferredSearch);
    if (activeType !== "all") params.set("type", activeType);
    const queryString = params.toString();
    router.replace(`/catalog${queryString ? `?${queryString}` : ""}`);
  }, [deferredSearch, activeType, router]);

  // Client-side filtering for notes, good_for, and price
  // (server-side filtering will be added with the migration)
  const filteredMatchas = initialMatchas.filter((m) => {
    if (selectedNotes.length > 0) {
      const matchesTaste = selectedNotes.some((note) => {
        const key = note.toLowerCase() === "sweet" ? "sweetness" : note.toLowerCase();
        const val = m[key as keyof Matcha];
        return typeof val === "number" && val >= 3.5;
      });
      if (!matchesTaste) return false;
    }

    if (selectedGoodFor.length > 0) {
      if (!m.good_for || !selectedGoodFor.some((g) => m.good_for.includes(g.toLowerCase() as never))) {
        return false;
      }
    }

    if (selectedPriceTier && m.price_per_gram != null) {
      const tier = PRICE_TIERS.find((t) => t.value === selectedPriceTier);
      if (tier) {
        const prevMax = PRICE_TIERS[PRICE_TIERS.indexOf(tier) - 1]?.max ?? 0;
        if (m.price_per_gram <= prevMax || m.price_per_gram > tier.max) return false;
      }
    }

    return true;
  });

  function toggleArrayItem(arr: string[], item: string): string[] {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  }

  function clearAllFilters() {
    setSelectedNotes([]);
    setSelectedGoodFor([]);
    setSelectedPriceTier(null);
    setActiveType("all");
  }

  const loadedCount = filteredMatchas.length;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const hasMore = currentPage * pageSize < totalCount;

  return (
    <>
      {/* Sticky search + type chips */}
      <div className="sticky top-0 z-10 bg-background px-4 pt-3 pb-2 space-y-2.5">
        {/* Search bar with filter toggle */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search matcha..."
              aria-label="Search matcha catalog"
              className="w-full h-11 pl-10 pr-10 border border-warm-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-matcha-500 focus:border-transparent"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center bg-warm-200 rounded-full text-gray-600 hover:bg-warm-300 transition-colors"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-11 w-11 flex items-center justify-center rounded-xl border transition-colors relative ${
              showFilters || activeFilterCount > 0
                ? "bg-matcha-600 border-matcha-600 text-white"
                : "bg-white border-warm-300 text-gray-500 hover:border-warm-400"
            }`}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal size={18} strokeWidth={2} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-matcha-800 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Type chips */}
        <div
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5"
          role="radiogroup"
          aria-label="Filter by type"
        >
          {TYPES.map((t) => (
            <button
              key={t.value}
              role="radio"
              aria-checked={activeType === t.value}
              onClick={() => setActiveType(t.value)}
              className={`flex-shrink-0 px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeType === t.value
                  ? "bg-matcha-600 text-white"
                  : "bg-warm-100 text-gray-700 hover:bg-warm-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable filter panel */}
      {showFilters && (
        <div className="px-4 pt-2 pb-3 bg-background border-b border-warm-200 space-y-4">
          {/* Taste notes */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Taste Notes
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {TASTE_NOTES.map((note) => (
                <button
                  key={note}
                  onClick={() => setSelectedNotes(toggleArrayItem(selectedNotes, note))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                    selectedNotes.includes(note)
                      ? "bg-matcha-600 text-white"
                      : "bg-warm-100 text-gray-600 hover:bg-warm-200"
                  }`}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Good for */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Good For
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {GOOD_FOR.map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedGoodFor(toggleArrayItem(selectedGoodFor, item))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                    selectedGoodFor.includes(item)
                      ? "bg-matcha-600 text-white"
                      : "bg-warm-100 text-gray-600 hover:bg-warm-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Price tier */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Price Range
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {PRICE_TIERS.map((tier) => (
                <button
                  key={tier.value}
                  onClick={() =>
                    setSelectedPriceTier(
                      selectedPriceTier === tier.value ? null : tier.value
                    )
                  }
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                    selectedPriceTier === tier.value
                      ? "bg-matcha-600 text-white"
                      : "bg-warm-100 text-gray-600 hover:bg-warm-200"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear all */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-matcha-600 hover:text-matcha-700"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {filteredMatchas.length > 0 ? (
        <>
          {(search || activeFilterCount > 0) && (
            <p className="text-sm text-gray-400 px-4 pt-2">
              {filteredMatchas.length} result{filteredMatchas.length !== 1 ? "s" : ""}
            </p>
          )}
          <div className="flex flex-col gap-3 px-4 pt-3 pb-24">
            {filteredMatchas.map((matcha) => (
              <MatchaCard key={matcha.id} matcha={matcha} />
            ))}

            {hasMore && activeFilterCount === 0 && (
              <div className="text-center pt-2 space-y-2">
                <p className="text-sm text-gray-400">
                  Showing {loadedCount} of {totalCount}
                </p>
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", String(currentPage + 1));
                    router.push(`/catalog?${params.toString()}`);
                  }}
                  className="px-6 py-2.5 text-sm font-medium rounded-xl border border-matcha-300 text-matcha-700 hover:bg-matcha-50 transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <Search
            className="text-matcha-300 mb-4"
            size={48}
            strokeWidth={1.5}
            aria-hidden="true"
          />
          {search || activeFilterCount > 0 ? (
            <>
              <p className="font-medium text-gray-700">
                No matches found
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search or filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  clearAllFilters();
                }}
                className="mt-3 text-sm font-semibold text-matcha-600 hover:text-matcha-700"
              >
                Clear all
              </button>
            </>
          ) : (
            <>
              <p className="font-medium text-gray-700">No matcha yet</p>
              <p className="text-sm text-gray-400 mt-1">
                The catalog is being prepared. Check back soon.
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
