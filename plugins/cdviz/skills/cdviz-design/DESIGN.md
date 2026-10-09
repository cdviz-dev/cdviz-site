# CDviz Design System

**Philosophy:** _Observe before act._ Design should feel calm, technical, and trustworthy — like a well-instrumented terminal.

**Brand:** CDviz — SDLC observability for DevOps engineers, SREs, platform engineers.\
**Website:** https://cdviz.dev · **Demo:** https://demo.cdviz.dev/grafana · **GitHub:** https://github.com/cdviz-dev

---

## Surfaces

| Surface         | Stack                                       | Rules               |
| --------------- | ------------------------------------------- | ------------------- |
| Landing page    | VitePress 2, Tailwind 4, GSAP               | this file           |
| Documentation   | VitePress 2, Tailwind 4                     | `surfaces/DOCS.md`  |
| SaaS product UI | Dioxus, DaisyUI (`cdviz-night`/`cdviz-day`) | `surfaces/SAAS.md`  |
| Video           | Hyperframe.ai, Blender, YouTube             | `surfaces/VIDEO.md` |

Token source: `colors_and_type.css` (web) · `daisyui-theme.css` (SaaS/DaisyUI)

---

## 1. Foundational Principles

1. **Dark-first.** Default canvas is `#0e151b`; light mode is a translation, not the reference.
2. **Orange is the only voice that raises its hand.** Every other color is quiet. Orange signals a CTA, a heading, a live state. Use it sparingly.
3. **Type carries the brand.** The tension between JetBrains Mono (cold, technical) and Excalifont (warm, human) is the brand signal — both are active voices.
4. **Hand-drawn diagrams and hero moments.** Excalifont on black with orange strokes: diagrams, landing hero H1, tagline.
5. **No filler.** Every element earns its place. Empty space is acceptable.
6. **No emoji in UI.** Lucide for affordances, Simple Icons for brand logos.

---

## 2. Color

### Palette

Dark-first. Light mode values are OKLCH L-mirrored (same H, C) for contrast parity.

| Token               | Dark (default)                                    | Light override                                    | Role                         |
| ------------------- | ------------------------------------------------- | ------------------------------------------------- | ---------------------------- |
| `--color-primary`   | `oklch(74.22% 0.166 64.29)` · `#f29107`          | `oklch(42% 0.185 64.29)` · `#8c2500`             | CTAs, headings, active state |
| `--color-secondary` | `oklch(69.49% 0.068 298.56)` · `#a294c2`         | unchanged (borders/decorative only)               | Borders, muted elements      |
| `--color-accent`    | `oklch(49.68% 0.104 307.15)` · `#725190`         | unchanged (gradient endpoint only)                | Gradient endpoint only       |
| `--color-bg`        | `oklch(10.5% 0.01 244)` · `#0e151b`              | `oklch(80.5% 0.019 255.54)` · `#c9d2de`          | Page background              |
| `--color-bg-raised` | `oklch(15% 0.012 244)` · `#111820`               | `oklch(98% 0 0)` · `#fafafa`                     | Cards, raised surfaces       |
| `--color-text`      | `oklch(80.5% 0.019 255.54)` · `#c9d2de`          | `oklch(19.15% 0.016 244.65)` · `#283040`         | Body text                    |

Semantic tokens (`--color-border`, `--color-text-muted`, etc.) and full overrides are in `colors_and_type.css`.

### Rules

- Combine orange with near-black and fog. That's the entire palette.
- Tints: `color-mix(in oklch, var(--primary) N%, transparent)` — never invent a lighter orange.
- No green, red, yellow, or blue accents. Status colors only inside data viz.
- No gradients on large backgrounds. Gradients reserved for text emphasis and section fills ≤8% opacity.

### Gradient text surface rule

`.cdviz-gradient-text` / `.text-brand-gradient` — **landing page hero H1 only**. Forbidden in SaaS UI, docs, and video. Use `color: var(--color-primary)` elsewhere.

---

## 3. Typography

| Role                     | Font           | Weight  | Notes                                                      |
| ------------------------ | -------------- | ------- | ---------------------------------------------------------- |
| Landing hero H1, tagline | Excalifont     | 400     | `fonts/Excalifont-Regular.woff2`; landing page only        |
| H1–H3, section titles    | JetBrains Mono | 600–700 | `-0.02em` letter-spacing; all surfaces except landing hero |
| Body, captions, labels   | Inter          | 300–500 |                                                            |
| Code, terminal, metrics  | JetBrains Mono | 400–500 |                                                            |
| Diagrams, annotations    | Excalifont     | 400     | `fonts/Excalifont-Regular.woff2`                           |

- H1: clamp between mobile/desktop — never fixed `px`.
- Body: 16px. Small: 14px. Minimum anywhere: 12px.
- H2 in **primary orange** for section starters. H3 in fog.
- One H1 per page. Always.
- All-caps only for micro-labels (`STABLE`, `BETA`) — `letter-spacing: 0.08em`.

