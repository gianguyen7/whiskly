import type { Matcha } from "@/models/matcha";
import Link from "next/link";

interface MatchaCardProps {
  matcha: Matcha;
  rank?: number;
}

export function MatchaCard({ matcha, rank }: MatchaCardProps) {
  return (
    <Link
      href={`/catalog/${matcha.id}`}
      className="flex gap-3.5 items-center bg-card rounded-[18px] border border-[rgba(27,29,24,0.12)] p-3.5 transition-all hover:shadow-md"
    >
      {/* Color swatch with cup icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: matcha.type === "ceremonial" ? "#5F8E1F" : "#7FB22E" }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F8F3E1"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 7h14v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zm14 3h2a2 2 0 0 1 0 4h-2" />
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-mute">
          {matcha.brand}
        </p>
        <p
          className="font-serif italic text-[20px] text-ink leading-[1.1] mt-0.5"
          style={{
            fontWeight: 400,
            fontVariationSettings: "'opsz' 144, 'SOFT' 100",
          }}
        >
          {matcha.name}
        </p>
        <p className="font-sans text-[11px] text-ink-soft mt-1">
          {matcha.region || matcha.type}
        </p>
      </div>

      {/* Match percentage or rank */}
      {rank != null && (
        <div className="text-right flex-shrink-0">
          <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-mute">
            Match
          </p>
          <p
            className="font-serif italic text-[22px] text-matcha-800 leading-none mt-0.5"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
          >
            {rank}
            <span className="text-[10px] text-ink-mute not-italic">%</span>
          </p>
        </div>
      )}
    </Link>
  );
}
