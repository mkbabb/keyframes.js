# Tranche G — Styling Assay (lane `a-styling`)

**Scope.** The demo styling surface on `tranche-g-dev` post-D+E+F (kf 4.0.0
released): (1) non-idiomatic Tailwind — arbitrary values that want tokens,
`!`-overrides, util soup that wants `@apply`; (2) monolithic/global stylesheet
patterns that should be colocated/scoped — the `demo/@/styles` surface
(`style.css`, `design-idioms.css`, `brand.css`); (3) deprecated/archaic CSS;
(4) fragile rules — magic numbers, brittle `calc()`/`min()`/`max()` chains,
viewport-unit traps (`vh`/`dvh`/`cqw`), z-index coupling, browser-specific
breakage. Verify ONE localized design-idiom layer owns the idioms with proper
colocation; design cohesion within the aesthetic. **Read-only — zero source
edits; propose, never write.**

**Method.** Read the F charter + record (`F.md` ALREADY-SOTA, `FINAL.md`) and the
two paired F demo lanes (`audit/a-demo-post-e.md` structural, `audit/r-demo-design-2026.md`
design-token/typography) to diff rather than repeat — the F lanes owned the
rail/ball idiom consolidation (F §1, **verified landed** below), hero typography,
VT, undo, a11y. THIS lane is the pure CSS-hygiene axis they explicitly deferred.
Grounded every claim at `file:line` (source-only greps — `demo/*/dist/` build
artifacts pollute naive greps and are excluded throughout). SOTA claims grounded
on `modern-web-guidance` (Baseline-dated) + the live `@mkbabb/glass-ui` dep at
`node_modules/@mkbabb/glass-ui/dist/styles/`.

**Headline.** **The styling surface is ~90% SOTA and the D.W2 idiom-ownership
discipline holds.** `design-idioms.css` is a genuine single localized idiom layer
(rainbow/gold/hover-lift/focus-ring/rail-ball/tab-slide, all documented, all
gated, imported immediately after the glass-ui cascade); **zero `!important`** in
source (the only hit is a *comment praising their absence*, `EasingSelect.vue:116`);
**zero `@apply` in component SFCs** (centralized in the idiom layer); arbitrary
Tailwind values are overwhelmingly `var(--token)` references after the D/E/F
layout-token migration; the `@supports not (height: 100dvh)` vh-baseline and the
paired `-webkit-mask-image` `@supports` blocks are **textbook genuine
feature-detect fallbacks** (Mandate-compliant, NOT polyfills). The residual is
small, honest, and **all of one shape: cross-scene CSS duplication the D.W2
idiom-ownership pass eliminated everywhere ELSE, surviving in the post-F W10/W12
scenes (`sequence/`, `motion-path/`) the F idiom sweep predated** — the exact same
class as F §1's rail/ball drift, in the exact same surfaces. Plus two coupled
magic numbers and one token-naming shadow. No rebuild; a finishing sweep of the
two newest scenes into the layer that already owns the rest.

---

## §1 — `.settled-badge` / `.tracking-badge` byte-identical in TWO scoped blocks `[MED]`

**The status-badge tint pair is duplicated verbatim across two scenes** — the
same cross-scene incoherence D.W2 fought, surviving in a scene authored AFTER the
sweep:

- `SpringTarget.vue:181-194` — `.settled-badge` (`background: color-mix(... --color-progress 14% ...)`,
  `color: color-mix(... --color-progress 50% var(--foreground))`) + `.tracking-badge`
  (`background: color-mix(... --muted 60% ...)`, `color: var(--muted-foreground)`).
- `SequenceTarget.vue:232-240` — **byte-identical** `.settled-badge` + `.tracking-badge`.

Verified identical (same percentages, same tokens, same property order). The
`SpringTarget` copy carries a load-bearing comment documenting the `14%`/`50%`
AA-contrast lineage (the C.W2 lighthouse color-contrast leaf — the bare green was
1.97:1); the `SequenceTarget` copy is the same recipe with **no** comment, i.e. a
silent fork of an a11y-load-bearing value. The day someone tunes the contrast on
one, the other drifts and re-fails contrast with no gate — the precise failure
mode `design-idioms.css` was built to prevent.

`SequenceTarget.vue` ALSO authors a third `.reverse-badge` (`:220-223`, the
violet reverse-direction tint) — a genuine per-scene addition, not a duplicate,
but it belongs in the same status-badge family.

