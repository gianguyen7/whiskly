import {
  Sparkles,
  Plus,
  Search,
  Share2,
  Droplets,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { WelcomeModal } from "@/components/ui/welcome-modal";

export default function ForYouPage() {
  return (
    <>
      <WelcomeModal />

      <div className="pb-24">
        {/* Hero greeting */}
        <div className="relative overflow-hidden bg-gradient-to-br from-matcha-600 via-matcha-500 to-matcha-400 px-5 pt-10 pb-8">
          {/* Decorative blobs */}
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/8" />
          <div className="absolute bottom-4 -left-6 w-24 h-24 rounded-full bg-white/5" />

          <p className="text-matcha-100 text-sm font-medium mb-1">
            Good to see you
          </p>
          <h1 className="text-[28px] font-bold text-white leading-tight">
            What are we<br />brewing today?
          </h1>

          {/* Quick actions */}
          <div className="flex gap-2.5 mt-5">
            <Link
              href="/log"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 backdrop-blur-sm text-white text-sm font-semibold hover:bg-white/25 active:scale-[0.97] transition-all"
            >
              <Plus size={16} strokeWidth={2.5} />
              Log a Matcha
            </Link>
            <Link
              href="/catalog"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 backdrop-blur-sm text-white text-sm font-semibold hover:bg-white/25 active:scale-[0.97] transition-all"
            >
              <Search size={16} strokeWidth={2.5} />
              Explore
            </Link>
          </div>
        </div>

        <div className="px-4 pt-5 space-y-5">
          {/* Picked for you — horizontal scroll */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-matcha-600" />
              <h2 className="text-base font-bold text-gray-900">
                Picked for You
              </h2>
            </div>

            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
              {[
                {
                  name: "Okumidori",
                  brand: "Ippodo",
                  tag: "Ceremonial",
                  note: "Rich umami, low bitterness",
                },
                {
                  name: "Daily Matcha",
                  brand: "Naoki",
                  tag: "Premium",
                  note: "Smooth, great for lattes",
                },
                {
                  name: "Hisui",
                  brand: "Marukyu Koyamaen",
                  tag: "Ceremonial",
                  note: "Sweet, creamy finish",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex-shrink-0 w-[156px] rounded-2xl border border-warm-200 bg-white overflow-hidden hover:shadow-md hover:border-matcha-300 transition-all"
                >
                  <div className="w-full h-24 bg-gradient-to-br from-matcha-50 to-matcha-100 flex items-center justify-center">
                    <span className="text-3xl">🍵</span>
                  </div>
                  <div className="p-3 space-y-1.5">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-matcha-50 text-matcha-700 text-[10px] font-bold uppercase tracking-wider">
                      {item.tag}
                    </span>
                    <p className="text-sm font-bold text-gray-900 leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {item.brand}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-snug">
                      {item.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Milk pairing — bold CTA card */}
          <section className="rounded-2xl overflow-hidden border border-warm-200 bg-white">
            <div className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Droplets size={20} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900">
                  Today&apos;s Pairing
                </h3>
                <p className="text-[13px] text-gray-500 mt-0.5 leading-snug">
                  Oat milk + ceremonial grade at 65°C. Your logs say this is
                  your sweet spot.
                </p>
              </div>
            </div>
            <div className="border-t border-warm-100 px-4 py-2.5">
              <Link
                href="/discover"
                className="text-xs font-semibold text-matcha-600 hover:text-matcha-700"
              >
                More pairing tips →
              </Link>
            </div>
          </section>

          {/* Matcha tip — hot tip style */}
          <section className="rounded-2xl overflow-hidden border border-amber-200 bg-amber-50/50">
            <div className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Flame size={20} className="text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900">
                  Hot Tip
                </h3>
                <p className="text-[13px] text-gray-600 mt-0.5 leading-snug">
                  Store matcha in the freezer, not the fridge. Seal it airtight
                  — moisture is the real enemy, not temperature.
                </p>
              </div>
            </div>
          </section>

          {/* Matcha Wrap — shareable CTA */}
          <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-matcha-700 via-matcha-600 to-matcha-500 p-5">
            {/* Decorative */}
            <div className="absolute top-3 right-3 w-20 h-20 rounded-full bg-white/5" />
            <div className="absolute -bottom-4 -right-4 w-28 h-28 rounded-full bg-white/5" />

            <div className="relative space-y-3">
              <div className="flex items-center gap-2">
                <Share2 size={16} className="text-matcha-200" />
                <h3 className="text-sm font-bold text-matcha-100 uppercase tracking-wider">
                  Matcha Wrap
                </h3>
              </div>
              <p className="text-[22px] font-bold text-white leading-snug">
                Share your<br />matcha journey
              </p>
              <p className="text-sm text-matcha-100/80 leading-relaxed">
                Log more matchas to unlock your personalized wrap — your
                favorites, taste profile, and stats in one shareable card.
              </p>
              <button
                className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-matcha-700 text-sm font-bold hover:bg-matcha-50 active:scale-[0.97] transition-all"
              >
                Coming Soon
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
