# Lane 17 — styles & idioms

> SURFACE: `demo/@/styles/` + the whole demo styling system. Grounds VERDICT
> **#26** ("demo/@/styles — what the fuck is this?"), **#28** (non-idiomatic-tailwind
> + fragile-CSS + brittle-selector audits; "localized design idioms with
> colocation"), **#24** (fonts/sizes sitewide inconsistent, "properly leveraging
> glass-ui components"), **#18/#16** (re-authored primitives; "why aren't these
> just glass-ui components?"; the muddy "latent" theme).
> READ-ONLY audit. Evidence is file:line / measurement / shot.

## Census (the shape of the surface)

| Sheet | Lines | Comment-prose % | Token decls | Role |
|---|---:|---:|---:|---|
| `@/styles/style.css` | 636 | **65%** | 84 | Tailwind import, @theme, dock-anchor calc web, z-contract, base layer |
| `@/styles/design-idioms.css` | 887 | **72%** | 54 | "the demo's OWNED design vocabulary" — grab-bag of every idiom |
| `@/styles/brand.css` | 38 | 50% | 0 | `.ppmycota-*` brand-mark rules |
| `animation-transport/AnimationControlsGroup.css` | 224 | — | — | the macro rail·stage grid (SFC-sourced) |
| `animation-transport/components/ControlsPaneWrapper.css` | 302 | — | — | the sheet/pane sizing (SFC-sourced) |
| `controls/playback-button.css` | 91 | — | — | `.btn-playback*` skin |
| `controls/tab-trigger.css` | 81 | — | — | `.tab-trigger-*` skin |
| `scenes/cube/CubeTarget.css`, `scenes/sequence/SequenceTarget.css` | 223 / 260 | — | — | scene-target CSS (SFC-sourced) |
| **52 SFCs** with `<style>` (48 `<style scoped>`, 4 `src=`) | **~3290** | — | — | scene + component scoped CSS |

Numbers derived live: `find demo -name '*.css'`, per-file `wc -l`, comment-line
`awk` scan, `grep -rl '<style'`.

---

## Findings

### F1 — The two global stylesheets are tranche-archaeology LOGS, not a design system. This IS "wtf is this." (VERDICT #26)

`style.css` is **65% comment prose**; `design-idioms.css` is **72% comment
prose**. Between them they carry **76 tranche-code annotations** ("K.W3" ×9,
"J.W7a" ×8, "K.W4" ×6, "D.W2" ×6, "E.W3"/"E.W11" ×4 each, "L.W11", "H.W11"…),
plus `proof:*` gate names, `inv-16`, `U-K6`, `WV-W7-HIGH-5`, `cross-hierarchy #4`
markers. A representative single token:

- `style.css:225-249` — `--dock-band-reserve` / `--dock-band-reserve-stable`
  carry ~50 lines of prose citing "J.W4 S7 (CH-3/M1 re-certification)",
  "proof:live-session-mobile", "the I ledger's CH-3 row".
