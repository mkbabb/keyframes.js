# Tranche K Audit — J.W6 Plan-vs-Delivery

**Lane:** wave-J.W6.md (plan-vs-delivery audit of J.W6 terminations)
**Auditor:** K audit fleet
**Date:** 2026-06-11
**Base:** `tranche-j-dev` HEAD `4f1fc4c` (master @ 4.2.0 published)
**W6 land commit:** `40fc605` (2026-06-10); merge to dev: `c0ac4d9`
**P0 fix commit:** `a2c3a5b` (2026-06-11, post-W6-land)
**Sources:** `docs/tranches/J/waves/J.W6.md` (spec) · `docs/tranches/J/waves/J.W6-impl.md` (impl
record, includes the P0 record appended at close) · live tree inspection + test re-runs

---

## §1 — Rider-exit verification (every clause, plan vs delivery)

### S1 — FB-2: async sync-step half — LAND

**Spec required:** author `proof:event-ordering` + extend `bench/sync-step.bench.ts`; LAND iff
≥20% microtask-turn reduction on K=8/32-cell window AND `proof:event-ordering` GREEN.

**What shipped (`40fc605`):**
- `src/animation/engine.ts` — `advanceTo` async→sync (`number | Promise<number>`); private `_advance(t)`
  extracted; `_frame(t)` split into `_advance` (playhead/clock) + `_renderFrame(t)` (the
  `interpFrames(t, true, …)` subject-write half). `engine.ts:855-925`.
- `src/animation/group.ts` — `advanceTo(t): this | Promise<this>`; `_advanceSlice` returns `undefined`
  iff all-sync (no per-frame `Promise.all`); `_advanceBatched` preserved for the over-batch yield path.
- `test/event-ordering.test.ts` — 5-clause gate (wired `proof:event-ordering`). **Re-run 2026-06-11:
  5/5 PASS.**
- `test/sync-step.test.ts` — clause 3 added (Animation + AnimationGroup pump 20/20 frames with ZERO
  awaited microtasks). **Re-run 2026-06-11: 5/5 PASS.**
- `bench/sync-step.bench.ts` — the FB-2 symmetric arm (K=8 Animation + 32-cell AnimationGroup,
  600-frame window). **7 FB-2-related hits confirmed present (`grep "FB-2\|600-frame\|K=8"`).**

**Measurement artifact present and inline in impl record:** YES — §S1 of `J.W6-impl.md` carries the
verbatim `/tmp/w6-fb2.txt` output: microtask turns/frame 1.998→0 (Animation·K=8) and 4.993→0
(Group·32cells) = −100%; promise inits/frame 10.01→0.012 and 84.1→0.008; single-shot wall 51.73→39.88
µs/frame (−22.9%). Threshold leg (a) met (100% > 20%); threshold leg (b) met (ordering lock GREEN on
both arms; born-RED ×2 witnessed before conversion). Decision = **LAND**.

**Plan-vs-delivery gap:** NONE for the rider exit itself. The born-RED witnesses are present (WITNESS 1:
clause 3 reds on dispatch-before-paint reorder; WITNESS 2: clause 2 reds on boundary-event swap).
The correctness oracle (`proof:event-ordering`) is device-independent and wired in CI
(`package.json:65`). LAND decision is backed by the measured number, not an estimate.

**Residual seam created:** The `_frame`→`_advance`+`_renderFrame` split is the NEW structural fact;
see §3 below.

---

### S2 — SoA `lerpArray` — ADOPT (IMPL deferred)

**Spec required:** extend `bench/interp-buffer.bench.ts` with a `Float64Array`+`lerpArray` SoA arm;
ADOPT iff ≥20% wall-time reduction at K=8. Per spec: J.W6's deliverable is the bench artifact + the
ADOPT decision; the FrameCompiler-side transposition is a "separate authorized motion."

**What shipped:**
- `bench/interp-buffer.bench.ts` — 6-case SoA arm (K=8/K=10 full-pipeline pairs + K=8 dispatch-only
  pair). **25 `lerpArray`/`SoA`/`Float64` hits confirmed present.**
