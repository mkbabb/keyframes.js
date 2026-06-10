# JUDGE LANE 1 — the KILL-RESPECT + ON-BRAND filter

**Lane:** judge-1 (FRONTIER-RESEARCH fleet, K-tranche seeding · 2026-06-10). **Charter:** read
ALL 10 frontier lane docs + their structured proposals; for EVERY proposal apply four tests —
(a) does it brush an ARCH kill, and is the lane's distinction argument strong enough to survive?
(b) the on-brand test (extends a unique axis: CSS round-trip / oklab / weighted blend / cq-units
/ proof-culture — OR closes a named gap in a way only kf can); (c) KISS (light-bundle / API-surface
bloat vs value); (d) overlap dedup (name the canonical owner where two lanes proposed the same
thing). Return per-proposal `{uphold | override, newVerdict?, reason}`. **Ruthless by mandate:**
the user's history punishes bloat and rewards gestalt; a researched KILL is a result, not a failure.

Method: every lane doc read end-to-end; load-bearing source claims spot-verified at `file:line`
(`group.ts:345-365` weighted; `adapter.ts:24-29,120-126` composition capture; `engine.ts` grep
confirms `resolved.composition` never read; `package.json:161-162` the spurious vue peer;
`stagger.ts:69` `.delays(total)`). The ARCH kill list and platform facts taken from the judge
charter + `sota-landscape.md`.

---

## §0 The ARCH kill list (the bar every proposal is measured against)

Permanent, recorded A→H, do NOT re-litigate:
1. **ScrollTimeline-native-REPLACE** — replacing kf's JS progress driver with native. NOTE: net-new
   scroll ORCHESTRATION is explicitly NOT this kill; `createNativeTimeline` already wraps native.
2. **Worker / OffscreenCanvas / Houdini-paint.**
3. **WASM-parser.**
4. **Typed-OM-as-interp-carrier.**
5. **Per-property keyframe easing.**
6. **Bit-packing.**
7. **ValueUnit monomorphization.**

The on-brand axes (a proposal must extend one, or close a named gap only kf can):
(1) CSS `@keyframes` round-trip · (2) perceptual oklab · (3) weighted layer blend · (4) cq-unit
animation · (5) proof-culture / conservative-correct WAAPI delegation.

---

## §1 The judge's standard

I UPHOLD a lane verdict unless one of four override conditions fires:
- **OVERRIDE→KILL** if the proposal brushes an ARCH kill and the distinction argument is weak/absent,
  OR it is me-too (fails the on-brand test), OR it bloats the light bundle / API surface beyond value.
- **OVERRIDE→demote** (K-HEADLINE→K-CANDIDATE, K-CANDIDATE→J-FOLD/BOOK) if the lane over-claimed the
  effort, novelty, or workload, or if a sibling lane is the canonical owner of the same idea.
- **OVERRIDE→re-attribute** (dedup) — name the canonical owner; the non-owner's instance is folded.
- I do NOT promote verdicts; a judge tightens, it does not inflate. (One near-promotion noted in §5
  for the fleet synthesis, not applied to a per-proposal verdict.)

The self-skeptical lanes did most of my work for me: the fleet returned **8 KILLs, 5 BOOKs, and a
disciplined set of K verdicts**, with the dangerous "unique-axis!" seductions (VT parse-round-trip,
compositor-offloaded oklab, the L2 spec-mimicry, the splitText port) already self-killed. My job is
to confirm those kills are correctly reasoned (they are), catch the over-claims the lanes missed,
and resolve the cross-lane overlaps.

---

## §2 The headline finding — the K tranche has ONE spine, and the lanes converged on it

Six lanes independently pointed at the SAME axis: **the CSS round-trip is the only structural moat
no competitor can occupy, and the K tranche is its expansion in three directions** —

- **FORWARD over the live page** (`live-stylesheet-ingestion/K1` `fromStyleSheets()` — K-HEADLINE).
- **BACKWARD into zero-runtime CSS** (`css-compiler/CC-1` — K-HEADLINE; `text-ranges-stagger/K-T2`
  the stagger leg; `scroll-orchestration/SO-1` the scroll-grammar leg).
- **AGENT-LEGIBLE** (`ecosystem-distribution/ED-1` llms.txt + proof-as-artifact — K-HEADLINE).

