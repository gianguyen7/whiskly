import { createClient } from "@/lib/supabase/server";
import type { Profile, UserTasteProfile } from "@/models/profile";

/**
 * Fetch the current user's profile.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  // TODO: Implement profile fetch using auth.getUser() + profiles table
  const _supabase = await createClient();
  return null;
}

/**
 * Update the current user's display name or avatar URL.
 */
export async function updateProfile(data: {
  display_name?: string;
  avatar_url?: string;
}): Promise<Profile | null> {
  // TODO: Implement profile update
  const _supabase = await createClient();
  void data;
  return null;
}

/**
 * Get the user's materialized taste profile (averages from logs).
 * Returns null if user has no logs.
 */
export async function getTasteProfile(): Promise<UserTasteProfile | null> {
  // TODO: Implement taste profile fetch from profiles table
  const _supabase = await createClient();
  return null;
}
