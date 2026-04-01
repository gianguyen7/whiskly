# Matcha Catalog Seeding Pipeline

One-time pipeline to build the initial matcha catalog with taste profiles.

## Overview

```
scrape_yunomi.py    → Numerical taste scores (primary source)
scrape_kettl.py     → Prose descriptions → LLM extraction
scrape_sazen.py     → Prose descriptions → LLM extraction
scrape_ippodo.py    → Categorized data + blog comparisons
validate_reddit.py  → Community sentiment cross-reference
deduplicate.py      → Fuzzy match + merge across sources
build_catalog.py    → Orchestrator → outputs catalog.json
```

## Usage

```bash
# Install dependencies
pip install -r requirements.txt

# Run full pipeline
python build_catalog.py

# Or run individual steps
python scrape_yunomi.py        # outputs raw/yunomi.json
python scrape_kettl.py         # outputs raw/kettl.json
python extract_taste.py        # adds taste scores to prose-based entries
python validate_reddit.py      # adds confidence adjustments
python deduplicate.py          # merges duplicates
python build_catalog.py        # combines all → catalog.json
```

## Output

`catalog.json` — array of matcha entries matching the Supabase schema:

```json
{
  "name": "Hikari",
  "brand": "Marukyu Koyamaen",
  "region": "Uji, Kyoto",
  "type": "ceremonial",
  "description": "...",
  "umami": 4.2,
  "sweetness": 3.5,
  "bitterness": 2.1,
  "grassiness": 3.8,
  "creaminess": 4.0,
  "confidence": "high",
  "sources": ["yunomi", "kettl", "reddit"]
}
```

## Confidence Levels

- **high** — manual rating, or 2+ sources agree, or Yunomi numerical
- **medium** — single prose source, LLM-extracted, no contradictions
- **low** — sparse/conflicting data — excluded from recommendations

## Architecture Decision

See [ADR-003](../../docs/adr/ADR-003-catalog-seeding-pipeline.md) for full rationale.