---

## 4. Layout & Spacing

Golden ratio scale (1.618×): `2xs` 4.8px · `xs` 7.8px · `sm` 12.6px · `md` 20.4px · `lg` 32.9px · `xl` 53.3px · `2xl` 86.2px\
Pick the closest token. Never tween between steps.

- Flex/grid with `gap` for sibling groups. Never margin-stack.
- Content rail: 1280px max, `--space-lg` side gutters.
- Section vertical rhythm: `--space-2xl` (86px). Within section: `--space-lg` (33px).
- Radii: badges/code 4px · buttons 8px · cards 12px · containers 16–20px · pills `9999px`
- Marketing: generous (≥80px hero breathing room). Product UI: one step tighter. Mobile: one step down everywhere.

---

## 5. Motion

### Easing tokens

| Token           | Curve                             | Use                                |
| --------------- | --------------------------------- | ---------------------------------- |
| `--ease-ui`     | `cubic-bezier(0.23, 1, 0.32, 1)`  | Interactions, entrances, dropdowns |
| `--ease-move`   | `cubic-bezier(0.77, 0, 0.175, 1)` | On-screen movement                 |
| `--ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)`  | Drawers, sheets                    |
| `--ease-reveal` | `cubic-bezier(0.4, 0, 0.2, 1)`    | Scroll reveals (600–800ms only)    |

Never use `ease-in` for UI — starts slow, feels unresponsive.

### Duration table

| Element                  | Duration    | Easing          | Notes                                    |
| ------------------------ | ----------- | --------------- | ---------------------------------------- |
| Button press, hover      | 100–160ms   | `--ease-ui`     | Press `scale(0.97)`, hover `scale(1.05)` |
| Tooltips, small popovers | 125–200ms   | `--ease-ui`     | Enter from `scale(0.95) opacity(0)`      |
| Dropdowns, selects       | 150–250ms   | `--ease-ui`     |                                          |
| Modals, drawers          | 200–300ms   | `--ease-drawer` | Exit 50ms faster than enter              |
| Scroll-triggered reveals | 600–800ms   | `--ease-reveal` | Fade + 30px translateY, stagger 150ms    |
| Decorative float/glow    | 3s infinite | ease-in-out     | **Marketing only**                       |

### Rules

- Always respect `prefers-reduced-motion`. Disable float/pulse/gradient-shift; keep state transitions.
- No 3D rotations. No morphing. No parallax.
- Never animate keyboard-initiated actions.
- Enter from `scale(0.95) opacity(0)` — never `scale(0)`.
- Animate `transform` and `opacity` only. Never layout properties.
- Stagger 3–8 elements. Larger groups feel mechanical.

---

## 6. Components

### Buttons

- Min height 44px. Three variants: **primary** (orange), **secondary** (purple), **ghost** (border).
- Press `scale(0.97)`. Hover `scale(1.05)`. Disabled: 50% opacity, keep brand color.

### Cards

- Rest: `border: 1px solid secondary/20`.
- Hover: border → `primary/40`, glow `0 8px 25px -8px primary/30`, `scale(1.02)` — **marketing only**.
- Featured: `border: 2px solid primary/30`, gradient fill 5→12% primary.
- No stacked shadows. Blur shadows: 20–30px range only.

### Badges & tags

- Pill (`radius: full`): status labels (`Apache 2.0`, `CDEvents Compatible`).
- Square (`radius: 4px`, JetBrains Mono): technical keywords (`cdevents`, `ci/cd`).
- Don't mix shapes in the same row.

### Icons

- **Lucide** (`icon-[lucide--*]`): affordances (navigation, actions, state). Sizes: 16 · 20 · 24 · 28px.
- **Simple Icons** (`icon-[simple-icons--*]`): brand logos (GitHub, Kubernetes, Grafana, ArgoCD).
- Custom SVG for diagrams only. Icons inherit `currentColor` — never hard-code fill.
- Loaded via Iconify Tailwind 4 plugin (CSS mask-based).

---

## 7. Imagery & Illustration

**Use:** product screenshots (dark theme, real data), hand-drawn diagrams (see below), partner logos in their official color.

**Don't use:** stock photos of people, 3D isometric illustrations, generic SaaS illustration packs, AI-generated imagery.

### Diagrams

