# E.W9 — Modern-platform adoption (library, baseline-safe + feature-detected)

**Phase:** IMPL · **Class:** MINOR (library-side; observable new public behaviour
behind feature-detect — **additive**, non-breaking) · **Scope:** `src/animation/`
(the published library — the WAAPI/scroll/color/`@property` seams) · **Parallel
to:** E.W7 (engine correctness + hot-path), E.W8 (FrameCompiler transposition),
E.W10 (orchestration) — file-adjacent in `src/animation/` but **independent of
W7/W8** (no dependency edge); ∦ the demo waves W1/W2/W3/W11 · **Gated on:**
keyframes' own green CI (inv-27).

**Title.** The platform features the engine *parses-but-never-applies*, adopted —
each Baseline-dated, **feature-detected**, with the JS path as the proven fallback.

The engine already PARSES the modern platform surface (it parses `@property` rules
into a registry; it carries a `colorSpace` option; it owns a JS `ScrollTimeline`;
it reads the OS reduced-motion preference) — but on several axes it **never applies
the platform's own native machinery**, silently degrading to a JS-only path where
a feature-detected native path would be strictly closer to spec. E.W7's charter
verdict ("zero engine GAP against the Baseline checklist") was correct *against the
modern-web-guidance Baseline-capability checklist* — the engine IS the reference
impl of `scheduler.yield`/WAAPI-delegation/`linear()`-spring/PRM. The **deep SOTA
audit** asked the sharper, frontier question — *measured against the W3C platform
frontier (Color L4, `@property`, Scroll-Driven), where does the library
parse-but-never-apply?* — and found a body of Baseline-safe adoptions the checklist
did not surface (`d-modern-platform.md` D-LIB-1/2/3, `a-kf-waapi.md` F2/F3,
`a-kf-computed.md` Finding 4).

The mandate is the spine: **no-legacy / no-workaround** (no polyfill — the JS path
is the honest fallback, not a shim); idiomatic + gestalt (each adoption reuses an
idiom the engine already proves — the WAAPI eligibility gate, the spring-stops
sampler, the computed-value seam, the one PRM detector); **isomorphic** (pixel-
stable on every existing path; the native paths are *isomorphism-restoring-or-
befitting* — closer to spec, never a regression); KISS (**every platform adoption
FEATURE-DETECTED**, the existing path the fallback — pure progressive enhancement;
no native lift lands without a behaviour-equivalence assertion to the JS path);
**inv-16** (E writes only keyframes.js — every value.js prerequisite is BOOKED to
the `E-HANDOFF` proposal, never authored here). E's content is **net-NEW**: D
terminated every keyframes-owned deferral (the ledger is clean, zero KFE), so these
are fresh deep-assay findings, not folded debt. Every finding below is `file:line`-
grounded + **verified not asserted** (inv ε), re-grounded against live source on
`tranche-d-impl`.

---

## § Provenance

The FOLD-E synthesis section **§ E.W9** of
`docs/tranches/E/audit/sota/_SYNTHESIS-E-augmentation.md`, distilled from:

- `d-modern-platform.md` — **D-LIB-1** (register the parsed `@property` registry),
  **D-LIB-2** (native `ScrollTimeline`/`ViewTimeline` WAAPI bridge), **D-LIB-3**
  (live reduced-motion observation).
- `a-kf-waapi.md` — **F2** (native CSS Color L4 color interpolation), **F3** (dense
  sub-segment keyframe sampling), **F4** (`KeyframeEffect.composite: "add"`).
- `a-kf-computed.md` — **Finding 4** (`@property`-driven native length interpolation
  for registerable DOM targets).
- `d-color-interp.md` — **D-6** (the native-color claim — *mechanism corrected below*).

The 6 re-exec'd forward-SOTA lanes (FOLD-E refinement — **deepened, overturned
nothing**):
- `r-css-color.md` — **F5** (CORRECTS D-6's mechanism: native color is main-thread
  native interp + JS-hot-path removal, **NOT** compositor offload); **F1/F2**
  (`currentColor`/`light-dark()` frame-prep resolution policy).
- `r-waapi.md` — **W2** (the non-legacy-syntax emit criterion for native color),
  **W3** (the native-timeline progress-reconciliation gate + the W1 lifecycle shape
  for an infinite scroll timeline), **W4** (the `@property`/`var()` *honest negative
  result* — registered customs do not composite anyway), **W6** (`composite:"add"`
  Baseline split: segment-composite viable, `iterationComposite` not).
- `r-css-values.md` — **§5** (`interpolate-size`/`calc-size()` GAP-NAMED — limited
  availability, JS-measure floor).
- `r-anim-libs.md` — **F-5** (native scroll/view-timeline bridge as competitive
  parity).
- `r-scroll-view-transitions.md` — **S-1** (the ARCH-kill re-confirm: native
  ScrollTimeline does NOT replace the JS sampler).

