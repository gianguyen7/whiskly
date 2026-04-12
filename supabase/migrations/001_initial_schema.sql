-- Whiskly Initial Schema
-- Run against Supabase Postgres
-- See ADR-004 for design rationale: docs/adr/ADR-004-database-schema.md

-- =============================================================================
-- TABLES
-- =============================================================================

-- Matcha catalog (admin-curated + user-submitted)
CREATE TABLE matchas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  brand         TEXT NOT NULL,
  region        TEXT,
  type          TEXT CHECK (type IN (
                  'ceremonial', 'premium', 'culinary', 'latte', 'other'
                )) DEFAULT 'ceremonial',
  description   TEXT,

  -- Baseline taste profile (1.0–5.0, nullable for sparse data)
  umami         NUMERIC(2,1) CHECK (umami BETWEEN 1.0 AND 5.0),
  sweetness     NUMERIC(2,1) CHECK (sweetness BETWEEN 1.0 AND 5.0),
  bitterness    NUMERIC(2,1) CHECK (bitterness BETWEEN 1.0 AND 5.0),
  grassiness    NUMERIC(2,1) CHECK (grassiness BETWEEN 1.0 AND 5.0),
  creaminess    NUMERIC(2,1) CHECK (creaminess BETWEEN 1.0 AND 5.0),

  confidence    TEXT CHECK (confidence IN ('high', 'medium', 'low')) DEFAULT 'low',
  sources       TEXT[] DEFAULT '{}',

  submitted_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_approved   BOOLEAN DEFAULT FALSE,

  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_matchas_brand ON matchas (brand);
CREATE INDEX idx_matchas_confidence ON matchas (confidence);
CREATE INDEX idx_matchas_search ON matchas
  USING GIN (to_tsvector('english', name || ' ' || brand || ' ' || COALESCE(region, '')));

-- User profiles with materialized taste preferences
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT,
  avatar_url      TEXT,

  umami_avg       NUMERIC(3,2) DEFAULT 0,
  sweetness_avg   NUMERIC(3,2) DEFAULT 0,
  bitterness_avg  NUMERIC(3,2) DEFAULT 0,
  grassiness_avg  NUMERIC(3,2) DEFAULT 0,
  creaminess_avg  NUMERIC(3,2) DEFAULT 0,
  log_count       INTEGER DEFAULT 0,

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Matcha logs (user ratings, multiple per matcha allowed)
CREATE TABLE matcha_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  matcha_id       UUID NOT NULL REFERENCES matchas(id) ON DELETE CASCADE,

  umami           SMALLINT NOT NULL CHECK (umami BETWEEN 1 AND 5),
  sweetness       SMALLINT NOT NULL CHECK (sweetness BETWEEN 1 AND 5),
  bitterness      SMALLINT NOT NULL CHECK (bitterness BETWEEN 1 AND 5),
  grassiness      SMALLINT NOT NULL CHECK (grassiness BETWEEN 1 AND 5),
  creaminess      SMALLINT NOT NULL CHECK (creaminess BETWEEN 1 AND 5),

  overall_rating  SMALLINT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  notes           TEXT,

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_logs_user ON matcha_logs (user_id, created_at DESC);
CREATE INDEX idx_logs_matcha ON matcha_logs (matcha_id);

-- Article metadata (content body lives in MDX files)
CREATE TABLE articles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  category        TEXT CHECK (category IN (
                    'pairing', 'preparation', 'origin', 'guide'
                  )) NOT NULL,
  summary         TEXT,

  -- Taste profile affinity ranges (NULL = relevant to all)
  umami_min       NUMERIC(2,1) CHECK (umami_min BETWEEN 1.0 AND 5.0),
  umami_max       NUMERIC(2,1) CHECK (umami_max BETWEEN 1.0 AND 5.0),
  sweetness_min   NUMERIC(2,1) CHECK (sweetness_min BETWEEN 1.0 AND 5.0),
  sweetness_max   NUMERIC(2,1) CHECK (sweetness_max BETWEEN 1.0 AND 5.0),
  bitterness_min  NUMERIC(2,1) CHECK (bitterness_min BETWEEN 1.0 AND 5.0),
  bitterness_max  NUMERIC(2,1) CHECK (bitterness_max BETWEEN 1.0 AND 5.0),
  grassiness_min  NUMERIC(2,1) CHECK (grassiness_min BETWEEN 1.0 AND 5.0),
  grassiness_max  NUMERIC(2,1) CHECK (grassiness_max BETWEEN 1.0 AND 5.0),
  creaminess_min  NUMERIC(2,1) CHECK (creaminess_min BETWEEN 1.0 AND 5.0),
  creaminess_max  NUMERIC(2,1) CHECK (creaminess_max BETWEEN 1.0 AND 5.0),

  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_articles_category ON articles (category);