- **Disposition.** **SHIP-in-G.** Promote a parameterized status-badge idiom to
  `design-idioms.css` beside `.progress-rail`/`.progress-ball` — e.g.
  `.status-badge` taking a `--badge-tone` custom property (defaulting to
  `--color-progress`), with `--badge-tint` / `--badge-text-mix` defaulting to the
  AA-lineage 14%/50%. `.settled-badge` = tone `--color-progress`; `.tracking-badge`
  = tone `--muted` (its own neutral recipe); `.reverse-badge` = tone
  `--rainbow-violet`. One source, the AA comment lives once, the contrast value is
  single-sourced. The four scoped blocks across the two scenes collapse to
  per-site `--badge-tone` assignments (no-legacy: the scoped copies are REMOVED).
- **Isomorphism.** Pixel-isomorphic — pick the existing `14%`/`50%` lineage as
  the idiom default; every current badge paints identically. Named-isomorphic.
- **Instrument.** A `proof:idioms`-style assertion (the same clause-shape D.W2
  used for the rainbow/gold idioms): grep that `.settled-badge`/`.tracking-badge`
  are defined in EXACTLY ONE place (`design-idioms.css`) and zero scene scoped
  blocks re-author them — falsifiable, fails the day a scene re-forks the tint.
- **inv ε.** Both blocks read + compared at the cited lines; the AA comment is on
  the Spring copy only (`SpringTarget.vue:184-189`), confirming the Sequence copy
  is the uncommented fork.

---

## §2 — `.code-token` byte-identical in TWO scoped blocks `[MED]`

**Same shape, second instance.** The inline-code prose token (camelCase API names
rendered in mono at the caption rung) is duplicated verbatim:

- `SpringTarget.vue:132-135` — `.code-token { font-family: var(--font-mono);
  font-size: var(--type-caption); }` (with a comment documenting the
  case-preserving register rationale).
- `MotionPathTarget.vue:73-76` — **byte-identical** `.code-token` (no comment).

Both consume the correct tokens (`--font-mono` is demo-owned in `style.css:54`;
`--type-caption` is glass-ui-owned at `typography.css:104`, `0.75rem` — resolves
correctly). The duplication is the issue: this is a two-property inline-code idiom
re-typed in two scenes, and it will recur in every new prose-bearing scene (the
W10/W12 pattern of explaining the API in-scene). It is exactly the "demo
REFERENCES an idiom everywhere but DEFINES it in its own tree nowhere centralized"
rent `design-idioms.css` exists to retire.

- **Disposition.** **SHIP-in-G.** Promote `.code-token` to `design-idioms.css`
  (two lines + the case-preservation comment, once). Both scenes apply the class
  through the owned layer; the two scoped copies are REMOVED (no-legacy). This is
  the smallest-possible idiom and the cheapest promotion in the lane.
- **Isomorphism.** Pixel-identical (same two computed values).
- **Instrument.** Same `proof:idioms` grep clause: `.code-token` defined in
  exactly one place; zero scene re-authoring.
- **inv ε.** Both definitions read + compared at the cited lines; identical.

---

## §3 — `.mp-traveller` re-authors the `.progress-ball` primitive instead of consuming it `[LOW–MED]`

**The F §1 rail/ball consolidation landed correctly for the OLD scenes
(verified) — but the post-F MotionPath scene re-authors the ball by hand.** The
`.progress-ball` idiom (`design-idioms.css:294-304`) is the canonical
green-ball-with-glow: `border-radius: var(--radius-pill)`, `background:
var(--color-progress)`, `box-shadow: 0 2px 10px color-mix(... --ball-glow 35% ...)`,
parameterized `--ball-size`. EasingTarget/SpringTarget/SequenceTarget all
correctly consume it (verified: `EasingTarget.vue:302-315`, `SpringTarget.vue:147-156`,
`SequenceTarget.vue:205-218` set only per-site `--ball-size`/`--ball-glow`).

But `MotionPathTarget.vue:102-114` `.mp-traveller` **hand-rolls the same
primitive**: `border-radius: var(--radius-pill)`, `background: var(--color-progress)`,
`box-shadow: 0 2px 12px color-mix(in srgb, var(--color-progress) 40%, transparent)`,
`width/height: 2.75rem`. That is the `.progress-ball` recipe with two drifted
literals — `12px` blur vs the idiom's `10px`, and `40%` glow vs the idiom's `35%`
default — i.e. the precise glow/blur drift F §1 consolidated everywhere else,
re-introduced in the newest scene. (The dashed `.mp-guide-path` is correctly a
distinct rail-tint primitive, like `.spring-target-marker` — that one is NOT a
ball and rightly stays scoped.)

