# impl-w7-verify — H.W7 VERIFY LANE (builds · tests · gates · BITE)

The VERIFY-lane record for H.W7 (the mobile stack→overlay transposition + the
SpringProgress springy drawer). This lane ran NO source edits except the two
TEMPORARY, byte-restored BITE injections (each reverted exactly). It runs the
build/test pipeline, the three NEW H.W7 browser gates under
`KF_REQUIRE_BROWSER=1` @390×844, `proof:ci-coverage`, the NO-regression set
(W10/W11/W12 + the desktop overlay model), and the two BITE checks the contract
names. **NOT committed.** Result: ALL GREEN; both bites witnessed RED; source
restored byte-identical (tsc 0, diff stats unchanged).

## (1)–(3) BUILD / TEST / BUILD PIPELINE

| step | command | result |
|---|---|---|
| (1) typecheck | `npx tsc --noEmit` | **exit 0** (clean) |
| (2) tests | `npm test -- --run` | **exit 0** — Test Files **68 passed (68)**; Tests **682 passed \| 2 expected fail (684)**. No size-ceiling update needed (no test asserts a ceiling that moved). |
| (3) demo build | `npm run gh-pages` | **exit 0** — `built in 1.31s`. Only pre-existing rolldown notes (the `@vueuse/core` `/* #__PURE__ */` INVALID_ANNOTATION, the monaco >500kB chunk-size warning, the INEFFECTIVE_DYNAMIC_IMPORT on CubeScene/engine) — all PRE-EXISTING, not errors, not introduced by W7. |

`npm test` verbatim tail: `Test Files  68 passed (68)` · `Tests  682 passed | 2
expected fail (684)`.

## (4) THE NEW H.W7 GATES — `KF_REQUIRE_BROWSER=1` @390×844 (Playwright present; chromium installed)

| gate | result | the binding measured facts |
|---|---|---|
| `proof:mobile-single-page` | **GREEN (exit 0)** | SUBJECT (cube/amiga/square) UNOCCLUDED visible fraction **0.480 ≥ 0.45** (sheet.top 457 − host.top 52 = 405px of 844); host.bottom 792 ≤ 844. Toggle host-rect shift **Δtop 0.0px, Δbottom 0.0px** (overlay, no displacement). Expanded detent 305px = 0.361·vh ≤ 0.70 (subject). EDITOR (easing) / STORYBOARD (spring/sequence/path) floor-EXEMPT, asserted to open under the 70dvh ceiling (591px = 0.700·vh). Both docks `position:fixed`. Static: the `grid-rows-[auto_1fr_auto]` stack DELETED + `.stage-cell{position:fixed;inset:0}` present. All 7 mode-classed scenes swept. |
| `proof:drawer-spring` | **GREEN (exit 0)** | Static: NO `transition` on the sheet's height/grid-template-rows/transform axis in `ControlsPaneWrapper.vue` (comment-stripped, scoped); `useSheetSpring`/`--sheet-t` wired. (b) settle **178ms < 350ms**; overshoot **0.0152** (the ζ=0.8 underdamped ring — a monotone cubic-bezier never exceeds terminal). (c) PRM single-frame snap (0 intermediate frames). |
| `proof:dock-zorder` | **GREEN (exit 0)** | z-order strictly ascending **stage z(10) < sheet z(20) < both docks z(40)**. Dock hit-test: top band 1/1 + bottom band 4/4 in-viewport painted interactive centers resolve to the dock. The OPEN sheet does not steal the menubar's pointer (4/4 menubar centers hit the dock). LOW-1: fixed stage rect == viewport (0,0 390×844 ±2px), ZERO transform/contain/perspective/filter/will-change ancestors. Keep-open mutex: across a 3.5s collapse-delay window with the sheet OPEN, menubarTop / sheetTop / sheetBottom UNSHIFTED (±0px) — owned by the bottom menubar's `always-expanded` (the keepOpen call is a structural no-op, per impl-w7-dock-zorder §A; the gate asserts the MEASURED invariant). |

