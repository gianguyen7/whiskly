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
];

const TASTE_NOTES = ["Umami", "Sweet", "Bitter", "Grassy", "Creamy"];

const GOOD_FOR = ["Latte", "Usucha", "Koicha", "Cold Brew", "Baking", "Smoothie"];

const PRICE_TIERS = [
  { value: "budget", label: "$", max: 0.5 },
  { value: "mid", label: "$$", max: 1.0 },
  { value: "premium", label: "$$$", max: 2.0 },
  { value: "luxury", label: "$$$$", max: Infinity },
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
      {/* Search + filter */}
      <div className="sticky top-0 z-10 bg-paper px-6 pt-5 pb-3 space-y-3">
        <div className="flex gap-2.5">
          <div className="flex-1 flex items-center gap-2.5 px-4 py-3.5 bg-card rounded-full border border-[rgba(27,29,24,0.12)]">
            <Search size={18} className="text-ink-mute flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Brand, origin, taste\u2026"
              aria-label="Search matcha catalog"
              className="flex-1 bg-transparent text-[14px] font-sans text-ink placeholder:text-ink-mute focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="text-ink-mute"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-12 h-12 flex items-center justify-center rounded-full border transition-colors relative ${
              showFilters || activeFilterCount > 0
                ? "bg-matcha-800 border-matcha-800 text-paper"
                : "bg-card border-[rgba(27,29,24,0.12)] text-ink"
            }`}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal size={18} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ink text-paper text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Type chips */}
        <div
          className="flex gap-1.5 overflow-x-auto scrollbar-hide"
          role="radiogroup"
          aria-label="Filter by type"
        >
          {TYPES.map((t) => (
            <button
              key={t.value}
              role="radio"
              aria-checked={activeType === t.value}
              onClick={() => setActiveType(t.value)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-mono text-[10px] font-medium tracking-[0.12em] uppercase transition-colors ${
                activeType === t.value
                  ? "bg-ink text-paper"
                  : "bg-transparent text-ink border border-[rgba(27,29,24,0.12)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable filter panel */}
      {showFilters && (
        <div className="mx-6 mb-3">
          <div className="bg-card rounded-2xl border border-[rgba(27,29,24,0.12)] p-3.5 space-y-3">
            {/* Taste notes */}
            <div>
              <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-soft mb-2">
                Taste notes
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TASTE_NOTES.map((note) => (
                  <button
                    key={note}
                    onClick={() => setSelectedNotes(toggleArrayItem(selectedNotes, note))}
                    className={`px-2.5 py-1 rounded-full font-mono text-[9px] font-medium tracking-[0.12em] uppercase transition-colors ${
                      selectedNotes.includes(note)
                        ? "bg-ink text-paper"
                        : "bg-transparent text-ink border border-[rgba(27,29,24,0.12)]"
                    }`}
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-[rgba(27,29,24,0.12)]" />

            {/* Good for */}
            <div>
              <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-soft mb-2">
                Good for
              </p>
              <div className="flex flex-wrap gap-1.5">
                {GOOD_FOR.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedGoodFor(toggleArrayItem(selectedGoodFor, item))}
                    className={`px-2.5 py-1 rounded-full font-mono text-[9px] font-medium tracking-[0.12em] uppercase transition-colors ${
                      selectedGoodFor.includes(item)
                        ? "bg-ink text-paper"
                        : "bg-transparent text-ink border border-[rgba(27,29,24,0.12)]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-[rgba(27,29,24,0.12)]" />

            {/* Price tier */}
            <div>
              <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-soft mb-2">
                Price &middot; per gram
              </p>
              <div className="flex gap-1.5">
                {PRICE_TIERS.map((tier) => (
                  <button
                    key={tier.value}
                    onClick={() =>
                      setSelectedPriceTier(
                        selectedPriceTier === tier.value ? null : tier.value
                      )
                    }
                    className={`flex-1 py-2 text-center rounded-full font-serif text-[14px] transition-colors ${
                      selectedPriceTier === tier.value
                        ? "bg-matcha-800 text-paper"
                        : "bg-transparent text-ink border border-[rgba(27,29,24,0.12)]"
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-matcha-800"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {filteredMatchas.length > 0 ? (
        <>
          <div className="px-6 pt-2">
            <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-mute mb-2.5">
              {filteredMatchas.length} matchas &mdash; sorted by match
            </p>
          </div>
          <div className="flex flex-col gap-2.5 px-6 pb-28">
            {filteredMatchas.map((matcha, i) => (
              <MatchaCard key={matcha.id} matcha={matcha} rank={96 - i * 6} />
            ))}

            {hasMore && activeFilterCount === 0 && (
              <div className="text-center pt-4">
                <p className="font-sans text-[13px] text-ink-mute mb-2">
                  Showing {loadedCount} of {totalCount}
                </p>
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", String(currentPage + 1));
                    router.push(`/catalog?${params.toString()}`);
                  }}
                  className="px-5 py-2.5 rounded-full border border-ink text-ink font-sans font-semibold text-sm"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <Search className="text-ink-mute mb-4" size={48} strokeWidth={1.5} />
          {search || activeFilterCount > 0 ? (
            <>
              <p className="font-sans font-semibold text-ink">No matches found</p>
              <p className="font-sans text-sm text-ink-mute mt-1">
                Try adjusting your search or filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  clearAllFilters();
                }}
                className="mt-3 font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-matcha-800"
              >
                Clear all
              </button>
            </>
          ) : (
            <>
              <p className="font-sans font-semibold text-ink">No matcha yet</p>
              <p className="font-sans text-sm text-ink-mute mt-1">
                The catalog is being prepared. Check back soon.
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
