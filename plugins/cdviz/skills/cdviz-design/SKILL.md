---
name: cdviz-design
description: CDviz design system (open-source SDLC observability platform built on CDEvents) - colors, typography, spacing, motion, components, diagrams, accessibility, logos and fonts. Use for any CDviz UI or visual work - the cdviz.dev website and docs (VitePress + Tailwind), the CDviz Cloud app (Dioxus + DaisyUI), slides, videos, diagrams, mockups or HTML prototypes.
user-invocable: true
---

Read `DESIGN.md` first: it is the single authoritative reference (brand identity, colors, type, spacing, motion, components, diagrams, voice, accessibility).
Then read the `surfaces/` file of the target: `DOCS.md` (website and docs), `SAAS.md` (CDviz Cloud app), `VIDEO.md` (videos).

- For visual artifacts (mockups, prototypes): copy assets from `assets/`, create static HTML files.
- For production code: apply rules from `DESIGN.md` + the surface file. Tokens: `colors_and_type.css` (web), `daisyui-theme.css` (DaisyUI).
- For copy and text (headings, CTAs, docs, articles): use the `cdviz-writing` skill.
- If invoked without guidance: ask what to build or design, then output HTML artifacts or production code as appropriate.

## Assets

Symlinks to the canonical files of the [cdviz-site](https://github.com/cdviz-dev/cdviz-site) repository (when installed as a plugin they are copied, so they are always real files):

- `assets/logos/`: CDviz + CDEvents logos
- `assets/icons/`, `assets/illustrations/`: dashboard screenshot, undraw SVG, pipeline SVG
- `diagrams/`: Excalidraw architecture + SDLC diagrams
- `fonts/Excalifont-Regular.woff2`: hand-written font for diagrams and hero text