## (5) `proof:ci-coverage`

**GREEN (exit 0)** — all **93** `proof:*` gates invoked in CI (4 recorded
exclusions); the three new H.W7 gates (`proof:mobile-single-page`,
`proof:drawer-spring`, `proof:dock-zorder`) are each present in the CI workflow.
Version-literal, registry-glass-ui (no `file:` glass-ui clone), and concurrency
hygiene clauses all PASS.

## (6) NO REGRESSION — W10/W11/W12 + the DESKTOP overlay model (same component)

The mobile change must not break desktop; the desktop overlay model is the SAME
component (`AnimationControlsGroup.vue` + `ControlsPaneWrapper.vue`), so desktop
unchanged is confirmed by the desktop-asserting gates below.

| gate | result |
|---|---|
| `proof:scene-machine-irrefragable` | **GREEN** — the one FSM holds (H.W1 keystone). |
| `proof:scene-control-dfa` | **GREEN** — every scene renders EXACTLY its DFA control-surface set; the (scene→scene) matrix is total (W11 S4 / I2). |
| `proof:stage-glass-card` | **GREEN** — the four stage scenes resolve ONE standard non-cartoon glass `<Card>` (W11 I5). |
| `proof:scene-parity` | **GREEN** — starting-style merged; survivors {spring, sequence, motion-path}; `springLinearStops()` in ONE composable; every mode pointer-interactive. |
| `proof:demo-shell-grid` | **GREEN** — ONE named rail·stage·rail grid, ONE `--rail-width` token (the desktop grid is intact; the mobile change did NOT break desktop). |
| `proof:demo-console-clean` | **GREEN** — the H-A1 serializeEasing crash dead (H.W0). |
| `proof:scene-uses-standard-ribbon` | **GREEN** — easing + spring mount the STANDARD PlaybackRibbon (the desktop overlay model is the same component — desktop unchanged). |
| `proof:stage-within-docks` | **GREEN** — the subjects contained within the affixed dock bands at 1280/1440/mobile; the G8 `.stage-cell` `padding-block` reserve REUSED by the mobile fixed layer (DRY). |
| `proof:demo-no-oversize` | **GREEN** — every demo file ≤500L (the W7 colocated `useSheetGesture`/`useSheetSpring` split kept `ControlsPaneWrapper.vue` 490L + `AnimationControlsGroup.vue` 488L under the ceiling). New composables: `useSheetSpring.ts` 69L, `useSheetGesture.ts` 88L. |
| `proof:composable-encapsulation` | **GREEN** — the new gesture/spring engines live in composables; pure store getters; Target projection-math-free (W12 S2/I9). |

## BITE (the contract's MUST-bite proof — witnessed RED, restored byte-identical)

- **BITE 1 — revert the SpringProgress sheet to the CSS grid-rows ease →
  `proof:drawer-spring` REDS.** Injected
  `transition: grid-template-rows 0.55s cubic-bezier(0.4,0,0.2,1), height 0.55s ease`
  into the mobile `.controls-pane-wrapper` rule in `ControlsPaneWrapper.vue`. The
  static clause RED'd, flagging BOTH axes by name:
  `[height] … · [grid-template-rows] …` → `FAIL (1)` (exit non-zero). Restored to
  the W7 working-tree version (490L; diff-stat 282 unchanged; tsc 0); re-ran →
  GREEN.