**Cross-checked against the live modern-web-guidance corpus** (skill version
`2026_05_16-c5e7870`): Registered custom properties, Scroll-driven animations,
`light-dark()`/`color-scheme`, and PRM-respecting motion are all recognized
standard surfaces. The scroll-driven guide confirms **limited availability**
(Chrome 115 / Edge 115 / Safari 26 — Sep 2025; **not Firefox**), the
`@supports ((animation-timeline: view()) and (animation-range: entry))` detect
shape, and **DO NOT use `scroll-timeline-polyfill`** — verbatim corroboration of
this wave's additive-bridge + no-polyfill discipline.

---

## § The state, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-d-impl`, so the wave's framing
is honest:

1. **The `@property` registry is parsed into an INERT `Map` — zero
   `CSS.registerProperty` anywhere in `src/`.** `engine.ts:995` declares
   `propertyRegistry: Map<string, PropertyDescriptor> = new Map()`; `fromString`
   populates it at `engine.ts:1005` (`this.propertyRegistry = resolved.properties`)
   from `resolveKeyframes`. The docstring (`engine.ts:988-994`) is explicit: it is a
   read-only metadata recovery surface ("Consumers can read this … without
   re-parsing the source CSS"). `grep -rn "registerProperty" src/` → **ZERO**. So a
   typed custom property the author declared via `@property` is, to the browser, an
   *untyped string* — the WAAPI path animates it **discretely** (silent regression
   vs the rAF path's JS interpolation). The platform's own typed-custom interpolation
   is parsed-but-never-registered.

2. **Reduced-motion is read ONCE per `play()` — zero `addEventListener('change')`.**
   `src/animation/internal/reduced-motion.ts:30` reads
   `window.matchMedia("(prefers-reduced-motion: reduce)").matches` (the single
   SSR-safe authority every play path consults via `withReducedMotion` — confirmed
   imported in `smooth.ts`/`group.ts`/`spring.ts`/`engine.ts`).
   `grep -rn "addEventListener" src/animation/ | grep change/matchMedia` →
   **none.** A long/infinite animation mid-flight ignores an OS reduced-motion toggle
   until the next `play()` — the gate is poll-per-play, not live-observed.

3. **`toWAAPIKeyframes` samples only at stop boundaries.** `waapi.ts:138-156`
   builds its `timePoints` set from `frame.time.start`/`frame.time.stop` only
   (`waapi.ts:139-141`), then emits one keyframe per sorted boundary. WAAPI fills
   *piecewise-linear* between emitted offsets → for a multi-component or
   unit-converted transform whose true rAF curve bends mid-segment, the compositor
   curve **drifts** from the JS curve between stops.

4. **The color rejection's premise is stale; `toWAAPIKeyframes` emits via the
   default serializer.** The WAAPI eligibility gate's historical "WAAPI only does
   sRGB lerp" premise predates CSS Color L4's `<color-interpolation-method>`. And
   `toWAAPIKeyframes` serializes endpoints through `unflattenObjectToString`
   (`waapi.ts:1`, used `:149`) with **no non-legacy-syntax guarantee** — emitting a
   legacy `rgb(...)` would silently engage WAAPI's legacy-sRGB interpolation.

5. **No native `ScrollTimeline`/`ViewTimeline` bridge exists; the JS `ScrollTimeline`
   is the only timeline.** `target.animate(keyframes, options)` (`waapi.ts:230`)
   passes **no** `timeline:` option; `grep -rn "new ScrollTimeline\|timeline:"
   src/animation/` finds only the JS `Timeline` abstraction (`timeline.ts`). The JS
   `ScrollTimeline` applies `SmoothProgress` smoothing + boundary snap
   (`timeline.ts:102-105`: `setTarget` → `snap` on boundary / `tickDt` mid-range) —
   a progress pipeline the native `animation-range` path does **not** have.

6. **`AnimationGroup`'s `add` blend composites in JS; `toWAAPIOptions` never sets
   `composite`.** `group.ts` exposes a `replace`/`add`/`weighted` JS compositor;
   `toWAAPIOptions` (`waapi.ts:173-211`) returns `{duration, delay, iterations,
   direction, fill, easing}` — **no `composite`** — so a native additive
   `KeyframeEffect.composite: "add"` is unused.

7. **The computed-value seam already exists** (value.js-owned `getComputedValue`,
   consumed by the engine for `vh`/`calc`/`var`/`cqw` resolution) — the same seam
   that would resolve `currentColor`/`light-dark()` per-target at frame-prep. The
   dynamic value.js edge `loadAnimationEngine()` → `import("./engine")`
   (`engine.ts:9,1042-1043`, `easing.ts:55-71`, `index.ts:20,78,93`) is the boundary
   every native lift rides — no NEW static value.js edge is introduced (inv α).

The wave's job: **adopt each native path behind a feature-detect, the JS path as the
proven fallback** — each closed by a re-runnable detect+equivalence instrument, with
zero regression where the feature is absent.

---

## § Goal

**What lands** (all gated on `if (feature in CSS/window)` / `@supports`; the
existing path is the fallback — pure progressive enhancement):

- **The parsed `@property` registry REGISTERED** — one guarded
  `CSS.registerProperty()` pass so a typed custom property interpolates smoothly
  (not discretely) on the native path. (D-LIB-1.)
- **Reduced-motion LIVE-observed** — one shared `MediaQueryList` + `change` listener
  in the one detector; running loops re-consult `withReducedMotion` and snap to rest
  on flip. (D-LIB-3.)
- **Dense WAAPI sub-segment sampling** — additional `offset` stops per segment so the
  compositor's piecewise-linear fill tracks the rAF curve. (F3.)
- **Native CSS Color L4 WAAPI color interpolation** — eligible color animations
  delegate to the UA's native `<color-interpolation-method>` (oklab non-legacy /
  sRGB legacy), emitted in **non-legacy syntax**, gated on a `(colorSpace, hueMethod)`
  default-match. (F2 / D-6 — **mechanism corrected**: main-thread native interp +
  JS-hot-path removal, NOT compositor offload.)
- **The ADDITIVE native `ScrollTimeline`/`ViewTimeline` WAAPI bridge** — when the
  target is DOM + the curve is WAAPI-eligible + a native timeline is available,
  attach via `Element.animate(keyframes, { timeline: new ScrollTimeline({source}) })`.
  **The JS sampler STAYS** (the ARCH-kill of *replacing* it HOLDS — additive only,
  no polyfill). (D-LIB-2 / F-5 / S-1.)
- **`currentColor`/`light-dark()` frame-prep resolution** (once value.js emits the
  sentinels — `E-HANDOFF`): resolved per-target via the existing computed-value seam.
  (`r-css-color.md` F1/F2.)

**Recorded-BOOK** (named, dispositioned, not folded this wave):
- `composite:"add"` for the group's additive layers — Baseline split annotated
  (segment-composite viable; `iterationComposite` not). (F4 / W6.)
- `@property`-driven native length interpolation for registerable DOM targets — a
  W9-stretch behind D-LIB-1. (Finding 4.)
- `interpolate-size`/`calc-size()` — GAP-NAMED, its own future wave (limited
  availability; the `0fr→1fr` grid trick is ALREADY-SOTA on today's Baseline — do
  NOT modernize a working cross-browser solution into a Chromium-only one). (§5.)

**Why:** the library parses the platform but stops at the JS path on these axes,
silently leaving native fidelity on the table — discrete-instead-of-smooth typed
customs, a piecewise-linear compositor curve, a JS color serialize/reparse churn
where the UA would batch the update, a mid-flight PRM the OS toggled but the loop
never re-reads. Each fix is a feature-detected upgrade that **falls back exactly to
today's behaviour** where unsupported (no-legacy: no polyfill, the JS path is the
honest fallback). The adoptions the platform isn't ready for (native scroll
*replacing* the sampler; `interpolate-size`) are KILLED or BOOKED, not forced — KISS
forbids manufacturing a Chromium-only path where the cross-browser one is better.

