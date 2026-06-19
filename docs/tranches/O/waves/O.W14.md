# O.W14 — Lighthouse posture flip + content-visibility gate + hero word-gap verify (the M.W15 impl)

**Band:** F — glass-ui BC consume
**Phase:** GATED (glass-ui BC cut published) for S1 posture flip + S3 content-visibility gate; NOW
for S4 hero word-gap assertion verify (kf-internal, no sibling dep — the source fix is already
landed at `AnimatedText.vue:29-30`; the born-RED gate clause is absent)
**Sequence:** O.W12 (S1+S2 workaround deletes + re-pin) → O.W13 (design-paint baseline lock) →
**O.W14** (lighthouse posture flip + content-visibility gate + hero word-gap clause) → **O.W15**
(the N Stage unshelf, DM-24 — the owning wave). Per CANON #8, O.W14's lighthouse floors lock
BEFORE O.W15's N-Stage perf integration; the sequence + motion-path ceiling additions fold into
O.W15's N-Stage perf integration (the BC-consumed-actuals measurement that W15 performs on the
integrated tree).
**Owning chronic/DM:** DM-8 (Lighthouse floors VERIFY-ONLY chronic — S1 promotes it from
observe-only → hard-gate via a posture flip; P-inv-28 does not formally fire here as DM-8 is
classified VERIFY-ONLY at O, but the no-perpetual-punts precept demands the posture flip at the
BC consume, not at a later tranche)

M-substrate: **M.W15** (the full demo-perf spec — S1 lighthouse posture, S2 content-visibility
gate, S3 consume-bundle, S4 BC.W-LIGHTHOUSE coord record). Delta from M.W15 to O.W14:

- M.W15 §S3 (`proof:consume-bundle`) was spec'd as born-RED/absent in M but the AUDIT-DIGEST E22
  finding reverses this: `scripts/proof-consume-bundle.mjs` IS ALREADY PRESENT on `master` and in
  `proof:hygiene`. O.W14 does NOT re-author `proof:consume-bundle`. The M.W15 §S3 born-RED claim
  is stale; this fact is recorded in O.W2 ledger intake (DM-25 FOLD-LANDED).
- M.W15 §S2 (`proof:content-visibility-gated`) is ABSENT from `scripts/` at O authoring (confirmed
  by `ls scripts/proof-content-visibility*.mjs` → no matches, 2026-06-19). O.W14 implements this
  gate — born-RED by absence — with the correct event interface (`ContentVisibilityAutoStateChangeEvent
  extends Event`, `.skipped` as a top-level property, NOT `.detail.skipped`).
- M.W15 §S1 lighthouse posture flip is BC-gated in substance (the `SCENE_CEILINGS` must be updated
  to post-BC actuals before flipping). O.W14 executes this after O.W12 GREENs.
- M.W15 named the hero word-gap (X-5) defect as "the M.W15 impl" context. The AUDIT-DIGEST C16/D17
  finding (2026-06-19) confirms the SOURCE FIX is already landed (`AnimatedText.vue:29-30`,
  `marginInlineEnd: 0.25em`). But the `proof:demo-usability` X-5 hero gap clause must be verified
  on the BC-consumed `dist/gh-pages` build — if the built dist does not include the cure (e.g. a
  stale dist, a misconfigured build), the gate bites. O.W14 makes this the explicit verify step (S4).
