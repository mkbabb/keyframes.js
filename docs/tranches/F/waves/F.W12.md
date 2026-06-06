# F.W12 — CSS-native MotionPath (animate `offset-distance` over an author `offset-path` — WAAPI-eligible, zero value.js dep)

**Phase:** IMPL · **Class:** MINOR (the published library — an additive new public primitive,
`MotionPath`/`fromMotionPath`, that emits a WAAPI-eligible `offset-distance` animation; no
existing pixel moves) · **Scope:** `src/animation/` — a new light/heavy-correct path-motion
factory composing `CSSKeyframesAnimation.fromKeyframes` + the existing WAAPI eligibility gate
(`waapi.ts:72-164`) and `toWAAPIOptions` (`waapi.ts:247-285`); a `demo/` scene · **DAG: F.W12
is engine-side, INDEPENDENT** (`F.md §The DAG` — no shared surface with the perf/parsing/orch
bands; runs in parallel) · **Gated on:** keyframes' own green CI (inv-27).

**Title.** *The one real competitor-feature gap with a cheap, idiomatic close: a `MotionPath`
that animates `offset-distance: 0% → 100%` along an author-supplied `offset-path`. Pure
WAAPI-eligible CSS — no geometry math, no value.js change, compositor-thread; the heavier
SVG-geometry half is correctly hand-off-and-booked, not forced.*

The 2026 animation-library frontier widened the one persisting gap the post-E engine still
carries: the SVG suite (MotionPath / MorphSVG / DrawSVG / SplitText). GSAP went 100% free in
2026 (Webflow) — MorphSVG/DrawSVG/MotionPathPlugin/SplitText are no longer paywalled
differentiators but baseline expectations; anime.js v4 ships `morphTo`/`createMotionPath`/
`createDrawable` as core (`r-anim-libs-2026 F26-1`, TL;DR §1). keyframes ships **zero**
path/SVG primitives. But that gap is THREE distinct capabilities, and they split cleanly
across the engine's existing boundary (`r-anim-libs-2026 F26-1` §transposition): the
**CSS-native MotionPath** half — `offset-distance` over `offset-path` — is *pure WAAPI-eligible
CSS*, needs NO new geometry, reuses the existing eligibility gate + `toWAAPIOptions`, runs
compositor-thread, and ships engine-side TODAY with zero value.js dep. The numeric/canvas
MotionPath, MorphSVG, and DrawSVG are value-domain geometry math (parse `d` → cubic-bézier AST
→ length-parametrized sampler) and route OUT as `value.js-HANDOFF VJ-F1` (BOOKED, §Folds). This
wave ships the sliver; it manufactures nothing of the heavy half.

**The Mandate spine (binding — `F.md §Mandate`).** NO quick solution / NO workaround:
`MotionPath` REUSES the one WAAPI eligibility gate (`isWAAPIEligible`, `waapi.ts:72`) — it does
NOT bolt on a parallel path-specific eligibility predicate; the path animation is just a
`CSSKeyframesAnimation` over `offset-distance` that passes the existing gate. NO legacy: the
primitive lands as one motion on the existing `from*` factory family + the `animate()`
front-door dispatch (`animate.ts`), not a second geometry home beside it. Measure-first does
NOT bind a perf *claim* here (the win is "compositor-thread vs nothing" — additive capability,
not a speedup of an existing path); the gate is a falsifiable *eligibility + compositor-thread*
assertion, not a bench. Isomorphic/additive: zero existing pixel moves (`r-anim-libs-2026
F26-1` isomorphism). inv-16: the geometry sampler is PROPOSED to value.js (VJ-F1), never
written here. inv ε: every claim cites `file:line` against live `tranche-e-impl`.

**Provenance.** `r-anim-libs-2026 F26-1a` (CSS-native MotionPath → SHIP-in-F, the highest-ROI
competitor close, zero value.js dep, reuses the WAAPI gate) + `F26-1` competitive map (the
`MotionPath / offset-path` row = GAP for keyframes post-E) + the F26-1b/1c BOOK + VJ-F1 hand-off
(`r-anim-libs-2026 §value.js hand-off`).

---

## § State, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-e-impl`:

1. **keyframes ships ZERO path/SVG primitives.** `r-anim-libs-2026 F26-1` (re-grounded):
   `grep -rniE "offset-path|offsetDistance|getPointAtLength|getTotalLength|motionPath|morphTo|drawable" src/` → **zero hits**. `morph.ts:1` imports only `NumericAnimation` and computes a
   straight-line rect→rect `translate()/scale()` (no curve, no path). The baseline F-6
   (MotionPath) was dispositioned **BOOK** pre-E and did **NOT** land (the E.W10 tier shipped
   stagger/flip/drag/decay/Sequence/animate — NOT path/SVG; `E/FINAL.md` W10 row, verified). The
   `offset-distance`/`offset-path` competitive-map row is a plain **GAP** vs Motion / GSAP
   MotionPathPlugin / anime.js `createMotionPath` (`r-anim-libs-2026` competitive map).

2. **`offset-distance` is animatable, WAAPI-eligible CSS — it interpolates as a
   `<length-percentage>`.** `r-anim-libs-2026 F26-1` (modern-web-guidance corpus): `offset-path`
   / `offset-distance` are animatable and compositor-friendly; `offset-distance` is
   WAAPI-eligible (a plain animatable CSS property, no computed-unit or color disqualifier). So
   a `@keyframes { 0% { offset-distance: 0% } 100% { offset-distance: 100% } }` over an author
   `offset-path` is exactly the shape the engine already parses and delegates.

