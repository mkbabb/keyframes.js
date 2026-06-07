# hd-live-mobile — DEEP harden (Tranche H · H.W7 mobile overlay + springy drawer)

**Lane charge:** LIVE re-verify D10/D13 at 390×844 — does the stage displace to ~30px when the
controls open? Measure the drawer transition (550ms CSS?). Screenshot mobile home + cube-open.
Confirm the born-RED in H.W7.

**Method:** live demo at localhost:5173 (kf 4.1.0 + Tranche G), Playwright MCP at 390×844; source
verified against the on-disk tree; cross-repo APIs checked in `src/animation/` + `node_modules`.

**Tooling caveat (affects nobody's verdict, recorded for reproducibility):** the MCP Playwright
session spontaneously reverts the viewport to 1440×900 on a short cadence and intermittently drifts
the hash-route back to `#/` / `#/amiga`. Reliable 390-wide reads survive only in a tight window
immediately after `browser_resize` with NO intervening navigate and NO long (>700ms) async eval.
The mobile-open geometry below was captured inside one such window (`innerW:390, matchMobile:true`
asserted in the same eval); the panel was opened by mutating the live reactive
`storedControls.isControlsPanelOpen` on the `AnimationControlsGroup` instance (the dock toggle is
flaky — the known dock double-click / summary-collapse quirk), which is functionally identical to
the user click.

---

## VERDICT

**D10 (mobile stack starves the stage) and D13 (550ms CSS drawer) are both REAL and live-reproduced.
H.W7's architecture (delete the mobile stack → full-bleed fixed stage + SpringProgress bottom sheet)
is SOUND and every API it depends on EXISTS.** The wave is implementable. BUT three authoring defects
will bite at implementation time: (1) HIGH — the `proof:drawer-spring (a)` grep-gate is over-broad and
**cannot go green as written** (an unrelated source occurrence survives the fix); (2) MED — the cited
live evidence number (`height=30`) is STALE: the cube stage live-measures **185px / 0.219·vh**, not 30px
(the gate threshold still bites, so the gate is safe — but the §State evidence is wrong); (3) MED — the
scope cites `editor-shell/ControlsPaneWrapper.vue` but the file lives at
`animation-controls/components/ControlsPaneWrapper.vue` (every `:line` anchor is otherwise correct).
Plus 2 LOW / 2 NIT. No BLOCKER.

---

## FINDINGS

### F1 — HIGH — `proof:drawer-spring (a)` grep-gate is over-broad; cannot go GREEN as written
- **Loc:** `H.W7.md` §Hard gate, `proof:drawer-spring (a)` (`:43`); §Folds restate it (`:53`).
- **Defect:** the gate is specified as "Grep-gate: no `transition:.*grid-template-rows` … survives in
  source." A repo-wide grep for that pattern over `demo/**/*.{vue,css}` (excluding the untracked
  `demo/app/dist/` build artifact) matches **three** source sites, not just the drawer's two:
  - `ControlsPaneWrapper.vue:149` — `transition: grid-template-rows var(--duration-panel) var(--ease-out)` (drawer OPEN — the delete target) ✓
  - `ControlsPaneWrapper.vue:154` — `transition: grid-template-rows var(--duration-panel) var(--ease-standard)` (drawer CLOSED — the delete target) ✓
  - **`AnimationControlsControls.vue:295`** — `transition: grid-template-rows var(--duration-normal) var(--ease-standard)` on `.panel-row` (the Controls↔cubic-bezier/steps detail-panel crossfade, `0fr↔1fr`). This is a SEPARATE component H.W7 does NOT touch and MUST NOT delete (verified context at `:289-302`: "Collapsible panel rows … animates height via grid-template-rows").
  So after H.W7 deletes the two drawer sites, the `AnimationControlsControls.vue:295` occurrence
  **survives** and a repo-wide `transition:.*grid-template-rows` grep **stays RED forever** — the wave's
  own completion gate can never pass. Additionally, an unscoped working-tree grep also matches the
  built `demo/app/dist/assets/*.css` bundle (present on disk, git-untracked) — a second false-positive
  source.
- **Fix (doc edit, §Hard gate `proof:drawer-spring (a)`):** scope the grep to the sheet's own file, not
  the repo. Replace "no `transition:.*grid-template-rows` … survives in source" with: "no
  `transition` on the sheet's height/transform axis survives **in `ControlsPaneWrapper.vue` (or the new
  sheet component)** — assert `grep -L 'transition.*grid-template-rows' <sheet-file>` is empty AND the
  whole-repo grep, **scoped to source (exclude `demo/app/dist/`) and EXCLUDING
  `AnimationControlsControls.vue` (the unrelated `.panel-row` detail-panel crossfade, NOT the mobile
  drawer — out of H.W7 scope)**, returns only the (now-deleted) sheet sites." Add a one-line carve-out
  note so the runner does not over-reach into the detail-panel motion.