- `test/lerparray-adopt.test.ts` — 3-clause ADOPT guard: (a) API lock, (b) semantics lock, (c)
  equivalence witness (one `lerpArray` call reproduces `interpFrames` per-channel values on the K=8
  cube corpus at 9 playheads). **Re-run 2026-06-11: 3/3 PASS.**
- `src/animation/` — `grep -r lerpArray src/ = 0` (CORRECT by design; the FrameCompiler
  transposition is the separate motion).

**Measurement artifact present:** YES — verbatim bench output in `J.W6-impl.md §S2`: K=8
full-pipeline 0.0928 → 0.0056 ms = 16.6× = 94.0% reduction (threshold 20% cleared 4.7× over);
decision math inline. Decision = **ADOPT**.

**Plan-vs-delivery gap:** The ADOPT decision is recorded with the bench artifact per spec. The
FrameCompiler-side SoA transposition was explicitly deferred to "J.W1 or a dedicated authorized
motion" (`J.W6.md §S2`). J.W1 never implemented it (`grep lerpArray docs/tranches/J/waves/J.W1-impl.md
= 0`). The PROGRESS.md K ledger records the transposition as the "elected separate authorized motion"
(`PROGRESS.md:287`). This is correctly a **K-open item** — the bench guard (test/lerparray-adopt.test.ts
clause c) is the correctness oracle the elected motion lands behind, but the `src/` transposition is
outstanding. **P2 — the ADOPT-elected FrameCompiler SoA transposition has no home in K's planning
horizon yet (no K wave row as of the K-seed FINAL.md ledger).**

---

### S3 — FB-5 intrinsic-size — KILL

**Spec required:** live cross-engine Baseline check for `interpolate-size`/`calc-size()`; KILL if
Chromium-only.

**What shipped:** The probe table in `J.W6-impl.md §S3` (2026-06-10): Chrome 129 / Edge 129 available;
Firefox and Safari not available; MDN "Limited Availability." Registry snapshot at probe time:
`caniuse-lite 1.0.30001797`, `web-features 3.30.0`. Decision = **KILL (Chromium-only)**.

**Plan-vs-delivery gap:** NONE. `grep -r "interpolate-size\|calc-size" src/ = 0`. No kf code touched.
Kill record is reasoned from the live probe, not a remembered date. Row is terminal.

---

### S4 — FB-6 `Mod+K` palette — KILL (residue swept)

**Spec required:** owner decision; BUILD-or-KILL (DEFAULT = KILL); sweep `style.css:29` "command
palette" comment on KILL.

**What shipped:**
- Decision = **KILL** (the spec DEFAULT): deleted at E.W11, absent from J.W7a suffusion, no owner
  election across 4 tranches.
- `demo/@/styles/style.css:29` — **residue swept**. Current state reads `popovers (share)` (no
  "command palette"). Verified: `grep -n "command palette" demo/@/styles/style.css = 0 hits`.

**Plan-vs-delivery gap:** NONE. The kill is reasoned; the residue is gone.

---

### S5 — PF-1 Three.js named imports — KILL (estimate falsified)

**Spec required:** before/after `vendor-three` chunk delta; LAND iff real reduction, KILL iff zero.

**What shipped:** The measured delta is **exactly 0 bytes** — `vendor-three-B9C4oDST.js` 534141 bytes
both before and after (same content hash `B9C4oDST`). The 100–200 KB estimate was **falsified by
measurement**: rolldown already tree-shakes the namespace import fully. The refactor was reverted
(`grep -n "import \* as THREE"` hits all four consumers again). Decision = **KILL**.

**Plan-vs-delivery gap:** NONE. Both before and after artifacts are pasted verbatim in the impl
record. The Lighthouse-mobile corroborator was correctly declared moot (identical bytes = no perf
delta). Revert confirmed: `demo/amiga/utils.ts`, `useSphereSpin.ts`, `useAmigaAnimations.ts`,
`AmigaScene.vue` all still use namespace imports. The one "rider that may land product code" correctly
did NOT land (the gate correctly killed a churn-without-measured-reduction refactor).

---

### S6 — PF-3 Monaco static-edge — PASS

**Spec required:** fresh `KF_ANALYZE=1 npm run gh-pages` build + `proof:monaco-deferred` bundle half
over `dist/gh-pages/_chunks.json`; PASS = no static `vendor-monaco` edge.

**What shipped:** The probe output in `J.W6-impl.md §S6` (fresh build 2026-06-10 14:26):
```
✓ proof:monaco-deferred (bundle): 0 chunks statically import vendor-monaco-COAzEUjw.js
proof:modern-web — PASS
```
The no-build hard-fail witnessed working as designed (`dist/gh-pages not built` → exit 1, not skip).
The I-era win (28.5 s → <15 s spring-mobile LCP) is preserved.

**Plan-vs-delivery gap:** NONE. The build was produced and the static-edge probe ran. The `_chunks.json`
edge-list is the artifact.

---

### S7 — EF-3 `parseLinearStops` shim — KEEP-with-probe

**Spec required:** `npm view @mkbabb/value.js version` + `node -e typeof v.parseLinearStops` probe;
RETIRE iff E1 published, KEEP-with-probe otherwise.

**What shipped:** Probe output in `J.W6-impl.md §S7` (2026-06-10, value.js 0.11.2):
`typeof v.parseLinearStops → undefined`; `typeof v.getPointAtLength → undefined`;
`typeof v.lerpArray → function`. Decision = **KEEP-with-probe** (value.js E1 unpublished).

**Current state verified:** `grep -n "parseLinearStops" src/animation/utils.ts` shows definition at
`:106` and consumption at `:192` — shim is present, CORRECT by design.

**Plan-vs-delivery gap:** NONE. The probe output is the artifact; KEEP is evidenced, not asserted. The
HANDOFF (rides the next value.js re-pin) is correctly recorded as a sibling-gated CHRONIC-by-design
item in PROGRESS.md. Not a fifth defer: the probe is the terminal evidence.

---

### S8 — GH-6 / DEP-1 CNAME drift — STILL OPEN (verify-only, OUT)

**Spec required:** confirm with deploy owner; VERIFY-ONLY, OUT.

**What shipped:** `J.W6-impl.md §S8` records: `dns-cf-sync.sh:105` still reads the drifted target
(`keyframes.pages.dev`, not `keyframes-8uq.pages.dev`), still marked `# UNVERIFIED`. The fourier line
was fixed (`3c3fbd2`) but the keyframes line was not. Live site is correct today (CF proxied A records
serve HTTP/2 200) because the script has not been re-run. The hazard is that a blind re-run would
write the wrong CNAME. Confirmed stays OUT (deploy-owned P0).

