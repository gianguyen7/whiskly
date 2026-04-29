import { createClient } from "@/lib/supabase/server";
import { Settings, ChevronRight } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id ?? "")
    .single();

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "You";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="flex justify-between items-center px-6 pt-4">
        <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-mute">
          Profile
        </p>
        <Settings size={18} className="text-ink" />
      </div>

      {/* Avatar + name */}
      <div className="flex items-center gap-4 px-6 pt-5">
        <div
          className="w-[72px] h-[72px] rounded-full bg-mochi flex items-center justify-center font-serif text-4xl italic text-ink flex-shrink-0"
          style={{
            fontWeight: 300,
            fontVariationSettings: "'opsz' 144, 'SOFT' 100",
          }}
        >
          {initial}
        </div>
        <div>
          <p
            className="font-serif text-[28px] text-ink leading-[1.1]"
            style={{ fontWeight: 400 }}
          >
            {displayName}
          </p>
          <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-mute mt-1">
            @{displayName.toLowerCase()} &middot; Chasen tier
          </p>
        </div>
      </div>

      {/* Palate card — dark */}
      <div className="mx-6 mt-6 bg-ink rounded-[22px] p-5">
        <p
          className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase"
          style={{ color: "rgba(239,234,216,0.6)" }}
        >
          Your palate
        </p>
        <p
          className="font-serif italic text-[26px] text-paper leading-[1.1] mt-1"
          style={{
            fontWeight: 400,
            fontVariationSettings: "'opsz' 144, 'SOFT' 100",
          }}
        >
          {profile?.log_count >= 3 ? "Creamy umami" : "Still learning\u2026"}
        </p>
        <p
          className="font-sans text-[12px] leading-relaxed mt-2 max-w-[200px]"
          style={{ color: "rgba(239,234,216,0.6)" }}
        >
          {profile?.log_count >= 3
            ? "You gravitate toward mellow, buttery cups with low bitter."
            : "Log at least 3 matchas to discover your taste profile."}
        </p>
      </div>

      {/* Tier progress */}
      <div className="mx-6 mt-5">
        <div className="flex justify-between items-baseline mb-2">
          <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-soft">
            Chasen tier &middot; Level 3
          </p>
          <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-mute">
            {Math.max(0, 32 - (profile?.log_count || 0))} logs to Sensei
          </p>
        </div>
        <div className="h-2 bg-paper-deep rounded-full overflow-hidden">
          <div
            className="h-full bg-matcha-800 rounded-full"
            style={{
              width: `${Math.min(100, ((profile?.log_count || 0) / 100) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Collected stamps */}
      <div className="mx-6 mt-6">
        <div className="flex justify-between items-baseline mb-3">
          <h3
            className="font-display text-[20px] text-ink"
            style={{ fontWeight: 500 }}
          >
            Collected stamps
          </h3>
          <p className="font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-ink-mute">
            {Math.min(profile?.log_count || 0, 12)} / 48
          </p>
        </div>
        <div className="bg-card rounded-[20px] border border-[rgba(27,29,24,0.12)] p-5">
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: "cup", label: "First sip", earned: true },
              { icon: "flame", label: "7 streak", earned: true },
              { icon: "whisk", label: "Usucha", earned: true },
              { icon: "leaf", label: "Uji", earned: true },
              { icon: "pin", label: "Kyoto", earned: true },
              { icon: "star", label: "Koicha", earned: false },
              { icon: "leaf", label: "Aichi", earned: false },
              { icon: "whisk", label: "100 logs", earned: false },
            ].map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className={`w-[52px] h-[52px] rounded-xl flex items-center justify-center ${
                    s.earned
                      ? "bg-matcha-800"
                      : "bg-paper-deep opacity-25 grayscale"
                  }`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={s.earned ? "#EFEAD8" : "#8A8B80"}
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {s.icon === "cup" && (
                      <path d="M4 7h14v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zm14 3h2a2 2 0 0 1 0 4h-2" />
                    )}
                    {s.icon === "flame" && (
                      <path d="M12 2s5 4 5 10a5 5 0 1 1-10 0c0-2 1-3 2-4 0 2 2 2 2 2s-1-3 1-6c1 2 0 4 0 4z" />
                    )}
                    {s.icon === "whisk" && (
                      <path d="M12 3v10m-3 0h6M7 13c0 4 2 8 5 8s5-4 5-8zM10 13v6m4-6v6" />
                    )}
                    {s.icon === "leaf" && (
                      <path d="M20 4c-8 0-14 6-14 14 0 0 8-1 12-5s2-9 2-9zM6 18 18 6" />
                    )}
                    {s.icon === "pin" && (
                      <>
                        <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </>
                    )}
                    {s.icon === "star" && (
                      <path d="m12 3 2.9 6 6.1.8-4.5 4.3 1.1 6.2L12 17.3 6.4 20.3l1.1-6.2L3 9.8 9.1 9z" />
                    )}
                  </svg>
                </div>
                <p className="font-mono text-[8px] font-medium tracking-[0.08em] uppercase text-ink-mute text-center">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings list */}
      <div className="mx-6 mt-6">
        <div className="bg-card rounded-[18px] border border-[rgba(27,29,24,0.12)] overflow-hidden">
          {[
            "Notifications",
            "Units \u00b7 \u00b0C",
            "Export your data",
            "Help & feedback",
            "Sign out",
          ].map((label, i, arr) => (
            <div key={label}>
              {label === "Sign out" ? (
                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="w-full flex justify-between items-center px-4 py-3.5 text-left"
                  >
                    <span className="font-sans text-[14px] font-semibold" style={{ color: "#A65A3D" }}>
                      {label}
                    </span>
                  </button>
                </form>
              ) : (
                <div className="flex justify-between items-center px-4 py-3.5">
                  <span className="font-sans text-[14px] font-medium text-ink">
                    {label}
                  </span>
                  <ChevronRight size={16} className="text-ink-mute" />
                </div>
              )}
              {i < arr.length - 1 && (
                <div className="h-px bg-[rgba(27,29,24,0.12)] mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