---

## § Scope

Six sub-moves land (each feature-detected, each with the JS path as fallback);
three are recorded-BOOK. Every adoption is `file:line`-grounded.

### S1 — D-LIB-1: register the parsed `@property` registry

**WHAT:** at the end of `fromString` (after `this.propertyRegistry` is populated,
`engine.ts:1005`), one guarded pass: for each `[name, descriptor]` in
`propertyRegistry`, call `CSS.registerProperty({ name, syntax, inherits,
initialValue })` — **feature-detected** (`typeof CSS !== "undefined" && "registerProperty"
in CSS`; SSR/jsdom-guarded exactly like the engine's other capability gates) and
swallowing the benign `InvalidModificationError` thrown on a duplicate-name
re-registration.

**WHY:** a typed custom property the author declared via `@property` is, without
registration, an untyped string to the browser — the WAAPI path animates it
discretely, a silent regression vs the rAF path's JS interpolation
(`engine.ts:988-995`, the inert registry). Registering it makes the native path
interpolate the typed custom *smoothly*, isomorphism-restoring vs the JS path.
**Baseline 2024-07-09** (newly available — feature-detect mandatory). **Needs
value.js hand-off D-VJS-1** (lossless `syntax`/`inherits` round-trip — confirm-or-
expose; `E-HANDOFF`).

### S2 — D-LIB-3: live reduced-motion observation

**WHAT:** in `internal/reduced-motion.ts` (the one detector,
`reduced-motion.ts:30`), hold a single module-level `MediaQueryList` and attach one
`change` listener (feature-detected; the existing SSR guard already covers absent
`matchMedia`). Running play loops re-consult `withReducedMotion` per tick (the
import is already in `engine.ts`/`group.ts`/`smooth.ts`/`spring.ts`) and **snap to
rest** on a flip to `reduce` mid-flight.

**WHY:** `reduced-motion.ts:30` reads `.matches` once per `play()`; a long/infinite
animation that is mid-flight when the OS toggles reduced-motion ignores it until the
next `play()` (state §2). One shared listener makes the gate **live** — the engine's
"one PRM detector" idiom (already the canonical authority) gains the missing
*observation* half. **Baseline widely available**; SSR guard already present.

### S3 — F3: dense WAAPI sub-segment keyframe sampling

**WHAT:** in `toWAAPIKeyframes` (`waapi.ts:138-156`), emit **additional `offset`
stops per segment** (not just the stop boundaries `waapi.ts:139-141`) by sampling
the true rAF curve at intermediate offsets — reusing the **same "sample-the-true-
curve" idiom `springLinearStops.ts` already proves** (its default 24-stop emit,
`springLinearStops.ts:46`). Bound the per-segment stop count.

