# impl-w12-gates-i3 — the I3 ENRICHMENT gate lane (author + wire the 4 sequence/path/egg gates)

**Lane:** H.W12 I3-GATES — author the four born-RED I3-enrichment gates the contract names
(`H.W12.md §Hard gate`): `proof:sequence-rows-draggable`, `proof:motion-path-editable`,
`proof:motion-path-copy`, `proof:easter-egg`. Browser-gated (serveDist + Playwright), each
settle-gated on the H.W1 FSM resting, each wired into `package.json` (`proof:*` + `proof:all`)
+ `ci.yml` (the `demo-smoke` job, `KF_REQUIRE_BROWSER: "1"`). The gates LOCK the Lane A scene
work (`impl-w12-scenes.md`) + the Lane C eggs (`impl-w12-easing-eggs.md`).

**Status:** LANDED — all 4 gates GREEN against the landed demo (`dist/gh-pages` built;
playwright resolves locally). tsc-clean (`npm run check` PASS — no source edits, only new
`.mjs` scripts + `package.json` + `ci.yml`). `proof:ci-coverage` PASS (all 90 gates invoked in
CI, incl. the 4 new). No engine touched (`src/animation` FENCED, inv ζ). No git commit (per
directive).

**Files (all absolute):**
- NEW `/Users/mkbabb/Programming/keyframes.js/scripts/proof-sequence-rows-draggable.mjs`
- NEW `/Users/mkbabb/Programming/keyframes.js/scripts/proof-motion-path-editable.mjs`
- NEW `/Users/mkbabb/Programming/keyframes.js/scripts/proof-motion-path-copy.mjs`
- NEW `/Users/mkbabb/Programming/keyframes.js/scripts/proof-easter-egg.mjs`
- M `/Users/mkbabb/Programming/keyframes.js/package.json` — 4 `proof:*` script entries + the
  4 gates appended to `proof:all` (after `proof:scene-parity`).
- M `/Users/mkbabb/Programming/keyframes.js/.github/workflows/ci.yml` — 4 gate steps in the
  `demo-smoke` job (after `proof:scene-parity`), each `KF_REQUIRE_BROWSER: "1"`.

The harness idioms are the existing ones: `proof-scene-parity.mjs`'s `serveDist` + the
`settleOnScene` FSM-settle plumbing (IN-PAGE hash reconcile → `waitForFunction` on the
machine's `activeScene` in `localStorage[keyframes-js-scene-machine]`) + the
`KF_REQUIRE_BROWSER` skipOrFail (a playwright-absent skip becomes a hard CI fail, so no clause
passes vacuously). Each gate has a STATIC half (always runs, source-shape) + a BROWSER half
(the live interaction effect).

---

## 1. `proof:sequence-rows-draggable` (I3 · R-SEQ-D / H-MI-4)

STATIC: `.seq-handle` per row carries `role="slider"` + `@pointerdown` (the drag seam) +
`:aria-valuenow` (the live `at:` readout) in `SequenceTarget.vue`; `useSequenceDemo.ts` exposes
`reseatRow()` that re-emits the reactive `delays[i]` AND sets the matching `Sequence` entry's
`at` + `sequence.entries.sort` (the engine position model, inv ζ).

BROWSER: settle on `#/sequence`, read every row's `aria-valuenow` (its `at:` ms), drag the
FIRST row's `.seq-handle` to the track's far end, re-read. Assert (a) that row's `at:` moved
later by ≥100ms AND (b) the SORTED multiset of all rows' `at:` re-ordered (the engine re-sorted,
not just relabelled one row).

**VERIFIED LIVE:** drag row 1 → `at:` `0ms → 1440ms`; sorted distribution
`[0,260,520,780,1040] → [260,520,780,1040,1440]` (re-sorted). **GREEN.** Bite: read-only rows
(no `.seq-handle` drag) never move `at:`; without the entry re-sort the distribution never
re-orders.

