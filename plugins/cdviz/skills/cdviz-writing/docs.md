# Documentation Pages

Source: `src/docs/` of the cdviz-site repository (VitePress). Sidebar: `.vitepress/config.mts`.

## Where a Page Goes

The sidebar is a [Diátaxis](https://diataxis.fr/)-informed hybrid. Pick the section by what the reader is doing:

| Reader wants to...                      | Section                                                                               | Path                                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| get a first result, step by step        | Getting Started (tutorial)                                                            | `/docs/getting-started`                                                                       |
| connect a tool (source or consumer)     | Integrations (how-to)                                                                 | `/docs/integrations/<id>`                                                                     |
| understand why / how it works           | Concepts (explanation)                                                                | `/docs/architecture`, ...                                                                     |
| look up config, CLI, schema, dashboards | Reference, by pillar: Event Collection, Event Store, Event Monitoring, Event Reaction | `/docs/cdviz-collector/`, `/docs/cdviz-db/`, `/docs/event-monitoring`, `/docs/cdviz-grafana/` |
| compare CDviz with another product      | Alternatives                                                                          | `/docs/alternatives/vs-<product>`                                                             |

Don't mix modes in one page: a how-to links to the concept page instead of explaining it inline.
A new page needs a sidebar entry in `.vitepress/config.mts`; every directory with pages needs an `index.md` (the URL check fails otherwise).
Moving a page: add a 301 in `assets/_redirects` and update internal links (links must not hit redirects).

## Page Shape

1. `title` and `description` frontmatter (the description is the search snippet: one or two sentences on what the reader gets).
2. H1, then one short paragraph: what the reader will have at the end.
3. Prerequisites, if any, as a short list.
4. Steps or content. One action per step; show the command or config, then what to expect.
5. A way to verify it worked (a query, a dashboard, a log line).
6. Next steps: two or three links, not a link dump.

Keep pages focused; long pages are only for generated reference material.

## Plans

When a page is not available on every plan, add `plans: [community, cloud, pro]` (the subset that applies) to the frontmatter; `PlanBadges.vue` renders it. No `plans` means all plans.
Availability truth lives in `components/data/integrations.ts` and `comparisonRows` in `components/landing/SectionPlans.vue`: keep the page consistent with them.

## Integrations Pages

- File `src/docs/integrations/<id>.md`, where `<id>` matches the entry `id` in `components/data/integrations.ts` (that entry also feeds the catalog and coverage matrix: add or update it with the page).
- Frontmatter: `title`, `keywords`, `description` (rendered by `<IntegrationCard />`), `references` (upstream docs, examples of converted events), `plans`.
- When setup differs between self-hosted and CDviz Cloud, use `<EditionTabs>` with `<template #selfhosted>` and `<template #cloud>`.
- Show the event mapping (input event -> CDEvents subject/predicate) and link the transformer source in `transformers-community`.

## Code and Config Samples

- Never hand-write a config that has not been run. Prefer importing real files with VitePress `<<<`:
  - files from the cdviz repository are copied into `snippets/` by `mise run build:markdown` (compose stack, db baseline migration, collector chart values). Add a new copy there instead of pasting.
  - collector CLI help is generated in `src/docs/cdviz-collector/*-help.txt`.
- Use `#region` markers to import a slice instead of duplicating it.
- Shell blocks: commands only, no `$` prompt (copy-paste friendly, as on every existing page); put output in a separate block.

## Alternatives Pages

- Fair and sourced: state what the other product does well and who it fits ("They target different constraints"). No disparaging adjectives.
- Every claim about the other product must be checkable on its public site or docs; prefer linking the source.
- Keep the dated line under the intro and refresh it on every edit:
  `> _Last updated <Month YYYY>. [Corrections welcome](https://github.com/cdviz-dev/cdviz-site/edit/main/src/docs/alternatives/<file>.md)._`
- Keep the `ItemList` JSON-LD in the `head` frontmatter in sync with the title.

## SEO Notes

- Content must be in the static HTML: no client-only rendering of text (use VitePress data loaders and `v-show`, not `v-if`, for filtered content).
- One H1 per page; headings describe the content ("Configure the GitLab Webhook"), not a teaser.
- Link related pages with descriptive anchor text, not "here".
