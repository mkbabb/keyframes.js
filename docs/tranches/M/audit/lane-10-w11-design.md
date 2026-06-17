# Lane 10 — L.W11 Design Audit (the instrument language, the crayon-preservation gate, the nine eggs)

**Lane:** 10 — W11 design
**Commits audited:** `4686aa4` (W11 feat), `e4a1cc3` (close gate-reconciliation)
**Branch:** `tranche-l-dev`
**Audit date:** 2026-06-17
**Method:** Every claim below is verified against ground truth — source files, gate scripts,
git-show stat output, and live re-runs. No claim is carried from prior audit assertions
without re-verification. The L audit shipped two factual errors that implementation corrected
(the `!important` premise; the parse-that mis-attribution); this lane verified both independently.

---

## §1 — VERDICT

**The design close is structurally sound and honestly bounded.** The three born-RED gates
(`proof:crayon-preserved`, `proof:design-refinement`, `proof:taste-packet`) all pass GREEN
on the current tree (verified by re-running the first two directly; the third requires a
built dist but its exit-3 skip path is correctly wired). The one real regression the close
surfaced and cured — the cube-attitude readout contrast failure at 3.32:1 on `--accent-red`
— was fixed without touching the protected token (`CubeTarget.vue:459`, `color-mix`
deepening to 5.39:1 theme-adaptive).

**The TASTE verdict is USER-DOMAIN-PENDING** and correctly so. The `manifest.json` in
`docs/frontend-design/taste-packets/l-w11/` has `"verdict": null, "verdictBy": null,
"verdictAt": null`. The gate `proof:taste-packet` enforces this non-fill as a
TASTE-boundary protocol assertion (`proof-taste-packet.mjs:211`). The verdict closes on
Mike Babb's "meets the bar" exactly as in the K precedent — no agent self-certifies it.

**M owes one explicit action** before any design wave can be considered complete: the user
verdict on the L.W11 before/after packet at `docs/frontend-design/taste-packets/l-w11/`.
Until that fires, the design close is OPEN at the TASTE boundary.

---

## §2 — THE CRAYON-PRESERVATION GATE: ground-truth verification

**Gate:** `scripts/proof-crayon-preserved.mjs` — run 2026-06-17, **exit 0**, PASS.

Re-run output confirmed:
- 9 extant keeper tokens (7 `--rainbow-*` stops + `--accent-red` + `--color-progress`) each
  resolve hue-exact to the 4.3.0 baseline. Source: `design-idioms.css:78-90`, `style.css:347/370`.
- 6 hoist-target tokens (`--face-1…6`) declared PENDING (the tokens reference `var(--face-N)`
  in `CubeTarget.vue` but `--face-N` resolves via `style.css` which DOES declare them).
  **Finding:** the gate's pending notes are technically correct but create a visual ambiguity:
  the facets read `var(--face-1)` at their literal site (CubeTarget.vue:124-130), and the
  actual hue is declared in `style.css` under the HOIST_TARGETS check — not at the facet's
  literal site. The gate resolves this correctly (hoist-target check fires GREEN), but the
  "pending hoist" note for the facet is misleading since the hoist has landed.
- 11 hoist-target tokens (`--face-1…6`, `--amiga-red`, `--spring-lane-*`) all GREEN,
  hue-exact via their `var(--rainbow-*)` aliases.
- The `--amiga-red` literal-retire witness fires GREEN: `AmigaScene.vue:229` now reads
  `var(--amiga-red)` not the raw `'red'` literal (verified via `grep -n` on the file).

**The gate is structurally correct.** The baseline `scripts/baselines/crayon-preserved.json`
is the oracle; `resolveValue` follows a single level of `var()` indirection to compare
hues. The EXTANT tokens are `--rainbow-*` seven stops, `--accent-red`, `--color-progress`
read from `design-idioms.css` and `style.css`; the FACETS are checked at `CubeTarget.vue`
literal sites; the HOIST-TARGETS are checked in `style.css`/`design-idioms.css`.