- `design-idioms.css:565-599` — `.progress-rail`/`.progress-ball` carry a
  35-line changelog ("W11's commit claimed… but promoted the conic-gradient
  PLAYING-RING — a DIFFERENT primitive… four scoped blocks are REMOVED").

**Root cause.** The styling files were used as the tranche journal. Every wave
wrote its rationale INTO the stylesheet instead of into `docs/`. A reader opening
`design-idioms.css` to learn "what is the demo's design language" is buried under
a multi-tranche edit-history no current maintainer needs. The *current contract*
(what token exists, what it resolves to, who consumes it) is 1 line in 4.

**T recommendation.** Strip the archaeology to `docs/`. Each rule keeps at most a
one-line *present-tense* intent ("`--dock-band-reserve`: the bottom dock's
exclusion band; consumed by the mobile sheet anchor"). The wave-by-wave "why we
changed it" narrative moves to a single `demo/@/styles/HISTORY.md` (or is dropped
— git blame already holds it). Target: both sheets ≤35% comment, and no rule
comment names a tranche code. Gate: `grep -cE '\b[A-Z]\.W' demo/@/styles/*.css`
== 0.

---

### F2 — `design-idioms.css` (887L) is a monolith over the 500L ceiling, and is NOT "ONE localized design-idiom layer" — it is a catch-all. (VERDICT #28 "no god modules (>500L)")

The file holds, in one flat scroll: two `@property` registrations
(`--rail-width`), a 245-line `:root` token dump, a `.dark` token block, the
`.focus-ring` a11y contract, `.tap-floor`, `.text-gold`, the `icon-{xs..lg}`
`@utility` family, `ppmycota-stroke`, `.cartoon-surface:has()` focus elevation,
`.progress-bar`/`.progress-dot`/`.progress-rail`/`.progress-ball`,
`.readout-accent`, `.stage-field-{x,y}`, the `.status-badge` family,
`.code-token`, the `.labeled-field-grid` subgrid system, `@keyframes enter`, and
the global `body.is-dragging` select-suppression (design-idioms.css:879-887).
Half of these are dead-comment TOMBSTONES for DELETED rules
(`.scale-on-hover` — DELETED at :425; `.gold-shimmer` — DELETED at :472;
`.dock-inset` — DELETED at :698; the specular subsystem — REMOVED at :446), each
retaining a 15-40 line eulogy.

**Root cause.** "The demo's owned vocabulary" was read as "one file for
everything the demo owns," so tokens, a11y primitives, motion-badge recipes,
layout subgrids, keyframes, and a global gesture side-effect all landed together.
The DELETED-rule eulogies (no-legacy done as *commentary* rather than *removal*)
inflate it further.

**T recommendation.** Split into a small tiered set, delete the tombstones:
- `tokens.css` — the tiered custom-property authority (see F3).
- `idioms.css` (≤200L) — the genuine reusable recipes: `.focus-ring`,
  `.tap-floor`, `.status-badge`, `.readout-accent`, `.code-token`,
  `.labeled-field-grid`, the `icon-*` family.
- Motion primitives (`.progress-*`, `.stage-field-*`) evaluated for glass-ui
  consumption first (F5) — what survives goes in `idioms.css`.
- `body.is-dragging` suppression → colocate with its owner
  `@/composables/gestureSelectSuppression.ts`'s companion CSS (it is a behavior,
  not a design idiom).
- DELETED-rule eulogies: removed outright (git holds them).
Gate: every file in `demo/@/styles/` ≤ 300L; zero `— DELETED` / `— REMOVED`
comment blocks.

---

### F3 — Token authority is split-brain: 138 custom properties across 3 `:root` + 2 `.dark` blocks in two files, with no tiering and an arbitrary partition. (VERDICT #26)

`style.css` declares tokens at `:root` (line 114), `.dark` (402), and a nested
`:root` inside `@media(max-width:1023px)` (497) — **84 declarations**.
`design-idioms.css` declares more at `:root` (68) and `.dark` (318) — **54
declarations**. The split is not principled: `--color-progress` (the motion-red
authority) lives in `style.css:388`, but `--rainbow-*` (which
`--spring-lane-gentle` aliases to `--color-progress`) lives in
`design-idioms.css:78`; `--color-gold` mid-stop is in design-idioms but the axis
crayons `--face-1..6` are in style.css. A maintainer cannot predict which file
owns a token. There is **no tier structure** (literal → semantic → component)
the modern-web CSS guide (§5) prescribes — it is one flat namespace where
`--phi`, `--axis-x`, `--dock-anchor-ceiling`, `--rainbow-violet`,
`--badge-text-mix` sit at the same level.

**Root cause.** Two files each grew a `:root` for historical reasons
(design-idioms.css was carved to "own what the demo depends on" from glass-ui;
style.css kept "layout" tokens) but the boundary eroded — motion color, brand,
and layout tokens now straddle both.

