# SOTA audit — keyframes.js public API / DX vs the field (Tranche E)

**Lane:** the published surface (`src/animation/index.ts`) — `Animation`,
`CSSKeyframesAnimation`, `AnimationGroup`, `NumericAnimation`, `SmoothProgress`,
`SpringProgress`, `ElementMorph`, the `Timeline` family, the light/heavy
boundary — as an **ergonomics / types / tree-shaking / discoverability** surface,
benchmarked against Motion (motion.dev / Framer Motion), GSAP, anime.js v4.
**Scope:** DX only. The *feature-gap* map (stagger / sequence / FLIP / drag /
scroll-delegation / motion-path) is the sibling lane `r-anim-libs.md` — this lane
does NOT re-litigate those; it audits how the surface that EXISTS *feels to
consume*.
**Method:** live code (file:line) grounded against each library's published API
shape + the modern-web-guidance baseline corpus. Research-only; FOLD-E /
GAP-NAMED / FOLD-VALUEJS-HANDOFF / BOOK / ALREADY-SOTA dispositions.

---

## TL;DR — DX headline

The keyframes.js surface is **architecturally exemplary and ergonomically
under-finished**. Its boundary discipline (the value.js static/dynamic split,
`index.ts:29–138`), its type completeness (`Easing` as a typed value, the
`InputAnimationOptions`-vs-`AnimationOptions` lenient/strict split), and its
fail-explicit setter contract are *ahead* of Motion/GSAP on rigor. But the
**discoverability and first-run ergonomics lag the field on four concrete axes**:

1. **The presets are unreachable from the package root** — the README documents
   `import { fadeIn } from "@mkbabb/keyframes.js"` but `animations.ts` is exported
   by NO barrel (`index.ts` = 0 hits, `engine.ts` does not re-export it). The
   single most copy-pasted DX path in the docs is **broken against the published
   surface**. (D-1, highest-value, FOLD-E.)
2. **The heavy classes are async-only** — `Animation`/`CSSKeyframesAnimation`/
   `AnimationGroup` are reachable ONLY via `await loadAnimationEngine()`. The
   tree-shaking win is genuine and class-leading, but the *headline* API (the
   README quick-start, the thing every consumer reaches for first) now requires
   an `await import()` ceremony no competitor imposes. The boundary is right; the
   DX needs a sugar layer. (D-2, FOLD-E.)
3. **`AnimationGroup` has no fluent config parity with `Animation`** — no
   `setDuration`/`setOptions`/`setDirection` (0 hits, `group.ts`), and its
   reduced-motion is a *raw public field* (`group.ts:52`) while every other
   surface uses a fail-explicit setter. The composite's config ergonomics are a
   tier below the single animation's. (D-3, FOLD-E.)
4. **No declarative one-shot `animate()` entry** — every motion costs a
   construct→configure→target→play four-step. Motion's headline is a single
   `animate(el, keyframes, opts)` call; keyframes has no such front door. (D-4,
   GAP-NAMED → FOLD-E.)

Everything ELSE on the DX surface is **at or above SOTA** — the typed `Easing`,
the lenient/strict options split, the `Tickable` protocol, the
stateless-`.at()`-vs-managed-`.play()` duality, the fail-explicit setters, and the
boundary itself are recorded ALREADY-SOTA below.

---

## DX comparison map (LEAD / MATCH / GAP)