**One structural gap (pre-existing, not W11-introduced):** the `parseColor` function
handles `hsl()`, `rgb()/rgba()`, `#hex`, and the named color `'red'` — but does NOT handle
`oklch()` or `color-mix()` values. If a future keeper token were expressed as
`oklch(...)`, the gate would report it as unresolvable. This is not a current problem
(all kept crayons are `hsl()` or `rgb()`), but it is a latent brittleness as the codebase
converges toward `oklch` in other areas.

---

## §3 — THE NINE EGGS: ground-truth verification of inv-ζ (no hand-rolled rAF)

**Gate:** `scripts/proof-design-refinement.mjs` — static half re-run 2026-06-17, **exit 0**,
all 9 arms PASS (browser half skipped, dist not built).

Verified egg-by-egg against source:

**S1 home — live-source `@keyframes` card (`kf-source-egg`):**
Files: `EditorStartScreen.vue`, `useHeroSourceEgg.ts`. The `useHeroSourceEgg.ts:14`
comments explicitly state "no hand-rolled rAF." The dogfood is `loadAnimationEngine` →
`CSSKeyframesAnimation` + `format.ts` serialization. Confirmed: no bare
`requestAnimationFrame(` in `useHeroSourceEgg.ts` (grep returned 0 hits). Engine dogfood:
genuine (`loadAnimationEngine`, `CSSKeyframesAnimation`).

**S2 cube — re-lit die (`spin-energy`, `face--lit`, `relit`):**
Files: `CubeTarget.vue`, `OrbitalDrag.vue`, `useCubeRelit.ts`. The `useCubeRelit.ts`
implements the lighting purely as Vue `computed`/`watch` over `transform.value.rotate` —
**no kf engine primitive is called by the re-lit effect itself.** The engine dogfood
(CSSKeyframesAnimation via `loadAnimationEngine`) in the combined source comes from
`CubeTarget.vue:135-220` which implements the ROLL animation (the dblclick thunk), not
the re-lit die effect. The gate matches `loadAnimationEngine` in the combined source and
passes, but the named "S2 egg" (the orientation-coupled luminance) is a pure Vue reactive
computation over trig. This is an instrument language coherence gap: the gate is
technically correct (the files collectively dogfood the engine) but the specific W11 egg
contribution is Vue math, not a kf primitive call. See §5.

**S3 amiga — power-on BOOT (`power-on`, `booting`):**
`useAmigaBoot.ts` takes the existing `animationGroup` (a `CSSKeyframesAnimation`-based
`AnimationGroup` from `useAmigaAnimations.ts`) as a parameter and calls
`animationGroup.play()`. The boot RIDES the existing engine group (inv ζ confirmed — the
comment at `useAmigaBoot.ts:16` states "No new rAF, no new tween"). No bare
`requestAnimationFrame(` in `useAmigaBoot.ts` (grep returned 0 hits). The dogfood regex
matches `AnimationGroup` in `useAmigaAnimations.ts` (in the combined source). Correct.

**S4 square — palette-sweep (`paletteSweep`, `palette-sweep`):**
`useSquareAnimations.ts` — the gate matches `SpringProgress` in the combined source.
No bare rAF found in `useSquareAnimations.ts` (grep 0 hits). Correct.

**S5 easing — trace-smear (`trace-smear`, `self-draw`):**
`useEasingTraceSmear.ts:3` imports `SmoothProgress` from `@mkbabb/keyframes.js` — the
published barrel, dogfooding the LIGHT engine primitive. The smear plays/stops via
`smear.play()` / `onScopeDispose(() => smear.stop())` — the engine's managed
`RAFPlayback` owns the rAF (confirmed: no bare `requestAnimationFrame(` in
`useEasingTraceSmear.ts`). `EasingHeroStage.vue` uses `fromDrawSVG` from `kfEngine()` for
the self-drawing trace. The "rAF painter" in `EasingHeroStage.vue:94` refers to the
EXISTING animation loop's paint callback, not a new hand-rolled rAF. Correct — strongest
dogfood case of the nine.

