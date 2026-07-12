// S.B1 — the constants seam, structural (SPEC-v3 §3 S.B1; fold row 34).
//
// This is the LIGHT-PURE half of the former monolithic `constants.ts`: TYPES
// ONLY, and — the binding invariant — every module edge below is `import type`
// (or `export type`), so a LIGHT importer that targets `constants/types` never
// drags `@mkbabb/value.js` into its graph. The runtime values (the two
// value.js-bearing consts + the value.js-free arrays/defaults) live in the
// sibling `constants/defaults.ts`; the back-compat barrel (`constants/index.ts`)
// re-exports both. The `keyof typeof timingFunctions` query survives on a
// type-only binding of value.js's `timingFunctions`; `(typeof DIRECTIONS)[…]`
// and `(typeof FILL_MODES)[…]` survive on a type-only binding of the sibling
// `defaults` arrays (a type-only cycle — erased at build, no runtime edge).
//
// The FILE-level purity is gated by `proof:boundary`'s S.B1 clause: any
// non-`import type` module edge in THIS file reddens the gate (strictly stronger
// than the whole-surface boundary scan).
import type {
    ColorSpace,
    HueInterpolationMethod,
    InterpolatedVar,
    ValueUnit,
    timingFunctions,
} from "@mkbabb/value.js";
import type { DIRECTIONS, FILL_MODES } from "./defaults";
// T.A6 — the PLAIN authored-shape projection type (type-only edge; erased under
// verbatimModuleSyntax, so `constants/types` stays LIGHT-PURE per proof:boundary).
import type { PlainProjection } from "../compile/plain-vars";

export type {
    ColorSpace,
    HueInterpolationMethod,
    InterpolatedVar,
} from "@mkbabb/value.js";

export type TimingFunctionNames = keyof typeof timingFunctions;

export type Vars<T = any> = {
    [arg: string]: number | string | T;
};

export type TransformFunction<V extends Vars> = (v: V, t: number) => void;

export type TimingFunction = (t: number) => number;

/**
 * The typed easing value — a callable curve plus, when one exists, the CSS
 * easing string that reproduces it (e.g. a spring's `linear()` stops).
 *
 * Replaces the former Symbol-on-a-closure side channel: the "this closure
 * has a CSS twin" fact now flows through the type system, so wrapping or
 * binding the callable can no longer silently drop it. `waapi.ts` reads
 * `.css` to run the true curve on the compositor; everything else reads
 * `.fn`.
 */
export interface Easing {
    /** The callable curve — the hot-path interpolation function. */
    fn: TimingFunction;
    /** CSS easing string that faithfully reproduces `fn`, when one exists. */
    css?: string;
}

export interface TemplateAnimationFrame<V extends Vars> {
    id: number;
    start: ValueUnit;
    vars: V;

    transform?: TransformFunction<V>;
    timingFunction?: Easing;

    /**
     * The author-declared `animation-composition` operator for this stop
     * (`replace` | `add` | `accumulate`), captured by the adapter and threaded
     * here so the engine HONORS it (K.W7 — the fidelity floor). Genuine
     * omission means `replace` (the default composite). value.js lifts it onto
     * `rule.composition`; `resolveKeyframes` captures it on
     * `ResolvedKeyframes.composition`; `fromString` reads that Map into this
     * field. The compiled {@link AnimationFrame.composition} inherits it.
     */
    composition?: CompositeOperator;
}

/**
 * Q.WB3 S2 — the precomputed SoA fold layout for ONE compiled frame's NUMERIC
 * interp subset (the single-animation `processFrame` analog of the compositor's
 * `SoALayerPlan`). Built ONCE at `parse` over the STABLE iv set (the F.W4
 * zero-alloc discipline — NO per-frame allocation):
 *   - `numeric` — the numeric ivs (numeric start+stop, NOT computed, NOT color),
 *     in slot order. Each iv's interp-carrier `value` is the `ValueUnit` slot the
 *     strided write-back fills (the SAME slot `lerpValue` writes today).
 *   - `from` / `to` — the packed endpoint `Float64Array`s (`start.value` /
 *     `stop.value`), one slot per `numeric[s]`.
 *   - `out` — the per-frame scratch the `lerpArray` fold writes into (reused
 *     across every frame — zero per-frame alloc).
 *   - `boxed` — the residual ivs (color / computed / mixed) the fold CANNOT cover
 *     — walked by the existing per-element `lerpValue`, UNCHANGED.
 * The boxed-color tail is the GATED `ColorChannelPlan` consume's frontier (S4,
 * value.js 1.2.0) — NOT this NOW numeric arm.
 */