**Plan-vs-delivery gap:** NONE for what J.W6 can deliver. **P1 — the hazard is still live** and
unaddressed in K planning. The deploy-side write is: `dns-cf-sync.sh:105` → `keyframes-8uq.pages.dev`.
K should explicitly carry this as a deploy-lane item (a confirmation that the fix has been applied or
a reminder to apply it before the next script run).

---

### S9 — CE-1.0 Safari `linear()`-HW-accel hazard — GUARD landed

**Spec required:** on-device WebKit probe; GUARD-or-DOCUMENT with the trace.

**What shipped:**
- `scripts/probe-webkit-linear-accel.mjs` — differential main-thread-occupancy probe (N=800
  concurrent WAAPI animations; 2 s saturating MessageChannel task-throughput measurement).
  Verbatim probe output in `J.W6-impl.md §S9`: webkit 26.4 `linearfn` = 24.0% of baseline vs
  `keyword` = 96.3% — a 72.3pp gap; Chromium 148 control shows only 3.1pp gap. Exclusion bites.
- `src/animation/waapi.ts:76-84` — `isWebKitEngine()` via `webkitConvertPointFromNodeToPage`
  feature-detect (NOT a UA sniff). `waapi.ts:188-191` — the guard: `linear(`-prefixed easing held on
  rAF when `isWebKitEngine()`. The feature-detect was chosen because Chromium AND jsdom both falsely
  advertise "AppleWebKit" in their UA strings — a UA-sniff would misfire in tests.