**T recommendation.** ONE `tokens.css`, tiered and commented by tier, single
`:root` + single `.dark` (or `light-dark()`, F9): **(1) literal** — the crayon
`--face-*`, `--rainbow-*`, `--axis-*`, `--phi`; **(2) semantic** —
`--color-progress`, `--accent-red`, `--color-gold`, `--subject-teal`;
**(3) layout/UI** — the dock/work-area/rail family; **(4) component** —
`--badge-*`, `--ball-*`, `--graph-*`. The mobile `@media` `:root` override folds
into the same file's responsive section. Gate:
`grep -c ':root' demo/@/styles/tokens.css` == 1 and no `--` declaration exists
outside `tokens.css` (except SFC-local component vars). Falsifiable via a
build-CSS scan that every design token resolves from one file.

---

### F4 — No declared cascade-layer order, and a global `*` reset — both flagged anti-patterns. (VERDICT #28)

`style.css` uses `@layer base` (562), `@layer utilities` (595),
`@layer demo-typography` (632) but **never declares the layer order** (`@layer
reset, base, theme, components, utilities;`). Ordering is left to source-position
accident, and the `demo-typography` layer relies on "declared LAST so it wins"
(style.css:632 comment) — the exact brittleness cascade layers exist to remove.
Worse, `style.css:562-565`:

```css
@layer base { * { @apply border-border } }
```

is a **global `*` reset** — the modern-web CSS guide §2 "No global resets":
*"DO NOT use styles on `*` — they cannot be overridden by web components or
lower-priority cascade layers without `!important`."*

**Root cause.** Layers were adopted piecemeal (one per wave) without an
architectural ordering statement; the `*` border reset is a Tailwind-v3-era
shadcn holdover.

**T recommendation.** Declare `@layer reset, base, tokens, glass, components,
utilities, demo;` once at the top of `style.css`, assign each block to its layer,
and let intent (not source order) resolve the cascade — `demo-typography` becomes
the `demo` layer that provably outranks glass-ui `utilities` without the
"declared last" trick. Replace the `* { border-border }` reset with a scoped
default on the element types that actually take borders. Gate:
`grep -q '@layer reset,' style.css` and `grep -cE '^\s*\*\s*\{' demo/@/styles`
== 0.

---

### F5 — Re-authored glass-ui primitives: the KfPillTabs / tab-trigger pill strip and the progress rail. glass-ui already ships these. (VERDICT #18, #16, #24, #27)

glass-ui 4.0.1 ships `dist/styles/segmented-tabs.css` — a full
`.segmented-tabs` / `.segmented-tab` / `.segmented-indicator` system with an
animated (anchor-positioned) sliding indicator. The demo instead hand-rolls the
SAME register **three times**:
- `KfPillTabs.vue` `<style scoped>` — `.kf-pill-tabs` / `.kf-pill-tab` with
  `data-state` active/inactive + `color-mix(foreground 5%/8%)` (this is shot 16
  — the "Live solver / Discrete transition" strip the owner singled out: *"wtf
  are most of these items? KfPillTabs.vue?? Why aren't these just glass-ui
  components?"*).
- `controls/tab-trigger.css:54-62` — `.tab-trigger-pill` with the **byte-identical**
  `data-state` + `color-mix(foreground 5%/8%)` recipe.
- glass-ui's own `.segmented-tabs` (unused).

Separately, glass-ui ships `dist/styles/glass/progress-rail.css`
(`@utility glass-progress-rail`, a token-driven restyle of `<Progress>`) while
`design-idioms.css:578-599` re-authors `.progress-rail`/`.progress-ball` by hand.

**Root cause.** Idioms were extracted from the demo into design-idioms.css/SFC
scoped CSS rather than *up* into glass-ui, and when glass-ui later shipped the
first-class primitive the demo copies were never retired — the demo now competes
with its own upstream (the S-tranche "no-legacy beside its replacement" rule
applied within the demo but not across the glass-ui seam).

**T recommendation.** Delete `KfPillTabs.vue` + `useKfPillTabs.ts` +
`tab-trigger.css`'s pill variant; consume glass-ui `SegmentedTabs` (roving
tabindex + sliding indicator come for free). Where glass-ui's component is
insufficient, that gap is a *born-RED glass-ui handoff* (BG/BH forthcoming), not
a demo re-author — delineate it in the report, don't patch it locally. Same
audit for `.progress-rail`/`.progress-ball` vs `glass-progress-rail`. Gate:
`grep -rl 'kf-pill-tab\|tab-trigger-pill' demo` == ∅; a census note listing
which demo scoped-CSS families map to a shipped glass-ui primitive.

