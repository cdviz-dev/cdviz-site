# CDviz Video Production — Design Rules

Applies to: YouTube shorts, feature demos, tutorials, Blender renders, and Hyperframe.ai compositions.

---

## 1. Canvas Specifications

| Format                  | Dimensions    | Frame rate |
| ----------------------- | ------------- | ---------- |
| YouTube Short / Reel    | 1080 × 1920px | 60fps      |
| Feature demo / tutorial | 1920 × 1080px | 60fps      |
| Thumbnail               | 1280 × 720px  | —          |
| Brand intro / outro     | 1920 × 1080px | 60fps      |

Safe zones: keep text and logos inside 10% margin from all edges (108px at 1080p; 192px at 1920p).

---

## 2. Color in Video

CSS `oklch` values don't apply in video. Use these sRGB equivalents:

| Role                 | sRGB Hex  | Usage                                               |
| -------------------- | --------- | --------------------------------------------------- |
| Background           | `#0e151b` | Scene background, card fill                         |
| Primary (orange)     | `#f29107` | CTAs, highlight text, icon accents, callout borders |
| Body text            | `#c9d2de` | Captions, body overlays                             |
| Secondary (purple)   | `#a294c2` | Secondary labels, dividers                          |
| Accent (deep purple) | `#725190` | Gradient endpoints only                             |
| Raised surface       | `#111820` | Card backgrounds, lower thirds                      |

**Color grading:**

- Screen recordings: no LUT. Match the OS dark theme as closely as possible to `#0e151b`. Use macOS "Black" desktop background.
- Blender / 3D renders: apply ACES Filmic tonemapping. Dial back to preserve the near-black at `#0e151b`.
- AI-generated (Hyperframe): desaturate generated color automatically; manually correct to palette above in post.

**What not to do:**

- No bright white (`#ffffff`) in video frames — use `#c9d2de` fog as the brightest text.
- No color-grading filters that shift orange toward red or yellow.
- No dark green, teal, or blue accents for decorative purposes.

---

## 3. Typography in Video

| Role                        | Font           | Weight | Min size at 1080p |
| --------------------------- | -------------- | ------ | ----------------- |
| Title card / main heading   | JetBrains Mono | 700    | 60px              |
| Section heading             | JetBrains Mono | 600    | 48px              |
| Body / subtitle text        | Inter          | 400    | 32px              |
| Caption / lower third label | Inter          | 400    | 28px              |
| Code shown on screen        | JetBrains Mono | 400    | 28px              |

Letter-spacing on all JetBrains Mono at display sizes: `-0.02em` (same as web).

**Lower thirds / labels:**

- Pill container: `background: rgba(14, 21, 27, 0.85)`, `border-radius: 9999px`, padding `8px 16px`
- Text color: `#c9d2de` (never white)
- No speaker names or social handles in tutorials — keep brand-neutral

---

## 4. Motion Style

### Scene transitions

- **Cut** (default): direct cut between scenes. No transition.
- **Fade** (only when cut is jarring): black fade, ≤6 frames (100ms at 60fps).
- **Forbidden:** wipes, slides, zoom transitions, AI-generated morphs between scenes.

### Text entrances

- Fade-in + `translateY(20px → 0)`, 300ms, `cubic-bezier(0.23, 1, 0.32, 1)`
- Stagger multiple lines: 80ms between items

### Element highlights (callouts)

- Draw-on orange rectangular border or underline: SVG `stroke-dashoffset` animation, 400ms, `ease-out`
- Orange `#f29107`, stroke-width 2px at 1080p
- No filled boxes obscuring content — use border/underline only

### Cursor animation (screen recordings)

- Use system cursor. No custom cursors.
- Zoom in (200%–300%) on the UI element being demonstrated, then zoom out. Smooth: 400ms, `ease-in-out`.
- Highlight clicks: brief circular orange ripple at click point, 300ms fade-out.

### Screen recording UI

- Demonstrate features at real app speed. Do not speed-ramp routine interactions.
- Exception: navigation between pages can be cut (jump-cut) with a "→" title card between.
- App window: no browser chrome unless relevant. Use full-screen or custom window frame.

---

## 5. Hyperframe.ai Usage

- **Background scenes:** use `#0e151b` solid or the data-grid pattern (40×40px grid of orange lines at 3% opacity, color `rgba(242, 145, 7, 0.03)`)
- **Transition style:** "Cut" or "Fade" only. Disable AI-generated morphs, zooms, or 3D camera moves.
- **Text overlays:** always override Hyperframe's default fonts with JetBrains Mono (headings) and Inter (body). Import font via Google Fonts or upload TTF.
- **AI-generated imagery:** off. If used for background plates, desaturate to near-monochrome and color grade to palette.
- **Export settings:** ProRes 4444 (lossless, for post-production) or H.264 at minimum 50Mbps for direct upload. Never compress before final output.

---

## 6. Blender

**Scene setup:**

- Background: `#0e151b` exact (in Blender: World > Background Color = `(0.053, 0.082, 0.107)` in linear RGB)
- Camera: orthographic for diagram-style renders; perspective (FOV 35–50mm) for product showcases

**Materials:**

- Matte surfaces: `Principled BSDF`, Roughness 0.9, Metallic 0, color `#111820`
- Brand accent (glowing): Emission shader, color `#f29107`, strength 1.5–3 (adjust per scene brightness)
- Avoid full PBR photorealism — keep stylized and flat-shaded where possible

**Lighting:**

- Single key light: area light, orange tint (`#f5a030`), positioned 45° above and to the side
- No fill light — embrace deep shadows that match the dark aesthetic
- Ambient occlusion: subtle (factor 0.3), contributes to depth without muddying the dark values
- HDRI: off (artificial studio lighting only)

**Output:**

- Minimum 2K (2048 × 2048 or 1920 × 1080 at 2× render scale for downsampled final)
- Transparent background where compositing over video: PNG sequence with alpha
- For standalone renders: `#0e151b` background baked in, EXR format for post grading

---

## 7. YouTube Thumbnail

Constraints: must read clearly at 100px width (search results).

**Layout:**

- Background: `#0e151b` with optional data-grid overlay (subtle — 3% opacity)
- One hero element: dashboard screenshot OR Excalidraw diagram (not both)
- Title text: JetBrains Mono 700, `#f29107`, max 5 words, top or left third of frame
- CDviz logo: bottom-right corner, 80px height, `cdviz.svg`

**What not to do:**

- No stock photos of people pointing at screens
- No bright colored gradients as background
- No text at the bottom (obscured by YouTube timestamp)
- No more than 2 text elements total

---

## 8. Brand Intro Animation (≤3 seconds)

Reference sequence:

1. `#0e151b` frame (0ms)
2. Data-grid pattern fades in (0–300ms, fade-in from opacity 0)
3. CDviz logo SVG strokes draw on (300–1500ms, `stroke-dashoffset` animation, orange `#f29107`)
4. Orange glow pulse on logo (1500–2000ms, `box-shadow` / emission pulse)
5. Logo holds, grid fades out slightly (2000–3000ms)

Typography: `cdviz` wordmark in JetBrains Mono 700, lowercase, `#f29107`

Audio: optional single short tone ≤1s duration, no music bed under a 3s animation. Silence is acceptable.

**No brand outro** longer than 1s — end videos with the product, not branding.

---

## See also

- `../DESIGN.md` — root design system (brand identity, voice, visual rules)
- `SAAS.md` — SaaS UI surface rules
- `DOCS.md` — documentation surface rules
