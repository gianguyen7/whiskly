import { ChevronRight, Leaf } from "lucide-react";
import Link from "next/link";
import { WelcomeModal } from "@/components/ui/welcome-modal";

export default function ForYouPage() {
  return (
    <>
      <WelcomeModal />

      <div className="pb-28">
        {/* Header */}
        <div className="flex justify-between items-end px-6 pt-4">
          <div>
            <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-mute">
              Wed &middot; Apr 28
            </p>
            <h2
              className="font-display text-[28px] leading-[1.1] text-ink mt-1"
              style={{ fontWeight: 400 }}
            >
              Good morning,{" "}
              <span
                className="italic"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
              >
                there
              </span>
            </h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-mochi flex items-center justify-center font-serif text-lg italic text-ink flex-shrink-0">
            W
          </div>
        </div>

        {/* Hero ritual card */}
        <div className="mx-6 mt-5 relative overflow-hidden">
          <div className="bg-card rounded-[20px] border border-[rgba(27,29,24,0.12)] p-5 relative">
            {/* Faint cup illustration */}
            <div className="absolute -top-5 -right-5 opacity-[0.18] pointer-events-none">
              <svg width="170" height="170" viewBox="0 0 120 120">
                <ellipse cx="60" cy="90" rx="45" ry="6" fill="rgba(0,0,0,0.08)" />
                <path d="M15 55 Q15 90,60 95 Q105 90,105 55 Z" fill="#F8F3E1" stroke="#2D4014" strokeWidth="1.5" />
                <ellipse cx="60" cy="55" rx="45" ry="8" fill="#3F5A1A" />
                <ellipse cx="60" cy="55" rx="45" ry="8" fill="none" stroke="#2D4014" strokeWidth="1.5" />
              </svg>
            </div>

            <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-matcha-800">
              Today&apos;s ritual
            </p>
            <h2
              className="font-display text-[28px] leading-[1.1] text-ink mt-2.5 max-w-[220px]"
              style={{ fontWeight: 400 }}
            >
              A quiet{" "}
              <span className="italic" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}>
                usucha
              </span>{" "}
              to start.
            </h2>
            <p className="font-sans text-[14px] text-ink-soft leading-relaxed mt-2 max-w-[220px]">
              Oat milk on the side, 70&deg; water, 2 min before your phone.
            </p>

            <div className="flex gap-2 mt-3.5">
              <Link
                href="/log/new"
                className="inline-flex items-center px-4 py-2 rounded-full bg-ink text-paper font-sans font-semibold text-xs"
              >
                Log a sip
              </Link>
              <button className="inline-flex items-center px-4 py-2 rounded-full bg-transparent border border-ink text-ink font-sans font-semibold text-xs">
                Skip today
              </button>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-2.5 mx-6 mt-4">
          {[
            { n: "14", l: "Day streak" },
            { n: "47", l: "Sips logged" },
            { n: "18", l: "Unique tins" },
          ].map((s) => (
            <div
              key={s.l}
              className="flex-1 bg-paper-deep rounded-2xl px-3.5 py-3"
            >
              <span
                className="font-display text-[32px] italic text-ink"
                style={{
                  fontWeight: 300,
                  lineHeight: 1,
                  fontVariationSettings: "'opsz' 144, 'SOFT' 100",
                }}
              >
                {s.n}
              </span>
              <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-soft mt-1.5">
                {s.l}
              </p>
            </div>
          ))}
        </div>

        {/* Picked for your palate */}
        <div className="mt-6">
          <div className="flex justify-between items-baseline px-6 mb-3">
            <h3
              className="font-display text-[20px] text-ink"
              style={{ fontWeight: 500 }}
            >
              Picked for your palate
            </h3>
            <Link
              href="/catalog"
              className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-matcha-800"
            >
              See all
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-6 pb-1">
            {[
              { brand: "Ippodo", name: "Sayaka", notes: "Creamy \u00b7 Sweet", color: "#7FB22E" },
              { brand: "Marukyu Koyamaen", name: "Wako", notes: "Umami \u00b7 Buttery", color: "#5F8E1F" },
              { brand: "Nami Tea", name: "Kuradashi", notes: "Nutty \u00b7 Round", color: "#6B9A2E" },
              { brand: "Rocky\u2019s Matcha", name: "Ceremonial", notes: "Vibrant \u00b7 Grassy", color: "#9BC740" },
            ].map((m) => (
              <div
                key={m.name}
                className="flex-shrink-0 w-[168px] bg-card rounded-[18px] border border-[rgba(27,29,24,0.12)] overflow-hidden"
              >
                <div
                  className="h-24 flex items-center justify-center"
                  style={{ background: m.color }}
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F8F3E1" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 7h14v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zm14 3h2a2 2 0 0 1 0 4h-2" />
                  </svg>
                </div>
                <div className="p-3">
                  <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-mute">
                    {m.brand}
                  </p>
                  <p
                    className="font-serif italic text-[20px] text-ink mt-0.5"
                    style={{
                      fontWeight: 400,
                      fontVariationSettings: "'opsz' 144, 'SOFT' 100",
                    }}
                  >
                    {m.name}
                  </p>
                  <p className="font-sans text-[11px] text-ink-soft mt-1.5">
                    {m.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's pairing */}
        <div className="mx-6 mt-6">
          <h3
            className="font-display text-[20px] text-ink mb-3"
            style={{ fontWeight: 500 }}
          >
            Today&apos;s pairing
          </h3>
          <div className="bg-card rounded-[18px] border border-[rgba(27,29,24,0.12)] p-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-matcha-50 flex items-center justify-center flex-shrink-0">
                <Leaf size={22} className="text-matcha-800" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-[14px] font-semibold text-ink">
                  Oat + ceremonial &middot; 65&deg;C
                </p>
                <p className="font-sans text-[12px] text-ink-soft mt-0.5">
                  Your sweet spot from last week&apos;s logs.
                </p>
              </div>
              <ChevronRight size={16} className="text-ink-mute flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Read while you sip */}
        <div className="mx-6 mt-6">
          <h3
            className="font-display text-[20px] text-ink mb-3"
            style={{ fontWeight: 500 }}
          >
            Read while you sip
          </h3>
          <div className="bg-ink rounded-[20px] p-5">
            <p
              className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase"
              style={{ color: "rgba(239,234,216,0.6)" }}
            >
              Brewing &middot; 3 min read
            </p>
            <p
              className="font-serif text-[22px] leading-[1.15] text-paper mt-2 max-w-[260px]"
              style={{
                fontWeight: 400,
                fontVariationSettings: "'opsz' 144, 'SOFT' 100",
              }}
            >
              Why <em className="italic">shade-grown</em> matters more than you
              think.
            </p>
            <div className="flex justify-between items-center mt-4">
              <p
                className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase"
                style={{ color: "rgba(239,234,216,0.5)" }}
              >
                By Rei Tanaka
              </p>
              <ChevronRight size={16} className="text-paper" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