- **Disposition.** **SHIP-in-G.** Have `.mp-traveller` consume `.progress-ball`
  with per-site `--ball-size: 2.75rem` (and, if the larger traveller earns a
  brighter glow, `--ball-glow: 40%` as a NAMED per-site delta — the same seam
  EasingTarget/Spring use). The traveller carries a `&#x1F642;` glyph child, so it
  keeps `display: grid; place-items: center` as its only non-idiom rule. The
  `12px`-blur literal is dropped to the idiom's `10px` (or named as a delta if the
  bigger ball wants it). Folds into the F §1 rail/ball idiom this scene missed
  because it landed after the sweep.
- **Isomorphism.** Near-isomorphic with one named motion-cohesion delta (the
  `35%` vs `40%` glow + `10px` vs `12px` blur — the same class as F §1's
  three-site reconcile). Default to the idiom; name the delta if kept.
- **Instrument.** Extend the F §1 `proof:idioms` rail/ball clause to assert NO
  scene scoped block re-declares `box-shadow: 0 2px … color-mix(… --color-progress …)`
  on a ball-shaped element (grep) — catches the next hand-rolled ball.
- **inv ε.** `.progress-ball` idiom read at `design-idioms.css:294-304`;
  `.mp-traveller` read at `MotionPathTarget.vue:102-114`; the four consuming
  scenes' per-site-only blocks read at the cited lines.

---

## §4 — The `400px` controls-pane width is a coupled magic number across two files `[LOW–MED]`

**One layout invariant, two un-linked literals.** The controls grid declares its
left track as `lg:grid-cols-[400px_1fr_1fr]` (`AnimationControlsGroup.vue:5`) and
the controls pane that fills that track declares `min-width: 400px`
(`ControlsPaneWrapper.vue:204`). These MUST match — the comment at
`AnimationControlsGroup.vue:51` even narrates "the 400px backdrop sits above the
centered stage." Two files, two raw `400px` literals, one invariant: change the
track and the pane overflows or under-fills with no gate. This is the precise
recurring-structural-literal class the D/E layout-token pass named homes for
(`--dock-panel-width`, `--dropdown-min-width`, `--visualizer-track-gutter`,
`--panel-max-h`, all in `design-idioms.css:91-105`) — the controls-pane width
simply was not on that list (it lives in the lg grid, which the layout-token sweep
under-covered).

- **Disposition.** **SHIP-in-G.** Add `--controls-pane-width: 400px` to the
  layout-token block in `design-idioms.css` (beside its `--dock-panel-width`
  siblings). The grid track becomes `lg:grid-cols-[var(--controls-pane-width)_1fr_1fr]`
  and the pane `min-width: var(--controls-pane-width)`. One token, the invariant
  is single-sourced and the coupling comment becomes a token reference.
- **Isomorphism.** Pixel-identical (`400px` → `var(--controls-pane-width: 400px)`).
- **Instrument.** Extend the brittleness `proof:` clause (the one that already
  gates against raw `z-[N]`, `style.css:35`): grep that the controls grid track
  and pane min-width reference the token, not a raw `400px` — falsifiable.
- **inv ε.** Both `400px` literals read at the cited lines; the coupling comment
  at `AnimationControlsGroup.vue:51`; the existing layout-token siblings at
  `design-idioms.css:91-105`.

---

## §5 — `--tabs-mask-fade` / `--mask-fade-width` — two names, one idiom, same value `[LOW]`

**The edge-fade mask width is the same `2.5rem` under two different local names in
two files.** Both the tab-overflow fade (`AnimationControls.vue:301`,
`--tabs-mask-fade: 2.5rem`) and the controls-pane vertical scroll fade
(`ControlsPaneWrapper.vue:225`, `--mask-fade-width: 2.5rem`) declare the identical
edge-fade magnitude with divergent token names, each driving the identical
`@supports`-gated paired `-webkit-mask-image`/`mask-image` recipe. The mask recipe
itself is ALREADY-SOTA (see below); only the magnitude token is a naming shadow —
two homes for one design decision ("how wide is an edge fade").

