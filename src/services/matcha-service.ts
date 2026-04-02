import { createClient } from "@/lib/supabase/server";
import type { Matcha } from "@/models/matcha";

/**
 * Fetch paginated matcha catalog with optional search.
 * TODO: Implement full-text search via Postgres tsvector index
 */
export async function getMatchas(options?: {
  search?: string;
  brand?: string;
  type?: string;
  limit?: number;
  offset?: number;
}): Promise<Matcha[]> {
  // TODO: Implement catalog query with filters and pagination
  const _supabase = await createClient();
  void options;
  return [];
}

/**
 * Fetch a single matcha by ID.
 */
export async function getMatchaById(id: string): Promise<Matcha | null> {
  // TODO: Implement single matcha fetch
  const _supabase = await createClient();
  void id;
  return null;
}

/**
 * Submit a new user-contributed matcha entry.
 * Sets submitted_by to current user and is_approved to false.
 */
export async function submitMatcha(data: {
  name: string;
  brand: string;
  region?: string;
  type?: string;
  description?: string;
}): Promise<Matcha | null> {
  // TODO: Implement matcha submission
  const _supabase = await createClient();
  void data;
  return null;
}
