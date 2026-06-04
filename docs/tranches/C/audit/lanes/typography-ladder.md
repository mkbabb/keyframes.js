`depth-text` is glass-ui's (in utilities.css); `dot-fade` is local to AnimatedText.vue — both are orthogonal effect classes that compose with whatever type class is applied. The migration is clean. I have a complete, evidence-backed picture. Here is my report.

---

# Tranche-C Lane Report — TYPOGRAPHY + the φ-ladder (C's HEADLINE)

**Summary:** The demo runs an entirely ad-hoc raw-Tailwind type scale (267 raw-rung occurrences across `text-8xl`…`text-xs`) bolted to a single hand-rolled `.instrument-serif` alias (44 source sites / 20 files) — there is no semantic ladder, no display register, and the hero h1 (B.W5's deferred headline) is `text-6xl/lg:text-8xl` on Instrument-Serif-as-body. glass-ui already ships the complete φ-ladder (`--type-*` √φ scale + `@utility text-display-*/text-heading/text-title/text-subheading/text-prose/text-body/text-admin-label/dock-label`) the demo imports but never adopts. The GESTALT move: formalize **one display serif** in `--font-display` (Instrument Serif, the demo's existing voice) and migrate every raw rung onto the semantic ladder, retiring `.instrument-serif`.

## Findings

