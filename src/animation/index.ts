/**
 * keyframes.js package barrel — the value.js static/dynamic boundary.
 *
 * Two surfaces meet here:
 *
 *   LIGHT (static)  — the physics/interpolation engines. `SpringProgress`,
 *     `SmoothProgress`, `NumericAnimation`, `ElementMorph`, the `Timeline`
 *     family, and the spring-stop helpers. None of them carries a static
 *     import edge to `@mkbabb/value.js`: they read their handful of leaf
 *     helpers (rAF + clamp/lerp/scale) from `./internal/leaves`, and accept
 *     easing as a callable `TimingFunction` rather than resolving string
 *     names through value.js's registry. A consumer that imports only these
 *     never pulls value.js into its graph.
 *
 *   HEAVY (dynamic) — the CSS-keyframe parsing engine. `Animation`,
 *     `CSSKeyframesAnimation`, `AnimationGroup`, `getTimingFunction`,
 *     `resolveKeyframes`, and the animation-options constants. These
 *     genuinely need value.js (`ValueUnit`/`Color`/the CSS parser/the
 *     easing registry) and live in `./engine`, reached ONLY through
 *     `loadAnimationEngine()` — an `await import("./engine")`. The barrel
 *     holds no static edge to that module, so the heavy graph (and value.js)
 *     stays out of a light-only consumer's static import graph.
 *
 * The TYPE surface stays whole on the static barrel: `import type` is erased
 * under `verbatimModuleSyntax`, so re-exporting heavy-side types here costs
 * no runtime edge. Only runtime *values* are gated behind the dynamic accessor.
 */

// ── LIGHT engines (value.js-free, static) ────────────────────────────────
export { NumericAnimation } from "./physics/numeric";
export type {
    NumericAnimationOptions,
    NumericFrameCallback,
} from "./physics/numeric";
export { SmoothProgress } from "./physics/smooth";
export type { SmoothProgressOptions } from "./physics/smooth";
export {
    SpringProgress,
    reseatToSpring,
    probeVelocity,
} from "./physics/spring";
export type {
    SpringProgressOptions,
    SpringSubscriber,
    SpringFrameCallback,
    VelocityProbe,
} from "./physics/spring";
// K.W11 PHYS-E — the intensity-scaled reduced-motion mechanism (value.js-free
// light leaf): the ONE gate's policy type + the amplitude-scale resolver a
// consumer can read to scale its own non-spring motion under reduced motion.
export { reducedMotionScale } from "./internal/reduced-motion";
export type { ReducedMotionPolicy } from "./internal/reduced-motion";
export { springLinearStops } from "./physics/spring";
export type { SpringLinearStopsOptions } from "./physics/spring";
export { springTimingFunction } from "./physics/spring";
export type { SpringTimingFunctionOptions } from "./physics/spring";
// SpringDurationOptions — the spring-from-duration option surface (R.W1: the
// barrel gap fill, lib-spring §10).
export type { SpringDurationOptions } from "./physics/spring";
export { ElementMorph } from "./physics/morph";
export type { MorphRect, ElementMorphOptions } from "./physics/morph";
// The legacy `ScrollTimeline`/`ScrollTimelineOptions` @deprecated PKG-3 aliases
// of `KeyframesScrollTimeline`/`KeyframesScrollTimelineOptions` (L.W8 §S4 —
// renamed to clear the `globalThis.ScrollTimeline` d.ts collision) were DROPPED
// in 5.0.0 (Q.WE1 — NO-LEGACY). See docs/MIGRATION-5.0.0.md.
export {
    Timeline,
    KeyframesScrollTimeline,
    ManualTimeline,
    createNativeTimeline,
} from "./orchestration/timeline";
export type {
    TimelineOptions,
    KeyframesScrollTimelineOptions,
    NativeTimelineSpec,
} from "./orchestration/timeline";
export { RAFPlayback } from "./physics/playback";
export type { RAFPlaybackOptions, Tickable } from "./physics/playback";
// L.W9 S5 KF-OSCILLATOR (W128) — the LIGHT periodic phase clock (value.js-free:
// a frequency-driven phase ramp + a pure waveform shaper, NO CSS parsing). The
// caller drives the loop (mirrors SmoothProgress/SpringProgress — no rAF
// ownership); glass-ui BB's W-EASING-PRIMITIVE wave + the demo KF-OSCILLATOR
// scene consume the phase. proof:boundary enumerates it as a value.js-free entry.
export { Oscillator, waveformValue } from "./physics/oscillator";
export type {
    OscillatorConfig,
    OscillatorWaveform,
} from "./physics/oscillator";

