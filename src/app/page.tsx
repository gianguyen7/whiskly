import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <main
      className="flex flex-col min-h-screen relative overflow-hidden"
      style={{ background: "#2D4014" }}
    >
      {/* Decorative matcha cup (faint) */}
      <div className="absolute top-20 -right-10 opacity-20 pointer-events-none">
        <svg width="220" height="220" viewBox="0 0 120 120">
          <ellipse cx="60" cy="90" rx="45" ry="6" fill="rgba(0,0,0,0.08)" />
          <path
            d="M15 55 Q15 90, 60 95 Q105 90, 105 55 Z"
            fill="#F8F3E1"
            stroke="#3F5A1A"
            strokeWidth="1.5"
          />
          <ellipse cx="60" cy="55" rx="45" ry="8" fill="#7FB22E" />
          <ellipse
            cx="60"
            cy="55"
            rx="45"
            ry="8"
            fill="none"
            stroke="#3F5A1A"
            strokeWidth="1.5"
          />
          <ellipse cx="48" cy="54" rx="6" ry="1.5" fill="#F8F3E1" opacity="0.7" />
          <ellipse cx="70" cy="56" rx="4" ry="1" fill="#F8F3E1" opacity="0.6" />
        </svg>
      </div>

      <div className="flex-1 flex flex-col justify-between px-8 pt-28 pb-20 relative z-10">
        {/* Top — brand */}
        <div>
          <p
            className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase"
            style={{ color: "rgba(248,243,225,0.55)" }}
          >
            A matcha journal &middot; est. 2026
          </p>

          <h1
            className="font-display mt-5 text-[72px] sm:text-[88px] leading-[0.9] tracking-tight"
            style={{ color: "#EFEAD8", fontWeight: 300 }}
          >
            whiskly
            <span className="font-display italic" style={{ color: "#3F5A1A" }}>
              .
            </span>
          </h1>

          <p
            className="font-serif italic text-xl mt-5 max-w-[270px]"
            style={{
              color: "rgba(248,243,225,0.75)",
              fontVariationSettings: "'opsz' 144, 'SOFT' 100",
            }}
          >
            Quietly catalogue every cup.
          </p>
        </div>

        {/* Bottom — CTAs */}
        <div className="flex flex-col gap-3 mt-auto pt-16">
          <Link
            href="/signup"
            className="flex items-center justify-between w-full px-5 py-4 rounded-full font-sans font-semibold text-[15px] transition-all active:scale-[0.98]"
            style={{
              background: "#EFEAD8",
              color: "#1B1D18",
              border: "1px solid #EFEAD8",
            }}
          >
            Create account
            <ChevronRight size={18} />
          </Link>

          <div className="flex justify-center gap-1.5 mt-2">
            <span
              className="font-sans text-[13px]"
              style={{ color: "rgba(248,243,225,0.5)" }}
            >
              Already a member?
            </span>
            <Link
              href="/login"
              className="font-sans text-[13px] font-semibold"
              style={{ color: "#EFEAD8" }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
