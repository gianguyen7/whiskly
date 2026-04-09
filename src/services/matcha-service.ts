import { createClient } from "@/lib/supabase/server";
import type { Matcha } from "@/models/matcha";

export async function getMatchas(options?: {
  search?: string;
  type?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: Matcha[]; count: number }> {
  const supabase = await createClient();
  const limit = options?.limit ?? 20;
  const offset = options?.offset ?? 0;

  let query = supabase
    .from("matchas")
    .select("*", { count: "exact" })
    .order("name", { ascending: true })
    .range(offset, offset + limit - 1);

  if (options?.type && options.type !== "all") {
    query = query.eq("type", options.type);
  }

  if (options?.search) {
    query = query.or(
      `name.ilike.%${options.search}%,brand.ilike.%${options.search}%,region.ilike.%${options.search}%`
    );
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch matchas: ${error.message}`);
  }

  return { data: (data as Matcha[]) ?? [], count: count ?? 0 };
}

export async function getMatchaById(id: string): Promise<Matcha | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("matchas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as Matcha;
}

export async function submitMatcha(data: {
  name: string;
  brand: string;
  region?: string;
  type?: string;
  description?: string;
}): Promise<Matcha | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: matcha, error } = await supabase
    .from("matchas")
    .insert({
      ...data,
      submitted_by: user.id,
      is_approved: false,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to submit matcha: ${error.message}`);
  }

  return matcha as Matcha;
}
