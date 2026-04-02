import { createClient } from "@/lib/supabase/server";
import type { MatchaRecommendation } from "@/models/matcha";

/**
 * Get matcha recommendations for the current user using cosine similarity.
 * Requires the user to have at least 3 logged matchas.
 * Calls the `get_recommendations` Postgres function.
 */
export async function getRecommendations(limit: number = 5): Promise<MatchaRecommendation[]> {
  // TODO: Implement via supabase.rpc('get_recommendations', { p_user_id, p_limit })
  const _supabase = await createClient();
  void limit;
  return [];
}

/**
 * Check if the user has enough logs for recommendations (minimum 3).
 */
export async function hasEnoughLogsForRecommendations(): Promise<boolean> {
  // TODO: Check profile.log_count >= 3
  const _supabase = await createClient();
  return false;
}