- **BITE 2 — revert the fixed full-bleed stage to the mobile stack →
  `proof:mobile-single-page` REDS.** Removed `position: fixed; inset: 0` from the
  mobile `@media (max-width:1023px)` `.stage-cell` block in
  `AnimationControlsGroup.vue`. The static clause RED'd:
  `the mobile .stage-cell must be position: fixed; inset: 0 (found
  position:fixed=false, inset:0=false)` → `FAIL (1)`. Restored byte-identical
  (the exact inverse edit; diff-stat 113 unchanged; tsc 0); re-ran → GREEN.
  - **DIAGNOSIS (a RED-that-stay-GREEN, expected & correct):** during BITE 2 the
    BROWSER clauses of `proof:mobile-single-page` still reported `position:fixed`
    GREEN — because the browser clauses serve `dist/` (NOT rebuilt during the
    bite), while the STATIC clause reads SOURCE (the mutated working tree). The
    static clause is the one designed to bite a SOURCE revert, and it did. This
    is the correct division of labour, not a gate hole: a source-only regression
    is caught statically without needing a rebuild; a built regression would be
    caught by the browser clauses against a fresh `dist`. After restore + the
    final clean re-run (against the W7 dist), all clauses GREEN. No genuine
    RED-that-should-be-GREEN was found.

After both bites + restore: `git diff --stat HEAD` shows the W7 files UNCHANGED
from their landed state (`AnimationControlsGroup.vue` 113, `ControlsPaneWrapper.vue`
282); tsc exit 0; the three gates GREEN.

## MEASURE-FIRST NUMBERS (live, 390×844 — the binding facts)

- **settle:** **178ms** (171–178 across runs) < 350ms budget. ~2× headroom. The
  response-0.3/ζ-0.8 instance — NOT the 550ms CSS ramp, NOT the response-0.5
  `--spring-snappy` (≈401ms, which would FAIL).
- **spring shape (overshoot):** **0.0152** past terminal (the ζ=0.8 underdamped
  ring) — ~3.8× headroom over the 0.004 floor. A monotone cubic-bezier ease is
  monotone-to-terminal and never overshoots.
- **PRM:** single-frame snap, **0** intermediate frames under
  `prefers-reduced-motion: reduce` (the engine's `respectReducedMotion`
  `_snapSettled` — one emit).
- **visible stage fraction (subject):** **0.480** ≥ 0.45 (405px of 844;
  sheet.top 457 − host.top 52).
- **overlay no-shift:** Δtop **0.0px**, Δbottom **0.0px** on a real grab-handle
  toggle (the BLK-6 disjoint gesture surface).
- **detents:** subject expanded 305px = 0.361·vh; editor/storyboard expanded
  591px = 0.700·vh — both ≤ 70dvh (never full-height).
- **z-order:** stage z(10) < sheet z(20) < both docks z(40), strictly ascending;
  8/8 dock-button centers + 4/4 menubar centers hit the dock; fixed stage rect ==
  viewport, zero fixed-CB ancestors.

## CONFIRMED @390×844 (the contract's live confirmation, asserted falsifiably by the gates)

- the SUBJECT stage (cube/amiga/square) is the **full-bleed FIXED background**
  (0.480 unoccluded ≥ 0.45) the controls sheet overlays — not a 30px sliver;
- the sheet overlays via the **dedicated grab handle** (BLK-6 disjoint gesture
  surface) and **springs** (settle 178ms, overshoot 0.0152, PRM single-frame
  snap) — NOT a CSS grid-rows ease;
- the **docks are not occluded** — both `position:fixed`, z-dock(40) above the
  fixed stage z(10) + sheet z(20); every dock-button + menubar center hit-tests
  to the dock;
- the **editor-as-content (easing)** + **storyboard (sequence/path/spring)**
  modes reconcile with the W11 glass cards — the mode-class is read per scene
  (`controls-pane--stage-{subject|editor|storyboard}`, single-sourced in
  `scenes.ts` `stageModeFor`); the 0.45 floor applies to subject ALONE; the
  contained content card is preserved for editor/storyboard (they open to the
  70dvh ceiling, floor-exempt).

## ENVIRONMENT

- Playwright installed (`node_modules/playwright` + chromium-1224 in the
  ms-playwright cache); `KF_REQUIRE_BROWSER=1` exercised the browser clauses (a
  skip would have HARD-failed — it did not).
- Branch `tranche-h-impl`; W7 work is uncommitted working-tree (per the DO-NOT-
  commit precept). dist/gh-pages is the clean W7 build (05:45, not rebuilt during
  the bites). NO `git commit`.
