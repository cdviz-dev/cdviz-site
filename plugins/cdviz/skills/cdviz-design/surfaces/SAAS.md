# CDviz SaaS UI — Surface-Specific Design Rules

Supplements the root `DESIGN.md`. These rules apply exclusively to the SaaS product UI (`cdviz-webapp-ui`, Dioxus + DaisyUI). Where this document conflicts with `DESIGN.md`, this document wins for the SaaS surface.

**Register:** Product (design serves the product, not the other way around).

**Theme:** `cdviz-night` (default) / `cdviz-day` from `daisyui-theme.css`.

---

## 1. Layout

- **Primary nav:** left sidebar on desktop (width: 240px), collapsible to icon-only (48px). Bottom tab bar on mobile (≤768px), max 5 items.
- **Content max-width:** 1280px, side gutters `--space-lg` (≈33px).
- **Sidebar background:** `bg-base-200`. Content area: `bg-base-100`.
- **Dashboard density:** one spacing step tighter than marketing. Use `--space-sm` (12.6px) for internal component padding vs `--space-md` on marketing.
- **Page title:** one H1 per page, `cdviz-h3` size (not full hero size), `text-base-content` (not orange — orange H2 is a marketing convention).

---

## 2. Component Patterns

### Data Tables

- Header row: `bg-base-200`, sticky at top with `backdrop-blur-sm bg-base-200/90`
- Body rows: alternate `bg-base-100` / `bg-base-200/40`, `border-b border-base-300`
- Row hover: `bg-base-200/60`
- Column header text: Inter 600, 13px, `text-base-content/70`, uppercase, `letter-spacing: 0.05em`
- Cell text: Inter 400, 14px, `text-base-content`
- Numeric cells: JetBrains Mono 400, right-aligned
- Sortable headers: Lucide `chevrons-up-down` (unsorted), `chevron-up`/`chevron-down` (sorted), 14px icon
- Empty state: full-width message (see Empty States section below)
- No zebra striping on dense tables (>8 columns) — use `border-b` separation only

### Forms

- Label: Inter 500, 14px, `text-base-content`, always above the field (never placeholder-as-label)
- Input: `input input-bordered w-full`
- Select: `select select-bordered w-full`
- Error state: `input-error`, plus `<p class="text-error text-xs mt-1">message</p>` below the field. Never use color alone to convey error.
- Help text: Inter 400, 13px, `text-base-content/60`, below the field
- Required indicator: `<span class="text-error ml-0.5">*</span>` after label text
- Field groups: `--space-sm` gap between fields
- Form sections: `--space-lg` gap, section heading in `cdviz-h3`
- Submit button: always `btn btn-primary`, right-aligned or full-width on mobile

### Buttons (product context)

- `btn btn-primary` → orange fill, use for the single primary action per screen
- `btn btn-secondary` → purple fill, secondary actions
- `btn btn-ghost` → no fill, tertiary / destructive confirmation
- `btn btn-error` → destructive actions (delete, revoke)
- Min height: 36px in dense product UI (relaxed from marketing 44px for information-dense contexts). Touch contexts remain 44px.
- Loading state: `btn loading` (DaisyUI) with spinner — no text change

### Cards (product context)

- `card bg-base-200 border border-base-300` — resting state
- No `.card-cdviz` hover lift (`scale(1.02)`) in dense data contexts (tables, lists, dashboards)
- Interactive cards (clickable to navigate): `hover:border-primary/40 hover:bg-base-200/80 cursor-pointer`, 160ms `--ease-ui` — no scale
- Stat/metric cards: value in JetBrains Mono 700, `--type-headline-md`; label in Inter 400, 13px, `text-base-content/60`

### Empty States

Structure (centered vertically and horizontally in container):

1. Lucide icon: 32px, `text-base-content/30`
2. Heading: `cdviz-h3` size, `text-base-content`
3. Body: `cdviz-body-sm`, `text-base-content/60`, max 60ch
4. CTA: one `btn btn-primary`, optional secondary `btn btn-ghost`