- `test/waapi-lifecycle.test.ts` clause `CE-1.0` — verifies the guard fires (eligible=false, reason
  matches `/CE-1\.0/` and `/linear\(\)/`), verifies `cubic-bezier()` twin still delegates under the
  WebKit marker, verifies jsdom (no WebKit marker) still delegates the single-segment spring.
  **Re-run 2026-06-11: 10/10 PASS.**
- Born-RED witness: guard disabled (`if (false && …)`) → the CE-1.0 clause REDs (1 failed | 9
  passed); mutation reverted → 10/10 GREEN.

**Plan-vs-delivery gap:** NONE. The guard is engine-feature-keyed, not version-keyed. Conservative-
correctness contract restored (delegation only ever trades a perf opportunity, never makes things
worse).

---

## §2 — The FB-2 P0 record: was the LAND honest?

### What the P0 says

The W6 S1 sync conversion split `Animation._frame` into `_advance(t)` (playhead/clock) and
`_renderFrame(t)` (the `interpFrames(t, true, …)` subject-write). The P0 record (`J.W6-impl.md §P0`,
commit `a2c3a5b`, 2026-06-11) states:

> "The conversion didn't ship it (the tree's `_renderFrame` is correct)"

and:

> "The P0 was the UN-GUARDED SEAM the S1 LAND created — the missing subject-write oracle the whole
> battery lacked."

### Was the tree actually broken?

**NO.** `git diff 40fc605 a2c3a5b -- src/animation/engine.ts` = empty. Engine.ts was not changed
between the W6 land (`c0ac4d9` merge, 2026-06-10) and the P0 fix (`a2c3a5b`, 2026-06-11). The seam
was created correctly: `_renderFrame` calls `interpFrames(t, true, this._interpOut)` (apply=true) at
`engine.ts:919`. The play regression class was possible but was never instantiated in the shipped code.

The P0 fix committed `scripts/proof-subject-animates.mjs` + CI wiring; it added a MISSING ORACLE, not
a code correction.

### What the tests missed — the mechanism

`proof:engine-no-throw-on-play` clause (c) and `proof:live-session` B1 both sample `{.cube, .graph,
.idle-hover}` computed transforms. Per the P0 record:

- `.idle-hover` = the cube's idle bob — a **separate** rAF `Animation` that moves independently
  of the group-play subject write. On-device: `.idle-hover` distinct ≈ 115.
- `.graph` = the standalone `changeGraphPerspectiveAnim.play()` tilt + the orbital container matrix
  — ALSO independent of the group-play write. `.graph` distinct ≈ 20–23.
- `.cube` = the inner 3D box, NEVER directly transformed (the animation write lands on `.graph`
  via `apply-transform-to-container`). `.cube` distinct = 1 (frozen by design).

So both gates passed ENTIRELY on the idle-bob and orbital motion, while the engine's play write
could be dead and both would stay GREEN. This is the "subject-write axis" blindspot the P0 record
names.

### The fix

`proof:subject-animates` drives the BUILT `dist/keyframes.js` library against a REAL DOM element in
a REAL browser, CLICKS a play button (a genuine user gesture), and asserts the element's computed
style traverses ≥3 distinct interpolated values across the play window. Three arms:

| Arm | Path | Clean-tree |
|-----|------|-----------|
| raf | `_renderFrame → interpFrames(apply=true)` | 36 distinct |
| waapi | compositor write + shadow loop | 38 distinct |
| group | `transformFramesGrouped` (cube/easing/spring shape) | 37 distinct |

Born-RED: flip `interpFrames(t, true, …)` to `false` → raf arm shows 2 distinct (FROZEN) while
`proof:engine-no-throw-on-play` clause (c) stays GREEN (101 distinct from idle/orbital/tilt).
Reverted after witness; engine.ts is unchanged from HEAD.

Wired into `proof:correctness` + `ci.yml` (KF_REQUIRE_BROWSER=1), beside
`proof:engine-no-throw-on-play`.

