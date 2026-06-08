# impl-w7-gate-mobile-single-page — the `proof:mobile-single-page` gate lane note

The gate-author record for the H.W7 §Hard gate clause **`proof:mobile-single-page`**
— the falsifiable, browser-gated, born-RED-today proof that the mobile
stack→overlay transposition (S1) lands: at 390×844 the SUBJECT stage is the
full-bleed background, opening the controls OVERLAYS it (no shift), both docks
stay affixed, and the detents are ≤70dvh (never full-height). The gate binds to
the owner's record in `impl-w7-overlay.md` (the §VERIFICATION SUMMARY facts).
tsc-clean; the gate is GREEN on the landed overlay+spring; NOT committed.

## THE GATE — `scripts/proof-mobile-single-page.mjs`

A sibling of `proof-stage-within-docks.mjs` (it REUSES that file's serveDist +
Playwright + FSM-settle plumbing — the §Hard gate's named harness idiom). FOUR
browser clauses + one static clause, each measuring an EXACT rendered geometry
fact the live stacked/CSS-eased mobile fails, swept over all 7 mode-classed
scenes (cube/amiga/square = subject · easing = editor · spring/sequence/
motion-path = storyboard):

| clause | what it asserts (390×844, sheet FORCED OPEN) | bite |
|---|---|---|
| **(a) full-bleed background** | the SUBJECT-class UNOCCLUDED visible stage fraction `clamp(sheet.top) − clamp(sceneHost.top)` ≥ 0.45·innerHeight AND host.bottom ≤ innerHeight. EDITOR/STORYBOARD are floor-EXEMPT (the curve/rows/path ARE the content) — but still asserted to OPEN as a real overlay (non-vacuity). | the live STACK evicts the stage to ~30px when the pane opens (frac ≈ 0.03 — measured, see below) |
| **(b) overlay, no shift** | toggling the sheet (a REAL `.sheet-grab-handle` click — the disjoint BLK-6 gesture surface) moves the scene-host rect by ±2px. SUBJECT class. | the stack evicts the stage from `1fr` to ~30px when the pane opens — a massive shift |
| **(c) both docks affixed** | the top dock + bottom menubar are `position: fixed`. | un-affix a dock → reds (locks inv δ ALREADY-SOTA scaffolding against the rebuild) |
| **(d) detents ≤70dvh** | `--sheet-detent-expanded` (resolved px) ≤ 0.70·innerHeight AND the open sheet's rendered height ≤ 0.70·innerHeight. UNIVERSAL (the ceiling applies to every class; only the floor (a) is subject-only). | restore the deleted near-full-viewport max-height → the detent exceeds 70dvh → reds |
| **static** | the `grid-rows-[auto_1fr_auto]` mobile stack is DELETED from `AnimationControlsGroup.vue` AND the mobile `@media (max-width:1023px)` rule makes `.stage-cell` `position:fixed; inset:0` (the stage left the grid). | re-introduce the stacked grid OR drop the fixed full-bleed stage → reds (comment-stripped, so a narrating doc-comment is not a usage) |

## WHY THE UNOCCLUDED MEASURE, NOT THE LAYOUT BOX (the HIGH-5 vacuity foreclosure)

A `fixed; inset:0` stage has full-height LAYOUT regardless of a covering sheet —
so a naïve `.scene-host` layout-height gate passes VACUOUSLY against any sheet.
The gate measures the UNOCCLUDED fraction = `clamp(sheet.top) − clamp(host.top)`
(the visible band between the stage's top inset and the sheet's top edge),
exactly the contract's "NOT the layout box." The detent ceiling (d) is the
independent cap that forecloses the inverse vacuity (a covering sheet that ate
the whole viewport would still pass (a)'s top-band measure if the sheet started
low — (d) caps the sheet height itself).

## THE MODE-CLASS IS READ PER SCENE — the 0.45 floor is SUBJECT-only

The gate reads the live `controls-pane--stage-<mode>` class (single-sourced in
`scenes.ts` `stageModeFor`, threaded App→EditorShell→AnimationControlsGroup→the
sheet) and ASSERTS it matches the scenes.ts STAGE_MODES expectation per scene (a
wrong class would mis-gate the floor). The 0.45 floor applies to `subject`
(cube/amiga/square) ALONE — measured frac **0.480**. The `editor`/`storyboard`
classes are EXEMPT (the contained content card IS the protagonist, not a
background to preserve): easing/spring open to the 70dvh ceiling (frac 0.141,
intentionally below the subject floor), which is exactly why the floor cannot be
universal — a uniform 0.45 floor would RED the editor scene that H.W5 promoted
the curve to stage. The exempt scenes are still asserted to OPEN + sit under the
ceiling (the non-vacuity guard).

## THE FORCED-OPEN HARNESS (the OPEN-NOTES requirement)

`impl-w7-overlay.md` §OPEN NOTES binds: the harness MUST force the controls pane
OPEN deterministically (a fresh load with no selection `v-show`-hides the sheet).
The gate: (1) pins the scene via an IN-PAGE hash assignment (NOT page.goto —
goto clears storage + the H.W1 reconcile trap), (2) polls the FSM to rest, (3)
re-asserts the 390×844 viewport (Playwright resets on navigate), (4) seeds the
control-options store under the scene's superKey with `isControlsPanelOpen:true`
+ a real `selectedAnimation` (the demo already seeds Cube→"Rotations"; else the
first dock-option name), (5) reloads to re-hydrate the seeded OPEN state so the
SpringProgress writes `--sheet-t`→1 (the expanded detent), (6) waits ≥900ms for
the <350ms spring to settle + the reflow. Clause (b) then drives a REAL
grab-handle click (a genuine UI transition through the disjoint gesture surface),
not a store poke, so the no-shift overlay is proven through the live path.

## MEASURED FACTS (live, 390×844 — the binding numbers the gate asserts GREEN)

- SUBJECT (cube/amiga/square): sheet.top **457**, host.top **52** → unoccluded
  visible **405px / 0.480 ≥ 0.45**; host.bottom **792 ≤ 844**. Expanded detent
  **305px = 0.361·vh ≤ 0.70**. Toggle host-rect shift **Δtop 0.0px, Δbottom
  0.0px** (a true overlay). Stage cell `position:fixed`. Both docks `fixed`.
- EDITOR (easing) / STORYBOARD (spring): open sheet **591px = 0.700·vh** (the
  `min(70dvh, …)` ceiling — at the boundary, inside the +0.005 tolerance);
  visible stage 0.141 (floor EXEMPT). sequence/motion-path open-peek 64px.

## BORN-RED — the gate BITES the stack + the full-height drawer (falsified)

Demonstrated, not asserted (inv ε):

- **static, stack:** the pre-W7 root class
  `grid grid-cols-1 grid-rows-[auto_1fr_auto] …` (H.W7.md §State :5) MATCHES the
  stack regex → RED; the landed source does NOT → GREEN.
- **static, stage:** an old grid-item `.stage-cell { grid-row: 2 }` (no
  fixed/inset) → both `position:fixed` + `inset:0` absent → RED.
- **browser (a)+(d):** injecting the live OLD STACK via `addStyleTag` (a 710px /
  84%-viewport sheet pinned to `top:78px`, covering the stage — the documented
  pre-W7 defect) drops the unoccluded fraction to **0.031** (clause (a) RED) and
  the sheet height to **0.841·vh** (clause (d) RED).

So no clause passes vacuously: each bites the EXACT stacked-CSS-eased geometry
the live tree exhibits before the overlay rebuild.

## NON-VACUITY GUARDS

A missing host (zero area), a missing dock band, or a v-show-hidden sheet FAILS
the clause (it cannot pass GREEN un-rendered). The mode-class mismatch fails
loudly. Under `KF_REQUIRE_BROWSER=1` (CI) a playwright-absent skip becomes a hard
fail — the geometry can never green-report un-exercised.

## WIRING

- `package.json`: `"proof:mobile-single-page": "node scripts/proof-mobile-single-page.mjs"`
  registered after `proof:stage-within-docks`; added to the `proof:all` chain in
  the same position.
- `.github/workflows/ci.yml`: the `proof:mobile-single-page` step in the
  `demo-smoke` job (after `proof:stage-within-docks`), `KF_REQUIRE_BROWSER: "1"`
  (a playwright-absent skip is a hard CI fail). `proof:ci-coverage` confirms the
  gate is covered (it does NOT appear in that gate's authored-but-unrun list).

## SCOPE — what this lane did NOT touch

This lane authored ONLY the gate + its wiring + this note. No engine, no demo
source, no glass-ui patch (the overlay+spring implementation landed in
`impl-w7-overlay.md`'s FILES CHANGED). The sibling W7 gates `proof:drawer-spring`
(S2 spring shape/settle/PRM) and `proof:dock-zorder` (S3 z-order/hit-test/
keep-open mutex) are OTHER lanes — out of scope here. tsc-clean (the lane touched
no TS); the gate is GREEN on the landed tree.
