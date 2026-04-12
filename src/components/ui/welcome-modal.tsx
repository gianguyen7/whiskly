"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const MATCHA_FACTS = [
  {
    emoji: "🍵",
    headline: "One bowl, 10× the antioxidants",
    body: "A single cup of matcha has as many antioxidants as 10 cups of regular green tea.",
  },
  {
    emoji: "🧊",
    headline: "Don't toss oxidized matcha",
    body: "Cold-brew it overnight or fold it into pancake batter. Oxidation mellows bitterness — it's a feature, not a bug.",
  },
  {
    emoji: "🌡️",
    headline: "Temperature is everything",
    body: "Water above 80°C scorches matcha and kills the umami. Always let your kettle cool for 2 minutes.",
  },
  {
    emoji: "🥛",
    headline: "Oat milk is matcha's soulmate",
    body: "Its natural sweetness and creamy body complement ceremonial-grade matcha better than any other milk.",
  },
  {
    emoji: "⏱️",
    headline: "Whisk in a W, not a circle",
    body: "A fast W-shaped motion with your chasen creates the crema. 15 seconds is all you need.",
  },
];

function getRandomFact() {
  return MATCHA_FACTS[Math.floor(Math.random() * MATCHA_FACTS.length)];
}

export function WelcomeModal() {
  const [visible, setVisible] = useState(false);
  const [fact, setFact] = useState(MATCHA_FACTS[0]);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("whiskly-welcome-seen");
    if (!dismissed) {
      setFact(getRandomFact());
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

      {/* Card — slides up from bottom */}
      <div
        className={`relative w-full max-w-sm mx-4 mb-8 transition-all duration-500 ease-out ${
          closing
            ? "translate-y-8 opacity-0"
            : "translate-y-0 opacity-100 animate-slide-up"
        }`}
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          {/* Top accent — matcha gradient */}
          <div className="relative bg-gradient-to-br from-matcha-500 via-matcha-600 to-matcha-800 px-6 pt-8 pb-10">
            {/* Decorative circles */}
            <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/5" />
            <div className="absolute bottom-2 left-6 w-16 h-16 rounded-full bg-white/5" />

            <button
              onClick={dismiss}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/15 text-white/80 hover:bg-white/25 transition-colors"
              aria-label="Close"
            >
              <X size={16} strokeWidth={2.5} />
            </button>

            <span className="text-4xl block mb-3">{fact.emoji}</span>
            <h2 className="text-xl font-bold text-white leading-snug">
              {fact.headline}
            </h2>
          </div>

          {/* Body */}
          <div className="bg-white px-6 py-5 space-y-4">
            <p className="text-[15px] text-gray-600 leading-relaxed">
              {fact.body}
            </p>
            <button
              onClick={dismiss}
              className="w-full py-3 rounded-xl bg-matcha-600 text-white font-semibold text-sm hover:bg-matcha-700 active:scale-[0.98] transition-all"
            >
              Let&apos;s Go
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
