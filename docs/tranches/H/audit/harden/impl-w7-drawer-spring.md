# impl-w7-drawer-spring — H.W7.S2 GATE LANE (`proof:drawer-spring`)

The gate-author's record of the lane that LOCKS the mobile bottom-sheet drawer as
the engine's OWN `SpringProgress` — never a CSS `grid-template-rows`/height ease.
Composes with the overlay lane (impl-w7-overlay.md, the binding note this gate
binds to): that lane SHIPPED `useSheetSpring` + the sheet rewrite; THIS lane
authors the falsifiable, re-runnable, browser-gated proof that the sheet motion
IS the spring (S2 / inv ζ). **NOT committed.** tsc-clean (exit 0).
`proof:ci-coverage` GREEN (92/92 gates invoked in CI). Born-RED witnessed on the
pre-overlay CSS ease; GREEN on the landed SpringProgress sheet.

## THE LANE — `proof:drawer-spring` (the §Hard-gate `proof:drawer-spring (a)/(b)/(c)` set)

`scripts/proof-drawer-spring.mjs` — one STATIC clause that always runs + two
BROWSER clauses (serveDist + Playwright @390×844, the shared
`proof-stage-within-docks`/`proof-scene-machine-irrefragable` plumbing + the
`KF_REQUIRE_BROWSER` skipOrFail). Each clause BITES the EXACT pre-overlay defect.

### (a) NO CSS HEIGHT/grid-template-rows/transform TRANSITION (static · WV-W7-HIGH-1 SCOPE + WV-W7-LOW-2)

A grep-gate SCOPED to the sheet file `ControlsPaneWrapper.vue` ONLY. The `<style>`
block is comment-STRIPPED first (so the doc-comments that NARRATE the deletion —
"the 550ms CSS `grid-template-rows` ease is DELETED" — are not mistaken for live
survivors), then every `transition[-property]:` declaration's property list is
inspected for the sheet's MOTION axis: `height`, `grid-template-rows`,
`transform`, or the catch-all `all`. Word-boundary matched so `transform` does
NOT trip `transform-origin` and `height` does NOT trip `max-height` (the static
`max-height: var(--sheet-detent-expanded)` detent cap is NOT an animated axis).

- **The opacity-axis transitions are ALLOWED** — the desktop idle-fade
  (`transition: opacity …`) + the open/close fade + `transition: none` (the PRM
  guard) are not the height/position axis the spring owns. The gate passes them.
- **The scoping is the binding finding:** `AnimationControlsControls.vue:318`
  carries `transition: grid-template-rows … ` on its `.panel-row` crossfade — the
  ALREADY-SOTA W3-PRESERVED control-detail animation. An unscoped whole-repo grep
  would red on it FOREVER (or pressure deleting SOTA). The gate is scoped to the
  ONE sheet file, so it never sees it. `demo/app/dist/*` (the built bundle, which
  also carries the matched strings) is excluded by construction — the gate reads
  SOURCE, never `dist/`.
- **The non-vacuity belt:** a second static clause asserts `useSheetSpring(…)` is
  wired AND `--sheet-t` is read in the sheet file — so deleting the CSS ease AND
  the spring together (leaving a motionless sheet that passes (a) trivially) reds.

**BITE (witnessed):** re-injecting `transition: grid-template-rows 0.55s
cubic-bezier(0.4,0,0.2,1), height 0.55s ease` into the mobile
`.controls-pane-wrapper` rule reds — flagging BOTH the `grid-template-rows` and
`height` axes by name. Reverted byte-identical.

### (b) SPRING SHAPE + FAST SETTLE (browser · the born-RED anchor)