3. **The eligibility gate is a single source of truth and already admits this shape.**
   `isWAAPIEligible` (`waapi.ts:72-164`) decides delegation ONCE (the docstring: "Single source
   of truth — the `Animation.play()` dispatcher consults this once"). Its five clauses —
   DOM target (`waapi.ts:75-83`), default renderer (`:91`), uniform timing (`:99-123`), no
   computed unit (`:141-152` against `WAAPI_INELIGIBLE_UNITS`), no color (`:153-158`) — are ALL
   satisfied by an `offset-distance` percent-keyframe on a DOM element with a uniform CSS-twin
   easing. `offset-distance` is a `<length-percentage>` whose `%` resolves against the path
   length, NOT a viewport/container unit, so it is NOT in `WAAPI_INELIGIBLE_UNITS` (verify: the
   `%` rejection at `:141-152` is keyed on `WAAPI_INELIGIBLE_UNITS`, which holds the
   viewport/container/`calc`/`var` set — confirm `offset-distance`'s percent is path-relative
   and exempt, the one MEASURE-FIRST sub-clause, §Design decisions 3).

4. **`toWAAPIOptions` + the dense sub-segment sampler already carry the curve.**
   `toWAAPIOptions` (`waapi.ts:247-285`) emits the uniform easing's `Easing.css` twin (`:274`,
   a spring's `linear()` or a `cubic-bezier()`); `toWAAPIKeyframes` densifies each segment to
   `WAAPI_SUBSEGMENT_STOPS = 8` (`waapi.ts:177`, F3, E.W9) so a non-linear path traversal tracks
   the rAF curve. A `MotionPath` rides BOTH unchanged.

5. **The `animate()` front door dispatches by input shape onto the `from*` factories.**
   `animate.ts:1-40` is the single-call DX front door (`motion.animate`/`gsap.to`/anime
   `animate` analogue): a CSS string → `.fromString`, a keyframe map → `.fromKeyframes`, a vars
   array → `.fromVars`. It is HEAVY-boundary-correct (rides `loadAnimationEngine`,
   `animate.ts:21-27`). `MotionPath` slots onto this surface as a new factory shape, not a new
   home.

The wave's job: ship a `MotionPath` that builds an `offset-distance` keyframe animation over an
author `offset-path`, sets `offset-path` on the target, and rides the existing WAAPI gate +
`toWAAPIOptions` to the compositor — closed by an eligibility + compositor-thread gate that
BITES, with the geometry-heavy half hand-off-and-booked.

---

## § Goal

**What lands** (one additive WAAPI-eligible primitive — `proof:motion-path` green):

- **A `MotionPath` factory** (`src/animation/`) — `fromMotionPath(target, { path, from?, to?,
  ...options })` (or a `MotionPath` class composing `CSSKeyframesAnimation.fromKeyframes`) that:
  (a) sets `offset-path: path(...)` / `offset-path: <url>` on the target (the author-supplied
  path); (b) builds a `@keyframes`-equivalent over `offset-distance: from% → to%` (default
  `0% → 100%`), optionally with `offset-rotate` for tangent-following; (c) returns the
  constructed animation as the control handle (the `animate()` contract — `.play()`/`.pause()`/
  `.stop()`/awaitable promise).
- **It passes the existing WAAPI eligibility gate unchanged** — `isWAAPIEligible` returns
  `{ eligible: true }` for a `MotionPath` over a DOM target with a uniform CSS-twin easing, and
  `playWAAPI` delegates it compositor-thread (`waapi.ts:297`). No new eligibility predicate.
- **`animate()` front-door dispatch** (optional, the ergonomic completion) — a `{ path }`-shaped
  input routes to `fromMotionPath`, consistent with `animate.ts`'s shape-dispatch; HEAVY-boundary
  -correct (rides `loadAnimationEngine`, adds NO new static value.js edge).
- **A demo scene** exercising `MotionPath` (an element traversing an author path), dogfooding
  the new primitive the way the cube proves `AnimationGroup`; it should respect F.W16's promoted
  rail/ball idiom where it draws a track (`F.md §The DAG` cross-band coupling).
- **`proof:motion-path`** (new) wired into CI: the eligibility + compositor-thread assertion.

**Recorded-BOOK + value.js-HANDOFF** (named, dispositioned, NOT this wave):
- **Numeric / canvas MotionPath** (sample an SVG `<path>` via `getPointAtLength`, feed
  `NumericAnimation`) — the heavier half of F26-1a → **BOOK behind VJ-F1** (the geometry sampler).
- **MorphSVG** (`S2`/`NEW-33-1b`) + **DrawSVG** (`NEW-33-1c`) — **BOOK + value.js-HANDOFF VJ-F1**.
- **SplitText analogue** (`S3`/`NEW-36`) — **BOOK** (value.js-free `splitText({by})` over
  `Intl.Segmenter`, feeding `stagger`; the demo grapheme-fix is `r-anim-libs-2026 F26-4`).

**Why:** the SVG suite is the one persisting competitor gap and 2026 widened it (GSAP-free
shift), but the CSS-native MotionPath sliver is the F-1-class "cheap win that composes with
what's there" — it reuses the eligibility gate, the dense sampler, `toWAAPIOptions`, and the
`animate()` front door, runs compositor-thread, and needs ZERO value.js change
(`r-anim-libs-2026 F26-1` §perf). The heavy half (path-`d` geometry) is value-domain and
correctly routed to value.js (VJ-F1) — manufacturing a second geometry home in keyframes would
breach the boundary the §ALREADY-SOTA record protects. F ships the sliver, books the rest
honestly.

---

## § Scope

One additive primitive lands (S1) + the front-door dispatch (S2) + the demo scene (S3); three
items are BOOK + VJ-F1. Every claim is `file:line`-grounded.

### S1 — `MotionPath`: animate `offset-distance` over an author `offset-path` (`r-anim-libs-2026 F26-1a`) — SHIP-in-F

**WHAT:** a `fromMotionPath(target, { path, from = "0%", to = "100%", rotate?, ...options })`
factory (or a `MotionPath` class) in `src/animation/`. It (a) sets `offset-path` on the target
to the author-supplied `path` (a `path()`/`ray()`/`<url>` reference per the CSS `offset-path`
grammar) and optionally `offset-rotate` for tangent-following; (b) constructs a
`CSSKeyframesAnimation.fromKeyframes({ [from]: { "offset-distance": from }, [to]: {
"offset-distance": to } })`-equivalent (the engine's existing keyframe→frame pipeline,
`engine.ts` `fromKeyframes`); (c) returns the animation as the control handle. It carries NO
geometry math — the browser owns the `offset-path` → position resolution; keyframes only
interpolates the scalar `offset-distance`.

**WHY:** `offset-distance` over `offset-path` is pure WAAPI-eligible CSS that interpolates as a
`<length-percentage>` (State 2) — the engine already parses, frames, and delegates exactly this
shape. It is the highest-ROI competitor-feature close: zero value.js dep, zero new geometry
home, compositor-thread (`r-anim-libs-2026 F26-1a`). The primitive is the natural completion of
the `from*` factory family — `fromString`/`fromKeyframes`/`fromVars`/`fromMotionPath`.

### S2 — `animate()` front-door dispatch onto `fromMotionPath` (`animate.ts`) — SHIP-in-F (ergonomic completion)

**WHAT:** extend `animate.ts`'s construction-time shape-dispatch (`animate.ts:1-40`) so a
`{ path, ... }`-shaped input routes to `fromMotionPath`, consistent with the existing
string→`fromString` / map→`fromKeyframes` / array→`fromVars` branches. HEAVY-boundary-correct:
`animate.ts` already statically imports `./engine` (`animate.ts:30`) and rides
`loadAnimationEngine`, so the dispatch adds NO new static value.js edge (inv α; `proof:boundary`
untouched).

**WHY:** the `animate()` front door is the genre's DX baseline (`r-anim-libs-2026 A26-4`,
ALREADY-SOTA); routing `MotionPath` through it makes the primitive discoverable through the
same single-call surface as every other factory, with zero boundary cost. Pure
construction-time dispatch — no new engine logic (`animate.ts`'s own discipline).

### S3 — A `MotionPath` demo scene (dogfood) — SHIP-in-F (additive)

**WHAT:** a `demo/` scene (a new `app/scenes/*Scene.vue` or a self-contained target) that drives
an element along an author `offset-path` via `MotionPath`, proving the primitive the way the
cube proves `AnimationGroup`. Where the scene draws a visible track/marker, it consumes F.W16's
promoted `progress-rail`/`progress-ball` idiom (`design-idioms.css`) rather than re-authoring a
fifth rail recipe (`F.md §The DAG` — the cross-band coupling; F.W16 lands the idiom).

**WHY:** the proof IS the demo (`r-anim-libs-2026 F26-3` discipline, the inv-ζ dogfood posture);
a path-motion scene is the textbook MotionPath shop-window. Additive — no existing scene moves.
The rail/ball consumption is the explicit DAG coupling so the new scene does not drift the idiom
F.W16 converges.

> **BOOK + value.js-HANDOFF in this band (named, NOT this wave) — `r-anim-libs-2026`:**
> - **Numeric/canvas MotionPath + MorphSVG (`S2`/`NEW-33-1b`) + DrawSVG (`NEW-33-1c`)** — the
>   path-`d` geometry sampler (parse `d` → typed cubic-bézier segment AST → length-parametrized
>   sampler + a point-count-reconciling `d`-lerp, the anime.js `morphTo(path, precision)` model)
>   is **value-domain geometry math**, NOT animation-loop logic — and it is **MISSING from the E
>   `valuejs-sota-handoff.md`** (its Waves A–F are parse/color/computed-unit/interpolation; no
>   path geometry). **value.js-HANDOFF VJ-F1** (carried in `valuejs-sota-handoff-v2.md`): propose
>   a value.js path-geometry wave. inv-16 — propose, never write. The numeric MotionPath, MorphSVG,
>   and DrawSVG all unblock once VJ-F1 lands; until then **BOOK**.
> - **SplitText analogue (`S3`/`NEW-36`)** — **BOOK** (a value.js-free `splitText(element, { by:
>   "chars"|"words"|"lines" })` over `Intl.Segmenter` — Baseline 2024, grapheme-correct — wrapping
>   each unit in a span to feed `stagger`; the natural completion of the stagger story E shipped).
>   It is net-new DOM surface (wrap/unwrap, a11y aria reconstruction, line re-split on resize)
>   deserving a deliberate design pass, not an F drive-by (`r-anim-libs-2026 F26-4`). The
>   **demo-side grapheme fix** (the demo's `AnimatedText.vue:2` splits by raw UTF-16 code unit,
>   breaking on emoji/combining marks) is folded by F.W16 §S2 (the hero typography pass).
> - **Per-property keyframe easing (`F26-5`)** — **KILL (record)**: CSS `@keyframes` is per-frame
>   by construction (the engine's core LEAD is fidelity to that format); a per-property axis would
>   diverge the runtime from the CSS source it parses. The idiomatic answer (separate animations
>   per property / an `AnimationGroup` with per-layer easing) already exists. Recorded so no future
>   lane re-raises it.
> - **Reactive motion-value graph (`F26-6`)** — **RECORD**: a binding-layer concern (Vue/React),
>   out of the framework-agnostic engine's scope; `SpringProgress.subscribe`/`Draggable.subscribe`
>   are the right primitive and complete. A `useMotionValue` Vue composable would be the *demo's*
>   showcase, not an engine addition.

---

## § Hard gate (`proof:motion-path` — falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real eligibility / delegation test,
not an assertion). The instrument is `proof:motion-path` (new), wired into CI by F.W2's
`proof:all` (`F.md §F.W2`):

1. **`MotionPath` builds an `offset-distance` animation over the author `offset-path` (S1).** A
   test asserts `fromMotionPath(el, { path })` (a) sets `el.style.offsetPath` (or
   `offset-path`) to the author path, and (b) produces a frame set whose interpolating key is
   `offset-distance` sweeping `from% → to%`. **BITE:** strip the `offset-path` set, or build over
   a non-`offset-distance` key → the structural assertion reds. Reds today (no MotionPath exists
   — verified State 1).

2. **The animation passes the EXISTING WAAPI eligibility gate — no new predicate (S1).**
   `isWAAPIEligible(motionPathAnimation)` returns `{ eligible: true }` for a DOM target +
   uniform CSS-twin easing (the same gate at `waapi.ts:72`, consulted unchanged). **BITE:** mark
   `offset-distance`'s percent as a `WAAPI_INELIGIBLE_UNIT` (treating it as a viewport `%`) →
   eligibility flips to `false` and the clause reds; OR add a path-specific eligibility branch →
   the "reuses the one gate" assertion (a grep for a second eligibility predicate) reds.

3. **The eligible `MotionPath` delegates compositor-thread (S1).** Under a WAAPI-capable target
   (an `Element.animate` spy), `playWAAPI` is taken (`waapi.ts:297`) and `target.animate` is
   called with `offset-distance` keyframes + `toWAAPIOptions`' easing (the CSS-twin, not bare
   `linear` when one is present) — the compositor-thread path. **BITE:** force the rAF path
   (eligibility `false`) → the `target.animate` spy records zero calls and the delegation clause
   reds.