export interface NumericFoldPlan<V extends Vars> {
    numeric: Array<InterpolatedVar<V>>;
    from: Float64Array;
    to: Float64Array;
    out: Float64Array;
    boxed: Array<InterpolatedVar<V>>;
}

export interface AnimationFrame<V extends Vars> {
    id: number;

    start: ValueUnit;

    ixs: {
        start: number;
        stop: number;
    };

    time: {
        start: number;
        stop: number;
    };

    flatVars: V;
    vars: V;

    interpVars: {
        [arg: string]: Array<InterpolatedVar<V>>;
    };

    /**
     * Pre-flattened array of all interpolation variables across all properties.
     * Built once during parse() to avoid Object.values().flat() allocation
     * on every interpFrames() call in the hot path.
     */
    allInterpVars: Array<InterpolatedVar<V>>;

    /**
     * Q.WB3 S2 — the precomputed numeric SoA fold layout (built ONCE at `parse`
     * over the stable `allInterpVars` set). `processFrame` folds the numeric subset
     * through ONE `lerpArray` over the packed `Float64Array` buffers and strides
     * the result back into the numeric leaves' `.value` slots; the boxed residual
     * (color/computed/mixed) keeps the per-element `lerpValue`. Absent (undefined)
     * for a frame with no numeric ivs, or before `parse` runs — `processFrame`
     * falls back to the all-boxed walk. Bit-identical to the boxed path.
     */
    _numericPlan?: NumericFoldPlan<V>;

    /**
     * T.A6 — the nested PLAIN authored-shape projection a custom `transform`
     * consumes (numbers where the author wrote numbers, strings where a unit or
     * color demands one). Built lazily on the first apply — `undefined` for a
     * DOM-style default-renderer frame (which consumes `flatVars` directly) and
     * before the first `interpFrames(..., true)`. Invalidated at
     * `finalizeFrameVars` so a color-space renormalize rebuilds it against the
     * fresh interp carriers.
     */
    plainVars?: V;

    /** T.A6 — the per-leaf refresh-writer plan backing {@link plainVars}. */
    _plainProj?: PlainProjection | undefined;

    transform: TransformFunction<V>;

    timingFunction: Easing;

    /**
     * The compiled per-segment `animation-composition` operator (K.W7). A
     * segment runs from a START stop to a STOP stop; the operator is the STOP
     * stop's declared composition (CSS attaches `animation-composition` to the
     * keyframe being composited TOWARD). `replace` (or omission) is the legacy
     * behaviour — the apply writes the lerped value verbatim. `add` accumulates
     * the lerped numeric leaf onto the captured underlying base (un-clamped,
     * element-wise — the same leaf `group.ts`'s `add` layer runs); `accumulate`
     * is repeat-aware (iteration N stacks onto N−1's end). A non-numeric leaf
     * (color, `<custom-ident>`) `replace`-falls-back AND emits a
     * `COMPOSITION_FALLBACK` diagnostic — never a silent wrong pixel.
     */
    composition?: CompositeOperator;
}

/**
 * The CSS `animation-composition` operator (K.W7). Distinct from
 * {@link BlendMode} (the GROUP's per-LAYER blend tier — `replace`/`add`/
 * `weighted`): this is the per-KEYFRAME composite operator the author declares
 * on a single animation, matching the CSS grammar exactly (`weighted` is not a
 * CSS composite; `accumulate` is the repeat-aware one CSS adds). The engine
 * routes `add`/`accumulate` onto the SAME un-clamped numeric leaf the group's
 * `add` layer runs (`group.ts`), so the two tiers share one accumulation
 * semantic without sharing a type.
 */
export type CompositeOperator = "replace" | "add" | "accumulate";