- **Disposition.** **SHIP-in-G** (cheap) **or BOOK** (low urgency). Promote a
  single `--mask-fade: 2.5rem` to `design-idioms.css` (the demo-owned home for
  recurring magnitudes); both consumers reference it. Honest scoping note: the two
  masks ARE conceptually one idiom ("edge-fade an overflow"), so promoting the
  whole `@supports` mask recipe to a `.edge-fade-{x,y}` utility in the idiom layer
  would be the deeper DRY win (the recipe is ~8 lines duplicated twice) — but that
  is a larger move; the token unification is the minimal correct fix.
- **Isomorphism.** Pixel-identical.
- **Instrument.** `proof:idioms` grep: one fade-magnitude token, both sites
  reference it.
- **inv ε.** Both token declarations + their mask recipes read at the cited
  lines; both `2.5rem`.

---

## §6 — `h-[fit-content]` arbitrary value where Tailwind ships `h-fit` `[LOW — nit]`

**A single non-idiomatic arbitrary value the codebase itself uses correctly two
lines away.** `MatrixEditor.vue:5` writes `h-[fit-content]` (a bracket-arbitrary)
for what Tailwind expresses as the first-class utility `h-fit` — and the SAME
codebase uses `w-fit` idiomatically at `AnimationControls.vue:12,16`. It is the
lone surviving "arbitrary value that wants a built-in utility" after the D/E/F
migration routed the rest to tokens.

- **Disposition.** **SHIP-in-G** (trivial). `h-[fit-content]` → `h-fit`.
- **Isomorphism.** Pixel-identical (`h-fit` compiles to `height: fit-content`).
- **Instrument.** Folds under the brittleness lane's anti-arbitrary grep
  (the same clause that gates raw `z-[N]`): no bracket-arbitrary where a
  first-class utility exists.
- **inv ε.** `h-[fit-content]` at `MatrixEditor.vue:5`; idiomatic `w-fit` at
  `AnimationControls.vue:12`.

---

## §7 — `--filter-brand-color` is an approximate SVG recolor (the one archaic-ish technique) `[LOW — RECORD]`

**Named for exhaustiveness; NOT manufactured into work.** The brand mark is
recolored via a CSS `filter` chain (`style.css:175`):
`invert(55%) sepia(80%) saturate(1496%) hue-rotate(220deg) brightness(95%)
contrast(103%)`, consumed by `brand.css:29,37` on the SVG logo `<img>`s. This is
the classic "tint a monochrome SVG without editing the asset" hack — it
*approximates* `--ppmycota-primary` rather than reproducing it exactly, and the
six-function chain is opaque (a magic incantation no one can re-derive by hand if
the brand hue changes).

The SOTA-exact alternative is `mask-image: url(logo.svg)` + `background-color:
var(--ppmycota-primary)` (or `mask` + `background`), which paints the EXACT token
color and reads as one declaration — `modern-web-guidance`'s `soft-edge-content-fade`
/ masking guidance confirms `mask-image` is Baseline (since 2023-12-07, the
mandatory `-webkit-` prefix for Safari 15.4 already a demo pattern). But the
filter approach WORKS, is documented as a deliberate approximation
(`style.css:172`), and the brand hue is stable — so this is a **RECORD**, not a
SHIP: the brittleness is latent (only bites on a brand-hue change) and the fix is
a real (if small) re-plumb of the brand-mark paint.

- **Disposition.** **RECORD** (do not manufacture). If a future brand refresh
  touches the hue, migrate to `mask-image` + `background-color` for exactness; the
  filter chain is the technique to retire then, in one motion.
- **inv ε.** Filter chain at `style.css:175`; consumers at `brand.css:29,37`; the
  approximation acknowledged at `style.css:172`.

---

## §8 — Where the styling surface is ALREADY-SOTA (verified — manufacture NO work)

These are confirmed exemplary; calling them gaps would be manufactured deficit:

