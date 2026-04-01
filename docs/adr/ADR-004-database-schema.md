# ADR-004: Database Schema Design

**Date:** 2026-04-01
**Status:** Proposed
**Deciders:** Gia Nguyen

---

## Context

Whiskly needs a Postgres database (hosted on Supabase) to store: matcha catalog entries
with taste profiles and confidence scoring, user profiles with materialized taste
preferences, matcha logs with per-log taste ratings, and content article metadata for
taste-based content recommendations. Users can log the same matcha multiple times.

## Decision Drivers

- Supabase (Postgres) with row-level security
- Materialized user taste profile (updated on each log) for fast reads
- Custom user-submitted matcha entries live in the same table as catalog entries
- Content articles stored as MDX in repo but indexed in DB for taste-based filtering
- Multiple logs per user per matcha allowed

---

## Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│   profiles   │       │   matcha_logs    │       │   matchas    │
│─────────────│       │─────────────────│       │─────────────│
│ id (FK auth)│──┐    │ id              │    ┌──│ id           │
│ display_name│  │    │ user_id (FK)────│────┘  │ name         │
│ avatar_url  │  └───>│ matcha_id (FK)──│───────│ brand        │
│ umami_avg   │       │ umami           │       │ region       │
│ sweetness.. │       │ sweetness       │       │ type         │
│ log_count   │       │ bitterness      │       │ umami        │
│ created_at  │       │ grassiness      │       │ sweetness    │
│ updated_at  │       │ creaminess      │       │ ...          │
└─────────────┘       │ overall_rating  │       │ confidence   │
                      │ notes           │       │ source       │
                      │ created_at      │       │ submitted_by │
                      │ updated_at      │       └─────────────┘
                      └─────────────────┘
                                                ┌──────────────┐
                                                │   articles   │
                                                │──────────────│
                                                │ id           │
                                                │ slug         │
                                                │ title        │
                                                │ category     │
                                                │ umami_min/max│
                                                │ sweetness... │
                                                │ published_at │
                                                └──────────────┘
```

### Table: `matchas`

The global matcha catalog. Includes both admin-curated and user-submitted entries.

```sql
CREATE TABLE matchas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  brand         TEXT NOT NULL,
  region        TEXT,                          -- e.g., "Uji, Kyoto"
  type          TEXT CHECK (type IN (          -- matcha grade
                  'ceremonial', 'premium', 'culinary', 'latte', 'other'
                )) DEFAULT 'ceremonial',
  description   TEXT,

  -- Baseline taste profile (1.0–5.0 scale, nullable for sparse data)
  umami         NUMERIC(2,1) CHECK (umami BETWEEN 1.0 AND 5.0),
  sweetness     NUMERIC(2,1) CHECK (sweetness BETWEEN 1.0 AND 5.0),
  bitterness    NUMERIC(2,1) CHECK (bitterness BETWEEN 1.0 AND 5.0),
  grassiness    NUMERIC(2,1) CHECK (grassiness BETWEEN 1.0 AND 5.0),
  creaminess    NUMERIC(2,1) CHECK (creaminess BETWEEN 1.0 AND 5.0),

  -- Confidence scoring for recommendations
  confidence    TEXT CHECK (confidence IN ('high', 'medium', 'low'))
                DEFAULT 'low',
  sources       TEXT[] DEFAULT '{}',           -- e.g., {'yunomi', 'kettl', 'reddit'}

  -- User-submitted entries
  submitted_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
                                               -- NULL = admin/scraped entry
  is_approved   BOOLEAN DEFAULT FALSE,         -- user entries need approval to
                                               -- appear in global catalog

  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_matchas_brand ON matchas (brand);
CREATE INDEX idx_matchas_confidence ON matchas (confidence);
CREATE INDEX idx_matchas_search ON matchas
  USING GIN (to_tsvector('english', name || ' ' || brand || ' ' || COALESCE(region, '')));