| DX axis | Motion | GSAP | anime.js v4 | keyframes.js | Verdict |
|---|---|---|---|---|---|
| Single-call `animate()` front door | ✓ (the headline) | ✓ (`gsap.to`) | ✓ (`animate()`) | ✗ — 4-step construct/config/target/play | **GAP** (D-4) |
| Presets importable from root | ✓ | ✓ (eases) | ✓ | ✗ — `animations.ts` un-barrelled (D-1) | **GAP** |
| Heavy classes synchronously importable | ✓ | ✓ | ✓ | ✗ — `await loadAnimationEngine()` (D-2) | **GAP** (the tree-shaking trade) |
| Typed easing value w/ CSS twin | partial | ✗ | ✗ | ✓ `Easing {fn, css?}` `constants.ts:67` | **LEAD** |
| Lenient input vs strict internal option type | partial | ✗ | partial | ✓ `InputAnimationOptions` `constants.ts:145` | **LEAD** |
| Fail-explicit setters (typed errors) | ✗ (silent coerce) | ✗ | ✗ | ✓ `AnimationOptionError` everywhere | **LEAD** |
| Stateless `.at()` + managed `.play()` duality | partial | ✗ | ✗ | ✓ `numeric.ts` / `morph.ts` | **LEAD** |
| Uniform `Tickable` stepper protocol | ✗ | ✗ | ✗ | ✓ `playback.ts:30` | **LEAD** |
| Tree-shakeable physics core (no parser pull) | partial | ✗ (monolith+plugins) | partial | ✓ the light barrel `index.ts:29` | **LEAD** |
| Fluent config parity across all classes | ✓ | ✓ | ✓ | partial — group lacks setters (D-3) | **GAP** |
| Promise + cancel on every managed play | ✓ | ✓ | ✓ | ✓ `play(): Promise` + `stop()` | **MATCH** |
| `.finished`-style awaitable | ✓ (`animation.finished`) | partial | ✓ | partial — `play()` returns it, no field (D-5) | **GAP (small)** |
| Subscribe/observe value stream | ✓ (`onUpdate`) | ✓ | ✓ | partial — only `SpringProgress.subscribe` (D-6) | **GAP (small)** |

---

## Findings

### D-1 — Presets unreachable from the package root; the README's most-copied snippet is broken  ·  GAP-NAMED → FOLD-E

- **Where:** `animations.ts` exports ~35 presets (`fadeIn` `animations.ts:13`,
  `bounce:93`, `spinner`, …) as `(options?: InputAnimationOptions) => CSSKeyframesAnimation`.
  The package barrel `index.ts` re-exports **zero** of them (`grep -c animations
  index.ts` = 0). `engine.ts`'s heavy re-export block (`engine.ts:1047–1057`) does
  not include them either. The demo only reaches them through the INTERNAL source
  path `@src/animation/animations` (`demo/cube/useCubeAnimations.ts:6` et al.) —
  an alias that does not exist for a published consumer.
- **The break:** `README.md:288` documents
  `import { fadeIn, bounce, spinner } from "@mkbabb/keyframes.js"`. Against the
  published `dist` this is a **resolution failure** — the names are not on the
  package's export surface. The single highest-traffic copy-paste path in the
  docs does not run.
- **SOTA:** presets/eases importable from root is universal — Motion ships its
  spring/preset set, GSAP exposes named eases, anime.js v4 ships its stagger/easing
  presets, animate.css IS a preset library. A preset gallery the consumer can
  `import {x} from "lib"` is table-stakes discoverability.
- **The wrinkle (why it slipped):** presets return `CSSKeyframesAnimation`, which
  is value.js-bearing — so they CANNOT sit on the **light** static barrel without
  re-introducing the static value.js edge the boundary forbids (`proof:boundary`
  would red). The correct home is the **heavy** surface: add them to
  `loadAnimationEngine()`'s `AnimationEngine` interface (`index.ts:100`) +
  `engine.ts`'s heavy re-export, so `const { fadeIn } = await loadAnimationEngine()`
  resolves. Then either fix the README to show the heavy path, OR (better, see
  D-2) expose them through a static-typed-but-dynamically-resolved sugar.
- **Perf/elegance rationale:** zero hot-path cost — pure export plumbing. The fix
  makes the documented surface real and closes a boundary-vs-discoverability seam
  that currently fails silently.
- **Disposition:** **FOLD-E** — route presets through the heavy engine surface +
  reconcile the README. Pairs with D-2 (the front-door sugar) since both concern
  "how does a consumer reach the value.js-bearing API ergonomically."
- **Isomorphism:** additive export + a doc correction; no runtime behavior or
  pixel moves. The presets already exist and run — only their *reachability* changes.

### D-2 — The heavy classes are async-only; the boundary is right but the headline API needs a sugar layer  ·  GAP-NAMED → FOLD-E (design book first)

- **Where:** `Animation`, `CSSKeyframesAnimation`, `AnimationGroup` are exported as
  **types only** on the static barrel (`index.ts:79`, erased under
  `verbatimModuleSyntax`); their runtime constructors are reachable ONLY via
  `await loadAnimationEngine()` (`index.ts:137`). The README quick-start
  (`README.md:12`) writes `new CSSKeyframesAnimation(...)` as if it were a plain
  import — but a published consumer must write
  `const { CSSKeyframesAnimation } = await loadAnimationEngine()` first.
