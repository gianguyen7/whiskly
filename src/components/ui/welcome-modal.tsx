"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const MATCHA_FACTS = [
  {
    headline: "One bowl, 10\u00d7 the antioxidants",
    body: "A single cup of matcha has as many antioxidants as 10 cups of regular green tea.",
  },
  {
    headline: "Don\u2019t toss oxidized matcha",
    body: "Cold-brew it overnight or fold it into pancake batter. Oxidation mellows bitterness \u2014 it\u2019s a feature, not a bug.",
  },
  {
    headline: "Temperature is everything",
    body: "Water above 80\u00b0C scorches matcha and kills the umami. Always let your kettle cool for 2 minutes.",
  },
  {
    headline: "Oat milk is matcha\u2019s soulmate",
    body: "Its natural sweetness and creamy body complement ceremonial-grade matcha better than any other milk.",
  },
  {
    headline: "Whisk in a W, not a circle",
    body: "A fast W-shaped motion with your chasen creates the crema. 15 seconds is all you need.",
  },
];

function getRandomFact() {
  return MATCHA_FACTS[Math.floor(Math.random() * MATCHA_FACTS.length)];
}

export function WelcomeModal() {
  const [visible, setVisible] = useState(false);
  const [fact] = useState(() => getRandomFact());
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("whiskly-welcome-seen");
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("whiskly-welcome-seen", "1");
    }, 300);
  }

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Card */}
      <div
        className={`relative w-full max-w-sm mx-4 mb-8 transition-all duration-500 ease-out ${
          closing
            ? "translate-y-8 opacity-0"
            : "translate-y-0 opacity-100 animate-slide-up"
        }`}
      >
        <div className="rounded-[20px] overflow-hidden" style={{ boxShadow: "0 24px 60px rgba(27,29,24,0.18)" }}>
          {/* Top — dark matcha */}
          <div className="relative px-6 pt-8 pb-10" style={{ background: "#2D4014" }}>
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-paper/80 hover:text-paper transition-colors"
              style={{ background: "rgba(255,255,255,0.15)" }}
              aria-label="Close"
            >
              <X size={16} strokeWidth={2.5} />
            </button>

            <p
              className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase"
              style={{ color: "rgba(239,234,216,0.55)" }}
            >
              Did you know?
            </p>
            <h2
              className="font-serif italic text-xl text-paper leading-snug mt-2"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
            >
              {fact.headline}
            </h2>
          </div>

          {/* Body — cream paper */}
          <div className="bg-paper px-6 py-5 space-y-4">
            <p className="font-sans text-[15px] text-ink-soft leading-relaxed">
              {fact.body}
            </p>
            <button
              onClick={dismiss}
              className="w-full py-3 rounded-full bg-matcha-800 text-matcha-50 font-sans font-semibold text-sm active:scale-[0.98] transition-transform"
            >
              Let&apos;s Go
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
