-- Whiskly Matcha Catalog Seed Data
-- 25 real matcha entries from well-known brands across Japan
-- Idempotent: deletes all catalog entries (submitted_by IS NULL) then re-inserts

BEGIN;

-- Remove existing catalog entries (user-submitted entries are preserved)
DELETE FROM matchas WHERE submitted_by IS NULL;

INSERT INTO matchas (
  name, brand, region, type, description,
  umami, sweetness, bitterness, grassiness, creaminess,
  confidence, sources, submitted_by, is_approved
) VALUES

-- ============================================================================
-- IPPODO (Kyoto, est. 1717)
-- ============================================================================
(
  'Ummon-no-Mukashi', 'Ippodo', 'Uji, Kyoto', 'ceremonial',
  'Ippodo''s flagship ceremonial matcha with exceptional depth and a long, savory finish. A benchmark for high-grade koicha.',
  4.8, 3.8, 1.5, 2.5, 4.7,
  'high', '{manual,ippodo}', NULL, TRUE
),
(
  'Kan-no-Shiro', 'Ippodo', 'Uji, Kyoto', 'ceremonial',
  'Bright and approachable ceremonial grade with balanced sweetness. Excellent for everyday usucha.',
  4.0, 3.5, 2.0, 3.0, 4.0,
  'high', '{manual,ippodo}', NULL, TRUE
),
(
  'Ikuyo-no-Mukashi', 'Ippodo', 'Uji, Kyoto', 'premium',
  'Rich and mellow premium grade that bridges ceremonial and daily drinking. Smooth with gentle vegetal notes.',
  3.5, 3.2, 2.5, 3.2, 3.5,
  'high', '{manual,ippodo}', NULL, TRUE
),

-- ============================================================================
-- MARUKYU KOYAMAEN (Uji, Kyoto — est. 1704)
-- ============================================================================
(
  'Aoarashi', 'Marukyu Koyamaen', 'Uji, Kyoto', 'ceremonial',
  'Top-tier ceremonial matcha prized by tea masters. Intensely creamy with layered umami and almost no astringency.',
  5.0, 4.0, 1.2, 2.0, 5.0,
  'high', '{manual,yunomi}', NULL, TRUE
),
(
  'Kinrin', 'Marukyu Koyamaen', 'Uji, Kyoto', 'ceremonial',
  'A refined ceremonial grade with bright jade color and elegant sweetness suited to both koicha and usucha.',
  4.5, 3.8, 1.8, 2.8, 4.5,
  'high', '{manual,yunomi}', NULL, TRUE
),
(
  'Wako', 'Marukyu Koyamaen', 'Uji, Kyoto', 'premium',
  'Versatile premium matcha with a clean, balanced profile. Popular as a daily-use ceremonial alternative.',
  3.8, 3.3, 2.2, 3.0, 3.8,
  'high', '{manual,yunomi}', NULL, TRUE
),

-- ============================================================================
-- KETTL (Brooklyn — sourced from Uji and Kagoshima)
-- ============================================================================
(
  'Tenju', 'Kettl', 'Uji, Kyoto', 'ceremonial',
  'Kettl''s top single-origin ceremonial from Uji. Full-bodied umami with a velvety mouthfeel and lingering sweetness.',
  4.6, 3.9, 1.6, 2.3, 4.6,
  'high', '{manual,kettl}', NULL, TRUE
),
(
  'Shin', 'Kettl', 'Kagoshima', 'premium',
  'Bright Kagoshima premium grade with vivid green color and a fresh, grassy character balanced by natural sweetness.',
  3.5, 3.5, 2.3, 3.5, 3.3,
  'high', '{manual,kettl}', NULL, TRUE
),

-- ============================================================================
-- SAZEN TEA (Kyoto)
-- ============================================================================
(
  'Premium Ceremonial', 'Sazen Tea', 'Uji, Kyoto', 'ceremonial',
  'Hand-picked first harvest from Uji. Pronounced umami sweetness with a silky texture and minimal bitterness.',
  4.3, 3.7, 1.7, 2.5, 4.3,
  'high', '{manual,sazen}', NULL, TRUE
),
(
  'Daily Matcha', 'Sazen Tea', 'Uji, Kyoto', 'premium',
  'An everyday matcha that balances quality and value. Clean taste with moderate grassiness and smooth body.',
  3.2, 3.0, 2.5, 3.3, 3.2,
  'medium', '{manual,sazen}', NULL, TRUE
),

-- ============================================================================
-- AOI MATCHA (Nishio, Aichi)
-- ============================================================================
(
  'Okumidori Ceremonial', 'Aoi Matcha', 'Nishio, Aichi', 'ceremonial',
  'Single-cultivar Okumidori from Nishio with distinctive marine sweetness. Creamy and refined with a clean finish.',
  4.2, 4.0, 1.8, 2.2, 4.4,
  'high', '{manual,yunomi}', NULL, TRUE
),

