export type ArticleCategory = "pairing" | "preparation" | "origin" | "guide";

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: ArticleCategory;
  summary: string | null;
  umami_min: number | null;
  umami_max: number | null;
  sweetness_min: number | null;
  sweetness_max: number | null;
  bitterness_min: number | null;
  bitterness_max: number | null;
  grassiness_min: number | null;
  grassiness_max: number | null;
  creaminess_min: number | null;
  creaminess_max: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
