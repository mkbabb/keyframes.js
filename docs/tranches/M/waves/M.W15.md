# M.W15 — Demo-perf: lighthouse per scene, critical CSS, content-visibility, bundle gate

- **Band:** S1/S2 are BC-gated (new band — the demo-perf band; fires after M.W8 Phase-2 +
  the BC glass-ui consume + `dist/gh-pages` build on the final-state tree). **S3 is
  pre-BC** (gates the published dist, independent of demo state — can green before BC).
  **Class:** DEV (docs); IMPL opens on authorization AND (for S1/S2) on the BC-consume
  firing; S3 opens immediately (no BC dependency). **Dep:** **glass-ui BC for S1/S2**
  (the demo must be in its final-consume state — aria/RF-17 + dock redesign — before perf
  baselines are locked; gating a pre-BC demo would produce stale floors). Born-RED TODAY:
  `proof:lighthouse-mobile` posture is `observe-only` (never reds in CI); no
  `proof:consume-bundle` exists; no `content-visibility` gate exists.
- **Gate (multi-part):**
  - `proof:lighthouse-mobile` — ALREADY EXISTS at `scripts/proof-lighthouse-mobile.mjs`
    with per-scene floors and CI wiring. **S1 flips its posture from `observe-only` to
    hard-gate** (promoting the `KF_REQUIRE_LH=1` path to the CI default). No new script.
  - `proof:consume-bundle` — born-RED: does not exist; the consume-side tree-shaking gap
    (the "atlas finding" from `M-RECONCILIATION.md §9`). **NOT BC-gated (pre-BC).**
  - `proof:content-visibility-gated` — born-RED: the N-stage previews' `content-visibility:
    auto` loop-gating is unverified on the library side (the general pattern for expensive
    off-screen lazy work). BC-gated (Stage must be unshelfed or demo must have cv:auto usage).
- **Folds:** `M-RECONCILIATION.md §9` (the consume-side bundle gate spec, renumbered DM-25);
  `M.md §wave map M.W12` (the demo-perf wave is split out of M.W12 here); CONSTELLATION-CAMPAIGN
  §4 ("split out demo-perf as a new wave"); `DM-8` (the `proof:lighthouse-mobile` VERIFY-ONLY
  row — S1 promotes it from `observe-only` to hard-gate via a posture flip, not a new script);
  `audit/lane-29-perf-numbers.md` (the gap bench audit).
- **Precept cure:** the **un-measured performance claims** (`M.md §frontier 4`, the
  L.W7-era doc error) + the **consume-side bundle gate gap** (the "atlas finding") +
  the **CI non-gated lighthouse** (DM-8 is VERIFY-ONLY — a human-driven measurement on
  a quiet host, not a CI-wired oracle).

---

## Context

M.W12 (performance closure, honest measurement) addresses the kf-internal bench gaps
(the `sync-step.bench.ts` wiring, the `postTask` INP measurement, the color-interp
co-bench dispatched to value.js O). M.W15 is the **demo-facing perf band** — the three
perf dimensions the existing apparatus has no gate for:

1. **Lighthouse per-scene** — `proof:lighthouse-mobile` (`scripts/proof-lighthouse-mobile.mjs`)
   ALREADY EXISTS and is CI-wired with per-scene `SCENE_CEILINGS` floors. However it
   uses `declarePosture("observe-only", …)`: in CI without `KF_REQUIRE_LH=1`, ceiling
   misses are RECORDED-WITHHELD, not failures. The `inv-L-device-honesty` concern was
   well-founded for K-era CI (absolute-ms thresholds on the slow Linux runner). But a
   lighthouse PERFORMANCE SCORE is a normalized ratio, not absolute milliseconds — the
   calibration (CPU-4×, Fast-3G throttle) absorbs hardware variability (within ±5 points).
   M.W15 S1 **flips the posture to hard-gate** (post-BC, after `SCENE_CEILINGS` is updated
   to the BC-consumed actuals). No new script is authored.

2. **Content-visibility gating** — the demo's Stage previews and off-screen scene content
   use `content-visibility: auto` for lazy-render. The gate asserts that off-screen
   elements with `content-visibility: auto` are NOT running rAF loops (the
   `contentvisibilityautostatechange` skipped observable). No gate currently checks this.

3. **Consume-side bundle gate** — a DOWNSTREAM CONSUMER of `@mkbabb/keyframes.js` who
   eagerly imports the LIGHT surface (e.g. `import { SpringProgress } from
   "@mkbabb/keyframes.js"`) must not pull the heavy engine or value.js into their bundle.
   `proof:boundary` gates the LIBRARY barrel from SOURCE; it does NOT gate the PUBLISHED
   dist as consumed by a downstream bundler. The atlas finding (M-RECONCILIATION §9) names
   this gap.

### The BC-gate rationale

The BC consume changes the demo's visual + interactive surface (dock redesign, aria
corrections). Lighthouse scores and INP values are sensitive to the presence of interactive
elements — a BC-modified dock changes the CLS, LCP, and INP profiles. Locking performance
floors on a pre-BC demo would produce floors that immediately break on the BC consume,
which is NOT a genuine regression — it is a baseline mismatch. The correct posture:
establish floors post-BC.

The consume-side bundle gate (S3) is NOT BC-gated — it gates the published DIST, which is
independent of the demo state. S3 can be authored and greened pre-BC.

---

## Scope

### S1 — `proof:lighthouse-mobile` posture flip (observe-only → hard-gate, BC-gated)

**The script already exists.** `scripts/proof-lighthouse-mobile.mjs` is CI-wired with
per-scene floors (`SCENE_CEILINGS`) and the `observe-only` posture via `declarePosture`.
S1 does NOT author a new script — it **flips the declared posture** from `observe-only`
to a hard CI gate.

**Current state (the born-RED condition).** The existing gate uses `declarePosture("observe-only", …)`:
- In CI (without `KF_REQUIRE_LH=1`): ceiling misses are RECORDED-WITHHELD, not failures.
- Locally: ceiling misses are hard (exit 1).
The gate never reds in CI on a ceiling miss — it is VERIFY-ONLY in CI despite being
CI-wired. This is the D8 / `DM-8` VERIFY-ONLY posture.

**The device-honesty resolution.** The `inv-L-device-honesty` lesson was: absolute
millisecond thresholds are device-dependent. Lighthouse PERFORMANCE SCORES are NOT
absolute milliseconds — they are normalized ratios on the 0–100 scale, calibrated against
the throttled Moto G Power emulation. The calibration absorbs hardware variability (within
±5 points). The per-scene floors (the `SCENE_CEILINGS` constant already in the script) are
the historically-measured values; they are normalized ratios, not wall-clock times.

**Cure (BC-gated posture flip — no new script).** After the BC consume (M.W8 Phase-2
green), the demo is in its final state. The impl action for S1:
1. Confirm the BC-consumed demo passes its existing `SCENE_CEILINGS` on the CI runner
   (run with `KF_REQUIRE_LH=1` to hard-assert on a calibrated runner).
2. Update `SCENE_CEILINGS` in `scripts/proof-lighthouse-mobile.mjs` if the BC consume
   changed any scene's profile (the BC dock redesign may change CLS/LCP).
3. Change `declarePosture("observe-only", …)` to `declarePosture("hard", …)` (or
   remove the posture wrapper entirely and always hard-assert). This makes CI red on a
   ceiling miss — the promoted posture.
4. Confirm `KF_REQUIRE_LH=1` is set in CI's lighthouse step (or remove the env-var gate
   since the posture is now always hard).

**Born-RED (TODAY, the posture breach).** The gate exists but its posture is `observe-only`
in CI — it cannot red in CI on a ceiling miss. The born-RED state is the posture mismatch:
the gate IS authored + CI-wired, but its verdict is WITHHELD in CI. The posture flip (step 3
above) is the cure.

**Gate tier.** `GATE TIER: correctness` (browser gate — already so; no change needed).

**Falsifiable check.** Before the flip: `KF_REQUIRE_LH=1 node scripts/proof-lighthouse-mobile.mjs`
is the hard form (already works). After the flip: the CI runner reds on a ceiling miss
WITHOUT needing `KF_REQUIRE_LH=1`. The posture constant in the script is the one-line diff.

**The existing floors (in `SCENE_CEILINGS` — already verified against the source):**

| Scene | Current CI gate ceiling (SCENE_CEILINGS in script) |
|---|---|
| home | 63 |
| cube | 64 |
| amiga | 49 |
| square | 62 |
| easing | 61 |
| spring | 52 |

Note: the script gates only the 6 scenes in `SCENE_CEILINGS` — `sequence` and `motion-path`
are NOT in the current ceiling map (`if (ceiling == null) continue`). If these scenes need
a floor, add them at impl time after measuring the BC-consumed actuals.

**Note on the BC-consume floor update.** After the BC consume (M.W8 Phase-2), re-run the
lighthouse gate on the BC-consumed demo and update `SCENE_CEILINGS` to the post-BC actuals
before flipping the posture. The BC dock redesign may change CLS/LCP profiles. The floor
update is a one-commit ceiling bump (not a gate weakening — the bump records the new
correct baseline).

---

### S2 — `proof:content-visibility-gated` (the off-screen loop-pause gate)

**Breach.** The demo's Stage previews (7 bespoke idle loops in `demo/@/components/custom/
scene-stage/previews/`) use `content-visibility: auto` + `contentvisibilityautostatechange`
to pause off-screen loops. No gate asserts this mechanism actually fires. The risk: if
`content-visibility: auto` is declared but the `contentvisibilityautostatechange` event
listener is missing or mis-wired, all 7 loops run simultaneously — the ⚠N5 violation
(7 concurrent rAF loops × heavy preview content = frame budget death).

**The REAL observable.** The genuine defect is NOT "the element has `content-visibility:
auto` in its CSS" (that is a source grep — a proxy). The genuine defect is "an element that
`content-visibility: auto` has marked as `skipped` is still ticking its rAF loop." The
gate must actuate the REAL skip: navigate to the Stage, advance the ring so a rear card is
fully off-screen, assert that the `RAFPlayback` instance for that card's preview is paused.

**Cure (gate structure).**
`scripts/proof-content-visibility-gated.mjs`:
- Opens the Stage (if unshelfed) or a representative page with `content-visibility: auto`
  off-screen elements.
- For a known off-screen element (the rear ring card at index 3 when card 0 is in front),
  reads `getComputedStyle(el).contentVisibility` → asserts `"auto"` (the CSS is applied).
- Fires a `contentvisibilityautostatechange` event probe. **The correct event interface:**
  `ContentVisibilityAutoStateChangeEvent extends Event` (NOT `CustomEvent`) and exposes
  `.skipped` as a **top-level property** (NOT `.detail.skipped`). Confirmed from the
  TypeScript DOM lib (`interface ContentVisibilityAutoStateChangeEvent extends Event {
  readonly skipped: boolean; }`) and the real consumer in
  `demo/@/components/custom/scene-stage/composables/useLivePreviewLOD.ts:259`
  (`(e as Event & { skipped?: boolean }).skipped`). The dispatch is:
  ```js
  // CORRECT: top-level skipped property, not detail.skipped
  const ev = new Event('contentvisibilityautostatechange');
  Object.defineProperty(ev, 'skipped', { value: true });
  el.dispatchEvent(ev);
  ```
  This actuates the listener WITHOUT requiring the element to actually be off-screen
  in the headless viewport (which depends on viewport sizing).
- Asserts that the `RAFPlayback` for that card is paused (the loop's `running` property
  is `false` after the event fires — `RAFPlayback.running` is the real observable, per
  `src/animation/playback.ts: get running(): boolean { return this._rafId !== null; }`).
- **The REAL observable:** the loop-pause behavior IS triggered by the event. If the
  listener is absent or mis-wired, `running` stays `true` after the dispatch → exit 1.

**Note on the conditional (N unshelfed).** If the Stage is shelved at M.WZ (DM-21
HANDOFF unfired), this gate targets the general `content-visibility: auto` usage in the
demo (if any) rather than Stage-specific previews. If there is NO `content-visibility:
auto` usage in the BC-consumed M-era demo outside the Stage, this gate is deferred to the
N unshelf wave (authored in N.W4 per the N wave spec). The gate author checks at impl
time; if the demo has no `content-visibility: auto` usage, this gate is recorded as
DEFERRED in `M/FINAL.md §deferred` and the N.W4 gate becomes the closure oracle.

**Gate tier.** `GATE TIER: correctness` (browser gate).

---

### S3 — `proof:consume-bundle` (the consume-side tree-shaking gate — NOT BC-gated)

**Breach (the atlas finding — M-RECONCILIATION §9).** `proof:boundary` gates that the
library BARREL (`src/animation/index.ts`) has no static value.js/engine edges from its
LIGHT exports. It does NOT gate a DOWNSTREAM CONSUMER: a project that installs
`@mkbabb/keyframes.js` and does `import { SpringProgress } from "@mkbabb/keyframes.js"`
in its OWN bundler sees the PUBLISHED `dist/keyframes.js`, not the source barrel. The
`exports` map, `sideEffects: false` field, and `treeshake` hints in the PUBLISHED dist
determine whether the consumer pulls in the heavy engine. If these are wrong, a consumer
gets value.js / engine.ts in their bundle despite importing only the LIGHT surface.

**The REAL observable.** NOT a source grep for `"sideEffects": false` in `package.json`
(a proxy — the field can be wrong or misapplied). The genuine defect: a consumer bundle
that includes `value.js` or `engine.ts` modules when only `SpringProgress` was imported.
The gate BUNDLES a tiny consumer from the PUBLISHED DIST and reads the output.

**Cure (gate-first — born-RED by construction on first authoring).**
`scripts/proof-consume-bundle.mjs`:
- Writes a tmp consumer entry: `import { SpringProgress } from "dist/keyframes.js"; export default SpringProgress;`
  (uses the DIST, not `src/animation/index.ts`).
- Bundles it with rolldown (the existing bundle infrastructure — same as `proof:boundary`)
  with `external: ["vue", "prettier"]`, `treeshake: true`, value.js and parse-that
  NOT external.
- Reads the output chunk's module set; asserts:
  - Zero modules from `node_modules/@mkbabb/value.js/` in the static graph.
  - Zero modules matching `/animation\/engine\.ts$/` in the static graph.
- **Born-RED by construction on first authoring** (the gate does not exist today; after
  authoring, the first run may find the dist's treeshake is correct → exits 0, OR may find
  a heavy edge → exits 1 on a real defect).

**The distinction from `proof:boundary`.** `proof:boundary` bundles from SOURCE to prove
the library's module graph is correct. `proof:consume-bundle` bundles from DIST (as a
real consumer would) to prove the PUBLISHED ARTIFACT'S treeshake behavior is correct.
Both gates are needed: a source-correct barrel can produce a dist with wrong `sideEffects`
metadata that pulls heavy chunks into consumers.

**Gate tier.** `GATE TIER: hygiene` (a node gate — no browser, rolldown only, fast).

**NOT BC-gated.** The DIST is independent of the demo state. S3 can be authored and
greened pre-BC, and is added to the `proof:hygiene` roster immediately.

**Falsifiable check.** After authoring: a planted `import "@mkbabb/value.js"` in any
LIGHT module (e.g. `smooth.ts`) → rebundled dist → `proof:consume-bundle` exits 1 (the
planted edge makes value.js appear in the consumer bundle). Removing the plant → exits 0.

---

### S4 — BC.W-LIGHTHOUSE coordination record (the sibling-gate reference)

The CONSTELLATION-CAMPAIGN §4 names `BC.W-LIGHTHOUSE` as a sibling wave in the glass-ui
BC tranche. This records the coordination:

- **What glass-ui BC's lighthouse wave does:** runs lighthouse on its OWN demo (the
  glass-ui component explorer / storybook equivalent) for its BC-era components. It is
  NOT the kf demo lighthouse.
- **The kf coordination point:** when glass-ui BC's lighthouse wave locks its component
  perf floors, the kf M.W15 gate re-runs against the BC-consumed kf demo to confirm
  the BC consume did not regress kf's scene perf floors (the dock redesign + aria
  corrections should not substantially change LCP/INP on the kf demo scenes).
- **No kf gate dependency.** `proof:demo-perf-lighthouse` is a kf-owned gate; it does
  not import or depend on BC.W-LIGHTHOUSE output. The coordination is a temporal
  handshake: run S1 AFTER the BC consume to establish the post-BC floor update.

This S4 clause is a **record**, not a gate. No new kf script is authored here; the
coordination is captured in `M/PROGRESS.md §"Open deferrals" §D` (add `DM-23 BC.W-
LIGHTHOUSE coordination`) per the `M-RECONCILIATION.md §6 event 3` mandate.

---

## Born-RED gate

**Gates:** `proof:lighthouse-mobile` (EXISTS — born-RED by posture: `observe-only` in CI,
must flip to hard-gate; BC-gated floor update), `proof:content-visibility-gated` (NEW —
born-RED by absence; conditional on Stage unshelf; BC-gated), `proof:consume-bundle` (NEW —
born-RED by absence, **NOT BC-gated** — gates the published dist, pre-BC).

**The REAL observable per gate (inv-M-observable-truth — NOT a proxy):**

| Gate | Witness on today's tree | Failure mode (REAL observable) | Proxy to avoid |
|---|---|---|---|
| S1 `proof:lighthouse-mobile` | script EXISTS but posture is `observe-only` → never reds in CI on a ceiling miss (the born-RED posture breach); after the flip, a scene below the ceiling reds in CI | a scene's rendered LCP/INP is genuinely slow — the browser is slow, not a lint error | grepping for bundle-size, grepping for `content-visibility` in source, checking script count in HTML |
| S2 `proof:content-visibility-gated` | script absent → exit 1 by construction; after authoring, an off-screen loop's `RAFPlayback.running` stays `true` after the event fires | the `contentvisibilityautostatechange` listener is absent or mis-wired — the loop ticks when the browser marks the element skipped (`.skipped` is a top-level Event property, NOT `detail.skipped`) | grepping for `content-visibility: auto` in CSS source (present ≠ the event listener is wired); using `getAnimations()` (kf uses RAFPlayback, not WAAPI) |
| S3 `proof:consume-bundle` | script absent → exit 1 by construction; after authoring, a consumer bundle containing value.js | the PUBLISHED DIST's `sideEffects` / `exports` metadata is wrong — a consumer gets the heavy engine despite importing only a LIGHT symbol | `"sideEffects": false` in `package.json` (the metadata can be correct while the exports map has a wrong entry that still pulls in a heavy chunk) |

**Born-RED kf-side TODAY:**

- `proof:lighthouse-mobile`: EXISTS — born-RED by **posture** (the `observe-only` posture
  means it never reds in CI on a ceiling miss, which is a posture breach for a perf gate;
  exit 1 is NOT the current CI behavior — the posture flip is the cure). On a calibrated
  runner with `KF_REQUIRE_LH=1`, may exit 0 (if existing ceilings hold) or 1 (if a scene
  regressed). The posture flip makes CI exit 1 on a miss without needing the env var.
- `proof:content-visibility-gated`: ABSENT — exit 1 by construction (file not found).
  Conditional; exits 0 if no `content-visibility: auto` usage exists in the M-era demo
  (deferred to N.W4 in that case).
- `proof:consume-bundle`: ABSENT — exit 1 by construction (file not found). After
  authoring: exits 0 if the dist treeshake is correct (confirms boundary is consumer-safe);
  exits 1 on a genuine heavy-chunk leak. **Pre-BC; authors now.**

**Green condition.**

- S1: the `proof:lighthouse-mobile` posture is flipped to hard-gate; `SCENE_CEILINGS` is
  updated to the BC-consumed actuals; the CI runner no longer needs `KF_REQUIRE_LH=1` to
  hard-assert ceiling misses. All scenes score above their ceilings on the BC-consumed
  `dist/gh-pages` build. Gate is already in `proof:correctness` (browser gate; no change).
- S2: the loop-pause event fires correctly (`.skipped` top-level property, `ContentVisibilityAutoStateChangeEvent extends Event`) OR deferred to N.W4 (Stage shelved). Added
  to `proof:correctness` if the Stage is unshelfed; deferred if shelved.
- S3: a consumer bundle of each LIGHT export from `dist/keyframes.js` contains zero
  value.js / engine.ts modules. Added to `proof:hygiene` (node gate, fast). **Greens pre-BC.**

---

## Dependencies

- **glass-ui BC publish — for S1 posture flip and S2 Stage-gate (if unshelfed).** S3 is
  independent (gates the DIST, not the demo; greens pre-BC). S1's POSTURE FLIP fires
  post-BC (the `SCENE_CEILINGS` update requires the BC-consumed demo as the new baseline;
  flipping to hard-gate on a pre-BC baseline would false-red on the dock redesign change).
- **`proof:boundary` (M.W9-authored W96 parse-that-scan)** — S3's consume-side gate is
  the COMPLEMENT of `proof:boundary`. Both must be in the `proof:hygiene` roster. They
  do not conflict (different entry points: source vs. dist).
- **`dist/keyframes.js` current published dist** — S3 gates the dist on disk
  (`npm run build` output); it does NOT require `dist/gh-pages` (that is S1's dependency).
  S3 runs on every `npm run build`, not only on the gh-pages build.
- **lighthouse npm package** — if not in devDependencies, S1 adds it at gate authoring.
  Confirm: `grep '"lighthouse"' package.json`. This is the only potential new devDep.
- **Independent of Band A/B/C/D/E waves** — M.W15 is orthogonal to the correctness/
  apparatus/consume waves. It gates the DEMO PERFORMANCE and the CONSUME SURFACE, both
  orthogonal to the animation engine correctness (M.W5–W7) and the constellation consume
  (M.W8–W11).

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|---|---|
| S1 lighthouse mobile posture flip | A demo scene's LCP/INP/CLS regresses below the ceiling — a genuine user-facing perf degradation. The current `observe-only` posture in `proof:lighthouse-mobile` misses regressions in CI (it records but never reds); the posture flip makes CI red on a real perf regression, catching it on every PR. The DM-8 VERIFY-ONLY mechanism is RETIRED by this flip. |
| S2 content-visibility | An off-screen ring card's rAF loop runs when `content-visibility: auto` marks it as skipped — 7 concurrent rAF loops at 60fps × 7 preview costs = frame budget death (the ⚠N5 violation from N.md). Without the gate, the optimization exists in source but its effect is unverified. |
| S3 consume-bundle | A LIGHT module regains a static value.js edge (e.g. a `import { parseColor }` for a new colour interpolation shortcut) and the dist treeshake is wrong — a downstream consumer of `@mkbabb/keyframes.js` gets 145 KB of value.js bundled when they only wanted `SpringProgress`. `proof:boundary` would catch this from SOURCE, but the DIST gate catches the case where a wrong `exports` map or missing `sideEffects` annotation lets the edge survive into the dist. |
| S4 BC.W-LIGHTHOUSE coord | The BC dock redesign changes the kf demo's LCP/INP profile without updating the perf floors — the gate silently reds on a legitimate BC-consume change that is NOT a kf regression. The coordination record ensures the floors are updated post-BC, not inherited stale from K. |

---

## Excluded from this wave

- **The kf library bench gaps** (the `sync-step.bench.ts` wiring, the `postTask` INP
  measurement, the value.js color-math co-bench) — that is **M.W12** (performance closure,
  honest measurement). M.W15 is DEMO-FACING perf (what the user sees in the browser);
  M.W12 is ENGINE-FACING perf (what the bench harness measures).
- **Core Web Vitals on production (`keyframes.babb.dev`)** — the CWV on the live site is
  a USER-DOMAIN measurement (Mike Babb, run in production post-deploy). M.W15's gate runs
  on `localhost:PORT` with `dist/gh-pages` served locally — a CI-viable proxy. The
  production CWV cannot be CI-gated (the deploy must have completed first).
- **Content Security Policy or network protocol perf** (HTTP/2 preload, font preconnect,
  image format optimization) — these are ops/infra concerns, not kf demo-development
  concerns. They affect the production CWV but are outside inv-16 (the demo writes only
  this repo, not the CF Pages infra).
- **A11y automated scan** (axe, Pa11y) — the a11y gates are M.W-DESIGN-PAINT's complement
  and N.W7's province. M.W15 is perf-only.
- **The strict pixel-diff screenshot CI gate** — ruled out in M.W-DESIGN-PAINT by the
  inv-L-device-honesty lesson. M.W15 uses lighthouse scores (normalized, device-agnostic)
  not screenshot diffs.
