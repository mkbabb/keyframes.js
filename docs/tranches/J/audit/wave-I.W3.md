# wave-I.W3 — Plan-vs-Delivery Audit (amiga subject=pivot=framing + content-visibility shed)

**Lane:** wave-I.W3  
**Commit audited:** `b8659fe` (feat(tranche-I W3): amiga subject=pivot=framing + shed content-visibility (B3))  
**WZ reconciliation:** `2e45941` (fix(tranche-I WZ): reconcile easter-egg + scene-perf-budget G5)  
**Tree verified against:** master (current HEAD after `a4b1472` merge)  
**Date:** 2026-06-09

---

## 1. Scope vs. Delivery

| Spec item | Status | Evidence |
|---|---|---|
| S1: `SPHERE_HOME = 0` exported from `useAmigaAnimations` | DELIVERED | `demo/amiga/useAmigaAnimations.ts:15` |
| S1: Bounce extents → `SPHERE_HOME ± BOUNCE` (all three axes) | DELIVERED | `:72-76`, `:88-98`, `:108-114` |
| S1: Sphere seated at `(SPHERE_HOME, SPHERE_HOME, SPHERE_HOME)` in `onMounted` | DELIVERED | `demo/app/scenes/AmigaScene.vue:145` |
| S1: `controls.target.copy(sphereMesh.position)` + `controls.update()` | DELIVERED | `:159-160` |
| S1: `SPHERE_HOME` imported and used in boing-reset | DELIVERED | `:22`, `:80` |
| S2: `content-visibility: auto` removed from `.scene-root` scoped styles | DELIVERED | `:261-269` (comment replaces removed block) |
| S2: `useIntersectionObserver` present-loop pause (rootMargin: "200px") | DELIVERED | `:222-229` |
| S2: `contentvisibilityautostatechange` listener removed | DELIVERED | diff shows `useEventListener` → `useIntersectionObserver` swap |
| `useSphereSpin.ts` untouched | VERIFIED | `git log -- demo/amiga/useSphereSpin.ts` → last modified `1f506b2` (H.W8), not W3 |
| Gate `proof:amiga-subject-is-pivot` authored | DELIVERED | `scripts/proof-amiga-subject-is-pivot.mjs` (528 lines) |
| Gate WZ G5 inversion (`proof:scene-perf-budget`) | DELIVERED | `2e45941` inverts the G5 clause to assert NO `content-visibility` on the amiga WebGL root |
| Latent note (scope-ownership, RECORD for IMPL) | NOT ACTIONED (correctly) | spec marks it RECORD, not required for W3; `useSphereSpin.attach()` still imperative-in-`onMounted` |

**Verdict: full spec delivered. No items silently narrowed or dropped.**

---

## 2. Quick-solution / Workaround Residue

Searched for: `try/catch` floors, magic timeouts, `TODO`/`FIXME`, `settle`/`sleep` patterns in the W3 diff.

- **No `try/catch` floors** introduced. The removed `onContentVisibilityChange` had no swallowed errors.
- **No `TODO`/`FIXME` markers** added in `demo/amiga/useAmigaAnimations.ts` or `AmigaScene.vue`.
- **`setTimeout` at line 77** (`boingTimer`) is the easter-egg arc timer — pre-existing H.W5, not a settle/sleep workaround. It is the intentional "stop boing after one arc" timer and is correctly `clearTimeout`'d in `onBeforeUnmount:232`.
- **`waitForTimeout` in gate script** (lines 236, 239, 281, 424, 430): all in the Playwright harness, not in product code. The 16ms `waitForTimeout` in `dragStroke` is a per-pointer-event tick step (correct test idiom). The 2200ms and 600ms in clause (c) are the "≥2s steady-state" observation windows — reasonable, not magic.
- **No compat shims or deprecated API usage** introduced.

---

## 3. Legacy Left Behind

- **No dead paths or stale docstrings** introduced by W3. The removed `const SPHERE_HOME = -BOX_SIZE / 2 + 1` (AmigaScene.vue pre-W3) is cleanly replaced by the import; no shadow copy remains.
- **No residual corner references**: `grep -rn "BOX_SIZE / 2 - 1\|-5,-5,-5" demo/amiga/` returns only `useAmigaAnimations.ts:19` — a comment ("rather than re-cementing a far corner"), not a live value.
- **The Y-bounce `fromVars` vs. X/Z `fromKeyframes` asymmetry** is pre-existing H.W5 behavior, not introduced by W3.
- **`bouncingY` duration 700ms** vs. `bouncingX` 10000ms and `bouncingZ` 20000ms is pre-existing; W3 only updated the position values, not the timing.

---

## 4. Gate Honesty Audit

### 4a. `proof:amiga-subject-is-pivot` — the standalone gate

