# CDviz Documentation — Surface-Specific Design Rules

Applies to: VitePress 2 documentation site.

The docs share the same token system as the landing page (`colors_and_type.css`) but differ in density, typographic scale, and component scope.

---

## 1. Theme & Base Setup

- Dark mode default, light mode supported.
- VitePress-idiomatic theming: **set `--vp-c-*` vars directly to CDviz raw palette values**, then alias CDviz semantic tokens from VitePress. This is the correct direction — VitePress owns its variable names, and your job is to give them the right values.

**Step 1 — Set VitePress vars to CDviz values (dark-first):**

```css
:root {
  --vp-c-bg: var(--cdviz-black);         /* #0e151b */
  --vp-c-bg-soft: var(--cdviz-ink);      /* #111820 */
  --vp-c-bg-elv: var(--cdviz-ink);
  --vp-c-text-1: var(--cdviz-fog);       /* #c9d2de */
  --vp-c-text-2: color-mix(in oklch, var(--cdviz-fog) 70%, transparent);
  --vp-c-brand-1: var(--cdviz-orange);   /* #f29107 */
  --vp-c-brand-2: var(--cdviz-orange-dim);
  --vp-c-divider: color-mix(in oklch, var(--cdviz-purple) 20%, transparent);
  --vp-sidebar-bg-color: var(--cdviz-ink);
  --vp-font-family-base: var(--font-family-base);
  --vp-font-family-mono: var(--font-family-mono);
}
```

**Step 2 — Alias CDviz semantic tokens from VitePress** (so components use consistent names):

```css
:root {
  --color-primary: var(--vp-c-brand-1);
  --color-bg: var(--vp-c-bg);
  --color-bg-raised: var(--vp-c-bg-soft);
  --color-border: var(--vp-c-divider);
  --color-text: var(--vp-c-text-1);
  --color-text-muted: var(--vp-c-text-2);
}
```

**Light mode** — override only the VitePress vars (CDviz aliases auto-follow):

```css
@media (prefers-color-scheme: light) {
  :root {
    --vp-c-bg: var(--cdviz-fog);
    --vp-c-bg-soft: oklch(98% 0 0);
    --vp-c-text-1: oklch(19.15% 0.016 244.65);
    --vp-c-text-2: oklch(40% 0.016 244.65);
  }
}
```

**Why this direction matters:** If you set `--vp-c-bg: var(--color-bg)` (the old direction), VitePress's initial value for `--vp-c-bg` is white — it renders white until `--color-bg` resolves, causing a flash. Driving VitePress vars from raw CDviz values avoids this dependency chain.

---

## 2. Typography in Docs

| Element         | Font               | Size                           | Color                      |
| --------------- | ------------------ | ------------------------------ | -------------------------- |
| Page H1         | Excalifont 400     | `--type-display-sm` (36px) max | `--color-text`             |
| H2 (section)    | JetBrains Mono 600 | `--type-headline-lg` (32px)    | `--color-primary` (orange) |
| H3              | JetBrains Mono 600 | `--type-headline-sm` (24px)    | `--color-text`             |
| H4              | JetBrains Mono 500 | `--type-title-lg` (22px)       | `--color-text-muted`       |
| Body            | Inter 400          | `--type-body-lg` (16px)        | `--color-text`             |
| Small / caption | Inter 400          | `--type-body-md` (14px)        | `--color-text-muted`       |
| Inline code     | JetBrains Mono 400 | 0.875em                        | inherited                  |

- Body line length: max 72ch. VitePress's default content column handles this; do not override to be wider.
- Letter-spacing on all JetBrains Mono headings: `-0.02em`. Excalifont H1: `0.01em` (slight positive tracking).
- H1 does not use `--type-display-md` (45px) — docs H1 is a page title, not a hero. Cap at 36px.
- Excalifont H1 signals "human-authored" — use `.cdviz-h1-sketch` class. H2/H3 stay JetBrains (navigation anchors, scanned quickly).

---

## 3. Code

### Inline code

```css
code {
  background: var(--color-bg-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); /* 4px */
  padding: 0.1em 0.35em;
  font-family: var(--font-mono);
  font-size: 0.875em;
}
```

### Code blocks

- Background: `var(--color-bg-raised)`
- Border: `1px solid var(--color-border)`
- Border-radius: `var(--radius-lg)` (12px)
- Syntax highlighting: Shiki with `github-dark` theme, with background overridden to `var(--color-bg-raised)` — never leave the default Shiki near-black which clashes with the CDviz black.
- Language tag: top-right corner, Inter 11px, `text-base-content/40`
- Copy button: top-right, Lucide `copy` icon, `text-base-content/40 hover:text-primary`, 160ms `--ease-ui`

### Terminal / shell blocks

- Prefix `$` or `>` in `--color-text-muted`
- Output lines in `--color-text-dim`
- No color-coding of terminal output (keep it readable, not decorative)

---

## 4. Callouts / Admonitions

VitePress custom containers (`::: tip`, `::: warning`, etc.):