-- ============================================================================
-- ENCHA (sourced from Uji)
-- ============================================================================
(
  'Ceremonial Grade', 'Encha', 'Uji, Kyoto', 'ceremonial',
  'First-harvest organic ceremonial matcha. Smooth and naturally sweet with a gentle umami presence.',
  3.8, 3.5, 2.0, 2.8, 3.8,
  'high', '{manual,encha}', NULL, TRUE
),
(
  'Latte Grade', 'Encha', 'Uji, Kyoto', 'latte',
  'Second-harvest organic matcha designed for lattes. Bold enough to cut through milk with pleasant grassiness.',
  2.5, 2.3, 3.2, 3.8, 2.5,
  'high', '{manual,encha}', NULL, TRUE
),

-- ============================================================================
-- CUZEN MATCHA (sourced from Kagoshima)
-- ============================================================================
(
  'Premium Matcha Leaf', 'Cuzen', 'Kagoshima', 'premium',
  'Whole-leaf matcha ground fresh in the Cuzen machine. Bright and lively with a notable sweetness from Kagoshima terroir.',
  3.5, 3.8, 2.0, 3.0, 3.5,
  'medium', '{manual,cuzen}', NULL, TRUE
),
(
  'Signature Blend', 'Cuzen', 'Kagoshima', 'latte',
  'A robust blend optimized for fresh-ground lattes. Strong vegetal backbone that holds up well with milk.',
  2.8, 2.8, 3.0, 3.5, 2.8,
  'medium', '{manual,cuzen}', NULL, TRUE
),

-- ============================================================================
-- MATCHAFUL (sourced from Kagoshima)
-- ============================================================================
(
  'Kiwami', 'Matchaful', 'Kagoshima', 'ceremonial',
  'Single-origin ceremonial from Kagoshima with a remarkably sweet and creamy profile. Vibrant emerald color.',
  4.0, 4.2, 1.5, 2.5, 4.2,
  'high', '{manual,matchaful}', NULL, TRUE
),
(
  'Hikari', 'Matchaful', 'Kagoshima', 'latte',
  'Purpose-built latte grade with a bold flavor that shines through oat and dairy milk. Earthy and grassy.',
  2.5, 2.5, 3.3, 3.8, 2.3,
  'high', '{manual,matchaful}', NULL, TRUE
),

-- ============================================================================
-- NAOKI MATCHA (Uji, Kyoto)
-- ============================================================================
(
  'Superior Ceremonial', 'Naoki Matcha', 'Uji, Kyoto', 'ceremonial',
  'Award-winning Uji ceremonial with complex umami layers. Exceptionally smooth with a lingering marine-sweet aftertaste.',
  4.5, 3.8, 1.5, 2.3, 4.5,
  'high', '{manual,naoki}', NULL, TRUE
),

-- ============================================================================
-- MIDORI SPRING (sourced from Uji and Kagoshima)
-- ============================================================================
(
  'Organic Ceremonial', 'Midori Spring', 'Uji, Kyoto', 'ceremonial',
  'JAS-certified organic ceremonial matcha. Gentle umami with a clean, slightly floral sweetness.',
  3.6, 3.5, 2.0, 2.8, 3.6,
  'medium', '{manual}', NULL, TRUE
),

-- ============================================================================
-- JADE LEAF (sourced from Kagoshima and Uji)
-- ============================================================================
(
  'Organic Ceremonial', 'Jade Leaf', 'Kagoshima', 'ceremonial',
  'Accessible organic ceremonial matcha with a smooth, mildly sweet flavor. Good entry point for matcha beginners.',
  3.2, 3.3, 2.2, 3.0, 3.2,
  'medium', '{manual}', NULL, TRUE
),
(
  'Classic Culinary', 'Jade Leaf', 'Kagoshima', 'culinary',
  'Robust culinary grade ideal for baking and smoothies. Pronounced bitterness and grassiness that stands up in recipes.',
  2.0, 1.8, 4.0, 4.2, 1.8,
  'high', '{manual}', NULL, TRUE
),

-- ============================================================================
-- RISHI TEA (sourced from Uji)
-- ============================================================================
(
  'Teahouse Matcha', 'Rishi Tea', 'Uji, Kyoto', 'ceremonial',
  'Stone-ground ceremonial grade sourced from Uji. Well-rounded with balanced umami and a smooth, creamy body.',
  3.8, 3.3, 2.0, 2.8, 3.8,
  'high', '{manual,rishi}', NULL, TRUE
),

-- ============================================================================
-- DOMATCHA (sourced from Kagoshima and Shizuoka)
-- ============================================================================
(
  'Summer Harvest', 'DoMatcha', 'Kagoshima', 'culinary',
  'Later-harvest culinary grade with robust, earthy flavor. Higher catechin content makes it ideal for health-focused drinkers.',
  2.2, 1.8, 3.8, 4.0, 2.0,
  'high', '{manual}', NULL, TRUE
),

-- ============================================================================
-- HARNEY & SONS (sourced from Shizuoka and Kagoshima)
-- ============================================================================
(
  'Matcha', 'Harney & Sons', 'Shizuoka', 'culinary',
  'An approachable culinary matcha from Shizuoka. Grassy and slightly astringent, well-suited for cooking and blending.',
  2.0, 2.0, 3.5, 3.8, 2.0,
  'medium', '{manual}', NULL, TRUE
);

COMMIT;