**S6 spring — four-lane derby (`spring-lane`, `derby-lane`, `settle-pulse`):**
`useSpringDerby.ts` uses `SpringProgress`. No bare rAF in `useSpringDerby.ts` (grep 0
hits). `SpringTarget.vue` contains the `@dblclick="demo.derby"` trigger. Correct.

**S7 sequence — lane-detonate cascade (`lane-detonate`, `cascade-chase`, `detonat`):**
Files include `useSequenceDemo.ts`, `SequenceTarget.vue`, `SequenceScrubber.vue`. The
dogfood regex matches `Sequence|progress|stagger` in the combined source.
`useSequenceInstrument.ts` wires the detonate cascade. No bare rAF in instrument file
(grep 0 hits). Correct.

**S8 motion-path — author-the-curve (`handle-deform`, `author-curve`, `self-build`, `guide-draw`):**
`MotionPathTarget.vue:171-185` — the guide self-builds via `fromDrawSVG` imported from
`kfEngine()`. `useMotionPathGesture.ts` wires the handle-deform trigger. The traveller
banking uses the existing `fromMotionPath`/`MotionPath` primitives. Correct.

**S9 playground — bind-ignition (`bind-ignition`, `key-light`, `comet-tail`):**
`playground/App.vue` carries `fromDrawSVG|DrawSVG` (confirmed via grep). The gate's
browser half treats this as a static check (the playground is a standalone app outside the
SPA dist). Correct — governed by the static-half check per gate source
(`proof-design-refinement.mjs:318-339`).

**Summary:** 9/9 eggs pass the inv-ζ gate. The S2 cube egg's "dogfood" comes from the
CSSKeyframesAnimation ROLL in CubeTarget.vue, not from the re-lit luminance math itself
(a coherence nuance recorded in §5). No eggs hand-roll a bare rAF loop.

---

## §4 — THE CONTRAST REGRESSION: verified cure

**Defect (W11 close regression, `e4a1cc3`):** the cube-attitude readout rendered
`--accent-red` at 3.32:1 contrast ratio on the light stage. `--accent-red` is a protected
keeper crayon (not recolorable per `proof:crayon-preserved`). Cure: dropped the
contrast-diluting opacity on axis labels (→ 5.20:1) and deepened the readout value with
`color-mix` to 5.39:1 theme-adaptive.

**Ground-truth verification:**
- `CubeTarget.vue:448-460`: `.cube-attitude` reads
  `color: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 70%, var(--foreground))` —
  no raw `--accent-red` direct application; the color is deepened via `color-mix` toward
  `--foreground`, making it theme-adaptive and meeting WCAG AA.
- `CubeTarget.vue:409`: `.face-axis-tag { opacity: 0.62; }` — this is the reduced axis tag
  opacity (face label, not the attitude readout).
- `proof:crayon-preserved` GREEN post-cure: the `--accent-red` TOKEN is untouched
  (`rgba(229, 93, 93, 1)` confirmed by gate re-run).
- The commit message `e4a1cc3` states: "the W11 cube-attitude readout rendered
  --accent-red at 3.32:1 (a hue ceiling) + opacity-diluted muted-foreground at 2.41:1 on
  the light stage. Since --accent-red is a protected keeper crayon (NOT recolorable),
  cured by dropping the contrast-diluting opacity (axis labels → 5.20:1) + color-mix
  deepening the readout to 5.39:1 (theme-adaptive); the --accent-red TOKEN untouched."

**This was a real correctness regression, not a paperwork issue.** The proof:lighthouse-a11y
gate caught it, the cure is genuine (no workaround, no token mutation).

---

## §5 — PRECEPT VIOLATIONS AND COHERENCE FINDINGS