Plus two genuinely orthogonal-but-on-brand headlines that ride OTHER unique axes:
- **`physics-frontier/PHYS-C`** (spring-driven blend weight) — the only headline on axis-3 (weighted
  blend), and the only one no competitor can even substrate.
- **`waapi-level-2/WL2-B`** (honor author-declared `animation-composition`) — a ripe correctness gap
  on axis-1 × axis-3 that the source already substrated (G.W17).

**This convergence is the gestalt the user rewards.** It also means the judge's primary risk is
DUPLICATION across the round-trip lanes — handled in §4. There are FIVE K-HEADLINE-CANDIDATEs across
the fleet; the K tranche cannot have five headlines. I uphold all five AS CANDIDATES (the fleet's
job was to surface candidates, not pick one) but record the priority read in §5: the K tranche's
true headline is **the round-trip-CSS compiler/ingester pair**, with the agent surface as its
distribution face and the two engine headlines (PHYS-C, WL2-B) as the on-brand body.

---

## §3 Per-proposal rulings (grouped by lane; full reasons in the structured return)

### view-transitions
- **VT-C-spring-vt** — UPHOLD K-CANDIDATE (S). Clean: spring `linear()` into a VT pseudo's
  `animation-timing-function` extends the spring+linear()-twin axis to a new platform surface, reuses
  the existing export (0 new engine code), brushes no kill (VT is not on the list; it is WAAPI-delegate
  philosophy, alive). The overshoot-VT is genuinely novel. Correctly held SMALL and gated on a
  perceptual probe. The lane's own skepticism (it is nearly J-sized) is the right calibration.
- **VT-A-flipshared-vt-dispatch** — UPHOLD KILL. Inv-16 breach (the VT helper is glass-ui's, already
  consumed) AND the §2 sibling scar (the rAF `flipShared` is the BETTER primitive for live content;
  VT taffy-stretches a bitmap). A two-reason kill; both hold.
- **VT-B-parse-roundtrip-vt-keyframes** — UPHOLD KILL. The most seductive "unique axis!" framing in
  the fleet, correctly rejected: kf parses `@keyframes` BODIES, not stylesheet RULES/selectors; the
  VT `@keyframes` are already ordinary keyframes kf handles; the animation runs on the compositor
  against snapshots, bypassing every kf axis; no workload. A researched KILL of exactly the bloat the
  user punishes.
- **VT-D-cross-document** — UPHOLD BOOK. No JS insertion point (the browser owns the MPA transition),
  not Baseline. Correctly recorded, not killed.

### live-stylesheet-ingestion
- **K1 (`fromStyleSheets()`)** — UPHOLD K-HEADLINE-CANDIDATE (M). The cleanest expression of "CSS as
  source of truth = the WHOLE web's CSS." M-effort precisely because no parser work (the CSSOM emits
  the exact `cssText` string the existing pipeline eats). Brushes no kill (reads a string, feeds the
  string parser — not WASM, not Typed-OM). Carries axes 2/3 for free. Strong.
- **K2 (`adopt()`)** — UPHOLD K-CANDIDATE (L). Round-trip into the TEMPORAL dimension (the running
  playhead). Correctly downstream of K1 and L-effort (the takeover continuity is delicate). Reuses the
  `commitStyles` discipline kf already proved. **Overlap note:** this is the SAME seam as
  `waapi-level-2/WL2-C` (getAnimations adopt). Dedup in §4 — K2 is the canonical owner.
- **K3 (`diagnostics` channel)** — UPHOLD K-CANDIDATE, with the lane's own J-FOLD rider honored: the
  two engine-internal rows (`EMPTY_PARSE`/`UNKNOWN_TIMING_FN`) fold into J.W1; the full channel (CORS
  skip, WAAPI reasons) stays K (it presupposes K1). Productizes the proof culture (axis 5). Correct.
- **K4 (`instrument()` LoAF)** — UPHOLD BOOK. On-brand ONLY at the hard attribution layer, Chrome-only
  (LoAF not Baseline), and the attribution may not pan out. The lane killed the me-too-wrapper reading
  itself. Correct BOOK.
- **K5 (embeddable inspector/bookmarklet)** — UPHOLD BOOK. A distribution narrative riding axis-1, not
  an engine capability; a second-product scope-creep (CORS wall, extension maintenance) presupposing
  K1+K2+K3 AND the J publish. Correctly the north-star demo, not a wave.

