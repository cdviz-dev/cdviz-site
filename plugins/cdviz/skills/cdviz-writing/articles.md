# Blog Articles

Source: `src/blog/` of the cdviz-site repository. The blog index and sidebar are built from the files (`.vitepress/blog-utils.ts`): no manual sidebar entry.

## File and Frontmatter

File name: `src/blog/YYYYMMDD-<slug>.md` (the date is the publication date).

```yaml
---
title: "GitLab, Bitbucket, Jira, and Jenkins transformers are now open source"
description: "One or two sentences: what happened or what the reader learns, with the key nouns for search."
tags: ["cdevents", "open-source", "gitlab"]
author: "David B."
author_github: "davidB"
date: "2026-08-09"
target_audience: "DevOps Engineers, Platform Engineers"
reading_time: "3 minutes"
status: published # or draft: drafts are hidden from the index
series: "CDEvents in Action" # optional, with series_part
series_part: 7
dev_to: # optional cross-post
  title: "..."
  description: "..."
  tags: ["opensource", "devops", "cdevents"] # dev.to allows 4 tags max
  canonical_url: "https://cdviz.dev/blog/YYYYMMDD-<slug>"
---
```

`blog-utils.ts` parses the frontmatter line by line: keep `title`, `date`, `status`, `series` and `series_part` on a single line.

## Kinds of Articles

- **Announcement** (release, licensing change, new integration): what changed, why, what it means for each plan or user, how to try it. Short (3-5 minutes).
- **Tutorial episode** ("CDEvents in Action" series): one problem, one runnable result. Link the previous and next episodes; reuse the demo stack (`demos/` in the cdviz repository) so readers can follow along.
- **Opinion / explainer**: one argument, backed by concrete cases. State the position in the first paragraph.

## Structure

1. H1 = the title.
2. An italic lede (one or two sentences) with the news or the problem. No warm-up.
3. Sections with plain, descriptive headings ("What changed", "Why the strategy changed", "Try it").
4. Reasoning in paragraphs; lists only for parallel items (steps, options, plans).
5. End with a concrete next step (a doc page, a command, the demo), not a recap and not a "star us" ask.

## Tone

- Candid about trade-offs and business reasons (the open-sourcing post says plainly that a company has to earn money). Readers trust explained decisions.
- Credit where due: upstream projects (CDEvents, VRL, Grafana), contributors, coding agents when they mattered.
- Exact versions, dates and names; no "recently", "soon" or "a lot".