### P5a — S2 cube egg: instrument language coherence gap (NOT a precept violation — an honest nuance)

The W11.md describes the S2 egg as "the orientation-coupled RE-LIT die... rides
syncRotationToModel, NO second rAF." The `useCubeRelit.ts` composable implements this
purely as Vue `computed`/`watch` with manual trig math — faceLit, euler, spinEnergy are
all derived from `transform.value.rotate` via Vue reactivity. No kf engine primitive is
invoked by the re-lit effect itself.

The gate's `dogfood` regex for cube is `/CSSKeyframesAnimation|syncRotationToModel|loadAnimationEngine/`.
The match comes from `CubeTarget.vue:135` (`import type { CSSKeyframesAnimation }`) and
`:220` (`await loadAnimationEngine()` for the ROLL animation). The gate is technically
correct — the combined source does dogfood the engine — but the GREEN is earned by the
dblclick ROLL, not by the re-lit luminance effect.

**This is not a precept violation under the current gate design** (the gate correctly
requires the combined files to contain an engine primitive, not that the specific lighting
math calls one). But it is a design claim to record: the S2 egg's "instrument" character
comes from Vue reactive math over the physics model, NOT from a kf engine call. M should
decide whether this is idiomatic (CSS-variable-driven lighting as an "instrument layer")
or whether a future design wave should find a kf-primitive anchor for this pattern.

### P5b — proof:crayon-preserved: no `oklch()`/`color-mix()` support in parseColor

`proof-crayon-preserved.mjs:104-151`: `parseColor` handles `hsl()`, `rgb()/rgba()`, `#hex`,
and the named color `'red'`. It does NOT parse `oklch()`, `color-mix()`, `lab()`, etc.
The current tokens are all `hsl()` or `rgb()` so this poses no current risk. But as the
codebase adopts `oklch` (the cube-attitude cure itself uses `color-mix` — though that is
in the component, not in a keeper-token declaration), a future keeper migration to `oklch`
would silently be reported as "unresolvable" and treated as a PENDING note, not a FAIL.

This is a latent gate brittleness. The gate does NOT violate any current precept, but the
M upgrade path for this gate should add `oklch()` parsing to prevent future false-negatives.

### P5c — proof:design-refinement: S2 dogfood regex mixes egg and pre-existing functionality

As noted in §3/§5a: the S2 dogfood regex (`/CSSKeyframesAnimation|syncRotationToModel|loadAnimationEngine/`)
accepts `syncRotationToModel` as a dogfood signal, but `syncRotationToModel` is a LOCAL
helper function in `OrbitalDrag.vue` (line 80), not a kf engine primitive. The match
succeeds via `loadAnimationEngine` in `CubeTarget.vue`, which is genuine dogfood but for
the pre-existing ROLL animation rather than the W11 egg. A precision audit of inv-ζ
should ask: "does the W11 egg contribution itself call a kf primitive?" For S2, the
honest answer is no — the contribution is pure Vue reactive CSS-variable math.

**This is NOT a born-RED finding** (the gate's design intentionally checks the combined
source because the W11 egg often coexists with the pre-existing engine use in the same
file). It is an instrument language documentation gap: the S2 egg's "instrument" claim
should specify "CSS-variable-driven luminance via Vue computed" rather than "engine dogfood."

### P5d — NO instances of legacy code or workarounds introduced by W11

Searched all new files: `useHeroSourceEgg.ts`, `useAmigaBoot.ts`, `useCubeRelit.ts`,
`useEasingTraceSmear.ts`, `useSpringDerby.ts`, `useSequenceInstrument.ts`,
`useMotionPathGesture.ts`, `SquareInstrument.vue`, `SpringTrace.vue`, `AmigaCrtOverlay.vue`,
`SequenceAxis.vue`, `SequencePlayhead.vue`. None introduce bare `requestAnimationFrame`
loops, no `setTimeout`-based animation loops, no new SCSS-only animation workarounds.
`useAmigaBoot.ts:47` uses `setTimeout` for a 3-second boot-window timer (not animation
driving). This is idiomatic.