---

### F6 — Off-token color literals, including the *banished* green and duplicated gold, live in scene CSS/JS. (VERDICT #28 fragile-CSS; #16 theme)

The K.W4 collapse (style.css:368-410) unified every motion surface onto the
red `--color-progress` and *deleted the green*. But:
- `scenes/spring/SpringHeatmap.vue:119` hard-codes `"hsl(142 71% 45%)"` — the
  **exact banished green** — as the JS fallback when `--color-progress` fails to
  resolve. If the token ever drops, the heatmap paints the color the whole
  redesign removed.
- `scenes/compose/ComposeTarget.vue:126,127,162,166` inline the gold ramp as
  `var(--color-gold, hsl(43 74% 49%))` / `var(--color-gold-light, hsl(51 100%
  50%))` fallbacks — duplicating the token *values* into the leaf, so a future
  gold tune in `tokens.css` silently drifts from these copies.
- `scenes/cube/CubeTarget.css:116-124`, `AmigaScene.vue:310-311`,
  `SheetGrabHandle.vue:78` carry raw `rgba()`/`hsl()` lacquer/overlay literals
  off the token ladder.

9 raw `hsl()/rgba()` literals total in SFC CSS (`grep -c` live).

**Root cause.** Defensive `var(--x, <literal>)` fallbacks were written with the
literal spelled out instead of a *token* fallback; the heatmap green predates the
collapse and was never swept.

**T recommendation.** Fallbacks reference a token, never a literal
(`var(--color-gold, var(--color-gold-fallback))`); the SpringHeatmap JS reads
`--color-progress` with a red token fallback, never the green. Lacquer/overlay
literals that are genuinely component-local become named component vars in the
SFC. Gate: `grep -rnE '(hsl|rgba?)\([0-9]' demo --include=*.vue --include=*.css`
returns only allow-listed component-local vars; and specifically the string
`142 71% 45%` appears nowhere.

---

### F7 — The dock-anchor / work-area token web is a fragile calc/min/max labyrinth whose own comments document the fragility. (VERDICT #28 fragile-CSS; #19 "performance… rethought from the ground up")

**31** interdependent `--dock*` / `--work-area*` / `--stage*` / `--sheet*`
tokens, **27 `calc()`** across `style.css` + `ControlsPaneWrapper.css`, form a
chain where a single geometric fact (the mobile sheet must clear the menubar)
threads through `--dock-band-reserve` → `--dock-bottom-anchor` →
`--dock-menubar-reserve` → `--stage-reserve` → `--sheet-detent-expanded`, each
referencing a `--menubar-measured-h` published by JS (ResizeObserver). The code
carries **its own fragility warnings**: style.css:206-224 explains a
custom-property *cycle* (`max-height → bottom-offset → slack → height →
max-height`) that had to be broken by hand; a whole *duplicate* stable-token
subtree (`--dock-band-reserve-stable`, `--dock-top-anchor-stable`,
`--work-area-max-height-stable`, style.css:233-249, 539-558) exists solely
because the live chain oscillates ±8px when the sheet toggles. The `--mask-fade`
edge-fade recipe is even repeated verbatim within one file
(ControlsPaneWrapper.css:286-300, both `-webkit-mask-image` and `mask-image`
with the identical 4-stop gradient).

**Root cause.** Layout constraints were solved by accreting derived tokens rather
than by a single layout primitive. The docks are `position: fixed` and must
*reverse-derive* their exclusion bands into the content sizing — so every new
constraint spawns another token, and the JS-measured menubar height re-enters CSS
as a live value that then needs a "stable peak" twin to avoid feedback.

