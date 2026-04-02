import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/models/article";

/**
 * Fetch published articles, optionally filtered by category.
 */
export async function getArticles(options?: {
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<Article[]> {
  // TODO: Implement article listing with category filter
  const _supabase = await createClient();
  void options;
  return [];
}

/**
 * Fetch a single article by slug.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  // TODO: Implement single article fetch
  const _supabase = await createClient();
  void slug;
  return null;
}

/**
 * Get articles recommended based on the user's taste profile.
 * Matches articles whose taste affinity ranges overlap with user preferences.
 */
export async function getRecommendedArticles(limit: number = 5): Promise<Article[]> {
  // TODO: Implement taste-profile-based article recommendations
  const _supabase = await createClient();
  void limit;
  return [];
}