## 2. `proof:motion-path-editable` (I3 · R-MP-B, the F4 elevation)

STATIC: `motionPathGeometry.ts` exports `DEFAULT_POINTS` (the control net) + `buildPathD()`
(the compiler) and `PATH_D = buildPathD(DEFAULT_POINTS)` (NOT a frozen literal); the guide
`<path>` binds `:d="demo.pathD"` (reactive) AND `useMotionPathGesture.ts`'s `watch(pathD)`
re-writes the traveller's `.style.offsetPath` to the SAME `d` (the lockstep, no-drift-by-
construction).

BROWSER: settle on `#/motion-path`, capture the guide `.mp-guide-path` `d` + the traveller's
computed `offset-path` BEFORE, drag a `.mp-handle` control point by a visible delta, capture
AFTER. Assert (a) the guide `d` changed, (b) the `offset-path` changed, and (c) they changed TO
THE SAME `d` — the single-source PATH_D invariant. **Normalization note:** the guide `d` keeps
the authored comma separators (`200 320, 340 320`) while the browser's computed `offset-path`
serializes the SAME geometry comma-free; SVG path-data commas ARE whitespace, so the gate
canonicalizes commas → spaces for the GEOMETRIC equality (the no-drift invariant is geometric
equality of one path, not byte equality of two serializations).

**VERIFIED LIVE:** drag a control handle → guide `d` and traveller `offset-path` BOTH became
the SAME new `d` (`…340 320 340 200 C 340 80 200 60 60 200 Z`). **GREEN.** Bite: a frozen path
leaves both unchanged; a missing lockstep re-write leaves the traveller on stale geometry (they
drift).

## 3. `proof:motion-path-copy` (I3 · R-MP-C / W-MP-3)

STATIC: `useMotionPathDemo.ts` derives `copyablePath` = `offset-path: path('${pathD}')` (the
single source); `MotionPathTarget.vue` surfaces it via `<CopyButton :text="demo.copyablePath">`
+ a `.artifact` `<code>` block.

BROWSER (in its own browser CONTEXT with `clipboard-read`/`clipboard-write` granted): settle on
`#/motion-path`, the `.artifact` text reads `offset-path: path('…')`, a real CopyButton click
writes that EXACT string to the clipboard (read-back via `navigator.clipboard.readText()`), AND
after a control-handle drag the artifact UPDATES (it re-reads the single source — what you copy
IS what you shaped).

**VERIFIED LIVE:** the artifact reads `offset-path: path('M 60 200 C 60 80, … Z');`, the click
wrote that exact string to the clipboard, and after an edit it updated to the new path.
**GREEN.** Bite: no copy affordance → no `.artifact` text; a stale static string → never
updates on edit.

## 4. `proof:easter-egg` (I3 · ONE on-aesthetic egg per scene)

STATIC: each of the seven scenes carries a hidden egg trigger + an engine-dogfooding effect
token (the `STATIC_EGGS` table — `playReel`/`isReeling`; `winking`/`lapAccum`/`1F60E`;
`onRoll`/`cube--rolling`; `onBoing`/`amiga-canvas--boing`; `tumble`/`SpringProgress`;
`derby`/`derbyRunning`; `gallery`/`galleryRunning`/`canvas-egg-host`).

BROWSER: for EACH scene settle on it, fire the hidden gesture, assert the observable
off-the-normal-path effect flips:

| Scene | Trigger | Observable | Live result |
|---|---|---|---|
| sequence | type "reel" (keyboard) | `.reel-active` / mid-glide `--ball-p` | reel active, cascade fires |
| motion-path | full-lap traveller drag (28 waypoints round the closed loop) | `.mp-traveller--winking` | glyph 🙂‍↔️ → 😎 |
| cube | dblclick `.cube` | `.cube--rolling` / inline transform | rolling + engine spin |
| amiga | dblclick `.amiga-canvas` | `.amiga-canvas--boing` | boing class set |
| square | dblclick `.demo-box` | the box transform leaves rest | barrel-roll observed |
| spring | dblclick `.spring-rail` | the live `.spring-ball` `left` sweeps off rest | peak Δleft 772px |
| easing | dblclick `.canvas-egg-host` | the sidebar `.bezier-path` `d` cycles | curve toured |

