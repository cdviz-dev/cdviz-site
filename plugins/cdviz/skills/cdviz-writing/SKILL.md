---
name: cdviz-writing
description: Voice, style and structure rules for any CDviz text - cdviz.dev documentation pages, blog articles, alternatives/comparison pages, landing copy, READMEs, release notes and UI copy in CDviz apps. Use when writing, editing, reviewing or humanizing CDviz content, or when asked to "make it sound human", "fix the tone", "write a doc page", "write a blog post".
user-invocable: true
---

# CDviz Writing

Read the shared rules below, then the file for the content type:

- `docs.md`: documentation pages (`src/docs/`), including integrations and alternatives pages
- `articles.md`: blog articles (`src/blog/`) and their dev.to cross-posts

For visual rules (callouts, code blocks, tables, badges) see the `cdviz-design` skill (`surfaces/DOCS.md`).

## Audience

DevOps engineers, platform engineers and tech leads. They know CI/CD, Kubernetes and Git hosting; they may not know CDEvents.
Two paths must stay visible: self-hosters (open source, Community plan) and CDviz Cloud buyers. Never serve one by hiding the other.

Write for three readers at once:

- **Non-native English speakers**: simple words, one meaning per term, no idioms or puns.
- **Crawlers and AI agents**: every fact in plain text in the HTML, one topic per page, descriptive headings they can quote.
- **Busy humans**: the answer in the first two lines, the page scannable from headings, lists and tables alone.

## Formats

Prefer the most compact format that carries the fact. Pick by content:

| Content                                        | Format                                                    |
| ---------------------------------------------- | --------------------------------------------------------- |
| How to do it                                   | Code or config block first, one sentence of context after |
| Parallel items (steps, options, prerequisites) | Numbered or bulleted list                                 |
| Comparison, mapping, options vs criteria       | Table                                                     |
| System, flow, architecture                     | Diagram                                                   |
| Numbers, trends, distributions                 | Chart (or a table when there are few values)              |
| Change over time, a sequence of states         | Animation (optional)                                      |
| Reasoning, trade-off, opinion                  | Short paragraphs                                          |

- Sentences: about 15 words or fewer, one idea each. Paragraphs: 3 sentences or fewer. Close to ASD-STE100, but keep product names, code and domain terms exact.
- Define a term once, at first use, then always use the same word (no synonyms for variety).
- A diagram, chart or animation MUST NOT be the only carrier of a fact: say the key point in the text or a caption, and give images an `alt` text. Crawlers and screen readers do not see pictures.
- Diagrams: Excalidraw SVG in `components/diagrams/`, wrapped in a Vue component (see `CdvizArchitecture.vue`); style per the `cdviz-design` skill.
- Animations: gsap (already a dependency), in the diagram's Vue wrapper. The static SVG MUST show the final state (no JS, `prefers-reduced-motion`, crawlers).
- Charts: no chart library is installed. Use a table or a static SVG; ask before adding a library.

## Voice

- Address the reader as "you". When the company speaks, write "the CDviz team" (third person), not "we".
- Active voice: "Collect events from GitHub", not "Events are collected from GitHub".
- Concrete over abstract: name the tool, the command, the event type, the file. "Know which version runs in production" beats "Gain deployment visibility".
- Precise, real numbers only. Never invent a stat, a benchmark, a customer or a quote. If a number is missing, leave a `TODO` for a human.
- Provider-neutral: "GitHub or GitLab", never a GitHub-only phrasing for a feature that supports both.
- Exact product and technology names: CDEvents, CDviz, CDviz Cloud, cdviz-collector, PostgreSQL, TimescaleDB, Grafana, Kubernetes, GitHub, GitLab, ArgoCD, VRL.
- Headings: Title Case on landing and marketing pages; docs and articles follow the casing already used in their section.
- CTAs say what happens: "Try the Live Demo", "Start Free Trial". Never "Click here" or "Learn more".
- No growth-hack asks (no "star this repo", no "don't forget to share"). The content earns it or it doesn't.
- No emoji in docs, articles or UI.

## Sound Human

Cut these patterns on sight. They read as machine-written and erode trust with a technical audience:

- Reveal constructions: "It's not X, it's Y", "X isn't just Y".
- Rhythmic triplets: "No X, no Y, no Z", "Fast, simple, and reliable".
- Sentences that trail into extra comma clauses or participles ("..., making it easier to ...", "..., ensuring ...").
- Chains of em dashes. Prefer a full stop, a comma or parentheses.
- Buzzwords: seamless, robust, leverage, unlock, empower, elevate, streamline, cutting-edge, game-changer, delve, landscape, journey.
- Throat-clearing intros ("In today's fast-paced world...") and closing summaries that repeat the intro.
- Stacked hedges ("may potentially help to"). Say it, or say what is uncertain and why.
- Bold-everything and bullet lists for content that is really one argument. Use paragraphs for reasoning, lists for parallel items.

Prefer: short sentences, one idea each; an example instead of an adjective; the reader's problem before CDviz's feature.

## Before You Finish

1. Every claim about CDviz behavior matches the code or the collector `--help` output (`src/docs/cdviz-collector/*-help.txt`).
2. Code and config samples are real: import them with `<<<` from real files when possible (see `docs.md`).
3. Links are root-relative for internal pages (`/docs/...`) and don't hit redirects; `mise run build` runs the URL check.
4. Format only the files you changed (`dprint fmt <files>`).
