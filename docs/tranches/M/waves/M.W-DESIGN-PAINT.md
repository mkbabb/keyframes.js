# M.W-DESIGN-PAINT — Design-paint truth (born-RED pixel-readback gate)

- **Band:** BC-gated (new band — the design truth band; fires after M.W8 Phase-2 + the BC
  glass-ui consume; independent of the Band A/B/C/D/E apparatus). **Class:** DEV (docs);
  IMPL opens on authorization AND on the BC-consume firing. **Dep:** **glass-ui BC** (the
  BC cut delivers the dock redesign + the aria guard + RF-17 fix — M.W8 Phase-2; the demo
  must be in its final-consume state before we gate visual truth). Born-RED TODAY by
  construction (no `proof:design-paint` exists, and the existing scenes have not been
  measured against a pixel-readback oracle).
- **Gate (NEW):** `proof:design-paint` — born-RED: does not exist today (`ls scripts/
  proof-design-paint.mjs` → not found, verified); its absence means every visual claim
  is unvalidated. RED by construction: a gate that has never been written cannot be GREEN.
- **Folds:** `M-RECONCILIATION.md §10` (the new-wave stub mandate); the CONSTELLATION-CAMPAIGN
  `§4` "new waves" clause ("inv-M-observable-truth made visual"); the design-audit research
  (`audit/lane-10-w11-design.md`, the appearance/interaction/state blind-spot finding).
- **Precept cure:** the **gate blind-spot** (appearance/interaction/state axis —
  `feedback_gate_blindspot_appearance_axis.md`): green source-shape gates miss
  appearance/interaction/state; the running demo needs a system gate. This wave closes
  that gap for the M-era scenes with a REAL pixel-readback oracle over the live demo.

---

## Context

The M gate-apparatus review (`M.md §frontier 1`, `audit/lane-10-w11-design.md`) confirms
that the existing gate suite is thorough on CORRECTNESS and BEHAVIOUR but has a structural
gap on **appearance**: no gate reads pixels, no gate computes paint metrics, and no gate
asserts that a scene's visual state is what we claim it is. The source-shape gates (eslint,
proof:boundary) and the runtime-invocation gates (`proof:replay-equality`, `proof:ingest-
replay`, etc.) are orthogonal to the rendered scene appearance.

This is not a minor gap. The project's selling point is VISUAL motion — CSS keyframe
animations, spring physics, carousel rings. If the scene LOOKS broken (wrong blend mode,
missing specular, dropped glass effect, invisible animation), the library's showcase
purpose fails — and no existing gate catches it.

**The inv-M-observable-truth application.** The L.W1 S4 lesson: the gate tested a proxy
(no-throw + string round-trip) while the REAL breach was NaN frame-times. The appearance
analog: a gate that checks `proof:replay-equality` (the EMITTED CSS) passes even if the
RENDERED scene shows a blank white rectangle because a `mix-blend-mode: screen` was dropped.
The genuine observable is the **painted pixels** in the live browser, not the emitted CSS
string. The proxy to avoid: grepping for `mix-blend-mode` in source (passes even if the
property has no visual effect due to a stacking-context collapse).

**The BC-gate rationale.** The visual truth gate is authored BEFORE the BC consume but
IMPLEMENTED AFTER: the born-RED gate is authored against today's tree (it is structurally
absent — no script, no assertion), and the IMPL opens when the BC-consumed demo is final
(because gating a pre-final demo is wasteful — the BC consume changes the visual surface,
so the baseline must be post-BC).

---

## The genuine observable (inv-M-observable-truth)

**What is being measured:** the rendered pixel state of each demo scene, read from the
real browser, on the real `dist/gh-pages` build, over the full 8-scene sweep. The
genuine defect: a scene renders incorrectly (wrong visual state, missing effect, broken
animation) and no gate bites.

**The proxy to avoid:** CSS string assertions, source-shape `mix-blend-mode` greps,
screenshot diffs against a stale reference image (which would pass even if the reference
is wrong). The gate must NOT be:
- A grep that `backdrop-filter` appears in source (a property can be present in source
  but produce no visual effect due to stacking-context or browser support).
- A screenshot diff against an unvalidated baseline (a wrong scene would create a
  wrong baseline and the diff would stay zero forever).