### 1. **[high] The hero h1 is raw `text-6xl/text-8xl` — C's deferred HEADLINE has no semantic register**
Evidence: `demo/@/components/custom/editor-shell/EditorStartScreen.vue:6` — `class="instrument-serif grid p-0 text-6xl lg:flex lg:text-8xl"`; subtitle h2 at `:22` is `instrument-serif w-full text-5xl font-light italic`; hint h2 at `:28` is `instrument-serif w-full text-2xl font-light italic opacity-50`. Confirmed in `after/home-desktop.png`: "Select an animation" renders as the page's dominant glyph mass at top-left, but it's an arbitrary `text-8xl` (6rem, no clamp) on the body serif — no fluid clamp, no `text-wrap: balance`, no display weight/axis. glass-ui's display rungs ARE clamp-fluid + balanced (typography.css:111-264). This is the single most load-bearing type decision in the product and it currently sits on the raw scale.
Disposition: **SHIP** (this is C's headline; ship the migration as the centerpiece).
GESTALT fix: hero h1 → `.text-display-3` (φ^3, clamp 2.618→4.236rem) or `.text-display-4` (φ^(7/2), clamp 3.33→5.382rem) for full poster presence; both carry `text-wrap: balance`, `--type-tracking-tight`, `--type-leading-display` for free. Drop `text-6xl lg:text-8xl` entirely — the clamp replaces the `lg:` breakpoint hop. Keep the orthogonal `.depth-text` (glass-ui) + `AnimatedText` stagger — they compose cleanly with the type class.

### 2. **[high] `--font-display` is never defined in the demo — every display rung silently falls to Georgia**
Evidence: `demo/@/styles/style.css:7` defines only `--font-serif: "Instrument Serif", Georgia, serif`; grep for `--font-display` in demo source returns ZERO definitions (the lone hit at `AssetViewport.vue:52` merely *reads* `var(--font-display)` for an asset default). glass-ui's `text-display-*`/`text-title`/`text-heading` all resolve `font-family: var(--font-display)` (typography.css:153,191,257,271,280) which defaults to Fraunces — **a face the demo never loads** (`demo/*/index.html` load only Instrument Serif + self-hosted Fira Code; no Fraunces, no glass-ui `styles/fonts` import). So adopting the ladder naively would render the hero in Georgia.
Disposition: **SHIP** (prerequisite for the whole migration — must land in the same change).
GESTALT fix: in `style.css` `@theme` block (alongside `--font-serif`), add `--font-display: "Instrument Serif", Georgia, serif;` — formalizing the demo's existing single display serif as the display voice. Instrument Serif IS the demo's character (per `after/home-desktop.png`); this makes the ladder resolve correctly with zero new font payload. Optionally set `--font-display-weight` to taste (Instrument Serif is single-weight ~400, so the default 400 is correct; no `WONK/SOFT` axes — they no-op gracefully on a non-Fraunces face).

### 3. **[high] `.instrument-serif` (44 sites/20 files) is a redundant hand alias the φ-ladder subsumes**
Evidence: defined at `demo/@/styles/utils.css:84` as `{ font-family: var(--font-serif); letter-spacing: 0.02em; }`. It re-implements what glass-ui's serif classes already encode (font-family + tracking), forcing every site to *also* hand-pick a raw rung (`instrument-serif text-xl`, `instrument-serif text-lg`, `instrument-serif text-sm`, etc.). It's a font-family band-aid because the demo never adopted the semantic classes. Note `AnimationMenuBar.vue:118` even stacks all three: `dock-label instrument-serif text-lg` — a tell that the alias and the rung and the dock register are all fighting over the same element.
Disposition: **KILL** (`.instrument-serif` is legacy by the MANDATE; remove the alias, migrate all sites).
GESTALT fix: delete `.instrument-serif` from utils.css; replace every `instrument-serif text-N` pair with the single semantic class that already bundles font + size + line-height + tracking + weight (mapping table below). The `0.02em` tracking baked into the alias is design noise — the ladder's per-register `--type-tracking-*` is the correct, intentional tracking.

### 4. **[med] 267 raw rungs across 8 distinct sizes = an undocumented parallel scale fighting the φ-ladder**
Evidence (source-only counts): `text-8xl`×1, `text-6xl`×1, `text-5xl`×3, `text-3xl`×2, `text-2xl`×5, `text-xl`×8, `text-lg`×11, plus `text-base`/`text-sm`/`text-xs` at body/label scale. These are Tailwind's default 1.25-ratio steps — they do NOT align to glass-ui's √φ (1.272) ladder, so the demo's headings and the glass-ui components it embeds (dock, cards, popovers) sit on two incommensurate scales. Visible in `after/easing-desktop.png`: the "Easing Preview" dock label, "Singular" mode label, and `f(t)`/`1`/`t` axis glyphs are all separately sized rather than drawn from one register set.
Disposition: **SHIP** (migrate wholesale).
GESTALT fix: the class-by-class mapping table below. Net effect: 8 raw sizes collapse to ~6 semantic registers, all on the √φ ladder, all inheriting correct line-height/tracking/weight/balance.

### 5. **[med] Dock labels use `text-xl`/`text-lg` raw, ignoring glass-ui's purpose-built `dock-label` register**
Evidence: `TopDock.vue:146,151,172,178,214` and `AnimationMenuBar.vue:33,43,118,124` size dock-pill labels (Controls/Scene/Timeline triggers, selected-animation name) with raw `instrument-serif text-lg`/`text-xl`. glass-ui CHANGELOG:2023-2030 documents the exact precedent: `.text-heading` reads as literal bold inside a dock pill, so `dock-label` (weight 400, `--type-subheading` size, `--font-display` pinned) was created specifically for "text labels INSIDE dock-tab-button (Start, Next, Submit, …)" (typography.css:295-308). The demo already half-knows this — `AnimationMenuBar.vue:118` applies `dock-label` then *overrides* it with `instrument-serif text-lg`.
Disposition: **SHIP** (adopt `dock-label` cleanly; remove the override stack).
GESTALT fix: dock trigger/label spans → bare `.dock-label` (drop the `instrument-serif text-lg/text-xl`). It pins `--font-display` (now = Instrument Serif per Finding 2) and sizes to `--type-subheading` (√φ rung, 1.272rem). For dock-internal selected-animation names that need emphasis, `.dock-label font-semibold` is the idiomatic composition.

### 6. **[low] Body/label/caption raw rungs (`text-base`/`text-sm`/`text-xs` on `.instrument-serif`) should map to `text-body`/`text-small`/`text-caption`/`text-admin-label`**
Evidence: `text-sm`×49 (23 files), `text-xs`×79 (20 files), `text-base`×28; on `.instrument-serif` specifically: `AnimationControlsGroup.vue:247` (`text-base` ribbon buttons), `PlaybackRibbon.vue:36` (`text-base`), `LayerConfigPanel.vue:15` (`text-base`), `EasingSidebar.vue:38,49,74` + `SpringSidebar.vue:8,25,62,84` + `EasingSelect.vue:33` (`text-xs` muted labels), `KeyframeTimeline.vue:45,73` (`text-sm`). The `text-xs text-muted-foreground` uppercase-ish parameter labels (`steps`, `jump`, `response`, `dampingFraction`) are exactly the `text-admin-label` register (mono, 10px, uppercase, caps tracking) — currently they're serif lowercase, an inconsistency with glass-ui's control-panel idiom.
Disposition: **BOOK** (lower-stakes long tail; book as a follow-on sweep so C's headline ships clean, not blocked on 156 leaf sites).
GESTALT fix: `text-base`→`.text-body`; `text-sm`→`.text-small`; `text-xs` muted control labels→`.text-admin-label` (or `.text-mono-caption` if uppercase reads too loud); `text-caption` for italic captions. The "or drag M. cubert" sub-hint in `after/home-desktop.png` → `.text-caption` (serif italic, already its visual treatment).

---

## Class-by-class migration mapping table

| Demo element | File:line | Current (raw) | → glass-ui φ-ladder | Rationale |
|---|---|---|---|---|
| **Hero h1** ("Select an animation") | `EditorStartScreen.vue:6` | `instrument-serif text-6xl lg:text-8xl` | **`.text-display-4`** (or `-3`) | φ^(7/2) fluid clamp replaces the `lg:` hop; `text-wrap: balance`, tight tracking, display leading for free; resolves to Instrument Serif via new `--font-display` |
| **h2 subtitle** ("from the list … above.") | `EditorStartScreen.vue:22` | `instrument-serif text-5xl font-light italic` | **`.text-title`** + `italic` | φ^(3/2) (2.058rem) heading register; keep `italic`; drop `font-light` (title weight is intentional) |
| **h2 hint** (secondary line) | `EditorStartScreen.vue:28` | `instrument-serif text-2xl font-light italic opacity-50` | **`.text-subheading`** + `italic text-muted-foreground` | √φ subheading; swap `opacity-50` → `text-muted-foreground` (audacious-canon mutes by colour, not alpha — glass-ui P.W1.B precedent) |
| **Cube face number** | `CubeTarget.vue:70` | `instrument-serif text-5xl font-bold` | **`.text-display-2`** | φ^(5/2) display glyph; it's a poster numeral, belongs on display ladder |
| **Card titles** | `KeyframesEditor.vue:84`, `MatrixEditor.vue:48` | `text-3xl` | **`.text-heading`** | φ heading register (the canonical section-title rung) |
| **Dialog/Drawer titles** | `CSSPasteDialog.vue:12`, `ResponsiveSelect.vue:56` | `instrument-serif text-lg`/`text-xl` | **`.text-subheading`** | √φ; modal titles are subheading-scale, not body |
| **Target name spans** (Easing/Spring) | `EasingTarget.vue:8`, `SpringTarget.vue:7` | `instrument-serif text-xl lg:text-2xl` | **`.text-heading`** | φ heading; clamp removes the `lg:` hop |
| **Dock trigger/select labels** | `TopDock.vue:146,151,172,178,214`, `AnimationMenuBar.vue:33,43,118,124` | `instrument-serif text-lg`/`text-xl` (+ stacked `dock-label`) | **`.dock-label`** (`+ font-semibold` for selected name) | Purpose-built dock register; pins `--font-display`, weight 400 (not pill-bold); remove the `instrument-serif text-N` override stack |
| **Ribbon/playback buttons** | `AnimationControlsGroup.vue:247`, `PlaybackRibbon.vue:36` | `instrument-serif text-base` | **`.text-body`** | body register |
| **z-index / control labels** | `LayerConfigPanel.vue:15` | `instrument-serif text-base` | **`.text-body`** | body |
| **Timeline zoom / caret labels** | `KeyframeTimeline.vue:45,73` | `instrument-serif text-sm` | **`.text-small`** | small register |
| **Sidebar param labels** (`steps`, `jump`, `response`, `dampingFraction`, `duration`) | `EasingSidebar.vue:38,49,74`, `SpringSidebar.vue:8,25,62,84`, `EasingSelect.vue:33`, `EasingTarget.vue:19` | `instrument-serif text-xs/text-sm text-muted-foreground` | **`.text-admin-label`** (or `.text-mono-caption`) | Mono uppercase control-label idiom — matches glass-ui control panels |
| **Sub-hint caption** ("or drag M. cubert") | (EditorStartScreen consumer / hint) | italic small | **`.text-caption`** | serif italic caption register (already its look) |

## Prerequisite + cleanup (must land with the migration)
- **Add** `--font-display: "Instrument Serif", Georgia, serif;` to `demo/@/styles/style.css` `@theme` (Finding 2). Without it, display rungs render Georgia.
- **Delete** `.instrument-serif` from `demo/@/styles/utils.css:84-87` after the sweep (Finding 3).
- **Keep** orthogonal effect classes — `.depth-text` (glass-ui utilities.css), `.dot-fade` (local `AnimatedText.vue:83`), `AnimatedText` stagger — they compose with any type class; the migration touches only the font/size/tracking layer.
- **Sequencing for C:** Findings 1, 2, 3, 5 + the hero/heading rows are the HEADLINE (ship together, fully visible in home + easing screenshots). Finding 6 (the 128-site `text-sm`/`text-xs` leaf tail) is BOOKED as a mechanical follow-on so the headline isn't gated on it.