**T recommendation.** This is the strongest case for the modern `anchor-name` /
`anchor()` primitive the file already gates behind `@supports`
(style.css:440-462) — make it the *primary* mechanism, not a progressive
enhancement over a hand-derived floor. The docks tether to the stage-cell rect
directly; the reserve-band calc chain collapses to the anchor geometry. For the
oscillation, prefer a `contain`ed layout or a single ResizeObserver-published
`--menubar-h` consumed once, retiring the `*-stable` twin subtree. Fold the
duplicated mask recipe into a single `:where()`-friendly rule. Gate: the
`--dock*`/`--work-area*` token count drops (target < 15); no `*-stable` twin
tokens; `proof:*` mobile-sheet gates stay green on the anchor path.

---

### F8 — 3290 lines of scoped SFC CSS with cross-scene duplication of the same micro-patterns; colocation exists but the *shared idiom* for the recurring bits does not. (VERDICT #28 DRY; #26 "recursively composed sub-components")

Scene targets are heavy: EasingTarget.vue (253L), EasingCurveCanvas.vue (235L),
MotionPathTarget.vue (216L), SpringTarget.vue (186L), MorphTarget.vue (153L),
SquareScene.vue (161L). Across them the same primitives recur hand-rolled: the
mono-caption readout chip (`.cube-attitude` CubeTarget.css:199-215;
`.seq-row-*` SequenceTarget.css; per-scene readouts), `.stage-field-{x,y}`
consumers, `position:absolute` z-ordered micro-stacks with local `--z-seq-*`
tokens (SequenceTarget.css:22-25). The D-tranche idiom pass promoted *some* of
these (`.status-badge`, `.progress-*`) but scene-local readout/telemetry chips
and mono captions were left per-scene. Meanwhile a genuinely GLOBAL side-effect
(`body.is-dragging` select-suppression) sits *in* the "idioms" file
(design-idioms.css:879), inverting the colocation principle.

**Root cause.** Colocation was applied at the *file* granularity (each scene owns
its CSS) but not at the *idiom* granularity (recurring chip/telemetry/mono-caption
patterns were never lifted to a shared recipe), so each scene re-expresses the
same drafting-stamp register.

**T recommendation.** Extract the recurring scene-telemetry primitives (the mono
readout chip, the drafting-stamp axis tag, the gesture-tell caption) into named
idioms in `idioms.css` (or glass-ui `icon-chip`/`text-mono-*` if they fit —
F5-style census first). Move the `body.is-dragging` behavior out of the idiom
layer to its composable. Target: scene-target CSS shrinks (no scene-target file
> 150L) with the shared register single-sourced. Gate: a `proof:` that the mono
readout chip resolves from ONE rule, consumed by ≥3 scenes.

---

### F9 — Typography & theme: direct `font-family` bypasses the glass-ui ladder, dark-mode duplicates every token block, and the composite reads "muddy." (VERDICT #24, #16)

The glass-ui `text-*` φ-ladder *is* used well in templates (text-mono-caption ×69,
text-small ×24, text-display ×14). But **17 scoped rules set `font-family`
directly** (`var(--font-mono)` ×10, `var(--font-display)` ×5,
`var(--font-text)` ×1) — bypassing the ladder utilities that would carry
size+line-height+family together — and **8 raw `font-size` literals** sit off the
`--type-*` ladder (MorphTarget.vue:311 `0.9rem`; GestureLegend.vue:104 `0.85em`;
EasingCurveCanvas.vue:494 `0.055px`). style.css itself carries a ~30-line comment
(46-82) admitting the *prior* comment "LIED on three counts" about which
utilities bind `--font-display` — the typography wiring is confusing enough that
its own documentation was wrong through four tranches.

Theming duplicates every dark value: `.dark` blocks in BOTH style.css:402 and
design-idioms.css:318 re-declare `--accent-red`, `--color-progress`,
`--color-gold*`. The composite (shot 16) reads as a muddy warm-grey/brown plate —
the owner's *"I don't like this latent red theme… looks awful."* The `.dark`
class approach also means `color-scheme` is set imperatively (style.css:115
`color-scheme: light` hard-coded at `:root`, not `light dark`).

**Root cause.** `--font-display`/`--font-text` are overridden through a
multi-hop bridge against glass-ui's `@theme inline` (`--font-stack-*`), which is
brittle enough that components hand-set `font-family` to be sure — and the dark
palette was authored as duplicated class blocks rather than `light-dark()`
semantic tokens.

