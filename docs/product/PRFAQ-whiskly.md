# PR/FAQ: Whiskly

**Author:** Gia Nguyen  
**Date:** 2026-03-31  
**Status:** Draft

---

## Press Release

### Headline

Whiskly helps matcha lovers track what they drink, discover what they'll love, and never forget a great bowl again.

### Subheading

A personal matcha journal with taste profiling and smart recommendations — built for the curious drinker, not the tea sommelier.

### Problem

Matcha is everywhere. Coffee shops, grocery shelves, Instagram reels. But for the growing
wave of young professionals who've moved beyond "matcha latte from Starbucks" into trying
ceremonial grades, regional varieties, and specialty brands — there's no good way to
remember what they've tried or figure out what to try next.

Information about matcha is scattered across blog posts, YouTube reviews, and Reddit threads,
most of which are paid promotions or written for hardcore tea enthusiasts. If you want to
track your own preferences — what was that grassy one from Ippodo? did I like the Uji
harvest better than the Kagoshima? — your only option is a spreadsheet or your memory.
Neither scales. Neither recommends.

### Solution

Whiskly is a personal matcha tracker that lets you log what you drink, rate taste
profiles (umami, sweetness, bitterness, grassiness, creaminess), and build a preference
fingerprint over time. As your log grows, Whiskly recommends matcha you haven't tried
that matches your palate — no sponsorships, no ads, just your data working for you.

Beyond tracking, Whiskly surfaces curated content: what foods pair well with your
favorite profiles, preparation tips, and short reads on origins and processing. It's
the matcha companion for someone who wants to be informed without becoming an expert.

### Quote from Leadership

> "We built Whiskly because we kept buying matcha we'd already tried, forgetting what
> we liked, and getting burned by promoted reviews. It started as a spreadsheet for
> friends. Now it's an app."

### How It Works

- **Log a matcha:** Search a brand, rate it on 5 taste dimensions, add notes (photo optional)
- **See your palate:** A visual taste profile builds as you log — see what you gravitate toward
- **Get recommendations:** Whiskly suggests matcha that fits your flavor preferences from its catalog
- **Read and pair:** Browse short content pieces — food pairings, prep methods, origin stories — tailored to profiles you enjoy
- **Share with friends:** Generate a styled matcha card image with your rating and notes — share it to stories, texts, or group chats

### Customer Quote

> "I used to screenshot matcha packaging so I'd remember what I liked. Now I just open
> Whiskly after every cup. It recommended a Yame matcha last week that I never would
> have found on my own — it's my new favorite."

### Call to Action

Download Whiskly and start building your matcha profile. Your first log takes 30 seconds.

---

## Frequently Asked Questions

### External (Customer) FAQ

**Q1: Who is this for?**
A: Anyone who drinks matcha more than casually and wants to remember what they like.
You don't need to know anything about tea — Whiskly teaches you as you go. If you've
ever Googled "best matcha" and felt overwhelmed, this is for you.

**Q2: How much does it cost?**
A: Free. We're building this for our community first, not to monetize.

**Q3: How is this different from tea review sites or blogs?**
A: Review sites tell you what *someone else* thinks. Whiskly tracks what *you* think
and uses that to recommend what you'll actually like. No paid promotions, no ads —
just your taste data.

**Q4: Where does the matcha catalog come from?**
A: We start with a curated catalog of widely available matcha brands and varieties.
You can also add custom entries for anything not in the catalog. The catalog grows
with the community.

**Q5: Do I need to know matcha terminology to use this?**
A: No. Taste ratings use plain descriptors (sweet, bitter, grassy, creamy, umami)
with visual sliders. Whiskly explains what each means the first time you see it.

**Q6: Can I use this for other teas?**
A: Not in v1. We're focused on matcha to keep the experience tight. Other teas may
come later based on demand.

### Internal (Stakeholder) FAQ

**Q1: Why now? What's the urgency?**
A: Matcha is at peak cultural moment with young professionals. The space has no
dedicated tracking tool — just generic tea apps or spreadsheets. Low competition
window to establish a small, loyal user base among friends and community.

**Q2: What's the estimated effort?**
A: MVP is a mobile-friendly web app (not native) with: matcha logging, taste
profiling, basic recommendations, and a small content section. Estimated 4-6 weeks
for a solo/small team.

**Q3: What are the biggest risks?**
A: (1) Building a catalog that's big enough to be useful on day 1. (2) Recommendation
quality with small user data — cold start problem. (3) Retention — logging fatigue
if the app doesn't give back enough value quickly.

**Q4: How will we measure success?**
A: For the initial launch to friends and family:
- 10+ active users logging matcha within first month
- Average 3+ logs per user
- At least 1 recommendation acted on per active user
- Qualitative: "I found something new I liked through Whiskly"

**Q5: What's the competitive landscape?**
A: Direct competitors are nearly nonexistent for matcha-specific tracking. Adjacent:
- **Vivino** (wine) — proven model for drink tracking + recommendations, but for wine
- **Untappd** (beer) — social beer check-ins, similar concept different category
- **Steepster** (tea) — tea review community, but broad, not matcha-focused, and dated UX
- **Spreadsheets/Notes apps** — the actual current solution for most people

**Q6: What are we explicitly NOT doing in v1?**
A: Not building:
- Native mobile apps (web-first, mobile-responsive)
- Social features beyond shareable cards (no feed, no followers, no public profile pages)
- E-commerce or affiliate links
- User-generated blog content
- Multi-language support
- Advanced ML recommendation engine (v1 uses simple taste-vector matching)

---

## Appendix

### Taste Profile Dimensions (v1)

| Dimension | Description | Scale |
|-----------|-------------|-------|
| Umami | Savory depth, brothy quality | 1-5 |
| Sweetness | Natural sweetness without sugar | 1-5 |
| Bitterness | Astringent or sharp notes | 1-5 |
| Grassiness | Fresh, vegetal, or marine quality | 1-5 |
| Creaminess | Smooth, full-bodied mouthfeel | 1-5 |

### MVP User Journey

```
Download/Open → Browse catalog or add matcha → Rate on 5 taste sliders →
Add notes/photo → View personal taste profile → Get first recommendation
(after 3+ logs) → Read paired content → Share a favorite with a friend
```

### Assumptions

- Users will log at least once per week if the friction is low enough (< 30 sec)
- 5 taste dimensions are sufficient to differentiate matcha meaningfully
- A curated catalog of ~50-100 matcha varieties is enough for launch
- Simple cosine similarity on taste vectors produces "good enough" recommendations for v1
- Content can be written/curated manually at launch scale (1-2 posts per week)