**WHY:** WAAPI fills piecewise-linear between emitted offsets, so a multi-component
or unit-converted transform whose true curve bends mid-segment drifts from the rAF
curve (state §3). Denser sampling tracks the curve. **Strictly fidelity-improving** —
the delegated path moves *toward* the JS path, never away.

### S4 — F2 / D-6: native CSS Color L4 WAAPI color interpolation (MECHANISM CORRECTED)

**WHAT:** make a color `InterpolatedVar` WAAPI-eligible **iff** (a) both endpoints
serialize to a single valid CSS color string, AND (b) the requested
`(colorSpace, hueMethod)` **matches the UA's `color-interpolation-method` default
for that endpoint family** (oklab non-legacy / sRGB legacy) or can be pinned via an
emitted `color-interpolation-method`; else the animation **stays on the rAF/JS
path** (which runs the exact requested space). **CRITICAL emit criterion
(`r-waapi.md` W2):** `toWAAPIKeyframes` (`waapi.ts:149`) must emit endpoints in
**non-legacy CSS-L4 syntax** (`oklch(...)`/`color-mix(in oklab, ...)`) — emitting
legacy `rgb(r g b)` would silently engage WAAPI's *legacy sRGB* interpolation (muddy
midpoint) and break isomorphism.

**MECHANISM CORRECTION (`r-css-color.md` F5 over `d-color-interp.md` D-6):** the win
is **NOT compositor thread-offload** — `background-color`/`color` are **not**
compositor-accelerated (only `transform`/`opacity`/`filter`/`backdrop-filter` are).
A WAAPI color animation runs on the **main thread**, same as the rAF loop. The
*real, still-substantial* win: it eliminates value.js's per-frame JS interp + the
`Color.toString` serialize/reparse churn (~290 ns/frame/color-property per
`d-color-interp` D-1/D-3) and lets the UA batch the style update inside its own tick
rather than a JS `setProperty` per frame. For `filter: drop-shadow(<color>)` the
compositor story IS better; for paint props the honest framing is *correct
perceptual color via a unified path + JS-hot-path removal*.

**WHY:** the color rejection's premise is stale (state §4); at the engine *default*
`colorSpace: "oklab"`, native non-legacy interpolation matches the JS path's space —
so the delegation is isomorphism-preserving AND removes the JS hot-path color churn.
A non-default space (e.g. `lch`) or a non-honorable hue method stays on the JS path,
which runs the exact requested space. **Needs value.js hand-off**
(`cssColorInterpKeyword` + an L4-space-preserving, non-legacy serializer — the
`Easing.css` analogue for color; `E-HANDOFF`).

### S5 — D-LIB-2 / F-5: the ADDITIVE native `ScrollTimeline`/`ViewTimeline` bridge

**WHAT:** when the target is DOM + the curve is WAAPI-eligible + a native timeline is
available (`"ScrollTimeline" in window`), attach the animation via
`Element.animate(keyframes, { timeline: new ScrollTimeline({ source }) })` (or
`ViewTimeline`) — compositor-thread, zero main-thread sampling. **The JS `Timeline`
STAYS** as the feature-detected fallback AND the general non-DOM driver over
arbitrary objects.

**CRITICAL — the ARCH-kill HOLDS (`r-scroll-view-transitions.md` S-1, re-confirmed
twice).** *Replacing* the JS sampler with native is the wrong move: native is
**Chromium-only / not-Baseline** (corpus-confirmed: Chrome 115 / Edge 115 / Safari
26, **not Firefox**) AND the JS `Timeline` is a strictly more general caller-polled
sampler over arbitrary objects, not a substitute. This is the **additive bridge
only** — the JS sampler is not deprecated. **DO NOT use `scroll-timeline-polyfill`**
(guidance-named; corpus: "not feature complete … known issues").