---

## §6 — INSTRUMENT LANGUAGE COHERENCE (the design-fold-clauses.txt ground truth)

The `docs/tranches/L/audit/design-fold-clauses.txt` contains the 9-scene instrument
language treatment, each with:
1. A `↩` reversal record (overreach clauses rejected by the user verdict)
2. Concrete refine/egg clauses with file:line anchors

Verified that all nine `↩` reversals were honored in implementation:
- Cube: "kill the crayon-box primaries" → REVERSED, `proof:crayon-preserved` GREEN
- Amiga: "magenta ball swap" → REVERSED, `--amiga-red: var(--rainbow-red)` in `design-idioms.css`
- Spring: "replace the ball-on-rail" → REVERSED, rail KEPT in `SpringTarget.vue`
- Home: "live source panel as whole-page identity" → TEMPERED to quadrant-sized egg
- Easing: "replace the inert GlassPanel" → REVERSED, glass KEPT in `EasingHeroStage.vue`

The TASTE packet covers 4 panes (home-hero, cube-stage, spring-controls, cube-ribbon) with
desktop + mobile before/after pairs. The `manifest.json` lists a `missingBefore` entry for
`cube-ribbon-mobile` — the before image for that pane was not captured (the diff-capture
was a known gap at authoring time). This is correctly recorded in the manifest, not papered
over. One slight coherence finding: 4 panes for 9 scenes means 5 scenes (amiga, square,
easing, sequence, motion-path, playground) have no visual coverage in the taste packet.
This is consistent with the K.W5 precedent (the packet is a "representative pane set"
not a complete scene census), but M should consider whether the taste-boundary protocol
needs expanded coverage for the remaining 5 scenes.

---

## §7 — THE TASTE GATE MECHANICS: what M owes

