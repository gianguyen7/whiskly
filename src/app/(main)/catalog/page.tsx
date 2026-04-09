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
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold text-matcha-700">Catalog</h1>
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
