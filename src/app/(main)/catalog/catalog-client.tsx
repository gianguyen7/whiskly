"use client";

import { useState, useDeferredValue, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import type { Matcha } from "@/models/matcha";
import { MatchaCard } from "@/components/ui/matcha-card";

const TYPES: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ceremonial", label: "Ceremonial" },
  { value: "premium", label: "Premium" },
  { value: "culinary", label: "Culinary" },
  { value: "latte", label: "Latte" },
  { value: "other", label: "Other" },
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
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const params = new URLSearchParams();
    if (deferredSearch) params.set("q", deferredSearch);
    if (activeType !== "all") params.set("type", activeType);
    const queryString = params.toString();
    router.replace(`/catalog${queryString ? `?${queryString}` : ""}`);
  }, [deferredSearch, activeType, router]);

  const handleTypeChange = (type: string) => {
    setActiveType(type);
  };

  const loadedCount = initialMatchas.length;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const hasMore = currentPage * pageSize < totalCount;

  return (
    <>
      {/* Sticky search + filters */}
      <div className="sticky top-0 z-10 bg-background px-4 pt-3 pb-2 space-y-2.5">
        <div className="relative">
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
              onClick={() => handleTypeChange(t.value)}
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

      {/* Results */}
      {initialMatchas.length > 0 ? (
        <>
          {search && (
            <p className="text-sm text-gray-400 px-4 pt-2">
              {totalCount} result{totalCount !== 1 ? "s" : ""}
            </p>
          )}
          <div className="flex flex-col gap-3 px-4 pt-3 pb-24">
            {initialMatchas.map((matcha) => (
              <MatchaCard key={matcha.id} matcha={matcha} />
            ))}

            {hasMore && (
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
          {search ? (
            <>
              <p className="font-medium text-gray-700">
                No results for &ldquo;{search}&rdquo;
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Try a different search term or check the spelling.
              </p>
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