4. **`animate({ path })` dispatches to `fromMotionPath` (S2).** A test asserts a `{ path }`-shaped
   `animate()` input constructs a MotionPath animation (the same control-handle contract as the
   other shapes). **BITE:** route `{ path }` to `fromString`/`fromVars` → the dispatch assertion
   reds. `proof:boundary` stays green (no new static value.js edge — `animate.ts` is already
   heavy).

5. **The demo scene exercises `MotionPath` + respects the F.W16 idiom (S3).** `proof:dogfood`
   (or `proof:motion-path`'s scene clause) asserts the new scene constructs a `MotionPath`; a
   `proof:idioms` grep asserts the scene's track (if any) consumes `progress-rail`/`progress-ball`,
   not a new rail recipe. **BITE:** delete the scene's `MotionPath` callsite → the dogfood clause
   reds; re-author a scoped rail block → the idiom grep reds (the F.W16 convergence).

6. **No regression / additive-only.** `npm test` stays green; every existing eligibility,
   delegation, and frame test is byte-identical (MotionPath is additive — no existing path moves).
   **BITE:** any WAAPI/eligibility/frame test regression reds (the primitive is not additive if a
   test moves).

**The eligibility-reuse discipline (the wave's non-negotiable).** `MotionPath` admits to WAAPI
through the ONE existing `isWAAPIEligible` gate — NOT a parallel path-specific predicate. If a
future change needs a second eligibility branch for path motion, that is the signal the
transposition was wrong; the gate stays single-sourced (the §ALREADY-SOTA record on the WAAPI
gate, `waapi.ts:49-53`).

---

## § Folds

Retires (by finding id):
- **`r-anim-libs-2026 F26-1a`** (CSS-native MotionPath — the SHIP-in-F sliver) — S1 + S2 + gate
  clauses 1/2/3/4.
- **`r-anim-libs-2026 F26-3` corollary** (the path-motion shop-window / dogfood) — S3 + gate
  clause 5.

**Routed OUTWARD to `value.js-HANDOFF` (inv-16 — proposed in `valuejs-sota-handoff-v2.md`, never
written here):**
- **VJ-F1 — path-geometry sampler** (the numeric MotionPath + MorphSVG `F26-1b` + DrawSVG
  `F26-1c` enabler): parse `d` → typed segment AST → length-parametrized sampler + point-count-
  reconciling `d`-lerp. NET-NEW vs the E handoff.

**Recorded BOOK / KILL / RECORD (named, NOT this wave):**
- **MorphSVG (`F26-1b`) + DrawSVG (`F26-1c`) + numeric/canvas MotionPath** — **BOOK** behind
  VJ-F1.
- **SplitText analogue (`F26-4`/`NEW-36`)** — **BOOK** (value.js-free `splitText` over
  `Intl.Segmenter`; the demo grapheme-fix folds into F.W16 §S2).
- **Per-property keyframe easing (`F26-5`)** — **KILL (record)** (CSS-`@keyframes` fidelity forces
  per-frame; the LEAD depends on it).
- **Reactive motion-value graph (`F26-6`)** — **RECORD** (binding-layer; out of engine scope).

---

## § Design decisions

1. **MotionPath ships the CSS-native sliver ONLY — the geometry half is hand-off-and-booked.**
   RESOLVED: the SVG suite is three capabilities, and `offset-distance` over `offset-path` is the
   one that is pure WAAPI-eligible CSS with zero value.js dep (`r-anim-libs-2026 F26-1` §two-track
   transposition). Shipping the geometry half (path-`d` parse + length-parametrized sampler +
   point-count reconciliation) in keyframes would grow a SECOND geometry home beside value.js's
   value engine — a boundary breach the §ALREADY-SOTA record (the value.js boundary) forbids. The
   honest move is: ship the sliver, propose VJ-F1, BOOK MorphSVG/DrawSVG/numeric-MotionPath behind
   it. Trade-off: the record carries a visible "MorphSVG/DrawSVG: not yet" — but a named gap behind
   a clean hand-off beats a keyframes-local geometry engine that duplicates value.js's domain.

2. **Reuse the ONE eligibility gate — no path-specific predicate.** RESOLVED: `MotionPath` is just
   a `CSSKeyframesAnimation` over `offset-distance`; it must pass `isWAAPIEligible` (`waapi.ts:72`)
   unchanged, like any other animation. A second eligibility branch for path motion would
   contradict the gate's stated single-source-of-truth invariant (`waapi.ts:49-53`) and the
   §ALREADY-SOTA WAAPI-gate record. The gate already admits the shape (State 3); the wave proves it
   does (gate clause 2). Trade-off: none — this is the idiom-preserving design; if a path animation
   needs a special-case, that is the signal it is NOT the CSS-native sliver and belongs in the
   VJ-F1 numeric half.

3. **`offset-distance`'s percent is path-relative, NOT a layout-dependent unit — MEASURE-FIRST the
   exemption.** RESOLVED (the one verify-before-ship sub-clause): the WAAPI computed-unit rejection
   (`waapi.ts:141-152`) keys on `WAAPI_INELIGIBLE_UNITS` (the viewport/container/`calc`/`var` set,
   where `%` resolves against a layout box WAAPI can't track per-frame). `offset-distance`'s `%`
   resolves against the **path length**, which the compositor DOES resolve correctly at keyframe
   computation — so it is exempt, NOT a frozen-to-px hazard. Before shipping, VERIFY (not assert)
   that an `offset-distance: 0%→100%` keyframe is NOT caught by the `%`/computed-unit rejection
   (gate clause 2's bite covers the regression direction). Trade-off: this is the one place the
   transposition rests on a unit-classification fact — so it is gated falsifiably, not asserted
   (inv ε).

4. **The demo scene respects F.W16's idiom — the cross-band coupling is honored.** RESOLVED
   (`F.md §The DAG`): the MotionPath scene lands a new demo surface, and the demo band's rule is
   "no new rail recipe" (F.W16 converges the rail/ball idiom to `design-idioms.css`). The scene's
   track, if any, consumes `progress-rail`/`progress-ball` — so F.W12's additive scene does not
   re-introduce the drift F.W16 eliminates. Trade-off: F.W12's scene gates softly on F.W16's idiom
   landing — but both are in-tranche and the coupling is named in the DAG; the scene can ship its
   `MotionPath` callsite first and adopt the idiom class when F.W16 lands.

5. **Additive primitive — measure-first binds the eligibility, not a speedup.** RESOLVED: the win
   is a NEW capability (path motion), compositor-thread by riding the existing WAAPI delegation —
   not a speedup of an existing path, so there is no "X× faster" claim to shape a bench around. The
   gate is therefore a falsifiable *eligibility + compositor-thread delegation* assertion (clauses
   2/3), which is the correct measure-first instrument for an additive WAAPI-eligible primitive
   (the same discipline the E.W9 platform adopts proved). Trade-off: none — a capability gate that
   bites on its negative is the honest proof for additive surface.