- O.W14 carries NO N Stage content (CANON #8). O.W14 = lighthouse posture flip + content-visibility
  gate + hero word-gap verify ONLY. The N Stage unshelf (DM-24) is the CONTENT of O.W15 (the owning
  wave, per CANON #8). O.W14 owns the perf posture machinery; O.W15 owns the N Stage demo-content +
  its N-Stage perf integration. The Band F consume order is `O.W12 → O.W13 → O.W14 → O.W15`: O.W14's
  lighthouse floors lock BEFORE O.W15's N-Stage perf integration (O.W14 GREEN is the pre-condition
  for O.W15). If the PROGRESS.md O.W14 row still names DM-24, that is a stale label — DM-24 is O.W15.

---

## Context

The M.W15 demo-perf mandate has three independently verifiable dimensions, one of which (S3
`proof:consume-bundle`) is already GREEN on `master`. The remaining two dimensions are both
BC-gated for honest reasons:

1. **Lighthouse posture (S1):** `proof:lighthouse-mobile` EXISTS at `scripts/proof-lighthouse-mobile.mjs`
   with per-scene `SCENE_CEILINGS` floors and CI wiring. It uses `declarePosture("observe-only", …)`
   at line 71. In CI (without `KF_REQUIRE_LH=1`) ceiling misses are RECORDED-WITHHELD, not failures.
   The born-RED state is the posture mismatch: the gate IS authored and CI-wired, but its verdict is
   WITHHELD in CI on a ceiling miss. The device-honesty resolution (M.W15 §S1): Lighthouse PERFORMANCE
   SCORES are normalized ratios on the 0–100 scale, calibrated against the throttled Moto G Power
   emulation — they absorb hardware variability within ±5 points and are NOT the absolute-millisecond
   thresholds that drove the K-era `inv-L-device-honesty` restriction. The posture flip is safe.

2. **Content-visibility gate (S2/S3):** `proof:content-visibility-gated` is ABSENT from `scripts/`
   (confirmed live, 2026-06-19). The demo's Stage previews (if unshelfed per DM-24 / O.W15) and any
   other `content-visibility: auto` off-screen elements must have their loop-pause mechanism verified
   by a gate that reads the REAL `RAFPlayback.running` state, not a CSS source-shape grep. The correct
   event interface is `ContentVisibilityAutoStateChangeEvent extends Event` (NOT `CustomEvent`), with
   `.skipped` as a top-level Event property (NOT `.detail.skipped`) — confirmed in `M.W15 §S2` from
   the TypeScript DOM lib and the wiring comment at `useLivePreviewLOD.ts:259`.

3. **Hero word-gap verify (S4):** The X-5 "Selectananimation" defect (per-word `<span>` gap collapsed
   to 0px) is CURED IN SOURCE at `demo/@/components/custom/AnimatedText.vue:29-30` via
   `marginInlineEnd: 0.25em` on all but the last word. The `proof:demo-usability` gate's hero word-gap
   clause (clauses 2+3 in the browser half) asserts `minGap > 0` between adjacent same-line word
   boxes, measured via `getBoundingClientRect()` pairs. This clause was authored in an earlier tranche
   (G.W11) and IS CI-wired at `.github/workflows/ci.yml:424`. However, the gate runs against the
   BUILT `dist/gh-pages` — if the BC consume requires a fresh `npm run gh-pages` build, a stale dist
   could still exhibit the gap-collapse. O.W14 verifies the gate passes clean on the BC-consumed dist.

**The BC-gate rationale for S1 (posture flip).** Locking performance floors on a pre-BC demo produces
floors that immediately break on the BC consume due to the dock redesign's CLS/LCP profile change —
not a genuine regression, just a baseline mismatch. The correct posture: measure actuals post-BC,
update `SCENE_CEILINGS`, then flip to hard-gate. Flipping to hard-gate BEFORE updating the ceilings
to post-BC actuals would false-red on the dock redesign change.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-19) |
|-----|-----------------|----------------------------|
| AUDIT-DIGEST C16 | `demo/@/components/custom/AnimatedText.vue:29-30` | Hero word-gap IS cured in source — `marginInlineEnd: 0.25em` present; X-5 "Selectananimation" fix landed |
| AUDIT-DIGEST D17 | `scripts/proof-demo-usability.mjs` | "hero word-gap (X-5) IS cured in source at AnimatedText.vue:29-30; no action needed on that specific clause — the gate should pass on a current dist build" |
| AUDIT-DIGEST E22 | `scripts/proof-lighthouse-mobile.mjs:71` | `declarePosture("observe-only", …)` — posture mismatch confirmed; never reds in CI without `KF_REQUIRE_LH=1` |
| AUDIT-DIGEST E22 | `.github/workflows/ci.yml:824-827` | CI step labelled `[HYGIENE · observe-only-in-CI]`, runs `proof:lighthouse-mobile` WITHOUT `KF_REQUIRE_LH=1` |
| AUDIT-DIGEST E22 | `scripts/proof-consume-bundle.mjs` | ALREADY PRESENT — the M.W15 §S3 born-RED claim is stale; `proof:consume-bundle` is in `proof:hygiene` |
| AUDIT-DIGEST E23 | M.W15 PROGRESS.md | "M.W15 Lighthouse posture is observe-only in CI — ceiling misses are never failures"; chronically documented as `[HIGH·chronic]` |
| AUDIT-DIGEST E22 | `ls scripts/proof-content-visibility*.mjs` | NOT FOUND — gate is absent; exit 1 by construction |
| AUDIT-DIGEST E22, E23 | `SCENE_CEILINGS` constant | `sequence` and `motion-path` ABSENT from SCENE_CEILINGS; `if (ceiling == null) continue` silently skips them (ownership: O.W15 adds these floors after BC-consume measurement) |
| M.W15 §S2 | `useLivePreviewLOD.ts:259` | `(e as Event & { skipped?: boolean }).skipped` — `.skipped` is top-level on `Event`, NOT `.detail.skipped` |