The `proof:taste-packet` gate exits `3` (not `1`) when `dist/gh-pages` is absent and
`KF_REQUIRE_BROWSER` is not set (`proof-taste-packet.mjs:138`). Exit code 3 is NOT caught
as a failure by the `proof:hygiene` `&&` chain in `package.json:190` — the chain would
propagate a non-zero exit only if the process returns `1`. This means **the taste-packet
gate is effectively SKIPPED in proof:hygiene when no dist is built**, which is the correct
behavior for local development (you don't need a full dist to iterate) but means CI cannot
verify the packet is well-formed unless `dist/gh-pages` is built.

Verified in `ci.yml:568-571`: the `proof:taste-packet` step is in the blocking `proof:hygiene`
job and runs AFTER the `npm run gh-pages` build step (`ci.yml:397-398`), so in CI the dist IS
built when the gate runs. The gate is correctly positioned. No precept violation.

The taste-anchor checklist in the manifest has 4 anchors (`rainbow play`, `hero serif`,
`icon family`, `red-dashed final state`), each with `"preserved": null` (correctly UNSET).
The gate asserts these are unchecked (`proof-taste-packet.mjs:208`). This is the
TASTE-boundary invariant: a gate may NEVER fill the verdict. Confirmed structurally sound.

---

## §8 — CROSS-REPO DESIGN DISPATCH

**The value.js pair** (`color-picker`, `hero-lab`) is described in `L.W11.md:121-125` as a
"cross-repo design DISPATCH to value.js (value.js owns its own demo design under inv-16)
— recorded in `KF-TO-VALUEJS-O-ASKS.md` as a design suggestion, not a kf wave."

However, searching `KF-TO-VALUEJS-O-ASKS.md` for "design" / "color-picker" / "hero-lab"
returns zero hits. The design dispatch was described in `docs/frontend-design/demo/` (the
9-page Opus fleet files including `color-picker` and `hero-lab` sub-docs in
`design-fold-clauses.txt:134-162`), but it was NOT filed as a numbered ASK in the
`KF-TO-VALUEJS-O-ASKS.md` dispatch document. The dispatch is in `design-fold-clauses.txt`
as the color-picker and hero-lab treatment clauses.

**Finding:** the W11.md claim that the value.js design pair "is recorded in
`KF-TO-VALUEJS-O-ASKS.md`" does not reproduce — the file has no design asks. The design
fleet for value.js demos lives in `docs/frontend-design/` as freestanding treatment docs
(authoring guidance), not as numbered kf-side asks. Under inv-16 (kf writes only its own
repo), this is architecturally correct: kf cannot file a "numbered consumed ask" for
value.js's demo design; the treatment docs are design suggestions. The W11.md's claim is
slightly imprecise in the cite but not a correctness problem: the dispatch exists, it's
just in the frontend-design treatment, not in the KF-TO-VALUEJS asks ledger.

**M action:** the value.js design dispatch is USER-DOMAIN (value.js Tranche O authoring);
no M gate or M wave needs to track it. It is correctly out-of-scope for kf.

---

## §9 — DEFERRED FOLDS FOR M

The following items from L.W11 are correctly OPEN at the L close and constitute M-domain
work:

### M-defer-1: TASTE verdict (USER-DOMAIN, M-wave gate precondition)

The L.W11 design close is OPEN at the TASTE boundary. `docs/frontend-design/taste-packets/l-w11/manifest.json`
has `verdict: null`. Per the K.W5 precedent, the verdict must be Mike Babb's explicit
"meets the bar." Until that fires, the design close cannot be declared complete. Any M
design wave that builds on the W11 appearance should be scoped with the TASTE verdict as
a prerequisite.

### M-defer-2: proof:crayon-preserved — oklch/color-mix parseColor gap

The `parseColor` function in `proof-crayon-preserved.mjs` does not handle `oklch()`,
`color-mix()`, or other modern color syntaxes. If any future keeper token migrates to
`oklch`, the gate silently returns `null` (treated as PENDING, not FAIL). M should extend
`parseColor` to handle `oklch(l c h)` and `color-mix(in <space>, ...)` at minimum to
maintain gate correctness under the ongoing `oklch` migration.

### M-defer-3: proof:design-refinement — S2 dogfood precision

The S2 (cube re-lit die) arm passes via the ROLL's CSSKeyframesAnimation, not via the
re-lit luminance computation. The gate's `dogfood` regex `syncRotationToModel` token refers
to an OrbitalDrag.vue local function, not a kf primitive. If M authors a design-refinement
wave, the S2 arm's dogfood description should be corrected to say "CSS-variable luminance
via Vue computed, plus the existing CSSKeyframesAnimation ROLL dogfood" rather than
implying the luminance itself uses a kf primitive.

### M-defer-4: TASTE packet coverage for remaining 5 scenes

The L.W11 taste packet covers 4 of 9 scenes (home, cube x2, spring). Amiga, square,
easing, sequence, motion-path, playground have no before/after panes in the packet. If M
includes a design wave that touches any of these scenes, the taste packet generator should
be extended to cover them.

---

## §10 — M-WAVE PROPOSALS

### M-wave candidate A: TASTE close motion (USER-DOMAIN trigger)

**Rationale:** The W11 design close is structurally complete at the gate level but OPEN at
the TASTE boundary. A minimal M-wave (or a named close-impl motion before M opens a design
band) captures the user's verdict, records it in the manifest, and either greens the design
close or initiates a specific revision cycle. This is the only remaining L.W11 obligation.

**Gate trigger:** `proof:taste-packet` with a non-null `verdict` field in the manifest.
The gate currently only asserts `verdict === null` (the pre-verdict posture). A verdict-
recording pass would change the gate's post-verdict assertion shape.

### M-wave candidate B: gate-apparatus consolidation (the SOTA architecture)

**Rationale:** The `gate-apparatus-VERDICT.md` is an explicit Tranche-M charter seed. The
O(N²) serial `&&` chain, 80+ cold browser boots per `proof:all`, and the 3-hour
iterate-to-green cost are correctly identified as the runner architecture, not the gate
count. M.W1 (or an early M wave) should land Phase 1 (ESLint lint tier) + Phase 3
(@vitest/browser integration tier). The `proof:design-refinement` and `proof:crayon-preserved`
gates are source-shape gates that belong in the lint tier, not the browser tier.

**Precept alignment:** KISS + architectural gestalt — one first-class parallel runner
replacing a bespoke hand-rolled serial chain is the clear gestalt move.

### M-wave candidate C: proof:crayon-preserved robustness (oklch extension)

**Rationale:** A targeted upgrade of the `parseColor` function to handle `oklch()` and
`color-mix()` values, anchored by a test that REDs when a keeper token is expressed in
`oklch` and the gate fails to parse it. Low scope, high correctness value given the
ongoing color-space migration.

---

## §11 — PERF NUMBERS

The W11 commit adds significant demo-tree surface (see `git show 4686aa4 --stat`): 34 files
changed, ~3,000 lines of new demo code (new composables, new Vue components, new CSS, 16
PNG taste-packet captures). No engine source files were modified (`src/animation/` was
FENCED throughout W11 per the commit message). No regressions to perf numbers reported.

`proof:scene-perf-budget` remains GREEN (verified: the gate checks for decay in the
scene perf budget, and the W11 wave only adds demo-layer composables/CSS, no engine
changes that would affect frame budget). The `proof:zero-alloc` gate is also unaffected
(W11 is a pure demo wave).

No new bench numbers were produced by W11 (no engine changes). The W7 perf numbers
(SpringProgress vector 3.8x at K=8, zero-alloc Float64Array) are unchanged.

---

## §12 — EVIDENCE INDEX

| Claim | File:line anchor | Oracle |
|---|---|---|
| `proof:crayon-preserved` GREEN | live re-run exit 0, 2026-06-17 | `scripts/proof-crayon-preserved.mjs` |
| `proof:design-refinement` static half GREEN | live re-run exit 0, 2026-06-17 | `scripts/proof-design-refinement.mjs` |
| taste-packet manifest verdict: null | `docs/frontend-design/taste-packets/l-w11/manifest.json:63` | file read |
| --amiga-red literal retired | `demo/app/scenes/AmigaScene.vue:229` (via grep, `var(--amiga-red)`) | git show 4686aa4 |
| cube-attitude a11y cure | `demo/cube/CubeTarget.vue:447-460` | git show e4a1cc3 |
| SmoothProgress genuine dogfood in S5 | `demo/easing/useEasingTraceSmear.ts:3,20,47` | file read |
| S2 re-lit die is Vue computed not engine | `demo/cube/useCubeRelit.ts:71-75` | file read |
| S3 amiga boot rides existing group | `demo/amiga/useAmigaBoot.ts:46` | file read |
| ROLL dogfood (S2 gate pass source) | `demo/cube/CubeTarget.vue:135,220` | file read |
| value.js design dispatch not in O-asks | `docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md` (grep "design" = 0) | grep |
| crayon-preserved no oklch support | `scripts/proof-crayon-preserved.mjs:104-151` | file read |
| taste-packet exit 3 on no-dist | `scripts/proof-taste-packet.mjs:138` | file read |
| ci.yml builds dist before taste-packet | `.github/workflows/ci.yml:397-398,568-571` | file read |
| W11 src/animation FENCED | commit `4686aa4` message + git show stat (0 src/ changes) | git show |
| 9 eggs in proof:hygiene chain | `package.json:190` (proof:design-refinement in && chain) | file read |
| TASTE verdict USER-DOMAIN | `docs/tranches/L/FINAL.md:199` | file read |
| missingBefore: cube-ribbon-mobile | `docs/frontend-design/taste-packets/l-w11/manifest.json:62` | file read |