- **The tension:** the boundary is **genuinely SOTA** (A-7 below) — a spring-only
  consumer never pulls the CSS parser. But the cost lands on the *primary* surface:
  the thing the README leads with, the thing 90% of consumers want first
  (parse `@keyframes`, animate an element), now carries an `await import()`
  ceremony that Motion/GSAP/anime.js do not. A first-time consumer hits the
  async wall on line one.
- **SOTA:** no competitor gates its headline API behind a dynamic import. Motion's
  `animate()` is a synchronous named import. The async boundary is keyframes' for
  a good reason (tree-shaking the parser) but the DX needs to *hide* it for the
  common case.
- **Opportunity / elegance:** a thin **async sugar** front door on the static
  barrel — e.g. `export const keyframes = (css, opts?) => loadAnimationEngine()
  .then(e => new e.CSSKeyframesAnimation(opts).fromString(css))`, returning a
  `Promise<CSSKeyframesAnimation>`. The consumer writes
  `const anim = await keyframes(css, { duration: 2000 })` — one await, no
  destructure, no internal-name knowledge. The boundary holds (still dynamic),
  the ergonomics collapse to a single call. Combined with D-4's `animate()` this
  becomes the documented front door and the README stops lying about a sync import.
- **Perf/elegance rationale:** zero new static edge — the sugar is itself a
  `() => import()` thunk, erased from the light graph exactly like
  `loadAnimationEngine`. It converts a three-token ceremony into a one-token call.
- **Disposition:** **FOLD-E**, but **BOOK the shape first**: decide whether the
  sugar is per-class (`keyframes()`, `group()`) or a single `animate()` dispatcher
  (D-4), and whether the README's sync-looking quick-start is rewritten to the
  honest async form OR the sugar makes the sync look real. This is the central DX
  decision of the lane.
- **Isomorphism:** purely additive; `loadAnimationEngine()` and the typed barrel
  stay. No existing consumer path breaks.

### D-3 — `AnimationGroup` lacks the fluent config parity `Animation` has; its reduced-motion is a raw field  ·  FOLD-E

- **Where:** `Animation` carries the full fail-explicit setter suite —
  `setDuration` (`engine.ts:298`), `setOptions` (`engine.ts:459`), `setDirection`,
  `setFillMode`, `setIterationCount`, `setTimingFunction`,
  `setRespectReducedMotion` — each throwing `AnimationOptionError` on malformed
  present input. `AnimationGroup` has **none** of them (`grep set(Duration|Options
  |Direction|…)` over `group.ts` = 0). Worse, its reduced-motion is a **bare
  mutable public field** `respectReducedMotion = false` (`group.ts:52`) — the one
  spot in the whole surface that bypasses the fail-explicit setter discipline. The
  README even documents the field assignment (`README.md:320`:
  `group.respectReducedMotion = true`), enshrining the inconsistency.
- **SOTA:** GSAP's `TimelineLite`/`timeline()` and Motion's group/sequence carry
  the same config vocabulary as a single tween (duration/ease/etc. set uniformly
  or per-segment). A composite that can't be configured like its members is a DX
  cliff — the consumer learns one mental model for `Animation`, a different one
  for `AnimationGroup`.
- **Opportunity / elegance:** `AnimationGroup` could forward a `setOptions`/
  `setDuration`/`setDirection` suite to its children (fan-out over `getEntries()`,
  the iteration it already does for `setTargets` `group.ts:169` and `setSuperKey`
  `group.ts:161`), and promote `respectReducedMotion` to a
  `setRespectReducedMotion(v)` fail-explicit setter matching the rest of the
  surface. The fan-out is the same shape the group already uses — no new pattern.
- **Perf/elegance rationale:** construction-time only; the fan-out reuses the
  existing entry iteration. Closes the one discipline hole (the raw public field)
  and gives the composite the single mental model.
- **Disposition:** **FOLD-E** — add the forwarding setter suite +
  `setRespectReducedMotion`; deprecate (or keep, but back with the setter) the raw
  field. Reconcile the README to the setter form.
- **Isomorphism:** additive setters; the existing raw-field assignment keeps
  working (the setter writes the same field), so no consumer breaks. Pixels
  unchanged.

### D-4 — No single-call `animate()` declarative entry point  ·  GAP-NAMED → FOLD-E