CREATE INDEX idx_articles_published ON articles (published_at DESC);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Recalculate materialized taste profile on log change
CREATE OR REPLACE FUNCTION recalculate_taste_profile()
RETURNS TRIGGER AS $$
DECLARE
  target_user_id UUID;
BEGIN
  target_user_id := COALESCE(NEW.user_id, OLD.user_id);

  UPDATE profiles SET
    umami_avg = COALESCE(sub.umami_avg, 0),
    sweetness_avg = COALESCE(sub.sweetness_avg, 0),
    bitterness_avg = COALESCE(sub.bitterness_avg, 0),
    grassiness_avg = COALESCE(sub.grassiness_avg, 0),
    creaminess_avg = COALESCE(sub.creaminess_avg, 0),
    log_count = COALESCE(sub.log_count, 0),
    updated_at = now()
  FROM (
    SELECT
      ROUND(AVG(umami)::numeric, 2) AS umami_avg,
      ROUND(AVG(sweetness)::numeric, 2) AS sweetness_avg,
      ROUND(AVG(bitterness)::numeric, 2) AS bitterness_avg,
      ROUND(AVG(grassiness)::numeric, 2) AS grassiness_avg,
      ROUND(AVG(creaminess)::numeric, 2) AS creaminess_avg,
      COUNT(*) AS log_count
    FROM matcha_logs
    WHERE user_id = target_user_id
  ) sub
  WHERE profiles.id = target_user_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_recalculate_taste_profile
  AFTER INSERT OR UPDATE OR DELETE ON matcha_logs
  FOR EACH ROW EXECUTE FUNCTION recalculate_taste_profile();

-- Updated_at auto-touch for all tables
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_matchas_updated_at
  BEFORE UPDATE ON matchas FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_logs_updated_at
  BEFORE UPDATE ON matcha_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_articles_updated_at
  BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Matcha recommendations via cosine similarity
CREATE OR REPLACE FUNCTION get_recommendations(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
  matcha_id UUID,
  name TEXT,
  brand TEXT,
  region TEXT,
  umami NUMERIC,
  sweetness NUMERIC,
  bitterness NUMERIC,
  grassiness NUMERIC,
  creaminess NUMERIC,
  similarity NUMERIC
) AS $$
DECLARE
  u_umami    NUMERIC;
  u_sweet    NUMERIC;
  u_bitter   NUMERIC;
  u_grass    NUMERIC;
  u_cream    NUMERIC;
BEGIN
  SELECT umami_avg, sweetness_avg, bitterness_avg, grassiness_avg, creaminess_avg
  INTO u_umami, u_sweet, u_bitter, u_grass, u_cream
  FROM profiles WHERE id = p_user_id;

  RETURN QUERY
  SELECT
    m.id AS matcha_id,
    m.name,
    m.brand,
    m.region,
    m.umami,
    m.sweetness,
    m.bitterness,
    m.grassiness,
    m.creaminess,
    ROUND((
      (u_umami * m.umami + u_sweet * m.sweetness + u_bitter * m.bitterness +
       u_grass * m.grassiness + u_cream * m.creaminess)
      /
      NULLIF(
        SQRT(u_umami^2 + u_sweet^2 + u_bitter^2 + u_grass^2 + u_cream^2) *
        SQRT(m.umami^2 + m.sweetness^2 + m.bitterness^2 + m.grassiness^2 + m.creaminess^2),
        0
      )
    )::numeric, 4) AS similarity
  FROM matchas m
  WHERE m.confidence IN ('high', 'medium')
    AND m.umami IS NOT NULL
    AND m.sweetness IS NOT NULL
    AND m.bitterness IS NOT NULL
    AND m.grassiness IS NOT NULL
    AND m.creaminess IS NOT NULL
    AND (m.submitted_by IS NULL OR m.is_approved)
    AND m.id NOT IN (
          SELECT ml.matcha_id FROM matcha_logs ml WHERE ml.user_id = p_user_id
        )
  ORDER BY similarity DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matcha_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE matchas ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read (for future sharing), only owner can update
CREATE POLICY profiles_select ON profiles FOR SELECT USING (true);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id);

-- Matcha logs: users can CRUD their own logs only
CREATE POLICY logs_select ON matcha_logs FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY logs_insert ON matcha_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY logs_update ON matcha_logs FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY logs_delete ON matcha_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Matchas: read catalog/approved + own submissions; insert own custom entries
CREATE POLICY matchas_select ON matchas FOR SELECT
  USING (submitted_by IS NULL OR is_approved OR submitted_by = auth.uid());
CREATE POLICY matchas_insert ON matchas FOR INSERT
  WITH CHECK (auth.uid() = submitted_by);

-- Articles: read published only
CREATE POLICY articles_select ON articles FOR SELECT
  USING (published_at IS NOT NULL AND published_at <= now());