### Is the current state sound?

**YES, with one structural reservation.** The `_advance`+`_renderFrame` seam is now guarded by
`proof:subject-animates` (the ORACLE for the write half) and `proof:event-ordering` (the ORACLE for
the ordering half). The two oracles together cover the two halves of "the played animation does what
a human sees."

**Structural note (P2):** `proof:subject-animates` tests the LIBRARY directly (serves a standalone
probe HTML with `dist/keyframes.js` + a fake play button). It does NOT test the DEMO APP's play path.
The demo's cold path — a fresh page load at `/#/` with no localStorage, clicking the hero rainbow
play, watching it smoothly navigate to cube and animate — remains UNEXERCISED by any gate. See §3.

---

## §3 — The hero cold-path blindspot (the unexercised axis)

### The claim from the orchestrator's triage

The orchestrator names U-K2 and U-K3 as live user-facing defects: "hero rainbow-play → no smooth
immediate transition to cube animating; subjects freeze while the playhead/slider advances." It
suspects the J.W7c U4 conditional-select deletion "may have killed an auto-binding side-effect."

### What the gate battery actually exercises

Every gate in the battery seeds `isControlsPanelOpen = true` in localStorage via `addInitScript`
before navigating. Specifically:

- `proof:live-session` B1 (`scripts/proof-live-session.mjs:225-233, 387`) — calls `seedControlsOpen`
  which writes `{ isControlsPanelOpen: true }` to localStorage, then navigates to `/#/`, clicks
  the rainbow play, then MANUALLY switches via `location.hash = "#/cube"` (not the autoPlayNext
  navigate path), and samples `.cube/.graph/.idle-hover` (the idle-bob blindspot documented in §2).

No gate exercises the genuine cold path:
1. Fresh context with NO localStorage
2. Navigate to `/#/` — EditorStartScreen visible (controls panel NOT open)
3. Click hero rainbow play
4. Observe whether scene machine navigates to `/#/cube` AND the animation starts playing

### Why U4 is a plausible suspect but needs on-device verification

J.W7c U4 (`TransportDock.vue:39`) changed the animation Select to render only when
`animationNames.length > 1`. The Select widget previously rendered unconditionally; for single-
animation scenes (spring, sequence, motion-path) it now renders a static label instead. For multi-
animation scenes (cube, amiga, square) the Select still renders.

The `toggleAnimationGroup` function in `useAnimationGroupPlayback.ts:69-73` auto-sets
`storedControls.selectedAnimation = allNames[0]` if `selectedAnimation` is not set. This logic is
**unchanged** by U4. For the hero cold path (clicking rainbow play from home), the path is:

1. `toggleAnimationGroup()` → `onPlayStateChange(true)` emitted
2. `useSceneMachineApp.ts:161-163`: `autoPlayNext.value = true; getRunSceneSwitch()("cube")`
3. On CubeScene mount: `autoPlay` prop = true → `AnimationControlsGroup.vue:220-222`:
   `onMounted(() => { if (autoPlay && …) toggleAnimationGroup(); })`
4. Second `toggleAnimationGroup()` call on cube → auto-sets `selectedAnimation` if empty → plays

This path does NOT depend on the Select widget rendering; U4 is not the structural cause of the cold-
path failure (the auto-selection logic is in `toggleAnimationGroup`, not in the Select `@update`
handler). **However, the cold path is unexercised by any gate and the user-reported failure (U-K2,
U-K3) is still live on the published 4.2.0 site.** The root cause may be in a different layer
(scene machine state restoration from localStorage, `autoPlayNext` timing, or a KeepAlive caching
issue) — it needs an on-device diagnosis.

**P0 — the hero cold-path failure (U-K2/U-K3) is live user-visible product breakage. The gate
battery's universal `seedControlsOpen` pattern means NO gate exercises the genuine cold path, and
the failure has no runtime oracle to regress against.** The J P0 fix addressed the library-level
subject-write oracle gap; the demo-level hero cold-path oracle gap is still open.

---

## §4 — Additional findings

