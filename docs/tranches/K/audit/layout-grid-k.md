# Tranche K Audit — Layout / Grid System (lane: layout-grid-k)

**Scope (U-K7):** the EditorShell / AnimationControlsGroup grid, the dock-anchoring
tokens, the work-area math — the hardcoded-offset census, the modern grid/subgrid
redesign space, and the pathological-screen behavior NOW. DOCS ONLY; every claim
cites file:line, a probe command + observed output, or a screenshot (inv ε).

Branch `tranche-j-dev` @ 4f1fc4c. Built dist served from `dist/gh-pages` (52 files,
`index-BFS8FWWM.css`). Browser probes: `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui`,
`scripts/lib/demo-driver.mjs withPage`. Probe driver: `docs/tranches/K/audit/probe-pathological.mjs`
(+ the isolated per-viewport runs). Screenshots under `docs/tranches/K/audit/screenshots-k/`.

---

## 0. The layout system as it stands (the map)

The macro layout is one CSS grid named **`.controls-layout`** in
`demo/@/components/custom/animation-controls/AnimationControlsGroup.vue:309-480`:

- **Desktop (`@media (min-width: 1024px)`, line 432):** `grid-template-columns: [rail] var(--rail-track) [stage] 1fr` + `grid-template-rows: [top] auto [stage] 1fr [bottom] auto`. The controls pane lives in the `[rail]` column, the subject in `[stage]`. Open/close animates the `[rail]` track between `var(--rail-width)` and `0px` (lines 440-447).
- **Mobile (`@media (max-width: 1023px)`, line 348):** the grid is abandoned — the stage becomes `position: fixed; inset: 0` full-bleed, the controls pane becomes a fixed bottom sheet. `display: grid` is set desktop-only (line 439).
- **The two docks are out of flow.** The top scene-switcher (`ChromeDock.vue:169`) is `fixed left-1/2 -translate-x-1/2` with `top: var(--dock-top-anchor)` (line 170). The bottom `TransportDock.vue:8` is fixed with `bottom: var(--dock-bottom-anchor, var(--work-area-bottom-offset, 0px))`.
- **The whole cluster is bounded** by `--work-area-max-width: clamp(72rem, 94vw, 120rem)` and `--work-area-max-height: clamp(44rem, 88dvh, 66rem)` (`style.css:121-122`), applied to `.controls-layout` width/height (lines 310-311) with `margin: auto` centering (line 314).

The dock anchors are **derived from the vertical slack**, not from the viewport edge:
```
--work-area-vertical-slack: max(100dvh − work-area-height, 0)         (style.css:139)
--work-area-top-offset:     slack × 0.382  (1/φ²)                     (style.css:140)
--work-area-bottom-offset:  slack × 0.618                            (style.css:141)
--dock-top-anchor:    max(top-offset, safe-area-top)    + --dock-margin/4     (style.css:224)
--dock-bottom-anchor: max(bottom-offset, safe-area-bot) + --dock-margin/φ     (style.css:241)
```
This is the root cause of the pathological-screen failure (§2): the dock offsets
**grow without bound** as the viewport exceeds the clamp ceilings, because slack =
`viewport − fixed-ceiling` is unbounded.

---

## 1. The hardcoded-offset census (U-K7: "NO hardcoded dock offsets")

The good news first: the work-area / dock chain is **almost** fully tokenized and
φ-derived (J.W7c U1 did real work — no raw `px` in the anchor math, the asymmetry is
`--dock-margin/4` vs `--dock-margin/φ`). The census below is the residue.