**All 7 GREEN.** Two non-obvious implementation choices recorded so the gate is robust and the
next lane does not re-trip them:

1. **The egg dblclicks are DISPATCHED `MouseEvent("dblclick")`, not synthetic mouse sequences.**
   The egg handlers are plain Vue `@dblclick` listeners (NOT a permission-gated API needing a
   trusted gesture), and a real `mouse.dblclick` on the cube trips OrbitalDrag's
   `pointerdown → setPointerCapture` path and WEDGES the shared page (poisoning every subsequent
   scene's `settleOnScene`). A dispatched bubbling dblclick exercises the SAME handler the user's
   double-click invokes, conflict-free across all seven scenes.
2. **The easing egg runs in its OWN browser CONTEXT (isolated localStorage).** The easing curve
   lives in the full-rail SIDEBAR, which mounts only when the easing TabsContent is the ACTIVE
   tab — reka's Tabs activation rides `EasingScene.vue`'s `onMounted+nextTick` re-assert (fires
   on a FRESH mount). After the shared page cycled through cube/amiga/square/spring the reka Tabs
   state is sticky, so a same-browser new page does NOT reliably activate the easing tab. A fresh
   browser context = a clean first-mount = the proven `freshEasingPage` condition (the
   scene-parity tab-init-race remedy). AND: `.canvas-egg-host` is `display: contents` (it
   dissolves its own box so the canvas stays the direct grid child), so it has NO bounding box —
   the readiness check asserts its EXISTENCE + that its CHILD curve (`.canvas-egg-host
   .bezier-path`) has a real box, never `getBoundingClientRect()` on the host itself.

Bite: revert any egg to a no-op → its effect never fires → that scene's browser clause reds.

---

## 5. Wiring + coverage

- `package.json` — 4 `proof:*` entries (after `proof:cohesion`/`proof:ci-coverage`) + the 4
  gates appended to the `proof:all` chain after `proof:scene-parity`.
- `ci.yml` — 4 steps in the `demo-smoke` job (after `proof:scene-parity`, before
  `proof:hero-rung`), each `env: KF_REQUIRE_BROWSER: "1"` (the playwright-absent-skip → hard-fail
  posture every browser gate in the job carries).
- `proof:ci-coverage` — **PASS** ("all 90 proof:* gates are invoked in CI"); the 4 new gates are
  covered, so the F.W2 coverage clause stays green.

## 6. §Mandate bar — the gates BITE, no vacuity

Each gate asserts an EXACT live interaction effect the Lane A/C work landed, born-RED on the
pre-W12 baseline:
- `proof:sequence-rows-draggable` — the `at:` changes AND the distribution re-sorts (read-only
  rows reds).
- `proof:motion-path-editable` — the guide `d` AND the traveller `offset-path` change in
  lockstep to the SAME `d` (a frozen path / a drift reds).
- `proof:motion-path-copy` — the copy affordance emits `offset-path: path(…)` + the real
  clipboard write + the edit-tracking (no affordance / a stale string reds).
- `proof:easter-egg` — each of the 7 scenes' hidden trigger fires its observable effect (any
  inert egg reds).

No gate is satisfiable by a `display:none`/`!important` suppression — each asserts a real
affordance (the rows DRAG, the path RE-SHAPES, the copy EMITS, the eggs FIRE). The browser
halves are FSM-settle-gated (`settleOnScene` waits for the H.W1 machine to rest on the target),
so the locks fail on interaction logic, not a route storm. The W1 FSM + W10 normalization + W11
card/DFA all hold (the gates are demo-side, additive, no engine touched — inv ζ).