**T recommendation.** (a) Route every text surface through a glass-ui `text-*`
utility (or a demo semantic class that composes one) — zero bare `font-family`
in scoped CSS; retire the raw font-size literals onto `--type-*`. (b) Consolidate
the two `.dark` blocks into the single `tokens.css` (F3); evaluate
`color-scheme: light dark` + `light-dark()` semantic tokens to halve the dark
maintenance — **reconciled against glass-ui's own `@custom-variant dark` class
strategy** (if glass-ui themes by class, the demo stays class-based but
single-sourced; the win is de-duplication, not necessarily `light-dark()`).
(c) The muddy-plate palette is a design-system decision for the Fable/frontend
design pass — surface it, don't guess a hue here. Gate:
`grep -cE 'font-family:' demo --include=*.vue --include=*.css` drops to the
handful of legitimate mono-code surfaces; one `.dark` block repo-wide.

---

### F10 — Raw viewport-unit literals leak into templates off the token ladder. (VERDICT #28 fragile-CSS, viewport-unit traps)

Despite the design-idioms.css `--target-viewport-*` / `--panel-max-h` tokens
that exist precisely to name recurring viewport fractions, templates still carry
raw ones: `AssetViewport.vue:17` `pt-[18vh]`, `KeyframesAddDialog.vue:37`
`min-h-[25vh]`, `CSSPasteDialog.vue:54` `min-h-[20vh]`, `DemoGlobalChrome.vue:32`
`max-w-[90vw]`. These are `vh`/`vw` (not the mobile-correct `dvh`/`svi` the token
layer standardized on, design-idioms.css:155) — the exact URL-bar over-reservation
trap the `--panel-max-h` comment calls out.

**Root cause.** New sub-components (compose asset-manager, dialogs) authored
bracket literals directly instead of reaching for the token layer they may not
have known existed (a discoverability failure of the split-brain token authority,
F3).

**T recommendation.** Route each to a `tokens.css` entry (or a semantic
`max-w`/`min-h` utility), on `dvh`/`svh`. Gate:
`grep -rnE '\-\[[0-9]+(vh|vw)\]' demo --include=*.vue` == ∅ (only `dvh`/`svh`/`svi`
via tokens permitted).

---

## Target styling architecture

