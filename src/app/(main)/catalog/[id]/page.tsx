import Link from "next/link";
import { notFound } from "next/navigation";
import { getMatchaById } from "@/services/matcha-service";

interface Props {
  params: Promise<{ id: string }>;
}

const TASTE_DIMENSIONS = [
  { key: "umami", label: "Umami" },
  { key: "sweetness", label: "Sweetness" },
  { key: "bitterness", label: "Bitterness" },
  { key: "grassiness", label: "Grassiness" },
  { key: "creaminess", label: "Creaminess" },
] as const;

function TasteBar({ label, value }: { label: string; value: number | null }) {
  if (value === null) return null;
  const pct = (value / 5) * 100;
  const intensity =
    value <= 2 ? "bg-matcha-300" : value <= 3.5 ? "bg-matcha-400" : "bg-matcha-600";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-[90px] flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 h-2 bg-matcha-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${intensity}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-7 text-right flex-shrink-0">
        {value}
      </span>
    </div>
  );
}

export default async function MatchaDetailPage({ params }: Props) {
  const { id } = await params;
  const matcha = await getMatchaById(id);

  if (!matcha) {
    notFound();
  }

  const hasTasteData = TASTE_DIMENSIONS.some(
    (d) => matcha[d.key] !== null
  );

  return (
    <div className="max-w-lg mx-auto pb-24">
      {/* Back link */}
      <div className="px-4 pt-4">
        <Link
          href="/catalog"
          className="text-sm text-matcha-600 font-medium inline-flex items-center gap-1"
        >
          ‹ Catalog
        </Link>
      </div>

      {/* Hero */}
      <div className="px-4 mt-4 space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">{matcha.name}</h1>
        <p className="text-base text-gray-500">{matcha.brand}</p>
        <div className="flex items-center gap-2.5 mt-1">
          {matcha.region && (
            <span className="text-sm text-gray-400">{matcha.region}</span>
          )}
          <span className="text-xs px-2 py-1 rounded-full bg-matcha-100 text-matcha-800 capitalize">
            {matcha.type}
          </span>
        </div>
      </div>

      <hr className="border-gray-100 mx-4 my-5" />

      {/* Taste profile */}
      <div className="px-4">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Taste Profile
        </h2>
        {hasTasteData ? (
          <div className="space-y-3.5">
            {TASTE_DIMENSIONS.map((d) => (
              <TasteBar key={d.key} label={d.label} value={matcha[d.key]} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm font-medium text-gray-500">
              No taste data yet
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Be the first to log this matcha and contribute taste notes.
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      {matcha.description && (
        <>
          <hr className="border-gray-100 mx-4 my-5" />
          <div className="px-4">
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              About
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {matcha.description}
            </p>
          </div>
        </>
      )}

      <hr className="border-gray-100 mx-4 my-5" />

      {/* CTAs */}
      <div className="px-4 space-y-3">
        <Link
          href={`/log/new?matcha=${matcha.id}`}
          className="block w-full py-3 rounded-xl bg-matcha-600 text-white font-medium hover:bg-matcha-700 transition-colors text-center"
        >
          Log This Matcha
        </Link>
        <button
          disabled
          className="w-full py-3 rounded-xl border border-matcha-300 text-matcha-700 font-medium opacity-40 cursor-not-allowed"
        >
          Compare to My Profile
        </button>
        <p className="text-xs text-gray-400 text-center">
          Coming in a future update
        </p>
      </div>
    </div>
  );
}