```

**Design notes:**
- `confidence = 'low'` entries are excluded from recommendations but visible in catalog
- `submitted_by IS NULL` means the entry came from the seed pipeline or admin
- `is_approved` gates user-submitted entries from appearing in search/recommendations
  for other users. The submitter can always see and log their own entries.
- Full-text search index on name + brand + region for the catalog search feature
- Taste dimensions are nullable — sparse scraped data may be missing some dimensions

### Table: `profiles`

User profile with materialized taste preferences. One row per user, updated on each log.

```sql
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT,
  avatar_url      TEXT,

  -- Materialized taste profile (averages across all logs)
  umami_avg       NUMERIC(3,2) DEFAULT 0,
  sweetness_avg   NUMERIC(3,2) DEFAULT 0,
  bitterness_avg  NUMERIC(3,2) DEFAULT 0,
  grassiness_avg  NUMERIC(3,2) DEFAULT 0,
  creaminess_avg  NUMERIC(3,2) DEFAULT 0,
  log_count       INTEGER DEFAULT 0,

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
```

**Design notes:**
- PK is the Supabase auth user ID — one profile per user
- Taste averages are recalculated on each log insert/update/delete via a DB function
- `log_count` tracks total logs for the "unlock recommendations after 3+" rule
- `NUMERIC(3,2)` allows values like `4.25` — more precise than the 1-5 input scale
  because it's an average

### Table: `matcha_logs`

A user's personal rating of a matcha. Multiple logs per user per matcha allowed.

```sql
CREATE TABLE matcha_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  matcha_id       UUID NOT NULL REFERENCES matchas(id) ON DELETE CASCADE,

  -- Per-log taste ratings (1–5 integer scale)
  umami           SMALLINT NOT NULL CHECK (umami BETWEEN 1 AND 5),
  sweetness       SMALLINT NOT NULL CHECK (sweetness BETWEEN 1 AND 5),
  bitterness      SMALLINT NOT NULL CHECK (bitterness BETWEEN 1 AND 5),
  grassiness      SMALLINT NOT NULL CHECK (grassiness BETWEEN 1 AND 5),
  creaminess      SMALLINT NOT NULL CHECK (creaminess BETWEEN 1 AND 5),

  -- Overall impression
  overall_rating  SMALLINT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  notes           TEXT,

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_logs_user ON matcha_logs (user_id, created_at DESC);
CREATE INDEX idx_logs_matcha ON matcha_logs (matcha_id);
```

**Design notes:**
- No unique constraint on (user_id, matcha_id) — allows multiple logs
- Taste ratings are integers (1-5 via sliders) unlike catalog baselines (which are decimals)
- `created_at DESC` index optimizes the "log history sorted by recency" view
- Notes are optional free text

### Table: `articles`

Metadata index for MDX content files. The actual article body lives in the repo at
`src/content/articles/{slug}.mdx`. This table enables taste-profile-based filtering.

```sql
CREATE TABLE articles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,        -- matches filename: "uji-matcha-origin"
  title           TEXT NOT NULL,
  category        TEXT CHECK (category IN (
                    'pairing', 'preparation', 'origin', 'guide'
                  )) NOT NULL,
  summary         TEXT,                        -- 1-2 sentence preview

  -- Taste profile affinity ranges (which taste preferences does this article match?)
  -- NULL means "relevant to all"
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
```

**Design notes:**
- `slug` maps to the MDX file path — single source of truth for content body
- Taste affinity uses min/max ranges, not exact values. An article about "creamy matcha
  pairings" would have `creaminess_min = 3.5, creaminess_max = 5.0` and NULL for other
  dimensions (meaning "any")
- A query to find articles for a user: match where the user's profile averages fall
  within each non-null min/max range
- `published_at IS NULL` means draft — not shown to users

### Database Functions

#### Recalculate user taste profile on log change

```sql
CREATE OR REPLACE FUNCTION recalculate_taste_profile()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET
    umami_avg = sub.umami_avg,
    sweetness_avg = sub.sweetness_avg,
    bitterness_avg = sub.bitterness_avg,
    grassiness_avg = sub.grassiness_avg,
    creaminess_avg = sub.creaminess_avg,
    log_count = sub.log_count,
    updated_at = now()
  FROM (
    SELECT
      user_id,
      ROUND(AVG(umami)::numeric, 2) AS umami_avg,
      ROUND(AVG(sweetness)::numeric, 2) AS sweetness_avg,
      ROUND(AVG(bitterness)::numeric, 2) AS bitterness_avg,
      ROUND(AVG(grassiness)::numeric, 2) AS grassiness_avg,
      ROUND(AVG(creaminess)::numeric, 2) AS creaminess_avg,
      COUNT(*) AS log_count
    FROM matcha_logs
    WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    GROUP BY user_id
  ) sub
  WHERE profiles.id = sub.user_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_recalculate_taste_profile
  AFTER INSERT OR UPDATE OR DELETE ON matcha_logs
  FOR EACH ROW EXECUTE FUNCTION recalculate_taste_profile();