### F1 — proof:live-session B1 idle-bob blindspot (the broader gate-coverage structural debt)

Beyond the cold-path issue, the `.cube/.graph/.idle-hover` sampling pattern in B1 and
`proof:engine-no-throw-on-play` clause (c) (documented in §2) is a structural coverage gap that was
closed for the LIBRARY path (`proof:subject-animates`) but NOT for the DEMO APP's play paths. The
demo app uses `AnimationGroup.play()` via the TransportDock → `toggleAnimationGroup` path, not
`Animation.play()` directly. The `group` arm in `proof:subject-animates` covers this partially, but
it constructs a synthetic group against a fake DOM element, not the real demo scene composition.

**P2 — the demo play path (the group arm, driven by the real scene machine and real AnimationGroup
registered with real subjects) is unguarded by a born-RED oracle.** `proof:live-session` B1's
distinct-transform count is 101 from idle-bob/orbital/tilt; that number would be ≥3 even if the
cube's animation group wrote nothing.

---

### F2 — SoA ADOPT transposition not seeded in K planning

The bench + the 3-clause equivalence guard are present. `src/animation/` has zero `lerpArray`
consumers. PROGRESS.md records the transposition as "elected separate authorized motion." No K wave
row seeds it. **P2 — the ADOPT-elected FrameCompiler SoA transposition is in limbo: the decision
(ADOPT) and its correctness oracle (the equivalence guard) are in J, but the impl has no K home.**
K's planning horizon should include a wave row for the `FrameCompiler`-side transposition behind the
pre-existing 3-clause guard.

---

### F3 — DEP-1 CNAME hazard unaddressed in K planning

Documented in §1/S8: `dns-cf-sync.sh:105` still holds the drifted target `keyframes.pages.dev`. The
live site is correct because the script has not been re-run. **P1 — a blind re-run of `dns-cf-sync.sh`
would CNAME the production domain to the wrong CF Pages subdomain, silently taking the live site
offline.** The owed write is `dns-cf-sync.sh:105` → `keyframes-8uq.pages.dev`. K should include a
deploy-lane confirmation that this has been applied.

---

### F4 — EF-3 shim HANDOFF not yet redeemable (value.js E1 still unpublished)

The `parseLinearStops` shim (`src/animation/utils.ts:106`) is correctly KEPT. The HANDOFF condition
(`typeof v.parseLinearStops === "function"`) is not yet met — verified by the probe artifact. The
shim will need a same-motion excision the moment value.js E1 publishes. **P2 — the paired born-RED
gate (`grep parseLinearStops src/ = 0` reds on retire) must remain in K's probe-set** so the retire
does not escape into a future tranche as a stale shim.

---

### F5 — CE-1.0 guard is a feature-detect, not a version-keyed gate

`isWebKitEngine()` tests `typeof webkitConvertPointFromNodeToPage`. This API has shipped WebKit-only
since Safari 4; a removal would break the guard. **P2 — the CE-1.0 guard has no Born-RED witness for
`webkitConvertPointFromNodeToPage` DISAPPEARING from a future Safari version.** If the API is ever
removed (browser API churn), the guard silently stops firing — a spring-`linear()` delegation would
again run un-accelerated main-thread on WebKit with no gate catching it. This is low-probability but
not zero.

---

## §FOLD — findings table

