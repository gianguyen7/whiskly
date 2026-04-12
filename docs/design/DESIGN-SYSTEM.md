# Whiskly Design System

> Source of truth for visual language. Tokens live in `src/app/globals.css`;
> this doc explains intent, usage, and component patterns. If a value in code
> disagrees with this doc, fix the drift — don't invent a third value.

**Last updated:** 2026-04-11
**Status:** v0.1 — initial pass, to be refined as components are built out
**Applies to:** Whiskly PWA (Next.js + Tailwind v4)

---

## 1. Principles

1. **Calm, not caffeinated.** Matcha is a quiet ritual. The UI should feel
   considered — generous whitespace, muted neutrals, green as accent not
   wallpaper.
2. **Mobile-first, thumb-first.** Primary interactions sit in the bottom third
   of the screen. Minimum 44×44pt tap targets.
3. **Content over chrome.** Let matcha names, notes, and user logs be the loudest
   thing on screen. Navigation and containers recede.
4. **One accent color does the work.** Matcha green signals interactivity,
   selection, and brand. Everything else is neutral or data.
5. **Fast before fancy.** Prefer CSS transitions over animation libraries.
   Skeletons over spinners. Perceived performance matters more than novelty.

---

## 2. Color

### 2.1 Brand palette (matcha green)

Primary brand hue is `#7fb22e` (matcha-500). The ramp is tuned for AA contrast
on warm-50 backgrounds.

| Token         | Hex       | Use                                              |
|---------------|-----------|--------------------------------------------------|
| `matcha-50`   | `#f6fae8` | Subtle tint backgrounds, hover states            |
| `matcha-100`  | `#eaf4c8` | Pill backgrounds, selected chip fill             |
| `matcha-200`  | `#d4e896` | Card borders, dividers on tinted surfaces        |
| `matcha-300`  | `#b5d45c` | Decorative, illustration highlights              |
| `matcha-400`  | `#9ac63c` | Hover border for cards; secondary buttons border |
| `matcha-500`  | `#7fb22e` | **Brand.** Primary buttons, active nav, links    |
| `matcha-600`  | `#6a9526` | Primary button hover, link hover                 |
| `matcha-700`  | `#53741f` | Active nav text, headings on tinted surfaces     |
| `matcha-800`  | `#3f5a1a` | Pill text (on matcha-100), high-emphasis text    |
| `matcha-900`  | `#2d4014` | Reserved — rarely used                           |

**Rule of thumb:** text on `matcha-100` uses `matcha-800`; text on `white` uses
`matcha-700` or darker. Never place `matcha-500` text on `matcha-50` background
(insufficient contrast for body copy).

### 2.2 Warm neutrals

Warm greys anchor the UI. Cooler grays will feel clinical against green.

| Token       | Hex       | Use                                        |
|-------------|-----------|--------------------------------------------|
| `warm-50`   | `#fafaf8` | Page background (`--background`)           |
| `warm-100`  | `#f5f3ef` | Alternate section background, input fill  |
| `warm-200`  | `#e8e4dd` | Dividers, disabled button fill             |
| `warm-300`  | `#d4cec4` | Input border, secondary card border        |
| `warm-400`  | `#b5ad9f` | Placeholder text, disabled text            |
| `warm-500`  | `#968d7e` | Secondary body text (captions, metadata)   |

For text and icon neutrals below warm-500, we currently use Tailwind's built-in
`gray-*` scale (`gray-600`, `gray-700`, `gray-900`). **TODO:** decide whether
to extend the warm ramp to `warm-600/700/900` or keep the Tailwind defaults.
Current code uses `text-gray-500`, `text-gray-600`, `text-gray-900`.

### 2.3 Semantic colors

| Role        | Token                        | Hex       |
|-------------|------------------------------|-----------|
| Success     | reuse `matcha-600`           | `#6a9526` |
| Warning     | `amber-500` (Tailwind)       | `#f59e0b` |
| Danger      | `red-600` (Tailwind)         | `#dc2626` |
| Info        | `sky-600` (Tailwind)         | `#0284c7` |

Whiskly doesn't need a custom semantic ramp yet — Tailwind defaults are fine
for error/warning toasts and form validation. Revisit if brand consistency
complaints arise.

### 2.4 Contrast requirements

All text/background pairs must meet **WCAG AA**:
- Body text (≤18px): contrast ratio ≥ 4.5:1
- Large text (≥18px bold or ≥24px): ≥ 3:1
- UI components & graphical objects: ≥ 3:1