**The real oracle:** For each scene and each claimed visual state (idle, hover, play,
reduced-motion), the gate reads a set of **pixel-level signals** from the live browser:
- **Colour sample** from a designated landmark region (e.g. the animated ball at the
  known idle-rest position): the sampled colour must be in a known gamut (not blank
  white = `rgb(255,255,255)`, not transparent-black = `rgba(0,0,0,0)` — the two
  failure modes of a dropped backdrop-filter or a z-index burial).
- **Glass specular present**: `getComputedStyle` on the front glass card's `::before`
  pseudo (where the specular shimmer lives) reads `opacity > 0` in hover state.
- **Animation live**: for each scene that claims continuous motion at idle, the
  designated element's `transform` matrix value CHANGES between two rAF ticks
  (read via `getComputedStyle` once, wait one frame, read again — diff is non-zero).
  This is the REAL "animation is running" observable — NOT the presence of a CSS
  `animation` property in source.

---

## Scope

### S1 — Author the gate script gate-first (born-RED on today's tree)

**Breach.** No `scripts/proof-design-paint.mjs` exists today. The absence is the born-RED
state: the gate has never been written, so the visual-truth claim is entirely unvalidated.

**Cure (gate-first — the script, no scene changes).** Author `scripts/proof-design-paint.mjs`:
- Uses `demo-driver.mjs` (`withPage` + `serveDist`) to open the built `dist/gh-pages`
  demo in a real browser (headless Playwright, the same setup as every other runtime gate).
- Iterates the 8-scene sweep via `navToScene(page, sceneName)` (the existing driver helper).
- For each scene, applies the per-scene paint checks (see S2).
- Exits 1 if any check fails; prints a scene-by-scene report naming the failing signal
  and the measured value.
- **Born-RED on today's tree: the script does not exist → exit 1 by construction.**
  After authoring the script, the first run on the pre-BC demo establishes the born-RED
  baseline for each check (the checks are designed to catch BLANK/INVISIBLE failures,
  which may already exist on the current demo — any scene with a blank pixel sample
  or a non-running animation is a born-RED finding that the impl must cure).

**Falsifiable check.** `ls scripts/proof-design-paint.mjs` → present after authoring.
`node scripts/proof-design-paint.mjs` → exit 1 on today's tree (either by script-absent
or by a failing paint check on the current demo state — both are valid born-RED forms).

---

### S2 — The per-scene pixel-readback oracle (the check matrix)

**Scope.** Each of the 8 demo scenes (home, cube, amiga, square, easing, spring, sequence,
motion-path) gets a tailored check set. The check set is the **minimum** set that catches
the genuinely catastrophic failure modes (blank rectangle, dropped glass, frozen animation)
without overclaiming visual exactness (no strict pixel-diff, no colour-channel tolerance
tighter than 15%).

**The check matrix (per-scene, authored at gate-first time, refined at impl time):**

| Scene | Region | Signal | Red condition |
|---|---|---|---|
| home | the animated title (the hero text animation) | `transform` matrix value differs between rAF frames | zero delta (animation frozen) |
| cube | the 3D cube face | `transform` matrix CHANGES per frame during active animation | zero delta |
| amiga | the Boing ball | sampled pixel at ball centre is NOT blank white or transparent-black | `rgb(255,255,255)` or `rgba(0,0,0,0)` |
| square | the pulsing square | bounding rect area > 0 AND `opacity` > 0.1 | zero area or zero opacity |
| easing | the easing curve canvas | canvas element `width × height > 0` AND sampled pixel non-blank | blank canvas |
| spring | the spring slider | thumb element `left` (or `transform`) changes per user-input | no change after a synthetic input |
| sequence | the stagger row | at least 3 child elements have distinct `opacity` values mid-sequence | all children have the same opacity (stagger not running) |
| motion-path | the path traveller | `transform` matrix changes per frame (the offset-path traveller is live) | zero delta |

**The a11y + reduced-motion row (the global check).**
Under `prefers-reduced-motion: reduce` (Playwright `emulateMediaFeatures`):
- No scene shows a running rAF loop: the designated animated element's `transform` matrix
  value must NOT change between two rAF frames. This is the REAL observable — kf animations
  are driven by `RAFPlayback` (rAF-based, `playback.ts`), NOT the Web Animations API.
  `getAnimations()` is always empty for kf animations and must NOT be used as the witness
  (it is a proxy that would pass even on a running rAF loop). The real check: read the
  element's `getComputedStyle().transform` at frame N and frame N+1; under PRM + `respectReducedMotion`
  the animation snaps to its final frame and the rAF loop stops — `transform` is stable
  (zero delta). A non-zero delta means the loop is still running, which is the born-RED
  signal.