| Type    | Border                         | Background     | Icon                                    |
| ------- | ------------------------------ | -------------- | --------------------------------------- |
| TIP     | `border-l-2 border-primary/60` | `bg-primary/5` | Lucide `lightbulb`, `text-primary`      |
| INFO    | `border-l-2 border-info/60`    | `bg-info/5`    | Lucide `info`, `text-info`              |
| WARNING | `border-l-2 border-warning/60` | `bg-warning/5` | Lucide `triangle-alert`, `text-warning` |
| DANGER  | `border-l-2 border-error/60`   | `bg-error/5`   | Lucide `octagon-x`, `text-error`        |
| DETAILS | `border border-base-300`       | `bg-base-200`  | Lucide `chevron-down` (collapsed)       |

Label style: JetBrains Mono 600, uppercase, `letter-spacing: 0.08em`, 13px.

**Note on side-stripe borders:** The `border-l-2` (2px left border) used in callouts is the **one semantic exception** to the no-side-stripe rule. It is meaningful here: the border identifies the callout type at a glance and is part of a standard docs convention that users recognize. Keep it narrow (2px max) and always pair with a background tint.

---

## 5. Navigation

### Sidebar

- Background: `var(--color-bg-raised)` (`#111820`)
- Right border: `1px solid var(--color-border)`
- Section heading: Inter 600, 11px, uppercase, `letter-spacing: 0.08em`, `text-base-content/50`
- Link: Inter 400, 14px, `text-base-content/70`, `hover:text-base-content`
- Active link: `text-primary bg-primary/10 rounded-lg` — full background tint (not a side stripe)
- Collapsible groups: Lucide `chevron-right` (collapsed), `chevron-down` (expanded), 14px

### Breadcrumbs

- Inter 14px, `text-base-content/50`
- Separator: `›` in `text-base-content/30`
- Current page (last item): `text-base-content`
- Links: `hover:text-primary`, 160ms `--ease-ui`

### Top nav

- Background: `var(--color-bg)/90 backdrop-blur-sm` (frosted on scroll)
- CDviz logo left, nav links right
- Links: Inter 500, 14px, `text-base-content/80 hover:text-base-content`
- Active page: `text-primary`
- Search: Lucide `search` icon trigger, opens modal

### Search overlay

- Backdrop: `bg-base-100/80 backdrop-blur-sm`
- Modal: `bg-base-200 border border-base-300 rounded-xl shadow-xl`
- Input: `input input-bordered w-full font-mono` — JetBrains Mono for query text (typeahead feels right in mono)
- Results: Inter 14px, matched text highlighted in `text-primary`
- Keyboard shortcut hint: `kbd` element, JetBrains Mono 12px

---

## 6. Tables

```css
table {
  width: 100%;
  border-collapse: collapse;
}
th {
  background: var(--color-bg-raised);
  border-bottom: 1px solid var(--color-border);
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  padding: var(--space-xs) var(--space-sm);
  color: var(--color-text-muted);
}
td {
  border-bottom: 1px solid color-mix(in oklch, var(--color-border) 50%, transparent);
  padding: var(--space-xs) var(--space-sm);
  font-size: 14px;
}
tr:hover td {
  background: var(--color-bg-raised);
}
```

---

## 7. Links

- Body text links: `text-primary` (orange), no underline by default, `underline` on hover
- External links: add Lucide `arrow-up-right` icon (12px, inline) after the link text
- Anchor heading links (`#`): fade in on heading hover, `text-base-content/30 hover:text-primary`, Lucide `link` 14px

---

## 8. Version / Badge Chips

Same pill badge system as the root design system:

- `STABLE`, `BETA`, `DEPRECATED`, `NEW`: `border-radius: var(--radius-full)`, Inter 600, 11px, uppercase, `letter-spacing: 0.08em`
- STABLE: `bg-success/15 text-success border border-success/30`
- BETA: `bg-warning/15 text-warning border border-warning/30`
- DEPRECATED: `bg-error/15 text-error border border-error/30`
- NEW: `bg-primary/15 text-primary border border-primary/30`

---

## 9. Forbidden in Docs

| Pattern                                         | Why                            | Alternative                         |
| ----------------------------------------------- | ------------------------------ | ----------------------------------- |
| `.text-brand-gradient` / gradient text          | Marketing hero only            | `text-primary` for emphasis         |
| `.animate-float` / `.animate-glow`              | Distraction in reading context | Static elements                     |
| `.bg-data-grid`                                 | Marketing motif                | `bg-base-100`                       |
| Hero-scale type (`--type-display-md` or larger) | Page title ≠ hero              | Max `--type-display-sm` (36px)      |
| Emoji as decorative elements                    | Inconsistent with brand voice  | Lucide icons                        |
| Orange H1                                       | Marketing convention           | `text-base-content` for page titles |

---

## See also

- `../DESIGN.md` — root design system
- `../colors_and_type.css` — token definitions
- `SAAS.md` — SaaS UI surface rules
- `VIDEO.md` — video production rules