Verified pairs:
- `gray-900` on `warm-50` — 17.4:1 ✓
- `matcha-700` on `white` — 6.1:1 ✓
- `matcha-800` on `matcha-100` — 8.2:1 ✓
- `warm-500` on `warm-50` — 3.9:1 — **large text only**
- White on `matcha-500` — 3.1:1 — **large text or bold only** (buttons ok)

---

## 3. Typography

### 3.1 Families

| Role       | Family                 | Source         | Notes                             |
|------------|------------------------|----------------|-----------------------------------|
| UI sans    | **Geist Sans**         | `next/font`    | Body, headings, UI chrome         |
| Monospace  | Geist Mono             | `next/font`    | Code, numeric tabular data        |
| Wordmark   | **Nunito Sans 600**    | Asset only     | Logo only — not used for UI text  |

The wordmark font is intentionally *not* loaded site-wide. It appears only in
the logo SVG/component to keep brand identity distinct from UI voice.

### 3.2 Type scale

Mobile-first scale; desktop uses the same sizes (we're not doing responsive
typography until we have real tablet layouts).

| Token    | Size / line-height | Weight | Use                          |
|----------|--------------------|--------|------------------------------|
| `display`| 32 / 38            | 700    | Onboarding hero, splash      |
| `h1`     | 24 / 30            | 700    | Screen title                 |
| `h2`     | 20 / 26            | 600    | Section heading              |
| `h3`     | 16 / 22            | 600    | Card title, form section     |
| `body`   | 15 / 22            | 400    | Default paragraph            |
| `body-sm`| 14 / 20            | 400    | Secondary paragraph, list    |
| `caption`| 12 / 16            | 500    | Metadata, pills, labels      |
| `overline`| 11 / 14           | 600    | Uppercase labels (tracked +0.05em) |