// ── Orchestration tier (E.W10 — value.js-free light helpers over the engines) ─
// stagger/flip/drag/decay/Sequence carry zero static value.js edge: stagger is
// a pure delay generator, flip composes ElementMorph, drag/decay ride
// SpringProgress, Sequence drives Animation.advanceTo over a master clock (the
// Animation runtime is the consumer's; Sequence holds only its type).
export { stagger } from "./orchestration/stagger";
export type {
    StaggerOrigin,
    StaggerOptions,
    StaggerFn,
} from "./orchestration/stagger";
export { flip, flipShared } from "./orchestration/flip";
export type { FlipOptions } from "./orchestration/flip";
// S.F2 SplitText — a11y-first text-splitter (LIGHT: composes `stagger` + the
// platform Intl.Segmenter; zero static value.js edge — proof:boundary enrolls it
// off this barrel). Returns a fragment cohort + a ready stagger; the container
// keeps the whole pre-split string as its accessible name (aria-label + aria-
// hidden fragments). `by:"line"` is measure-or-refuse (SplitTextRefusalError).
export { splitText, SplitTextRefusalError } from "./orchestration/split-text";
export type {
    SplitBy,
    SplitTextOptions,
    SplitTextResult,
    SplitTextRefusalReason,
    TextSegment,
} from "./orchestration/split-text";
// S.F1 View Transitions — the LIGHT dispatch (VT-a; p09). `viewTransition(mutate,
// opts)` mutates the DOM behind a native View Transition where the platform ships
// one, falling back to a `flipShared` shared-element morph (or a bare immediate
// mutation) everywhere else — behind ONE normalized `ViewTransitionHandle` whose
// `backend` is queryable. LIGHT (composes `flipShared` + the ONE `withReducedMotion`
// gate; feature-detects `startViewTransition`; zero static value.js edge —
// `proof:boundary` enrolls it off this barrel). The HEAVY companion
// `compileToViewTransition` (the zero-runtime CSS emitter) rides loadAnimationEngine.
export { viewTransition } from "./orchestration/view-transition";
export type {
    ViewTransitionOptions,
    ViewTransitionHandle,
    ViewTransitionMutate,
} from "./orchestration/view-transition";
export { drag, Draggable, drag2D } from "./orchestration/drag";
export type {
    DragOptions,
    DragAxis,
    DragSubscriber,
    Drag2DHandle,
} from "./orchestration/drag";
export { decay, decayRest } from "./physics/decay";
export type { DecayOptions, DecaySample } from "./physics/decay";
export { Sequence } from "./orchestration/sequence";
export type {
    SequencePosition,
    SequenceEntry,
    SequenceOptions,
    SequenceEvent,
    SequenceSegmentSubscriber,
    SequenceLabelSubscriber,
    SequenceSubscriber,
} from "./orchestration/sequence";
// Easing construction at the boundary: `toEasing` normalizes a callable /
// typed Easing synchronously (value.js-free); `resolveEasing` resolves a
// string name through the dynamic engine boundary, fail-explicit.
export { resolveEasing, toEasing } from "./easing";
export { AnimationOptionError, UnknownEasingError } from "./internal/errors";