- **ONE localized idiom layer, and it is exemplary.** `design-idioms.css` (340L)
  is the single demo-owned design vocabulary — rainbow family + gold ramp +
  hover-lift + `:focus-visible` contract + `.text-gold`/`.gold-shimmer` +
  `.progress-bar`/`.progress-dot`/`.progress-rail`/`.progress-ball` +
  `.dock-inset` + `@keyframes enter` — every idiom documented with its rent
  history, gated, imported immediately after the glass-ui cascade so the demo's
  copy is authoritative (`style.css:8`). The brief's "verify ONE localized layer
  defines the idioms WITH proper colocation" is **answered: yes, and the
  colocation is principled** (`brand.css` is the correctly-scoped shared
  brand-mark partial; the `--ppmycota-primary` *token* stays global in
  `style.css:174` so the `var()` fallback readers resolve it regardless of mount —
  a deliberate token-vs-rule split, `brand.css:14-18`).
- **The F §1 rail/ball consolidation genuinely landed.** Verified against live
  code: `.progress-rail`/`.progress-ball` are the single source
  (`design-idioms.css:283-304`), and EasingTarget (`:302-315`), SpringTarget
  (`:147-156`), SequenceTarget (`:205-218`) all consume it with per-site
  `--ball-size`/`--ball-glow`/`--rail-tint` deltas only. The four-way drift the F
  audit named (rail tint 12/8/10%, glow 40/35%, ball 1.75rem/36px/1.1rem) is
  reconciled to EasingTarget's AA-canonical lineage. (§3 is the ONE post-F scene
  that missed it, not a regression.)
- **Zero `!important` in source.** Grep returns one hit — a *comment* at
  `EasingSelect.vue:116` explicitly praising "honest scoped specificity, not
  `!important` utilities." The cascade is managed by `@layer` (`base`/`utilities`,
  `style.css:221,254`) + `:where()` (`EditorShell.vue:178`) — the
  `modern-web-guidance` CSS-architecture prescription exactly (cascade layers +
  `:where()`, never BEM, never `!important`).
- **Zero `@apply` in component SFCs.** The `@apply` idioms are centralized in
  `design-idioms.css` (`.progress-bar` line 222); no scene re-applies utility
  soup via `@apply` — the anti-pattern the brief names ("util soup that wants
  `@apply`") is absent in the wrong direction (it is correctly contained in the
  ONE owned layer).
- **Arbitrary Tailwind values are overwhelmingly tokenized.** After the D/E/F
  layout-token migration, the non-`data-[…]` (reka state-variant) arbitraries are
  almost all `var(--token)`: `min-w-[var(--dock-panel-width)]`,
  `max-h-[var(--panel-max-h)]`, `max-h-[var(--easing-dropdown-max-h)]`,
  `h-[var(--target-viewport-h)]`, `w-[calc(100%-var(--visualizer-track-gutter))]`,
  `min-w-[var(--dropdown-min-width)]`, `stroke-[var(--ppmycota-primary,…)]`. The
  residual literals are §4 (`400px`, fix proposed) and §6 (`h-[fit-content]`, fix
  proposed) plus a handful of befitting one-offs (`min-h-[20vh]`/`min-h-[25vh]`
  editor min-heights, `max-w-[90vw]` toast cap, `grid-cols-[subgrid]`,
  `scale-x-[-1]` mirror, `translate-x-[calc(100cqw_-_100%)]` visualizer) that are
  genuinely local, non-recurring, and idiomatic.
- **Viewport-unit hygiene is correct, not trap-prone.** Full-height containers use
  `dvh` (the shell, the work-area sizing, `--panel-max-h: 60dvh`,
  `style.css:96-97`), with a **genuine `@supports not (height: 100dvh)` vh-baseline
  fallback** (`EditorShell.vue:158-171`) — the Mandate's "feature-detect with the
  genuine fallback," NOT a polyfill. The raw `vh` survivors are befitting static
  uses: `min(25vh, 25vw, 15rem)` cube sizing (`CubeTarget.vue:158` — a clamped
  max with a rem cap, never full-height, so the mobile-URL-bar concern dvh solves
  does not bite), `min(50vh, 480px)` detail-pane height cap
  (`AnimationControlsControls.vue:324`), `1000vw` axis-line "infinite extent"
  (`CubeTarget.vue:200`). None is the full-viewport `vh` trap.
- **The z-index contract is semantic + gated.** No demo-local z-scale — every
  stacking decision routes through glass-ui's `--z-*` via the `z-content`/`z-bar`/
  `z-dock`/`z-modal`/`z-popover` utilities, with the ordered-layer contract
  documented (`style.css:11-37`) and the lone below-plane orphan reconciled to
  `--z-behind` (`CubeTarget.vue:207`). The brief's "z-index coupling" concern is
  pre-addressed.
