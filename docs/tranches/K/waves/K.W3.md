# K.W3 — THE LAYOUT TRANSPOSITION (the design-totality root · the dock anchoring becomes a DERIVED grid that clusters gracefully on a cinema display and a phone alike)

- **Phase:** DEV — spec authored, awaits IMPL+auth (the D→J→K dev/impl boundary; `K.md §Phase`).
  · **Class:** DESIGN-TOTALITY-at-the-ROOTS (the layout half of the "beautiful at its roots"
  correction — `K.md §terminal reading`: "the dock anchoring becomes a derived grid system that
  clusters gracefully on a cinema display and a phone alike"). NOT a P0; the layout grid is SOUND
  on the happy path (1920×1080: 94%W, docks at ~50px — `layout-grid-k.md §2` baseline row). The
  defect is structural and on TWO unexercised axes: **width AND height pathological screens** where
  the content clamps to 1920×1056 but the chrome (docks + controls) floats on `slack × bias` and
  the rail stays a fixed 400px, so the whole UI maroons as a tiny island in a sea of dead graph
  paper (`layout-grid-k.md §2`, the 5120×2880 smoking-gun screenshot).
  · **Scope (the demo styling system — the macro layout tier ONLY; inv-16 UNFENCED on the demo
  half, the `--dock-margin` GAP fenced as a glass-ui handoff):** the `.controls-layout` macro grid
  (`AnimationControlsGroup.vue:309-480`), the work-area→slack→dock-anchor chain
  (`style.css:121-122,139-141,224,241`), the fixed rail track (`design-idioms.css:116`), the
  cube-target viewport-unit sizing (`design-idioms.css --target-viewport-w/h`), and the hero magic
  margin (`EditorStartScreen.vue:11`). **The grid-line opacity tokens (`design-idioms.css:182-183`,
  the U-K20 grid-opacity tune) are NOT this wave's** — the binding charter routes BOTH halves of
  U-K20 (the FourierField removal AND the grid lines less opaque) to **K.W4** (`K.md §clusters` K.W4
  row; README §4 ownership table: "the grid-line opacity (U-K20) is a VISUAL tune, owned by K.W4 …
  not W2 or W3"), BINDING boundary below. Desktop AND mobile both refined.
  · **DAG-deps:** **follows K.W1** (the glass-ui `~3.11.2`→3.13.0 re-pin must land first — the dock
  chrome the layout hosts comes from glass-ui, and the `--dock-margin` token + the re-cut sliders
  are 3.13's; `K.md §WAVE MAP`: "the re-pin must precede the design waves so W2/W3/W4 build on
  3.13.0, not against it"). **Runs ∥ K.W2** (fonts) — file-adjacent in `demo/@/styles` but
  SEPARABLE: K.W2 owns the voice tokens (`--font-display`/`--font-mono`/`--font-text` + the
  `.dock-label` voice rule), K.W3 owns the grid/anchoring tier (the track + the anchor chain); the
  grid-OPACITY token (`--graph-*opacity`) is K.W4's (the visual-refine seam, charter-routed); the
  spec boundary is BINDING (`K.md §WAVE MAP`). **Consumed by K.W4** (the pane re-cuts ride the new
  grid). **K.W5's layout-coverage leg** rides this wave (the layout assertions land WITH the surface
  they certify; `K.md §clusters` K.W5 row).

## §Provenance (the folded root cause + the digested guidance)

- `layout-grid-k.md` — THE decisive input, wave-ready. The hardcoded-offset census (§1, C1-C7),
  the pathological-screen probes on the BUILT dist (§2 — 1280/1920/3440/5120 + tall-portrait, each
  with resolved token px + box rects + a cited screenshot), the modern grid/subgrid redesign space
  (§3 — the modern-web-guidance digests, the existing-idiom precedent), the max-cluster design (§4),
  and the §FOLD (8 rows, P1×3 / P2×5). The lane's net verdict (§0/§4): the dock ANCHOR MATH is
  clean (φ-derived, no raw px — J.W7c U1 did real work); what breaks is the **fixed-size ceilings +
  the 400px rail** because "the clamp exists for content; the *cluster* behavior U-K7 asks for does
  not exist at all" (§1 Net).
- **The pathological probes, file-rooted (`layout-grid-k.md §2`, re-runnable via
  `audit/probe-pathological.mjs` + the isolated per-viewport runs; screenshots under
  `audit/screenshots-k/`):**
  | viewport | work-area fills | dead gutter | top-dock anchor | bottom-dock anchor | rail px | screenshot |
  |---|---|---|---|---|---|---|
  | 1920×1080 (baseline) | 94% W / 88% H | 58/65px | ~50px | ~50px | 400 | `cube-1920x1080-baseline.png` |
  | 3440×1440 (ultrawide) | 55.8% W | 760px ea. | 148.7px | 242.3px | 400 | `cube-3440x1440-ultrawide.png` |
  | 1280×2000 (tall portrait) | 52.8% H | 472px ea. (vert) | 362.6px | 588.3px | 400 | `cube-1280x2000-tall-portrait.png` |
  | **5120×2880 (5K)** | **37.5% W / 36.7% H** | **1600px ea.** | **698.8px** | **1132.2px** | **400** | `cube-5120x2880-5k.png` |
  The 400px rail is INVARIANT across a 4× viewport-area span — `layout-grid-k.md §2` calls it "the
  clearest single proof that the layout does not respond to pathologically large screens."
- `styling-typography-k.md §7` — the grid-line opacity token (`--graph-opacity: 5%` /
  `--graph-major-opacity: 12%` at `design-idioms.css:182-183`): the lane's §FOLD tags this row
  **"Visual-refine"** and explicitly hands it to **"the hero/scene lane's seam, not this typography
  lane"** — i.e. to **K.W4** (the pane/visual-refine wave, where the charter §clusters K.W4 row and
  the README §4 ownership table place it). It is NOT W3's: a grid-OPACITY VALUE is neither a track,
  an anchor, an offset, nor a cluster decision (the W2/W3-seam disambiguation rule, README §4). Cited
  here ONLY because the substrate it tints (the graph-paper grid) is the layout substrate W3 derives;
  the tune itself rides K.W4 (S8). *(Cross-ref for the IMPL — NOT a W3 scope item.)*
- `live-fourier-grid.md` — the U-K20 owner-lane (charter §clusters K.W4 row: "`live-fourier-grid.md`
  owns the removal seam"); both halves — the FourierField removal (§K20-A/C/E) AND the grid-opacity
  tune (§K20-B/D, 5%→~3%, 12%→~8%, "stays well above the old 5% floor") — are **K.W4's**, NOT this
  wave's. Cited here only as the cross-ref to the substrate; the BINDING split is below.
- `live-session-gap-analysis.md §3 (U-K7 row)` — the gate-blind-spot root: U-K7 (layout) is an
  "uncovered axis" — `proof:demo-shell-grid`/`proof:stage-not-clipped` "assert structural facts (grid
  present, not clipped) — they cannot assert" the pathological-screen cluster, and `proof:visual-lock`
  was re-baselined in W7c so "the disliked state IS the locked baseline." The layout-coverage gate
  this wave plants (§Hard gate) is the cure.
- `precepts-k.md §0 (P6/P7/P13)` — the boundary-gated-not-asserted precept (P6), the demo styling
  is glass-ui-CONSUMING not glass-ui-FORKING (P13 inv-16), and the glass-ui-root-changes memory rule
  (`feedback_glass_ui_root_changes`) that fences the `--dock-margin` GAP as a born-RED handoff, never
  a demo patch.

## §The state, verified (file:line / probe + observed output / screenshot — inv ε)

- **The macro grid, ONE CSS grid named `.controls-layout`** (`AnimationControlsGroup.vue:309-480`,
  `layout-grid-k.md §0`):
  - **Desktop (`@media (min-width: 1024px)`, line 432):** `grid-template-columns: [rail]
    var(--rail-track) [stage] 1fr` + `grid-template-rows: [top] auto [stage] 1fr [bottom] auto`. The
    controls pane lives in `[rail]`, the subject in `[stage]`. Open/close animates the `[rail]` track
    between `var(--rail-width)` and `0px` (lines 440-447).
  - **Mobile (`@media (max-width: 1023px)`, line 348):** the grid is ABANDONED — the stage becomes
    `position: fixed; inset: 0` full-bleed, the controls pane becomes a fixed bottom sheet. `display:
    grid` is desktop-only (line 439).
  - **The two docks are OUT OF FLOW.** Top scene-switcher (`ChromeDock.vue:169`) is `fixed
    left-1/2 -translate-x-1/2` with `top: var(--dock-top-anchor)` (line 170). Bottom `TransportDock.vue:8`
    is fixed with `bottom: var(--dock-bottom-anchor, var(--work-area-bottom-offset, 0px))`.
- **The cluster bound** (`style.css:121-122`, applied to `.controls-layout` width/height at lines
  310-311 with `margin: auto` centering at 314): `--work-area-max-width: clamp(72rem, 94vw, 120rem)`
  (→ 1920px) and `--work-area-max-height: clamp(44rem, 88dvh, 66rem)` (→ 1056px).
- **The slack→offset→anchor chain — the ROOT CAUSE** (`style.css:139-141,224,241`,
  `layout-grid-k.md §0`):
  ```
  --work-area-vertical-slack: max(100dvh − work-area-height, 0)         (style.css:139)
  --work-area-top-offset:     slack × 0.382  (1/φ²)                     (style.css:140)
  --work-area-bottom-offset:  slack × 0.618                            (style.css:141)
  --dock-top-anchor:    max(top-offset, safe-area-top)    + --dock-margin/4     (style.css:224)
  --dock-bottom-anchor: max(bottom-offset, safe-area-bot) + --dock-margin/φ     (style.css:241)
  ```
  **The offsets grow WITHOUT BOUND** as the viewport exceeds the clamp ceilings, because `slack =
  viewport − fixed-ceiling` is unbounded. At 5120×2880: slack = 1824px → top-offset 696.8px →
  top-anchor 698.8px; bottom-offset 1127.2px → bottom-anchor 1132.2px (`layout-grid-k.md §2` 5K
  block). The anchor MATH is φ-clean (no raw px, the asymmetry is `--dock-margin/4` vs
  `--dock-margin/φ`); the failure is that it has no CEILING.
- **The hardcoded-offset census (the residue — `layout-grid-k.md §1`, U-K7's literal ask):**
  | # | Token / literal | Where | Value | Verdict |
  |---|---|---|---|---|
  | **C1** | `--rail-width` | `design-idioms.css:116` | **`400px` fixed** | **P1** — THE one true hardcoded layout track U-K7 names. `controlsPane.w == 400` at 1280, 1920, 3440, 5120 (invariant across 4× area). |
  | **C2** | `--work-area-max-width` ceiling | `style.css:121` | `clamp(72rem, 94vw, **120rem**)` → 1920px | **P1** — past 2042px viewport the WA freezes at 1920px; all extra width is dead gutter. |
  | **C3** | `--work-area-max-height` ceiling | `style.css:122` | `clamp(44rem, 88dvh, **66rem**)` → 1056px | **P1** — vertical twin; past 1200px height the WA freezes at 1056px and slack inflates the dock anchors. |
  | C4 | `--dock-margin` | **glass-ui** `tokens.css:1304` | `0.5rem` | **P2 / CROSS-REPO** — a glass-ui token, NOT demo-owned. The dock-GAP re-base is a glass-ui handoff (BINDING below), never a demo patch. |
  | C5 | hero `lg:mt-24` | `EditorStartScreen.vue:11` | 6rem + `px-6` | **P2** — a raw Tailwind margin coupling the hero to a magic offset instead of the work-area chain. |
  | C6 | `--target-viewport-w/h` | `design-idioms.css` | `30vw` / `30vh` | **P2** — the cube target sizes off raw viewport units, not the clamped stage cell; it does not track the C2/C3 freeze. |
  | C7 | `--header-items-max-w` | `design-idioms.css` | `500px` fixed | **P2** — header-items cap (chrome-cluster sizing; out of the core but noted). |
- **The modern idioms ALREADY used locally (the precedent — `layout-grid-k.md §3`):**
  `container-type: inline-size` + `container-name: easing-editor` at `TimingFunctionPanel.vue:205`
  and `style.css:402` (the AnimationVisualizer container — MEMORY: `calc(100cqw − 100%)` ball math);
  CSS **subgrid** via `.labeled-field-grid` (`design-idioms.css:622-673`). The macro grid is the
  ONLY layout tier still on viewport media queries + a fixed rail — the redesign is "promote what the
  micro layout already does to the macro grid," idiomatic to THIS repo.
- **The grid-opacity tokens are K.W4's state, NOT this wave's** (`design-idioms.css:182-183`,
  `--graph-opacity: 5%` / `--graph-major-opacity: 12%`): the U-K20 grid-opacity tune is charter-routed
  to K.W4 (`K.md §clusters` K.W4 row; README §4) — verified there, not here. W3 PRESERVES these tokens
  untouched (it derives the grid GEOMETRY/substrate, never the grid TINT).

## §Goal

Make the layout a DERIVED grid that tells the truth on every screen the product crosses — the
chrome CLUSTERS to the centered content card instead of floating in the void, the rail SCALES with
viewport-aware intrinsic sizing instead of staying 400px, and the macro tier reads ITS OWN BOX (a
container query) like the micro layout already does — desktop AND mobile, with ZERO hardcoded dock
offsets surviving a grep. Four moves, each at the gestalt altitude the mandate demands (`K.md
§MANDATE`: "the dock layout dies at the GRID/anchoring system, NOT retuned magic offsets" — no new
magic numbers, no per-screen media-query patch ladder):

1. **The rail track DERIVED (M1):** the fixed `400px` (C1) → an intrinsic `clamp()`/`minmax()`
   track so the rail widens on a cinema display and bounds on a phone — viewport-aware, not invariant.
2. **The macro grid → a CONTAINER (M2):** `.controls-layout` gains `container-type: inline-size` and
   the desktop/mobile fork moves from `@media (min-width: 1024px)` to `@container (inline-size >
   64rem)` — the macro tier reads its box like the micro tier already does (the existing-idiom
   promotion), the natural home for the cluster math.
3. **The dock chrome CLUSTERS to the content, not the viewport (M3):** the dock anchor offsets gain
   a CEILING (`min(offset, ceiling)`) so the docks hug the clamped card on huge screens; the forward
   idiom (anchor-positioning tethering the docks to the work-area rect) lands behind `@supports`
   with the bounded-`min()` fallback as the always-correct path. The §2 5K/portrait float dies.
4. **The surplus DISTRIBUTED deliberately (M4):** the work-area surplus past the C2/C3 ceiling stops
   being dead gutter — a NAMED distribution decision (center-card via the M3 cap, with the stage
   column free to grow via `[stage] minmax(0, 1fr)` while the rail stays bounded by M1), so the
   subject uses the extra real estate and the chrome hugs the card. The hero `lg:mt-24` (C5) folds
   into the work-area chain; the cube target (C6) tracks the stage cell via `cqi`/`cqb`.

*(The grid-line opacity tune the user named alongside U-K7 — "grid lines slightly less opaque",
U-K20 — is NOT a fifth move here: the charter routes the whole of U-K20 to K.W4, `K.md §clusters`
K.W4 row. W3 derives the grid GEOMETRY; K.W4 tints it.)*

## §Scope

- **M1 — the rail track DERIVED (C1; the one true hardcoded offset dies).** Locus:
  `design-idioms.css:116` (`--rail-width: 400px`) + the consuming track at
  `AnimationControlsGroup.vue:441` (`[rail] var(--rail-track)`). Replace the fixed `400px` with an
  intrinsic, viewport-aware track per `layout-grid-k.md §3.1` (guide §3 + §1.2: "reach for intrinsic
  sizing and flexible tracks (`fr`, `minmax()`) before fixed `width`/`height`"): `[rail] clamp(20rem,
  ~26cqi, 30rem)` (cqi once M2 makes the shell a container) OR `minmax(20rem, 0.25fr)`. The OPEN/CLOSE
  animation between the rail track and `0px` (lines 440-447) is PRESERVED — only the open-width
  literal changes from `400px` to the derived value. **The exact track function (clamp-vs-minmax,
  the cqi coefficient, the min/max bounds) is the IMPL's measured call** against the four probe
  viewports + the mobile sheet width; this spec BINDS that no fixed-px rail track survives, NOT a
  specific coefficient. **NO-legacy:** the `--rail-width: 400px` literal dies WITH the derivation; it
  is not left beside its replacement (`K.md §invariants`, the net-deletion rule). **WHY:** C1 is the
  single token the lane proves invariant across a 4× viewport-area span (`layout-grid-k.md §2`) — the
  clearest evidence the layout does not respond to large screens; deriving it is the literal U-K7
  "NO hardcoded dock offsets" discharge.

- **M2 — the macro grid becomes a CONTAINER (the existing-idiom promotion; the elegance/simplicity
  transposition).** Locus: `.controls-layout` at `AnimationControlsGroup.vue:309-314` (add
  `container-type: inline-size`) + the desktop/mobile fork at `:348` (`@media max-width:1023px`) and
  `:432` (`@media min-width:1024px`) → `@container (inline-size > 64rem)` / `@container (inline-size
  <= 64rem)` per `layout-grid-k.md §3.2` (guide §4). The component then responds to ITS box, not the
  viewport — correct for the eventual side-by-side / embedded cases and the natural home for the
  cluster math. **The §3 "Do not" caution is BINDING (`layout-grid-k.md §3` cite, guide §4):** the
  shell adopts `container-type: inline-size` (WIDTH-only), NOT `container-type: size` (both axes) —
  the chain already gives `.controls-layout` a definite block-size (`height: min(100dvh,
  --work-area-max-height)`, line 311), and `size` (both axes) would collapse descendants that have no
  definite block-size; `inline-size` covers the rail fork (a width query). **NO-legacy:** the
  `@media` viewport fork dies WITH the `@container` promotion (no dual fork left behind). **WHY:** the
  macro grid is the ONLY layout tier still reading the viewport while the micro tier already uses
  container queries (`TimingFunctionPanel.vue:205`, `style.css:402`) and subgrid
  (`design-idioms.css:622`) — this is "promote what the micro layout already does," not a new
  mechanism (`layout-grid-k.md §3` Net).

- **M3 — the dock chrome CLUSTERS to the content, not the viewport (the §2 fix; the
  unbounded-slack defect dies).** Locus: the slack→offset→anchor chain
  (`style.css:139-141,224,241`). The defect: `--dock-{top,bottom}-anchor` = `slack × bias` and slack
  is unbounded past the C2/C3 ceiling, so at 5K the docks float 698/1132px in (`layout-grid-k.md §2`).
  Two layered routes from `layout-grid-k.md §3.3` (guide §5), BOTH land:
  - **The always-correct path (bounded anchor):** cap the float — `--dock-top-anchor:
    calc(min(var(--work-area-top-offset), <ceiling>) + var(--dock-margin)/4)` and the
    bottom-anchor twin with `min(…, <ceiling>)`. This immediately fixes the 5K/portrait float (the
    docks stop wandering 700-1130px in and hug the clamped card). The ceiling value is the IMPL's
    measured call against the four probe viewports (`layout-grid-k.md §4` sketches 6rem/8rem — a
    sketch, NOT a binding literal).
  - **The forward idiom (anchor-positioning), feature-DETECTED:** `anchor-name: --stage` on the
    stage cell; `position-anchor: --stage` + `position-area: top center` / `bottom center` on the
    docks, so they tether to the WORK-AREA rect (which IS clamped) rather than viewport-derived slack
    — behind `@supports (anchor-name: --x)` per `layout-grid-k.md §3.3` (guide flags anchor-positioning
    "not yet natively supported" → the `@supports` feature-detect + the bounded-`min()` fallback is
    the ≤20-line custom path the guide's "Interpreting Fallbacks" prefers; the repo targets modern
    Chromium for the demo, so the fallback is the floor not the exception). **The bounded-`min()`
    path is the always-correct floor; the `@supports` anchor path is the progressive enhancement.**
    The wave is GREEN on the bounded-`min()` path alone (a browser without anchor-positioning gets
    the capped float, which already passes the §Hard gate).
  **NO new magic numbers:** the ceiling is a SINGLE named token (e.g. `--dock-anchor-ceiling`), not
  a per-screen media-query ladder; the `--dock-margin/4` vs `/φ` asymmetry is PRESERVED (it is
  φ-derived, not a magic number — `layout-grid-k.md §1`). **WHY:** "the dock layout dies at the
  GRID/anchoring system, NOT retuned magic offsets" (`K.md §MANDATE`) — capping the slack at the
  derivation is the system fix; re-tuning the 0.382/0.618 bias would be the forbidden workaround
  (it would shift the problem, not bound it).

- **M4 — the surplus DISTRIBUTED deliberately (the "cluster past a ceiling" decision; C5/C6 fold).**
  Locus: the `[stage]` track at `AnimationControlsGroup.vue:432` + the ceilings at `style.css:121-122`
  + the hero margin at `EditorStartScreen.vue:11` (C5) + the cube target at `design-idioms.css`
  `--target-viewport-w/h` (C6). Per `layout-grid-k.md §4` (U-K7's literal "docks + controls cluster
  past a max"), the four-step design — (1) clamp content [DONE: C2/C3], (2) clamp the rail [M1],
  (3) cluster chrome to content [M3], (4) DISTRIBUTE surplus [THIS]. **The distribution decision is
  RESOLVED to center-card-with-growing-stage** (`layout-grid-k.md §4` option order): the rail stays
  bounded by M1's `clamp()`, the stage column grows via `[stage] minmax(0, 1fr)` so the subject uses
  the extra real estate, and M3's capped anchors keep the chrome hugging the card — surplus stops
  being dead gutter (62.5%W + 63%H wasted at 5K, `layout-grid-k.md §2`). **The two C5/C6 sub-folds:**
  - **C5 — the hero magic margin** (`EditorStartScreen.vue:11` `lg:mt-24`) folds into the work-area
    chain: the hero block positions off the work-area/grid tokens, not a raw Tailwind `mt-24`
    (`layout-grid-k.md §FOLD` C5 row). **The hero VERTICAL-POSITION reconcile is THIS wave's; the
    hero COMPOSITION (FourierField removal, the empty-quadrant vacancy) is K.W4's** (BINDING below).
  - **C6 — the cube target** (`design-idioms.css` `--target-viewport-w/h: 30vw/30vh`) tracks the
    clamped STAGE cell via `cqi`/`cqb` (enabled by M2's container conversion) instead of raw viewport
    units, so it does not over-grow past the C2/C3 freeze (`layout-grid-k.md §3.5/§FOLD` C6). **The
    stage cell must be a container** (or the AnimationVisualizer container already at
    `style.css:402`/`TimingFunctionPanel.vue:205` is the reference) for `cqi`/`cqb` to resolve — the
    IMPL confirms the container scope before the cube-target conversion. **WHY:** the lane's §4 names
    surplus-distribution as the missing rule entirely ("the *cluster* behavior U-K7 asks for does not
    exist at all"); center-card-with-growing-stage is the idiom-ordered choice (`layout-grid-k.md §4`),
    keeping the rail bounded (no 30rem-wide rail on a 5K panel) while the subject — the thing the user
    came to SEE — fills the surplus.

*(There is no M5. The U-K20 grid-line opacity tune (`design-idioms.css:182-183`) is K.W4's — the
charter §clusters K.W4 row carries BOTH halves of U-K20, and README §4 names it "a VISUAL tune,
owned by K.W4 … not W2 or W3". W3 PRESERVES `--graph-*opacity` untouched; the legibility re-check
the tune requires is K.W4's clause, not this wave's.)*

## §Hard gate (the proof:* that BITES — born-RED on the BUILT dist at the pathological viewports + the offset grep · the layout-cluster oracle)

**The oracle (per K.md's boundary-ORACLE + gate-ORACLE precepts — the layout property a human would
check, exercised through the SAME surface, on the REAL built dist over the four pathological
viewports):** a NEW runtime gate (working name `proof:layout-cluster`) drives the BUILT
`dist/gh-pages` at FOUR viewports — **1280×800, 1440×900, 3440×1440, 5120×2880, plus a tall portrait
(1280×2000)** — opens the controls panel (the same `openControlsPanel`/`navToScene` driver the J/K
harness owns — `J.W0 §S2`, the lib home), reads the resolved layout tokens + the dock box rects, and
asserts the cluster properties. **PLUS a static grep clause** that asserts ZERO hardcoded dock/rail
offsets survive. Born-RED on TODAY's tree by the §2 probe shape; GREEN on M1+M3+M4.

- **clause (a) — the docks CLUSTER to the content card, not the viewport (the §2 5K/portrait float
  dies; CORRECTNESS).** At 5120×2880 AND at 1280×2000 (tall portrait), assert the resolved
  `--dock-top-anchor` and `--dock-bottom-anchor` (and the rendered dock box `top`/`bottom` rects) are
  BOUNDED — each ≤ a NAMED ceiling (the `--dock-anchor-ceiling` + the φ `--dock-margin` term), NOT
  the unbounded `slack × bias`. Concretely: the top dock's distance from the work-area card's top
  edge is within the ceiling band, NOT ~700px (5K) / ~362px (portrait); the bottom dock's distance
  from the card's bottom edge is bounded, NOT ~1132px (5K) / ~588px (portrait). **BORN-RED WITNESS:**
  on the pre-cure tree the gate reads `dock-top-anchor: 698.8px` at 5120×2880 and `362.6px` at
  1280×2000 (`layout-grid-k.md §2` — the recorded probe output, re-runnable via
  `audit/probe-pathological.mjs`) — both FAR past any sane ceiling → RED. **BITE:** reds on the
  unbounded chain (`style.css:224,241` `max(offset…)` with no `min()` cap); greens on M3 (the
  `min(offset, ceiling)` cap and/or the `@supports` anchor tether to the clamped work-area rect).
- **clause (b) — the rail track is DERIVED, not fixed 400px (C1 dies; CORRECTNESS).** At 1440×900
  the rail reads ~400px (the baseline open width); at 3440×1440 AND 5120×2880 the rendered controls
  pane width is GREATER than the 1440 baseline width (the rail SCALED with viewport-aware intrinsic
  sizing) and is BOUNDED by the M1 `clamp()` max (it did NOT grow to a 30rem-wide rail on a phone-narrow
  shell, and did NOT stay invariant at 400px). **BORN-RED WITNESS:** the recorded probe reads
  `controlsPane.w == 400` at 1280, 1920, 3440, AND 5120 (`layout-grid-k.md §2` — invariant across 4×
  area) → the "rail scaled on a large screen" assertion is FALSE on today's tree → RED. **BITE:** reds
  on the fixed `--rail-width: 400px` (`design-idioms.css:116`); greens on M1 (the `clamp()`/`minmax()`
  track).
- **clause (c) — the surplus is DISTRIBUTED, not dead gutter (M4; CORRECTNESS).** At 5120×2880, assert
  the stage cell (the subject region) consumes a LARGER fraction of the available content width than
  the pre-cure dead-gutter case — the work-area+stage occupy more than the pre-cure 37.5%W / 36.7%H,
  OR (under the center-card decision) the chrome+card cluster occupies the centered band with the
  docks bounded to it (clause (a)) and the stage grew via `minmax(0,1fr)`. The precise threshold is
  the IMPL's measured call against the M4 decision; the gate asserts the SURPLUS-IS-NOT-PURE-GUTTER
  property (the stage grew, OR the chrome clustered to the card — not both-unbounded). **BORN-RED
  WITNESS:** pre-cure the work-area fills 37.5%W / 36.7%H at 5K with 1600px dead gutter each side
  (`layout-grid-k.md §2` 5K block) and the stage is the fixed `1520px` (1920−400 rail) regardless of
  surplus → RED on the "stage grew with surplus" assertion. **BITE:** reds on the no-distribution-rule
  tree; greens on M4 (`[stage] minmax(0,1fr)` + the capped chrome).
- **clause (d) — ZERO hardcoded dock/rail offsets survive a grep (the U-K7 literal; CORRECTNESS,
  static).** A grep clause asserts: no fixed-px dock-anchor or rail-track literal in the demo styling
  source — specifically `--rail-width: <Npx>` is GONE from `design-idioms.css`, the dock-anchor chain
  carries NO raw-px addend beyond the φ `--dock-margin` term + the named ceiling token, and the macro
  grid carries no `400px`/fixed-rail track literal. **BORN-RED-ABLE ON PLANTED OFFSETS (the
  falsifiable witness — `K.md §invariants`, born-RED discipline):** the gate must RED if a `--rail-width:
  360px` (or any fixed-px dock/rail literal) is PLANTED back into `design-idioms.css`/`style.css` — a
  test fixture that re-introduces a hardcoded offset MUST fail the grep clause. **BITE:** reds on
  today's tree (`design-idioms.css:116` `--rail-width: 400px` is a present fixed-px literal → the grep
  matches → RED); greens when M1 derives it; reds AGAIN if a future edit plants a fixed offset back.
  **The grep is allowlist-fenced** so the φ `--dock-margin/4`÷`/φ` terms, the named
  `--dock-anchor-ceiling` token, and the legitimate `clamp()` min/max rem bounds are NOT false
  positives — the clause targets RAW fixed-px ANCHOR/RAIL literals, not every `px` in the stylesheet.
- **clause (e) — the TASTE review packet (the design VERDICT; USER-DOMAIN, the K-born TASTE
  boundary).** Per `K.md §invariants` the TASTE boundary: the layout-refinement close produces a
  **review packet** — per-pathological-viewport before/after screenshots (1280/1440/3440/5120 +
  tall portrait, the four §2 viewports), DESKTOP AND MOBILE, with the named deltas (the derived rail,
  the clustered docks, the distributed surplus) — and the layout design band closes ONLY on the
  user's verdict on that packet, a named USER-DOMAIN step scheduled BEFORE the K.WZ close
  (`K.md §clusters` K.WZ row: "the design band closes ONLY on the user's review-packet verdict"). An
  agent's "this clusters nicely now" is corroboration, NEVER the verdict. *(Labeled USER-DOMAIN/TASTE
  — clauses (a)-(d) are the CORRECTNESS gate the wave's GREEN depends on; clause (e) is the design
  VERDICT and may NEVER be substituted by an agent's eye. The packet GENERATES at K.W4's close
  alongside the pane packets — including K.W4's grid-opacity delta — per `K.md §clusters` K.W5/K.WZ
  rows.)*

**The §spine bar — MUST bite.** Clauses (a)-(d) are the layout-cluster CORRECTNESS oracle: each
asserts an EXACT property on the REAL built dist (the dock anchors bounded at 5K/portrait; the rail
scaled-but-bounded; the surplus distributed; zero fixed offsets by grep). The born-RED witness is
CONCRETE and RE-RUNNABLE: the recorded `layout-grid-k.md §2` probe output (`dock-top-anchor: 698.8px`
at 5K, `controlsPane.w == 400` invariant, 37.5%W fill) — the gate is RED on that observed shape
BEFORE the cure and GREEN after M1+M3+M4. Revert M3 → (a) reds (the slack is unbounded again); revert
M1 → (b) and (d) red (the rail is fixed 400px); revert M4 → (c) reds (the surplus is dead gutter);
plant a fixed offset → (d) reds. **Two-tier taxonomy:** clauses (a)-(d) are CORRECTNESS (the wave's
GREEN depends on them); clause (e) is the USER-DOMAIN TASTE verdict — corroboration only, never a
correctness substitute. **P6 posture (declared):** clauses (a)-(d) are DEVICE-INDEPENDENT (resolved
CSS tokens, geometry containment, DOM box rects, static grep — `ci-cd.md §5`-class
device-independent) — they HARD-gate on the Linux CI runner; the viewport sizes are SET by
`resize_window`/`emulate`, NOT read from the host, so the gate is host-independent BY CONSTRUCTION
(no `IN_CI` escape — `K.md §invariants` P6). Clause (e) is the TASTE boundary (USER-DOMAIN,
scheduled). *(The grid-line legibility re-check that the U-K20 opacity tune requires is K.W4's
clause, where that tune lands — not this wave's.)*

## §No-workaround prohibitions (BINDING — the mandate's named forbiddings for this wave)

- **NO retuned magic offsets.** "The dock layout dies at the GRID/anchoring system, NOT retuned magic
  offsets" (`K.md §MANDATE`). The cure is a DERIVED system (the `clamp()` rail, the `min()`-capped
  anchor, the container fork), NOT a new fixed-px value or a per-screen media-query patch ladder.
  Re-tuning the 0.382/0.618 φ-bias, or adding a `@media (min-width: 3440px) { --rail-width: 520px }`
  ladder, is the EXACT forbidden workaround — it shifts the failure to the next un-probed viewport
  instead of bounding it. Clause (d) (the grep) bites on any fixed-px offset re-introduced.
- **NO `container-type: size` (both axes) on the shell.** M2 uses `inline-size` ONLY
  (`layout-grid-k.md §3` "Do not" cite, guide §4) — `container-type: size` collapses descendants with
  no definite block-size. The width query covers the rail fork; the block-size is already definite
  (`AnimationControlsGroup.vue:311`). Adopting `size` to "be thorough" is the forbidden over-reach.
- **NO patching `--dock-margin` (the GAP) in the demo.** `--dock-margin` is a glass-ui token
  (`tokens.css:1304`, C4); any change to the dock GAP itself is a glass-ui-REPO change, born-RED to
  glass-ui, NEVER a demo patch (`K.md §invariants` inv-16; MEMORY `feedback_glass_ui_root_changes`,
  `feedback_glass_ui_root_changes`). This wave CONSUMES `--dock-margin` in the anchor chain (the
  `/4`÷`/φ` terms are PRESERVED, demo-side) but does not RE-BASE the gap. If the cluster design
  requires a different dock gap, that is the BINDING handoff below, not an inline demo override.
- **NO leaving `--rail-width: 400px` beside its replacement.** The fixed literal dies WITH the
  derivation (`K.md §invariants`, the net-deletion / no-legacy rule). M1 is a transposition, not an
  addition; a derived track shadowing a dead fixed token is the forbidden legacy-beside-replacement.
- **NO touching the grid-line opacity tokens.** `--graph-opacity`/`--graph-major-opacity`
  (`design-idioms.css:182-183`) are K.W4's (the U-K20 grid-opacity tune, charter-routed — `K.md
  §clusters` K.W4 row, README §4); W3 PRESERVES them untouched. Tuning them here would re-introduce
  the very ownership collision this wave's seam exists to prevent — the grid TINT is K.W4's, the grid
  GEOMETRY is W3's.
- **NO touching the K.W4 hero composition.** M4's C5 fold is the hero VERTICAL-POSITION reconcile
  (the `lg:mt-24` → work-area chain) ONLY. The FourierField removal, the empty-quadrant vacancy, the
  hero pane composition are K.W4's seam (`live-fourier-grid.md §K20-A/C`, `K.md §clusters` K.W4 row) —
  this wave does NOT remove the FourierField nor re-compose the hero pane.

## §Folds (every K.md-assigned + lane-assigned fold, with its evidence citation)

- **U-K7** (the hardcoded dock-offset census + the pathological-screen cluster) — M1 (the rail
  derived) + M3 (the chrome clustered) + M4 (the surplus distributed) + clause (d) (zero offsets by
  grep). `layout-grid-k.md §1/§2/§3/§4` + `K.md §clusters` K.W3 row. The headline finding of this
  wave; the born-RED witness (§Hard gate clauses (a)-(d)).
- **C1 — the fixed 400px rail** (`design-idioms.css:116`; invariant across 4× viewport-area span) —
  M1 (the `clamp()`/`minmax()` track). `layout-grid-k.md §FOLD` row 2.
- **C2/C3 — the work-area ceilings** (`style.css:121-122`; the content clamp that strands the chrome
  — already DONE, the missing rule is surplus-distribution) — M4 (the distribution decision; the
  clamp itself is RE-AFFIRMED, the surplus is what M4 adds). `layout-grid-k.md §FOLD` row 3.
- **The 5K/portrait dock float** (the unbounded `slack × bias`, `style.css:139-141,224,241`) — M3
  (the `min(offset, ceiling)` cap + the `@supports` anchor tether). `layout-grid-k.md §FOLD` row 1,
  the 5120×2880/1280×2000 probe shape; the born-RED witness (clause (a)).
- **Macro grid still on `@media`, not `@container`** (`AnimationControlsGroup.vue:348,432`; the micro
  tier already uses `@container`+subgrid) — M2 (the existing-idiom promotion). `layout-grid-k.md §FOLD`
  row 4.
- **C5 — the hero `lg:mt-24` magic margin** (`EditorStartScreen.vue:11`) — M4 (folds into the
  work-area chain; the hero VERTICAL-POSITION half only, the composition is K.W4). `layout-grid-k.md
  §FOLD` row 6.
- **C6 — `--target-viewport-w/h: 30vw/30vh`** (the cube target off raw viewport units, not the
  clamped stage cell) — M4 (tracks the stage cell via `cqi`/`cqb`, enabled by M2). `layout-grid-k.md
  §FOLD` row 7.
- **U-K20 — NOT folded here (cross-ref only).** BOTH halves of U-K20 — the FourierField removal AND
  the grid-line opacity tune (`design-idioms.css:182-183`) — are **K.W4's** (`K.md §clusters` K.W4
  row: "U-K20 the FourierField REMOVED from the hero + grid lines less opaque"; README §4 ownership
  table). The typography lane's §FOLD hands the opacity tune to "the hero/scene lane's seam"
  (`styling-typography-k.md §7`) = K.W4, and `live-fourier-grid.md` (the U-K20 owner-lane) carries
  both halves. W3 PRESERVES `--graph-*opacity` untouched; it derives the grid GEOMETRY, K.W4 tints it.
- **C4 — `--dock-margin` is a glass-ui token** (`tokens.css:1304`) — HANDOFF (born-RED to glass-ui if
  the dock GAP itself must change; NOT a demo patch). `layout-grid-k.md §FOLD` row 5, the cross-wave
  boundary below; MEMORY `feedback_glass_ui_root_changes`.
- **The layout gate-blindspot** (U-K7 is an uncovered axis; `proof:demo-shell-grid`/`stage-not-clipped`
  assert structure not the cluster; `visual-lock` re-baselined the disliked state) — clause (a)-(d)
  (the new `proof:layout-cluster` runtime gate born-RED on the §2 shape). `live-session-gap-analysis.md
  §3 (U-K7 row)` + `precepts-k.md` F10 (re-baseline `visual-lock` AFTER the K refinement, not before
  — the BINDING cross-wave note below). P-invariant-28 (the uncovered axis named + gated, not punted).
- **C7 — `--header-items-max-w: 500px`** (the header-items cap; chrome-cluster sizing) — RECORD only;
  it is out of the core dock/rail/work-area chain (a header-cluster sibling, `layout-grid-k.md §1`
  C7), bounds a wrapper not a dock anchor, and is NOT a dock offset U-K7 names. If the M4 cluster
  design surfaces it as a residual fixed-px, it folds; otherwise RECORD (P-invariant-28 — named, not
  silently dropped).

## §Hand-off / cross-wave boundaries (BINDING)

- **← K.W1 (the consume edge, BINDING DEP):** K.W3 runs AFTER K.W1's glass-ui `~3.11.2`→3.13.0
  re-pin lands locally — the dock chrome the layout hosts (the docks, the rail-pane sliders) comes
  from glass-ui 3.13.0, and `--dock-margin` is a 3.13 token; building the anchor chain against 3.11.2
  then re-pinning would re-litigate the cluster math (`K.md §WAVE MAP`: "the re-pin must precede the
  design waves"). K.W3 BUILDS ON 3.13.0.
- **∥ K.W2 (fonts, BINDING DISJOINT LOCI):** K.W2 owns the VOICE tokens (`--font-display`/`-mono`/
  `-text`, the `.dock-label` display-voice rule, the `--font-serif`≡`--font-display` collapse —
  `styling-typography-k.md §3/§9`); K.W3 owns the GRID/ANCHORING tier (the rail track, the dock
  anchor chain, the `@container` fork, the surplus distribution). File-adjacent in
  `demo/@/styles/{style,design-idioms}.css` but the seams are DISJOINT: W2 touches `font-family` /
  the `--font-*` tokens; W3 touches `grid-template-*` / the `--rail-*`/`--dock-*-anchor`/`--work-area-*`
  tokens. **The grid-line OPACITY token (`--graph-*opacity`) is NEITHER W2's NOR W3's — it is K.W4's**
  (the typography lane's §FOLD tags it "Visual-refine" and hands it to "the hero/scene lane's seam" =
  K.W4, `styling-typography-k.md §7`; README §4 ownership table: "owned by K.W4 … not W2 or W3"). The
  FONT tokens are W2's; the GRID/ANCHOR tokens are W3's; the grid TINT is W4's. If the IMPL finds an
  edit touches more than one token family in one rule, each wave names its tokens; no wave edits
  another's. (`K.md §WAVE MAP`: "the spec boundary is BINDING.")
- **→ K.W4 (the panes, BINDING — the hero-composition + U-K20 boundary):** K.W4 consumes the new
  grid (the pane re-cuts ride the derived rail + the `@container` fork). The hero boundary is SHARP:
  K.W3 owns the hero VERTICAL-POSITION reconcile (C5: `lg:mt-24` → work-area chain); **K.W4 owns the
  WHOLE of U-K20** — the hero COMPOSITION (the FourierField REMOVAL, `live-fourier-grid.md §K20-A/C`
  — the empty-quadrant vacancy, the hero pane layout) AND the grid-line OPACITY tune
  (`--graph-*opacity`, `design-idioms.css:182-183`, §K20-B/D + its legibility re-check). The charter
  §clusters K.W4 row carries BOTH halves ("U-K20 the FourierField REMOVED from the hero + grid lines
  less opaque, `live-fourier-grid.md` owns the removal seam") and README §4 names the opacity tune "a
  VISUAL tune, owned by K.W4 … not W2 or W3". W3 PRESERVES `--graph-*opacity` untouched — ONE U-K id,
  wholly K.W4's; W3 supplies only the grid GEOMETRY it tints.
- **→ K.W5 (the gate-truth wave, BINDING):** the `proof:layout-cluster` gate (§Hard gate clauses
  (a)-(d)) is AUTHORED by THIS wave (it lands WITH the layout surface it certifies — `K.md §clusters`
  K.W5 row: "the remaining gate-truth legs land as the surfaces they certify land"); K.W5 owns the
  axis-coverage MAP that this gate is one row of, and the TASTE review-packet protocol/generator (the
  packet rides "the W3-lib capture harness" — `K.md §clusters` K.W5 row — i.e. the existing
  `scripts/lib/demo-driver.mjs withPage` lib this wave's layout-cluster gate also rides; W5 AUTHORS
  the generator atop it). K.W3 declares clause (e)'s packet REQUIREMENT (the per-viewport
  before/after, desktop+mobile); K.W5 instruments the generator.
- **→ K.WZ (the close, BINDING — the TASTE boundary):** the layout review packet (clause (e)) is
  PRESENTED to the user and the layout design band closes ONLY on the user's verdict — a named
  USER-DOMAIN step BEFORE the version cut (`K.md §clusters` K.WZ row: "the design band closes ONLY on
  the user's review-packet verdict (the TASTE boundary)"). The packet GENERATES at K.W4's close
  (alongside the pane packets); K.WZ records the verdict.
- **HANDOFF / glass-ui (the `--dock-margin` GAP, BINDING):** if the M3/M4 cluster design requires a
  different dock GAP (the spacing between dock items, not the anchor offset), that is a glass-ui-REPO
  change — born-RED to glass-ui per the handoff ledger, NEVER a demo patch (C4,
  `layout-grid-k.md §FOLD` row 5; `glassui-handoff-k.md`; MEMORY `feedback_glass_ui_root_changes`).
  This wave PRESERVES the `--dock-margin/4`÷`/φ` terms demo-side and does not re-base the token.
- **→ `visual-lock` re-baseline (BINDING, cross-wave note):** `proof:visual-lock` was re-baselined in
  J.W7c against the disliked layout, so the disliked state is the locked baseline (`precepts-k.md`
  F10, `live-session-gap-analysis.md §3`). After K.W3+K.W4 land the refinement, `visual-lock` is
  re-baselined AFTER (never before) — but the re-baseline is K.W5's gate-truth scope, NOT this wave's
  (this wave NAMES the dependency; K.W5 owns the re-shot baseline so it locks the REFINED state, not
  the disliked one).
- **OUT / sibling (do NOT touch):** the FourierField removal → K.W4; the grid-line opacity tokens
  (`--graph-*opacity`, `design-idioms.css:182-183`) → K.W4 (the whole of U-K20); the font/voice tokens
  → K.W2; the `--dock-margin` gap re-base → glass-ui repo; the pane re-cuts (spring/tabs/readout/clipped
  pane) → K.W4; the cold-path P0 (`scenePlaybackAdapters.ts`) → K.W0; the `visual-lock` re-baseline
  → K.W5.

## §Design decisions (trade-offs RESOLVED)

- **The cure is a DERIVED grid system, NOT retuned offsets — RESOLVED.** The dock float dies by
  CAPPING the slack at the derivation (`min(offset, ceiling)`, the named `--dock-anchor-ceiling`) and
  tethering to the clamped work-area rect behind `@supports`; the rail dies by an intrinsic
  `clamp()`/`minmax()` track; the fork moves to `@container`. A per-screen media-query patch ladder or
  a re-tuned φ-bias would shift the failure to the next un-probed viewport, not bound it
  (`K.md §MANDATE`). The system bounds it once, for all screens.
- **The bounded-`min()` path is the always-correct FLOOR; anchor-positioning is the progressive
  enhancement — RESOLVED.** anchor-positioning is "not yet natively supported" (`layout-grid-k.md
  §3.3`, guide §5), so it lands behind `@supports (anchor-name: --x)` with the bounded-`min()` fallback
  as the path every browser takes by default; the wave is GREEN on the fallback alone (a browser
  without anchor-positioning still passes clause (a)). The ≤20-line custom fallback is the guide's
  "Interpreting Fallbacks" preference for a not-yet-Baseline feature — not a polyfill, a graceful
  floor.
- **The surplus distribution is center-card-with-growing-stage — RESOLVED.** Of the two
  `layout-grid-k.md §4` options (center-card vs grow-stage), the resolved choice is BOTH-bounded: the
  rail stays bounded by M1's `clamp()` (no 30rem rail on a 5K panel), the stage grows via
  `minmax(0,1fr)` (the subject — what the user came to see — uses the surplus), and M3's capped anchors
  keep the chrome hugging the card. This is the idiom-ordered choice (`layout-grid-k.md §4`): the rail
  is chrome (bounded), the stage is content (grows). The exact thresholds are the IMPL's measured call
  against the four probe viewports; the spec BINDS the property (surplus is not pure gutter), not a
  literal.
- **`container-type: inline-size`, NOT `size` — RESOLVED.** The block-size is already definite
  (`AnimationControlsGroup.vue:311`, `height: min(100dvh, --work-area-max-height)`), and the width
  query covers the rail fork; `size` (both axes) would collapse descendants with no definite block-size
  (`layout-grid-k.md §3` "Do not", guide §4). `inline-size` is the safe and sufficient choice.
- **The FONT tokens are W2's, the GRID/ANCHOR tokens are W3's, the WHOLE of U-K20 is W4's — RESOLVED.**
  U-K20 has TWO halves (the grid-opacity tune + the FourierField removal); the binding charter
  (`K.md §clusters` K.W4 row) and README §4 route BOTH to **K.W4** — the opacity tune is "a VISUAL
  tune, owned by K.W4 … not W2 or W3" and the FourierField removal is K.W4's hero composition. The
  earlier draft of this wave claimed `--graph-*opacity` for W3 on a MISREADING of the typography
  lane's §FOLD: that §FOLD hands the opacity tune to **"the hero/scene lane's seam, not this lane"** —
  i.e. to K.W4 (the visual-refine wave), NOT to W3 (`styling-typography-k.md §7`). The resolution by
  SEAM: W2 owns `--font-*`, W3 owns the `--rail-*`/`--dock-*-anchor`/`--work-area-*` grid/anchor
  tokens, W4 owns `--graph-*opacity` + the FourierField mount. W3 PRESERVES `--graph-*opacity`
  untouched — it derives the grid GEOMETRY, K.W4 tints it. Disjoint loci across the three waves; each
  names its tokens (`K.md §WAVE MAP` "the spec boundary is BINDING").
- **The layout band's VERDICT is the user's, not an agent's — RESOLVED.** Per the K-born TASTE
  boundary (`K.md §invariants`), clauses (a)-(d) carry CORRECTNESS (the docks bounded, the rail
  derived, the surplus distributed, the offsets gone — all gate-able); the DESIGN verdict ("does this
  cluster beautifully on a cinema display and a phone alike?") is the user's on the review packet
  (clause (e)), scheduled BEFORE the K.WZ close. An agent's "this clusters nicely now" is
  corroboration, never the verdict. The J taste-tension (gate-green agent-PASS vs user "looks awful")
  is exactly what this boundary resolves: the gate proves the geometry; the user signs the beauty.
- **Desktop AND mobile both in scope — RESOLVED.** U-K7 names both; the mobile fork (`@media
  max-width:1023px` → `@container`, the bottom-sheet controls, the full-bleed stage) is refined
  alongside the desktop grid. The tall-portrait probe (1280×2000) is a §Hard-gate viewport precisely
  because the slack-float defect bites the portrait/mobile axis too (`layout-grid-k.md §2` tall-portrait
  block: 362/588px float) — the cluster cure is not desktop-only.