// ── TYPE surface (erased; no runtime edge) ───────────────────────────────
// The animation-domain types consumers should prefer over redefining their
// own. These re-export from value.js-bearing modules, but `import type` is
// stripped at build so the static barrel stays value.js-free.
export type {
    TimingFunction,
    TimingFunctionNames,
    TransformFunction,
    Easing,
    AnimationOptions,
    InputAnimationOptions,
    TemplateAnimationFrame,
    AnimationFrame,
    BlendMode,
    AnimationLayerConfig,
    WeightStepper,
    Vars,
    InterpolatedVar,
} from "./constants/types";
export type { ResolvedKeyframes } from "./engine";
// R.W2c — `AnimationGroupEntry` is sourced from its own `group/` zone (no longer
// re-exported through the engine barrel, which broke the engine↔group ring). The
// type re-export is erased, so the LIGHT package barrel stays value.js-free.
export type { AnimationGroupEntry } from "./group";
// CSS-native MotionPath (F.W12) — HEAVY (composes the engine); the runtime rides
// loadAnimationEngine below. Its option/path types are erased here.
export type { MotionPathOptions, OffsetPath } from "./svg/motion-path";
// CSS-native DrawSVG (G.W13) — HEAVY (composes the engine); the runtime rides
// loadAnimationEngine below. Its option/target types are erased here.
export type { DrawSVGOptions, SVGDrawTarget } from "./svg/draw-svg";
// MorphSVG (O.W6, the DM-3 7-tranche chronic terminal) — HEAVY (composes the
// engine + value.js's PathGeometry, the ONE geometry edge it needs); the runtime
// `fromMorphSVG`/`MorphSVG` ride loadAnimationEngine below. ONLY its option/point
// TYPES are re-exported here (erased — no static value.js edge on the LIGHT
// barrel; proof:boundary stays green). The barrel NEVER static-value-exports
// fromMorphSVG/MorphSVG — that would pull PathGeometry (value.js) onto the light
// path.
export type { MorphSVGOptions, MorphPoint } from "./svg/morph-svg";
// K.W8 INGEST (FLAGGED ADDITIVE EDIT) — the round-trip pointed FORWARD at the
// live web. `fromStyleSheets`/`fromLiveAnimations`/`resolveLiveKeyframes`/
// `adoptRunning` walk the CSSOM + take over a running CSS animation; ingest.ts
// statically imports the engine + adapter (value.js-bearing), so the RUNTIME
// rides loadAnimationEngine below. ONLY its option/result TYPES are re-exported
// here (erased — no static value.js edge on the LIGHT barrel; proof:boundary
// stays green).
export type {
    IngestOptions,
    IngestResult,
    IngestedAnimation,
    AdoptRunningOptions,
    AdoptResult,
} from "./ingest";
// K.W9 SCROLL-AS-CSS (FLAGGED ADDITIVE EDIT) — HEAVY (scroll-scene.ts carries a
// static `@mkbabb/value.js` edge: it consumes the 0.13.0 scroll-grammar typed
// extractor/serializer). The runtime (`ScrollScene`, `parseScrollCSS`,
// `dispatchScrollBackend`, `pinCSS`, …) rides loadAnimationEngine below; ONLY
// its types are re-exported here (erased — no static value.js edge on the LIGHT
// barrel; proof:boundary stays green). The kf `ScrollScene` driver owns TIME;
// value.js owns the scroll VALUES.
export type {
    ScrollSceneOptions,
    ScrollDriveOptions,
    ScrollDriveTarget,
    ScrollCSSDrive,
    ScrollDispatchRequest,
    ScrollDispatch,
    ScrollBackend,
    ScrollSceneEvent,
    ScrollSceneSubscriber,
    ResolvedRange,
    SnapPoints,
    AnimationTimelineValue,
    AnimationRangeValue,
    CSSTimelineOptions,
    RangeBoundary,
    RangePhase,
} from "./scroll";
export type { ScrollScene } from "./scroll";
// K.W10 COMPILE (FLAGGED ADDITIVE EDIT) — the round-trip's BACKWARD half: compile
// an orchestration graph (AnimationGroup / Sequence / child list) → zero-runtime
// CSS. HEAVY (compile.ts statically imports value.js's reverseAnimationShorthand
// /sampleColorRamp + the engine), so the runtime `compileToCSS` rides
// loadAnimationEngine below; ONLY its option/result TYPES are re-exported here
// (erased — no static value.js edge on the LIGHT barrel; proof:boundary stays
// green). The compiler is the parser run BACKWARD over the SAME data model.
export type {
    CompileInput,
    CompileOptions,
    CompiledCSS,
    CompileRefusal,
    CompileRefusalReason,
} from "./compile";
// S.F1 VT-c (FLAGGED ADDITIVE EDIT) — the View-Transitions emitter's TYPE surface.
// HEAVY (view-transition.ts statically imports value.js + the backward substrate),
// so the runtime `compileToViewTransition` rides loadAnimationEngine below; ONLY
// its role-spec / option / refusal / result TYPES are re-exported here (erased —
// no static value.js edge on the LIGHT barrel; proof:boundary stays green).
export type {
    VTRoleSpec,
    ViewTransitionCompileOptions,
    VTCompileRefusalReason,
    VTCompileRefusal,
    CompiledViewTransitionCSS,
} from "./compile/emit/view-transition";
// S.F3 EN-c (FLAGGED ADDITIVE EDIT) — the entry/exit emitter's TYPE surface.
// HEAVY (entry.ts statically imports value.js + the backward substrate), so the
// runtime `compileToEntry` rides loadAnimationEngine below; ONLY its spec /
// option / refusal / result TYPES are re-exported here (erased — no static
// value.js edge on the LIGHT barrel; proof:boundary stays green).
export type {
    EntryRoleSpec,
    EntryCompileOptions,
    EntryRefusalReason,
    EntryRefusal,
    CompiledEntryCSS,
} from "./compile/emit/entry";
// L.W6 AGENT-AUTHORING VERB (FLAGGED ADDITIVE EDIT) — the round-trip's FORWARD
// half: the VALIDATION layer over the compile surface. `validate`/`explain` are
// a READ-ONLY projection over three already-typed channels (the adapter
// diagnostics / compile refusals / WAAPI eligibility) onto ONE agent-shaped
// envelope. HEAVY (validate.ts statically imports the engine/compile/waapi, all
// value.js-bearing), so the runtime rides loadAnimationEngine below; ONLY its
// option/result TYPES are re-exported here (erased — no static value.js edge on
// the LIGHT barrel; proof:boundary stays green).
export type { ValidateOptions, ValidateResult } from "./validate";
// Heavy-class TYPES stay on the static barrel (erased) so consumers keep
// `import type { KeyframesAnimation } from "@mkbabb/keyframes.js"` for
// annotations. The runtime constructors are reached only via
// `loadAnimationEngine()`. The legacy `Animation` @deprecated PKG-3 alias of
// `KeyframesAnimation` (L.W8 §S4) was DROPPED in 5.0.0 (Q.WE1 — NO-LEGACY).
// See docs/MIGRATION-5.0.0.md.
export type { KeyframesAnimation, CSSKeyframesAnimation } from "./engine";
// R.W2c — `AnimationGroup`'s TYPE is sourced from its own `group/` zone (the
// engine barrel no longer re-exports it; that cross-zone re-export closed the
// engine↔group ring). Erased — no static value.js edge on the LIGHT barrel.
export type { AnimationGroup } from "./group";

