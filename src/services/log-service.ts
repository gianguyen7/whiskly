import { createClient } from "@/lib/supabase/server";
import type { MatchaLog, CreateMatchaLogInput, UpdateMatchaLogInput } from "@/models/log";

/**
 * Fetch all logs for the current user, ordered by most recent.
 */
export async function getUserLogs(options?: {
  limit?: number;
  offset?: number;
}): Promise<MatchaLog[]> {
  // TODO: Implement user log listing with pagination
  const _supabase = await createClient();
  void options;
  return [];
}

/**
 * Fetch a single log by ID (must belong to current user via RLS).
 */
export async function getLogById(id: string): Promise<MatchaLog | null> {
  // TODO: Implement single log fetch
  const _supabase = await createClient();
  void id;
  return null;
}

/**
 * Create a new matcha log entry.
 * Triggers recalculation of the user's taste profile via DB trigger.
 */
export async function createLog(input: CreateMatchaLogInput): Promise<MatchaLog | null> {
  // TODO: Implement log creation
  const _supabase = await createClient();
  void input;
  return null;
}

/**
 * Update an existing log entry.
 * Triggers recalculation of the user's taste profile via DB trigger.
 */
export async function updateLog(id: string, input: UpdateMatchaLogInput): Promise<MatchaLog | null> {
  // TODO: Implement log update
  const _supabase = await createClient();
  void id;
  void input;
  return null;
}

/**
 * Delete a log entry.
 * Triggers recalculation of the user's taste profile via DB trigger.
 */
export async function deleteLog(id: string): Promise<boolean> {
  // TODO: Implement log deletion
  const _supabase = await createClient();
  void id;
  return false;
}
