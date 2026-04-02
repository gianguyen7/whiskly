export interface MatchaLog {
  id: string;
  user_id: string;
  matcha_id: string;
  umami: number;
  sweetness: number;
  bitterness: number;
  grassiness: number;
  creaminess: number;
  overall_rating: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateMatchaLogInput {
  matcha_id: string;
  umami: number;
  sweetness: number;
  bitterness: number;
  grassiness: number;
  creaminess: number;
  overall_rating: number;
  notes?: string;
}

export interface UpdateMatchaLogInput {
  umami?: number;
  sweetness?: number;
  bitterness?: number;
  grassiness?: number;
  creaminess?: number;
  overall_rating?: number;
  notes?: string;
}