**Clause (a) — centre drag moves SUBJECT not camera:**  
Oracle: canvas-region MAD split (centre disc rC=0.22·min vs. periphery ring rP=0.38·min). Centre drag asserts `centreMAD ≥ 6` AND `peripheryMAD ≤ centreMAD × 0.6`. Born-RED signal was `peripheryMAD 101.9 >> centreMAD 30.4` (whole-room re-projection). The thresholds are product-behavioral (not self-baseline): a regression where the sphere returns to a corner makes the periphery dominate again — the gate bites. **HONEST.**

**Clause (b) — empty-space drag orbits ABOUT the subject:**  
Oracle: red-checker centroid stays detectable (`weight > 0`) AND within 0.3 normalized-canvas of centre AND jumps ≤ 0.3 of the frame. Born-RED: the corner sphere was flung off-frame or to the edge. **HONEST.**

**Clause (c) — no GPU-stall / content-visibility warns:**  
Oracle: zero `warning`/`verbose`/`warn` console lines matching `/ReadPixels|GPU stall/i` over ≥2s present loop + DOM invariant that the WebGL canvas has no `content-visibility: auto|hidden` ancestor.  

**Cold-GPU exclusion analysis (the task focus):**  
The live-session gate (`proof-live-session.mjs`) documents an explicit WARM-then-OBSERVE split: a throwaway page warms the Chromium GPU process (clearing the cold-start shader-compile + first backdrop-filter composite ReadPixels burst at t≈400ms), then the budgeted page observes 2600ms steady-state. `scripts/proof-live-session.mjs:622-652`.  

The standalone gate has NO explicit warmup step. However, clause (c) uses `freshAmiga(0)` AFTER clauses (a) and (b) have each run `freshAmiga(1500)` and closed their contexts — but NOT their browser. All three clauses share one `browser` object (`browser = await chromium.launch()` at line 270, `browser.close()` at 506). Chromium shares a single GPU process across contexts within the same browser instance. So clauses (a)/(b) effectively warm the GPU process before clause (c) observes.

**The implicit warmup is a fragility:** the warmup is a SIDE EFFECT of sequential execution order. If clause order is ever changed (e.g. reordering for performance), clause (c) runs cold and may pick up the ~4-line init burst. The live-session gate documents its warmup explicitly and labels it `UNBUDGETED`. The standalone gate does NOT document this dependency.

**Does this mask a per-frame readback regression?**  
The FINAL.md §B answer: a per-frame ReadPixels regression produces stalls on EVERY frame regardless of warmup — the live-session gate's steady-state observation (2600ms on a WARM GPU) would still catch it. The cold-start burst (~4 lines, ONE-TIME at t≈400ms) is an instrument artifact from the glass-dock `backdrop-filter` compositing over the transparent `alpha:0` WebGL canvas. Since the I.W3 fix removes `content-visibility:auto` (the per-frame cause), the steady-state loop is clean. The exclusion is correctly scoped to ONE-TIME init artifact only. **The masking concern is addressed — but the documentation gap in the standalone gate is real.**

**The DOM invariant (secondary oracle):**  
The `canvasHiddenAncestor` check walks the WebGL canvas's ancestors and asserts none has `contentVisibility === "auto"|"hidden"`. Verified correct in the current tree: the `.scene-root` div has no `content-visibility` declaration (`AmigaScene.vue:261-269`). If S2 regresses (cv re-added), both the ReadPixels count AND this DOM check red. **Double-covering.** The Monaco editor's `content-visibility:hidden` keyframes pane is correctly excluded via `.closest(".monaco-pane")` filter.

**Named-benign exclusion ("Rendering was performed in a subtree hidden by content-visibility"):**  
The raw text-match for this line is explicitly NOT used as the oracle (impl note `I.W3.md:35-43`). The oracle is (i) WebGL ReadPixels stall lines (never emitted by Monaco) + (ii) the DOM ancestor invariant. The named-benign exclusion for Monaco is correctly documented and scoped. **HONEST.**

### 4b. `proof:scene-perf-budget` G5 inversion (WZ commit 2e45941)

**Before inversion:** G5 required `content-visibility: auto` + `contain-intrinsic-size` on `.scene-root`.  
**After inversion:** G5 requires NO `content-visibility: auto|hidden` on the amiga WebGL root.  

The inversion is correctly motivated: `content-visibility: auto` over a live `requestAnimationFrame` WebGL present loop forces the compositor to composite a "hidden" subtree, triggering a per-frame ReadPixels GPU stall. I.W3 replaced it with `IntersectionObserver` — the same offscreen-skip intent, no stall.

**Comment-stripping guard:** the source clause strips `/* ... */` and `// ...` comments before the regex test (`amigaCss = amigaSrc.replace(...)`). This is necessary because AmigaScene.vue's I.W3 design comments MENTION "content-visibility: auto" (explaining its removal). Without stripping, the gate would false-fail on its own explanation prose. **CORRECT.**