### scroll-orchestration
- **SO-1 (scroll-grammar round-trip)** — UPHOLD K-HEADLINE-CANDIDATE (L). The §0 distinction is
  air-tight and the most important in the fleet: this ADDS a parse+dispatch tier ABOVE the JS driver;
  it never proposes deleting the JS `ScrollTimeline` (the kill). The fallback matrix KEEPS the JS
  sampler as the universal driver. Extends axis-1 at the #1 named gap; only kf round-trips scroll-driven
  CSS. Held back from the round-trip-compiler headline only by the value.js extractor HANDOFF dependency.
- **SO-2 (`ScrollScene` JS driver)** — UPHOLD K-CANDIDATE (M). Net-new orchestration (charter-granted),
  mostly COMPOSES shipped primitives (SmoothProgress scrub, decay/spring snap). The honest "composition
  not invention" framing is correct; a K wave under SO-1, not a headline.
- **SO-3 (sticky-synthesis pin)** — UPHOLD K-CANDIDATE (folds into SO-1's ScrollScene). The only
  kf-shaped pin: emit `position:sticky` CSS (the platform owns the mechanism), don't reimplement it.
  Stays inside the CSS-emit axis. Correct.
- **SO-4 (transform-pinning)** — UPHOLD KILL. Sibling-confirmed wrong primitive (cross-thread repaint
  jitter; the glass-ui dock-VT scar). Researched rejection.
- **SO-5 (scroll-entry batching)** — UPHOLD J-FOLD. Reuses the shipped `YIELD_BATCH`/`scheduler.yield`
  idiom; too small for a wave. (The lane did not name the J wave; it is engine-internal batching — note
  for the K tranche it actually belongs WITH SO-2's driver if SO ships, else it is a standalone
  micro-fold. Minor; verdict upheld.)

### css-compiler
- **CC-1 (compile graph → zero-runtime CSS + ineligibility report)** — UPHOLD K-HEADLINE-CANDIDATE (XL).
  The PUREST axis-1: `format.ts` is `keyframes.ts` run backward over the same data model; the moat is
  structural (competitors author in a non-CSS tween model, so they have nothing to invert). Brushes no
  kill — it is an author-time STRING emitter; the shipped page carries zero kf code (the inverse of a
  perf hazard). The `@supports(animation-timeline)` variant is correctly a BOOK (CC-6), not the default,
  so it does NOT brush the ScrollTimeline kill (it is an export artifact, not a runtime sampler swap).
- **CC-2 (oklab densify-to-CSS-stops)** — UPHOLD K-CANDIDATE (M). The one place the compiler OUT-expresses
  naive `@keyframes` — projects axis-2 into the artifact. MEASURE-FIRST gated correctly (ΔE pixel proof
  decides ship-vs-refuse). **Distinct from the killed `compositor-eligibility/CE-3`:** CE-3 emits oklab
  stops to WAAPI hoping for compositor offload (KILLED — color doesn't composite); CC-2 emits oklab stops
  as authored CSS the browser fills natively (no offload claim — fidelity only). The judge confirms these
  are NOT the same proposal; CC-2 survives where CE-3 dies precisely because it makes no offload claim.
- **CC-3 (ineligibility report)** — UPHOLD K-CANDIDATE (M). The trust surface; generalizes
  `waapiIneligibleReason`. Proves axes 2/3 are beyond CSS from the other side. On-brand (proof culture).
- **CC-S (stagger → literal nth-child delays)** — UPHOLD K-CANDIDATE (S), **with a dedup constraint
  (§4).** This is the SAME stagger-compile seam as `text-ranges-stagger/K-T2`, approached from the
  universal-Baseline side (materialized `:nth-child` literals) vs K-T2's bleeding-edge side
  (`sibling-index()`). They are two emit-modes of ONE emitter. **Canonical owner: a single
  `staggerCSS()` emitter that emits the literal-delay form by default (universal, Baseline) and the
  `sibling-index()` form behind `@supports` (CC-6/K-T2's progressive variant).** CC-S and K-T2 must
  NOT ship as two separate emitters — that is exactly the duplication the user punishes.
- **CC-7 (blanket @starting-style)** — UPHOLD KILL. Platform-correct: `@starting-style` is a TRANSITION
  construct; an `@keyframes 0%` already animates from start. A scoping correction that keeps the compiler
  honest. Correct kill.
- **CC-5 (pre-multiply static weights → replace)** — UPHOLD BOOK. A real partial-compile of axis-3, but
  premature; recorded so the K tranche evaluates it. Correct.
- **CC-4 (Editor "Export CSS" button)** — UPHOLD K-CANDIDATE (M). Axis-1 dogfooded as a user-facing
  feature; the ineligibility report teaches where kf exceeds CSS. Depends on CC-1; a clean demo leg.

### compositor-eligibility
- **CE-1 (per-property delegation split)** — UPHOLD K-CANDIDATE (L). The lone survivor; extends the
  conservative-correct delegation axis from per-animation to per-property granularity. The §0 brush-check
  is exhaustive and clean (NOT ScrollTimeline-replace, NOT Typed-OM, NOT per-property EASING — it is
  per-property DELEGATION of uniform-easing properties). Correctly gated on a workload census (does a real
  kf animation MIX a compositable transform with a non-compositable color/layout property?) — that census
  is the honest risk and the lane named it. Upheld as a CANDIDATE, not a headline, exactly because the
  addressable-workload question is open.
- **CE-1.0 (Safari linear() HW-accel hazard, current path)** — UPHOLD J-FOLD → J.W6. A correctness
  tightening of the EXISTING delegation (Safari refuses HW-accel for linear()-eased anims, so the current
  spring-WAAPI path is a latent leak on WebKit). Born-RED witness named. Correctly J.W6 (it owns the
  linear()/Baseline re-verification). A valuable folded finding.
- **CE-2 (@property registration → composite var/calc)** — UPHOLD KILL. Platform-refuted on two
  independent sources: registered customs do NOT composite (they rasterize per frame; the compositor
  cannot do var() substitution, Chromium #1411864 unshipped). Admitting them buys ZERO offload and
  REINTRODUCES the computed-unit freeze bug. The kill upgrades the `waapi.ts:20-23` source-note into a
  fleet-verified permanent boundary. Correct.
- **CE-3 (oklab pre-interp as sRGB ramp for the compositor)** — UPHOLD KILL. Color does not composite, so
  "compositor-offloaded perceptual color" is unreachable; the ramp plays main-thread either way and is
  strictly equal-or-worse than kf's continuous-oklab rAF path. The most seductive framing in the brief,
  correctly killed. (See CC-2 above for why the NON-offload oklab-densify survives — different proposal.)

### waapi-level-2
- **WL2-A (position kf as L2 GroupEffect/SequenceEffect, docs)** — UPHOLD J-FOLD → J.W5. A positioning
  paragraph + correspondence table; the capability is shipped. A tranche for a paragraph would be bloat.
  The KILL-rider on API-mimicry is correct (the L2 spec is mid-redesign — SequenceEffect proposed for
  DELETION #9557; mirroring an unshipped changing spec is legacy-chasing, the opposite of frontier).
- **WL2-B (honor author-declared animation-composition add/accumulate)** — UPHOLD K-HEADLINE-CANDIDATE
  (M). VERIFIED: composition captured (`adapter.ts:24-29,120-126`) then DROPPED (`engine.ts fromString`
  never reads `resolved.composition` — grep-confirmed; `toWAAPIOptions` never emits `composite`). So a
  CSS-declared `animation-composition: add` runs as silent `replace` today — a correctness gap on kf's
  SIGNATURE axis (parse author CSS, animate faithfully). The substrate is already built (G.W17 fixed the
  dead-leaf bug). Extends BOTH unique axes (CSS-round-trip × weighted/add blend). Brushes no kill (it is
  per-keyframe COMPOSITE OPERATION — a distinct CSS longhand with Baseline WAAPI support — NOT per-property
  EASING). The strongest "ripe + on-brand + small" finding in the fleet. Upheld as a HEADLINE-CANDIDATE.
- **WL2-C (getAnimations() interop / adopt foreign anims)** — UPHOLD K-CANDIDATE, **but DEDUP-demote the
  adopt half (§4).** The adopt/takeover half is the SAME seam as `live-stylesheet-ingestion/K2`. WL2-C's
  surviving UNIQUE contribution is the COORDINATE-with-foreign-animations half (wait on a foreign anim's
  `finished` as a Sequence position; avoid double-driving a property). I uphold WL2-C as K-CANDIDATE but
  re-scope it: **K2 owns adopt/takeover; WL2-C owns coordinate-as-sequence-position.** Without that
  re-scope they are duplicate K waves. The lane itself flagged it leans toward BOOK-pending-demand — I
  hold it K-CANDIDATE only for the coordinate half; the adopt half re-attributes to K2.

### physics-frontier
- **PHYS-C (spring-driven blend weight)** — UPHOLD K-HEADLINE-CANDIDATE (M). The ONLY axis-3 headline in
  the fleet and the truest on-brand test pass: a physical layer crossfade is only POSSIBLE on kf's
  weighted-blend substrate, which no competitor has. VERIFIED: `weight` is a static config read at
  `group.ts:345-365`; the change is one nullish read (`layer.weightSpring?.value ?? layer.weight`) swapping
  a constant for a shipped `Tickable` stepper's value. Zero new physics, zero new hot-path alloc. Brushes
  no kill (the spring drives ONE scalar — the layer weight — not per-property curves; rAF-managed group,
  no native, no Typed-OM). KISS-compatible by construction. Could co-anchor the K tranche on the
  weighted-blend axis. Strong.
- **PHYS-B2 (`reseatToSpring` — velocity-continuous interrupt of a parsed-CSS keyframe anim)** — UPHOLD
  K-CANDIDATE (M). Only a round-trip engine that parsed your `@keyframes` AND owns a spring algebra AND a
  linear() twin could velocity-continuously interrupt a CSS keyframe animation and re-serve it as a spring.
  Extends axis-1. Brushes no kill (the spring easing is applied UNIFORMLY across the retargeting transition,
  NOT stored per-keyframe-per-property — explicitly distinguished from the per-property-easing kill; the
  velocity is a plain finite-differenced number, not Typed-OM). The finite-diff fires only at the
  interruption event, not per frame. On-brand and only-kf. Correct.
- **PHYS-E (intensity-scaled reduced motion)** — UPHOLD K-CANDIDATE (M). Net-new in the field (verified:
  Motion does NOT scale intensity, only disables/preserves; nobody does), WCAG-aligned (2.3.3 wants
  reduce-not-kill), rides the ONE-gate discipline (`withReducedMotion`), exact-and-free on the analytic
  spring (scale the amplitude before `evaluateAt`), preserves the perceptual axis (color/opacity untouched
  while transform amplitude scales). The honest caveat (the OS only exposes a binary; the SCALE must come
  from consumer policy) keeps it a MECHANISM K not a headline K — correctly calibrated. Brushes no kill (a
  parameter on an existing gate). On-brand via the single-gate discipline. Correct.
- **PHYS-D (`snapDecay`)** — UPHOLD J-FOLD, CONSUMED-BY scroll lane. A closed-form composition (`decayRest`
  + `SpringProgress.reset`, ~15 LoC); its frontier value lives in SO-2's snap. Correctly deferred, not
  duplicated. **Overlap flag honored:** the scroll lane (SO-2) is the consumer; physics owns the primitive.
- **PHYS-A (vector/N-d springs)** — UPHOLD KILL (coupled form) + J-FOLD (trivial VectorSpring sugar). The
  research is decisive: a vector spring IS N independent scalar springs (Orange Duck, Juckett, Unity
  SmoothDamp unanimous); the coupled/shared-phase form is mass-spring-network territory (the physics-sim /
  Worker neighborhood KISS + the kill list forbid). The trivial sugar is a paper-cut J-FOLD, not a wave.
  Correct.

### ecosystem-distribution
- **ED-1 (agent-consumable surface: llms.txt + proof-as-artifact)** — UPHOLD K-HEADLINE-CANDIDATE (M).
  The on-brand test passes uniquely on three counts: kf's docs are ALREADY structured for agents (the
  proof corpus — every capability backed by a citable, CI-runnable gate, which no competitor has); the
  round-trippable-CSS axis is uniquely agent-friendly (the agent's input format IS the library's source
  format); anti-bloat by construction (a curated INDEX, not a feature). The `proof:agent-surface` gate
  (the agent index can never drift from the published surface) is the gate-ORACLE precept at the agent
  boundary. Verified 2026: llms.txt is near-worthless for SEO but real for IDE agents (the B2A inversion).
  Brushes no kill. The distribution FACE of the round-trip spine. Strong.
- **ED-2 (`@mkbabb/keyframes-vue`: `<Keyframes css>` + useKfAnimation; React=BOOK)** — UPHOLD K-CANDIDATE
  (Vue) / BOOK (React). The lane did the hard honest work: the "extract the demo composables" framing is
  REJECTED as researched-false (they are coupled to the demo's ScenePlayback/sceneMachine — NOT cleanly
  extractable). The ONLY on-brand adapter is the declarative `<Keyframes :css>` component (the one a Motion
  adapter CANNOT write — no other engine parses author CSS). The dogfood-inversion justification (demo
  consumes the published adapter) is the on-brand earn. The hard caveat (a second package doubles the
  release/CI surface; must ride `proof:published-surface`) is correctly binding. Upheld with that caveat.
- **ED-3 (dogfood inversion: demo consumes the published barrel)** — UPHOLD K-CANDIDATE (rides ED-2). The
  boundary-ORACLE precept at the PACKAGE boundary ("what `npm i` installs is what the demo runs"). A real
  architectural change (every scene mounts its engine via `@src/animation/engine` deep paths today, not the
  public `loadAnimationEngine()` boundary — verified: zero `@mkbabb/keyframes` imports in demo/). Coupled to
  ED-2; correctly a K wave not a J fold. Correct.
- **ED-4 (public color-FIDELITY conformance harness)** — UPHOLD K-CANDIDATE (sliver). The ONE benchmark
  only kf could publish honestly: a CORRECTNESS harness (ΔE vs the CSS Color 4 oklab reference), not a
  throughput one — un-spinnable (measures correctness against a spec, not speed against a rival), extends
  axis-2. The lane correctly killed the throughput benchmark beside it (credibility trap: kf can't occupy
  the neutral seat). A narrow but real on-brand sliver. Correct.
- **ED-5 (remove spurious vue peerDependency)** — UPHOLD J-FOLD → J.W5. VERIFIED: `package.json:161-162`
  declares `vue: ^3.5.0` as a PEER of a Vue-free library (src only references vue in `env.d.ts`, a dev-only
  SFC shim; vue is already in devDeps at :217). A publish-boundary-lies-about-the-surface defect of exactly
  the class J.W5 owns. The `proof:published-surface` peer-dep clause (every declared peer is imported by
  `src/`) is a ~10-line gate-ORACLE. Correctly J.W5, tiny, in-scope. Correct.
- **ED-6 (JSR publish)** — UPHOLD KILL. Provenance already owned (J.W5/WZ `npm publish --provenance`);
  JSR's transpile-on-publish would LOSE the hand-tuned static/dynamic boundary (16KB light / 36KB heavy);
  dual-registry maintenance tax. Extends no axis, closes no gap npm+J.W5 don't. Researched rejection.

### engine-perf-frontier
- **EPF-1 (read/write phase separation / engine-level fastdom)** — UPHOLD BOOK. Uniquely on-brand (only kf
  resolves interp endpoints by forced-layout probe-readback, so only kf has a read worth batching) but the
  thrash is EPOCH-BOUNDARY-only, not per-frame (the computed read is already epoch-cached and rarely fires),
  and no real multi-computed workload exists (the demo animates ONE calc() ball). Correctly BOOK, re-evaluate
  as a rider when a K scroll tier pins many cq* elements. Correct.
- **EPF-2 (interpolation JIT — precompiled closures)** — UPHOLD KILL. The premise is FALSE: the dispatch is
  ALREADY monomorphic-per-iv via value.js `_lerp` installed at `compile()` (`utils.ts:339`). The residue is
  polymorphic-3 (V8's cheap band), not the megamorphic cliff the JIT story needs. A `new Function`/closure
  emitter is `eval`-class (CSP-hostile, boundary-gate-hostile, KISS-hostile) for a sub-25% predicted win. It
  also brushes the SPIRIT of the ValueUnit-monomorphization kill (chasing V8 microstructure on an already-lean
  hot loop). Two-reason kill; both hold. Excellent researched result.
- **EPF-3 (cross-element matrix batch)** — UPHOLD J-FOLD → J.W6 (the SoA core = PF-8) + BOOK (the cross-element
  increment). The increment fails on-brand (generic numeric batching any engine could add, NOT a kf-unique
  capability) AND the bottleneck test (b16: the cube's limiter is Vue reactivity, not the engine). Correctly
  routed to avoid duplicating J.W6's PF-8. Correct.
- **EPF-4 (`warmEngine()` idle-warmer)** — UPHOLD K-CANDIDATE (S). The cleanest small frontier increment:
  pre-fire `loadAnimationEngine()` in requestIdleCallback time (with setTimeout fallback, the existing
  yieldToMain progressive shape) so a light→heavy consumer doesn't pay the cold import on the interaction
  frame. Extends kf's OWN static/dynamic boundary discipline with the codebase's OWN warmup idiom
  (scenes.ts). Brushes no kill (NOT WASM — same JS parser earlier; NOT a thread hop — rIC is cooperative
  main-thread). NET-NEW public surface, so a K wave not a J fold. Small but real. Correct.
- **EPF-5 (LoAF adaptive quality)** — UPHOLD KILL (general) + BOOK (narrow adaptive-readout). Shedding blend
  layers / coarsening sampling degrades AUTHOR-DECLARED intent silently — and the weighted-blend axis IS the
  product, so shedding it sheds the feature. Me-too game-engine buzzword chasing against KISS. kf already has
  the CORRECT pressure response (YIELD_BATCH sheds LATENCY not WORK). The narrow survivor (defer the
  already-epoch-cached computed READOUT under measured pressure — a layout-derived input, not an authored
  value) is correctly BOOK (no born-RED LoAF scene exists to justify the machinery). Correct.

### text-ranges-stagger
- **K-T1 (kf-owned splitText/SplitText)** — UPHOLD KILL. Off all three axes (splitting a string into spans
  touches neither round-trip, oklab, nor weighted blend), DOM-mutation kf does not own (every kf engine
  animates targets the CONSUMER supplies — a splitter inverts that contract; the per-target ResizeObserver
  was itself a recorded BOOK for the lesser version of this breach), and ships a 2026-MEASURED a11y hazard
  (Roselli Feb-2026: the generic role prohibits aria-label; broken across 4/5 SR-browser pairs) the proof
  culture cannot honestly gate. If it belongs anywhere it is glass-ui's (inv-16). A four-reason kill; all
  hold. Exactly the me-too "GSAP has it" bloat the charter disallows.
- **K-T2 (`staggerCSS()` → sibling-index() emitter)** — UPHOLD K-CANDIDATE (M), **as the canonical owner of
  the stagger-compile seam (§4).** Extends axis-1 from a single animation to a COLLECTION's orchestration
  offset — the seam where kf's serialization is currently LOSSY (stagger vanishes on serialization today;
  born-RED probe: serialize a staggered group, grep for animation-delay → absent). Brushes no kill (a string
  emitter; the JS stagger path survives for eased/unsupported cases). **Dedup with `css-compiler/CC-S`:** these
  are ONE emitter with two emit-modes (K-T2's `sibling-index()` for the linear/symmetric origins behind
  `@supports`; CC-S's materialized `:nth-child` literals as the universal-Baseline default AND the eased-curve
  case `sibling-index()` cannot express). Canonical owner: **`staggerCSS()`, default literal-delay, optional
  sibling-index() variant.** Upheld as the owner; CC-S folds INTO it as the literal-delay mode.
- **K-T3 (Custom-Highlight-API range animation)** — UPHOLD KILL. A four-property PAINT MASK (color/
  background-color/text-decoration/text-shadow), not a motion substrate — no box, no transform, no geometry
  for kf's interpolation to bite; the which-glyphs dimension is a discrete Range set, not interpolatable. The
  one nice effect (highlight sweep) is a pure-CSS `background-size` trick needing no kf. Off all axes. Correct.
- **K-T4 ("structural stagger, the CSS way" docs recipe)** — UPHOLD J-FOLD → J.W5. Teaches axis-1 (via K-T2)
  + axis-2 (oklab free) over the shipped stagger primitive, with the honest a11y framing as its distinguishing
  content. Zero new code. Correctly J.W5 (it owns README §Beyond-CSS / teaching the untaught primitives).

---

## §4 Overlap dedup — canonical owners (the gestalt enforcement)

The fleet's biggest risk is shipping the SAME idea twice under two lanes. Four overlaps resolved:

| Overlapping proposals | The shared seam | CANONICAL OWNER | The folded instance |
|---|---|---|---|
| `live-stylesheet/K2` ↔ `waapi-level-2/WL2-C` (adopt half) | adopt/takeover a running foreign CSS animation via `getAnimations()` | **K2** (`adopt()`) — it owns the CSSOM-reconstruction-preserves-the-axes discipline | WL2-C's adopt half folds into K2; WL2-C keeps ONLY the coordinate-as-sequence-position half |
| `css-compiler/CC-S` ↔ `text-ranges-stagger/K-T2` | compile a kf stagger distribution to author CSS | **K-T2** (`staggerCSS()`) — one emitter, two modes | CC-S = the literal-`:nth-child`-delay MODE of `staggerCSS()` (universal/Baseline default + the eased case); NOT a separate emitter |
| `physics-frontier/PHYS-D` ↔ `scroll-orchestration/SO-2` | momentum-snap (decay-to-snap-point) | **SO-2** owns the orchestration; **PHYS-D** owns the `snapDecay` primitive it consumes | already correctly partitioned by both lanes — no action, recorded |
| `view-transitions/VT-C` ↔ `physics-frontier` / `compositor-eligibility` (spring linear() emitter) | the `springTimingFunction().css` emitter | **the shipped `springLinearStops`/`springTimingFunction`** — ONE emitter | VT-C / PHYS-B2 / PHYS-C / CE-1 are all COMPLEMENTARY CONSUMERS of one emitter; no duplication |

The round-trip-CSS HEADLINES (K1 forward, CC-1 backward, SO-1 scroll-grammar, K-T2 stagger, ED-1 agent)
are NOT duplicates — they are facets of one axis pointed at different surfaces (live page / zero-runtime
artifact / scroll binding / orchestration offset / agent index). They COMPOSE; they do not collide. That
composition is the K-tranche thesis, not a redundancy.

---

## §5 Synthesis — the K tranche the fleet earned

The fleet returned a disciplined frontier: **8 KILLs** (VT-A, VT-B, SO-4, CC-7, CE-2, CE-3, ED-6, EPF-2,
EPF-5-general, PHYS-A-coupled, K-T1, K-T3 — twelve counting the dual-verdict ones), **5 BOOKs**, and a
coherent K body. The KILLs are the most valuable judge-confirmed result: every "unique axis!" seduction
(VT parse-round-trip, compositor-offloaded oklab, L2 spec-mimicry, the splitText port, the interp-JIT) is
correctly dead, each with a reason that stops a future tranche from re-litigating it. I upheld all twelve.

I issued ZERO overrides-to-KILL and ZERO overrides-to-demote on the merits — the lanes were ruthlessly
self-skeptical and the verdicts hold. My substantive contribution is FOUR dedup re-attributions (§4) that
prevent the fleet's convergence from becoming duplication, and one re-scope (WL2-C → coordinate-only, adopt
to K2). Every K verdict is upheld AS the lane assigned it.

The five K-HEADLINE-CANDIDATEs (K1, CC-1, SO-1, WL2-B, PHYS-C, ED-1 — six) cannot all headline one tranche.
The judge's priority read, for the K-tranche planner (NOT a per-proposal override):
1. **The round-trip CSS compiler/ingester pair (CC-1 backward + K1 forward)** is the structural moat —
   the truest "only a CSS-source-of-truth engine could do this." This is the headline.
2. **WL2-B (honor animation-composition)** is the ripest, smallest, highest-correctness-value engine wave —
   it should land FIRST (the substrate exists; it fixes a live correctness gap on the signature axis).
3. **PHYS-C (spring-driven blend weight)** is the on-brand body's strongest novel capability — the only
   axis-3 headline, only-kf-substratable.
4. **ED-1 (agent surface)** is the distribution face — it makes the whole tranche externally legible.
5. **SO-1 (scroll-grammar)** is the largest NET-NEW capability at the #1 named gap, gated on a value.js HANDOFF.

The body waves: K2 (adopt), CC-2/CC-3/CC-4 (compiler legs), K-T2 (stagger emit), CE-1 (per-property split),
PHYS-B2/PHYS-E (physics legs), ED-2/ED-3/ED-4 (ecosystem), VT-C, EPF-4 (warmEngine), K3 (diagnostics).
The J-FOLDs (CE-1.0, ED-5, WL2-A, K-T4, K3-two-rows, SO-5, PHYS-D, EPF-3) return to their J waves now.

**The one-line reading:** the fleet found that kf's frontier is NOT more features — it is the CSS round-trip
axis expanded in every direction (forward to the live page, backward to zero-runtime CSS, outward to agents
and frameworks), the weighted-blend axis given physics, and the author's declared composite operator finally
honored — with every me-too port, every compositor-impossible offload, and every V8-microstructure chase
killed on contact. That is the gestalt the user rewards.
