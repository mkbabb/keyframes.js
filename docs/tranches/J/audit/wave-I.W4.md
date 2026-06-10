# J Audit — wave I.W4 (B6/B8 drag seam + dock/scene perf)

**Lane:** wave-I.W4  
**Commit audited:** `3afd49f` (direct delivery) + WZ reconciliation `a775f6b` (best-of-3) + `196ec2f` (IN_CI observe-only)  
**Spec:** `docs/tranches/I/waves/I.W4.md`  
**Impl record:** `docs/tranches/I/impl/I.W4.md`  
**Date:** 2026-06-09

---

## Executive summary

I.W4 delivers its four structural fixes (D1–D4) and D5-fold correctly against the spec. The
shared drag seam owns gesture-in-flight, square's hand-rolled `window`-drag is gone, the easing
reactive storm is dead, and the dock perf rides the glass-ui 3.9.0 consume. The two runtime
gates (`proof:drag-gesture`, `proof:perf-frame-budget`) are born-RED-to-GREEN in structure and
their oracles actuate the product.

Two post-delivery WZ commits make findings that J must track:

1. **`a775f6b` (best-of-3):** Principled measurement robustness — `sampleRafBest` takes the
   minimum-dropped window across 3 runs. The born-RED storm (36 dropped) fails all 3; only a
   single contention spike is absorbed. This is NOT a loosened budget and does NOT weaken the
   gate.

2. **`196ec2f` (IN_CI observe-only):** The budget clauses (c) dock + (d) easing are demoted to
   `note()` under `CI/GITHUB_ACTIONS`. Zero-error floor and structural checks stay hard. The
   rationale is sound (a 4× throttle on a 2-core CI VM is a host artifact), BUT the change
   means a future glass-ui dock regression OR a D4 reactive-storm re-introduction are not
   caught in CI — they only hard-gate on an on-device run. This is the wave's principal open
   risk for J.