```
demo/@/styles/
├── style.css        # entry: @import order + @layer declaration + @theme + base.
│                    #   Declares `@layer reset, base, tokens, glass, components,
│                    #   utilities, demo;` ONCE. ≤120L, <35% comment.
├── tokens.css       # THE single token authority — tiered (literal/semantic/
│                    #   layout/component), ONE :root + ONE .dark (or light-dark()).
│                    #   The mobile @media :root override lives here. ≤250L.
├── idioms.css       # the genuine reusable recipes only: focus-ring, tap-floor,
│                    #   status-badge, readout/mono-chip, labeled-field-grid,
│                    #   icon-*, code-token. Everything else consumes glass-ui. ≤200L.
└── brand.css        # unchanged (already a clean colocated partial).
```

Principles: **(1)** glass-ui-first — census every hand-rolled recipe against a
shipped glass-ui primitive (segmented-tabs, progress-rail, text-* ladder,
icon-chip, squircle) before it earns a demo home; gaps are born-RED glass-ui
handoffs, not local re-authors. **(2)** One tiered token file; no token outside
it (bar SFC-local component vars). **(3)** Declared cascade-layer order; no `*`
reset; `:where()` for low-specificity defaults. **(4)** Comments state the
present contract in one line; the tranche history lives in `docs/`, not the CSS.
**(5)** Colocation at the *idiom* granularity — recurring scene chips are one
shared recipe; genuinely-global behaviors (drag suppression) live with their
composable, not in the idiom layer. **(6)** Isomorphic where it can be (token
re-homing, comment stripping change zero pixels); the palette/typography
*look* changes are routed through the Fable/frontend-design pass, not guessed
in CSS.

---

## T recommendations

1. **De-archaeologize the style sheets** · Strip all tranche-code/`proof:`/`inv-`
   prose from `style.css` + `design-idioms.css`; each rule keeps ≤1 present-tense
   line; history → `docs/`/git. · Gate: `grep -cE '\b[A-Z]\.W[0-9]' demo/@/styles/*.css`
   == 0 AND both sheets <35% comment lines. · **S**

2. **Split & de-tombstone `design-idioms.css`** · Break the 887L monolith into
   `tokens.css` + `idioms.css`; delete the DELETED/REMOVED eulogy blocks; move
   `body.is-dragging` to its composable's CSS. · Gate: no file in
   `demo/@/styles/` > 300L; zero `— DELETED`/`— REMOVED` comment blocks. · **M**

3. **One tiered token authority** · Consolidate 138 tokens from 3 `:root` + 2
   `.dark` blocks across two files into a single tiered `tokens.css` (literal →
   semantic → layout → component), one `:root`, one `.dark`. · Gate: exactly one
   `:root` in `tokens.css`; no `--` design-token declaration elsewhere in
   `demo/@/styles/`. · **M**

4. **Declare cascade-layer order; kill the `*` reset** · Add `@layer reset, base,
   tokens, glass, components, utilities, demo;`; assign every block; replace
   `* { @apply border-border }` with scoped defaults; retire the "declared last
   wins" trick. · Gate: `grep -q '@layer reset,' style.css` AND zero `*{}` rules
   in `demo/@/styles/`. · **S**

5. **Consume glass-ui primitives; delete the re-authored pills/rail** · Replace
   `KfPillTabs.vue` + `tab-trigger-pill` + `useKfPillTabs` with glass-ui
   `SegmentedTabs`; audit `.progress-rail/.progress-ball` vs `glass-progress-rail`
   and `.status-badge` vs `icon-chip`; delineate genuine gaps as born-RED glass-ui
   handoffs. · Gate: `grep -rl 'kf-pill-tab\|tab-trigger-pill' demo` == ∅ + a
   demo↔glass-ui primitive-mapping census in the tranche record. · **L**

6. **Purge off-token color literals** · Token-fallback (never literal-fallback)
   every `var(--x, <literal>)`; the SpringHeatmap JS reads a red token, never the
   banished green `hsl(142 71% 45%)`; lacquer/overlay literals become
   component-local vars. · Gate: `grep -rn '142 71% 45%' demo` == ∅ AND no raw
   `hsl()/rgba(` fallback in `var(...)`. · **S**

7. **Collapse the dock-anchor calc labyrinth onto anchor positioning** · Promote
   the `@supports (anchor-name)` tether to the primary dock/stage geometry;
   retire the `*-stable` derived-token twin subtree and the reverse-derived
   reserve chain; de-duplicate the mask-fade recipe. · Gate: `--dock*/--work-area*`
   token count < 15; zero `*-stable` tokens; mobile-sheet `proof:*` gates green on
   the anchor path. · **L**

8. **Lift recurring scene-telemetry idioms to one shared recipe** · The mono
   readout chip / drafting-stamp axis tag / gesture-tell caption become named
   idioms (or glass-ui `text-mono-*`/`icon-chip`); scene-target CSS shrinks. ·
   Gate: no `scenes/**/*Target.{vue,css}` style tier > 150L; the readout chip
   resolves from ONE rule consumed by ≥3 scenes. · **M**

9. **Typography & dark-mode single-sourcing** · Route every text surface through
   a glass-ui `text-*` utility (no bare `font-family` in scoped CSS; raw
   font-sizes → `--type-*`); one `.dark`/`light-dark()` palette reconciled with
   glass-ui's dark strategy. · Gate: `font-family:` in scoped CSS ≤ the code-mono
   allow-list; one `.dark` block repo-wide. · **M**

10. **Token-route the raw viewport literals** · `pt-[18vh]`, `min-h-[25vh]`,
    `min-h-[20vh]`, `max-w-[90vw]` → `tokens.css` entries on `dvh`/`svh`. · Gate:
    `grep -rnE '\-\[[0-9]+(vh|vw)\]' demo --include=*.vue` == ∅. · **S**
