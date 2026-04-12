export type MatchaType = "ceremonial" | "premium" | "culinary" | "latte" | "other";
export type Confidence = "high" | "medium" | "low";

export interface TasteProfile {
  umami: number | null;
  sweetness: number | null;
  bitterness: number | null;
  grassiness: number | null;
  creaminess: number | null;
}

export type GoodFor = "latte" | "usucha" | "koicha" | "cold brew" | "baking" | "smoothie";

export interface Matcha extends TasteProfile {
  id: string;
  name: string;
  brand: string;
  region: string | null;
  type: MatchaType;
  description: string | null;
  price_per_gram: number | null;
  good_for: GoodFor[];
  milk_pairing: string | null;
  confidence: Confidence;
  sources: string[];
  submitted_by: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface MatchaRecommendation {
  matcha_id: string;
  name: string;
  brand: string;
  region: string | null;
  umami: number;
  sweetness: number;
  bitterness: number;
  grassiness: number;
  creaminess: number;
  similarity: number;
}