Three latent B6-a surfaces remain outside the shared seam perimeter: `EasingCurveCanvas.vue`
(inline pointer handlers, no `acquireSelectSuppression`), `PlaybackRibbon.vue` (raw
`window.pointerup`, no token), and `OrbitalDrag.vue` (setPointerCapture on container, local
`user-select:none` only). These were explicitly out of scope for D1 ("every drag surface that
routes through the seam") — they are BOOK items for J.

The spec required clause (d) at 4× CPU throttle; the impl changed to 1× (`EASING_THROTTLE=1`)
invoking the gate-ORACLE precept. The born-RED still bites (36 dropped at 1× unthrottled) and
the change is principled, but the 4×-headless future-regression path is now invisible to CI.

No TODO/FIXME/workaround residue anywhere in the wave. No legacy hand-rolled drag survives in
`SquareScene.vue`. The ONE composed `RAFPlayback` driver per scene is verified (`useRafScene`
for easing; the square's private `RAFPlayback` loop in `useSquareAnimations.ts:95`).

---

## §1 — Spec coverage

| Item | Spec requirement | Delivered? | Evidence |
|------|-----------------|------------|----------|
| D1 global select-suppression | `body.is-dragging` token in BOTH `useDragScrub` + `useDragCapture`; every drag surface inherits | YES | `gestureSelectSuppression.ts:1–35`; `useDragScrub.ts:4-6,116`; `useDragCapture.ts:4-6,47,56`; CSS rule `design-idioms.css:651-658` |
| D1 square migration | hand-rolled `window`-drag removed from `SquareScene.vue`; folded onto `useDragScrub` | YES | `SquareScene.vue:87–111` (useDragScrub call); `grep window.*pointermove demo/app/scenes/` = 0 hits |
| D2 persist policy | `releasePolicy:"persist"` declared; `settle()` on release (not `reseat(0,0)`) | YES | `SquareScene.vue:87,104`; `useSquareAnimations.ts:175–180` |
| D3 dock width-morph | glass-ui ~3.9.0 consume; NO kf-side `dock.css` override | YES | `package.json:173`; installed 3.9.0; `dock/morph.css` has no `transition:width` or `transition:all`; morph driven by `--dock-morph-t @property` + clip-path |
| D4 non-reactive style.transform | dot positions via `DotPainter` registry, direct writes; `progress` written at ≤6 Hz | YES | `useEasingDemo.ts:165-214`; `EasingTarget.vue:279-308`; `PROGRESS_READOUT_HZ=6` |
| D4 ONE composed driver | single `useRafScene`/`RAFPlayback` per scene | YES | `useEasingDemo.ts:225` (one `useRafScene` call); no other `requestAnimationFrame`/`new RAFPlayback` in `demo/easing/` |
| D5 errored half | folds into B1 (I.W0); no dock change | YES | no dock-side change in `3afd49f` |

---

## §2 — Residue audit (quick-solutions, workarounds, legacy)

**No TODO/FIXME/HACK found** in any of the 8 files the wave touched.

**try/catch floor:** `useDragScrub.ts:118-121` has a `try/catch` around `setPointerCapture`
with comment "iOS / synthetic pointers may throw — drag still works." This is NOT a
quick-solution — it is a legitimate platform guard (iOS can throw on `setPointerCapture` for
real reasons), and the catch body is empty (not suppressing the error path, just protecting the
gesture). The spec itself mentions this exemption explicitly (I.W4 §Scope D1 caveat).

**settle() is startLoop():** `useSquareAnimations.ts:178-180` — `settle()` is a thin wrapper
around `startLoop()`. It works correctly because `reseat()` already SET the spring targets to
the dragged value; `startLoop` re-arms the loop to chase-to-rest at THOSE targets. The semantic
is correct but J should note that `settle()` has no explicit target-preservation logic of its
own — it relies on the caller's prior `reseat()` contract. A code reader who calls `settle()`
without a prior `reseat()` gets no spring-to-target guarantee from `settle()` alone.

**Magic timeouts in gate scripts:** `proof-drag-gesture.mjs:118` uses `waitForTimeout(900)` for
route-rest and `waitForTimeout(80)` for spring-settle polling. Both are bounded and justified
(the 80 ms is a polling bound for `spring.settled`, not a blind sleep).

---

## §3 — Gate oracle audit

### proof:drag-gesture (clause a + b)

**Clause (a) oracle:** Uses `page.mouse.down → move → up` (REAL CDP mouse events, not synthetic
dispatchEvent). Samples `body.is-dragging` AND `getComputedStyle(html/body).userSelect` MID-
gesture (the structural corroborator), plus `getSelection().toString()` AFTER. The dual-witness
dual-path design correctly handles the `setPointerCapture` artifact where a synthetic drag reads
0 chars but the structural test still bites. This satisfies the spec's born-RED-of-record clause
precisely.

**Clause (b) oracle:** Drags to a measured offset `{cx-90, cy+70}`, polls transform until
stable (≤12 × 80ms), asserts `transform ≠ identity`. Also asserts `Home` still recenters.
This is a well-formed behavioral oracle.

**Coverage gap (BOOK):** `DRAG_SURFACES` lists 4 scene surfaces (square, spring, sequence,
motion-path). Three surfaces that bypass the shared seam are NOT tested:
- `EasingCurveCanvas.vue` — inline `@pointerdown/@pointermove/@pointerup`; local scoped
  `user-select:none`; no `acquireSelectSuppression`. File: `EasingCurveCanvas.vue:12-15,370`.
- `PlaybackRibbon.vue` — `window.pointerup` handler; no select-suppression token. File:
  `PlaybackRibbon.vue:131`.
- `OrbitalDrag.vue` — `setPointerCapture` on container; local `user-select:none`. File:
  `OrbitalDrag.vue:331`. (setPointerCapture may partially contain pointer routing for text
  selection — but the surface still lacks the global token.)

These are EXPLICITLY outside D1's scope ("every drag surface that routes through the seam").
They represent the remaining B6-a latent class. J should disposition them.

**useDragCapture / "bezier handles" precision:** The impl doc (`I.W4.md:12`) says useDragCapture
covers "bezier handles." This is imprecise. `EasingCurveCanvas.vue` (the actual SVG bezier
handle component) does NOT use `useDragCapture`. The component using `useDragCapture` is
`AnimationVisualizer.vue` (the timeline progress ball). The "bezier handles" claim in the impl
doc is inaccurate — a BOOK item for documentation cleanup.

### proof:perf-frame-budget (clauses c + d)

**Clause (c) dock oracle:** 4× CDP throttle applied AFTER route rests (`openSceneThrottled`
applies throttle after 900ms wait). Samples 120 rAF intervals around a cursor-sweep hover that
arms the dock expand. `DOCK_DROPPED_CEIL = 2`. The glass-ui 3.9.0 dock measured 0 dropped at
4× locally per the impl doc. Born-RED 12/114 from b16. Oracle is honest.

**Clause (d) easing oracle — SPEC DEVIATION (threshold and throttle changed post-spec):**

The spec (`I.W4.md:241-252`) required clause (d) "under the **NAMED 4× CPU throttle**" with
`dropped ≤ 3`, born-RED witness **62 dropped under 4×**. The impl changed to `EASING_THROTTLE=1`
(unthrottled, the user's real experience) with born-RED witness 36 dropped unthrottled.

**Principled justification (impl doc):** The easing scene's glass-card `backdrop-filter`
re-composites as the ball sweeps; under 4× HEADLESS throttle that compositing is CPU-bound and
inflates drop counts by ~11–16 (a headless artifact). The gate-ORACLE precept says the oracle
should measure the product property the user experiences — 1× (real experience) is the correct
oracle; 4× on a headless VM over-penalizes for a host reason, not a product one.

**The born-RED still bites:** 36 dropped at 1× unthrottled DOES fail `≤ 3`. The change is NOT
a tune-to-pass.

**The J risk:** The 4×-headless future-regression path is now invisible. A future D4 regression
that only manifests under CPU throttle (say, 10 dropped at 4× vs 2 at 1×) would pass the gate.
J should assess whether a `≤ 3 at 1×` ceiling alone is sufficient as the ongoing oracle, or
whether a separate throttled observation (even if CI-exempt) should be retained.

**IN_CI observe-only (WZ `196ec2f`) — gate weakening concern (P1):**

Under `CI=true` / `GITHUB_ACTIONS=true`, both `budgetMiss` calls (clause c dock, clause d
easing) become `note()` — they do NOT add to `failures[]`. If glass-ui regresses the dock to
12 dropped frames again, CI passes. If D4 is somehow reverted or broken, CI passes. The gate
hard-gates LOCALLY (on-device) but has no CI enforcement path.

The rationale is sound (a CI VM's shared 2-core headless runtime drops frames for host reasons),
but the net effect is: **the wave's correctness gates for B8 have no CI enforcement beyond the
zero-error floor and structural checks (dock pill present, easing dot alive).** This is the
same posture as `proof:lighthouse-mobile` (CI-excluded entirely), but lighthouse is labeled as
such. Here the gate is labeled `proof:perf-frame-budget` and is part of `proof:correctness` —
a correctness gate that cannot hard-fail in CI for its primary clauses.

**Non-vacuity weakness for clause (d):** If `document.querySelector(".hero-ball, .track-ball")`
finds no element (wrong selector, component unmounted, class renamed), `moved.live = false` is
logged as a NOTE but the gate still proceeds to `sampleRafBest` and may pass with 0 dropped
frames (idle rAF). A static or missing dot would false-green. `scripts/proof-perf-frame-budget.mjs:385-387`.

---

## §4 — Gestalt transposition assessment

**D1 seam: correct scope, incomplete perimeter.** The fix installs the right seam concept (one
gestalt authority for "a gesture is in flight") and delivers it for the 4 gate-covered scene
surfaces + 3 useDragCapture surfaces (AnimationVisualizer, AssetViewport, AssetLayerPanel).
The remaining gap (EasingCurveCanvas, PlaybackRibbon, OrbitalDrag) is a coherent next step, not
a missed spec item.

**D4 rAF count:** `/easing` now has ONE composed driver (`useRafScene:225`). The easing gallery
(`useEasingGallery.ts`) uses `setTimeout` (not rAF) — this is correct and not a rAF-stacking
concern. The spec's "4-6 stacked rAF loops" concern is resolved.

**D3 seam: transposition at the right level.** The kf side did not patch glass-ui's CSS (honors
`feedback_glass_ui_root_changes`). The dock morph uses `--dock-morph-t @property` + clip-path
in 3.9.0 — this is the compositor-only path the spec's D3-a preferred. The coupling to I.W6
(the v3.8.0/3.9.0 pin) resolved cleanly in one publish.

**settle() semantic ambiguity (P2):** `settle()` == `startLoop()` (`useSquareAnimations.ts:178`).
The correct chase-to-rest behavior depends entirely on `reseat()` having been called with the
right target earlier. The semantic wrapper adds intent without adding a safety net — a future
refactor that calls `settle()` without a prior `reseat()` would produce the wrong behavior
silently. J could strengthen this by having `settle()` assert or log that spring targets are
non-zero, or rename `startLoop` to make the dependency visible.

---

## §5 — Fold candidates for J

| Item | Status in tree | Disposition |
|------|---------------|-------------|
| B6-a latent on EasingCurveCanvas (inline handlers, no token) | Open — local `user-select:none` only | FOLD J: route through `useDragCapture` or call `acquireSelectSuppression` |
| B6-a latent on PlaybackRibbon (raw `window.pointerup`, no token) | Open — no suppression | FOLD J: route through `useDragCapture` |
| B6-a latent on OrbitalDrag (container setPointerCapture, local select-none) | Partially mitigated by setPointerCapture | BOOK J: measure-first (setPointerCapture may be sufficient; verify live) |
| Impl doc imprecision: "bezier handles → useDragCapture" | `EasingCurveCanvas.vue` bypasses useDragCapture | BOOK J: documentation cleanup |
| IN_CI observe-only for clause (c/d): no CI hard enforcement of B8-regression | WZ `196ec2f` | BOOK J: on-device re-measure mandate; consider re-arm if CI runner improves |
| Clause (d) at 1× (user experience) vs 4× (spec): 4× regression-path invisible | Spec deviation, principled | BOOK J: consider adding a separate 4×-observed (non-gating) measurement for future regression signal |
| Non-vacuity for clause (d): static/absent dot passes silently | `proof-perf-frame-budget.mjs:385-387` | BOOK J: demote to FAIL when dot is not live |
| settle() as opaque startLoop wrapper | `useSquareAnimations.ts:178` | P2/BOOK J: add assertion or docstring clarifying the prior-reseat contract |
| `sampleRafBest` best-of-3 for easing: principled but adds 2 extra rAF windows (latency) | WZ `a775f6b` | RECORD — correctly trades measurement speed for robustness |