- **Where:** every motion path is a multi-step object lifecycle:
  `new CSSKeyframesAnimation(opts)` → `.fromString(css)` → `.setTargets(el)` →
  `.play()` (`README.md:12–33`). There is no `animate(target, keyframes, options)`
  one-shot that returns a controllable handle.
- **SOTA:** Motion's entire ergonomic thesis is the single `animate(el, {opacity:
  [0,1]}, {duration})` call returning an `AnimationPlaybackControls` with
  `.pause()`/`.play()`/`.finished`. GSAP's `gsap.to(target, vars)` is the same
  shape. anime.js v4's `animate(targets, params)`. This single-call front door is
  the first thing every tutorial shows; it is the DX baseline of the genre.
- **Opportunity / elegance:** a `animate(target, input, opts?)` dispatcher on the
  (async) heavy surface that branches on `input` shape — a CSS `@keyframes` string
  → `CSSKeyframesAnimation.fromString`; a keyframe map → `.fromKeyframes`; a vars
  array → `.fromVars`; a `Vars`-pair → `.fromVars([from, to])` — auto-`setTargets`,
  auto-`.play()`, and returns the constructed animation (the control handle). It is
  a *thin orchestration* over the three `from*` factories that already exist
  (`engine.ts:951`/`965`/`997`) plus `setTargets` + `play` — no new engine logic,
  just the missing convenience front door. Composes with D-2's async sugar (it IS
  the async sugar's general form) and with D-1 (presets become
  `animate(el, fadeIn())`-able).
- **Perf/elegance rationale:** construction-time dispatch; zero hot-path cost. It
  collapses the documented four-step into one and gives keyframes the front door
  the whole field leads with.
- **Disposition:** **FOLD-E** — a `animate()` dispatcher (heavy surface; returns
  the animation as control handle). Sequenced WITH D-2 (same async-sugar design
  pass) since `animate()` is the natural home for the front-door decision.
- **Isomorphism:** additive; the explicit lifecycle API stays for power users.
  No behavior moves.

### D-5 — No `.finished` awaitable field; the play promise is fire-and-forget-shaped  ·  FOLD-E (small)

- **Where:** `play(): Promise<void>` (`engine.ts:778`) returns a promise that
  resolves on completion, and re-entrant calls return the cached `_playingPromise`
  (`engine.ts:785`). But there is no `.finished` GETTER on the instance — a
  consumer who didn't capture the `play()` return value cannot later `await
  anim.finished`. The promise is reachable only at the call site.
- **SOTA:** WAAPI itself exposes `animation.finished` (a re-readable promise,
  `Element.animate().finished`); Motion exposes `controls.finished`; the platform
  pattern is a *queryable* completion promise, not just a call-site return. The
  modern-web `Element.animate()` surface (Baseline: widely available) is the
  reference — keyframes delegates to it (`waapi.ts`) but doesn't surface the
  `.finished` ergonomic.
- **Opportunity / elegance:** expose `get finished(): Promise<void>` returning the
  live `_playingPromise` (or an already-resolved promise when idle). One getter
  over existing state — the promise already exists (`engine.ts:144`), it just
  isn't re-readable.
- **Disposition:** **FOLD-E (small)** — a `.finished` getter mirroring WAAPI.
  Aligns the surface with the platform animation object consumers already know.
- **Isomorphism:** additive getter; no behavior change.

### D-6 — Value-stream observation is inconsistent across the light surface  ·  FOLD-E (small)

- **Where:** `SpringProgress` exposes `subscribe(fn)` → unsubscribe handle
  (`spring.ts:345`), the idiomatic observable stepper. But `SmoothProgress` has
  **no** `subscribe` (the consumer must poll `.current` or pass an `onFrame` to
  `.play()`); `NumericAnimation` has only the `.play(onFrame)` callback;
  `Timeline` has only `.progress` polling. The "observe the value as it changes"
  ergonomic exists for ONE of four light steppers.
- **SOTA:** Motion's `MotionValue` is a first-class observable (`.on("change",
  …)`) consumed across the whole library; GSAP's `onUpdate` is universal. A
  *uniform* subscribe/observe across the steppers is the SOTA shape for the
  "drive my own UI from this value" use case (the exact case the light steppers
  target).
- **Opportunity / elegance:** lift `subscribe(fn): () => void` to a shared shape
  across `SmoothProgress`/`NumericAnimation`/`Timeline` (or a tiny shared
  `Observable<T>` mixin in `internal/`), mirroring `SpringProgress`. Value.js-free,
  light-side. Makes the four steppers one mental model.
- **Disposition:** **FOLD-E (small)** — uniform `subscribe` across the light
  steppers. Lower priority than D-1..D-4; it's a consistency polish, not a missing
  capability (the `onFrame`/`.current` paths work today).
- **Isomorphism:** additive; existing `onFrame`/polling paths unchanged.

### D-7 — README documents an internal `easing.ts`/`math.ts` surface that isn't on the package export  ·  FOLD-E (small, doc)

- **Where:** `README.md:151`/`164`/`168` reference `easing.ts`, `math.ts`,
  `CSSCubicBezier`, `steppedEase`, `cubicBezier` as if consumer-reachable, and
  `README.md:288` the preset import (D-1). But the package barrel (`index.ts`)
  exports only `resolveEasing`/`toEasing` for easing — the named curve functions
  (`easeInBounce`, `CSSCubicBezier`) live in value.js and are NOT re-exported
  through the keyframes root. A consumer following the README to
  `const easeInBounce = (t) => CSSCubicBezier(...)(t)` cannot import
  `CSSCubicBezier` from `@mkbabb/keyframes.js`.
- **SOTA:** docs that resolve against the real export surface is the baseline; the
  README's curve-construction section describes the *source layout* (the re-export
  barrels) not the *published surface*. This is a doc/surface drift, the same class
  as D-1.
- **Opportunity:** either re-export the curve constructors consumers need
  (`CSSCubicBezier`, the named eases) through the root for the documented snippets
  to run, OR scope the README to what's actually exported (`resolveEasing` is the
  real path: `await resolveEasing("ease-in-bounce")`). Given the boundary, the
  named-curve constructors are value.js's and pulling them static would re-add the
  edge — so the README should be corrected to the `resolveEasing` path, not the
  surface widened. Decide alongside D-1's preset reconciliation.
- **Disposition:** **FOLD-E (small, doc)** — reconcile the README's
  easing/math/preset sections to the real export surface (the `resolveEasing` +
  heavy-engine path), in the same pass as D-1.
- **Isomorphism:** doc-only; no code/pixel change.

---

## ALREADY-SOTA — do not manufacture work here

- **A-1 — `Easing` as a typed value (`constants.ts:67`).** `{ fn, css? }` carries
  the CSS twin THROUGH the type system instead of a Symbol-on-a-closure side
  channel that `bind` silently drops. This is a genuinely better design than
  Motion's separate easing function + separate WAAPI string — one value, two faithful
  forms. The `toEasing` normalizer (`easing.ts:26`) makes callable-or-typed input
  ergonomic. **LEAD.** LEAVE.

- **A-2 — Lenient `InputAnimationOptions` vs strict `AnimationOptions`
  (`constants.ts:117` / `:145`).** The public *input* type accepts `duration:
  number | string`, `iterationCount: "infinite"`, a string easing NAME — the
  forgiving CSS-shaped surface — while the internal type is fully resolved. This
  two-type split (lenient front, strict core) is exactly the DX pattern good
  libraries converge on and most never formalize. **LEAD.** LEAVE.

- **A-3 — Fail-explicit setters with typed errors.** Every `set*`
  (`engine.ts:259`–`469`) throws `AnimationOptionError` on malformed PRESENT input
  and defaults only on genuine omission — the "malformed is a consumer bug,
  omission is fine" contract, with a typed error class (`internal/errors.ts`)
  rather than a silent coerce. Motion/GSAP silently coerce garbage; this surfaces
  it. **LEAD.** (D-3 is the one HOLE — the group's raw field — not a counterexample
  to the discipline.) LEAVE.

- **A-4 — Stateless `.at()` + managed `.play()` duality (`numeric.ts:152`/`219`,
  `morph.ts:87`/`110`).** Every light interpolator answers BOTH "give me the value
  at progress p" (drive-your-own-loop) AND "run it for me" (rAF-managed). This
  dual surface is the right shape for the canvas/WebGL/scroll consumer and is
  cleaner than Motion's loop-owning-only model. **LEAD.** LEAVE.

- **A-5 — The `Tickable` protocol + the single `RAFPlayback` driver
  (`playback.ts:30`/`61`).** One generation-guarded rAF core, three entry shapes
  (`play`/`drive`/`loop`), every stepper implementing `tickDt(dt)` + `settled`.
  `RAFPlayback` is EXPORTED (`index.ts:48`) so a consumer driving their own light
  playback gets the same reduced-motion gate. No competitor exposes a stepper
  protocol this clean. **LEAD.** LEAVE.

- **A-6 — The `resolveEasing` boundary ergonomic (`easing.ts:68`).** A string
  easing name resolves ONCE, up front, through one async edge — fail-explicit
  (`UnknownEasingError`), no pending-state resolver class, no
  identity-fallback-until-resolved. This is a *better* contract than the former
  smuggled-async-behind-sync `EasingResolvable` it replaced, and the right way to
  keep the light steppers value.js-free while still accepting CSS names. **LEAD.**
  LEAVE.

- **A-7 — The value.js static/dynamic boundary itself (`index.ts:29–138`).** The
  light physics/interpolation engines carry ZERO static value.js edge; the heavy
  CSS-parsing engine loads via `loadAnimationEngine()`. A spring-only consumer
  never pulls the parser. `"sideEffects": false` (`package.json:18`) + the
  per-entry `proof:boundary` gate. No competitor offers this tree-shaking
  granularity — GSAP is a monolith-plus-plugins, Motion's mini bundle is coarser.
  **LEAD.** (D-2 is the DX *cost* of this win, not a flaw in it — the boundary
  stays; we add sugar over it.) LEAVE.

- **A-8 — Spring → CSS `linear()` twin surfaced as exports (`springTimingFunction`,
  `springLinearStops` on the light barrel `index.ts:40`/`42`).** A consumer can
  pull the spring's faithful `linear()` string WITHOUT the parser — exactly the
  `physics-based-easing` guidance pattern (modern-web-guidance `physics-based-easing`,
  the `linear()` spring recipe; Baseline newly-available). The library ships the
  generator the guide tells you to reach for an external tool for. **LEAD.** LEAVE.

---

## value.js hand-offs (FOLD-VALUEJS-HANDOFF)

This lane is **API/DX**, and the gaps are keyframes-side surface plumbing (exports,
sugar, setter parity, doc reconciliation) — none requires a new value.js
primitive. One adjacent observation worth surfacing to the value.js owner:

- **VJ-DX-1 — The named curve constructors the README documents
  (`CSSCubicBezier`, named eases) live in value.js and have no faithful
  keyframes-root re-export without re-adding the static edge (D-7).** If the
  value.js owner wants keyframes consumers to construct curves by NAME without the
  async `resolveEasing` round-trip, the clean answer is a **value.js-side
  light/tree-shakeable easing entry** (a sub-path export of the pure curve
  functions with no DOM/parser pull) that keyframes could re-export statically.
  This is a value.js *packaging* decision, not a keyframes one. **HAND-OFF:**
  propose a value.js tranche item "a parser-free easing sub-path export" so the
  curve constructors become statically re-exportable downstream. Optional enabler;
  D-7 ships as a doc fix regardless.

---

## Priority recommendation for FOLD-E

1. **D-1 presets-unreachable** — a real BREAK in the docs; pure export plumbing;
   highest ROI, lowest risk.
2. **D-2 + D-4 the async front door** — the central DX decision: a `keyframes()`/
   `animate()` sugar over `loadAnimationEngine()` that hides the await ceremony
   and gives keyframes the single-call entry the whole field leads with. BOOK the
   shape, then fold. (D-4 is D-2's general form — design them together.)
3. **D-3 group setter parity** — closes the one fail-explicit-discipline hole (the
   raw public field) and gives the composite the single mental model.
4. **D-7 README reconciliation** — fold WITH D-1 (same doc/surface-drift pass).
5. **D-5 `.finished` getter** — small WAAPI-aligned polish.
6. **D-6 uniform `subscribe`** — light-surface consistency polish; lowest priority.

Every finding is **additive and isomorphism-safe** — no existing pixel, behavior,
or boundary moves. The architectural foundations (the typed `Easing`, the
lenient/strict split, the fail-explicit setters, the `Tickable` protocol, the
stateless/managed duality, the value.js boundary, the spring `linear()` exports)
are genuinely SOTA and should be left alone. The DX work is *finishing* a
surface that is architecturally ahead of the field but ergonomically half a step
behind it on discoverability and the single-call front door.