**Progress-reconciliation caveat (`r-waapi.md` W3).** The JS `ScrollTimeline`
applies `SmoothProgress` smoothing + boundary snap (`timeline.ts:102-105`); the
native `animation-range` path has **none** — so the bridge's equivalence test MUST
reconcile the smoothing (disable it on the native lane) OR accept a *documented*
divergence; the two progress pipelines are NOT trivially equal. The native lane also
has the W7-W1 lifecycle shape — an infinite scroll timeline never resolves
`finished` (correctly long-lived; same commit/cancel discipline as W7's
commit-on-finish).

**WHY:** native scroll-driven delegation is compositor-thread with zero main-thread
sampling — the competitive-parity win (`r-anim-libs.md` F-5) — but only where the
platform supports it AND the smoothing reconciles. The JS sampler is the proven,
more-general fallback. **Limited availability — feature-detect mandatory, no
polyfill.**

### S6 — `currentColor` / `light-dark()` resolution policy (`r-css-color.md` F1/F2)

**WHAT:** once value.js emits the parser sentinels (a `currentColor` color-keyword
ValueUnit and a `FunctionValue("light-dark", [c1, c2])` — `E-HANDOFF` F2), keyframes
resolves them **per-target at frame-prep via the existing computed-value seam**
(state §7): `currentColor` ← `getComputedStyle(target).color`; `light-dark(a, b)` ←
the target's used `color-scheme` (or `matchMedia('(prefers-color-scheme: dark)')`
fallback) selecting the branch — then interps as a normal color.

**WHY:** this is the *color* analogue of the `vh`/`var()`/`calc()` computed-unit
story the engine already solves; resolving from the UA's own computed value is *more*
isomorphic than today's hard parse-failure. Browsers resolve `currentColor`
natively, so such an animation need only be marked WAAPI-ineligible if it actually
must. **Gated on the value.js sentinels** (`E-HANDOFF` F2) — the kf side is the
frame-prep resolution policy only.

### Recorded-BOOK (named + dispositioned, not folded this wave)

- **`KeyframeEffect.composite: "add"` for AnimationGroup additive layers — Baseline
  split (F4 / `r-waapi.md` W6).** `toWAAPIOptions` never sets `composite`
  (`waapi.ts:173-211`); `AnimationGroup`'s `add` blend composites in JS (state §6).
  A group-level lift to native `composite: "add"` for the *segment* composite is
  **Baseline-viable today** (`KeyframeEffect.composite` Baseline widely available);
  the *per-iteration* analogue is **NOT** (`iterationComposite` not Baseline).
  Caveat: native `composite:"add"` composes transform lists by *concatenation* —
  verify the group's `add` semantics match before delegating, or restrict to scalar
  props (opacity, single-axis) where concatenation == summation. **BOOK** (defer to
  `a-kf-waapi.md` F4; the Baseline annotation pins which half is portable).
- **Finding 4 — `@property`-driven native length interpolation for registerable DOM
  targets.** The deeper transposition that makes `calc(100cqw - 100%)` interpolate
  natively on the compositor (live-resolved, resize-correct), closing the
  computed-unit JS round-trip for DOM. **BOOK as a W9-stretch** — larger, overlaps
  the bridge; ship the registration (S1) first, the native-drive second only if a
  consumer story demands it.
- **`interpolate-size` / `calc-size()` — native height/auto animation (GAP-NAMED,
  `r-css-values.md` §5).** THE native primitive for the most-requested animation the
  library cannot do: `height`/`block-size` to/from `auto`/`max-content`/`fit-content`.
  Two moves: a value.js `calc-size()` parser (re-scoped BOOK→`E-HANDOFF`) and a new
  engine capability that either emits `interpolate-size: allow-keywords` + delegates,
  OR measures the intrinsic size via `getComputedValue` and interpolates numerically
  (value.js-free fallback). **GAP-NAMED / BOOK, its own wave** — **limited
  availability (Chrome/Edge 129 only; no FF/Safari)**, so the engine path is a guarded
  enhancement with the JS-measure floor, not a Baseline drop-in. The demo's `0fr→1fr`
  grid trick is **preferable** on today's Baseline (recorded ALREADY-SOTA — §Folds);
  do NOT modernize a working cross-browser solution into a Chromium-only one. Revisit
  when `interpolate-size` reaches Baseline.

---

## § Hard gate (`proof:platform-adopt` — inv ξ · falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real feature-detect /
behaviour-equivalence test, not an assertion). Each adopted feature carries:
**(a)** a feature-detect guard test (the path no-ops where unsupported —
jsdom/SSR green); **(b)** a behaviour-equivalence test that the native path
reproduces the JS-path output where both run (the same eligibility gate WAAPI
already enforces). Plus the named per-feature clauses:

1. **`@property` registry → `CSS.registerProperty()` (S1).** A lock-test asserts the
   registry is **no longer inert**: a `@keyframes` input carrying an `@property`
   declaration produces an actual `CSS.registerProperty(...)` call (spy/mock) at the
   end of `fromString`, feature-detect-guarded, duplicate-name throw swallowed.
   **BITE:** revert the registration pass → the spy records zero calls → reds (today's
   state: `grep registerProperty src/` = ZERO).

2. **Live-PRM listener flips a mid-flight infinite animation to rest (S2).** A test
   that starts an infinite animation, dispatches a `change` event on the PRM
   `MediaQueryList` (to `matches: true`), and asserts the running loop snaps to rest.
   **BITE:** **reds today — no `change` listener exists** (state §2,
   `grep addEventListener.*change src/animation` = none); greens on the shared
   listener; reds again if the listener is removed.

3. **Dense WAAPI sampling tracks the rAF curve (S3).** For a multi-component
   transform with a non-linear segment, the WAAPI keyframe set carries
   intermediate-offset stops AND the compositor-sampled midpoint matches the rAF
   midpoint within tolerance. **BITE:** restore the boundary-only emit
   (`waapi.ts:139-141`) → the midpoint diverges past tolerance → reds.

4. **Native color delegates ONLY on a default-match, in non-legacy syntax (S4).**
   (i) At the engine default `colorSpace: "oklab"` a color animation is WAAPI-eligible
   AND its emitted endpoints are **non-legacy syntax** (`oklch(...)`/`color-mix(in
   oklab,...)`, NOT `rgb(...)`); (ii) at `colorSpace: "lch"` (non-default) the
   animation **stays on the JS path** (eligibility = false). **BITE:** emit a legacy
   `rgb(...)` endpoint → the non-legacy assertion reds; mark `lch` WAAPI-eligible →
   the stays-on-JS assertion reds.

5. **The native scroll bridge is ADDITIVE + reconciles smoothing (S5).** (i) Where
   `"ScrollTimeline" in window`, a DOM + eligible animation attaches a native
   `timeline:`; where absent, it falls back to the JS `Timeline` (no-op detect,
   jsdom green); (ii) the JS `Timeline` sampler **still exists and is reachable** (the
   ARCH-kill holds — `grep` the JS `ScrollTimeline` class survives); (iii) the
   equivalence test reconciles `SmoothProgress` (disabled on the native lane,
   `timeline.ts:102-105`) OR records a documented divergence. **BITE:** delete the JS
   sampler → the additive-fallback clause reds; ship the bridge with smoothing ON +
   no reconciliation → the equivalence test reds.

6. **`currentColor`/`light-dark()` resolve via the computed-value seam (S6).** Gated
   on the value.js sentinels landing (`E-HANDOFF` F2); until then **recorded-pending**
   with the resolution policy stated. When the sentinels land: a `currentColor`
   endpoint resolves to `getComputedStyle(target).color` at frame-prep and interps as
   a normal color. **BITE:** a `currentColor` that hard-parse-fails (today's
   behaviour) reds the resolution clause once the sentinel is available.

7. **No regression where the feature is absent.** `npm test` stays green; on an
   engine without any of the features (the SSR/jsdom baseline) every native path
   no-ops to exactly today's behaviour. `proof:boundary` (the light/heavy edge) and
   `proof:zero-alloc` are UNTOUCHED (no new static value.js edge — inv α; the light
   helpers carry zero static value.js edge). **BITE:** a native path that throws
   (rather than no-ops) where the feature is absent → the SSR baseline reds.