```

#### Matcha recommendations (cosine similarity)

```sql
CREATE OR REPLACE FUNCTION get_recommendations(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
  matcha_id UUID,
  name TEXT,
  brand TEXT,
  similarity NUMERIC
) AS $$
DECLARE
  u_umami    NUMERIC;
  u_sweet    NUMERIC;
  u_bitter   NUMERIC;
  u_grass    NUMERIC;
  u_cream    NUMERIC;
BEGIN
  -- Get user's taste profile
  SELECT umami_avg, sweetness_avg, bitterness_avg, grassiness_avg, creaminess_avg
  INTO u_umami, u_sweet, u_bitter, u_grass, u_cream
  FROM profiles WHERE id = p_user_id;

  RETURN QUERY
  SELECT
    m.id AS matcha_id,
    m.name,
    m.brand,
    -- Cosine similarity between user profile and matcha baseline
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
  WHERE m.confidence IN ('high', 'medium')           -- exclude low-confidence
    AND m.umami IS NOT NULL                           -- need complete taste profile
    AND m.sweetness IS NOT NULL
    AND m.bitterness IS NOT NULL
    AND m.grassiness IS NOT NULL
    AND m.creaminess IS NOT NULL
    AND (m.submitted_by IS NULL OR m.is_approved)     -- only catalog/approved entries
    AND m.id NOT IN (                                 -- exclude already-logged
          SELECT matcha_id FROM matcha_logs WHERE user_id = p_user_id
        )
  ORDER BY similarity DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Row-Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matcha_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE matchas ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY profiles_select ON profiles FOR SELECT USING (true);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id);

-- Matcha logs: users can CRUD their own logs
CREATE POLICY logs_select ON matcha_logs FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY logs_insert ON matcha_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY logs_update ON matcha_logs FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY logs_delete ON matcha_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Matchas: anyone can read approved/catalog entries; users can insert (for custom entries)
CREATE POLICY matchas_select ON matchas FOR SELECT
  USING (submitted_by IS NULL OR is_approved OR submitted_by = auth.uid());
CREATE POLICY matchas_insert ON matchas FOR INSERT
  WITH CHECK (auth.uid() = submitted_by);

-- Articles: anyone can read published articles
CREATE POLICY articles_select ON articles FOR SELECT
  USING (published_at IS NOT NULL AND published_at <= now());
```

---

## Consequences

### Positive
- Materialized taste profile means recommendation queries are fast (no aggregation at read time)
- Trigger-based profile updates keep data consistent without app-layer complexity
- Cosine similarity runs in Postgres — no external service needed
- RLS enforces data isolation at the database level
- Full-text search on catalog is built into Postgres

### Negative
- Trigger on every log write adds slight overhead (negligible at <50 users)
- Article taste ranges are manual to set — requires judgment when writing content
- Cosine similarity in SQL is less flexible than app-layer (harder to add weighting later)

### Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Trigger fails silently on edge case | Low | Medium | Add error logging; test with edge cases (first log, delete all logs) |
| Cosine similarity returns poor results with few logs | Medium | Medium | Require 3+ logs before showing recommendations; show confidence indicator |
| User submits garbage custom entries | Low | Low | `is_approved = false` by default; only submitter sees their own entries |

## Follow-Up Actions

- [ ] Create Supabase project and run this schema
- [ ] Write migration file: `infra/supabase/migrations/001_initial_schema.sql`
- [ ] Test trigger with: insert 3 logs, verify profile updates, verify recommendations
- [ ] Seed catalog from `scripts/seed-catalog/catalog.json`
- [ ] Test RLS policies with authenticated and anonymous users