- **The `-webkit-mask-image` blocks are SOTA fallback, not legacy.**
  `modern-web-guidance`'s `soft-edge-content-fade` guide states the `-webkit-`
  prefix is **MANDATORY** for wider support (Safari 15.4), and prescribes the
  exact `@supports (-webkit-mask-image …) or (mask-image …)` pairing the demo uses
  (`AnimationControls.vue:308-322`, `ControlsPaneWrapper.vue:229-245`). These are
  the genuine feature-detect fallback the Mandate allows — paired declarations,
  graceful degradation to un-faded content. ALREADY-SOTA.
- **No raw hex colors in CSS.** Every CSS color is a token or `hsl()`/`color-mix()`.
  The two raw-hex grep hits are befitting non-CSS values: a Three.js light color
  (`AmigaScene.vue:51` — not a CSS property) and an `<input type=color>` default
  (`AssetPropertiesPanel.vue:107`).
- **Util-soup is within Tailwind norms.** The longest class strings (~228 chars,
  the matrix-cell sticky header `AnimationControlsControls`-region; the visualizer
  ball `AnimationVisualizer.vue:35`) are flat single-element utility lists, NOT
  duplicated across sites — extraction would trade one idiom for another with no
  DRY gain. KISS holds.

---

## Disposition summary

| # | Finding | Sev | Disposition | Class |
|---|---------|-----|-------------|-------|
| 1 | `.settled-badge`/`.tracking-badge` byte-identical in 2 scoped blocks (SpringTarget + SequenceTarget); the AA-contrast comment forked | MED | **SHIP-in-G** | post-F W10 scene missed D.W2 idiom sweep |
| 2 | `.code-token` byte-identical in 2 scoped blocks (SpringTarget + MotionPathTarget) | MED | **SHIP-in-G** | post-F W12 scene missed sweep |
| 3 | `.mp-traveller` hand-rolls `.progress-ball` (glow 40% vs idiom 35%, blur 12px vs 10px) | LOW–MED | **SHIP-in-G** | post-F W12 scene missed F §1 rail/ball idiom |
| 4 | `400px` controls-pane width — coupled magic number across 2 files | LOW–MED | **SHIP-in-G** | layout-token sweep under-covered the lg grid |
| 5 | `--tabs-mask-fade` / `--mask-fade-width` — 2 names, 1 value (`2.5rem`) | LOW | **SHIP-in-G** or BOOK | token-naming shadow |
| 6 | `h-[fit-content]` arbitrary where `h-fit` exists (used `w-fit` 2 lines away) | LOW | **SHIP-in-G** | lone non-idiomatic arbitrary |
| 7 | `--filter-brand-color` approximate SVG recolor (6-fn filter chain) | LOW | **RECORD** (do not manufacture) | latent — bites only on brand-hue change |
| 8 | ONE idiom layer / zero `!important` / zero SFC `@apply` / tokenized arbitraries / dvh+fallback / z-contract / mask SOTA / no raw hex | — | **RECORD** (already-SOTA) | verified exemplary |

**Cross-repo hand-offs: NONE in this lane.** Every finding is a demo-CSS concern
within the demo's own idiom layer. The mask recipe, `--type-caption`, and
`btn-interactive` consume glass-ui idiomatically (correct usage, not gaps). No
value.js / parse-that / glass-ui surface is implicated.

**The one-paragraph thesis.** The styling surface is ~90% SOTA and the D.W2
idiom-ownership discipline holds across the board — one localized, documented,
gated idiom layer; zero `!important`; zero SFC `@apply`; tokenized arbitraries;
`dvh` + genuine `vh` fallback; a semantic z-contract; SOTA masking. The entire
residual is **one shape repeated**: the post-F W10/W12 scenes (`sequence/`,
`motion-path/`) were authored AFTER the D.W2 idiom sweep and the F §1 rail/ball
consolidation, so they re-fork idioms those passes already retired —
`.settled-badge`/`.tracking-badge` (§1), `.code-token` (§2), the `.progress-ball`
geometry (§3). The SHIP is a **single finishing sweep of the two newest scenes
into the layer that already owns the rest**, plus naming homes for two coupled
magic numbers (§4 `400px`, §5 the mask-fade token) and one nit (§6 `h-fit`) —
gated by the same `proof:idioms` clause-shape D.W2 already uses. Not a rebuild;
the disciplined system extended to the two scenes it predated.
