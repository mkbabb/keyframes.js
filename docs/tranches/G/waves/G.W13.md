# G.W13 — The two narrow net-new engine SHIPs (DrawSVG · `.finished`)

**Phase:** IMPL — spec authored in DEV, awaits authorization (the D/E/F dev/impl
boundary) · **Class:** SHIP-in-G (the published library — two additive public
surfaces: a `fromDrawSVG` factory that emits a WAAPI-eligible
`stroke-dashoffset` animation, mirroring `motion-path.ts`; and a `get
finished()` over the play promise the engine already holds. No existing pixel
moves; no value.js edge) · **Scope:** `src/animation/` — a new
`draw-svg.ts` light/heavy-correct factory composing
`CSSKeyframesAnimation.fromKeyframes` + the EXISTING WAAPI eligibility gate
(`waapi.ts:98`) + `toWAAPIOptions` (`waapi.ts:291`); a `get finished()` getter on
`Animation`/`CSSKeyframesAnimation` (`engine.ts:946`), `AnimationGroup`
(`group.ts`), and `Sequence` (`sequence.ts:335`) over the held `_playingPromise`;
the barrel edge (`index.ts` — `fromDrawSVG` behind `loadAnimationEngine()`); two
new gate scripts (`proof:drawsvg`, `proof:finished`) wired into `proof:all`
(`package.json:64`) — ZERO demo/CI behaviour edit beyond the gate scripts ·
**DAG: engine-side, INDEPENDENT** of Bands 0–5 (the re-pin `G.W2` touches no
animation factory; both SHIPs are additive surface with no shared file with the
perf/parsing/frontend/styling bands) — runs in parallel; Band-6 sibling of
`G.W14` (modern-web checklist), file-disjoint · **Gated on:** keyframes' own
green CI (inv-27).

**Title.** *F closed three of the six pre-F animation-SOTA gaps and left the
engine substantially SOTA; two cheap additive gaps remain. (1) DrawSVG — the
CSS-native sliver of the SVG suite F bundled (wrongly) with the
geometry-blocked MorphSVG: stroke line-drawing is `stroke-dashoffset: L → 0`
over `stroke-dasharray: L` where `L = el.getTotalLength()` — ONE DOM read, NO
`d`-parse, NO point-count reconciliation, NO value.js geometry, WAAPI-eligible.
It mirrors `motion-path.ts` exactly. (2) `.finished` — the genre's idiomatic
"await this animation" front-door, an additive getter over the play promise the
engine already holds, resolving once at end / pre-resolved when settled. Two
narrow surfaces; the rest of the frontier is BOOK (value.js-blocked) or RECORD.*

This is the **F26-1c re-split** + the **NEW-10 land** — both BOOKed in F, both
re-examined on `tranche-g-dev` and graduated to SHIP because each is a tiny,
value.js-free, isomorphism-safe addition that reuses an existing seam. DrawSVG
needs NONE of the path-`d` geometry sampler that keeps MorphSVG / numeric
MotionPath BOOKed under value.js VJ-F1 (`r-animation-sota G26-1`); `.finished`
exposes the promise `play()` already constructs (`engine.ts:977`,
`group.ts:507`, `sequence.ts:362`). Both are additive — no existing path moves.
NOT a frontier expansion.