---

## Scope

### S1 — `proof:lighthouse-mobile` posture flip (observe-only → hard-gate, GATED on BC cut)

**Breach.** `scripts/proof-lighthouse-mobile.mjs:71` declares `posture = declarePosture("observe-only", …)`.
In CI (without `KF_REQUIRE_LH=1`), ceiling misses from `SCENE_CEILINGS` are RECORDED-WITHHELD — the
CI step labelled `[HYGIENE · observe-only-in-CI]` at `ci.yml:824`. This is DM-8's VERIFY-ONLY
posture from the K era. The posture was correct for K-era absolute-ms thresholds on a slow Linux runner;
it is no longer correct for normalized Lighthouse PERFORMANCE SCORES.

**The device-honesty resolution.** Lighthouse PERFORMANCE SCORES use CPU-4× + Fast-3G throttling
normalized to the Moto G Power emulation. The score is a ratio (0–100), NOT a wall-clock millisecond.
The ±5-point hardware variability is within the calibration envelope — a floor set to `≥52` is safe
on both fast macOS dev machines and the slower GH Actions runner (confirmed: the K-era score was driven
by Monaco's 28.5 s LCP, which the E.W4 defer eliminated; the current floors are post-defer baselines).

**Cure (BC-gated — no new script).** After the BC consume (O.W12 GREEN, BC-consumed `dist/gh-pages`
built):
1. Run `KF_REQUIRE_LH=1 node scripts/proof-lighthouse-mobile.mjs` — establish per-scene BC-consumed
   actuals across the 6 scenes in `SCENE_CEILINGS` (home, cube, amiga, square, easing, spring).
2. Update `SCENE_CEILINGS` values in `scripts/proof-lighthouse-mobile.mjs` to the measured post-BC
   actuals if the BC dock redesign changed any scene's profile (CLS/LCP change from the dock morph).
   This is a ceiling UPDATE, not a weakening — it records the new correct baseline.
3. Change `declarePosture("observe-only", …)` to `declarePosture("hard", …)` at line 71 (or remove
   the posture wrapper entirely and always assert hard). Remove the `KF_REQUIRE_LH=1` env-var guard
   from the CI step label and the CI step itself — the posture is now always hard.
4. Remove the `[HYGIENE · observe-only-in-CI]` label from `ci.yml:824` and move the step to the
   standard correctness run (the label is a posture disclaimer that becomes stale after the flip).

**The scope boundary between O.W14 and O.W15.** O.W14 owns the posture flip on the 6 EXISTING
scenes. O.W15 owns ADDING `sequence` and `motion-path` to `SCENE_CEILINGS` after measuring their
BC-consumed actuals (those two scenes are currently absent → silently skipped by
`if (ceiling == null) continue`). The flip in S1 fires atomically on the 6 existing ceilings; O.W15
extends the ceiling set on the BC-consumed tree.

**Born-RED today.** `scripts/proof-lighthouse-mobile.mjs:71` reads `declarePosture("observe-only", …)`.
The CI step runs WITHOUT `KF_REQUIRE_LH=1`. A ceiling miss is never a CI failure. This is the
genuine posture breach — not a source grep but an observable CI outcome (RECORDED-WITHHELD, not
exit 1).

**Falsifiable check.** Before the flip: `node scripts/proof-lighthouse-mobile.mjs` in CI without
`KF_REQUIRE_LH=1` exits 0 on a ceiling miss (the observe-only routing). After the flip:
`node scripts/proof-lighthouse-mobile.mjs` exits 1 on any ceiling miss without needing the env var —
the posture is the one-line diff.

---

### S2 — `proof:content-visibility-gated` (the off-screen loop-pause gate — NEW, born-RED by absence)

**Breach.** No gate asserts that `content-visibility: auto` off-screen elements have their rAF loops
paused. The risk (M.W15 §S2): if the `contentvisibilityautostatechange` listener is absent or
mis-wired, multiple off-screen loops tick simultaneously — frame budget death. The gate is ABSENT
from `scripts/` (verified 2026-06-19: `ls scripts/proof-content-visibility*.mjs` → no matches).

**Cure (gate-first — born-RED by construction on authoring).**
Author `scripts/proof-content-visibility-gated.mjs`:
- Opens `dist/gh-pages` in headless Playwright via the existing `withPage` + `serveDist` substrate
  (same as `proof:design-paint` and `proof:lighthouse-mobile`).
- For the target element (an off-screen `content-visibility: auto` element — Stage rear ring card
  at index 3 if the Stage is unshelfed, or the nearest equivalent off-screen lazy element in the
  BC-consumed M-era demo):
  - Reads `getComputedStyle(el).contentVisibility` → asserts `"auto"` (the CSS is applied, not a
    grep proxy).
  - Dispatches a synthetic `contentvisibilityautostatechange` event with `.skipped = true`.

**Critical precision (the event interface).**
```js
// CORRECT form — ContentVisibilityAutoStateChangeEvent extends Event (NOT CustomEvent)
// .skipped is a TOP-LEVEL Event property, NOT detail.skipped
const ev = new Event('contentvisibilityautostatechange');
Object.defineProperty(ev, 'skipped', { value: true });
el.dispatchEvent(ev);
```
This form matches the TypeScript DOM lib definition
(`interface ContentVisibilityAutoStateChangeEvent extends Event { readonly skipped: boolean; }`)
and the existing consumer at `useLivePreviewLOD.ts:259`:
`(e as Event & { skipped?: boolean }).skipped`. The `detail.skipped` form would silently not
fire the listener because the listener does NOT extend `CustomEvent` — confirmed in M.W15 §S2.

- After dispatch, asserts that the `RAFPlayback` for the element's animation loop has
  `running === false` (`RAFPlayback.running: boolean` is the REAL observable from
  `src/animation/playback.ts: get running(): boolean { return this._rafId !== null; }`).
- Exits 1 if `running` stays `true` after the dispatch — the listener is absent or mis-wired.
- Prints a scene-by-scene report: `cv:auto CONFIRMED → loop paused: true/false`.

**Conditional on demo content.** If the BC-consumed M-era demo has NO `content-visibility: auto`
usage outside the N Stage previews AND the Stage is shelved (O.W15 DM-24 not fired), this gate's
content is deferred to the N unshelf wave (O.W15), which owns the Stage loop-pause mechanism. At
impl time: check `grep -rn 'content-visibility.*auto' demo/` for active usage. If zero hits outside
the Stage previews, record this gate as deferred to O.W15 in O/FINAL.md §deferred with the O.W15
reference as the terminal home. If there IS active usage (e.g. Monaco pane `content-visibility:
hidden` or any cv:auto element), the gate covers those elements immediately.

**Gate tier.** `GATE TIER: correctness` (browser gate — Playwright over built dist).

---

### S3 — SCENE_CEILINGS scope note (the O.W14 / O.W15 boundary)

**O.W14 scope (this wave):** the 6 existing scenes in `SCENE_CEILINGS` (home, cube, amiga, square,
easing, spring). The posture flip (S1) covers exactly these 6.

**O.W15 scope (next wave — the N Stage unshelf, DM-24):** ADD `sequence` and `motion-path` to
`SCENE_CEILINGS` at their BC-consumed actuals, as part of O.W15's N-Stage perf integration. Those
two scenes are currently ABSENT from `SCENE_CEILINGS` and are silently skipped by
`if (ceiling == null) continue` — an E22/E23 audit finding. The addition folds into O.W15 because
O.W15 is where the N Stage integrates and the post-integration BC-consumed perf actuals are measured
(CANON #8: W14's lighthouse floors lock BEFORE W15's N-Stage perf integration).

This boundary ensures O.W14 does not attempt to set floors for scenes whose BC-consumed performance
is unknown at authoring time. Both waves are BC-gated; the floor measurements happen post-BC.

---

### S4 — Hero word-gap verify on the BC-consumed dist (X-5 clause confirm)

**State today.** The X-5 "Selectananimation" defect (per-word `<span>` inter-word gap collapsed to
0px) is CURED IN SOURCE at `demo/@/components/custom/AnimatedText.vue:29-30`:
```
marginInlineEnd:
    index < words.length - 1 ? '0.25em' : undefined,
```
Confirmed by AUDIT-DIGEST C16/D17 (2026-06-19). The `proof:demo-usability` gate's hero word-gap
clause (clauses 2+3 in the browser half) IS CI-wired at `ci.yml:424` and will catch regressions
going forward.

**The O.W14 obligation.** Verify that `proof:demo-usability` (specifically the hero word-gap clause)
passes on the BC-consumed `dist/gh-pages` build. This is NOT a new gate authoring; it is a
VERIFICATION step at impl time:
1. `npm run gh-pages` → `dist/gh-pages` (BC-consumed tree, post-O.W12).
2. `node scripts/proof-demo-usability.mjs` → the hero word-gap clause (clauses 2+3) exits with
   `ok("hero inter-word gap > 0 …")`. The `minGap` measurement must be `> 0`.
3. If it fails on the BC-consumed dist (unexpected), the BC consume changed the `AnimatedText`
   rendering context — investigate the stacking-context or the `lift-down` class interaction with
   the BC glass card geometry and fix.

**The assignment framing ("renders 0px today").** The assignment names this as a born-RED condition.
The precise reading: the source fix is landed, but the BORN-RED gate clause for a future regression
is the guard. The clause bites if the `marginInlineEnd` is removed or the `AnimatedText` template
reverts to whitespace-only spacing (which the browser collapses in the `<span>` context). O.W14
confirms the gate passes cleanly on the post-BC dist — the absence of a pass verification on the
BC-consumed tree is the open obligation.

---

## Born-RED gate

**Gates:**
- `proof:lighthouse-mobile` (EXISTS — born-RED by POSTURE: `observe-only` in CI, never reds on a
  ceiling miss without `KF_REQUIRE_LH=1`; S1 flips to hard-gate post-BC)
- `proof:content-visibility-gated` (NEW — born-RED by ABSENCE: `ls scripts/proof-content-visibility*.mjs`
  → no matches; exit 1 by construction; conditional on demo `content-visibility: auto` usage)
- `proof:demo-usability` hero word-gap clause (EXISTS — born-RED by verification gap: the X-5 source
  fix is landed but has not been confirmed passing on the BC-consumed built dist; the clause guards
  against regression)

**The REAL observables (inv-M-observable-truth — NOT a proxy):**

| Gate / clause | Witness today (2026-06-19) | Failure mode today (the REAL observable) | Expected after BC cut + O.W14 |
|---|---|---|---|
| S1 `proof:lighthouse-mobile` posture | `scripts/proof-lighthouse-mobile.mjs:71` `declarePosture("observe-only", …)`; CI step runs without `KF_REQUIRE_LH=1`; ceiling misses EXIT 0 in CI | A scene's LCP/INP/CLS regresses below the SCORE floor — a genuine user-facing perf degradation that CI NEVER CATCHES under the observe-only posture | `declarePosture("hard", …)`; CI exits 1 on any ceiling miss; `KF_REQUIRE_LH=1` env-var guard REMOVED; `SCENE_CEILINGS` updated to BC-consumed actuals |
| S2 `proof:content-visibility-gated` | `ls scripts/proof-content-visibility*.mjs` → NOT FOUND; exit 1 by construction | An off-screen element's `RAFPlayback.running` stays `true` after the `contentvisibilityautostatechange` event fires — the loop-pause mechanism is broken; 7 concurrent rAF loops at 60 fps if Stage previews are all active | Exit 0: `running === false` after the synthetic dispatch confirms the loop-pause fires; the `.skipped` top-level Event property is the correct wire (NOT `detail.skipped`) |
| S4 `proof:demo-usability` hero gap | Source fix PRESENT (`AnimatedText.vue:29-30`); gate CI-wired (`ci.yml:424`); BC-consumed dist verification PENDING | `minGap === 0` between adjacent same-line word boxes — the title renders "Selectananimation" again if the `marginInlineEnd` is removed or the `lift-down` span context collapses the spacing | `ok("hero inter-word gap > 0")` on the BC-consumed `dist/gh-pages` build — the clause confirms the cure is in the BUILT artifact, not just the source |

**Born-RED TODAY (by construction and by posture).**

Primary born-RED (the posture breach, S1): `grep 'declarePosture' scripts/proof-lighthouse-mobile.mjs`
→ `declarePosture("observe-only", …)`. The CI step exits 0 on a ceiling miss — a POSTURE BREACH for
a perf gate that is CI-wired. This is the genuine observable: the gate bites only under `KF_REQUIRE_LH=1`
which CI does NOT set.

Secondary born-RED (S2, the absent gate): `ls scripts/proof-content-visibility*.mjs` → NOT FOUND. Exit
1 by file-not-found. After authoring: a `RAFPlayback.running === true` post-dispatch exits 1 on the
REAL loop-pause failure (not a CSS grep proxy).

Tertiary born-RED (S4, the verify gap): the `proof:demo-usability` hero gap clause has NOT been
confirmed on the BC-consumed `dist/gh-pages`. The clause is CI-wired but the BC-consume changes the
build; the verify step is the open obligation.

**Green condition (in order):**
1. BC consume complete (O.W12 GREEN) — `dist/gh-pages` built on the BC-consumed tree.
2. Run `KF_REQUIRE_LH=1 node scripts/proof-lighthouse-mobile.mjs` → measure per-scene actuals.
3. Update `SCENE_CEILINGS` in `scripts/proof-lighthouse-mobile.mjs` to the measured BC-consumed values.
4. Change `declarePosture("observe-only", …)` to `declarePosture("hard", …)` at line 71; remove the
   `KF_REQUIRE_LH=1` env-var guard; update the CI step label.
5. Author `scripts/proof-content-visibility-gated.mjs` (S2) — born-RED gate first; verify on the
   BC-consumed demo; confirm `running === false` post-dispatch.
6. Run `node scripts/proof-demo-usability.mjs` on the BC-consumed dist (S4) — hero word-gap clause
   exits with `ok(…)`.
7. `npm run proof:all` → GREEN (all gates passing on the BC-consumed O-era dist).

---

## Dependencies

- **O.W12 (BC re-pin + workaround deletes) — the primary unblock.** S1 posture flip and S3
  content-visibility gate both require the BC-consumed `dist/gh-pages` build. O.W12 must be GREEN
  before any S1/S2 impl action.
- **O.W13 (design-paint baseline lock) — S4 ordering.** The design-paint baseline lock (O.W13 S4)
  and the hero word-gap verify (O.W14 S4) both operate on the BC-consumed `dist/gh-pages`. They are
  independent checks (pixel readback vs. layout measurement) and can run in parallel after O.W12.
  The ordering in the Sequence header (O.W13 → O.W14) is a DOCUMENTATION ordering; at impl time
  both S4 verifications run on the same dist build.
- **O.W15 (the N Stage unshelf, DM-24) — the successor.** O.W14 SCOPES OUT the sequence and
  motion-path ceiling additions; they fold into O.W15's N-Stage perf integration. O.W15 fires after
  O.W14 GREENs and the 6-scene posture flip is confirmed stable (CANON #8: W14 floors lock BEFORE
  W15's N-Stage perf integration).
- **`dist/gh-pages` build** — the gates serve the built dist, not Vite-transformed source. `npm run
  gh-pages` must precede every gate run in this wave.
- **Playwright + lighthouse devDeps** — already added to `devDependencies` via the existing CI step
  `npm i --no-save @playwright/test lighthouse` at `ci.yml:406`. No new deps needed.
- **`proof:content-visibility-gated` conditionality** — if the BC-consumed M-era demo has NO
  `content-visibility: auto` elements outside the N Stage previews AND the Stage is shelved,
  S2 is DEFERRED to O.W15 (which owns the N Stage unshelf and the Stage loop-pause mechanism).
  Record the defer in O/FINAL.md §deferred if this condition holds at impl time.
- **Independent of Band A/B/C/D waves** — the perf posture machinery is orthogonal to the
  correctness repairs and the constellation workaround deletions. No cross-dependency.

---

## dev→impl boundary

This wave is **GATED on the glass-ui BC cut publish** for S1 (posture flip) and S2
(content-visibility gate — conditional on demo content). S4 (hero word-gap verify) is effectively
GATED on the same event because the verification runs against the BC-consumed `dist/gh-pages`.

**Pre-BC action (gate-authoring, kf-internal, NOW):** Author `scripts/proof-content-visibility-gated.mjs`
(S2) BEFORE the BC cut — the gate script is kf-internal, has no sibling dep, and must be born-RED on
the current tree (either by file-not-found, or by finding zero `content-visibility: auto` elements to
probe and exiting with a "deferred" record). The born-RED state is established by authoring S2 pre-BC;
the GREEN transition fires post-BC on the BC-consumed demo.

**Post-BC impl sequence:**
1. O.W12 GREENs (S1+S2 workaround deletes + re-pin) → `npm run gh-pages`.
2. O.W13 baseline lock run (design-paint) → parallel with O.W14 S1/S2/S4 runs.
3. Measure BC-consumed Lighthouse actuals → update `SCENE_CEILINGS` → flip posture (S1).
4. Run S2 (`proof:content-visibility-gated`) on BC-consumed demo → confirm loop-pause or defer to O.W15.
5. Run `node scripts/proof-demo-usability.mjs` → confirm hero word-gap clause GREEN (S4).
6. `npm run proof:all` → GREEN.
7. O.W15 fires: the N Stage unshelf (DM-24) — its N-Stage perf integration adds sequence +
   motion-path to `SCENE_CEILINGS` on the integrated tree.