**Runtime clause:** navigates to `/amiga`, reads `getComputedStyle(.scene-root).contentVisibility`, asserts it is NOT `"auto"` or `"hidden"`. Verified: the current tree has `.scene-root` with no `content-visibility` declaration → resolves to the browser default (`"visible"`). **HONEST.**

**The inversion is an honest gate revision, not a spec weakening.** The ORIGINAL G5 gate was correct at H.W5's premise (cv was a valid offscreen-skip for the canvas). I.W3 changed the premise (cv over WebGL causes a GPU stall), so the gate correctly inverts. The new assertion double-covers `proof:amiga-subject-is-pivot` clause (c)'s DOM invariant. If cv is re-added, BOTH gates red.

---

## 5. Gestalt — Right Seam?

The fix landed at the correct seam. The spec's own diagnosis was that W5 promoted the sphere to interactive subject WITHOUT re-centring it or re-targeting OrbitControls — a "regression of MEANING" not a wrong number. The fix is a geometry transposition (one number: `SPHERE_HOME=0`, a one-home principle, propagated everywhere) rather than a numeric nudge or a compat shim. `useSphereSpin` is correctly left untouched — it was already correct, just aimed at an unreachable target.

The `content-visibility` removal is idiomatic: the CSS primitive is wrong for a live-painting surface; the `IntersectionObserver` is the right primitive. No workaround.

**One structural fragility that J should own:**

The `controls.target` is set ONCE to `(SPHERE_HOME, SPHERE_HOME, SPHERE_HOME)` in `onMounted` and never dynamically updated. During the boing easter egg, `sphereMesh.position` flies around the room while `controls.target` stays at the origin (which equals `SPHERE_HOME=0`). After boing, `sphereMesh.position` is reset to `(SPHERE_HOME, ...)` — the pivot is restored. This invariant holds ONLY because `SPHERE_HOME === 0 === controls.target's Vector3 init value`. If `SPHERE_HOME` is ever changed to a non-zero value, the post-boing pivot would be WRONG (controls.target would be the new SPHERE_HOME from `controls.target.copy(sphereMesh.position)` at mount, but the absence of a re-sync call after boing-reset means it could drift if the boing timer fires while the user has also panned the orbit — `controls.target` drifts when the user pans, as OrbitControls writes to it during damping).

The latent scope-ownership note from the spec (`I.W3.md:174-177` — `useSphereSpin.attach()` imperative-in-`onMounted` while `useEventListener` binds in the component scope) was correctly marked RECORD and is not yet actioned. This is J-eligible.

---

## 6. Findings for J

| ID | Severity | Title | Evidence |
|---|---|---|---|
| W3-1 | P2 | Standalone gate clause (c) relies on implicit GPU warmup from prior clauses | `scripts/proof-amiga-subject-is-pivot.mjs:417-495`; warmup is undocumented side-effect of clause (a)/(b) running first; live-session gate documents it explicitly at `:622-647` |
| W3-2 | P2 | `controls.target` not dynamically tracked after boing-reset — fragile if `SPHERE_HOME ≠ 0` | `AmigaScene.vue:159-160` (set once in `onMounted`); invariant relies on `SPHERE_HOME === 0 === Three.js origin` with no explicit re-sync post-boing |
| W3-3 | BOOK | Latent scope-ownership seam: `useSphereSpin.attach()` imperative-in-`onMounted` while `useEventListener` binds in component scope | `I.W3.md:174-177` (spec RECORD note); `useSphereSpin.ts:190-204`; fine at single-mount/no-KeepAlive but not portable |
| W3-4 | BOOK | `boincingY` uses `fromVars` (2-keyframe alternate) while `bouncingX`/`bouncingZ` use `fromKeyframes` (5-stop linear) — inconsistent idiom | `useAmigaAnimations.ts:81-100` vs `:65-79`, `:103-117`; pre-existing H.W5, not introduced by W3 |

---

## 7. Fold Candidates for J

| Item | Origin | Status in current tree | Must fold? |
|---|---|---|---|
| Document implicit GPU warmup dependency in `proof-amiga-subject-is-pivot.mjs` clause (c) | I.W3 gate gap | Undocumented; functionally works due to sequential execution | No (P2 — add comment); VERIFY-ONLY |
| `controls.target` re-sync after boing reset (or dynamic tracking in render loop) | I.W3 structural fragility | `SPHERE_HOME=0` keeps it correct today; fragile if home moves | No (P2 — J polish if SPHERE_HOME ever changes) |
| `useSphereSpin` scope-ownership seam | I.W3 spec RECORD note | Unchanged; safe for single-mount; no KeepAlive | No (BOOK) |
| G5 gate inversion honesty | I.WZ 2e45941 | Verified honest; runtime + source double-cover in current tree | VERIFY-ONLY |
