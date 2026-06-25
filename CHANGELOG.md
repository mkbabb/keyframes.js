# Changelog

<!-- CONVENTION: entries follow the 5.0.0 format — consumer-facing Breaking/Minor/Patch sections,
     no internal wave codes (Wn, Band X, Tranche Y). Keep planning language in docs/tranches/. -->

## 5.0.0

### Major Changes (BREAKING)

- **Dropped the `@deprecated` PKG-3 aliases.** `Animation`, `ScrollTimeline`, and `ScrollTimelineOptions` no longer export — use the canonical names `KeyframesAnimation`, `KeyframesScrollTimeline`, `KeyframesScrollTimelineOptions`. See [`docs/MIGRATION-5.0.0.md`](./docs/MIGRATION-5.0.0.md) for the full old→new map. The platform globals (`globalThis.Animation` / `globalThis.ScrollTimeline`) are untouched.

### Minor Changes (additive — the Tranche Q payload, riding the major)

- **emerging-CSS Phase-2**: element-aware `if(style(--p))` / `sibling-index()` / `sibling-count()` resolution, plus **`@function` call-inlining** (`--ident(args)`), consuming `@mkbabb/value.js@^1.2.0`'s dashed-call parse + `coerceToSyntax`.
- **Engine perf**: the Structure-of-Arrays Float64 fold extended to single-animation `processFrame` (bit-identical); WAAPI **curvature-adaptive** sub-segment densify (chord-error ≤ the prior fixed sampler on every corpus curve).
- **Demo fleet**: a reusable **`DemoControlPoint`** direct-manipulation primitive over the LIGHT `drag2D` export; the easing curve-editor dogfoods it; a mobile scroll-snap N-Stage carousel with typed View-Transitions; the **MorphSVG** demo scene over the shipped `fromMorphSVG` (the on-DOM render contract + orient-along-path); amiga `decay()` telemetry.
- **Correctness**: the named-selector NaN-frame proper cure (attach-time deferred-resolution + a play-time `NAMED_SELECTOR_NO_TIMELINE` guard — never a parse-throw; the opaque-ingest round-trip holds); a grammar-fuzz fast-check harness + a kf-vs-browser differential oracle.
- **Internal / no-legacy**: `engine.ts` split (the standalone-play lifecycle lifted into `engine-playback.ts`); the `group.ts` SoA fold extracted into `group-soa.ts`; the WAAPI densify into `waapi-densify.ts`; the math leaves externalized onto `@mkbabb/value.js/math` (kf duplicates deleted); the function-name WeakMap ceremony retired onto value.js's `ValueUnit.fnName`.
- **Dependency**: pins `@mkbabb/value.js@^1.2.0`; the `@mkbabb/parse-that` production dependency stays removed (the acyclic spine — kf consumes value.js's `parseCSSSubValue`).

## 4.3.0

### Minor Changes

Tranche K — THE PRODUCT-TRUTH + ROUND-TRIP-FRONTIER tranche, two bands under one
discipline. An additive, non-breaking minor: no export removed, no signature broken.

**Band I — the repair** (closed on the user's TASTE verdict). The cold hero
rainbow-play now STARTS the engine on the first gesture (the P0 cured at the adapter
seam); the liveness oracle reads the engine's own write channel, never the idle bob.
glass-ui re-pinned `~3.11.2 → ~3.13.0 → ~4.0.0` (the dock cured at the source: the
collapsed pill is a perfect circle, the hover-flash gone — adopted, never patched).
value.js re-pinned `^0.11.2 → ^0.12.0 → ^0.13.0`. ONE display-voice authority (the
dock joined at the root, proven by a computed-font census). The dock anchoring became
a DERIVED grid that clusters on a cinema display and a phone alike. The panes re-cut:
the spring made a real keyframes editor, the stepping slider cured at root, the
motion-color unified to the red-dashed, the FourierField removed.

**Band II — the CSS-@keyframes round-trip made TOTAL** (the new public surface, HEAVY
via `loadAnimationEngine()` unless noted):
- **The fidelity floor** — the engine now HONORS the `animation-composition` operator
  (add / accumulate on rAF, composite on WAAPI) it had been silently dropping; a
  `ResolvedKeyframes.diagnostics` channel.
- **Ingest** — `fromStyleSheets` / `fromLiveAnimations` / `resolveLiveKeyframes` /
  `adoptRunning`: read the live web's own CSS (walk the CSSOM, adopt a running native
  animation mid-flight by `currentTime` handoff), replay-pixel-equal or refused with a
  named reason.
- **Scroll-as-CSS** — `parseScrollCSS` / `roundTripScrollCSS` / `createScrollScene` /
  `pinCSS` / `dispatchScrollBackend`: parse + round-trip the `animation-timeline`
  grammar (via value.js 0.13.0) and dispatch native ScrollTimeline or the kf JS driver.
- **Compile** — `compileToCSS`: the parser run BACKWARD — an `AnimationGroup` /
  `Sequence` → zero-runtime CSS (`@keyframes` + longhands + `linear()` springs +
  `animation-composition` layering), oklab-densified (ΔE-OK to floating-point
  precision), with a typed four-refusal ineligibility surface.
- **Physics** — `reseatToSpring` / `probeVelocity` / `reducedMotionScale` (LIGHT):
  spring-driven layer blend weight, velocity-continuous interruption of a parsed-CSS
  animation, WCAG-2.3.3 intensity-scaled reduced motion.
- **Externalize** — `llms.txt` (the agent surface), the sibling `@mkbabb/keyframes-vue`
  adapter, the public color-fidelity conformance harness.

The moat: the authoring object IS CSS, so the round-trip is the parser run both ways
over the same data model — proven faithful both ways by replay-equality or an honest
refusal. value.js 0.13.0 (the dispatched `sampleColorRamp` + scroll-timeline grammar)
ships in lockstep; the constellation acyclic spine holds.

## 4.2.0

### Minor Changes

Tranche J — THE PUBLISHED SURFACE: the honest minor. npm has been frozen at `4.1.0`
while the library's public API out-ran it by a **full orchestration tier** accreted
across four tranches (E → F → G → I) and never published. This release names that
surface export-by-export, ships the two bugfix patches the pending `tranche-h`/
`tranche-i` changesets carried (CONSUMED into this minor — deleted in the same motion,
not stacked `4.1.0 → 4.1.1 → 4.1.2 → 4.2.0`), and installs the publish-boundary gate
(`proof:published-surface`) that makes the tarball == exports == README agreement
machine-checkable.

**The new public surface (additive — the reason this is a `minor`).**

The LIGHT static tier (value.js-free named exports; importing only these pulls zero
`@mkbabb/value.js` into the consumer graph):

- **`SpringProgress`** — closed-form spring-physics progress tracker (the engine under
  `drag`/`decay`).
- **`springLinearStops`** — spring → CSS `linear()` stops string.
- **`springTimingFunction`** — spring → typed `Easing` (`{ fn, css }` — one curve, two
  forms).
- **`RAFPlayback`** — THE managed, bind-proof rAF driver (`play`/`drive`/`loop`); no
  other module owns a rAF handle.
- **`stagger`** — pure construction-time per-index delay generator.
- **`flip` / `flipShared`** — FLIP (First-Last-Invert-Play) composition over
  `ElementMorph`.
- **`drag` / `Draggable`** — pointer-capture drag/fling input layer over
  `SpringProgress`; release velocity re-seats the closed-form spring.
- **`decay` / `decayRest`** — closed-form frictional glide
  `x(t) = x0 + (v0/k)(1 − e^(−kt))` + its projected resting point.
- **`Sequence`** — the master-playhead TEMPORAL orchestrator (GSAP-Timeline-class
  sequencing beside `AnimationGroup`'s spatial blending).
- **`createNativeTimeline`**, **`resolveEasing`** / **`toEasing`** (the async easing
  factory + normalizer), **`AnimationOptionError`** / **`UnknownEasingError`** (the
  typed fail-explicit errors).

**The `loadAnimationEngine()` dynamic boundary** — the documented front door to the
HEAVY tier (`Animation`, `CSSKeyframesAnimation`, `AnimationGroup`, `getAnimationId`,
`getTimingFunction`, `resolveKeyframes`, `presets`, the option constants) and the new
HEAVY front doors:

- **`animate`** — single-call dispatch on input shape (CSS string / keyframe map /
  vars array / MotionPath spec) + auto-target + auto-play.
- **`MotionPath` / `fromMotionPath`** — CSS-native `offset-distance` sweep over an
  author `offset-path`.
- **`DrawSVG` / `fromDrawSVG`** — stroke-dashoffset line drawing over ONE
  `getTotalLength()` read.

**The bugfixes (consumed from the two pending patch changesets).**

- From `tranche-h`: `frame-compiler.ts` gains a fail-explicit belt at the compile seam —
  a blank/whitespace keyframe selector now throws the typed, already-public
  `AnimationOptionError` naming the malformed selector instead of value.js's cryptic
  `Parse error at offset 0`.
- From `tranche-i`: `format.ts` serializes from the declared template (`parsedVars[i]`),
  not the live DOM-resolving sample; `group.ts` defaults the compositor `transform` to a
  typed no-op (a childless group no longer composites an empty value set); and the
  **`@mkbabb/value.js` floor advances `^0.11.1` → `^0.11.2`** (the published empty-input
  contract: `parseCSSValueUnit("")` returns `ValueUnit(0)`, never throws). The floor
  advance is a contractual tightening protecting consumers who pin value.js themselves —
  advertising it as `minor` is the honest signal.

**Packaging honesty (the same boundary, same motion).** `dist/_redirects` (a CF-Pages
routing relic) no longer rides the tarball (`publicDir: false` at the library seam); the
spurious `vue ^3.5.0` peerDependency is DELETED — the shipped library is Vue-free
(`vue` remains a devDependency of the demo only); `proof:published-surface` +
`proof:readme-runs` gate the tarball contents, the taught/manifested export roster, the
README snippets EXECUTING against the built dist, the `AnimationEngine` interface ≡
runtime parity, and peer-dep honesty.

**Version owner: Mike Babb (`mike@babb.dev`).** The version cut (`changeset version`) →
tag → `release.yml` → `npm publish --provenance` leg is **user-domain, confirm-first at
J.WZ**; this changeset is the wave's deliverable, not the registry mutation.

## 4.1.0

### Minor Changes

- ae07e28: Tranche G — the published F sibling-wins CONSUMED on the re-pin spine; two narrow
  additive engine surfaces; the post-F idiom-drift swept; the gated decisions taken.

    **The spine — the dep RE-PIN (the headline, 8 audit lanes converged).** kf 4.0.0
    shipped consuming STALE siblings (`value.js ^0.10.0`, `parse-that ^0.8.2`, a
    `glass-ui file:../glass-ui` LINK) while the published `0.11.x` / `0.9.0` / `3.3.0`
    carried the F hand-off wins kf DROVE but never consumed — the −94% computed-endpoint
    memo, the color-channel plan, the dispatch LUT, the C5 length-unit correctness, the
    parse-that soundness. The whole F.W6 architecture was load-bearing on "kf consumes it
    on re-pin"; the re-pin never happened. G lands it through the single
    `lerpValue → iv._lerp` seam (`engine.ts:731`) with ZERO library source edit, gated by
    a new `proof:deps-current` (installed ≥ floor; no `file:`/`link:`/`git:` protocol;
    parse-that realm convergence surfaced fail-explicit) + a `proof:repin-witness` proving
    the computed endpoint resolves O(frames)→O(1) on kf's path. The re-pin consumed
    `value.js 0.11.1` — the fixed sibling that dropped a broken `development` export
    condition `0.11.0` shipped (it broke every Vite consumer in dev/test; the upstream fix
    keyframes drove).

    **New public API (additive — the minor).**
    - `fromDrawSVG(target, opts?)` + the `DrawSVG` factory — a CSS-native SVG
      line-drawing animation: one `getTotalLength()` read, `stroke-dasharray = L`,
      `stroke-dashoffset` swept `L → 0`, WAAPI-eligible, zero value.js dependency
      (mirrors `motion-path.ts`). `from`/`to` take a percent string or a 0..1 fraction
      (fail-explicit on a number outside `[0, 1]`).
    - `get finished()` on `Animation` / `CSSKeyframesAnimation` / `AnimationGroup` /
      `Sequence` — the genre's idiomatic "await this animation" front door over the play
      promise the engine already holds (resolves once at end; pre-resolved when settled).
    - `Animation.adoptCompiled(source)` — a first-class verb for adopting another
      animation's compiled state atomically (re-binds the live-options reference,
      recomputes the stable key-set); the `compiler` field tightens to read-only. The
      demo's three-field cross-boundary reach-in collapses to one call.

    **Correctness.** The dead `add`/`weighted` blend leaf is fixed (the guard tested a
    bare `ValueUnit` but the leaf is a `ValueUnit[]` — both modes silently collapsed to
    `replace`; now an element-wise in-place blend, zero-alloc intact). `serializeEasing`
    throws fail-explicit on a custom-closure easing with no CSS twin instead of silently
    emitting `"linear"` and losing the curve.

    **Demo + housekeeping (non-breaking).** D.W5 closed — the dock leverages the published
    glass-ui 3.3.0 (`TopDock → ChromeDock`, the pass-through barrel deleted, the
    `:always-expanded` occlusion mask removed, occlusion-free without the crutch); the
    post-F scene idiom-drift swept (`.status-badge`/`.code-token`/`.progress-ball` promoted
    to the one idiom layer); a HIGH rAF-leak fixed (scene preview loops wired to a dead
    `<KeepAlive>`-only hook now stop on swap); the orbital container collapsed to a native
    `rotate3d` output (two-way v-model preserved); the Discrete route, hero LCP word-spacing
    and a duplicate Play aria-label fixed; the lone outlier store brought into the singleton
    idiom; the library line-ceiling gated DECISION taken (not a reflexive split). The test
    suite gained the interpolate-anything / color-fidelity / computed-resolution / round-trip
    corpora; the CI a workflow-hygiene gate + 12 new `proof:*` gates.

    Version owner: Mike Babb.

## 4.0.0

### Major Changes

- d51d03a: Tranche C — the close made honest, the design system made true, the engine dogfooded.

    This release ships alongside the Tranche B engine transposition (the
    `tranche-b-3-1-0` changeset, cut but never published — folded here so one
    provenance-signed publish ships both). C's published-library surface is the
    engine residuals; the design-system + dogfood + integrity work (W1–W3) lands in
    the demo + CI gates and does not change the published API.

    **The engine unification, completed to its edges (W4).**
    - **One generation-guarded loop core.** `play`/`drive`/`loop` fold into a single
      `_run` frame-scheduler; `drive` inherits the `_gen` restart guard `loop` had,
      so a `stop()`+restart mid-frame can no longer spawn a second rAF chain (the
      unguarded double-schedule class is now structurally impossible).
    - **One canonical step: `tickDt(dt: ms): number` on every stepper.** The
      frame-dependent no-arg `SmoothProgress.tick()` is removed and the
      seconds-taking `SpringProgress.tick(seconds)` is demoted to a private
      internal — no public stepper method takes seconds or means four different
      things. `Tickable.tickDt` is typed `: number` (was `: void`). **Breaking:** if
      you stepped `SmoothProgress`/`SpringProgress` manually, call `tickDt(ms)`.
    - **Fail-explicit option contract is now total.** `setColorSpace` /
      `setHueMethod` join the `parseOption` seam — a malformed PRESENT value throws
      `AnimationOptionError` (genuine omission still defaults), closing the last two
      setters that silently accepted invalid input. **Breaking** for callers that
      relied on an invalid value being silently accepted (e.g. `colorSpace: "srgb"`
      — value.js's sRGB-family space is `"rgb"`).
    - **The default easing's compositor path: verified, then withheld.** A single
      `cubic-bezier()` cannot faithfully reproduce the piecewise Penner
      `easeInOutCubic` (proven: the best symmetric fit floors at ~0.0208 drift,
      above the 1e-2 no-visible-drift tolerance), so the default carries no `.css`
      twin and stays rAF-only — faithful by omission. A standing test reds if a
      faithful twin is ever found or an unfaithful one shipped.
    - **`Timeline._advance` deduplicated** to one `setTarget` + one branch.

    **The boundary + release gates hardened.** `proof:boundary` closes its residual
    false-negative classes (a live bare side-effect import, a `@mkbabb/value.js/...`
    subpath specifier, a direct `export const` light export now each redden the
    gate); `rolldown` is declared as the gate's load-bearing dependency; the CI demo
    gate pins the glass-ui sibling to a tag (no moving-HEAD reproducibility hole).

    SemVer note: the tier is **major** because the combined B+C release changes
    behavior visible to a 3.0.0 consumer (fail-explicit setters throw where 3.0.0
    silently accepted; the canonical `tickDt` step). If the team treats the
    unpublished B 3.1.0 light-engine surface as the baseline (those steppers were
    never published), the change is additive — the publish owner finalizes the tier
    at `changeset version`.

- 8ff893f: Tranche D — the demo refined, the engine transposed to its gestalt, the deferrals terminated.

    This release ships alongside the stacked **Tranche B (`tranche-b-3-1-0`) + Tranche C
    (`tranche-c`)** changesets — both cut, never published — folded here so one
    provenance-signed publish ships the whole B+C+D engine transposition. D's
    published-library surface is the **engine transposition (W4)**; the demo refinement
    (W1 decomposition · W2 design-language localization · W3 brittleness hardening) lands
    in the demo + CI gates and does not change the published API.

    **The version owner** for the combined B+C+D publish is **Mike Babb** (`mike@babb.dev`),
    who finalizes the SemVer tier and drives `changeset version` → tag → `release.yml`.
    The publish leg is **user-domain, confirm-first** — identical to A/B/C.

    **The engine transposed to its gestalt (W4).** A `major` because the renames are
    intentional and unaliased — a removed name is removed, not shimmed (no-legacy).
    - **`tick(t)` → `advanceTo(t)` at the driver layer.** `Animation.tick(absoluteClock)`
      and `AnimationGroup.tick(absoluteClock)` — the absolute-rAF-clock advance — are
      renamed to `advanceTo(t)`, so `tick` now means exactly one thing across the engine
      (the `tickDt(dt)` stepper surface C canonicalized). `advanceTo(t)` reads as what it
      does. No compat alias.
    - **`AnimationGroup.pause` is honest.** The method that secretly toggled (pause when
      playing, resume when paused) splits into idempotent `pause()` / `resume()` + an
      explicit `toggle()`; `Animation` gains the same `toggle()` and its `pause(draw)`
      toggle-branch + `draw` parameter are retired. A method named `pause` pauses.
    - **The `Animation` god-object split at the `FrameCompiler` seam.** The ~1019-line
      class is decomposed: a standalone, run-state-free `FrameCompiler` owns the
      template→sampled-frames pipeline (`addFrame`/`parse`/reconcile/compile), unit-testable
      without a clock; `Animation` retains the playback state-machine and composes one.
      The public barrel is **byte-stable** — `Animation`/`CSSKeyframesAnimation`/
      `AnimationGroup`/`getAnimationId` and every property the group reads
      (`frames`/`templateFrames`/`interpFrames`/`options`/`t`/`done`) are unchanged
      (delegated where the data now lives).
    - **The `AnimationGroup` compositor allocates zero bytes/frame.** The per-frame
      `groupedValues` object literal and the per-layer `filteredValues`
      `Object.fromEntries` are gone — a hoisted instance buffer (cleared in place) + an
      inlined property-whitelist key-skip. The headline group path now honors the
      zero-alloc discipline the class's `_entries`/`interpFrames` buffers were built for.
    - **Retirements (no-legacy).** The deprecated value.js path-compat re-exports
      (`lerpColorValue`/`lerpComputedValue`/`lerpNumericValue`/`lerpValue` from
      `animation/utils`, `formatCSS` from `animation/format`) are **deleted** — import
      from `@mkbabb/value.js` directly. `internal/leaves.ts`'s `| any` widening is
      tightened to the precise opaque-handle union. The reduced-motion `_snapSettled`
      snap is symmetric across both steppers (smooth now stops its loop, as spring did).

    A computed-unit "changed-keys write" optimization (D-3) was **measured and withheld**
    — the keyframes-local benefit is ~0 on the interpolation hot path (every animating
    key changes every frame; only held constants are cache-skippable) and the real
    re-serialization cost lives in value.js, outside this package. The measurement is
    recorded (`test/d3-changed-keys.measure.test.ts`) rather than a speculative
    optimization shipped.

    New standing CI gates: `proof:engine` (tick-canon · FrameCompiler seam · pause-honest
    · snap-symmetry · no-legacy) and `proof:zero-alloc` (the compositor allocation probe).

### Minor Changes

- be02978: Tranche B — the engine's debt transposed, the demo made true.

    **Engine (gestalt transposition, net-deletion).** A typed `Easing`
    (`{ fn, css? }`) replaces the former Symbol-on-a-closure side channels;
    `resolveEasing(name)` (async, fail-explicit) + `toEasing` replace the
    `EasingResolvable` resolver — the light engines accept a callable
    `TimingFunction` or a typed `Easing` only (a string name throws
    `AnimationOptionError`; resolve it up front). One `RAFPlayback` driver
    (`play`/`drive`/`loop`) owns every rAF loop; one `withReducedMotion` gate
    drives every reduced-motion snap; one explicit rest-position/fill contract
    (`settle()` pure teardown, `reset()` explicit rewind, `restPosition` from
    `fillMode`). Option setters are fail-explicit: a malformed PRESENT value
    throws a typed `AnimationOptionError` (genuine omission still defaults).
    WAAPI delegation is restored (the prior renderer check was bind-broken) and
    made faithful: it delegates only when the easing has a CSS twin, and
    `stop()`/`reset()` cancel the compositor animation. New exports: `Easing`,
    `resolveEasing`, `toEasing`, `AnimationOptionError`, `UnknownEasingError`,
    `RAFPlaybackOptions`, `Tickable`. `getTimingFunction` now resolves CSS
    `steps()`/`step-start`/`step-end` (Easing Level 1 complete).

    **Boundary gate widened.** `proof:boundary` now proves every light barrel
    export (not just `SpringProgress`), the heavy engine's dynamic boundary,
    and the absence of dormant static value.js specifiers.

    **Demo + CI** (not part of the published library): the production demo
    build is repaired (it was shipping blank), the four blank scenes render,
    the cube is no longer clipped, and CI gains demo-paint (inv γ) + occlusion
    (inv δ) gates.

- fe9b120: Tranche E — the demo elevated to the modern-web standard the engine already held, the
  engine's correctness gaps closed, and the orchestration tier shipped.

    This release ships atop the stacked **Tranche B (`tranche-b-3-1-0`) + Tranche C
    (`tranche-c`) + Tranche D (`tranche-d`)** changesets — all cut, never published —
    folded so one provenance-signed publish ships the whole B+C+D+E provenance (the
    combined SemVer tier is **major**, driven by C/D; E's own contribution is a
    non-breaking **minor**).

    **E's published-library surface:**
    - **New public API (additive, the orchestration tier — E.W10):** `stagger`,
      `flip`/`flipShared`, `drag`/`Draggable` + `decay`/`decayRest`, the `Sequence`
      temporal orchestrator (named to not shadow the published `Timeline`),
      `SpringProgress.fromDuration({ duration | visualDuration, bounce })`, and the
      single-call `animate(target, input, opts?)` front door. The light helpers carry
      zero static value.js edge (`proof:boundary` holds); `animate` rides
      `loadAnimationEngine`.
    - **Modern-platform adoption (E.W9, feature-detected):** `@property` registration via
      `CSS.registerProperty`, live `prefers-reduced-motion` observation
      (`onReducedMotionChange`), dense WAAPI sub-segment sampling, and an ADDITIVE native
      `ScrollTimeline`/`ViewTimeline` bridge (`createNativeTimeline` /
      `attachNativeScrollTimeline`) — the JS sampler stays as the proven fallback (the
      native-replace ARCH-kill holds).
    - **Engine correctness (E.W7, test-locked):** `setColorSpace`/`setHueMethod` re-derive
      compiled color carriers; `createFrame` seeks the correct (template) index space;
      the WAAPI guard rejects the layout-dependent unit set; a finite delegated WAAPI play
      commits-then-cancels (zero residual filling animations); `getTimingFunction` reads
      back `linear()` to its true curve. Plus standalone zero-alloc playback (E.W7) and a
      deterministic content-derived `frameId` (E.W8).

    The **demo** (E.W1 encapsulation r2 · E.W2 the vueuse listener gestalt · E.W3 styling
    r2 · E.W4 perf + modern-web · E.W11 View-Transitions/a11y/first-paint) lands in the
    demo + CI gates and does not change the published API. E.W5 is BOOK-only (a doc note).

    **The version owner** for the combined B+C+D+E publish is **Mike Babb**
    (`mike@babb.dev`), who finalizes the SemVer tier and drives `changeset version` → tag →
    `release.yml`. The publish leg stays user-domain, confirm-first.

- c901cfb: Tranche F — the single largest measured per-frame win landed, the parsing
  consumption-seam made whole, the orchestration tier finished + dogfooded, and the
  verification seam closed. F is net-new and NARROW: ~90% of the post-E stack is
  ALREADY-SOTA and left untouched.

    This release ships atop the stacked **Tranche B (`tranche-b-3-1-0`) + Tranche C
    (`tranche-c`) + Tranche D (`tranche-d`) + Tranche E (`tranche-e`)** changesets —
    all cut, never published — so one provenance-signed publish ships the whole
    B+C+D+E+F provenance (the combined SemVer tier is **major**, driven by C/D; F's own
    contribution is a non-breaking **minor**).

    **F's published-library surface:**
    - **New public API (additive):** `MotionPath` / `fromMotionPath` (F.W12 — CSS-native
      motion along an author `offset-path`, animating `offset-distance` on the
      compositor thread, zero value.js dependency; rides `loadAnimationEngine`); the
      completed `Sequence` transport (F.W9 — `pause`/`resume`/`reverse`/`timeScale`/
      `progress`/`repeat`/`yoyo` via scalar-field arithmetic over the existing `seek`,
      C⁰-continuous and seek↔play pixel-identical); the preset library reachable on the
      heavy surface (F.W11 — `(await loadAnimationEngine()).presets.fadeIn(…)`);
      `animate({ path })` front-door dispatch (F.W12 S2).
    - **Engine perf (F.W4, isomorphic / pixel-identical):** the per-frame interpolation
      buffers are cleared with a stable-key null-fill instead of a `delete`-loop, so the
      reused `out`/`_grouped`/`entry.values` buffers stay in V8 fast-properties mode
      (`%HasFastProperties === true`) — threaded-buffer playback ~3.0× (K=2) / 2.8× (K=12)
      faster; a single-active-frame alias returns `flatVars` directly on the no-buffer
      path. The `drive` loop-core reschedules synchronously (F.W5 — no per-frame
      microtask hop for `SmoothProgress`/`SpringProgress`/`Draggable`).
    - **Parsing correctness (F.W7/F.W8, strictly-more-correct, byte-stable for the common
      case):** per-keyframe `animation-timing-function` now round-trips on
      re-serialize (it was read but silently dropped — a CSS-Animations-L1 violation),
      including the engine's own spring `linear()`; `animation-composition` is captured;
      a sibling style rule's `animation` shorthand is applied as the option base
      (constructor-explicit overriding); the bare-keyframes detection decides on the
      parsed AST (a leading `/* @keyframes */` comment no longer defeats it).
    - **Cohesion (F.W11, byte-identical):** the 4× open-coded clamp converged onto
      `internal/leaves.clamp`; `group.ts`'s `lerp` retargeted to value.js (the light leaf's
      consumer set is purely light again).

    The **demo** (F.W10 dogfood · F.W13 `text-wrap: pretty` · F.W14 undo/redo · F.W15
    a11y + shortcut discovery · F.W16 the rail/ball idiom + hero a11y) and the
    **verification seam** (F.W1 the benches fixed + the missing ones authored, F.W2 every
    `proof:*` gate wired into CI, F.W3 `proof:orchestration` + the public-API tests) land
    in the demo + CI gates and do not change the published API.

    The computed-unit endpoint cache (F.W6) and the parser hardenings ship in the
    companion **value.js** and **parse-that** hand-offs (kf consumes them unchanged
    through the `lerpValue → iv._lerp` seam on re-pin).

    **The version owner** for the combined B+C+D+E+F publish is **Mike Babb**
    (`mike@babb.dev`), who finalizes the SemVer tier and drives `changeset version` → tag
    → `release.yml`. The publish leg stays user-domain, confirm-first.

## 3.0.0

### Major Changes

- d84faf5: Tranche A — the value.js boundary hardened, the release CI runnable, and the engine on its own modern-web baseline.

    **Boundary, gated (not asserted).** A `proof:boundary` CI gate builds a spring-only entry and fails the build if any light module reintroduces a static `@mkbabb/value.js` edge — the KF-B1 light/heavy split is now proven by construction, not a CHANGELOG sentence. `"sideEffects": false` and the `loadAnimationEngine()` dynamic boundary are unchanged.

    **Boundary ergonomics.** String easing _names_ now resolve through one shared `EasingResolvable` contract: resolution is kicked off eagerly at construction, so a named curve lands by the first frame instead of silently interpolating linearly until `await .ready()`. A residual same-tick synchronous `.at()`/`tick()` before resolution emits a one-time dev-only warning (stripped from the published bundle). `RAFPlayback` is exported and owns the shared reduced-motion snap gate.

    **Reduced motion, everywhere.** `prefers-reduced-motion: reduce` is honored on the heavy path now, not just the light interpolators. Opt in with `respectReducedMotion: true` on `Animation`/`CSSKeyframesAnimation` (snaps `play()` to the final frame in a single paint) and on `NumericAnimation`/`ElementMorph` (via the exported `RAFPlayback` gate); set `group.respectReducedMotion = true` on an `AnimationGroup`. SSR-safe no-op off-DOM.

    **INP.** `AnimationGroup.tick()` yields to the main thread (`scheduler.yield()` with a `MessageChannel` fallback) between child batches for large groups, so a big per-frame composite no longer runs as one long task.

    **WAAPI springs.** A spring `Animation` delegated to the Web Animations API now runs its true overshoot/settle curve on the compositor — `springTimingFunction` carries its CSS `linear()` equivalent, which the WAAPI path emits instead of a flattened `linear` ramp.

    **Release.** The library build is glass-ui-free: `@mkbabb/glass-ui` is an optional demo-only dependency a clean runner skips, and the CI gate is library-scoped (`check:lib` → `build:lib` → `test` → `proof:boundary`). The package publishes with npm provenance.

## v2.2.0 — value.js static/dynamic boundary (KF-B1)

Carves the package barrel along the value.js seam so the light physics/
interpolation engines no longer drag the heavy CSS-parsing surface — or
`@mkbabb/value.js` — into a consumer's static graph.

### The boundary

- **LIGHT engines stay static and value.js-free.** `SpringProgress`,
  `SmoothProgress`, `NumericAnimation`, `ElementMorph`, the `Timeline`
  family, and the spring-stop helpers now reach their handful of leaf
  helpers — `requestAnimationFrame` / `cancelAnimationFrame` /
  `clamp` / `lerp` / `scale` — from a new local `src/animation/internal/
leaves.ts` instead of `@mkbabb/value.js`. A consumer that imports only
  these has **zero** static import edge to value.js. Verified against the
  built dist: the `dist/keyframes.js` barrel statically imports only the
  leaf chunk; a spring-only bundle contains no value.js code.

- **HEAVY engine moves behind a dynamic boundary.** `Animation`,
  `CSSKeyframesAnimation`, `AnimationGroup`, `getTimingFunction`,
  `resolveKeyframes`, and the animation-options constants (`DIRECTIONS`,
  `FILL_MODES`, `defaultOptions`, `defaultLayerConfig`) live in
  `src/animation/engine.ts` and are reached through a new async accessor:

    ```ts
    import { loadAnimationEngine } from "@mkbabb/keyframes.js";
    const { CSSKeyframesAnimation } = await loadAnimationEngine();
    const anim = new CSSKeyframesAnimation(opts).fromString(css);
    ```

    `loadAnimationEngine()` does `await import("./engine")`, so the
    value.js-bearing graph (the `ValueUnit`/`Color`/CSS-parser/easing-
    registry surface) loads only on first await and never enters a
    light-only consumer's static graph. The dist now ships a split
    `engine-*.js` chunk that the barrel reaches via dynamic import.

### Breaking changes

- **The heavy classes are no longer static named exports of the barrel.**
  `import { Animation } from "@mkbabb/keyframes.js"` as a _value_ is
  retired in favour of `await loadAnimationEngine()`. The class **types**
  remain on the static barrel (`import type { Animation } from
"@mkbabb/keyframes.js"` still resolves), so type annotations are
  unaffected — only the runtime constructors moved.

- **The light engines resolve string easing names lazily — callable
  easing stays static and value.js-free.** `NumericAnimation`,
  `ElementMorph`, and the `Timeline` family still accept
  `timingFunction` / `easing` as a callable `TimingFunction` OR a string
  easing _name_ (`"ease-out-cubic"`, `"easeOutCubic"`, `"linear"`, …), as
  before. A **callable** is used directly — no dynamic import, nothing
  value.js pulled into the static graph (this is the gate path). A
  **string name** is resolved LAZILY through the dynamic engine boundary:
  `NumericAnimation` / `ElementMorph` resolve before the first `.play()`
  frame (or an explicit `await .ready()`); `Timeline` kicks off resolution
  from its constructor and applies the eased value once it lands (also
  awaitable via `.ready()`). The value.js-bearing easing registry loads
  only when a named easing is actually used, so a callable-only consumer's
  static graph stays value.js-free. The full `Animation` /
  `CSSKeyframesAnimation` engine accepts string names eagerly as before.

### Build

- `package.json` gains `"sideEffects": false` so a bundler may tree-shake
  the unused static re-exports out of the single dist barrel.

## v2.1.1 — 2026-05-28 (G.W5 — value.js seam canon)

Published as part of the muster tranche G release-engineering wave (G.W5 sub-wave A).
The `@mkbabb/value.js` dependency migrates from the `file:../value.js` seam to the
`^0.10.0` npm-registry semver pin — the published artifact resolves value.js through
the registry. No public API change versus v2.1.0; this is the seam-canon publish that
lands keyframes.js on the registry-resolved consumer-default path. (Note: this release
re-exported value.js _statically_; the dynamic re-export boundary it gestured at did
not yet exist in the source — it lands in v2.2.0 above.)

## v2.1.0 — 2026-05-13 (AB.W6 settle)

Settles the long-standing `w.w2.1-keyframes-prebuild` operator WIP branch
into master and ships the new scrubbing + zero-allocation API.

### New public API

- `AnimationGroup.render()` — re-composes the current frame using every
  child's current `t`. Single-target groups go through the composed
  transform; multi-target groups apply each child's interpolated vars
  directly to its own targets. Replaces the previously private
  `renderPauseFrame()` and is the entry point for scenarios that mutate
  child state outside the rAF loop (scrubbing, state restore, pause
  snapshots).
- `AnimationGroup.setChildTime(nameOrAnim, t)` — sets a single child's
  `t` + `pausedTime` without touching its siblings. Chainable; call
  `render()` afterwards to reflect the change visually.
- `Animation.interpFrames(t, transformFrames, out?)` — optional `out`
  buffer enables zero-allocation steady-state playback. When passed,
  the buffer's stale keys are cleared deterministically before new
  values are written, so callers can reuse a single long-lived object
  per child.

### Internal refactors

- `AnimationGroup.transformFramesGrouped()` now writes each child's
  interpolated vars directly into the entry's `values` buffer via the
  new `interpFrames(out)` path. Drops the per-entry `Object.assign` and
  the per-frame allocation. The previous `done || paused` early-return
  path is gone — `interpFrames` clears stale keys, so scrubbed children
  always reflect fresh state.
- `AnimationGroup.tick()` simplified — the comment around the
  `pausedTime === 0` snapshot tick is now self-evident from the code.
- `AnimationGroup` pause path calls public `render()` instead of the
  private `renderPauseFrame()`.

### Bug fixes (demo)

- `useAnimationGroupPlayback.sliderUpdate` no longer drags sibling
  animations along normalized progress when one child is scrubbed.
  The previous bespoke loop has been replaced with
  `getAnimationGroup().setChildTime(animation, t).render()`.
- `useAnimationGroupPlayback.notifyPlayStateChange` now derives
  `isStarted` from intent (`playing || group.started`) so callers that
  just asked the group to start get the correct state before the first
  rAF tick flips `group.started`.
- `useTransformState` matrix-editor watcher early-returns when the
  group has started, eliminating mid-play `matrix3dEnd` rebuilds that
  caused visible jitter on the orbiting cube.

### Tests

- `test/useAnimationGroupPlayback.test.ts` rewritten to assert the new
  contract: scrubbing one animation moves only its own `t`; siblings
  remain at their pre-scrub `t` and render at that position.
- Full suite: 218 tests passing.

### Operator-WIP settlement (AB.W6)

This release also clears the 16 dirty entries on the
`w.w2.1-keyframes-prebuild` WIP branch (9 untracked operator UI
captures deleted; 5 modified source files finished + committed; 2
modified dist files dropped + rebuilt from source). The WIP branch is
fast-forward-merged into master.

The underlying `b788205` commit ("adopt glass-ui v1.0 subpath surface")
is now locked into master, so downstream consumers see the demo's
subpath import canon.

## v2.0.0 — 2025-09-09

Drops `value.js` re-exports — consumers must now import primitives from
`@mkbabb/value.js` directly.