// The heavy type roster is derived from the composition barrel.  `export type`
// is erased from the light build, while keeping the static and dynamic entries
// on one source of truth.
export type * from "./public";

// ── HEAVY engine (value.js-bearing, dynamic) ─────────────────────────────
// The engine-loading machinery — the memoized dynamic-import accessors + their
// narrowed surface interface types — lives in `./load-engine`. That module owns
// the `await import("./engine")` (and the per-front-door chunk imports) DYNAMIC
// edges; it names NO static `@mkbabb/value.js` specifier (every value.js-bearing
// import there is an erased `import type`). Re-exporting the accessors + the
// surface TYPES THROUGH the barrel keeps the LIGHT barrel value.js-free AND the
// PUBLIC surface UNCHANGED: `loadAnimationEngine()` (the full heavy surface), the
// granular `loadEngine`/`loadCompiler`/`loadIngest` (L.W7 S3), and the
// fire-and-forget `warmEngine()` (L.W7 S1) all reach the consumer exactly as
// before. `proof:boundary` bundles each accessor by name off the barrel and
// proves (a) no static engine/value.js edge on the accessor entry and (b) the
// heavy engine emits as a NON-ENTRY dynamic chunk — both hold through the
// re-export, since the `import("./engine")` stays a runtime edge in `./load-engine`.
export { loadAnimationEngine, warmEngine } from "./load-engine";
// The narrowed engine-surface interface TYPE (erased; no runtime edge). The
// hand-maintained `AnimationEngine` interface is the published HEAVY surface
// (`proof:published-surface` clause (d) diffs it against the runtime
// `Object.keys(engine)`). The granular `loadEngine`/`loadCompiler`/`loadIngest`
// accessors + their `EngineCore`/`CompilerSurface`/`IngestSurface` surface types
// were EXCISED in R.W1 (§2f — zero real call sites).
export type { AnimationEngine } from "./load-engine";