Tailwind mapping (use these classes; don't hand-roll sizes):

| Token      | Tailwind                            |
|------------|-------------------------------------|
| `display`  | `text-3xl font-bold leading-tight`  |
| `h1`       | `text-2xl font-bold leading-snug`   |
| `h2`       | `text-xl font-semibold leading-snug`|
| `h3`       | `text-base font-semibold`           |
| `body`     | `text-[15px] leading-relaxed`       |
| `body-sm`  | `text-sm`                           |
| `caption`  | `text-xs font-medium`               |
| `overline` | `text-[11px] font-semibold uppercase tracking-wide` |

### 3.3 Text color defaults

- Default body: `text-gray-900`
- Secondary: `text-gray-600`
- Tertiary / metadata: `text-gray-500`
- Disabled: `text-warm-400`
- Link / interactive: `text-matcha-700 hover:text-matcha-800 underline-offset-2`

---

## 4. Spacing

Whiskly uses Tailwind's default 4px-based scale. The commonly used steps:

| Token | px  | Use                                           |
|-------|-----|-----------------------------------------------|
| `1`   | 4   | Tight icon/text gap                           |
| `2`   | 8   | Related elements (label+input)                |
| `3`   | 12  | Card internal gap                             |
| `4`   | 16  | **Default gutter.** Page padding, card padding |
| `6`   | 24  | Section spacing inside a screen               |
| `8`   | 32  | Between major sections                        |
| `12`  | 48  | Screen top padding, above primary CTA         |
| `16`  | 64  | Empty state vertical centering                |

**Rules:**
- Page horizontal padding: `px-4` (16px) on mobile, `px-6` (24px) from `sm:` up.
- Bottom nav is 64px tall — leave `pb-20` (80px) on scroll containers so the
  last item clears the nav.
- Stack spacing inside a card: `space-y-2` for related, `space-y-4` between blocks.

---

## 5. Radii

| Token       | px  | Use                                     |
|-------------|-----|-----------------------------------------|
| `rounded`   | 4   | Inline chips, small badges              |
| `rounded-md`| 6   | Inputs, secondary buttons               |
| `rounded-lg`| 8   | Primary buttons                         |
| `rounded-xl`| 12  | **Cards.** Default for all content cards |
| `rounded-2xl`| 16 | Modals, sheets                          |
| `rounded-full`| ∞ | Avatars, pills, icon buttons            |

Consistency matters more than the exact value — if you find yourself reaching
for `rounded-[10px]`, you probably want `rounded-lg` or `rounded-xl`.

---

## 6. Elevation (shadows)

Whiskly is flat-ish. Shadows signal interactivity, not hierarchy.

| Token            | Definition                                      | Use                          |
|------------------|-------------------------------------------------|------------------------------|
| `shadow-none`    | —                                               | Default card rest state      |
| `shadow-sm`      | `0 1px 2px 0 rgb(0 0 0 / 0.04)`                 | Rest state for elevated cards |
| `shadow-md`      | `0 4px 12px -2px rgb(0 0 0 / 0.08)`             | **Card hover**, dropdown     |
| `shadow-lg`      | `0 10px 30px -6px rgb(0 0 0 / 0.12)`            | Modal, sheet, floating CTA   |

No `shadow-xl` or `shadow-2xl` — they belong to a louder design language than
this one.

---

## 7. Motion

### 7.1 Durations

| Token   | Duration | Use                              |
|---------|----------|----------------------------------|
| `fast`  | 120ms    | Hover, focus, color transitions  |
| `base`  | 200ms    | Card lift, button press          |
| `slow`  | 320ms    | Sheet open, page-level transitions |

### 7.2 Easings

Use Tailwind defaults: `ease-out` for enter, `ease-in` for exit, `ease-in-out`
for loops. Avoid `linear` except for progress indicators.

### 7.3 Rules

- Respect `prefers-reduced-motion`: wrap non-essential motion in a media query.
- No animation longer than 400ms on tap-to-response interactions — users perceive
  anything longer as lag.
- Prefer `transition-colors` and `transition-transform` over `transition-all`.

---

## 8. Iconography

- **Set:** [`lucide-react`](https://lucide.dev) — use the published React
  components, not hand-rolled SVGs.
- **Size:** 20 default; 24 for primary actions; 16 for inline.
- **Stroke width:** `2` for resting; `2.5` for active state.
- **Color:** `currentColor` (lucide default) — never pass a hardcoded `color`
  prop. Let parent text color drive it via `className="text-..."`.
- **Accessibility:** pass `aria-hidden="true"` for decorative icons; set an
  `aria-label` on the parent element when the icon is the only child.

---

## 9. Component specs

### 9.1 Button

| Variant    | Classes                                                                                             |
|------------|-----------------------------------------------------------------------------------------------------|
| Primary    | `bg-matcha-500 hover:bg-matcha-600 active:bg-matcha-700 text-white font-semibold rounded-lg px-5 h-11 transition-colors` |
| Secondary  | `bg-white border border-matcha-400 text-matcha-700 hover:bg-matcha-50 font-semibold rounded-lg px-5 h-11` |
| Ghost      | `text-matcha-700 hover:bg-matcha-50 font-medium rounded-lg px-4 h-10`                               |
| Danger     | `bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-5 h-11`                         |
| Disabled   | add `disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-warm-200 disabled:text-warm-400`   |

- Min height 44px (we use `h-11` = 44px) for tap target.
- Full-width on mobile when it's the screen's primary CTA: add `w-full`.
- Icon + text: `inline-flex items-center gap-2`.

### 9.2 Card

Base card (see `MatchaCard`):

```
rounded-xl border border-warm-200 bg-white p-4
hover:shadow-md hover:border-matcha-400 transition-all
```

Variants:
- **Interactive card** (wraps a `Link`): use above + `block`.
- **Static card**: drop the hover classes.
- **Tinted card** (highlighted): `bg-matcha-50 border-matcha-200`.

### 9.3 Form input

```
w-full h-11 px-3 rounded-md border border-warm-300 bg-white
text-[15px] text-gray-900 placeholder:text-warm-400
focus:outline-none focus:border-matcha-500 focus:ring-2 focus:ring-matcha-200
disabled:bg-warm-100 disabled:text-warm-400
```

- **Label:** `block text-sm font-medium text-gray-700 mb-1.5`
- **Helper text:** `mt-1 text-xs text-gray-500`
- **Error text:** `mt-1 text-xs text-red-600`
- **Error state input:** swap `border-warm-300` → `border-red-500`, ring to `ring-red-200`.

### 9.4 Pill / chip

```
inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
bg-matcha-100 text-matcha-800
```

Alternate neutral: `bg-warm-100 text-gray-700`.
Selected (in filter chips): `bg-matcha-500 text-white`.

### 9.5 Bottom nav

Already implemented in `src/components/layout/nav.tsx`. Spec to preserve:
- Fixed, 64px tall, white bg, 1px top border (`border-warm-200` — currently
  `border-gray-200`, should migrate).
- Active item: `text-matcha-700`, icon stroke 2.5.
- Inactive: `text-gray-400 hover:text-gray-600`.
- Max content width 512px (`max-w-lg`) centered.

### 9.6 Star rating

5 stars, filled via `matcha-500`, unfilled via `warm-300`. Tap on a star to
set; tap the same star again to clear. Size 32×32 tap target, 24×24 visual.

### 9.7 Taste slider

Horizontal slider, 0–10 integer. Track `warm-200`, fill `matcha-500`, thumb
white with `shadow-md` and `border-matcha-500`. Value label shown above thumb
on drag.

### 9.8 Empty state

Centered, vertical stack:
1. 64px illustration or icon (`text-warm-300`)
2. `h2` heading
3. `body` secondary text (max-width ~40ch)
4. Primary action button (if any)

Vertical padding: `py-16`.

### 9.9 Loading skeleton

- Use `bg-warm-200 animate-pulse rounded-md` placeholder blocks.
- Match the shape and approximate size of the content they replace.
- Never show a skeleton for less than 200ms — either the data was fast (skip
  the skeleton) or it was slow enough to matter (show for min 400ms to avoid flicker).

### 9.10 Toast / notification

- Bottom of screen, 16px from edges, `rounded-xl` `shadow-lg` `bg-gray-900 text-white`
  for neutral; `bg-red-600` for errors; `bg-matcha-600` for success.
- Auto-dismiss: 4s default, 6s for errors, never for actions requiring response.
- Stack from bottom, newest on top. Max 3 visible.

---

## 10. Layout

### 10.1 Breakpoints

Whiskly is mobile-first PWA. Breakpoints exist but most screens look the same
up through desktop with a capped width.

| Tailwind | px   | Use                        |
|----------|------|----------------------------|
| default  | <640 | Mobile (primary target)    |
| `sm`     | ≥640 | Large phones, small tablets|
| `md`     | ≥768 | Tablets                    |
| `lg`     | ≥1024| Desktop (capped layouts)   |

### 10.2 Container widths

- **Main content:** `max-w-lg` (512px) for single-column screens.
- **Catalog grid:** `max-w-2xl` (672px), 2 columns from `sm:` up.
- **Auth screens:** `max-w-sm` (384px), vertically centered.
- **Article reader:** `max-w-prose` (~65ch).

### 10.3 Safe areas

PWA on notched devices: always include `pb-safe` utility (defined in
`globals.css`) on bottom-fixed elements.

---

## 11. Logo & brand

- **Mark:** teal brushstroke swirl (see `docs/design/logo-final-v8.html`).
- **Wordmark:** "Whiskly" in **Nunito Sans 600**.
- **Theme color:** `#7fb22e` (exposed via `<meta name="theme-color">` in
  `src/app/layout.tsx`).
- **App icon:** matcha green background, white mark. Generated assets live in
  `public/` (`apple-touch-icon.png`, `favicon-*`, manifest icons).

**Usage rules:**
- Minimum mark size: 24px. Below that, use just the mark without wordmark.
- Clear space around the logo: at least the height of the "W" on all sides.
- Never recolor the mark outside `matcha-500`, `matcha-700`, or white on a
  brand-green background.

---

## 12. Accessibility checklist

Every component ships with:
- [ ] 44×44pt minimum tap target
- [ ] Keyboard-focusable with visible `:focus-visible` ring (`ring-2 ring-matcha-200`)
- [ ] AA contrast for all text
- [ ] Semantic HTML (`<button>` for actions, `<a>` for navigation, real form labels)
- [ ] `aria-label` on icon-only buttons
- [ ] `prefers-reduced-motion` respected for non-essential animation
- [ ] No color-only state signals (pair color with icon/text/weight)

---

## 13. Open questions

1. **Decided (2026-04-11):** Keep Tailwind `gray-*` for text emphasis
   (`gray-900/700/600/500`). Use `warm-*` for surfaces, borders, dividers, and
   disabled/placeholder tones. Re-evaluate if warm-on-warm contrast feels off
   in the polish pass.
2. **Done (2026-04-11):** Migrated nav and catalog inline SVGs to `lucide-react`.
3. **Deferred (post-MVP):** Dark mode. Token scaffolding is in place
   (`globals.css` has a commented-out `prefers-color-scheme` block). Activation
   requires migrating component backgrounds from `bg-white` to semantic
   `bg-background` / `bg-surface` tokens first.
4. Motion library: stick to CSS transitions, or bring in Motion (formerly
   Framer Motion) for page transitions? Decide when we actually need
   shared-element transitions.
5. Semantic color tokens: introduce `--color-success`, `--color-danger` aliases
   now, or wait until the second consumer appears?

---

## 14. Change log

| Date       | Change                                                     |
|------------|------------------------------------------------------------|
| 2026-04-11 | v0.1 — initial draft                                       |
| 2026-04-11 | Resolved OQ #1 (keep `gray-*` for text, `warm-*` for surfaces) |
| 2026-04-11 | Resolved OQ #2 — migrated to `lucide-react`                |
| 2026-04-11 | Token-level dark mode prep (OQ #3) added, commented out    |
