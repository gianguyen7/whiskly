import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

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

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-matcha-700">Taste Profile</h1>

      {profile && (
        <div className="text-sm text-gray-500">
          <p>
            {profile.display_name || user?.email} &middot;{" "}
            {profile.log_count || 0} logs
          </p>
        </div>
      )}

      {/* TODO: RadarChart with user's taste averages */}
      {/* TODO: Stats: favorite dimensions */}
      {/* TODO: Link to recommendations if log_count >= 3 */}

      <div className="text-center py-12 text-gray-400">
        <p>Log at least 3 matchas to see your taste profile.</p>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <LogoutButton />
      </div>
    </div>
  );
}
