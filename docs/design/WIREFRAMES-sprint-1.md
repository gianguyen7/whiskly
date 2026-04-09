# Wireframes -- Sprint 1

> **Screens:** Authentication (Sign Up, Login, Forgot Password) + Matcha Catalog (Browse, Search, Detail)
> **Persona:** Alex, 27, startup professional, matcha 3-5x/week, mobile-first
> **Visual tone:** "Aesop meets a good coffee app" -- clean, warm, restrained matcha-green accent
> **Date:** 2026-04-02

---

## Design Decisions

These five layout questions were evaluated against the persona (thumb-reachable, scannable on commute) and the visual direction (clean, modern, slightly warm).

### 1. Catalog layout: Grid (2-col) vs. List (single-col cards)

**Decision: Single-column list.**

Rationale: Each MatchaCard already contains name, brand, type badge, region, and a 2-line description snippet. In a 2-column grid at 375px that content would be too compressed to scan -- Alex needs to read brand and description to decide what to tap. Single-column cards give each matcha breathing room and keep the layout consistent with the warm, editorial tone. The card width matches `max-w-lg` (512px) which is already the app's content constraint.

### 2. Search behavior: Sticky or scrolls with content?

**Decision: Sticky search bar + filter row.**

The search bar and filter chips pin to the top of the catalog viewport (below the status bar, above the scrollable card list). This keeps search always reachable -- Alex often browses, then decides to filter mid-scroll. The sticky area is compact: 44px search input + 40px filter chip row + 8px gap = 92px total, leaving plenty of card space on a 667px+ screen.

### 3. Auth page layout: Centered card or full-screen form?

**Decision: Full-screen form, vertically centered.**