- The glass specular `::before` pseudo has `opacity: 0` (the specular does not animate under
  PRM — the glass-ui bracket freezes it).

---

### S3 — The glass specular check (inv-M-observable-truth applied to the design)

**Breach.** The glass specular on the glass cards is a key visual element of the design
language. It is NOT checked by any existing gate. A dropped specular (from a `position: fixed`
stacking-context collapse, a `will-change: transform` isolation leak, or a BC glass-ui change)
would be invisible to all current gates.

**Cure.** The gate adds a specular-present check: for the front glass card in each scene that
renders one (cube, spring, sequence), hover the card with `page.hover(selector)` and read the
computed `opacity` of the `::before` pseudo. The specular `::before` must have `opacity > 0`
in hover state (the glass-ui specular mechanism: `--mouse-x/--mouse-y` are set on pointer-move
and the `::before` opacity transitions to 1).

**Note on the REAL observable.** `getComputedStyle(el, '::before').opacity` is the REAL
observable — not `el.style.setProperty('--mouse-x', …)` (which is setting state, not
measuring the effect). The proxy to avoid: grepping that `opacity: 0` appears in source
as the initial specular state (it always does — that is the INITIAL, not the hover, state).

---

### S4 — The BC-gated baseline lock (the POST-BC reference)

**After the BC consume (M.W8 Phase-2 green, glass-ui BC published and consumed)**, the gate
establishes its definitive baseline:

1. Run `npm run gh-pages` on the BC-consumed tree → `dist/gh-pages`.
2. Run `node scripts/proof-design-paint.mjs` → all checks must pass → exit 0.
3. The passing run is the **design-truth baseline** for the M-era demo — recorded in
   `M/FINAL.md §visual-truth` with the CI run hash and the per-scene check values.

**The BC-gated rationale (not a workaround).** The BC consume changes the dock design
(RF-17 cure), the aria attributes (SegmentedTabs), and possibly the glass-card specular
cohort. Running the gate BEFORE the BC consume produces a baseline that would immediately
red on the BC consume — not because the demo broke, but because the reference changed.
The CORRECT gate posture is: the baseline is locked AFTER the final-state consume. This
is not a deferral — the gate script is authored gate-first (S1), the born-RED state is
established today (S1), and the BC consume is what GREENs it to its baseline form (S4).

---

### S5 — The N Stage visual gate integration (conditional on N.WZ close)

If the N Stage scene-switcher is unshelfed (the DM-21 HANDOFF fires — glass-ui BC ships
the dock redesign), the `proof:design-paint` gate gains a Stage-specific row:

- **Stage open**: the overlay renders (the `.stage-void` scrim is painted — sampled pixel
  in the centre of the stage background is in the dark gamut `hsl(0 0% ≤ 8%)`).
- **Front card lit**: `--stage-light` computed value > 0.8 on the front card's ancestor
  (the spotlight cone is illuminating it).
- **Ring item visible**: at least 5 ring items have `opacity > 0` and non-zero `transform`
  matrix (the ring is rendered).

This S5 clause is **conditional** — it is authored ONLY if the Stage is integrated into
the final M/N demo tree. If the Stage remains shelved at M.WZ, S5 is deferred to the
unshelf wave.

---

## Born-RED gate

**Gate name:** `proof:design-paint` (NEW — `scripts/proof-design-paint.mjs`; does NOT exist
today). **Tier:** correctness (a browser gate — opens a headless browser over the built
dist; `GATE TIER: correctness` per `proof:gate-is-runtime` discipline).

**The REAL observable (inv-M-observable-truth — NOT a proxy).**

| Clause | Failure mode today (the REAL observable) | Why this is NOT a proxy |
|---|---|---|
| S2 animation live | a scene's animated element has a zero-delta `transform` between frames | NOT a CSS property grep — the property exists in source even on a frozen animation; the gate reads ACTUAL computed values in the REAL browser |
| S3 glass specular | the specular `::before` has `opacity: 0` after hover (the specular never activates) | NOT a source grep for `--mouse-x` — the variable can be set while the specular effect fails due to a stacking-context or `will-change` isolation leak |
| S2 colour sample | a scene's landmark pixel is blank white or transparent-black (a dropped backdrop-filter or z-index burial) | NOT an emitted-CSS check — the property can be emitted correctly and still produce no visual effect due to browser context |
| PRM check | an animated element's `transform` matrix changes between two rAF frames under `prefers-reduced-motion: reduce` (the rAF loop did not stop) | NOT `getAnimations()` — kf animations are rAF-driven via `RAFPlayback`, NOT the Web Animations API; `getAnimations()` is ALWAYS empty for kf animations and is a proxy that never bites. The real check is a zero-delta `transform` between frames. |