- **Background:** monochrome dark (`#0e151b` or black). No colored fills on canvas.
- **Strokes & labels:** primary orange (`#f29107`) for key elements. Use `opacity < 1` (e.g. 40–60%) for secondary/supporting elements — hierarchy through transparency, not extra colors.
- **Style:** hand-written. Use Excalifont for all text. Prefer hand-drawn shapes (rough edges, slight imprecision) over clean geometric shapes. Exception: logos and icons keep their original form — do not distort them.
- **No additional colors.** If you need to de-emphasize: lower opacity. If you need to emphasize: full-opacity orange.
- **Tool:** Excalidraw. Export SVG with fonts embedded or reference `fonts/Excalifont-Regular.woff2`.
- **Mermaid** (flowcharts, sequences written as text): allowed on cdviz.dev as a plain `` ```mermaid `` fence. The shared theme (`.vitepress/mermaid.config.json`: hand-drawn, Excalifont, orange on transparent) applies these rules. Never add per-diagram config or colors.

---

## 8. Voice & Copy

- **"You" not "we"** — "Know which version is deployed where." Not "We show you…"
- **Active voice** — "Collect events from GitHub" not "Events are collected from GitHub"
- **Active CTAs** — "Try Live Demo", "Get Started Free" — never "Click here" or "Learn more"
- **Concrete headings** — "Works With What You Already Have" beats "Universal Integration"
- Headings: Title Case. Technical terms exact: CDEvents, CDviz, PostgreSQL, TimescaleDB, Grafana, Kubernetes, GitHub, GitLab, ArgoCD
- Stats: precise and real. No invented numbers.

---

## 9. Accessibility

### WCAG contrast audit (AA = 4.5:1 normal / 3:1 large; 1.4.11 UI components = 3:1)

**Dark mode** — all verified:

| Pair                                   | Ratio   | Grade    |
| -------------------------------------- | ------- | -------- |
| body text / page bg                    | 11.18:1 | AAA      |
| body text / card bg (ink)              | 10.72:1 | AAA      |
| primary orange / page bg (large text)  |  8.63:1 | AAA      |
| primary orange / page bg (small text)  |  8.63:1 | AAA      |
| orange btn label / orange bg           |  8.63:1 | AAA      |
| secondary purple / page bg             |  7.38:1 | AAA      |
| accent purple-deep / page bg           |  3.22:1 | AA-large |

`purple-deep` is gradient-endpoint only — never standalone small text. ✓

**Light mode** (`html:not(.dark)` overrides) — all verified:

| Pair                                        | Ratio   | Grade |
| ------------------------------------------- | ------- | ----- |
| body text / page bg (fog)                   | 10.03:1 | AAA   |
| body text / soft bg (white)                 | 17.36:1 | AAA   |
| text-2 / page bg                            |  5.01:1 | AA    |
| primary orange / page bg (normal text)      |  4.82:1 | AA    |
| primary orange / soft bg (normal text)      |  8.35:1 | AAA   |
| orange btn label (fog) / orange bg          |  4.82:1 | AA    |
| secondary btn bg / page bg (1.4.11 UI)      |  4.99:1 | AA ✓  |
| secondary btn text (fog) / btn bg           |  4.99:1 | AA    |
| sidebar text / sidebar bg                   | 15.90:1 | AAA   |

- Min 44×44px tap targets.
- Focus rings: `0 0 0 2px var(--primary), 0 0 0 4px var(--primary)/20`. Never hover-only.
- All decorative animation respects `prefers-reduced-motion`.
- Diagrams: text labels or `aria-label` on SVG.

---

## 10. Quick Decisions

> **Color?** Background → `--bg`/`--bg-raised`. Text → `--text`/`--text-muted`. CTA/emphasis → `--primary`. Border → `--border`. Inventing a token? Don't.

> **Font?** Landing hero H1/tagline → Excalifont. All other headings → JetBrains Mono. Body → Inter. Code → JetBrains Mono. Diagram → Excalifont.

> **Padding?** Inside card → `--space-md` (20px). Between sections → `--space-2xl` (86px). Mobile → one step down.

> **Hover state?** Card: orange border + glow + `scale(1.02)`. Button: `scale(1.05)`. Link: color → `--primary`. 160ms `--ease-ui`.

> **Fifth color?** No.

---

## Files

```
cdviz-design/
├── DESIGN.md              ← this file (authoritative design reference)
├── SKILL.md               ← agent quick reference
├── colors_and_type.css    ← CSS tokens: palette, fonts, spacing, easing, components
├── daisyui-theme.css      ← DaisyUI v5 themes: cdviz-night + cdviz-day
├── fonts/
│   └── Excalifont-Regular.woff2
├── diagrams/              ← CdvizArchitecture.svg, Sdlc.svg
├── assets/
│   ├── logos/             ← cdviz.svg, cdviz-320x320-c.png, cdevents*.svg
│   ├── icons/             ← argocd.svg
│   └── illustrations/     ← hero-dashboard-01.webp, pipeline.svg
└── surfaces/
    ├── SAAS.md            ← SaaS product UI rules (Dioxus + DaisyUI)
    ├── DOCS.md            ← VitePress documentation rules
    └── VIDEO.md           ← video production rules
```

_No UI kit — reference `assets/` directly for prototyping. `assets/`, `diagrams/` and `fonts/` are symlinks to the canonical files of the cdviz-site repository (`assets/`, `components/diagrams/`): edit those, not copies._