A live runtime probe of the REAL `.controls-pane-wrapper`'s `--sheet-t` custom
property — the value `useSheetSpring`'s `SpringProgress` writes each frame —
sampled per `requestAnimationFrame` while the sheet is driven by a TRUSTED click
on the real `.sheet-grab-handle` (the BLK-6 gesture surface; the same path a
user's swipe takes, never a synthetic store flip). Two assertions, both measured
FROM THE FIRST FRAME OF MOTION (click-dispatch latency excluded):

- **SETTLE** — first-motion → within `0.01` of terminal (≈1px on the detent
  range) is `< 350ms`. Measured **171–176ms** across runs — the response 0.3 / ζ
  0.8 instance, well inside budget. The contract's forbidden alternatives both
  bust it: the 550ms CSS ramp and the response-0.5 `--spring-snappy` (≈401ms).
- **SHAPE** — the trace OVERSHOOTS its terminal (peaks past it before ringing
  back) by **≥0.004** (measured **0.0151** — a min −0.0151 undershoot on a close,
  a max 1.0151 overshoot on an open). This is the ζ<1 underdamped signature: a
  monotone `cubic-bezier(0.4,0,0.2,1)` ease is monotone-to-terminal and NEVER
  exceeds it. The overshoot bite is what distinguishes a genuine live
  `SpringProgress` from any eased ramp — direction-agnostic (the analyze derives
  overshoot in the direction of travel, so a close 1→0 and an open 0→1 both pass).

**BITE (witnessed against a standalone CSS-ease fixture replicating the pre-overlay
drawer — `transition: --sheet-t 0.55s cubic-bezier(0.4,0,0.2,1)`):** settle
**438ms ≥ 350ms** → RED; overshoot **0.0000 < 0.004** → RED. The probe genuinely
distinguishes the CSS ease from the spring.

### (c) PRM SINGLE-FRAME SNAP (browser)

Under `prefers-reduced-motion: reduce` (Playwright `emulateMedia`), driving the
sheet snaps `--sheet-t` to terminal in a SINGLE frame — ZERO intermediate frames
between start and terminal. This is the engine's `respectReducedMotion: true` →
`_snapSettled()` path (spring.ts:271 — one emit, no loop). A `matchMedia` guard
confirms the emulation engaged before asserting (no vacuous green if `emulateMedia`
silently no-ops); a start≠terminal guard confirms the sheet actually changed state.

**BITE (witnessed against the CSS-ease fixture):** the CSS ease ignores PRM →
**56 intermediate frames** under reduced-motion → RED. Locks
`respectReducedMotion: true` on the sheet's own spring.

## THE OPEN-STATE SEED (the harness binding from impl-w7-overlay.md §OPEN NOTES)

A fresh `#/cube` load with no selection `v-show`-HIDES the sheet
(`v-show="storedControls.selectedAnimation && …"`). The probe FORCES it open
deterministically: settle on `#/cube` via an IN-PAGE hash assignment (storage +
the H.W1 reconcile trap survive — `page.goto` clears both), re-assert the 390×844
viewport, then seed the cube superKey (`"Cube"`) `selectedAnimation` ("Rotations")
+ `isControlsPanelOpen` in the `animation-groups-control-options-store`, and wait
for `.controls-pane-wrapper` + `.sheet-grab-handle` to mount before probing.
Clause (b) seeds the pane and lets the handle-click drive the motion (whichever
direction the FSM-default open-state yields — the overshoot is direction-agnostic);
clause (c) seeds the same and asserts the single-frame snap under PRM.

## WIRING

- **package.json** — `"proof:drawer-spring": "node scripts/proof-drawer-spring.mjs"`
  (after `proof:scene-machine-irrefragable`); appended to the `proof:all` chain
  (after `proof:scene-machine-irrefragable`, before `proof:idioms`).
- **ci.yml** — a `KF_REQUIRE_BROWSER: "1"` step right after
  `proof:mobile-single-page` (the two H.W7 lane gates co-located — F1+F2 are one
  rebuild). Under `KF_REQUIRE_BROWSER` a playwright-absent skip becomes a hard CI
  fail, so the spring-shape/PRM facts are never green-reported un-exercised.
- **proof:ci-coverage** — GREEN: all 92 `proof:*` gates (incl. this one) are
  invoked in CI.

## FILES CHANGED (this lane)

- `scripts/proof-drawer-spring.mjs` — NEW. The gate.
- `package.json` — the `proof:drawer-spring` script + the `proof:all` chain entry.
- `.github/workflows/ci.yml` — the CI step (KF_REQUIRE_BROWSER).
- `docs/tranches/H/audit/harden/impl-w7-drawer-spring.md` — this note.

(NO source touched — the gate observes the overlay lane's `ControlsPaneWrapper.vue`
+ `useSheetSpring.ts`; it never modifies them.)

## VERIFICATION SUMMARY (live, 390×844)

- **(a) static** — PASS: no `transition` on the sheet's
  height/grid-template-rows/transform axis in `ControlsPaneWrapper.vue`
  (comment-stripped, scoped); `useSheetSpring`/`--sheet-t` wired. BITE proven on a
  re-injected 0.55s ease (reverted byte-identical).
- **(b) settle/shape** — PASS: settle **171–176ms** < 350ms; overshoot **0.0151**
  (the ζ=0.8 ring). BITE proven on a CSS-ease fixture (438ms, overshoot 0).
- **(c) PRM** — PASS: single-frame snap, **0** intermediate frames under
  reduced-motion. BITE proven on the CSS-ease fixture (56 PRM frames).
- skip-path graceful (static runs, browser `○ skips`) when playwright is absent;
  hard-fails under `KF_REQUIRE_BROWSER`. tsc exit 0. `proof:ci-coverage` GREEN.

## NOTES FOR THE OTHER H.W7 LANES / W8

- The drawer-spring grep clause (a) is SCOPED to `ControlsPaneWrapper.vue` and
  EXCLUDES `AnimationControlsControls.vue`'s `.panel-row` crossfade + `dist/` (the
  exact scoping H.W7.md §Hard gate (a) names). Do NOT broaden it to a whole-repo
  grep — it would red on the preserved SOTA crossfade.
- The settle/overshoot thresholds (`SETTLE_BUDGET_MS=350`, `SETTLE_EPS=0.01`,
  `MIN_OVERSHOOT=0.004`) are named constants at the top of the script. The 0.0151
  measured overshoot has ~3.8× headroom over the 0.004 floor; the 171–176ms settle
  has ~2× headroom under 350ms — a real regression (a CSS ease, a slower spring
  instance, a PRM bypass) reds without flapping on measurement jitter.
- The engine review note in impl-w7-overlay.md flags a latent PRM one-emit pattern
  in `useSceneSwap` (it uses `play((v)=>…)` only). This gate's clause (c) confirms
  `useSheetSpring` does NOT carry that bug — it wires BOTH `subscribe(write)` AND
  `play(write)`, so the `_snapSettled` PRM emit reaches `--sheet-t`. The
  single-frame-snap GREEN is the live proof of that double-wire fix.