| # | Finding | Severity | Seam | Suggested wave-class |
|---|---------|----------|------|---------------------|
| P0 | Hero cold-path failure (U-K2/U-K3): rainbow play from `/#/` does not smoothly start cube animating; no gate exercises the genuine cold path (every gate seeds `isControlsPanelOpen=true`); user-visible product breakage on 4.2.0 | **P0** | `scripts/proof-live-session.mjs:225-233` (seedControlsOpen universally applied) + `demo/app/useSceneMachineApp.ts:155-165` (the hero→cube navigate path) | K.W-demo (demo-behavior gate / cold-path oracle — a born-RED `proof:hero-cold-path` that seeds NO localStorage, navigates `/#/`, clicks the rainbow play, and asserts the cube's ANIMATION SUBJECT traverses ≥3 distinct values within 2 s) |
| F1 | B1 / proof:engine-no-throw-on-play clause (c) idle-bob blindspot: the ≥3-distinct-transform count passes entirely on idle-bob + orbital + tilt (all independent of the engine play write); demo app group play path has no born-RED oracle covering the subject write from the real scene machine | **P1** | `scripts/proof-live-session.mjs:393-412` (B1 sampling) + `scripts/proof-engine-no-throw-on-play.mjs` (clause c) | K.W-demo (extend `proof:subject-animates` or `proof:live-session` B1 with a cube-specific subject-write arm: a `proof:cube-plays-subject` gate that reads the cube's actual animated transform, not `.idle-hover`) |
| F2 | SoA lerpArray ADOPT transposition has no K wave home: ADOPT decision + bench + equivalence guard are all in J; the FrameCompiler-side `Float64Array` SoA transposition in `src/animation/` is not seeded in any K planning row | **P2** | `src/animation/frame-compiler.ts` (no lerpArray consumer) + `test/lerparray-adopt.test.ts:clause-c` (the correctness oracle the impl lands behind) | K.W-engine (the FrameCompiler SoA transposition motion: emit `Float64Array` buffer consumed by `lerpArray` in `interpFrames`, behind the pre-existing equivalence guard) |
| F3 | DEP-1 CNAME hazard still live: `dns-cf-sync.sh:105` drifted target (`keyframes.pages.dev` should be `keyframes-8uq.pages.dev`) never fixed; a blind re-run would take the production domain offline | **P1** | `dns-cf-sync.sh:105` in the deploy repo (fourier, OUT) | K deploy-lane (confirm-and-fix: `dns-cf-sync.sh:105` → `keyframes-8uq.pages.dev`, cross-reference `deploy-pages.yml:4-5`) |
| F4 | EF-3 shim HANDOFF redeemability: `parseLinearStops` shim at `utils.ts:106` is correctly KEPT; the retire precondition (value.js E1 publish) must be actively monitored or the shim will persist stale across K | **P2** | `src/animation/utils.ts:106` + `test/lerparray-adopt.test.ts` API-lock clause (the born-RED gate that fires when value.js drops `lerpArray`; the symmetric gate for `parseLinearStops` retirement is the `grep=0` postcondition) | K hygiene (add a `proof:valuejs-E1-watch` step to the re-pin checklist: check `typeof v.parseLinearStops` and trigger the same-motion excision if truthy) |
| F5 | CE-1.0 guard relies on `webkitConvertPointFromNodeToPage` presence; no born-RED witness for the API being REMOVED from a future Safari; guard silently stops firing if the API is eventually deprecated | **P2** | `src/animation/waapi.ts:82-84` (`isWebKitEngine`) + `test/waapi-lifecycle.test.ts` CE-1.0 clause | K hygiene (add a second guard arm: also check `CSS.supports("animation-timeline: scroll()")` as a dual-confirm WebKit presence test; or document the guard's API dependency and add a comment that removal = guard becomes a no-op) |

---

## §5 — Summary verdict on J.W6 as a whole

**Rider exits:** all nine riders exited with the required artifact. Zero rows leave as a fifth
BOOK/MEASURE-FIRST without a measurement. P-invariant-28 is honored.

**FB-2 LAND:** honest — the conversion shipped correctly (`_renderFrame` applies the subject
write with `interpFrames(t, true, …)` at `engine.ts:919`); the gate battery had a structural
subject-write blindspot that the P0 record correctly identified and closed at the library level.
The seam was never broken in the tree; the P0 is the missing oracle, not a code regression.

**Critical open issue (P0):** the hero cold-path failure (U-K2/U-K3) is live on the published
site and unexercised by any gate. The `seedControlsOpen` pattern universally applied in the battery
means the genuine cold path (no localStorage → hero start screen → rainbow play → cube) has no
runtime oracle. This is the gate's "appearance-axis" blindspot at the demo level — analogous to the
`proof:subject-animates` gap at the library level, but unaddressed. **This is the highest-priority
K finding from the J.W6 audit.**
