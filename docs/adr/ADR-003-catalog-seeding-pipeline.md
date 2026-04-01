# ADR-003: Matcha Catalog Seeding Pipeline

**Date:** 2026-04-01
**Status:** Proposed
**Deciders:** Gia Nguyen

---

## Context

Whiskly's recommendation engine requires catalog entries to have baseline taste profiles
(umami, sweetness, bitterness, grassiness, creaminess on a 1-5 scale). We need ~50-100
entries at launch. Gia can manually rate 3-4, but the rest must come from external data.

## Decision Drivers

- **Cost** — must be free or near-free
- **Data quality** — taste profiles must be meaningful enough for recommendations
- **Effort** — solo dev, this is a build-time script not a production service
- **Legal risk** — prefer public APIs and structured endpoints over aggressive scraping

## Pipeline Design

```
[Sources] → [Extract] → [Normalize] → [Validate] → [Seed DB]
```

### Sources (ranked by value)

| Priority | Source | Data Type | Access Method | ~Products |
|----------|--------|-----------|---------------|-----------|
| 1 | Yunomi.life | Numerical scores (umami, creaminess, bitterness, astringency /20) | Shopify `/products.json` — free, structured JSON | 50-80 |
| 2 | Kettl | Prose tasting notes | Shopify `/products.json` | ~42 |
| 3 | Sazen Tea | Prose tasting notes, multiple producers | Shopify `/products.json` | 30-40 |
| 4 | Ippodo | Categorized (light/medium/rich) + blog comparisons | Shopify `/products.json` + blog HTML | 10-15 |
| 5 | Reddit (Arctic Shift) | User reviews, unstructured | Arctic Shift API — free, JSON | Validation only |
| 6 | Gia (manual) | Gold-standard 1-5 ratings | Manual entry | 3-4 |

### Extract & Normalize

**Yunomi (numerical):**
- Scores are on /20 or /10 scales → normalize to 1-5
- Map their dimensions to ours:
  - Yunomi Umami → our Umami
  - Yunomi Creaminess → our Creaminess
  - Yunomi Lack of Bitterness → invert to our Bitterness
  - Yunomi Lack of Astringency → proxy for Grassiness (imperfect — flag for review)
- Missing dimension: Sweetness — derive from description text or leave as null

**Kettl / Sazen / Ippodo (prose):**
- Feed product descriptions through an LLM (Claude API or local model) with a prompt:
  "Given this matcha product description, rate on a 1-5 scale: umami, sweetness,
  bitterness, grassiness, creaminess. Return JSON."
- Batch process all products in one script run
- Cost: minimal (small token count, one-time run)

**Reddit (validation):**
- Search Arctic Shift for brand/product name mentions in r/matcha and r/tea
- Extract sentiment keywords (bitter, grassy, smooth, sweet, strong umami, etc.)
- Use as confidence boost — if Reddit sentiment aligns with scraped scores, increase
  confidence. If it contradicts, flag for manual review.

### Validate & Confidence Scoring

Each catalog entry gets a confidence level:

| Level | Criteria | Recommendation Eligible? |
|-------|----------|--------------------------|
| **High** | Manual rating OR 2+ sources agree OR Yunomi numerical | Yes |
| **Medium** | Single prose source, LLM-extracted, no contradictions | Yes |
| **Low** | Sparse data, conflicting sources, or missing dimensions | No — excluded until a real user logs it |

### Deduplication

Products appear across multiple retailers under different names. Dedup strategy:
- Match on: brand name + product name (fuzzy match, Levenshtein distance < 3)
- When duplicates found: merge scores (average), increase confidence
- Flag ambiguous matches for manual review

## Implementation

**Language:** Python (better scraping/NLP libraries)
**Location:** `scripts/seed-catalog/`
**Output:** `scripts/seed-catalog/catalog.json` → imported into Supabase via seed script

```
scripts/seed-catalog/
├── scrape_yunomi.py       # Fetch + normalize Yunomi products
├── scrape_kettl.py        # Fetch Kettl products
├── scrape_sazen.py        # Fetch Sazen products
├── scrape_ippodo.py       # Fetch Ippodo products
├── extract_taste.py       # LLM-based taste extraction from prose
├── validate_reddit.py     # Reddit cross-reference via Arctic Shift
├── deduplicate.py         # Fuzzy matching + merge
├── build_catalog.py       # Orchestrator: runs all steps, outputs catalog.json
├── catalog.json           # Final output — import into Supabase
└── README.md              # How to run the pipeline
```

**This pipeline runs once locally before launch, then occasionally to refresh the catalog.**
It is NOT a production service. No cron, no automation needed.

## Tradeoffs Accepted

| Tradeoff | Rationale |
|----------|-----------|
| Yunomi's "Lack of Astringency" is an imperfect proxy for Grassiness | Good enough for v1. User logs will correct over time. |
| LLM-extracted scores from prose have variance | Mitigated by confidence scoring and multi-source averaging |
| No Sweetness score from Yunomi | Derive from prose or leave null — 4/5 dimensions still enable recommendations |
| Retailer-sourced data has vendor bias | Mitigated by Reddit cross-reference and user override |
| One-time pipeline, not automated refresh | Catalog changes slowly. Manual re-run 1-2x is fine pre-scale. |

## Follow-Up Actions

- [ ] Set up `scripts/seed-catalog/` directory
- [ ] Write Yunomi scraper first (highest value, most structured)
- [ ] Test LLM extraction prompt on 5 Kettl products before scaling
- [ ] Define catalog.json schema (matches Supabase table schema)
- [ ] Seed Supabase and verify recommendations work end-to-end
