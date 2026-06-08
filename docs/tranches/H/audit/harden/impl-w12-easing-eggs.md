# impl-w12-easing-eggs — LANE C (S7/J · the frontend-design pass · one egg per owned scene)

**Lane:** H.W12 LANE C — the easing-sidebar minimalism strip (S7 / round-4 **J**),
the frontend-design usability pass over the scenes Lane C owns
(cube/amiga/square/spring/easing — NOT sequence/motion-path, those are Lane A's),
and ONE on-aesthetic easter egg per owned scene. File-disjoint from Lane A
(`demo/easing/* + demo/cube/* + demo/amiga/* + demo/square/* + demo/spring/*` +
the matching `demo/app/scenes/*Scene.vue` hosts; Lane A owns the sequence +
motion-path scenes).

**Status:** LANDED, tsc-clean (`npm run check` PASS, the WHOLE tree — Lane A +
the styling lane + this lane compile together). No engine touched (`src/animation`
FENCED, inv ζ — every egg DOGFOODS public engine primitives). No git commit (per
directive). Built `dist/gh-pages` and verified LIVE (Playwright, prod build).

**Files (all absolute, all in Lane C's disjoint set):**
- M `/Users/mkbabb/Programming/keyframes.js/demo/easing/EasingSidebar.vue` — the J
  strip (J1/J2/J5 deletions · J3 full-width duration · J4 single container · J6
  in-sidebar canvas grow) + the Gallery egg dblclick host.
- M `/Users/mkbabb/Programming/keyframes.js/demo/easing/useEasingDemo.ts` — the
  Gallery egg (`gallery()`).
- M `/Users/mkbabb/Programming/keyframes.js/demo/cube/CubeTarget.vue` — the Roll egg
  (`onRoll()`, engine `CSSKeyframesAnimation` spin on `.cube`).
- M `/Users/mkbabb/Programming/keyframes.js/demo/app/scenes/AmigaScene.vue` — the
  grab-cursor affordance + the Boing egg (`onBoing()`).
- M `/Users/mkbabb/Programming/keyframes.js/demo/square/useSquareAnimations.ts` — the
  Tumble egg (`tumble()`, the third `SpringProgress` folded into the paint loop).
- M `/Users/mkbabb/Programming/keyframes.js/demo/app/scenes/SquareScene.vue` — the
  Tumble dblclick wiring.
- M `/Users/mkbabb/Programming/keyframes.js/demo/spring/useSpringDemo.ts` — the Derby
  egg (`derby()`).
- M `/Users/mkbabb/Programming/keyframes.js/demo/spring/SpringTarget.vue` — the Derby
  dblclick wiring (coexists with the seam's `useDragScrub` `@pointerdown`).

---

## 1. The J strip (S7) — the easing sidebar is MINIMAL, controls-like

Per `j-easing-minimalism.md` (round-4 feedback) + `H.W12.md §S7`. Anchored on the
post-W11 `EasingSidebar.vue` (the normalized one-Card sidebar). VERIFIED LIVE at
1440×900 (the J strip measurements below are from the live render).

| Item | What landed | Live measure (1440×900) |
|---|---|---|
| **J1** | DELETED the `<LabeledInput label="value">` CSS-value text input. The `<EasingSelect>` dropdown is the SOLE easing selector. | `input[type=text]` / `.css-value-input` absent (0). |
| **J2** | DELETED the "value" label (it labelled the deleted input). | label set = `["duration"]` only. |
| **(trailing CopyButton)** | DROPPED the inline `<CopyButton>` (`:50`) — the input it served is gone, so it earned no place beside the dropdown (the contract's "drop unless it earns its place"). | absent. |
| **J5** | DELETED the `<h2 class="text-title">` scene title. Controls carry no big per-scene title. | `panel h2` absent (`hasH2: false`). |
| **J3** | The `duration` `LabeledSlider` is FULL-WIDTH. The `.duration-field` modifier opts the row OUT of the subgrid's 2-track `[label] [value]` row and STACKS it (label on its own line, the track full-bleed). It STAYS a real glass-ui `.labeled-field` (the normalized-sidebar ≥1-row invariant holds; the rung stays standard). A befitting NAMED delta (the sole control deserves the full measure now). | `.duration-field` resolves `display:flex; flex-direction:column`; slider track 296px = the full `CardContent` inner width (328 − padding). |
| **J4** | ONE flat `CardContent` (no double container). The W11 normalization already collapsed it to one `CardContent.labeled-field-grid`; J4 is a verify + regression-guard. | `.rounded-card.text-card-foreground` count = 1. |
| **J6** | The IN-SIDEBAR hero canvas GROWS into the space J1/J5 freed. A `:deep(.easing-curve-canvas)` override (`block-size: clamp(260px, 64cqi, 360px); max-block-size: min(56vh, 420px)`), mirroring the TimingFunctionPanel's in-panel grow idiom but generous (the sidebar is a full-height ~579px rail, NOT a height-capped detail row). Square LAW preserved (`aspect-ratio:1`). MEASURE-FIRST: the non-canvas chrome (EasingSelect + the full-width duration + padding/gaps) ≈150px of `scrollH − canvasBlockSize`; pane budget ~579px → canvas budget ~420px. | canvas block-size 160px → **260px** (grew); `scrollHeight === clientHeight` (NO scroll); `overflow-y: visible`. |

**The J strip composes with the existing gates** (all PASS after the strip, live):
- `proof:easing-sidebar-normalized` — PASS (easing: 1 Card, 1 `.labeled-field`
  [the duration row], 0 `.text-admin-label`, 6px md track). The strip preserved the
  G5/G6 normalized invariant.
- `proof:label-subgrid` — PASS (the cube main-controls 5-row subgrid + the layer
  panel hold; the easing sidebar's single duration row is below the gate's ≥3-row
  non-vacuity bar, correctly skipped).
- `proof:bezier-grown` — PASS (the IN-PANEL cube detail canvas still grows to
  223/232px, no "editing:" subtitle, fits — J6 only touched the IN-SIDEBAR canvas,
  so this in-panel gate is unaffected).
- `proof:scene-parity` — PASS (the `easing-curve-editable (sidebar)` clause still
  fires `update:bezierPoints` — the `.canvas-egg-host` `display:contents` wrapper
  did NOT break the handle drag; the editable canvas survives the strip).

**GATE-RECONCILIATION HANDOFF to W8 (§6 below)** — `proof:easing-canvas-bounded`
has TWO clauses that J DELIBERATELY supersedes (born-RED-on-J by design). Recorded
honestly; W8 owns the reconcile.

---

## 2. The frontend-design pass (S6 — the per-scene usability checklist)

Ran the `frontend-design` skill; audited EVERY owned scene LIVE in the **production
build** (`dist/gh-pages`, 1440×900) for usability / affordance discoverability /
interactability. The scenes carry a refined glass-UI cartoon aesthetic already — the
brief is ISOMORPHIC-unless-befitting, so the pass RESPECTS + EXTENDS it, it does not
re-skin.

| Scene | Renders (prod) | Affordance | Interactability | Verdict |
|---|---|---|---|---|
| **cube** | ✓ (the cube + axis lines + matrix controls + ribbon) | auto-rotates · orbit-drag · matrix editor · "M. Cubert" start-hint | strong | **egg only** (well-affordanced) |
| **amiga** | ✓ (the boing-room + checkered sphere) | **GAP — the static sphere gave NO grab signal** | spin-on-drag (sphere) / orbit (background) | **+ grab-cursor affordance** + egg |
| **square** | ✓ ("drag me" aquamarine box) | exemplary — literal "drag me" + `cursor:grab` | drag → per-axis spring chase | **egg only** |
| **spring** | ✓ (rail + ball + "settled" + helper text) | explicit "Tap or drag the rail …" + ghost-target marker | rail drag re-seats live + canonical springs | **egg only** |
| **easing** | ✓ (the J-stripped sidebar + the swept ball stage) | draggable bezier handles · the dropdown · full-width duration | curve edit + scrub | **egg only** |

**The ONE befitting affordance refinement — amiga grab cursor.** The amiga sphere is
the interactive subject (drag to spin, release for the engine `decay()` glide) but
the static checkered ball advertised nothing. Added `cursor: grab` (+ `:active →
grabbing`) on `.amiga-canvas` — the SAME pointer cue the square scene's box already
carries. Isomorphic (no layout/visual change, just the pointer hint). VERIFIED LIVE
(`cursorBefore: grab`). Stands down to `default` during the Boing egg arc
(`.amiga-canvas--boing`).

No other scene needed a refinement — cube/square/spring/easing each already
advertise their affordance clearly (drag-cursor / "drag me" / "tap or drag the rail"
/ draggable handles). The pass is ISOMORPHIC elsewhere (the precept bar).

---

## 3. The easter eggs — ONE per owned scene (each DOGFOODS the engine, inv ζ)

Shared idiom: a **double-click on the scene's interactive subject** — a deliberate,
conflict-free gesture (single-click already carries meaning; dblclick does not
collide with text selection or the drag `@pointerdown`). Each egg is hidden,
tasteful, on-aesthetic, produces an observable off-the-normal-path effect, and
reuses public engine primitives (NO hand-rolled rAF). All VERIFIED LIVE.

| Scene | Egg | Trigger | Engine dogfood | Live proof |
|---|---|---|---|---|
| **cube** | **"the Roll"** — M. Cubert is a six-faced die; double-click rolls it to a random face with a couple of full turns on `ease-out-back` (the overshoot is the die settling onto its face). | dblclick `.cube` | `CSSKeyframesAnimation` (`ease-out-back`) on the `.cube` element directly (composes with the OrbitalDrag orbit). | `transform: none` → `rotateX(358→780→720) rotateY(…→540)` — the overshoot-and-settle visible; lands face-up. |
| **amiga** | **"the Boing"** — double-click wakes the dormant 1984 Amiga Boing Ball: the bounce+spin+hue group plays one arc, then settles home. | dblclick `.amiga-canvas` | the EXISTING `useAmigaAnimations` `AnimationGroup` (bounce X/Y/Z + spin + hue) — built but otherwise dormant; the egg RESURRECTS it. | `boinging` flag set; cursor → `default`; group plays; sphere re-seats home after 4.2s. |
| **square** | **"the Tumble"** — double-click barrel-rolls the box one turn (snappy underdamped overshoot) while it sweeps the contract-keyframe palette, then returns to its aquamarine home. | dblclick `.demo-box` | a THIRD `SpringProgress` (`+360°` accumulating target) FOLDED into the SAME paint loop + custom `transformFunc` (ONE paint authority — `transform.rotate`, no 2nd writer). | identity → `matrix(0.79,0.60,…)` rotating + bg `rgb(128,107,232)→(83,230,153)→…`; settles `matrix(1,0,0,1,0,0)` + bg `rgb(127,255,212)` (aquamarine) + inline cleared. |
| **spring** | **"the Derby"** — double-click the rail launches the canonical trackers (smooth/snappy/bouncy/gentle) in a STAGGERED 110ms wave so their different damping is SEEN racing, then the field bounces home. | dblclick `.spring-rail` | each track's own `SpringProgress` (inv ζ); the shared loop is the sole driver — the egg only re-seats targets on a timer. | the live ball + field re-seat to 1 in a wave then bounce to 0 (ball left 768px → 0px). |
| **easing** | **"the Gallery"** — double-click the curve canvas tours the expressive easing catalogue (back/bounce/expo/circ) ~520ms apart, the hero canvas morphing + the dot tracing each, then restores the curve the user was on. | dblclick the canvas (via a `display:contents` egg-host — see note) | `selectEasing` re-derives `currentEasingFn`/`svgPath` per step (the engine's curve set). | 6 distinct curve `d`-paths cycle; `settledAfter: true` (returns to the original). |

**Two implementation notes worth recording (so the next lane does not re-trip):**

1. **The cube Roll targets `.cube`, NOT the OrbitalDrag `transform.rotate`.** First
   attempt drove two `SpringProgress` into `transform.rotate.{x,y}` — but
   OrbitalDrag renders its `rotate3d` off the QUATERNION (`transform.matrix`), NOT
   off `transform.rotate` (per `orbital-drag` — "ONE rotate3d() off the quaternion's
   NATIVE axis-angle"), so the rotate writes never showed. Re-authored to a one-shot
   engine `CSSKeyframesAnimation` on the `.cube` element directly (the faces sit at
   ±translateZ, so a whole-cube rotate re-presents them) — robust, composes with the
   orbit, no quaternion math. Also: `SpringProgress` has NO `value` setter (`value`
   is read-only) — re-seats go through `target`.

2. **The easing Gallery rides a `display:contents` egg-host, and the tour names are
   HYPHENATED registry keys.** `<EasingCurveCanvas>`'s root is a `GlassPanel` that
   does not forward native `@dblclick` reliably — wrapped it in a thin
   `.canvas-egg-host` div (`display:contents` so it stays out of the subgrid flow,
   the canvas remains the full-width hero child, while the wrapper catches the
   bubbled dblclick). AND: `getTimingFunctionsAnd()` re-keys every easing through
   `camelCaseToHyphen`, so `selectEasing` + the curve lookup want the HYPHEN form
   (`ease-in-out-back`, `bounce-out-ease`, `ease-out-expo`, `ease-in-out-circ`,
   `bounce-in-out-ease`, `ease-out-back`) — the camelCase form (`easeInOutBack`) is
   NOT a key and silently no-ops. The tour list is verified against the live value.js
   set (no `elastic` exists; the curated list is back/bounce/expo/circ).

All five dispose cleanly (egg timers cleared / animations stopped on
`onScopeDispose` / `onBeforeUnmount`).

---

## 4. tsc / gate status at lane close

- `npm run check` (tsc --noEmit) — PASS (the whole tree: Lane A + styling lane +
  this lane compile together).
- `proof:easing-sidebar-normalized` — PASS (the J strip holds the G5/G6 invariant).
- `proof:label-subgrid` — PASS.
- `proof:bezier-grown` — PASS (in-panel canvas; J6 only touched the in-sidebar).
- `proof:scene-parity` — PASS (square-drag · easing-curve-editable · motionpath-drag
  all interactive; the eggs ADD interactivity, remove none).
- `proof:easing-canvas-bounded` — **2 clauses born-RED by J design** (§6 — the W8
  reconcile handoff, NOT a regression).

The W1 FSM + the W10 normalization + the W11 card/DFA all hold (no regression).

---

## 5. Out-of-lane finding — the cube `"cubic-bezier"` console storm is DEV-ONLY

While auditing the cube scene I found a console FLOOD on the cube route:
`AnimationOptionError: Invalid value for animation option "timingFunction":
"cubic-bezier"` firing thousands of times (`useCubeAnimations.ts:20` →
`new CSSKeyframesAnimation(matrixAnimationOptions.animationOptions)` → the stored
`animationOptions.timingFunction` reads `"cubic-bezier"` at construction). It
reproduces on a CLEAN localStorage. I traced + dispositioned it:

- **It is DEV-SERVER-ONLY.** Built `dist/gh-pages` and served it: the **production
  cube renders perfectly with ZERO `AnimationOptionError`** (the only prod console
  line is the unrelated controlled `[KeyframesString] could not serialize`
  placeholder-floor warning). The dev flood is a Vite HMR / reactivity double-invoke
  artifact, not a ship defect — which is why `proof:demo-console-clean` (prod-build
  scoped, H-A1-signature scoped) does NOT catch it and is GREEN.
- **It is pre-existing + out of Lane C's file-disjoint scope.** `useCubeAnimations.ts`
  AND the entire shared `demo/@/components/custom/animation-controls/` tree are CLEAN
  vs HEAD (the flood predates W12; the root is the shared option-store ↔ engine seam,
  not a scene file). NOT introduced by, and NOT fixable within, this lane.
- **Disposition: recorded for the I9 store-discipline / I11 brittleness lane** (the
  `useTimingFunctionEditor` writes the `"cubic-bezier"` SENTINEL string into the
  store before swapping in the callable — a transient the cube rebuild can read in
  dev's double-invoke). A demo-side fix would sanitize the timingFunction at the cube
  construction OR make the store never hold the bare sentinel. Out of lane; the engine
  is FENCED. NOT a prod ship-blocker.

---

## 6. GATE-RECONCILIATION HANDOFF to W8 — `proof:easing-canvas-bounded`

`proof:easing-canvas-bounded` measures the FULL-RAIL EasingSidebar render (the exact
sidebar J strips). After the J strip it FAILS exactly TWO clauses, and BOTH are W4-era
assertions that round-4 **J DELIBERATELY OVERTURNS** (born-RED-by-design, NOT a
regression):

1. **`PANEL-HEIGHT RATIO ≤ 0.55`** — now `0.654` (canvas 260px ÷ panel 398px). J6
   EXPLICITLY grows the canvas to DOMINATE the panel (the user: "make the bezier
   visualizer bigger as such"). The W4 0.55 anti-dominance cap is SUPERSEDED by J6.
2. **`HEADER CLEARANCE` (requires `.easing-editor > h2`)** — now `h2: false`. J5
   EXPLICITLY DELETES the `<h2>` title (the user: "remove the 'ease' title"). The W4
   "parity header must render" clause is SUPERSEDED by J5.

The gate's OTHER clauses still PASS (container-context · square-law · the ≤280px
block-size ceiling — my canvas is 260px ≤ 280).

**W8 (the gate-regime wave, which OWNS gate authoring) must:**
- AUTHOR `proof:easing-sidebar-minimal` (the H.W12.md §S7 NEW gate) to LOCK the
  post-J state: 0 CSS-value text input · 0 "value" label · 0 `<h2>` title · the
  `<EasingSelect>` as sole selector · the duration track FULL-WIDTH (≈ CardContent
  inner width ±8px) · ONE container · the canvas grew above the W11 in-sidebar size
  while fitting without scroll. (Every one of these is GREEN-shaped on the landed
  strip — see §1.)
- RECONCILE `proof:easing-canvas-bounded`: DROP the `0.55 ratio` cap + the `h2
  header-required` clause for the post-J full-rail sidebar (or RE-SCOPE that gate to
  the in-PANEL TimingFunctionPanel render, which KEEPS its title + bounded canvas).
  The bounded-canvas INTENT (no viewport-unbounded 680px blow-up) is PRESERVED — the
  J6 canvas is container-bounded at 260px ≤ a 420px ceiling; only the W4 ratio/header
  numbers are stale.

This is the honest ledger: the J strip is contract-correct (it does exactly what
`§S7` + `j-easing-minimalism.md` mandate); the two failing clauses are the W4 gate
catching up to the round-4 feedback, which the W8 lane reconciles. The H.W8 golden
`proof:visual-lock` baseline captures the post-J sidebar as the FINAL state (per the
`§sequencing` — H.W12 lands BEFORE the H.W8 golden capture).