**Feature-detect discipline (the wave's non-negotiable).** No native lift lands
without (a) a runtime feature-detect (`X in CSS`/`X in window`/`@supports`) AND (b) a
behaviour-equivalence assertion to the JS path. No polyfill — the JS path is the
fallback. This is the same eligibility-gate discipline the WAAPI delegation already
enforces, widened to the new native surfaces.

---

## § Folds

Retires (by finding id):
- **D-LIB-1** (`@property` registry registered) — S1 + gate clause 1.
- **D-LIB-3** (live reduced-motion observation) — S2 + gate clause 2.
- **F3** (dense WAAPI sub-segment sampling) — S3 + gate clause 3.
- **F2 / D-6** (native CSS Color L4 WAAPI interp — mechanism corrected) — S4 + gate
  clause 4.
- **D-LIB-2 / F-5** (the additive native ScrollTimeline/ViewTimeline bridge) — S5 +
  gate clause 5.
- **`r-css-color.md` F1/F2** (`currentColor`/`light-dark()` resolution policy) — S6 +
  gate clause 6 (pending the value.js sentinels).

**Recorded-BOOK (named, dispositioned, not folded this wave):**
- **F4 / `r-waapi.md` W6** (`composite:"add"` — Baseline split: segment-composite
  viable, `iterationComposite` not) — BOOK to `a-kf-waapi.md` F4.
- **Finding 4** (`@property`-driven native length interpolation) — BOOK as a
  W9-stretch behind S1.
- **`r-css-values.md` §5** (`interpolate-size`/`calc-size()`) — GAP-NAMED, its own
  future wave (limited availability; JS-measure floor).

**Routed OUTWARD to `E-HANDOFF` (value.js prerequisites — inv-16, never authored
here):**
- **D-VJS-1** — lossless `@property` `syntax`/`inherits` round-trip (enables S1).
- **F2-color** — `cssColorInterpKeyword` + an L4-space-preserving, non-legacy color
  serializer (enables S4).
- **F2 (sentinels)** — a `currentColor` color-keyword ValueUnit + a
  `FunctionValue("light-dark", [c1, c2])` (enables S6).
- **§5** — a bounded `calc-size()` grammar extension (enables the BOOKED
  `interpolate-size` wave).

**Recorded ALREADY-SOTA / KILL (the augmentation manufactures NO work here):**
- **The WAAPI eligibility gate's discipline is RIGHT** — W9's color/`@property`/
  dense-sampling/scroll-bridge/`composite` items are *widenings* of the gate, not
  corrections to it. The easing-faithfulness check, the `usesDefaultRenderer`
  bind-proof, and the CSS-twin-across-segments rejection stay.
- **The `var()`/computed-unit rejection is correct *by reasoning* (`r-waapi.md` W4
  — the honest negative result).** Even a *corrected* predicate keeps `var()` out:
  registered `@property` customs **do not composite anyway** (they rasterize per
  frame) AND `var()` needs live DOM resolution the compositor can't replicate. The
  arrival of `@property` Baseline does **NOT** open a delegation lift here — fold the
  rationale into W7's docstring rewrite so the contract reads as *deliberate*.
- **Native ScrollTimeline *replacing* the JS sampler — KILLED (re-confirmed twice).**
  Native is Chromium-only/not-Baseline AND the JS `Timeline` is a strictly more
  general caller-polled sampler over arbitrary objects AND it applies smoothing the
  native path lacks. W9's bridge is **additive only**. (`r-scroll-view-transitions.md`
  S-1, `r-waapi.md` W3.) **No `scroll-timeline-polyfill`** (guidance-named).
- **The demo's `0fr→1fr` grid-row height trick — ALREADY-SOTA, KEPT.** JS-measurement-
  free and *preferable* to `interpolate-size` on today's Baseline (`r-interpolation.md`
  F-7). Do NOT modernize it into the Chromium-only feature.

---

## § Isomorphism

**Pixel-stable on every existing path.** All native lifts are
**isomorphism-restoring-or-befitting**, never a regression:

- **S1 (`@property`)** — typed customs go *discrete → smooth* on the native path
  (toward the rAF JS path's fidelity, not away). Isomorphism-**restoring**.
- **S2 (live PRM)** — a mid-flight `reduce` flip is now honored (the OS preference
  the loop was ignoring). Befitting + a11y-correct; pixel-stable for the
  motion-OK case.
- **S3 (dense sampling)** — strictly fidelity-improving: the compositor curve moves
  *toward* the rAF curve. The boundary endpoints are unchanged; only the
  between-stop fill tightens.
- **S4 (native color)** — at the default `oklab` the native space *matches* the JS
  space, so the delegation is pixel-equivalent (the non-legacy emit criterion
  guarantees it; a default-mismatch stays on JS). The framing is honest: native color
  is *main-thread native interp + JS-hot-path removal*, NOT compositor offload.
- **S5 (scroll bridge)** — pixel-stable where supported (eligible curve only) AND the
  smoothing is reconciled (disabled on the native lane) or the divergence is
  *documented*; the JS sampler is unchanged for every other caller.
- **S6 (`currentColor`/`light-dark()`)** — resolving from the UA's own computed value
  is *more* isomorphic than today's hard parse-failure.

**Every path feature-detected → zero regression on engines without the feature.**
Where a feature is absent the native path no-ops and the existing JS path runs
verbatim — the SSR/jsdom baseline is pixel-identical to today. The boundary holds:
`@property`/scroll-bridge live behind the existing WAAPI / `loadAnimationEngine`
dynamic edge; no new static value.js edge (inv α), `proof:boundary` stays green.

---

## § Design decisions

1. **Feature-detect, never polyfill — the JS path IS the fallback.** RESOLVED: the
   no-legacy/no-workaround mandate forbids a shim. Every native lift gates on a
   runtime detect; where the feature is absent, the existing JS path runs verbatim.
   The modern-web-guidance corpus corroborates explicitly for the scroll bridge
   (**DO NOT use `scroll-timeline-polyfill`** — "not feature complete … known
   issues"). Trade-off: two code paths per adopted feature — but the JS path already
   exists (it's the current behaviour), so the marginal cost is the detect + the
   equivalence test, not a parallel implementation. The detect+equivalence pair is
   the same discipline the WAAPI eligibility gate already proves.

2. **The native-color win is main-thread native interp + JS-hot-path removal, NOT
   compositor offload — and the record says so (CORRECTION).** RESOLVED + HONEST
   (inv ε): `d-color-interp.md` D-6's "compositor offload" premise is **stale**
   (`r-css-color.md` F5) — `background-color`/`color` are NOT compositor-accelerated.
   The real win is eliminating value.js's per-frame JS color interp + the
   `Color.toString` serialize/reparse churn and letting the UA batch the update. The
   FINAL must not overclaim "color animations went to the compositor." Trade-off: the
   correction *narrows* the headline — but an honest narrower claim beats a wrong
   bigger one, and the win (the ~290 ns/frame/color-property JS-hot-path removal +
   correct perceptual color via a unified path) is real and substantial. For
   `filter: drop-shadow(<color>)` the compositor story IS better — stated separately.

3. **Non-legacy syntax emit is a HARD acceptance criterion for native color, not a
   nicety.** RESOLVED (`r-waapi.md` W2): WAAPI's `<color-interpolation-method>`
   default is **oklab for non-legacy syntax, sRGB for legacy**. Emitting a legacy
   `rgb(r g b)` endpoint (today's default serializer path, `waapi.ts:149`) would
   silently engage *legacy sRGB* interpolation — a muddy midpoint that breaks
   isomorphism vs the engine's `oklab` default. So S4 gates the delegation on a
   non-legacy emit AND a `(colorSpace, hueMethod)` default-match; a non-default space
   (e.g. `lch`) stays on the JS path, which runs the exact requested space. The
   value.js L4-space-preserving serializer (`E-HANDOFF`) is the prerequisite.

4. **The ScrollTimeline ARCH-kill HOLDS — the bridge is ADDITIVE only.** RESOLVED
   (re-confirmed twice — `r-scroll-view-transitions.md` S-1, `r-waapi.md` W3):
   *replacing* the JS sampler is wrong because (a) native is Chromium-only/not-
   Baseline (corpus: Chrome 115/Edge 115/Safari 26, not Firefox), (b) the JS
   `Timeline` is a strictly more general caller-polled sampler over arbitrary objects
   (not a DOM-scroll substitute), and (c) the JS sampler applies `SmoothProgress`
   smoothing + boundary snap the native `animation-range` path lacks
   (`timeline.ts:102-105`). W9 attaches a native `timeline:` as an *additive* fast
   lane where supported + eligible; the JS sampler stays the fallback and the general
   driver. Trade-off: two timeline paths — but the JS one is load-bearing for non-DOM
   targets and for Firefox, so it cannot be removed; the native one is pure
   enhancement.

5. **`@property` Baseline does NOT open a `var()` WAAPI lift — the rejection is
   correct by reasoning.** RESOLVED (`r-waapi.md` W4, the honest negative result):
   even after S1 registers the typed customs, `var()`/registered customs still must
   NOT delegate — registered `@property` customs **do not composite** (they rasterize
   per frame) AND `var()` needs live DOM resolution the compositor can't replicate.
   The W4 rationale folds into W7's WAAPI-guard docstring rewrite so the `var()`
   exclusion reads as *deliberate*, not incidental, even as `@property` becomes
   Baseline. S1 is about *typed-custom interpolation fidelity on the native
   animation*, NOT about admitting `var()` to WAAPI delegation — distinct concerns.

6. **Adopt where the platform is ready; BOOK/KILL where it isn't — no manufactured
   Chromium-only paths.** RESOLVED (KISS): the adoptions that are Baseline-safe + a
   net fidelity win land feature-detected (S1–S5); the ones the platform isn't ready
   for are dispositioned, not forced — `composite:"add"` is BOOKED with the Baseline
   split (`iterationComposite` not Baseline), `interpolate-size`/`calc-size()` is
   GAP-NAMED for its own future wave (Chrome 129 only), and the demo's working
   cross-browser `0fr→1fr` grid trick is recorded ALREADY-SOTA — explicitly NOT
   modernized into the Chromium-only `interpolate-size`. Trade-off: the GAP-NAMED
   items leave a visible "not yet" on the record — but naming a gap honestly beats
   shipping a Chromium-only path that regresses Firefox/Safari, which the
   isomorphism + no-legacy mandates forbid.

7. **inv ξ is the standing proof — it STAYS in CI after the wave closes.** RESOLVED:
   `proof:platform-adopt` is the falsifiable invariant — *the engine adopts the
   platform where Baseline-safe, feature-detected, with the JS path as the proven
   fallback; native color is admitted only on a default-match + non-legacy emit; the
   ScrollTimeline JS sampler is NOT replaced.* It reds today (zero
   `CSS.registerProperty`, zero PRM `change` listener — both verified) and each
   adoption greens its detect+equivalence test; it reds again on any future
   regression (a native path shipped without a detect, a color delegation in legacy
   syntax, a deleted JS sampler). The invariant retires its *waves* but its *gate*
   stays in CI as the standing guard.
