import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Bookmark, Share } from "lucide-react";
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

  return (
    <div className="flex items-center gap-3">
      <span className="font-sans text-sm text-ink-soft w-[90px] flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 h-1 bg-[rgba(27,29,24,0.12)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-matcha-800 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className="font-serif italic text-[20px] text-matcha-800 w-7 text-right flex-shrink-0"
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100", fontWeight: 300 }}
      >
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

  const hasTasteData = TASTE_DIMENSIONS.some((d) => matcha[d.key] !== null);

  return (
    <div className="pb-28">
      {/* Dark hero */}
      <div
        className="relative px-6 pt-16 pb-8 overflow-hidden"
        style={{ background: "#2D4014" }}
      >
        {/* Decorative cup */}
        <div className="absolute -right-8 top-10 opacity-85 pointer-events-none">
          <svg width="200" height="200" viewBox="0 0 120 120">
            <ellipse cx="60" cy="90" rx="45" ry="6" fill="rgba(0,0,0,0.08)" />
            <path d="M15 55 Q15 90,60 95 Q105 90,105 55 Z" fill="#F8F3E1" stroke="#2D4014" strokeWidth="1.5" />
            <ellipse cx="60" cy="55" rx="45" ry="8" fill="#9BC740" />
            <ellipse cx="60" cy="55" rx="45" ry="8" fill="none" stroke="#2D4014" strokeWidth="1.5" />
            <ellipse cx="48" cy="54" rx="6" ry="1.5" fill="#F8F3E1" opacity="0.7" />
            <ellipse cx="70" cy="56" rx="4" ry="1" fill="#F8F3E1" opacity="0.6" />
          </svg>
        </div>

        {/* Nav row */}
        <div className="flex justify-between items-center relative z-10">
          <Link
            href="/catalog"
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.14)" }}
          >
            <ChevronRight size={16} className="text-paper rotate-180" />
          </Link>
          <div className="flex gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.14)" }}
            >
              <Bookmark size={16} className="text-paper" />
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.14)" }}
            >
              <Share size={16} className="text-paper" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="relative z-10 mt-8">
          <p
            className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase"
            style={{ color: "rgba(248,243,225,0.6)" }}
          >
            {matcha.brand} &middot; {matcha.region || matcha.type}
          </p>
          <h1
            className="font-display text-[56px] leading-[0.95] text-paper mt-1.5"
            style={{ fontWeight: 300 }}
          >
            <span
              className="italic"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
            >
              {matcha.name}
            </span>
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            <span
              className="inline-block px-2.5 py-1 rounded-full font-mono text-[9px] font-medium tracking-[0.12em] uppercase capitalize"
              style={{
                color: "#EFEAD8",
                border: "1px solid rgba(239,234,216,0.3)",
                background: "rgba(239,234,216,0.15)",
              }}
            >
              {matcha.type}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {matcha.description && (
        <div className="px-6 pt-5">
          <p className="font-sans text-[15px] text-ink-soft leading-relaxed">
            {matcha.description}
          </p>
        </div>
      )}

      {/* Taste profile */}
      {hasTasteData && (
        <div className="px-6 pt-6">
          <div className="flex justify-between items-baseline mb-3">
            <h3
              className="font-display text-[20px] text-ink"
              style={{ fontWeight: 500 }}
            >
              Taste profile
            </h3>
            <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-mute">
              Editor avg.
            </p>
          </div>
          <div className="bg-card rounded-[20px] border border-[rgba(27,29,24,0.12)] p-4 space-y-3.5">
            {TASTE_DIMENSIONS.map((d) => (
              <TasteBar key={d.key} label={d.label} value={matcha[d.key]} />
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-2.5 px-6 pt-5">
        {[
          { l: "Grade", v: matcha.type === "ceremonial" ? "A" : "B" },
          { l: "Tin", v: "20g" },
        ].map((x) => (
          <div
            key={x.l}
            className="flex-1 border-l border-[rgba(27,29,24,0.12)] pl-2.5"
          >
            <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-mute">
              {x.l}
            </p>
            <p
              className="font-serif italic text-[22px] text-ink mt-0.5"
              style={{
                fontWeight: 300,
                fontVariationSettings: "'opsz' 144, 'SOFT' 100",
              }}
            >
              {x.v}
            </p>
          </div>
        ))}
      </div>

      {/* Good for */}
      {matcha.good_for && matcha.good_for.length > 0 && (
        <div className="px-6 pt-5">
          <h3
            className="font-display text-[20px] text-ink mb-2.5"
            style={{ fontWeight: 500 }}
          >
            Good for
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {matcha.good_for.map((g) => (
              <span
                key={g}
                className="inline-block px-2.5 py-1 rounded-full font-mono text-[9px] font-medium tracking-[0.12em] uppercase text-ink border border-[rgba(27,29,24,0.12)] capitalize"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-6 pt-6">
        <Link
          href={`/log/new?matcha=${matcha.id}`}
          className="flex items-center justify-between w-full px-5 py-4 rounded-full bg-matcha-800 text-matcha-50 font-sans font-semibold text-[15px] transition-all active:scale-[0.98]"
        >
          Log a sip of {matcha.name}
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}