### F2 — MED — §State "verified" stage height is STALE (`30px` cited; `185px` live)
- **Loc:** `H.W7.md` §The state, verified (`:14`); the gate evidence in `proof:mobile-single-page (a)`
  (`:39` — "reds TODAY (live `height=30`, `bottom=818`)") and §Mandate bar (`:47`); provenance
  `a-mobile-architecture.md:111-116`.
- **Defect:** the wave asserts the live state at 390×844 with the pane OPEN is `.scene-host` rect
  `0, 788, 390, 30` (**30px tall, the cube parked entirely below the fold, zero cube visible**). Live
  re-measure (cube scene, `Rotations`, pane open, `innerW:390 / matchMobile:true` asserted same eval):
  - `.controls-layout` `grid-template-rows: 607px 185px 0px` (row1 pane / row2 stage / row3 teleport)
  - `.controls-pane-wrapper` y=78, **h=555**, bottom=633
  - `.scene-host` y=**633**, **h=185**, bottom=818 → **0.219·innerHeight (21.9%)**, NOT 30px / not below the fold.
  The structural defect is REAL and exactly the predicted mechanism (the open `auto`/`1fr` stack
  starves the `1fr` stage), but the cube IS partially visible in a 185px band at the bottom, contradicting
  "the screenshot shows ZERO cube" and the `height=30` figure. The discrepancy is most likely because
  the audit measured a different scene's `.scene-host` (or a pre-Tranche-G work-area state); the cube
  scene's stage today is 185px.
- **Why it matters / why it is NOT a BLOCKER:** the gate threshold `proof:mobile-single-page (a)` is
  `height >= 0.45·innerHeight`. At the true 185px (0.219) the gate STILL reds today and STILL greens on
  the overlay rebuild — so the gate BITES correctly regardless. Only the *evidence narration* is wrong.
- **Fix (doc edit):** update §State `:14` and the `proof:mobile-single-page (a)` BITE clause `:39` to the
  measured figure: "live `.scene-host` ≈ `0, 633, 390, 185` (0.219·vh, the stage starved to a ~185px
  bottom band; the cube is partially visible but far below the 0.45 floor)"; drop "ZERO cube" / "30px /
  parked below the fold," or re-anchor the 30px reading to the exact scene+state the audit captured it on.

### F3 — MED — scope cites the wrong directory for `ControlsPaneWrapper.vue`
- **Loc:** `H.W7.md` header §Scope line (the parenthetical scope) + §State `:17,:18` + §Scope S1 (`:29`,
  the `:215-219` cap) — all write `editor-shell/ControlsPaneWrapper.vue`.
- **Defect:** the file is at `demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue`,
  NOT `…/editor-shell/`. The `editor-shell/` directory exists (EditorShell/EditorHeader/etc.) but does
  not contain this wrapper. Every cited `:line` anchor inside the file is CORRECT (the
  `transition: grid-template-rows var(--duration-panel)` IS at `:147-155`; the
  `max-width: min(440px, 100dvw)` cap IS the `:216-220` rule block, ~`:217`), so this is a path typo, not
  a content error — but an implementer following the path will not find the file.
- **Fix (doc edit):** replace every `editor-shell/ControlsPaneWrapper.vue` with
  `animation-controls/components/ControlsPaneWrapper.vue`. (`StartingStyleTarget.vue` likewise lives at
  `demo/spring/StartingStyleTarget.vue`; the `:94-99` springLinearStops anchor is correct.)

