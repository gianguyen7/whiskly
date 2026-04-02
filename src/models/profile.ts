export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  umami_avg: number;
  sweetness_avg: number;
  bitterness_avg: number;
  grassiness_avg: number;
  creaminess_avg: number;
  log_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserTasteProfile {
  umami: number;
  sweetness: number;
  bitterness: number;
  grassiness: number;
  creaminess: number;
}