**The Mandate spine (binding — `_SYNTHESIS-gap-scorecard §THESIS` + the G
charter).** NO quick solution / NO workaround: DrawSVG REUSES the one WAAPI
eligibility gate (`isWAAPIEligible`, `waapi.ts:98`) unchanged — it does NOT bolt
on a stroke-specific eligibility predicate; the draw animation is just a
`CSSKeyframesAnimation` over `stroke-dashoffset` that passes the existing gate.
`.finished` exposes the EXISTING `_playingPromise` (`engine.ts:953`) — it does
NOT mint a second completion-promise lifecycle beside `play()`. NO legacy: both
land as one motion on the existing `from*` factory family / the existing play
machinery, NOT a second geometry home or a parallel completion channel. NO god
module: `draw-svg.ts` is its own ~80L cohesive factory file (mirroring
`motion-path.ts` 191L), NOT a graft onto `engine.ts`. KISS · DRY: `getTotalLength`
is read ONCE at construction (the `motion-path.ts` "browser owns the geometry,
kf interpolates a scalar" pattern, `motion-path.ts:5-11`); `.finished` returns
the one held promise, not a fresh one per call. Measure-first does NOT bind a
perf *claim* (both are additive capability/ergonomics, not a speedup of an
existing path; `r-animation-sota G26-2/G26-5` isomorphism); the gates are
falsifiable *structural + eligibility + resolution* assertions, NOT benches.
Isomorphic/additive: zero existing pixel moves. inv-16: DrawSVG needs ZERO
value.js change (the geometry-heavy MorphSVG/numeric-MotionPath stay
value.js-HANDOFF VJ-F1, §Folds). inv ε: every claim below cites `file:line`,
source-verified on `tranche-g-dev`, not asserted.

**Provenance.** `r-animation-sota G26-2` (DrawSVG — the SHIP-able CSS-native
sliver, `fromDrawSVG`, one `getTotalLength()`, mirrors `motion-path.ts`,
WAAPI-eligible, zero value.js dep; the F26-1c re-split from the geometry bundle)
+ `r-animation-sota G26-5` (`get finished()` over the held play promise; the
NEW-10 land). Synthesised at `_SYNTHESIS-gap-scorecard §1` (animation-SOTA row:
"2 narrow net-new engine SHIPs: DrawSVG … `.finished` getter") + `§2 Band 6
G.W13` + `§3 SHIP-in-G roll-up`. The §ALREADY-SOTA bulk binds: the engine
kernel, spring/decay/drag analytics, the complete Sequence transport, the
CSS-native MotionPath, the WAAPI harness, the orchestration tier, and the
interpolation core are SOTA and untouched (`r-animation-sota §ALREADY-SOTA`
A-G1..A-G7).

---

## § State, verified (not asserted)

The live facts, `grep`- and read-confirmed on `tranche-g-dev`:

1. **keyframes ships ZERO stroke/draw primitives.** Verified live: `grep -rniE
   "getTotalLength|getPointAtLength|stroke-dasharray|stroke-dashoffset|fromDrawSVG|drawable"
   src/` returns ONE hit — the `motion-path.ts:17` docstring naming DrawSVG as a
   geometry-half BOOK — and NOTHING else. There is no `draw-svg.ts`, no stroke
   factory, no `getTotalLength` read anywhere in `src/`. The `DrawSVG` row in the
   competitive map is a plain GAP vs GSAP DrawSVGPlugin (100% free, Webflow) and
   anime.js `createDrawable()` (`r-animation-sota` competitive map; G26-2).

2. **`motion-path.ts` is the exact template — and it explicitly BOOKs DrawSVG
   with MorphSVG, which G26-2 RE-SPLITS.** Verified live `motion-path.ts:14-18`:
   the docstring states the heavier SVG-geometry half — "parse a path `d` to a
   length-parametrized sampler (numeric/canvas MotionPath, MorphSVG, DrawSVG) —
   is value-domain geometry math, routed OUT to value.js (VJ-F1) and BOOKED, NOT
   manufactured here." **That bundling is wrong for DrawSVG** (`r-animation-sota
   G26-2` insight): DrawSVG needs NO `d`-parse and NO point-count reconciliation
   — only ONE `getTotalLength()` DOM read at construction, exactly the
   `motion-path.ts` pattern of "the BROWSER owns the geometry resolution;
   keyframes only interpolates the scalar" (`motion-path.ts:5-11`). MorphSVG +
   numeric MotionPath genuinely need the VJ-F1 sampler; DrawSVG does not.

3. **`stroke-dashoffset` is a plain animatable `<length>` — WAAPI-eligible,
   compositor-friendly.** `r-animation-sota G26-2` (grounded against GSAP/anime,
   which both delegate it): `stroke-dasharray`/`stroke-dashoffset` are the exact
   mechanism the genre uses for line-drawing. A `@keyframes { 0% {
   stroke-dashoffset: L } 100% { stroke-dashoffset: 0 } }` is the shape the
   engine already parses, frames, and delegates — `stroke-dashoffset` carries no
   computed-unit or color disqualifier and is NOT in `WAAPI_INELIGIBLE_UNITS`
   (`waapi.ts:30`, the viewport/container/`calc`/`var` set). Unlike
   `offset-distance` it needs NO percent-exemption — it is a bare `<length>` in
   user units, the simplest eligible shape.

4. **The eligibility gate is a single source of truth and already admits this
   shape.** `isWAAPIEligible` (`waapi.ts:98`) decides delegation ONCE (the
   `play()` dispatcher consults it at `engine.ts:964`). Its clauses — DOM target,
   default renderer, uniform timing, no computed unit (`WAAPI_INELIGIBLE_UNITS`,
   `waapi.ts:30`), no color, faithful CSS-twin easing (`waapi.ts:160`) — are ALL
   satisfied by a `stroke-dashoffset` length-keyframe on an SVG DOM element
   (`<path>`/`<line>`/`<circle>` — DOM targets) with a uniform CSS-twin easing.
   The `offset-distance` exemption machinery (`PATH_RELATIVE_PERCENT_PROPERTIES`,
   `waapi.ts:56`) is NOT needed — DrawSVG sweeps an absolute `<length>`, not a
   path-relative `%`.

5. **`toWAAPIOptions` + the dense sub-segment sampler carry any easing curve.**
   `toWAAPIOptions` (`waapi.ts:291`) emits the uniform easing's `Easing.css` twin
   (a spring's `linear()` or a `cubic-bezier()`); `toWAAPIKeyframes`
   (`waapi.ts:232`) densifies each segment. A `fromDrawSVG` over a uniform easing
   rides BOTH unchanged.

6. **`.finished` does NOT exist as a public getter — completion is reachable
   ONLY via the awaited `play()` return.** Verified live: `grep -nE "get
   finished|finished:" src/animation/engine.ts src/animation/group.ts
   src/animation/sequence.ts` finds NO public getter. The `wa.finished`
   references (`engine.ts:893`) are internal WAAPI plumbing, not a public
   surface. So a consumer who holds an already-playing `Animation` and wants to
   await its completion has no clean getter — they must have captured the
   `play()` return (`r-animation-sota G26-5`).

7. **The promise `.finished` would expose ALREADY EXISTS and is held — the
   getter is pure surface, no new lifecycle.** Verified live:
   - `Animation.play()` constructs the play promise, stores it on
     `this._playingPromise` (`engine.ts:977`), and clears it on settle via
     `result.finally(() => { this._playingPromise = null; })` (`engine.ts:978-980`).
     A re-entrant `play()` returns the same promise (`engine.ts:953`). The
     resolution is driven by `_resolvePlay()` (`engine.ts:862-866`) at completion
     (`onEnd`), `stop()` (`engine.ts:1028`), and the reduced-motion snap
     (`_snapToReducedMotion`, `engine.ts:943`).
   - `AnimationGroup` carries the same field (`group.ts:68
     private _playingPromise`) and `_resolvePlay` (`group.ts:507-511`), set in
     `play()` and cleared on `finally` (the re-entrant guard
     `_SYNTHESIS-frontend`/`group.ts` contract).
   - `Sequence.play()` carries the identical pattern — `_playingPromise`
     (`sequence.ts:122`), set at `sequence.ts:362` with the `finally`-clear at
     `:368-370`, re-entrant (`sequence.ts:335` "a `play()` while one is in
     flight returns the same promise").
   So `get finished()` is a one-line read of the existing held promise — settled
   ⇒ a pre-resolved `Promise.resolve()`; in-flight ⇒ the held `_playingPromise`.
   No new state, no new lifecycle.

The wave's job: ship a `fromDrawSVG` factory that reads `getTotalLength()` once,
sets `stroke-dasharray`, builds a `CSSKeyframesAnimation` over `stroke-dashoffset`
that passes the EXISTING WAAPI gate, and a `get finished()` getter over the held
`_playingPromise` on the four playable surfaces — each closed by a gate that
BITES.

---

## § Goal

**What lands** (two additive surfaces — `proof:drawsvg` + `proof:finished` green):

- **A `DrawSVG` factory** (`src/animation/draw-svg.ts`) — `fromDrawSVG(target,
  { from = "0%", to = "100%", ...options })` (a `DrawSVG` class composing
  `CSSKeyframesAnimation.fromKeyframes`, mirroring `motion-path.ts`) that:
  (a) reads `L = target.getTotalLength()` ONCE at construction; (b) sets
  `stroke-dasharray: L` on the target (the dash pattern is the full length, so
  one solid dash); (c) builds a `@keyframes`-equivalent over `stroke-dashoffset:
  L*(1-fromFrac) → L*(1-toFrac)` (default `0% → 100%` ⇒ `L → 0`, the line draws
  in); (d) returns the constructed animation as the control handle (the
  `play()`/`pause()`/`stop()`/awaitable contract, the `animate()` family shape).
  It carries NO geometry math — the browser owns `getTotalLength`; keyframes only
  interpolates the scalar `stroke-dashoffset`.
- **It passes the existing WAAPI eligibility gate unchanged** — `isWAAPIEligible`
  returns `{ eligible: true }` for a `DrawSVG` over an SVG DOM target with a
  uniform CSS-twin easing, and `playWAAPI` (`waapi.ts:341`) delegates it
  compositor-thread. NO new eligibility predicate, NO percent-exemption.
- **HEAVY-boundary-correct** — `draw-svg.ts` statically imports `./engine` (it
  constructs `CSSKeyframesAnimation`), exactly like `motion-path.ts`
  (`motion-path.ts:37`); it carries NO `@mkbabb/value.js` import of its own; the
  barrel places `fromDrawSVG` behind `loadAnimationEngine()` so a light-only
  consumer never pulls it. `proof:boundary` stays green.
- **`get finished(): Promise<void>`** on `Animation`/`CSSKeyframesAnimation`
  (`engine.ts`), `AnimationGroup` (`group.ts`), and `Sequence` (`sequence.ts`)
  — returns the held `_playingPromise` when in flight, else an immediately
  -resolved `Promise.resolve()` when settled. Pure surface over the existing
  held promise; no new lifecycle.
- **`proof:drawsvg`** (new) + **`proof:finished`** (new) wired into CI via
  `proof:all` (`package.json:64`), mirroring the `proof:motion-path`
  registration (`package.json:61`).

**Recorded-BOOK + value.js-HANDOFF** (named, dispositioned, NOT this wave —
`r-animation-sota`):
- **MorphSVG + numeric/canvas MotionPath** (`G26-1`) — the path-`d` geometry
  sampler (parse `d` → typed segment AST → length-parametrized sampler +
  point-count-reconciling `d`-lerp, the anime.js `morphTo(path, precision)`
  model) is value-domain geometry math → **BOOK + value.js-HANDOFF VJ-F1** (not
  shipped in value.js 0.11.0 — verified `value.js/src/` has no geometry module).
  DrawSVG needs NONE of it.
- **`splitText` (`Intl.Segmenter`)** (`G26-3`) — **BOOK** (net-new DOM surface
  with a11y/resize lifecycle; the demo grapheme-fix already discharged in F.W16).
- **Intrinsic-size `0 → auto`** (`G26-4`) — **BOOK + value.js-HANDOFF E7 + RECORD
  don't-adopt-native-until-Baseline.**
- **Reactive motion-value graph** (`G26-6`) + **Rive/Theatre.js** (`G26-7`) —
  **RECORD** (binding-layer / different product).

**Why:** DrawSVG is the genuine highest-ROI engine-side close of the post-F
frontier — a competitor-feature gap (GSAP/anime ship it) with a cheap,
value.js-free, WAAPI-eligible implementation that reuses the exact
`motion-path.ts` shape, runs compositor-thread, and needs ZERO geometry home
(`r-animation-sota G26-2`). `.finished` is the smallest honest ergonomic gap vs
Motion/GSAP/WAAPI — an additive getter over a promise the engine already holds,
no new lifecycle (`r-animation-sota G26-5`). Both are additive; the heavy SVG
geometry (MorphSVG, numeric MotionPath) is value-domain and correctly routed to
value.js (VJ-F1) — manufacturing a second geometry home in keyframes would
breach the boundary the §ALREADY-SOTA record protects. G ships the two slivers,
books the rest honestly.

---

## § Scope

Two additive surfaces land — DrawSVG (S1) + `.finished` (S2); the heavy SVG
geometry is BOOK + VJ-F1. Every claim is `file:line`-grounded.

### S1 — `DrawSVG`: animate `stroke-dashoffset` keyed off ONE `getTotalLength()` (`r-animation-sota G26-2`) — SHIP-in-G

**WHAT:** a `fromDrawSVG(target, { from = "0%", to = "100%", ...options })`
factory (a `DrawSVG` class composing `CSSKeyframesAnimation.fromKeyframes`) in
`src/animation/draw-svg.ts`. It (a) reads `L = target.getTotalLength()` ONCE at
construction; (b) sets `stroke-dasharray: L` on the target (one full-length
dash); (c) constructs a `CSSKeyframesAnimation.fromKeyframes({ "0%": {
"stroke-dashoffset": L*(1-fromFrac) }, "100%": { "stroke-dashoffset":
L*(1-toFrac) } })`-equivalent (`fromFrac`/`toFrac` parsed from the `from`/`to`
percent — `0% → 100%` ⇒ offset `L → 0`, line draws in); (d) returns the animation
as the control handle. It carries NO geometry math — the browser owns
`getTotalLength`; keyframes only interpolates the scalar `stroke-dashoffset`.
HEAVY-boundary-correct (imports `./engine`, no value.js edge, behind
`loadAnimationEngine()`), mirroring `motion-path.ts` exactly.

**WHY:** `stroke-dashoffset` over `stroke-dasharray: L` is pure WAAPI-eligible
CSS that interpolates as a `<length>` (§State 3) — the engine already parses,
frames, and delegates exactly this shape, and the ONE `getTotalLength()` read is
the `motion-path.ts` "browser owns the geometry, kf interpolates a scalar"
pattern (§State 2). It is the SHIP-able sliver of the SVG suite F bundled
(wrongly) under VJ-F1; it needs NO `d`-parse, NO point-count reconciliation, NO
value.js. The primitive is the natural neighbour of `fromMotionPath` on the
`from*` factory family.

### S2 — `get finished()`: the completion front-door over the held play promise (`r-animation-sota G26-5`) — SHIP-in-G

**WHAT:** add `get finished(): Promise<void>` to `Animation` (and inherited by
`CSSKeyframesAnimation`) in `engine.ts`, to `AnimationGroup` in `group.ts`, and
to `Sequence` in `sequence.ts`. Each returns `this._playingPromise ??
Promise.resolve()` — the held in-flight promise when playing (`engine.ts:953`'s
re-entrant guard already returns it), an immediately-resolved promise when
settled (the `finally`-clear nulls `_playingPromise` on completion,
`engine.ts:978-980` / `group.ts` / `sequence.ts:368-370`). For a `managed`
`Animation` (the group owns its loop), `.finished` returns the same held promise
the group's tick resolves — no special-case beyond the existing field read.

**WHY:** §State 6/7 — completion is reachable ONLY via the awaited `play()`
return today; a consumer holding an already-playing animation has no clean
"await this" getter. The promise it would expose ALREADY EXISTS and is held
(`_playingPromise`, set/cleared identically on all three surfaces); the getter is
pure surface, no new state, no new lifecycle. It matches the genre baseline
(Motion `.finished`, GSAP `.then`, WAAPI `.finished`). The pre-resolved-when
-settled semantics fall out of the existing `finally`-clear — a `.finished` on an
already-settled animation reads `null` and resolves immediately; a never-played
animation also reads `null` and resolves immediately (it is "not running" =
"nothing to await"), which is the honest semantics (the negative control in
§Hard gate clause 4 locks that `.finished` does NOT resolve PREMATURELY for an
animation MID-PLAY).

> **BOOK + value.js-HANDOFF / RECORD in this band (named, NOT this wave) —
> `r-animation-sota`:**
> - **MorphSVG + numeric/canvas MotionPath (`G26-1`)** — the path-`d` geometry
>   sampler is **value-domain geometry math**, NOT animation-loop logic, and is
>   **MISSING from value.js 0.11.0** (`value.js/src/` has no geometry module —
>   verified). **value.js-HANDOFF VJ-F1** (carried forward UNCHANGED into the G
>   value.js charter). DrawSVG needs NONE of it (the §State 2 re-split). inv-16:
>   propose, never write. BOOK until VJ-F1 lands; then kf consumes it through the
>   `NumericAnimation`/string-lerp seam transparently.
> - **`splitText` analogue (`G26-3`)** — **BOOK** (a value.js-free
>   `splitText(element, { by })` over `Intl.Segmenter` — Baseline 2024,
>   grapheme-correct — feeding `stagger`; net-new DOM surface with a11y aria
>   reconstruction + line re-split on resize, deserving a deliberate design pass
>   with a concrete demo scene driving it, NOT a G drive-by. The demo grapheme-fix
>   is discharged — F.W16 word-split, `r-animation-sota G26-3`). Distinct from
>   DrawSVG: DrawSVG is a tiny `getTotalLength`-and-sweep wrapper (SHIP);
>   `splitText` is genuine new lifecycle surface (BOOK).
> - **Intrinsic-size `0 → auto` (`G26-4`)** — **BOOK + value.js-HANDOFF E7 +
>   RECORD don't-adopt-native-until-Baseline** (`interpolate-size`/`calc-size()`
>   Chrome-only, no FF/Safari; the JS-measure fallback is the portable path, own
>   wave).
> - **Reactive motion-value graph (`G26-6`)** — **RECORD** (binding-layer;
>   `SpringProgress.subscribe`/`Draggable.subscribe` are the right primitive and
>   complete; out of the framework-agnostic engine's scope).
> - **Rive / Theatre.js (`G26-7`)** — **RECORD** (a GPU canvas runtime / visual
>   editor — a DIFFERENT product at a different layer; adopting either abandons
>   kf's CSS-text LEAD; the §Mandate forbids manufacturing a deficit).

---

## § Hard gate (`proof:drawsvg` + `proof:finished` — falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real structural /
eligibility / resolution test, not an assertion). Two instruments, both wired
into `proof:all` (`package.json:64`), mirroring the `proof:motion-path`
registration (`package.json:61`).

### `proof:drawsvg` (S1)

1. **`fromDrawSVG` reads `getTotalLength()` once, sets `stroke-dasharray ===
   getTotalLength()`, and builds a `stroke-dashoffset` sweep.** A test asserts
   `fromDrawSVG(svgPathEl, { from: "0%", to: "100%" })` (a) calls
   `svgPathEl.getTotalLength()` exactly once (a spy), (b) sets
   `svgPathEl.style.strokeDasharray` (or the attribute) to that length `L`, and
   (c) produces a frame set whose interpolating key is `stroke-dashoffset`
   sweeping `L → 0`. **BITE:** strip the `stroke-dasharray` set, build over a
   non-`stroke-dashoffset` key, read `getTotalLength` per-frame, or set
   `dasharray !== L` → the structural assertion reds. Reds today (no DrawSVG
   exists — §State 1).

2. **The animation passes the EXISTING WAAPI eligibility gate — no new
   predicate.** `isWAAPIEligible(drawSvgAnimation)` returns `{ eligible: true }`
   for an SVG DOM target + a uniform CSS-twin easing (the same gate at
   `waapi.ts:98`, consulted unchanged) — with NO percent-exemption needed
   (`stroke-dashoffset` is an absolute `<length>`, §State 4). **BITE:** add a
   stroke-specific eligibility branch → a grep for a second eligibility predicate
   reds; OR mark `stroke-dashoffset` as a `WAAPI_INELIGIBLE_UNIT` → eligibility
   flips `false` and the clause reds.

3. **The eligible `DrawSVG` delegates compositor-thread.** Under a WAAPI-capable
   target (an `Element.animate` spy), `playWAAPI` is taken (`waapi.ts:341`) and
   `target.animate` is called with `stroke-dashoffset` keyframes +
   `toWAAPIOptions`' CSS-twin easing — the compositor path. **BITE:** force the
   rAF path (eligibility `false`) → the `target.animate` spy records zero calls
   and the delegation clause reds. (The negative control: a non-uniform or
   computed-unit draw stays on rAF — verifies the gate, not a DrawSVG bypass.)

4. **No regression / additive-only.** `npm test` stays green; every existing
   eligibility, delegation, frame, and `proof:motion-path` test is byte-identical
   (DrawSVG is additive — no existing path moves). **BITE:** any
   WAAPI/eligibility/frame/motion-path test regression reds.

### `proof:finished` (S2)

5. **`.finished` resolves exactly once at completion.** A test runs `anim.play();
   await anim.finished;` and asserts it resolves once after `animationend`
   (co-located with the existing playback lifecycle tests). **BITE:** reds today
   (no `get finished` — §State 6); green after S2. Wire `.finished` to a fresh
   `new Promise` per call instead of the held `_playingPromise` → the
   "resolves once / same promise" assertion (a referential-identity check that
   two reads of `.finished` mid-play return the SAME promise) reds.

6. **`.finished` is pre-resolved when settled, and does NOT resolve prematurely
   mid-play.** A test asserts (a) `.finished` on an already-settled (or
   never-played) animation resolves immediately (`_playingPromise` is `null` ⇒
   `Promise.resolve()`); (b) `.finished` captured MID-PLAY does NOT resolve
   before `animationend` (a negative control — `await Promise.race([finished,
   timeout])` takes the timeout while the animation is still running). **BITE:**
   return the held promise unconditionally (even when `null`) → (a) throws /
   never resolves and reds; resolve `_playingPromise` early → (b) reds.

7. **`.finished` is present on all four playable surfaces.** A grep/structural
   test asserts `get finished` exists on `Animation`, `AnimationGroup`, and
   `Sequence` (and is inherited by `CSSKeyframesAnimation`). **BITE:** omit the
   getter on any surface → the presence assertion reds.

8. **No regression — `play()`-await semantics unchanged.** `npm test` stays
   green; every existing `play()`-return-promise test is byte-identical (the
   getter is additive surface over the existing held promise — it changes no
   `play()` behaviour). **BITE:** any `play()`-promise test regression, or any
   `src/**` behaviour diff beyond the additive getter, reds.

**The reuse discipline (the wave's non-negotiable).** DrawSVG admits to WAAPI
through the ONE existing `isWAAPIEligible` gate — NOT a parallel stroke-specific
predicate (the §ALREADY-SOTA WAAPI-gate record). `.finished` exposes the ONE held
`_playingPromise` — NOT a second completion-promise lifecycle. If either needs a
special case, that is the signal the transposition was wrong.

---

## § Folds

Retires (by finding id):
- **`r-animation-sota G26-2`** (DrawSVG — the SHIP-able CSS-native sliver, the
  F26-1c re-split) — S1 + `proof:drawsvg` clauses 1/2/3/4.
- **`r-animation-sota G26-5`** (`get finished()` over the held play promise — the
  NEW-10 land) — S2 + `proof:finished` clauses 5/6/7/8.

**Routed OUTWARD to `value.js-HANDOFF` (inv-16 — proposed, never written here):**
- **VJ-F1 — path-geometry sampler** (the MorphSVG `G26-1a` + numeric MotionPath
  `G26-1c` enabler): parse `d` → typed segment AST → length-parametrized sampler
  + point-count-reconciling `d`-lerp. NOT shipped in value.js 0.11.0; carried
  forward UNCHANGED. DrawSVG needs NONE of it.

**Recorded BOOK / RECORD (named, NOT this wave):**
- **MorphSVG (`G26-1a`) + numeric/canvas MotionPath (`G26-1c`)** — **BOOK** behind
  VJ-F1.
- **`splitText` analogue (`G26-3`)** — **BOOK** (value.js-free `splitText` over
  `Intl.Segmenter`; net-new DOM/a11y/resize surface; demo grapheme-fix
  discharged F.W16).
- **Intrinsic-size `0 → auto` (`G26-4`)** — **BOOK + value.js-HANDOFF E7 + RECORD
  don't-adopt-native-until-Baseline.**
- **Reactive motion-value graph (`G26-6`)** — **RECORD** (binding-layer; out of
  engine scope).
- **Rive / Theatre.js (`G26-7`)** — **RECORD** (different product; the CSS-text
  LEAD forbids adopting it).

---

## § Design decisions (the trade-offs RESOLVED)

1. **DrawSVG ships SEPARATE from MorphSVG — the F26-1c re-split is correct.**
   RESOLVED: F bundled DrawSVG with MorphSVG under VJ-F1 ("park beside 1b",
   `motion-path.ts:14-18` docstring). On re-examination that is wrong: DrawSVG is
   line-drawing — `stroke-dashoffset: L → 0` where `L = getTotalLength()` — and
   needs NO `d`-parse, NO point-count reconciliation, NO value.js geometry, only
   ONE DOM read (`r-animation-sota G26-2`). It is the DrawSVG analogue of F26-1a's
   CSS-native MotionPath sliver, and F's own reasoning for shipping 1a separately
   (`motion-path.ts` "the one path capability that is pure CSS the compositor
   resolves") applies identically. Trade-off: the record carries a visible
   "MorphSVG/numeric-MotionPath: not yet" behind a clean hand-off — but that beats
   a keyframes-local geometry engine that duplicates value.js's domain (the
   boundary the §ALREADY-SOTA record protects). MorphSVG DOES need the sampler;
   DrawSVG does not — so they split on the geometry-dependency seam, not by fiat.

2. **Reuse the ONE eligibility gate — no stroke-specific predicate, no
   percent-exemption.** RESOLVED: `DrawSVG` is just a `CSSKeyframesAnimation` over
   `stroke-dashoffset`; it must pass `isWAAPIEligible` (`waapi.ts:98`) unchanged,
   like any other animation. `stroke-dashoffset` is an absolute `<length>` in user
   units (§State 3/4), so unlike `offset-distance` (`waapi.ts:56`'s
   `PATH_RELATIVE_PERCENT_PROPERTIES` exemption) it needs NO percent-relaxation at
   all — it is the SIMPLEST eligible shape, simpler than MotionPath. A second
   eligibility branch would contradict the gate's single-source-of-truth invariant
   (`waapi.ts:49`) and the §ALREADY-SOTA WAAPI-gate record. Trade-off: none — this
   is the idiom-preserving design; if a draw animation needs a special case, that
   is the signal it is NOT the CSS-native sliver.

3. **`getTotalLength()` is read ONCE at construction — the browser owns the
   geometry.** RESOLVED: the line length `L` is read a SINGLE time at factory
   construction (mirroring `motion-path.ts`'s "browser owns the `offset-path` →
   position resolution"), set as `stroke-dasharray` + the keyframe endpoints, and
   never re-read per-frame. The animated scalar is purely `stroke-dashoffset`. A
   per-frame `getTotalLength` would be a layout round-trip the §Mandate's
   measure-first forbids without a bench — and is unnecessary: a static path's
   length is constant. Trade-off: an author who mutates the path `d` mid-draw
   would see a stale `L` — but that is the same contract as `motion-path.ts`'s
   static `offset-path` (a path mutation is a re-construct, not a per-frame
   re-measure), and `proof:drawsvg` clause 1 LOCKS the single read (a `getTotalLength`
   spy asserting call-count 1).

4. **`.finished` exposes the ONE held promise — no second completion lifecycle.**
   RESOLVED: the promise already exists — `_playingPromise` is constructed by
   `play()`, returned by the re-entrant guard, and cleared on `finally`
   (`engine.ts:953,977-980`; `group.ts:507`; `sequence.ts:335,362,368`). `.finished`
   is `this._playingPromise ?? Promise.resolve()` — settled ⇒ pre-resolved,
   in-flight ⇒ the held promise (so two reads mid-play return the SAME promise,
   gate clause 5). Minting a FRESH promise per `.finished` call, or a parallel
   completion channel, would either resolve out of sync with `play()` or
   duplicate the existing lifecycle (anti-DRY). Trade-off: `.finished` on a
   never-played animation resolves immediately ("not running" = "nothing to
   await") rather than pending until a future `play()` — RESOLVED as the honest
   semantics (a getter named `finished` reports current settledness, it does not
   pre-arm a future run); gate clause 6's negative control locks that it does NOT
   resolve PREMATURELY mid-play.

5. **`draw-svg.ts` is its own cohesive file — NOT a graft onto `engine.ts`.**
   RESOLVED: DrawSVG lands as a ~80L factory file mirroring `motion-path.ts`
   (191L), composing `CSSKeyframesAnimation` — NOT new methods on the
   `engine.ts` class (1313L, at its gestalt per `_SYNTHESIS-gap-scorecard
   §THESIS`/F.md NEW-3, the `G.W5` line-ceiling DECISION). The factory family
   (`fromString`/`fromKeyframes`/`fromVars`/`fromMotionPath`/`fromDrawSVG`) is the
   established home for additive input shapes. The `.finished` getter is the ONE
   addition that touches the classes directly — a single getter on each, the
   minimal class surface, not a new module. Trade-off: a fifth `from*` file is
   one more file — but a cohesive one-concern factory beats grafting stroke logic
   into the engine kernel (the no-god-module Mandate).

6. **Additive surface — measure-first binds the eligibility/resolution, not a
   speedup.** RESOLVED: DrawSVG's win is a NEW capability (line-drawing),
   compositor-thread by riding the existing WAAPI delegation — not a speedup of an
   existing path, so there is no "X× faster" claim to bench. `.finished`'s win is
   ergonomics, not perf. The gates are therefore falsifiable *structural +
   eligibility + resolution* assertions (the correct measure-first instrument for
   additive surface, the same discipline `proof:motion-path` proved), NOT benches.
   Trade-off: none — a capability/ergonomics gate that bites on its negative is the
   honest proof for additive surface (inv ε).