### F4 — LOW — the 550ms-CSS / 0.55s drawer claim is CONFIRMED; one easing token is mis-attributed
- **Loc:** `H.W7.md` §State `:17`.
- **Verified TRUE:** `--duration-panel` resolves live to `0.55s`; the wrapper carries
  `transition: grid-template-rows 0.55s …` on `grid-template-rows: 0fr ↔ 1fr` (`ControlsPaneWrapper.vue:147-155`).
  D13 (the demo's most-visible structural motion is a hand-rolled 550ms CSS ease, not a spring) is REAL.
- **Defect (minor):** §State `:17` says the live computed easing is `cubic-bezier(0.4, 0, 0.2, 1)`. That is
  the CLOSED-state easing (`--ease-standard`, `:154`). The OPEN-state transition uses `--ease-out` =
  `cubic-bezier(0, 0, 0.2, 1)` (`:149`). The doc cites the close curve as if it were the open curve.
- **Fix:** note both — "open: `…var(--ease-out)`=cubic-bezier(0,0,0.2,1); close: `…var(--ease-standard)`=
  cubic-bezier(0.4,0,0.2,1)" — or drop the specific bezier and keep "a 0.55s CSS ease."

### F5 — LOW — `--spring-snappy: var(--spring-smooth)` alias claim CONFIRMED (no edit needed; recorded)
- **Loc:** `H.W7.md` §State `:20` ("`style.css:147`: `--spring-snappy: var(--spring-smooth)`").
- **Verified TRUE:** `style.css:147` is literally `--spring-snappy: var(--spring-smooth);` (the comment at
  `:133-146` documents the D.W11 deletion of the demo's own `springLinearStops({response:0.35,
  dampingFraction:0.65})` emission). Live both tokens resolve to byte-identical `linear()` stops via the
  alias. The "foreign token / self-defeating omission" narrative is accurate. No edit. (Recorded because
  the first consistency pass could not check the live computed value — it is verified here.)

### F6 — NIT — every spring API H.W7 depends on EXISTS and matches (feasibility GREEN; recorded)
- `SpringProgress` — `src/animation/spring.ts` (exported); constructed `new SpringProgress({ respectReducedMotion: true })` at `useSceneSwap.ts:45`. ✓
- `respectReducedMotion` option — `src/animation/spring.ts` SpringProgressOptions (the cited `spring.ts:43` is the field, default `false`; the snap-to-terminal-under-PRM behavior is real). ✓ The wave's "`spring.ts:43`" anchor lands on the option definition — accurate.
- `springLinearStops` — `src/animation/springLinearStops.ts:46` (exported); `StartingStyleTarget.vue:94-99` dogfoods it exactly as cited (`springCss = springLinearStops({response, dampingFraction})`). ✓
- z-tokens — `style.css:25,27`: `--z-controls: 20`, `--z-dock: 40`. A `fixed` stage at z<20 sits below both docks → `proof:dock-zorder` (stage z strictly < `z-dock`) is structurally satisfiable. ✓
- `useSheetSpring` mirroring `useSceneSwap.ts:45-50` is feasible. **One real shape note (NIT):** the actual
  `useSceneSwap` API is `spring.reset(0)` → `spring.play(cb)` → `spring.target = 1` (`:47-49`), and it
  constructs the spring ONLY in the `!vtOwnsMotion` branch (View-Transitions fallback). A drawer is not a
  VT swap, so `useSheetSpring` must construct the spring UNCONDITIONALLY (no `supportsViewTransitions`
  guard). H.W7 S2 (`:31`) says "mirrors `useSceneSwap.ts:45-50`" — fine, but the implementer should NOT
  copy the `if (!vtOwnsMotion)` guard. Optional one-line clarification in S2.

### F7 — NIT — "the ONLY major motion still on a hand-rolled CSS curve" slightly overstated
- **Loc:** `H.W7.md` §State `:17`; §Design decisions `:61`.
- The drawer is one of (at least) two source `transition: grid-template-rows` CSS eases — see F1
  (`AnimationControlsControls.vue:295` `.panel-row`). The `.panel-row` is a minor detail-panel crossfade,
  not a "major structural motion," so the claim is defensible as written, but "ONLY" is literally false.
  Soften to "the only major *structural* motion" or note the `.panel-row` as a deliberate out-of-scope
  exception (ties to F1's grep carve-out).

---

## Screenshots captured
- `/Users/mkbabb/Programming/keyframes.js/docs/tranches/H/audit/harden/assets/hd-mobile-cube-closed.png` — cube scene, controls CLOSED:
  cube full-bleed as the background, top dock ("Cube") + bottom menubar ("Rotations" · reset/clear/play)
  both affixed. This is effectively the desired end-state for the CLOSED case (the defect is the OPEN
  case). (Captured-canvas is wider than 390 due to the MCP screenshot-canvas quirk; the LAYOUT measured
  390/mobile via getBoundingClientRect inside the same session.)
- Mobile cube-OPEN screenshot: NOT reliably capturable — the session reverts viewport to 1440 before the
  screenshot fires (see Tooling caveat). The open-state DEFECT is instead captured numerically
  (F2: rows `607px 185px 0px`, stage 185px @ y=633). The eventual `proof:visual-lock` (H.W8) will own the
  pixel-lock screenshot in a stable runner.

## Born-RED confirmation (the wave's §Mandate bar)
- `proof:mobile-single-page (a)` (stage `height >= 0.45·innerHeight`): **born-RED CONFIRMED** — live
  stage is 0.219·vh (185px) < 0.45. Greens on the full-bleed fixed stage. (Threshold is safe despite the
  stale `30px` evidence — F2.)
- `proof:mobile-single-page (b)` (opening overlays, does not shift the stage): **born-RED CONFIRMED** —
  opening the pane shifts the stage from 740px (closed, frac 0.877) to 185px (open, frac 0.219), a massive
  displacement, not ±0px.
- `proof:mobile-single-page (c)` + `proof:dock-zorder`: regression-locks on ALREADY-SOTA docks — sound;
  z-tokens (`--z-controls:20` < `--z-dock:40`) confirm the z-order assertion is satisfiable (F6).
- `proof:drawer-spring (a)` (no CSS grid-rows transition): **born-RED CONFIRMED in spirit** (the 0.55s
  ease exists at `:149,:154`) — BUT as currently SPECIFIED (repo-wide grep) it **cannot reach GREEN**
  because of the unrelated `AnimationControlsControls.vue:295` survivor → see **F1 (HIGH)**.
- `proof:drawer-spring (b)/(c)` (spring shape <350ms / PRM single-frame snap): born-RED CONFIRMED (550ms
  eased ramp, no overshoot today); APIs to satisfy them exist (F6).