| # | Token / literal | Where | Value | Verdict |
|---|---|---|---|---|
| C1 | `--rail-width` | `design-idioms.css:116` | **`400px` (fixed)** | **P1** — the single hardcoded layout track. The rail is 400px on a 1280px screen AND on a 5120px screen (verified §2: `controlsPane.w == 400` at every probe). It never scales, never clamps to a fraction. This is THE "hardcoded dock offset" U-K7 names. |
| C2 | `--work-area-max-width` ceiling | `style.css:121` | `clamp(72rem, 94vw, **120rem**)` → 1920px | **P1** — the ceiling that strands the cluster (§2). Past 2042px viewport (120rem/0.94) the work-area is frozen at 1920px and all extra width becomes dead gutter. |
| C3 | `--work-area-max-height` ceiling | `style.css:122` | `clamp(44rem, 88dvh, **66rem**)` → 1056px | **P1** — vertical twin of C2; past 1200px viewport height the cluster freezes at 1056px and the slack inflates the dock anchors (§2 tall-portrait). |
| C4 | `--dock-margin` | **glass-ui** `tokens.css:1304` | `0.5rem` | **P2 / cross-repo** — the dock margin is a glass-ui token, NOT demo-owned. Per MEMORY (`feedback_glass_ui_root_changes`), any redesign that re-bases the dock gap must land in the glass-ui repo, not be patched in the demo. Flag for the orchestrator: the dock-offset redesign is partly a glass-ui handoff. |
| C5 | `EditorStartScreen` hero | `EditorStartScreen.vue:11` | `lg:mt-24` (6rem) + `px-6` | **P2** — a raw Tailwind margin on the hero block, not a layout token. Couples the hero vertical position to a magic `mt-24` on desktop instead of the work-area chain. |
| C6 | `--target-viewport-w/h` | `design-idioms.css` | `30vw` / `30vh` | **P2** — the cube target sizes off raw viewport units, not the work-area or a container query, so it does not track the clamped stage cell (a sibling of the C2/C3 freeze). |
| C7 | `--header-items-max-w` | `design-idioms.css` | `500px` (fixed) | **P2** — header items wrapper cap is fixed px (out of this lane's core but part of the chrome cluster sizing). |

**Net:** the dock *anchor math* is clean (φ-derived, no raw px). The hardcoded
offsets that remain are the **fixed-size ceilings + the 400px rail** — and those are
precisely what breaks pathological screens, because the system *clamps the content
cluster* but has **no rule that clusters/clamps the chrome past a ceiling** (U-K7's
"docks + controls cluster past a max"). The clamp exists for content; the *cluster*
behavior U-K7 asks for does not exist at all.

---

## 2. Pathological-screen behavior NOW (probed on the BUILT dist)

Probe: `node /tmp/probe-one.mjs <name> <w> <h> cube` (isolated process per viewport,
`withPage` over `dist/gh-pages`, `#/cube`, open the controls panel, read resolved
token px + box rects). Raw JSON in the run output below; screenshots cited.

### 3440×1440 (ultrawide) — `screenshots-k/cube-3440x1440.png`
```
work-area:  1920×1056   → fills 55.8% W (760px dead gutter EACH side), 73% H
rail pane:  400px       stage: 1520px
dock-top-anchor: 148.7px   dock-bottom-anchor: 242.3px   (sane)
```
**Borderline.** Docks anchor reasonably; ~44% of the width is empty gutter but the
cluster reads as a centered card. This is the edge where it starts to fail.

### 5120×2880 (5K) — `screenshots-k/cube-5120x2880.png`  **★ the smoking gun**
```
work-area:  1920×1056   → fills 37.5% W (1600px dead gutter EACH side!), 36.7% H
rail pane:  400px (UNCHANGED)   stage: 1520px
dock-top-anchor:    698.8px     (top dock floats ~700px BELOW the top edge)
dock-bottom-anchor: 1132.2px    (bottom dock floats ~1130px ABOVE the bottom edge)
vertical-slack:     1824px      top-offset: 696.8px   bottom-offset: 1127.2px
```
The screenshot shows the ENTIRE UI — controls pane, cube, both docks — marooned as a
tiny ~1920px island dead-center in a 5120px ocean of empty graph paper. The docks do
not anchor to the viewport edges; they float ~700–1130px in, because their offset is
`slack × bias` and slack = 5120-relative. **62.5% of the horizontal viewport and 63%
of the vertical viewport is wasted.** Nothing scales up, nothing clusters to the
edges, nothing clamps to a max-then-distribute. This is the exact U-K7 failure.

### 1280×2000 (tall portrait) — `screenshots-k/cube-1280x2000.png`
```
work-area:  1203×1056   → 94% W, but only 52.8% H (472px dead top, 472px dead bottom)
vertical-slack: 944px   top-offset: 360.6px   bottom-offset: 583.4px
dock-top-anchor:    362.6px    (top dock floats 362px down)
dock-bottom-anchor: 588.3px    (bottom transport floats 588px UP from the bottom)
```
The cluster is vertically pinned to a centered band; the golden-split bias × 944px of
slack pushes both docks far off their edges. Over half the vertical viewport is dead.

### Summary table

| viewport | WA fills | dead gutter | top-dock anchor | bottom-dock anchor | rail px |
|---|---|---|---|---|---|
| 1920×1080 (baseline) | 94% W / 88% H | 58px / 65px | ~50px | ~50px | 400 |
| 3440×1440 | 55.8% W | 760px ea. | 148.7px | 242.3px | 400 |
| 1280×2000 | 52.8% H | 472px ea. (vert) | 362.6px | 588.3px | 400 |
| **5120×2880** | **37.5% W / 36.7% H** | **1600px ea.** | **698.8px** | **1132.2px** | **400** |

The 400px rail is invariant across a 4× viewport-area span — the clearest single proof
that the layout does not respond to pathologically large screens.

---

## 3. The modern grid/subgrid redesign space

`modern-web-guidance@latest` (skill version `2026_05_16-c5e7870`); retrieved
`css-layout` in full. The codebase **already uses the modern idioms locally** but NOT
at the macro layout tier — the redesign is "promote what the micro layout already
does to the macro grid", which keeps it idiomatic to this repo.

**Existing modern usage (the precedent to follow):**
- `container-type: inline-size` + `container-name: easing-editor` at `TimingFunctionPanel.vue:205` and `style.css:402` (the AnimationVisualizer container — MEMORY confirms `calc(100cqw − 100%)` ball math).
- CSS **subgrid** via `.labeled-field-grid` (`design-idioms.css:622-673`) — the uniform label-column idiom. Subgrid is Baseline-2023 (guide §3); the project already depends on it.

So the macro grid is the **only** layout tier still on viewport media queries + a fixed
rail. The guidance maps cleanly:

1. **The 400px rail → a `clamp()`/`minmax()` track (C1, guide §3 + §1.2).** Replace `[rail] var(--rail-width)` with `[rail] clamp(20rem, 28cqi, 30rem)` (or `minmax(20rem, 0.25fr)`) so the rail widens on large screens instead of staying 400px. Guide §1.2: "reach for intrinsic sizing and flexible tracks (`fr`, `minmax()`) before fixed `width`/`height`".

2. **`.controls-layout` → a container, not a viewport reader (guide §4).** Put `container-type: inline-size` on the shell and switch the desktop/mobile fork from `@media (min-width: 1024px)` to `@container (inline-size > 1024px)`. The component then responds to ITS box, not the viewport — correct for the eventual side-by-side / embedded cases and the natural home for the cluster math.

3. **The dock chrome → anchor positioning OR a CSS-grid edge band, NOT slack×bias (the §2 fix).** The dock offsets should be a *bounded* gap from the viewport edge, not `slack × 0.618`. Two routes from guide §5:
   - **Bounded anchor:** `--dock-top-anchor: min(top-offset, 6rem)` (cap the float) — a one-line clamp that immediately fixes the 5K/portrait float (the docks stop wandering 700–1130px in).
   - **Anchor positioning (guide §1.2 decision #6, §5):** `anchor-name` on the stage cell, `position-anchor` + `position-area` on the docks, so the docks tether to the *work-area* rect (which IS clamped) rather than to viewport-derived slack. Guide flags anchor-positioning is **not yet natively supported** → ship with the `@supports (anchor-name: --x)` feature-detect + the bounded-`min()` fallback above. (Baseline policy: this repo targets modern Chromium for the demo; the bounded-`min()` fallback is the ≤20-line custom path the guide §"Interpreting Fallbacks" prefers.)

4. **The pathological-large ceiling → cluster-and-distribute past a max (U-K7 "cluster past a ceiling").** The work-area already clamps to 1920×1056. The missing rule is what to do with the *surplus*. Options, in idiom order:
   - Keep the content clamped but **bind the dock offsets to the work-area edge** (route 3) so the chrome hugs the centered card instead of floating in the void — the minimal fix.
   - OR let the **stage** grow past the rail with `[stage] minmax(0, 1fr)` and a higher max-width on `--work-area-max-width` for the stage column only, so the subject uses the extra real estate while the rail stays bounded by `clamp()`.

5. **`5120` 5K specifics — `cqi`/`cqmax` fluid type (guide §4.1, `fluid-scaling`).** Once `.controls-layout` is a container, the rail/labels can use `clamp(…, …cqi, …)` so they scale gently up on huge screens instead of looking like 8pt text on a 5K panel (a U-K10/U-K8 adjacency, not this lane's call to make but enabled by the container conversion).

**One caution (guide §4 "Do not"):** if `.controls-layout` adopts `container-type:
size` (both axes) it must keep a definite block-size or descendants collapse — the
chain already gives it `height: min(100dvh, --work-area-max-height)` (line 311), so
`inline-size` is the safe choice (width-only queries cover the rail fork).

---

## 4. The max-cluster design (docks + controls clamp and cluster past a ceiling)

U-K7's literal ask: "pathologically large screens handled (docks + controls cluster
past a max)". Concretely, past a viewport ceiling the design should:

1. **Clamp the content cluster** — already done (C2/C3, `clamp(...)` ceilings 1920×1056).
2. **Clamp the rail** — NOT done; replace the fixed `400px` (C1) with `clamp()`/`minmax()`.
3. **Cluster the chrome to the content, not the viewport** — NOT done; the docks float on slack×bias (§2). Bind them to the work-area rect (anchor positioning §3.3) or cap the anchor with `min(offset, ceiling)`.
4. **Distribute surplus deliberately** — currently surplus = dead gutter (§2). Decide: center-card (cap docks) OR grow-stage (`minmax(0,1fr)` stage, bounded rail).

A concrete sketch (the redesign space, NOT a patch — implementation is a wave):
```css
.controls-layout {                 /* the shell becomes a container */
  container: inline-size / editor;
}
@container editor (inline-size > 64rem) {       /* was @media min-width:1024px */
  .controls-layout {
    grid-template-columns: [rail] clamp(20rem, 26cqi, 30rem) [stage] minmax(0, 1fr);
  }
}
:root {
  /* cap the float so docks hug the clamped card on huge screens */
  --dock-top-anchor:    calc(min(var(--work-area-top-offset), 6rem)    + var(--dock-margin)/4);
  --dock-bottom-anchor: calc(min(var(--work-area-bottom-offset), 8rem) + var(--dock-margin)/var(--phi));
}
@supports (anchor-name: --stage) {   /* the forward idiom; feature-detected */
  .stage-cell { anchor-name: --stage; }
  .chrome-dock   { position-anchor: --stage; position-area: top    center; }
  .transport-dock{ position-anchor: --stage; position-area: bottom center; }
}
```
This caps the 5K/portrait dock float (§2 fixed), keeps the rail bounded but
viewport-aware (C1 fixed), and routes the macro grid through a container query like the
micro layout already does. C4 (`--dock-margin`) reminds: any change to the dock *gap*
itself is a glass-ui-repo edge, not a demo patch.

---

## §FOLD

| Finding | Sev | The seam | Suggested wave-class |
|---|---|---|---|
| **5K/portrait dock float** — docks anchor on `slack × bias` (style.css:224,241), so at 5120×2880 the top dock floats 698px down, bottom 1132px up; at 1280×2000 362/588px. The whole UI maroons as a tiny island in dead space (`cube-5120x2880.png`). | **P1** | `style.css:139-141,224,241` (the slack→offset→anchor chain) | layout-cluster: cap with `min(offset, ceiling)` now; anchor-positioning to the work-area rect behind `@supports` later |
| **Fixed 400px rail** — `--rail-width: 400px` (design-idioms.css:116) never scales; invariant across a 4× viewport-area span (probe: `controlsPane.w==400` at 1280, 1920, 3440, 5120). The one true hardcoded dock offset U-K7 names. | **P1** | `design-idioms.css:116`; track at `AnimationControlsGroup.vue:441` | layout-cluster: `clamp()`/`minmax()` rail track |
| **Surplus = dead gutter** — work-area clamps to 1920×1056 (C2/C3) but nothing clusters/distributes the surplus; 62.5%W + 63%H wasted at 5K (`cube-5120x2880.png`). No "cluster past a max" rule exists. | **P1** | `style.css:121-122` ceilings + `AnimationControlsGroup.vue:309-314` | layout-cluster: decide center-card vs grow-stage; `[stage] minmax(0,1fr)` |
| **Macro grid still on `@media`, not `@container`** — the micro layout already uses subgrid (`design-idioms.css:622`) + container queries (`style.css:402`, `TimingFunctionPanel.vue:205`), but `.controls-layout` reads the viewport (`AnimationControlsGroup.vue:348,432`). Redesign = promote the existing idiom to the macro tier. | **P2** | `AnimationControlsGroup.vue:348,432` | layout-modernize: `container-type: inline-size` on the shell; `@container` fork |
| **`--dock-margin` is a glass-ui token** (`tokens.css:1304`), so re-basing the dock gap is a glass-ui-repo change, not a demo patch (MEMORY: glass_ui_root_changes). | **P2** | cross-repo: `node_modules/@mkbabb/glass-ui/.../tokens.css:1304` | handoff: born-RED to glass-ui if the gap itself must change |
| **Hero `lg:mt-24` magic margin** — the start screen positions off a raw Tailwind margin (`EditorStartScreen.vue:11`), not the work-area chain. | **P2** | `EditorStartScreen.vue:11` | layout-cluster (folds into the hero/work-area reconcile) |
| **`--target-viewport-w/h: 30vw/30vh`** — the cube target sizes off raw viewport units, not the clamped stage cell, so it does not track the work-area freeze (C6). | **P2** | `design-idioms.css` (`--target-viewport-w/h`) | layout-modernize: `cqi`/`cqb` once the stage is a container |
| **glass-ui pin lag** — kf pins `~3.11.2`, registry latest `3.13.0` (verified: `npm view @mkbabb/glass-ui version` → 3.13.0; installed 3.11.2). Cross-ref U-K14; the dock/slider chrome the layout hosts comes from glass-ui. | **P2** | `package.json:182` / `demo/package.json` | upgrade lane (U-K14 owns; noted here as the chrome the layout grid hosts) |

**Cross-lane note:** the COLD-path freeze (U-K2/U-K3, the J.W7c U4 conditional-select
deletion) and the font/voice items (U-K6/U-K8/U-K10) are other lanes' roots; this lane
only observed that the layout grid itself is sound on the happy path (1920×1080: 94%W,
docks at ~50px) and fails on the *cluster/clamp-past-a-ceiling* axis U-K7 names.