**Born-RED today (by construction).** `scripts/proof-design-paint.mjs` does not exist.
`node scripts/proof-design-paint.mjs` → file-not-found / exit 1. This is the genuine
born-RED state: the visual-truth oracle is absent, so all visual claims are unvalidated.

**Green condition (in order):**
1. The gate script is authored (S1). On the first authoring run, each per-scene check may
   produce RED findings (existing demo issues) — each RED finding is a genuine visual defect
   that must be cured in the same wave or delegated to a specific M wave with a born-RED
   gate extension.
2. On the BC-consumed demo (S4), all checks pass → exit 0. This is the baseline lock.
3. The gate is added to `proof:correctness` membership (it is a browser gate — the
   `proof:gate-is-runtime` discipline requires correctness-tier for all browser gates).
   `proof:ci-coverage` must resolve the gate in its reachability set.

---

## Dependencies

- **glass-ui BC publish (Phase-2, IMPL gate)** — the IMPL phase of this wave is gated on
  M.W8 Phase-2 (the BC consume). The GATE AUTHORING (S1 born-RED) is kf-internal and fires
  NOW. The BASELINE LOCK (S4) fires post-BC.
- **`dist/gh-pages` build** — the gate serves the built dist, not Vite-transformed source.
  `npm run gh-pages` must precede the gate run (the existing `proof:all` discipline).
- **`demo-driver.mjs` + `withPage` + `navToScene`** — the existing runtime-gate substrate;
  no new browser infrastructure is required.
- **No vitest-browser dependency** — the gate uses the existing headless Playwright
  `demo-driver.mjs` setup. After the M.W3 migration, the gate migrates to a
  `*.browser.test.ts` form (the inv-M-one-runner discipline); the observables are identical.
- **Independent of Band A/B/C/D/E waves** — the visual-truth gate observes the RENDERED
  output, orthogonal to the compile/ingest/correctness repairs (M.W5–W7) and the gate-
  apparatus transposition (M.W1–W4). It complements them (the source-correctness gates +
  the visual-truth gate = the full surface).

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|---|---|
| S2 animation live | A CSS animation, WAAPI delegate, or rAF loop silently stops (zero-delta transform between frames) — the scene appears frozen; the replay-equality / ingest gates are blind to this (they test the emitted CSS, not the rendered motion) |
| S3 glass specular | A stacking-context collapse (e.g. a `will-change: transform` on a glass-card ancestor) kills the backdrop-filter + the specular `::before` shimmer — the scene loses its glass identity; a CSS grep shows the properties are there |
| S2 colour sample | A z-index burial or a dropped Teleport target renders a scene as a blank white or transparent rectangle — the demo is visually broken but all correctness + source gates are green |
| PRM check | A CSS animation escapes the `@media (prefers-reduced-motion: reduce)` bracket — the demo spins and blinks under the OS accessibility setting, a direct a11y failure |
| S5 Stage | The Stage overlay renders incorrectly (wrong backdrop, missing spotlight, unlighted front card) after the N unshelf — the Stage's visual promise is unverifiable without a pixel-readback oracle |

---

## Excluded from this wave

- **Pixel-perfect diff against a reference screenshot** — a strict diff would red on every
  minor font-render or sub-pixel difference across OS/browser, producing the CI
  device-dependence failure the K epic cured. The gate uses SEMANTIC checks (colour gamut,
  delta-frame presence, opacity threshold) rather than pixel-diff. Strict screenshot diff
  is OUT (the inv-L-device-honesty lesson applied to visual gates).
- **Performance budget measurement** — that is M.W15 (lighthouse + critical CSS +
  content-visibility). This gate is visual-truth only (paint correctness), not perf.
- **Accessibility automated scan** — the a11y gates (`proof:font-census`, the aria-live
  checks in N.W7) are orthogonal. This gate reads pixels and computed-styles; ARIA
  attributes are not pixel signals. A11y automated scan is a separate concern.
- **The N Stage visual gate** (S5) — conditional on the Stage being unshelfed (DM-21
  HANDOFF fires). If shelved at M.WZ, S5 is authored in the N unshelf wave.
