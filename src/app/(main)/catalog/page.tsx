import { Suspense } from "react";
import { getMatchas } from "@/services/matcha-service";
import { CatalogClient } from "./catalog-client";

interface Props {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}

export default async function CatalogPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.q || "";
  const type = params.type || "all";
  const page = parseInt(params.page || "1", 10);
  const pageSize = 20;

  const { data: matchas, count } = await getMatchas({
    search: search || undefined,
    type: type !== "all" ? type : undefined,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return (
    <div className="max-w-lg mx-auto">
      {/* Cha-dō header */}
      <div className="px-6 pt-4">
        <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-mute">
          Catalog
        </p>
        <h1
          className="font-display text-[44px] leading-[1.05] tracking-tight text-ink mt-1.5"
          style={{ fontWeight: 400 }}
        >
          Find your next{" "}
          <span
            className="italic text-matcha-800"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
          >
            ritual.
          </span>
        </h1>
      </div>

      <Suspense>
        <CatalogClient
          initialMatchas={matchas}
          totalCount={count}
          initialSearch={search}
          initialType={type}
          pageSize={pageSize}
        />
      </Suspense>
    </div>
  );
}