Copy pattern: state what's absent, then what to do. "No tenants yet. Create your first tenant to get started."

### Loading States

- **Content areas (page load, initial fetch):** skeleton shimmer — `bg-base-300 rounded animate-pulse`, match the shape of actual content
- **Button actions (async submit, mutation):** `btn loading` spinner inside button — do not disable adjacent UI
- **Inline data refresh:** subtle `loading loading-spinner loading-xs text-primary` in the corner of the refreshing region
- **Full-page blocking operations:** `modal` overlay with centered `loading loading-spinner loading-lg text-primary`
- Never show a spinner for operations under 200ms (use optimistic UI instead)

### Toasts / Notifications

- Position: bottom-right, stacked, newest on top
- Max visible: 5 (oldest auto-dismiss at 4s)
- Structure: `bg-base-200 border border-base-300 rounded-lg shadow-lg`, `--space-sm` padding
- Types mirror state tokens: success (`border-success/40`), error (`border-error/40`), info (`border-info/40`), neutral (default)
- Icon: 16px Lucide matching type, left of message
- Dismiss: swipe-right or × button (`btn btn-ghost btn-xs`)
- No title — one short sentence max

### Modals & Dialogs

- `transform-origin: center` — modals are NOT origin-aware (they're not anchored to a trigger)
- Enter: `scale(0.95) opacity(0)` → `scale(1) opacity(1)`, 200ms `--ease-ui`
- Exit: `scale(0.95) opacity(0)`, 150ms `--ease-ui` (faster exit than enter)
- Backdrop: `bg-black/50 backdrop-blur-sm`
- Max width: 480px (small), 640px (medium), 800px (large). Never full viewport width on desktop.
- One primary action button, one cancel/ghost button. Destructive action uses `btn-error`.
- Avoid modals for: displaying information only (use inline), multi-step flows >3 steps (use a dedicated page), confirmation of low-risk actions (use inline undo).

### Navigation

- **Sidebar active item:** `text-primary bg-primary/10 rounded-lg` — full background tint, not a side stripe
- **Sidebar inactive item:** `text-base-content/70 hover:text-base-content hover:bg-base-200`
- **Breadcrumbs:** Inter 14px, `text-base-content/50`, separator `›` in `text-base-content/30`. Active (last) item: `text-base-content`
- **Tabs:** DaisyUI `tabs tabs-bordered`. Active: `tab-active text-primary`. Do not use `tabs-lifted` in product UI.
- **Pagination:** `join` of `btn btn-sm`, current page `btn-active btn-primary`

---

## 3. Motion in Product UI

| Element                | Duration      | Easing          |
| ---------------------- | ------------- | --------------- |
| Button hover / press   | 100–160ms     | `--ease-ui`     |
| Dropdown / select open | 150–200ms     | `--ease-ui`     |
| Tooltip appear         | 125ms         | `--ease-ui`     |
| Modal enter            | 200ms         | `--ease-ui`     |
| Modal exit             | 150ms         | `--ease-ui`     |
| Drawer / sheet enter   | 250ms         | `--ease-drawer` |
| Skeleton pulse         | 1.5s infinite | ease-in-out     |
| Sidebar collapse       | 200ms         | `--ease-ui`     |

- **Never animate keyboard-initiated actions** (keyboard shortcuts, command palette).
- Stagger navigation items on first load: 30ms between items, 3–6 items max.
- After first load, no stagger — it becomes annoying on revisit.

---

## 4. Forbidden in SaaS UI

These patterns are marketing-only. Do not use them inside the product interface:

| Pattern                                    | Why forbidden                                                 | Alternative                                         |
| ------------------------------------------ | ------------------------------------------------------------- | --------------------------------------------------- |
| `.text-brand-gradient` / gradient text     | Seen constantly; decorative noise at product frequency        | `text-primary` for emphasis                         |
| `.animate-float` / `.animate-glow`         | Decorative motion; distracting in product context             | Static icons                                        |
| `.bg-data-grid`                            | Marketing identity motif, incongruous in UI                   | `bg-base-100` or `bg-base-200`                      |
| Orange H2 headings                         | Marketing section-starter convention                          | `text-base-content` for section headings in product |
| `scale(1.02)` card hover                   | Presentation hover; product cards are interactive affordances | `hover:bg-base-200/80` tint only                    |
| `animate-glow` badge pulse                 | Marketing urgency signal                                      | Use `badge badge-primary` statically                |
| Hero-scale typography (`--type-display-*`) | Wrong density register                                        | `--type-headline-md` max in product                 |
| Hand-built colored box (`bg-<color>/N border border-<color>/N`) duplicating `alert`/`badge` | Reinvents an existing DaisyUI component per-callsite, drifts from the rest of the codebase (14+ existing `alert alert-*` usages) | `alert alert-<semantic>` (add `alert-soft` for a tinted look) or `badge badge-<semantic>` |

Status/semantic color usage (error/warning/success/info) should be solid by default (`text-error`, `alert-error`, `badge-error`) — only use a `/NN` opacity tint when matching an explicitly documented pattern in this file (e.g. avatar-placeholder fill above, hover tints in section 8). Don't invent a new tint value for a new component.

**Callout vs alert:** A persistent onboarding nudge (e.g. "no team connected yet") is not a transient status message — don't reach for `alert`/`role="alert"`. `alert` brings DaisyUI's grid layout, depth box-shadow, and noise texture, which reads as more "alarm-y" than a calm callout box. For a callout, use a plain bordered box with the semantic color mixed toward `base-200`/`base-300` (not `transparent`/`base-100` like `alert-soft` does) — bg 6% semantic-color-into-base-200, border 45% semantic-color-into-base-300, via Tailwind arbitrary-property syntax: `border [border-color:color-mix(in_oklch,var(--color-warning)_45%,var(--color-base-300))] [background-color:color-mix(in_oklch,var(--color-warning)_6%,var(--color-base-200))]`. Reference implementation: `crates/cdviz-webapp-ui/src/nav/home.rs`.

---

## 5. Data Visualization (Dashboards)

- Chart backgrounds: transparent or `bg-base-200`
- Primary data series: `--color-primary` (orange)
- Secondary series: `--color-secondary` (purple)
- Tertiary series: rotate through `--color-info`, `--color-success`, `--color-warning` — all defined in the DaisyUI theme
- Grid lines: `color-mix(in oklch, var(--color-border) 50%, transparent)`, dashed
- Axis labels: JetBrains Mono 400, 12px, `text-base-content/50`
- Tooltip: `bg-base-200 border border-base-300 rounded-lg shadow-lg`, Inter 13px
- No pie charts for time-series data. No 3D charts. No donut charts with thin rings.

---

## 6. Dioxus-Specific Notes

- Use `class` attribute for Tailwind utilities: `class: "btn btn-primary"`
- For conditional classes: use `if condition { "class-name" } else { "" }` pattern
- Component state (loading, error, empty) always handled explicitly — never `unwrap()` in render
- Server-fetched data: use `use_effect` + `spawn`, never `use_resource` (causes 401s during SSR without cookie jar)
- API errors: display using `ProblemDetails` pattern, never silent failures

---

---

## 7. Layout Shell

The shell wraps every page via `Layout` in `nav/mod.rs`.

### Font wiring

- Load only: JetBrains Mono (Google Fonts) + Excalifont (local woff2). Remove "Poor Story" and "Roboto" — not in the design system.
- Load fonts in CSS (`@import` in `tailwind.css`), not via `document::Link` in Rust (avoids duplicate loads on SSR/hydration).

### Navbar (`nav/navbar.rs`)

- Replace `bg-frame` / `text-frame-content` with `bg-base-200 text-base-content`.
- Page title: `font-display text-base font-semibold tracking-tight` — navbar is chrome, not a heading.
- Team-status pill next to the page title: `badge badge-sm badge-success badge-soft` "Team active" when a tenant is connected, `badge badge-sm badge-ghost` "No team" otherwise. Compact status signal, separate from the sidebar's "Team {slug}" link (no need to dedupe — different purpose: status vs. switcher).
- User menu trigger: initials avatar, not a generic profile icon — `avatar avatar-placeholder` wrapping a `bg-primary/20 text-primary rounded-full` circle with 1-2 uppercase initials derived from the user's identity. Falls back to icon only if no identity available.
- Theme toggle: keep sun/moon icon pair. Use Lucide `sun` / `moon` when migrating off custom `Icon` components.
- User dropdown: `bg-base-100 border border-base-300 rounded-lg shadow-lg` — not `rounded-box`.
- No emoji anywhere in navbar.

### Sidebar (`nav/mod.rs`)

- Replace `bg-frame` reference with `bg-base-200`.
- Brand link: logo SVG + product wordmark, `font-display text-sm font-semibold`. Wordmark is two-tone: first word in `text-primary`, rest in `text-accent` (static spans, not `.text-brand-gradient` — gradient is marketing-only). E.g. "CDviz" `text-primary` + " Cloud" `text-accent`. Apply this same two-tone split anywhere the full product name is rendered as a heading/wordmark.
- A "Home" item (house icon) sits first in the nav list, right after the brand link, before the team switcher — flat, not folded into a group.
- Active nav item: `bg-primary/10 text-primary rounded-lg` — full tint, no side stripe.
- Inactive: `text-base-content/70 hover:text-base-content hover:bg-base-200/60`.
- Section headers (e.g. "Dashboards") use DaisyUI `menu-title` and stay flat/always-expanded — no fold/chevron in product nav (chevron expand pattern below applies only if a future nested group is introduced; current sections do not fold).
- Collapsed icon-only: `tooltip tooltip-right` on each item — already implemented.
- Nav group expand icon: Lucide `chevron-right` / `chevron-down`, 14px.

### Main content wrapper

- `bg-base-200` area + `max-w-screen-2xl mx-auto` — keep as-is.
- Error boundary fallback: upgrade from plain `alert alert-warning` to icon + message + reset button.
- Suspense fallback: replace `alert alert-info alert-soft` spinner with skeleton shimmer matching expected content shape.

---

## 8. Page Rules

### `/` — Home

**Layout:** Left-aligned, no hero wrapper.

```
page H1 (cdviz-h3 size, text-base-content)
subtitle (text-sm text-base-content/60)
2-col quick-action card grid (grid grid-cols-1 md:grid-cols-2 gap-4)
```

**Quick-action cards:** `bg-base-100 border border-base-300 rounded-lg p-5 cursor-pointer hover:border-primary/40 hover:bg-base-200/80` — no scale. Each has Lucide icon 28px, `text-sm font-semibold`, one-line description `text-xs text-base-content/60`.

Cards always render (don't hard-hide for missing prerequisites). When the prerequisite (e.g. a connected team/tenant) is absent: drop the `Link`/cursor-pointer/hover classes, add `opacity-60 cursor-not-allowed`, and append a one-line `text-xs text-base-content/40 italic` note ("Available once a team is connected") under the description.

**No emoji** (current `✓` in home.rs — remove, use Lucide `check` or drop).

**Empty state (no tenant):** Lucide `circle-alert` 32px `text-warning`, "No team configured. Open Collector Settings to connect your first data source.", `btn btn-primary` → TenantSettings.

---

### `/auth/sign_in` and `/auth/sign_up`

**Layout:** No sidebar. `min-h-[100dvh] flex items-center justify-center bg-base-200`.

**Card:** `w-full max-w-md bg-base-100 rounded-xl border border-base-300 shadow-md p-8 space-y-6`.

**Heading:** `text-xl font-display font-semibold text-base-content` — "Sign in to CDviz" / "Create your account". Left-aligned, not centered.

**Logo:** CDviz SVG, 36px height, above the heading.

**OTP input:** `input input-bordered w-full font-mono tracking-widest text-center` — mono + wide tracking reads naturally as a 6-digit code.

**OTP send button:** `btn btn-ghost btn-sm` inline right of the OTP field — not full-width.

**Submit:** `btn btn-primary w-full`.

**Error:** `alert alert-error text-sm` above the form.

**Sign-up prompt link:** `text-sm text-base-content/60` centered below submit — only this line centered.

---

### `/auth/me` — Profile

**Layout:** `max-w-2xl mx-auto space-y-8`.

**Sections via `divide-y divide-base-300`** (not cards):

1. Identity — name, email, role badge.
2. Security — active sessions, sign-out-all.

**Section headings:** `text-xs font-semibold text-base-content/50 uppercase tracking-widest mb-3`.

**Role badge:** `badge badge-primary badge-sm` admin, `badge badge-ghost badge-sm` member.

---

### `/playground/template` — Template Playground

**Layout:** `grid grid-cols-1 lg:grid-cols-2 gap-4` filling available height. Each column: `flex flex-col gap-2`.

**Editor and output panels:** `bg-base-300 border border-base-300 rounded-lg font-mono text-sm p-3 resize-none flex-1 min-h-[200px]`.

**Column labels:** `text-xs font-semibold text-base-content/50 uppercase tracking-widest` above each panel.

**Toolbar (above grid):** `flex items-center gap-2 mb-3` — "Run" (`btn btn-primary btn-sm`), template selector (`select select-bordered select-sm`), run timing in `text-xs font-mono text-base-content/50`.

**Error:** `alert alert-error text-sm` below toolbar, full-width.

**Output panel split:** Input JSON top half, output JSON bottom half, separated by `border-t border-base-300`.

---

### `/dashboards/*` — Execution Dashboards (all four)

Consistent across Pipeline / Task / TestCase / TestSuite.

**Layout:** `space-y-4`.

**Header row:** `flex items-center justify-between flex-wrap gap-3 mb-2` — page H1 left, time range picker right.

**Time range picker:** `select select-bordered select-sm`. Options: "Last 1h", "Last 24h", "Last 7d", "Last 30d".

**Stats row:** `grid grid-cols-2 md:grid-cols-4 gap-3`.

- Stat card: `bg-base-100 border border-base-300 rounded-lg p-4`.
- Value: `font-display text-2xl font-bold text-base-content` (JetBrains Mono).
- Label: `text-xs text-base-content/60 mt-0.5`.
- Delta: `text-xs font-mono text-success` / `text-error`.

**Chart area:** `bg-base-100 border border-base-300 rounded-lg p-4 min-h-[260px]`.

**Data table:** see Section 2. Sticky header, `border-b border-base-300` row separation.

**Empty state (no data):** Lucide `chart-no-axes-combined` 32px `text-base-content/30`, "No events in this time range." — no CTA (data comes from external integrations).

**Skeleton loading:** 4 shimmer blocks matching stat card shape + full-width shimmer for chart area (`bg-base-300 rounded-lg animate-pulse`).

---

### `/settings/tenant` — Collector Settings

**Tab bar:** `tabs tabs-bordered`. Active: `tab tab-active text-primary`.

**Section cards:** `bg-base-100 border border-base-300 rounded-lg` — remove DaisyUI `shadow`, use explicit `border border-base-300`.

**Card headers:** `px-6 py-4 border-b border-base-300` — keep pattern.

**Card title:** `text-base font-semibold text-base-content` — not `card-title text-lg`.

**SourceRow docs link:** Remove 📖 emoji. Replace with "Integration Docs" + Lucide `external-link` 12px inline after text.

**DbStatusBadge:** keep existing `badge-neutral` / `badge-warning` / `badge-success` mapping — verify against DaisyUI v5 badge variant names.

**Remove-member confirm modal:** Replace inline `fixed inset-0 bg-black/50` with DaisyUI `dialog` element for proper focus trap and ESC-to-close.

**Invite form:** Add explicit label above email input (currently placeholder-as-label).

**Save feedback:** `flex flex-wrap items-center gap-3` — alert left of button, not below.

---

### `/teams/select` — Select a Team

**Layout:** `max-w-2xl mx-auto space-y-6 py-8`.

**Heading:** `text-xl font-display font-semibold text-base-content` — "Choose a team".

**Team list:** `divide-y divide-base-300` — row per team, no cards.

- Row: `flex items-center justify-between py-3 px-3 hover:bg-base-200/60 rounded-lg cursor-pointer`.
- Team name: `text-sm font-medium`.
- Slug: `text-xs font-mono text-base-content/50`.
- Lucide `chevron-right` 16px `text-base-content/30` right end.

**Create team:** `btn btn-ghost btn-sm` with Lucide `plus` below list.

**Empty state:** Lucide `users` 32px `text-base-content/30`, "No teams yet.", `btn btn-primary` → TeamCreate.

---

### `/teams/new` — Create a Team

**Layout:** `max-w-md mx-auto py-8 space-y-6`.

**Heading:** `text-xl font-display font-semibold text-base-content`.

**Form:**

- Team name: label above, `input input-bordered w-full`, helper `text-xs text-base-content/60` "Lowercase letters, numbers, hyphens only."
- Submit: `btn btn-primary w-full`.
- Cancel: `btn btn-ghost w-full` below, links to TeamsSelect.

---

### `/invitations/:token` — Accept Invitation

**Layout:** Same centered card as sign-in — `min-h-[100dvh] flex items-center justify-center bg-base-200`.

**Card states:**

1. **Loading:** skeleton shimmer matching card content.
2. **Valid:** team name, role badge, `btn btn-primary w-full` "Join [team]", `btn btn-ghost w-full` "Decline".
3. **Expired / invalid:** `alert alert-error`, `btn btn-ghost` → SignIn.
4. **Accepted:** `alert alert-success` "Welcome to [team].", redirect to Home after 2s.

---

## 9. Code Migration Quick-Reference

| File                 | Issue                                     | Fix                                                          |
| -------------------- | ----------------------------------------- | ------------------------------------------------------------ |
| `nav/mod.rs`         | Loads "Poor Story" + "Roboto"             | Remove both `document::Link` font lines                      |
| `nav/mod.rs`         | `bg-frame text-frame-content` in sidebar  | Replace with `bg-base-200 text-base-content`                 |
| `nav/navbar.rs`      | `bg-frame text-frame-content`             | Replace with `bg-base-200 text-base-content`                 |
| `nav/home.rs`        | `hero h-3/5` marketing layout + `✓` emoji | Rewrite to quick-action grid; replace emoji with Lucide icon |
| `tenant/settings.rs` | `📖 Integration Docs` emoji               | Remove emoji, add Lucide `external-link` icon                |
| `tenant/settings.rs` | Inline modal for remove-confirm           | Replace with DaisyUI `dialog`                                |
| `tenant/settings.rs` | `card-title text-lg`                      | `text-base font-semibold`                                    |
| `tenant/settings.rs` | Invite form placeholder-as-label          | Add explicit label above email input                         |
| All dashboard pages  | No skeleton loading state                 | Add shimmer for stat cards + chart area                      |

---

## See also

- `../DESIGN.md` — root design system (colors, type, spacing, motion)
- `../daisyui-theme.css` — DaisyUI token mapping (`cdviz-night` / `cdviz-day`)
- `../colors_and_type.css` — base tokens and utilities
- `DOCS.md` — documentation surface rules
- `VIDEO.md` — video production rules