No visible card container. The form floats in the middle of the off-white background (#fafaf8). This matches the existing login/signup stubs and keeps the auth flow feeling spacious and calm, not boxy. The Whiskly wordmark sits above the form as the only branding element.

### 4. Type filters on catalog: Horizontal scroll chips or dropdown?

**Decision: Horizontal scroll chips.**

There are only 5 matcha types (ceremonial, premium, culinary, latte, other) plus an "All" default. These fit in a single horizontal row at 375px without scrolling in most cases. Chips are tappable, visible at a glance, and support multi-select later if needed. A dropdown hides the options and adds a tap to reveal.

### 5. Matcha detail: Full page or bottom sheet?

**Decision: Full page.**

The detail view has enough content (hero info, 5-axis taste profile, description, two CTAs, eventually user logs) to justify a full page. A bottom sheet would feel cramped and limit future expansion. The back button / swipe-back gesture provides natural navigation. The page uses the same `max-w-lg mx-auto` container as the rest of the app.

---

## Design Tokens Reference

For implementers -- these are already defined in the codebase:

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#fafaf8` (warm off-white) | Page backgrounds |
| Foreground | `#1a1a1a` (near-black) | Body text |
| Primary accent | `#4a7c59` (matcha-500) | Buttons, links, focus rings |
| Primary hover | matcha-700 | Button hover states |
| Card border | matcha-200 | Default card borders |
| Card border hover | matcha-400 | Hover card borders |
| Border radius | `rounded-xl` (11px) | Cards, buttons, inputs |
| Font | Geist Sans | All text |
| Badge bg | matcha-100 | Type badges |
| Badge text | matcha-800 | Type badge labels |

---

## Screen 1: Sign Up (`/signup`)

### Wireframe

```
+---------------------------------------+
|  status bar                     9:41  |
+---------------------------------------+
|                                       |
|                                       |
|                                       |
|            [ leaf icon ]              |
|              whiskly                  |
|                                       |
|   Start your matcha journey           |
|                                       |
|   Display Name                        |
|   +-------------------------------+   |
|   | Your name                     |   |
|   +-------------------------------+   |
|                                       |
|   Email                               |
|   +-------------------------------+   |
|   | you@example.com               |   |
|   +-------------------------------+   |
|                                       |
|   Password                            |
|   +-------------------------------+   |
|   | Create a password         [o] |   |
|   +-------------------------------+   |
|   Must be at least 8 characters       |
|                                       |
|   +-------------------------------+   |
|   |       Create Account          |   |
|   +-------------------------------+   |
|                                       |
|   Already have an account? Sign in    |
|                                       |
|                                       |
+---------------------------------------+
```

### Content Hierarchy & Spacing

1. **Wordmark area** -- `pt-safe` + centered, `text-2xl font-bold text-matcha-700`
2. **Subtitle** -- `text-sm text-gray-500`, 4px below wordmark
3. **Form fields** -- `space-y-4`, each field: label (14px semibold) + input (44px height, `rounded-xl`)
4. **Password hint** -- `text-xs text-gray-400`, directly below password input
5. **Submit button** -- `py-3 rounded-xl bg-matcha-600 text-white font-medium`, full width
6. **Footer link** -- `text-sm text-gray-500` with `text-matcha-600 font-medium` for "Sign in"
7. **Overall container** -- `max-w-sm mx-auto p-6`, vertically centered with `min-h-screen flex items-center`

### States

**Default:**
- All fields empty, button enabled (validates on submit)
- Password toggle icon shows eye-closed (password hidden)

**Validation errors (inline, shown on blur or submit):**
- Display Name empty: "Please enter your name"
- Email invalid format: "Please enter a valid email address"
- Email already registered: "An account with this email already exists"
- Password too short: "Password must be at least 8 characters"
- Error text: `text-xs text-red-500`, appears below the relevant input
- Error input border: `border-red-400 focus:ring-red-500`

**Loading (after submit):**
- Button text changes to "Creating account..." with a spinner
- Button becomes disabled (`opacity-60 cursor-not-allowed`)
- All inputs become disabled

**Server error:**
- Toast/banner at top of form: "Something went wrong. Please try again."
- `bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3`

### UX Copy

| Element | Copy |
|---------|------|
| Wordmark | whiskly |
| Heading | Start your matcha journey |
| Display Name label | Display Name |
| Display Name placeholder | Your name |
| Email label | Email |
| Email placeholder | you@example.com |
| Password label | Password |
| Password placeholder | Create a password |
| Password hint | Must be at least 8 characters |
| Submit button | Create Account |
| Submit button (loading) | Creating account... |
| Footer | Already have an account? **Sign in** |
| Error: name empty | Please enter your name |
| Error: email format | Please enter a valid email address |
| Error: email taken | An account with this email already exists |
| Error: password short | Password must be at least 8 characters |
| Error: server | Something went wrong. Please try again. |

### Interaction Notes

- **Password toggle:** Tap eye icon to reveal/hide password. Icon toggles between eye-open and eye-closed.
- **Validation:** Validate on blur for each field. Re-validate on submit. Show first error per field only.
- **Submit:** POST to Supabase Auth `signUp`. On success, redirect to `/catalog`. Profile is auto-created by DB trigger.
- **"Sign in" link:** Navigates to `/login`. Use Next.js `<Link>` for client-side transition.
- **Keyboard:** "Next" button on mobile keyboard advances to next field. "Go" on password field submits form.

### Accessibility Notes

- Focus order: Display Name -> Email -> Password -> Toggle visibility -> Create Account -> Sign in link
- All inputs have associated `<label>` elements (already in existing stub)
- Password toggle button: `aria-label="Show password"` / `aria-label="Hide password"`
- Error messages linked to inputs via `aria-describedby`
- Submit button: `aria-busy="true"` during loading
- Color contrast: matcha-700 on off-white passes WCAG AA (4.9:1)
- Error red-500 on white passes AA (4.6:1)

---

## Screen 2: Login (`/login`)

### Wireframe

```
+---------------------------------------+
|  status bar                     9:41  |
+---------------------------------------+
|                                       |
|                                       |
|                                       |
|            [ leaf icon ]              |
|              whiskly                  |
|                                       |
|         Welcome back                  |
|                                       |
|   Email                               |
|   +-------------------------------+   |
|   | you@example.com               |   |
|   +-------------------------------+   |
|                                       |
|   Password                            |
|   +-------------------------------+   |
|   | Your password             [o] |   |
|   +-------------------------------+   |
|                                       |
|                    Forgot password?    |
|                                       |
|   +-------------------------------+   |
|   |          Sign In              |   |
|   +-------------------------------+   |
|                                       |
|   Don't have an account? Sign up      |
|                                       |
|                                       |
+---------------------------------------+
```

### Content Hierarchy & Spacing

Same container and spacing as Sign Up. Two fewer fields (no display name, no password hint). "Forgot password?" link is right-aligned below the password field, `text-sm text-matcha-600`.

### States

**Default:**
- Fields empty, button enabled

**Validation errors (on submit):**
- Email empty: "Please enter your email address"
- Password empty: "Please enter your password"

**Invalid credentials (from server):**
- Banner above form: "Invalid email or password. Please try again."
- `bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3`
- Both fields remain filled (do not clear password -- user may have a typo in email)

**Loading:**
- Button: "Signing in..." with spinner, disabled
- Inputs disabled

**Rate limited:**
- Banner: "Too many attempts. Please wait a moment and try again."

### UX Copy

| Element | Copy |
|---------|------|
| Heading | Welcome back |
| Email label | Email |
| Email placeholder | you@example.com |
| Password label | Password |
| Password placeholder | Your password |
| Forgot link | Forgot password? |
| Submit button | Sign In |
| Submit button (loading) | Signing in... |
| Footer | Don't have an account? **Sign up** |
| Error: empty email | Please enter your email address |
| Error: empty password | Please enter your password |
| Error: invalid creds | Invalid email or password. Please try again. |
| Error: rate limit | Too many attempts. Please wait a moment and try again. |

### Interaction Notes

- **Submit:** POST to Supabase Auth `signInWithPassword`. On success, redirect to the previously requested page (stored in URL `?redirect=` param) or `/catalog` as default.
- **"Forgot password?":** Navigates to `/forgot-password`.
- **"Sign up" link:** Navigates to `/signup`.
- **Keyboard:** "Next" from email to password. "Go" on password submits.

### Accessibility Notes

- Focus order: Email -> Password -> Toggle visibility -> Forgot password? -> Sign In -> Sign up link
- Error banner: `role="alert"` so screen readers announce it immediately
- Same contrast and labeling rules as Sign Up

---

## Screen 3: Forgot Password (`/forgot-password`)

### Wireframe -- Default State

```
+---------------------------------------+
|  status bar                     9:41  |
+---------------------------------------+
|                                       |
|  < Back                               |
|                                       |
|                                       |
|            [ leaf icon ]              |
|              whiskly                  |
|                                       |
|         Reset your password           |
|                                       |
|   Enter the email address you used    |
|   to create your account and we'll    |
|   send you a link to reset your       |
|   password.                           |
|                                       |
|   Email                               |
|   +-------------------------------+   |
|   | you@example.com               |   |
|   +-------------------------------+   |
|                                       |
|   +-------------------------------+   |
|   |      Send Reset Link          |   |
|   +-------------------------------+   |
|                                       |
|                                       |
+---------------------------------------+
```

### Wireframe -- Confirmation State

```
+---------------------------------------+
|  status bar                     9:41  |
+---------------------------------------+
|                                       |
|  < Back                               |
|                                       |
|                                       |
|            [ mail icon ]              |
|                                       |
|         Check your email              |
|                                       |
|   If an account exists for            |
|   alex@example.com, we've sent a      |
|   password reset link. Check your     |
|   inbox and spam folder.              |
|                                       |
|   +-------------------------------+   |
|   |      Back to Sign In          |   |
|   +-------------------------------+   |
|                                       |
|   Didn't receive it? Resend           |
|                                       |
|                                       |
+---------------------------------------+
```

### Content Hierarchy & Spacing

- **Back button** -- top-left, `text-sm text-gray-500`, `< Back` with chevron icon. Navigates to `/login`.
- **Icon** -- centered, 32px, matcha-600 stroke
- **Heading** -- `text-xl font-bold text-matcha-700`, centered
- **Body text** -- `text-sm text-gray-500 text-center`, max-w-xs, 8px below heading
- **Email input** -- same styling as auth forms
- **Submit button** -- same as auth forms
- **Confirmation state** replaces the form entirely (no page navigation, in-place swap)

### States

**Default:**
- Email field empty, button enabled

**Validation:**
- Empty email: "Please enter your email address"
- Invalid format: "Please enter a valid email address"

**Loading:**
- Button: "Sending..." with spinner, disabled

**Confirmation (always shown after successful submit):**
- Same message regardless of whether the email exists in the system (security: prevents email enumeration)
- Shows the entered email address in the confirmation text
- "Resend" link: re-triggers the reset. After tap, changes to "Sent!" for 3 seconds, then back to "Resend"

**Server error:**
- Banner: "Something went wrong. Please try again."

### UX Copy

| Element | Copy |
|---------|------|
| Back link | Back |
| Heading | Reset your password |
| Body | Enter the email address you used to create your account and we'll send you a link to reset your password. |
| Email label | Email |
| Email placeholder | you@example.com |
| Submit button | Send Reset Link |
| Submit button (loading) | Sending... |
| Confirmation heading | Check your email |
| Confirmation body | If an account exists for {email}, we've sent a password reset link. Check your inbox and spam folder. |
| Confirmation CTA | Back to Sign In |
| Resend link | Didn't receive it? **Resend** |
| Resend feedback | Sent! |
| Error: empty | Please enter your email address |
| Error: format | Please enter a valid email address |
| Error: server | Something went wrong. Please try again. |

### Interaction Notes

- **"Back" link:** Returns to `/login` (or browser back).
- **Submit:** Calls Supabase Auth `resetPasswordForEmail`. Always transitions to confirmation state.
- **"Back to Sign In":** Navigates to `/login`.
- **"Resend":** Calls the reset API again. Brief "Sent!" feedback, then reverts. Debounce: ignore taps within 30 seconds of last send.
- **Security:** The confirmation message is deliberately identical whether the email exists or not.

### Accessibility Notes

- Focus order: Back -> Email -> Send Reset Link
- Confirmation state: heading gets focus on transition (`tabIndex={-1}`, `ref.focus()`) so screen readers announce the state change
- "Resend" link: `aria-live="polite"` region wraps the "Sent!" feedback
- Back link: `aria-label="Go back to sign in"`

---

## Screen 4: Catalog Browse (`/catalog`)

### Wireframe -- Default State (with data)

```
+---------------------------------------+
|  status bar                     9:41  |
+---------------------------------------+
|                                       |
|   Catalog                             |
|                                       |
|   +-------------------------------+   |
|   | [Q] Search matcha...          |   |
|   +-------------------------------+   |
|                                       |
|   [All] [Ceremonial] [Premium]  -->   |
|                                       |
|   +-------------------------------+   |
|   | Ippodo Ummon-no-mukashi       |   |
|   | Ippodo         [Ceremonial]   |   |
|   | Uji, Kyoto                    |   |
|   | Rich umami with a smooth,     |   |
|   | creamy finish that...          |   |
|   +-------------------------------+   |
|                                       |
|   +-------------------------------+   |
|   | Kettl Shinme                   |   |
|   | Kettl            [Ceremonial] |   |
|   | Shizuoka                      |   |
|   | Vibrant grassiness balanced    |   |
|   | by natural sweetness...        |   |
|   +-------------------------------+   |
|                                       |
|   +-------------------------------+   |
|   | Sazen Tenshi                   |   |
|   | Sazen               [Premium] |   |
|   | Uji, Kyoto                    |   |
|   | Approachable everyday matcha   |   |
|   | with mild umami...             |   |
|   +-------------------------------+   |
|                                       |
|   +-------------------------------+   |
|   | ...more cards...               |   |
|   +-------------------------------+   |
|                                       |
|          Showing 10 of 47             |
|                                       |
|   +-------------------------------+   |
|   |         Load More             |   |
|   +-------------------------------+   |
|                                       |
|              (pb-20 spacer)           |
+---------------------------------------+
|  [Catalog]  [Log]  [Profile] [Disc.]  |
+---------------------------------------+
```

### Content Hierarchy & Spacing

1. **Page title** -- `text-2xl font-bold text-matcha-700`, `pt-4 px-4`
2. **Search bar** -- sticky container starts here. `mt-3`. Input: 44px height, `rounded-xl`, matcha-200 border, search icon (magnifier) left-inset, `pl-10`. Background: white.
3. **Filter chips** -- `mt-2 pb-2` in the sticky container. Horizontal scroll (`overflow-x-auto`, hide scrollbar). Each chip: `px-3 py-1.5 text-sm rounded-full`. Active chip: `bg-matcha-600 text-white`. Inactive: `bg-gray-100 text-gray-600`. "All" is default-selected.
4. **Sticky bar total height** -- search (44px) + gap (8px) + chips (32px) + padding (16px top/bottom) = ~108px. Pinned below status bar with `sticky top-0 z-10 bg-[#fafaf8]` and a subtle bottom shadow on scroll.
5. **Card list** -- `space-y-3 px-4 pt-3`. Uses existing `MatchaCard` component.
6. **Load more** -- `text-sm text-gray-500` count + ghost button (`border border-matcha-300 text-matcha-700`). Centered, `mt-4`.
7. **Bottom padding** -- `pb-20` for nav clearance + `pb-safe`.

### States

**Default (with data):**
- "All" chip active, cards loaded from server, "Load More" at bottom
- Page count: "Showing {loaded} of {total}"

**Loading (initial page load):**
- Search bar and chips render immediately (static)
- Card area shows 3 skeleton cards: rounded-xl rectangles with pulsing `animate-pulse bg-gray-200` blocks for title, subtitle, badge, and description lines
- No "Load More" button during initial load

**Loading (load more):**
- Existing cards remain visible
- "Load More" button text changes to "Loading..." with spinner
- 3 new skeleton cards appear below existing cards

**Empty catalog (no matcha data at all):**
- Search bar and chips still visible
- Center of card area:
  - Leaf icon (matcha-300, 48px)
  - "No matcha yet"
  - "The catalog is being prepared. Check back soon."
  - `text-gray-400 text-sm text-center`

**Filtered -- no results for selected type:**
- Search bar and chips visible, active chip highlighted
- Center of card area:
  - "No {type} matcha found"
  - "Try a different category or browse all matcha."
  - Text link: "View all" (resets filter to "All")

**Error (network/server):**
- Banner below sticky bar: "Couldn't load the catalog. Pull down to retry."
- `bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mx-4`
- Pull-to-refresh gesture triggers reload (or a "Retry" button as fallback)

### UX Copy

| Element | Copy |
|---------|------|
| Page title | Catalog |
| Search placeholder | Search matcha... |
| Filter chips | All, Ceremonial, Premium, Culinary, Latte, Other |
| Load more count | Showing {n} of {total} |
| Load more button | Load More |
| Load more (loading) | Loading... |
| Empty state heading | No matcha yet |
| Empty state body | The catalog is being prepared. Check back soon. |
| Filtered empty heading | No {type} matcha found |
| Filtered empty body | Try a different category or browse all matcha. |
| Filtered empty link | View all |
| Error banner | Couldn't load the catalog. Pull down to retry. |

### Interaction Notes

- **Search input tap:** Focuses the input, opens keyboard. See Screen 5 for search-active behavior.
- **Filter chip tap:** Toggles category filter. Only one active at a time (radio behavior). "All" clears the filter. Resets to page 1. Results animate in with a subtle fade.
- **Card tap:** Navigates to `/catalog/{id}`. Uses Next.js `<Link>` for prefetching.
- **Load More:** Fetches next page (10 cards per page). Appends to existing list. Button disappears when all loaded.
- **Scroll:** Cards scroll freely under the sticky search/filter bar.
- **Pull to refresh:** On mobile, pull-down gesture reloads the catalog from page 1.

### Accessibility Notes

- Page title: `<h1>` element
- Search input: `role="searchbox"`, `aria-label="Search matcha catalog"`
- Filter chips: wrapped in `role="radiogroup"` with `aria-label="Filter by type"`. Each chip: `role="radio"`, `aria-checked="true/false"`
- Card list: `<ul>` with `role="list"`, each card is `<li>`
- Load More button: `aria-label="Load more matcha"`, `aria-busy="true"` during loading
- Skeleton cards: `aria-hidden="true"`, with `aria-live="polite"` region wrapping the card list for announcing when cards load
- Focus order: Search -> Filter chips (left to right) -> First card -> ... -> Load More

---

## Screen 5: Catalog Search (active state, same `/catalog` page)

### Wireframe -- Search Active with Results

```
+---------------------------------------+
|  status bar                     9:41  |
+---------------------------------------+
|                                       |
|   Catalog                             |
|                                       |
|   +-------------------------------+   |
|   | [Q] ippodo             [ X ]  |   |
|   +-------------------------------+   |
|                                       |
|   [All] [Ceremonial] [Premium]  -->   |
|                                       |
|   3 results                           |
|                                       |
|   +-------------------------------+   |
|   | Ippodo Ummon-no-mukashi       |   |
|   | Ippodo         [Ceremonial]   |   |
|   | Uji, Kyoto                    |   |
|   | Rich umami with a smooth...    |   |
|   +-------------------------------+   |
|                                       |
|   +-------------------------------+   |
|   | Ippodo Sayaka                  |   |
|   | Ippodo            [Premium]   |   |
|   | Uji, Kyoto                    |   |
|   | Bright and refreshing with...  |   |
|   +-------------------------------+   |
|                                       |
|   +-------------------------------+   |
|   | Ippodo Horai                   |   |
|   | Ippodo         [Ceremonial]   |   |
|   | Uji, Kyoto                    |   |
|   | The pinnacle of Ippodo's...    |   |
|   +-------------------------------+   |
|                                       |
|              (pb-20 spacer)           |
+---------------------------------------+
|  [Catalog]  [Log]  [Profile] [Disc.]  |
+---------------------------------------+
```

### Wireframe -- No Search Results

```
+---------------------------------------+
|  status bar                     9:41  |
+---------------------------------------+
|                                       |
|   Catalog                             |
|                                       |
|   +-------------------------------+   |
|   | [Q] jade leaf            [ X ]|   |
|   +-------------------------------+   |
|                                       |
|   [All] [Ceremonial] [Premium]  -->   |
|                                       |
|                                       |
|                                       |
|           [ search icon ]             |
|                                       |
|       No results for "jade leaf"      |
|                                       |
|     Try a different search term       |
|     or check the spelling.            |
|                                       |
|                                       |
|                                       |
+---------------------------------------+
|  [Catalog]  [Log]  [Profile] [Disc.]  |
+---------------------------------------+
```

### States

**Search active with results:**
- Clear button (X) appears in search input when text is present
- Result count shown above cards: "{n} results" (`text-sm text-gray-400`)
- Cards filter in real-time (debounced 300ms)
- Filter chips still functional -- search + type filter combine (AND logic)

**Search active, no results:**
- Search icon (magnifier, matcha-300, 40px) centered
- "No results for "{query}""  -- `text-base font-medium text-gray-700`
- "Try a different search term or check the spelling." -- `text-sm text-gray-400`

**Search active, typing (debounce in progress):**
- Cards from previous state remain visible (no flicker)
- No loading indicator for sub-300ms debounce
- If search takes >500ms, show subtle skeleton overlay on existing cards

### UX Copy

| Element | Copy |
|---------|------|
| Result count | {n} results |
| Result count (1) | 1 result |
| No results heading | No results for "{query}" |
| No results body | Try a different search term or check the spelling. |

### Interaction Notes

- **Search input:** Searches across matcha `name`, `brand`, and `region` fields. Case-insensitive. Client-side filtering for initial catalog size (<200 items). If catalog grows, switch to server-side search with Supabase `ilike` or full-text search.
- **Clear button (X):** Clears search text, resets to full catalog, keeps current type filter.
- **Debounce:** 300ms after last keystroke before filtering. Prevents jank during typing.
- **Filter + search combination:** Filters stack. "ippodo" + "Ceremonial" chip shows only Ippodo ceremonial matcha.
- **URL state:** Search query syncs to URL param `?q=ippodo` so the state is shareable/bookmarkable. Type filter syncs as `?type=ceremonial`.
- **Keyboard dismiss:** Tapping a card or scrolling the list dismisses the keyboard on mobile.

### Accessibility Notes

- Clear button: `aria-label="Clear search"`
- Result count: `aria-live="polite"` so screen readers announce "{n} results" as it changes
- No results state: same live region announces the no-results message
- Search + filter state described by: `aria-label="Search matcha catalog, filtered by {type}"`

---

## Screen 6: Matcha Detail (`/catalog/[id]`)

### Wireframe

```
+---------------------------------------+
|  status bar                     9:41  |
+---------------------------------------+
|                                       |
|  < Catalog                            |
|                                       |
|  Ippodo Ummon-no-mukashi              |
|  Ippodo                               |
|  Uji, Kyoto  [Ceremonial]            |
|                                       |
|  ---------------------------------    |
|                                       |
|  Taste Profile                        |
|                                       |
|  Umami      ====-------  4.2         |
|  Sweetness  ===--------  3.5         |
|  Bitterness ===---------  2.8        |
|  Grassiness ===--------  3.1         |
|  Creaminess ====-------  4.0         |
|                                       |
|  ---------------------------------    |
|                                       |
|  About                                |
|                                       |
|  Rich umami with a smooth, creamy     |
|  finish that lingers. One of          |
|  Ippodo's finest ceremonial grade     |
|  matchas, sourced from Uji. Ideal     |
|  for traditional preparation          |
|  (usucha or koicha).                  |
|                                       |
|  ---------------------------------    |
|                                       |
|   +-------------------------------+   |
|   |      Log This Matcha          |   |
|   +-------------------------------+   |
|                                       |
|   +-------------------------------+   |
|   |    Compare to My Profile      |   |
|   +-------------------------------+   |
|   Coming in a future update           |
|                                       |
|              (pb-20 spacer)           |
+---------------------------------------+
|  [Catalog]  [Log]  [Profile] [Disc.]  |
+---------------------------------------+
```

### Content Hierarchy & Spacing

1. **Back link** -- `pt-4 px-4`. `< Catalog` with left chevron, `text-sm text-matcha-600 font-medium`. Tappable hit area: 44px tall.
2. **Hero section** -- `px-4 mt-4 space-y-1`
   - Name: `text-2xl font-bold text-gray-900`
   - Brand: `text-base text-gray-500`
   - Region + Type badge row: `flex items-center gap-2 mt-1`. Region: `text-sm text-gray-400`. Badge: same as MatchaCard (`text-xs px-2 py-1 rounded-full bg-matcha-100 text-matcha-800`).
3. **Divider** -- `border-t border-gray-100 mx-4 my-5`
4. **Taste Profile section** -- `px-4`
   - Section heading: `text-base font-semibold text-gray-900 mb-3`
   - Each dimension: horizontal bar layout. Label (`text-sm text-gray-600 w-24`), bar (`h-2 rounded-full bg-matcha-100` track with `bg-matcha-500` fill, width = value/5 * 100%), value (`text-sm font-medium text-gray-700 w-8 text-right`). Rows: `space-y-3`.
   - Bar fill color intensity could vary: values 1-2 = matcha-300, 3 = matcha-400, 4-5 = matcha-600. Provides visual weight.
5. **Divider**
6. **About section** -- `px-4`
   - Heading: `text-base font-semibold text-gray-900 mb-2`
   - Body: `text-sm text-gray-600 leading-relaxed`
7. **Divider**
8. **CTA area** -- `px-4 mt-2 space-y-3`
   - Primary: "Log This Matcha" -- `py-3 rounded-xl bg-matcha-600 text-white font-medium w-full`
   - Secondary: "Compare to My Profile" -- `py-3 rounded-xl border border-matcha-300 text-matcha-700 font-medium w-full opacity-50 cursor-not-allowed`
   - Sprint 2 note: `text-xs text-gray-400 text-center mt-1` -- "Coming in a future update"
9. **Bottom padding** -- `pb-20` + `pb-safe`

### States

**Default (loaded):**
- Full content displayed as shown in wireframe
- "Compare to My Profile" button is visually disabled (Sprint 2)

**Loading:**
- Back link renders immediately
- Hero section: skeleton blocks for name (60% width), brand (40%), region+badge (50%)
- Taste profile: 5 skeleton bars, label placeholder + empty track
- About: 3 skeleton text lines
- CTAs: skeleton buttons
- All skeletons: `animate-pulse bg-gray-200 rounded`

**Matcha not found (invalid ID):**
- Back link visible
- Center of page:
  - Leaf icon (matcha-300, 48px)
  - "Matcha not found"
  - "This matcha may have been removed or the link is incorrect."
  - Ghost button: "Back to Catalog"

**No taste data (null values for all 5 dimensions):**
- Taste Profile section shows:
  - "No taste data yet"
  - "Be the first to log this matcha and contribute taste notes."
  - `text-sm text-gray-400`

**Error (network/server):**
- Banner below back link: "Couldn't load this matcha. Please try again."
- "Try again" link reloads the page

### UX Copy

| Element | Copy |
|---------|------|
| Back link | Catalog |
| Taste section heading | Taste Profile |
| Taste dimensions | Umami, Sweetness, Bitterness, Grassiness, Creaminess |
| About heading | About |
| Primary CTA | Log This Matcha |
| Secondary CTA | Compare to My Profile |
| Sprint 2 note | Coming in a future update |
| Not found heading | Matcha not found |
| Not found body | This matcha may have been removed or the link is incorrect. |
| Not found CTA | Back to Catalog |
| No taste data heading | No taste data yet |
| No taste data body | Be the first to log this matcha and contribute taste notes. |
| Error banner | Couldn't load this matcha. Please try again. |

### Interaction Notes

- **Back link:** Navigates to `/catalog`, preserving previous scroll position and search/filter state (via URL params). Alternatively, browser back gesture works.
- **"Log This Matcha":** Navigates to `/log/new?matcha={id}`. Pre-fills the matcha selection in the log form.
- **"Compare to My Profile":** Disabled for Sprint 1. Button present but `disabled`, `opacity-50`. Tapping shows no response. In Sprint 2, this will overlay the matcha's taste profile with the user's aggregated profile.
- **Taste bars:** Static display only (not interactive). The bars use CSS transitions so they animate in on load.
- **Scroll:** Full page scroll. No sticky elements on this page (back link scrolls away).

### Accessibility Notes

- Back link: `aria-label="Back to Catalog"`
- Page: `<h1>` is the matcha name
- Taste profile bars: each has `role="meter"`, `aria-valuenow={value}`, `aria-valuemin={1}`, `aria-valuemax={5}`, `aria-label="{dimension} rating"`
- Disabled CTA: `aria-disabled="true"`, `aria-label="Compare to My Profile, available in a future update"`
- Focus order: Back link -> Log This Matcha -> Compare to My Profile (skip disabled on Tab? No -- keep in tab order for discoverability but announce disabled state)
- Loading skeletons: `aria-hidden="true"`, live region announces "Matcha details loaded" when content renders

---

## Navigation & Transition Summary

```
                     +---> /forgot-password --+
                     |      (sends email)     |
                     |                        v
/signup ----------> /login <-----------------+
  |                  |
  | (on success)     | (on success)
  v                  v
/catalog <------- (redirect target or /catalog)
  |
  | (tap card)
  v
/catalog/[id]
  |
  | (tap "Log This Matcha")
  v
/log/new?matcha={id}   (Sprint 2+)
```

**Transitions:**
- Auth pages: simple fade or instant (no complex animation)
- Catalog -> Detail: standard Next.js page transition (instant with prefetch)
- Detail -> Catalog: back preserves scroll position
- All navigation uses `<Link>` for client-side routing except form submissions

---

## Responsive Behavior

These wireframes target 375px (iPhone SE/13 mini). Wider viewports:

| Breakpoint | Behavior |
|------------|----------|
| < 640px (mobile) | Single-column, full-width cards, sticky search bar |
| 640-1024px (tablet) | Same layout, `max-w-lg` (512px) centered. More whitespace. |
| > 1024px (desktop) | Same layout, `max-w-lg` centered. Consider 2-col card grid at this width only. Bottom nav moves to sidebar (future consideration). |

The `max-w-lg mx-auto` container used throughout the app ensures consistent content width. No layout changes needed for Sprint 1 -- the single-column design works across all breakpoints within the container.

---

## Component Inventory (Sprint 1)

Existing components that will be used or extended:

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| `MatchaCard` | `src/components/ui/matcha-card.tsx` | Exists | Use as-is for catalog list |
| `TasteSlider` | `src/components/ui/taste-slider.tsx` | Exists | Used in log form, not detail page |
| `RadarChart` | `src/components/ui/radar-chart.tsx` | Exists | Not used in Sprint 1 (horizontal bars instead for detail) |
| `StarRating` | `src/components/ui/star-rating.tsx` | Exists | Not used in Sprint 1 |
| `Nav` | `src/components/layout/nav.tsx` | Exists | Used on all (main) pages |

New components needed:

| Component | Purpose |
|-----------|---------|
| `SearchInput` | Reusable search field with icon, clear button, debounce |
| `FilterChips` | Horizontal scrolling radio-chip group |
| `TasteBar` | Horizontal bar visualization for a single taste dimension |
| `TasteProfileBars` | Wrapper rendering 5 TasteBar components from a TasteProfile |
| `SkeletonCard` | Pulsing placeholder matching MatchaCard dimensions |
| `SkeletonBars` | Pulsing placeholder matching TasteProfileBars dimensions |
| `AuthForm` | Shared form wrapper for login/signup (heading, footer link) |
| `FormInput` | Styled input with label, error state, aria bindings |
| `PasswordInput` | FormInput with visibility toggle |
| `EmptyState` | Reusable icon + heading + body + optional CTA layout |
| `ErrorBanner` | Red alert banner with icon and message |