export type AnimationOptions = {
    duration: number;

    delay: number;

    iterationCount: number;

    direction: (typeof DIRECTIONS)[number];

    fillMode: (typeof FILL_MODES)[number];

    timingFunction: Easing;

    useWAAPI: boolean;

    /**
     * When true, honor `prefers-reduced-motion: reduce` by snapping the
     * `Animation`/`AnimationGroup` `play()` path to the final frame in a
     * single paint instead of running the rAF/WAAPI loop. SSR-safe no-op
     * off-DOM. Default false (consumers opt in).
     */
    respectReducedMotion: boolean;

    colorSpace: ColorSpace;

    hueMethod?: HueInterpolationMethod;

    /**
     * The LAYER-level `animation-composition` operator (L.W1 S5, Band A) — the
     * round-trip field for an authored `animation-composition: add` that arrived
     * through a sibling `.class { animation: … }` shorthand/longhand ingest.
     * Distinct from the per-KEYFRAME {@link TemplateAnimationFrame.composition}
     * (the per-stop operator); this is the whole-animation composite the engine
     * carries off `extractAnimationOptions`'s `composition` field. Omission means
     * `replace` (the CSS default — the serializer omits it). value.js 0.13.0's
     * `CSSAnimationOptions.composition` surfaces it; `fromString` reads it here.
     */
    composite?: CompositeOperator;

    /**
     * `animation-iteration-composite` (CSS Animations L2). BOOKED, not
     * implemented: the L2 draft marks this property experimental — there is no
     * stable value.js parse for it and no honoring path in the engine. The field
     * is a typed `never` placeholder (a named tripwire): a future
     * silently-WRONG implementation that tries to assign anything to it reddens
     * the type check, forcing the implementation to land alongside a real
     * `proof:iteration-composite-baseline` gate rather than sliding in unproven.
     */
    iterationComposite?: never;
};

export type InputAnimationOptions = Partial<{
    duration: number | string;
    delay: number | string;

    iterationCount: number | string | "infinite" | undefined;

    direction: (typeof DIRECTIONS)[number];
    fillMode: (typeof FILL_MODES)[number];

    timingFunction:
        | TimingFunction
        | Easing
        | TimingFunctionNames
        | string
        | undefined;

    /** When true (default), eligible animations may use the Web Animations API for compositor-thread execution. Set to false to force rAF. */
    useWAAPI: boolean;

    /** When true, snap `play()` to the final frame under `prefers-reduced-motion: reduce`. Default false. */
    respectReducedMotion: boolean;

    colorSpace?: ColorSpace;

    hueMethod?: HueInterpolationMethod;

    /** The LAYER-level `animation-composition` operator (L.W1 S5). Omission ⇒ `replace`. */
    composite?: CompositeOperator;
}>;

/**
 * Public layer vocabulary. `weighted` is retained as a compatibility alias;
 * the canonical operation axis is {@link CompositeOperator}. `accumulate` is
 * additive and maps to the same un-clamped fold as `add` at group scope.
 */
export type BlendMode = CompositeOperator | "weighted";

/**
 * The minimal stepper surface a spring-driven blend weight reads (K.W11
 * PHYS-C). A `SpringProgress` satisfies it structurally (`value` getter +
 * `tickDt` + `settled`); typing it as this narrow shape — NOT importing
 * `SpringProgress` — keeps `constants.ts` from gaining a class edge and lets
 * a consumer drive a layer's weight with ANY analytic stepper (a decay glide,
 * a custom `Tickable`). The read is one nullish access in the `weighted` blend
 * leaf; the group's managed loop advances it per frame via `tickDt`.
 */
export interface WeightStepper {
    /** The stepper's current scalar — read in place of the constant `weight`. */
    readonly value: number;
    /** Advance the stepper by `dt` milliseconds (the group's managed tick). */
    tickDt(dt: number): number;
    /** True once the stepper has converged — the group clears it then. */
    readonly settled: boolean;
}

export interface AnimationLayerConfig {
    /** Higher wins. Default: 0 */
    zIndex: number;
    /** 0–1 for 'weighted' blend mode. Default: 1 */
    weight: number;
    /**
     * Optional spring (or any {@link WeightStepper}) DRIVING this layer's
     * blend `weight` (K.W11 PHYS-C — the spring-driven crossfade). When
     * present the `weighted` blend leaf reads `weightSpring.value` in place of
     * the constant `weight` (one nullish read; the per-frame lerp untouched),
     * so a layer transition follows a PHYSICAL trajectory that can overshoot
     * and settle — the flagship demo moment only kf's weighted-blend substrate
     * can hold. Constructed + advanced by `AnimationGroup.transitionLayer` /
     * `crossfade`; cleared on settle, when the read falls back to the
     * now-updated constant `weight`. Absent on a static-weight layer (the
     * read is `?? layer.weight`), so the constant path is byte-unchanged.
     */
    weightSpring?: WeightStepper;
    /**
     * Default: 'replace'. Defaulting on a genuinely-omitted blend mode is
     * the sanctioned contract (the fail-explicit seam throws only on
     * malformed PRESENT input, never on omission) — an unspecified layer
     * blends by replacement, the least-surprising composite.
     */
    blendMode: BlendMode;
    /** Canonical composition operation. Omission preserves `blendMode` callers. */
    op?: CompositeOperator;
    /** Layer toggle. Default: true */
    enabled: boolean;
    /** Optional property whitelist — only these properties will be output from this layer */
    properties?: Set<string>;
}
