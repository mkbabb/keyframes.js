import { COMPUTED_UNITS, unflattenObjectToString } from "@mkbabb/value.js";
import { clamp } from "./internal/leaves";
import { createNativeTimeline } from "./timeline";
import type { NativeTimelineSpec } from "./timeline";
import type { KeyframesAnimation } from "./engine";
import type { Vars } from "./constants";

/**
 * Units a delegated WAAPI animation must NOT carry — the layout-dependent
 * set. value.js's `COMPUTED_UNITS` is only `["var","calc"]` (the units the
 * engine resolves to a frozen px via a DOM round-trip during interpolation);
 * but WAAPI freezes a WIDER set. The rAF path re-emits each value as its OWN
 * unit string every frame (`width: 50vh`), so the browser re-resolves it on
 * every layout change; WAAPI computes its keyframes' viewport/container units
 * to px ONCE (at keyframe computation) and does not track a viewport/container
 * resize mid-animation — diverging from the rAF path. So every viewport- and
 * container-relative unit (plus `%`, resolved against the containing block)
 * stays on the rAF path, which is always pixel-correct.
 *
 * `var()`/`calc()` stay out for a deliberate, lasting reason beyond "needs DOM
 * resolution": a registered `@property` custom does not composite anyway (it
 * rasterizes per frame), so this rejection remains correct even as `@property`
 * reaches Baseline — it is not an incidental limitation to revisit.
 *
 * The guard is conservative by design: rejecting a unit only forgoes the
 * compositor optimization (the animation runs on rAF, always correct); it
 * never produces a wrong pixel. So the wider set trades a perf opportunity for
 * guaranteed isomorphism with the rAF path.
 */
const WAAPI_INELIGIBLE_UNITS: ReadonlySet<string> = new Set<string>([
    ...COMPUTED_UNITS, // var, calc — frozen-px via the computed round-trip
    "%",
    // viewport-relative (incl. the small/large/dynamic-viewport families)
    "vh",
    "vw",
    "vmin",
    "vmax",
    "vi",
    "vb",
    "svh",
    "svw",
    "svmin",
    "svmax",
    "svi",
    "svb",
    "lvh",
    "lvw",
    "lvmin",
    "lvmax",
    "lvi",
    "lvb",
    "dvh",
    "dvw",
    "dvmin",
    "dvmax",
    "dvi",
    "dvb",
    // container-query-relative
    "cqw",
    "cqh",
    "cqi",
    "cqb",
    "cqmin",
    "cqmax",
]);

/** True when a value's unit would freeze to px under WAAPI delegation. */
const isComputedUnit = (unit: unknown): boolean =>
    typeof unit === "string" && WAAPI_INELIGIBLE_UNITS.has(unit);

/**
 * Properties whose `%` resolves against a NON-layout-box reference the
 * compositor tracks correctly — so their `%` is exempt from the layout-`%`
 * rejection (F.W12 §Design-decision 3). `offset-distance`'s `%` is relative to
 * the resolved length of the element's `offset-path`, which WAAPI computes once
 * at keyframe computation and does not need to re-resolve on a layout resize
 * (unlike `width: %`, which tracks the containing block). The path itself
 * (`offset-path`) is a STATIC author value set on the element, not animated, so
 * the animated scalar is purely `offset-distance`.
 */
const PATH_RELATIVE_PERCENT_PROPERTIES: ReadonlySet<string> = new Set<string>([
    "offset-distance",
]);

/**
 * True when the property's `%` is path-relative (exempt from the layout-`%`
 * rejection). The flattened interpVars key MAY carry a dotted nesting prefix,
 * so the LEAF segment is matched — `offset-distance` admits whether it arrives
 * bare or nested. `calc`/`var` units are NOT exempted here (they still freeze);
 * only the `%` rejection is relaxed for the offset family.
 */
const isOffsetPercentProperty = (property: string): boolean =>
    PATH_RELATIVE_PERCENT_PROPERTIES.has(property) ||
    PATH_RELATIVE_PERCENT_PROPERTIES.has(property.split(".").pop() ?? property);

export type WAAPIEligibility =
    | { eligible: true }
    | { eligible: false; reason: string };

/**
 * WebKit ENGINE feature-detect (CE-1.0). `webkitConvertPointFromNodeToPage`
 * has shipped WebKit-only since Safari 4 and exists in no other engine —
 * unlike UA strings, where Chromium AND jsdom both advertise "AppleWebKit",
 * so a UA sniff would misfire in both. Read per call (a cheap property
 * probe) so a test can install/remove the marker around one assertion.
 */
const isWebKitEngine = (): boolean =>
    typeof (globalThis as { webkitConvertPointFromNodeToPage?: unknown })
        .webkitConvertPointFromNodeToPage === "function";

/**
 * Decide whether an animation can be delegated to the Web Animations
 * API for compositor-thread playback. Single source of truth — the
 * `Animation.play()` dispatcher consults this once, with no inline
 * pre-checks or post-failure fallbacks.
 *
 * Eligibility requires ALL of:
 * 1. At least one DOM target with `Element.animate()` available.
 * 2. Every frame uses the default DOM-style renderer (no user
 *    transform that WAAPI can't see).
 * 3. All frames share the same timing function (WAAPI exposes
 *    one easing per animation, not per stop).
 * 4. No layout-dependent units — `var`/`calc` (frozen to px via the
 *    computed round-trip), and every viewport-/container-relative unit
 *    plus `%` (WAAPI computes these to px once at keyframe computation and
 *    does not track a resize, unlike the rAF path which re-emits the unit
 *    string each frame). See {@link WAAPI_INELIGIBLE_UNITS}.
 * 5. No color interpolation — handled by perceptual color spaces in
 *    JS, not by WAAPI's RGB lerp.
 *
 * On failure returns a diagnostic `reason` so callers can surface it
 * to debug builds without a console.warn falling out of the engine.
 */
export function isWAAPIEligible<V extends Vars>(
    animation: KeyframesAnimation<V>,
): WAAPIEligibility {
    if (!animation.targets || animation.targets.length === 0) {
        return { eligible: false, reason: "no DOM targets" };
    }
    if (typeof animation.targets[0]?.animate !== "function") {
        return {
            eligible: false,
            reason: "target does not implement Element.animate()",
        };
    }

    for (const frame of animation.frames) {
        // Reference comparison against the instance's ONE default renderer —
        // typed and bind-proof, unlike the former Symbol tag (which
        // `Function.prototype.bind` silently dropped, making every
        // CSSKeyframesAnimation read as "custom transform" and the whole
        // WAAPI path dead in practice).
        if (!animation.usesDefaultRenderer(frame.transform)) {
            return {
                eligible: false,
                reason: "custom transform function (not the default DOM renderer)",
            };
        }
    }

    const firstTF = animation.frames[0]?.timingFunction;
    if (firstTF && animation.frames.length > 1) {
        for (let i = 1; i < animation.frames.length; i++) {
            // Compare the CALLABLE identity, not the Easing wrapper — two
            // frames eased by the same resolved `fn` wrapped in distinct
            // `{ fn }` objects are uniform.
            if (animation.frames[i]!.timingFunction.fn !== firstTF.fn) {
                return {
                    eligible: false,
                    reason: "non-uniform per-frame timing function (WAAPI supports one easing per animation)",
                };
            }
        }
        // WAAPI applies its single easing PER SEGMENT (between consecutive
        // keyframe stops). A CSS-twinned easing (a spring's `linear()`)
        // across 2+ segments would restart the curve at every stop —
        // silently wrong on the compositor — so it stays on the rAF path,
        // which runs the true curve across the whole span.
        if (firstTF.css !== undefined) {
            return {
                eligible: false,
                reason: "CSS-twinned easing across multiple segments (WAAPI restarts the curve per segment)",
            };
        }
    }

    // WAAPI may delegate ONLY when the (uniform) easing has a FAITHFUL CSS
    // representation — a `.css` twin (a spring's `linear()`, an explicit
    // `cubic-bezier()`/CSS-keyword/`steps()` easing). A bespoke callable
    // (the value.js `easeInOutCubic` default, `easeOutCubic`, `bounceInEase`,
    // a user closure) has NO faithful CSS twin, so delegating it would run
    // BARE LINEAR on the compositor — a silent visual regression. Those stay
    // on the rAF path, which runs the true curve. (Pre-KF-B1 the WAAPI path
    // was dead in practice, so this keeps the resurrection faithful:
    // delegate only when the curve round-trips to CSS.)
    if (firstTF && firstTF.css === undefined) {
        return {
            eligible: false,
            reason: "easing has no faithful CSS twin (would run bare linear on the compositor)",
        };
    }

    // CE-1.0 (J.W6 S9, measured on-device): WebKit refuses hardware
    // acceleration for ANY animation carrying a custom `linear()` easing —
    // even transform/opacity — so a delegated spring would run MAIN-THREAD
    // WAAPI: an extra effect object + the shadow tick loop wrapping an
    // animation no faster than the rAF path it bypassed. The delegation
    // contract (top of file) only ever trades a perf OPPORTUNITY, never a
    // loss, so the `linear()`-twinned easing (a spring's stops, or any
    // custom `linear()` string) is HELD on the rAF path for WebKit.
    // `cubic-bezier()`/keyword twins still delegate — the refusal is
    // `linear()`-specific (a WebKit engine behaviour, not a syntax gap).
    if (firstTF?.css?.startsWith("linear(") && isWebKitEngine()) {
        return {
            eligible: false,
            reason: "WebKit refuses HW-accel for linear() easing — the spring twin stays on the rAF path (CE-1.0)",
        };
    }

    for (const frame of animation.frames) {
        for (const [property, interpVarArr] of Object.entries(
            frame.interpVars,
        )) {
            // `offset-distance`'s `%` resolves against the PATH LENGTH, not a
            // layout box (F.W12 §Design-decision 3 / MEASURE-FIRST). The
            // compositor resolves it correctly at keyframe computation and
            // does NOT need a per-frame layout round-trip — so it is exempt
            // from the `%`/computed-unit rejection that keeps viewport- and
            // container-relative `%` on the rAF path. The exemption is keyed
            // on the property, so a `width: %` (a real layout box) stays
            // ineligible — only the path-relative offset family is admitted.
            const pathRelativePercent = isOffsetPercentProperty(property);

            for (const iv of interpVarArr) {
                // Surgical exemption: ONLY the path-relative `%` is relaxed.
                // `calc`/`var` (and every viewport/container unit) still freeze
                // and stay ineligible even on the offset family.
                const startBad =
                    isComputedUnit(iv.start?.unit) &&
                    !(pathRelativePercent && iv.start?.unit === "%");
                const stopBad =
                    isComputedUnit(iv.stop?.unit) &&
                    !(pathRelativePercent && iv.stop?.unit === "%");
                if (startBad || stopBad) {
                    return {
                        eligible: false,
                        reason: `layout-dependent unit (${String(iv.start?.unit ?? iv.stop?.unit)}) would freeze to px under WAAPI`,
                    };
                }
                if (iv.start?.unit === "color" || iv.stop?.unit === "color") {
                    return {
                        eligible: false,
                        reason: "color interpolation requires perceptual lerp",
                    };
                }
            }
        }
    }

    return { eligible: true };
}

/**
 * The TOTAL interior-stop budget per segment — a running CAP, NOT a recursion
 * depth (a depth-bounded recursion is exponential: 2^D stops at depth D). The
 * curvature-adaptive densify ({@link densifyInteriorTimes}) draws every interior
 * stop from ONE shared budget, so the emit is ALWAYS ≤ this cap on a segment — a
 * near-linear segment spends 0, a sharply-bending one approaches (and stops at)
 * the cap. 16 is double the retired fixed 8 (Q.WB4): a sharp bend may emit MORE
 * stops than the old uniform 8 (tightening the fill where it bent), while the
 * common case emits FAR fewer.
 */
const WAAPI_MAX_SUBSEGMENT_STOPS = 16;

/**
 * The perceptual chord-to-curve tolerance — the fraction of a channel's FULL
 * value range within which the WAAPI piecewise-linear fill is treated as
 * matching the true rAF curve, so no interior stop is spent. 0.5% of the range
 * is a sub-pixel threshold on a typical animated sweep (a 200px range tolerates
 * a 1px chord gap), below visual perception. A channel is normalized by its OWN
 * full range, so a large-range and a small-range channel share ONE dimensionless
 * tolerance. The refinement spends an interior stop ONLY where the worst-channel
 * normalized error EXCEEDS this — dense where the curve bends, none where linear.
 */
const WAAPI_CHORD_TOLERANCE = 0.005;

/**
 * The set of numeric channels an interp sample carries, flattened to a stable
 * key→scalar map. {@link Animation.interpFrames} returns `Record<string,
 * ValueUnit[]>` whose leaves MAY be a multi-component vector (a `translate(x,y)`
 * → length-2 `ValueUnit[]`); each component is a distinct curvature channel, so
 * the key is suffixed by component index. The numeric `.value` is copied OUT
 * eagerly — `interpFrames(t, false)` may alias a frame's live `flatVars` buffer
 * (the single-active-frame fast-path, engine.ts), so concurrent samples cannot
 * all read the same aliased object; the copy decouples them. Non-finite /
 * non-numeric leaves are skipped (they carry no curvature).
 */
type ChannelSample = Map<string, number>;

const sampleChannels = <V extends Vars>(
    animation: KeyframesAnimation<V>,
    t: number,
): ChannelSample => {
    const out: ChannelSample = new Map();
    const vars = animation.interpFrames(t, false);
    for (const key in vars) {
        const leaf = vars[key];
        if (leaf === undefined) continue;
        for (let i = 0; i < leaf.length; i++) {
            const v = leaf[i]?.value;
            if (typeof v === "number" && Number.isFinite(v)) {
                out.set(leaf.length > 1 ? `${key}.${i}` : key, v);
            }
        }
    }
    return out;
};

/** Per-channel full value RANGE over the animation — the error normalizer. */
type ChannelRanges = Map<string, number>;

/**
 * The coarse pre-scan probe count whose extent fixes each channel's full value
 * RANGE (the error normalizer). The range must be the channel's WHOLE swing
 * across the segment — NOT a per-sub-segment span — so a sub-pixel wiggle in a
 * flat tail (a settled spring at 200px ± 0.3px) reads as a negligible fraction
 * of the 200px range (well below tolerance) and the refinement budget is NOT
 * wasted chasing settled-curve noise; it is spent on the genuine bend (the
 * overshoot peak). 64 probes resolve the extent of every realistic easing (a
 * spring overshoot, a bezier inflection) deterministically.
 */
const RANGE_SCAN_PROBES = 64;

const scanChannelRanges = <V extends Vars>(
    animation: KeyframesAnimation<V>,
    startTime: number,
    stopTime: number,
): ChannelRanges => {
    const min = new Map<string, number>();
    const max = new Map<string, number>();
    const span = stopTime - startTime;
    for (let p = 0; p <= RANGE_SCAN_PROBES; p++) {
        const sample = sampleChannels(
            animation,
            startTime + (span * p) / RANGE_SCAN_PROBES,
        );
        for (const [key, v] of sample) {
            const lo = min.get(key);
            const hi = max.get(key);
            if (lo === undefined || v < lo) min.set(key, v);
            if (hi === undefined || v > hi) max.set(key, v);
        }
    }
    const ranges: ChannelRanges = new Map();
    for (const [key, lo] of min) ranges.set(key, (max.get(key) ?? lo) - lo);
    return ranges;
};

/**
 * The worst-channel chord-to-curve FLATNESS error of a segment `[a, b]`,
 * measured at the segment's INTERIOR — NOT at the midpoint alone. A single
 * midpoint probe is BLIND to a symmetric S-curve (a `cubic-bezier(.9,0,.1,1)`,
 * the canonical sharp inflection): its true midpoint lands EXACTLY on the chord,
 * so a midpoint-only test reads "flat" while the quarter-points bend hugely. The
 * predicate therefore probes TWO interior points — `a + (b−a)/4` and
 * `a + 3(b−a)/4` — and takes the worst chord deviation there. For each channel
 * present at both endpoints, the chord prediction at a probe `t` is the linear
 * interp of `(a, b)`; the error is `|true(t) − chord(t)|` normalized by the
 * channel's FULL range (NOT the sub-segment span — normalizing by the span makes
 * a sub-pixel wiggle in a flat tail read as a huge fraction and misdirects the
 * budget onto settled-curve noise; the full range keeps the error a TRUE
 * perceptual fraction so the budget chases the real bend). A channel with a
 * zero/absent full range (constant everywhere) contributes no error. Returns the
 * MAX over both probes and all channels — one bend anywhere forces the split.
 */
const segmentFlatnessError = <V extends Vars>(
    animation: KeyframesAnimation<V>,
    a: number,
    sampleA: ChannelSample,
    b: number,
    sampleB: ChannelSample,
    ranges: ChannelRanges,
): number => {
    const span = b - a;
    let worst = 0;
    for (const frac of [0.25, 0.75] as const) {
        const t = a + span * frac;
        const sampleT = sampleChannels(animation, t);
        for (const [key, trueV] of sampleT) {
            const av = sampleA.get(key);
            const bv = sampleB.get(key);
            if (av === undefined || bv === undefined) continue;
            const range = ranges.get(key);
            if (range === undefined || range === 0) continue;
            const chord = av + (bv - av) * frac;
            const err = Math.abs(trueV - chord) / range;
            if (err > worst) worst = err;
        }
    }
    return worst;
};

/**
 * One candidate sub-segment in the best-first refinement queue — its endpoints
 * (time + cached sample) and the worst-channel flatness error across its
 * interior (the priority key: the sub-segment that bends MOST is split first).
 */
interface DensifyCandidate {
    a: number;
    sampleA: ChannelSample;
    b: number;
    sampleB: ChannelSample;
    error: number;
}

/**
 * The curvature-adaptive interior-stop densify (Q.WB4) — replaces the retired
 * fixed-8 uniform loop. A BEST-FIRST (largest-bend-first) bounded refinement: for
 * each boundary segment it scans the per-channel full range, seeds a candidate
 * `[a, b]`, and — while the per-segment budget ({@link WAAPI_MAX_SUBSEGMENT_STOPS})
 * is unspent — repeatedly splits the candidate with the LARGEST chord-to-curve
 * flatness error at its MIDPOINT, emitting that midpoint as an interior stop and
 * re-queuing the two halves (re-scored). This is the key over a naive depth-first
 * split: a depth-first left-first recursion exhausts a shared budget on the
 * leftmost sub-intervals (concentrating every stop on one side and leaving the
 * other COARSER than the uniform fixed-8 — a fidelity REGRESSION); best-first
 * instead always spends the next stop where the curve bends worst GLOBALLY, so
 * each emitted stop monotonically lowers the max chord error and the result is
 * never coarser than uniform for the same count. The flatness predicate
 * ({@link segmentFlatnessError}, quarter-point probed, full-range normalized)
 * defeats the symmetric-inflection blind spot AND the settled-tail-noise trap. A
 * candidate already within {@link WAAPI_CHORD_TOLERANCE} is never split → a
 * near-linear segment emits ZERO interior stops. The total per segment is bounded
 * by the budget (NOT 2^D). The boundary endpoints are NEVER touched — only the
 * INTERIOR is redistributed. Reuses the EXISTING `interpFrames` sampler (no new
 * curve evaluator). Returns the union of every emitted interior time.
 */
export function densifyInteriorTimes<V extends Vars>(
    animation: KeyframesAnimation<V>,
    sortedTimes: readonly number[],
    duration: number,
): Set<number> {
    const interior = new Set<number>();
    if (duration <= 0) return interior;

    for (let i = 1; i < sortedTimes.length; i++) {
        const startTime = sortedTimes[i - 1]!;
        const stopTime = sortedTimes[i]!;
        if (stopTime - startTime <= 0) continue;

        const ranges = scanChannelRanges(animation, startTime, stopTime);
        const startSample = sampleChannels(animation, startTime);
        const stopSample = sampleChannels(animation, stopTime);

        const mkCandidate = (
            a: number,
            sampleA: ChannelSample,
            b: number,
            sampleB: ChannelSample,
        ): DensifyCandidate => ({
            a,
            sampleA,
            b,
            sampleB,
            error: segmentFlatnessError(
                animation,
                a,
                sampleA,
                b,
                sampleB,
                ranges,
            ),
        });

        // The active sub-segment queue (small — bounded by the budget — so a
        // linear scan for the max-error candidate is cheaper than a heap).
        const queue: DensifyCandidate[] = [
            mkCandidate(startTime, startSample, stopTime, stopSample),
        ];

        let budget = WAAPI_MAX_SUBSEGMENT_STOPS;
        while (budget > 0) {
            // Pick the candidate that bends the MOST (best-first refinement);
            // skip every candidate already within tolerance.
            let worstIdx = -1;
            let worstErr = WAAPI_CHORD_TOLERANCE;
            for (let q = 0; q < queue.length; q++) {
                if (queue[q]!.error > worstErr) {
                    worstErr = queue[q]!.error;
                    worstIdx = q;
                }
            }
            if (worstIdx === -1) break; // every candidate is within tolerance

            const seg = queue[worstIdx]!;
            const m = (seg.a + seg.b) / 2;
            // A degenerate split (midpoint coincides with an endpoint under
            // float precision) cannot be refined further — retire it.
            if (m <= seg.a || m >= seg.b) {
                queue.splice(worstIdx, 1);
                continue;
            }
            const sampleM = sampleChannels(animation, m);
            interior.add(m);
            budget--;
            // Replace the split candidate with its two re-scored halves.
            queue.splice(
                worstIdx,
                1,
                mkCandidate(seg.a, seg.sampleA, m, sampleM),
                mkCandidate(m, sampleM, seg.b, seg.sampleB),
            );
        }
    }

    return interior;
}

/**
 * Convert animation frames to WAAPI Keyframe[] format.
 *
 * Emits a keyframe at every stop boundary AND a CURVATURE-ADAPTIVE set of
 * interior samples per segment (Q.WB4, {@link densifyInteriorTimes}) by
 * evaluating the true rAF curve (`interpFrames`, which runs each frame's
 * per-segment easing) at offsets where the curve BENDS — so the compositor's
 * piecewise-linear fill tracks the JS curve, not just its endpoints, while
 * spending NO interior stops on a near-linear segment.
 */
export function toWAAPIKeyframes<V extends Vars>(
    animation: KeyframesAnimation<V>,
): Keyframe[] {
    const duration = animation.options.duration;
    const keyframes: Keyframe[] = [];

    const timePoints = new Set<number>();
    for (const frame of animation.frames) {
        timePoints.add(frame.time.start);
        timePoints.add(frame.time.stop);
    }

    const sortedTimes = [...timePoints].sort((a, b) => a - b);

    // Densify: between each pair of consecutive boundaries, interleave the
    // CURVATURE-ADAPTIVE interior sample times — dense where the true rAF curve
    // bends, ZERO where it is near-linear. The set dedupes against the
    // boundaries, so a zero-width segment (start === stop) contributes nothing
    // and degenerate inputs (duration ≤ 0) stay boundary-only. The boundary
    // endpoints are ALWAYS emitted — the adaptive emit redistributes ONLY the
    // interior, never drops a boundary — so the densify is never a regression.
    const sampleTimes = new Set<number>(sortedTimes);
    for (const t of densifyInteriorTimes(animation, sortedTimes, duration)) {
        sampleTimes.add(t);
    }

    for (const t of [...sampleTimes].sort((a, b) => a - b)) {
        const vars = animation.interpFrames(t, false);
        if (Object.keys(vars).length === 0) continue;
        const styleVars = unflattenObjectToString(vars);
        keyframes.push({
            offset: clamp(t / duration, 0, 1),
            ...styleVars,
        });
    }

    return keyframes;
}

const DIRECTION_MAP: Record<string, PlaybackDirection> = {
    normal: "normal",
    reverse: "reverse",
    alternate: "alternate",
    "alternate-reverse": "alternate-reverse",
};

const FILL_MAP: Record<string, FillMode> = {
    none: "none",
    forwards: "forwards",
    backwards: "backwards",
    both: "both",
};

/**
 * Map the engine's `animation-composition` operator (K.W7) to the WAAPI
 * `CompositeOperation` keyword — a Baseline keyword pass-through (Chrome/Edge
 * 112, Safari 16, Firefox 115). `replace`/`add`/`accumulate` are the exact CSS
 * composite operators WAAPI's `KeyframeEffectOptions.composite` accepts, so the
 * forward is identity. value.js + the engine guarantee the operator is one of
 * the three (the adapter only captures the CSS grammar's three keywords); a
 * stray value degrades to `replace` (the default composite), never a throw.
 */
const COMPOSITE_MAP: Record<string, CompositeOperation> = {
    replace: "replace",
    add: "add",
    accumulate: "accumulate",
};

/**
 * The UNIFORM `animation-composition` operator across an animation's compiled
 * frames (K.W7 S2). WAAPI exposes ONE effect-level `composite` per animation
 * (the per-keyframe `composite` member is the alternative; the effect-level
 * keyword is the faithful forward for a single-operator animation). Returns the
 * first non-`replace` composition found, or `replace` (the default) when none
 * is declared. Eligibility ({@link isWAAPIEligible}) already guaranteed the
 * operator is uniform when it admitted an `add`/`accumulate` animation, so
 * reading the first composited frame's operator is enough.
 */
const uniformComposite = <V extends Vars>(
    animation: KeyframesAnimation<V>,
): CompositeOperation => {
    for (const frame of animation.frames) {
        const op = frame.composition;
        if (op != null && op !== "replace") {
            return COMPOSITE_MAP[op] ?? "replace";
        }
    }
    return "replace";
};

export function toWAAPIOptions<V extends Vars>(
    animation: KeyframesAnimation<V>,
): KeyframeEffectOptions {
    const opts = animation.options;
    const direction = DIRECTION_MAP[opts.direction];
    const fill = FILL_MAP[opts.fillMode];
    if (direction == null) {
        throw new TypeError(
            `Unrecognised animation direction "${opts.direction}".`,
        );
    }
    if (fill == null) {
        throw new TypeError(
            `Unrecognised animation fill mode "${opts.fillMode}".`,
        );
    }

    // WAAPI exposes ONE easing per animation. When the uniform timing
    // function carries a CSS twin — `Easing.css`, e.g. a spring's `linear()`
    // stops from `springTimingFunction` — emit it so the compositor runs the
    // true curve between the sampled keyframe endpoints. Otherwise fall back
    // to bare `linear` (the keyframe stops carry whatever intent JS
    // interpolation baked in). Eligibility already guaranteed a uniform
    // timing function, rejects a CSS-twinned easing across multiple
    // segments (per-segment curve restart), and holds `linear()` twins on
    // rAF for WebKit (CE-1.0 — HW-accel refused), so reading frame 0's is
    // enough.
    const uniformTiming =
        animation.frames[0]?.timingFunction ?? animation.options.timingFunction;
    const easing = uniformTiming.css ?? "linear";

    // K.W7 S2 — the Baseline `composite` keyword pass-through. The compositor
    // honors `add`/`accumulate` by compositing the keyframe effect onto the
    // element's UNDERLYING value (the same base the rAF path snapshots), so the
    // SAME `composite:add` keyframe produces the SAME SUM on both backends (the
    // rAF↔WAAPI parity the §gate's clause (c) asserts). A pure-`replace`
    // animation emits `replace` — byte-identical to the pre-K.W7 options.
    const composite = uniformComposite(animation);

    const result: KeyframeEffectOptions = {
        duration: opts.duration,
        delay: opts.delay,
        iterations:
            opts.iterationCount === Infinity ? Infinity : opts.iterationCount,
        direction,
        fill,
        easing,
    };
    // Only emit a non-default composite — keep the options byte-identical for
    // the overwhelming `replace` majority (no behavioural change on that path).
    if (composite !== "replace") result.composite = composite;
    return result;
}

/**
 * Drive an animation via WAAPI for compositor-thread visuals while
 * a parallel rAF loop ticks the JS-side state machine so events
 * (`animationstart`, `animationiteration`, `animationend`),
 * `iteration`, `paused`, and `pausedTime` all stay coherent.
 *
 * Resolves when both the WAAPI animation finishes and the JS state
 * machine reaches `done`. Errors propagate — there is no silent
 * fallback path; eligibility was decided once before this was called.
 */
export async function playWAAPI<V extends Vars>(
    animation: KeyframesAnimation<V>,
): Promise<void> {
    const keyframes = toWAAPIKeyframes(animation);
    const options = toWAAPIOptions(animation);

    const waAnimations: globalThis.Animation[] = animation.targets.map(
        (target) => target.animate(keyframes, options),
    );
    // Expose the handles on the instance so the engine's lifecycle methods
    // (`stop`/`reset`) can cancel the compositor animations — cancelling
    // rejects `wa.finished`, which the catch below treats as a halt.
    animation._waAnimations = waAnimations;

    // Shadow tick loop — drives lifecycle (onStart / iteration /
    // onEnd / events / pause / resume) so WAAPI playback has the
    // same observable state as the rAF path. No interpFrames calls;
    // WAAPI handles the visuals. Rides the animation's own RAFPlayback
    // driver so `stop()` halts it uniformly with every other loop.
    animation.playback.loop(async (now: number) => {
        if (animation.done) return false;
        await animation.advanceTo(now);
        if (animation.paused) {
            for (const wa of waAnimations) wa.pause();
        } else {
            for (const wa of waAnimations) {
                if (wa.playState === "paused") wa.play();
            }
        }
        return !animation.done;
    });

    try {
        await Promise.all(waAnimations.map((wa) => wa.finished));
        // Commit-on-finish (WAAPI W1). A finished `fill: forwards` animation
        // otherwise "takes precedence over all static styles" indefinitely
        // (MDN `commitStyles`), overriding the inline rest write and leaking
        // one live compositor animation per completed play. Converge to the
        // rAF path's terminal state — rest frame as inline style, ZERO
        // residual animations — by baking the final value inline (only when
        // it IS the rest, i.e. a forwards/both fill) then cancelling. The
        // shared `onEnd → paintRest` writes the LOGICAL rest for every fill
        // mode; `commitStyles` only guards the forwards case against the
        // finish-before-paint race. Reaching here means a genuine finish (a
        // `stop()`/`reset()` cancel rejects `finished` → the catch below).
        for (const wa of waAnimations) {
            try {
                if (
                    animation.restPosition === "final" &&
                    typeof wa.commitStyles === "function"
                ) {
                    wa.commitStyles();
                }
                wa.cancel();
            } catch {
                /* already detached/cancelled — nothing to commit or cancel */
            }
        }
    } catch {
        // `Animation.stop()`/`reset()` cancelled the compositor animations,
        // rejecting `finished` with an AbortError — a deliberate halt, not
        // an error (`_cancelWAAPI` already cleared the handles). Swallow it so
        // the awaited `play()` resolves cleanly.
    } finally {
        animation.playback.stop();
        animation._waAnimations = [];
    }
}

export type NativeScrollAttachment =
    | { attached: true; animations: globalThis.Animation[] }
    | { attached: false; reason: string };

/**
 * The ADDITIVE native `ScrollTimeline`/`ViewTimeline` WAAPI bridge
 * (D-LIB-2 / F-5 / S-1) — attach an eligible DOM animation to a native
 * scroll-driven timeline so the compositor samples it from scroll position
 * with ZERO main-thread sampling.
 *
 * Returns `{ attached: false, reason }` (the caller keeps the JS
 * {@link import("./timeline").Timeline} sampler) when:
 *  - the curve is not WAAPI-eligible (reuses the one eligibility gate), or
 *  - the platform lacks the native timeline (`createNativeTimeline` → `null`:
 *    Firefox today, SSR, jsdom — feature-detect, no polyfill).
 *
 * CRITICAL — the ARCH-kill HOLDS. This NEVER replaces the JS sampler: native
 * scroll-driven is Chromium-only / not-Baseline, and the JS `ScrollTimeline`
 * is the general (non-DOM-capable) fallback driver. Pure additive fast lane.
 *
 * Progress-reconciliation caveat (S5 / W3). The JS `ScrollTimeline` applies
 * `SmoothProgress` smoothing + a boundary snap (`timeline.ts` pipeline); the
 * native `animation-range` lane has NEITHER. This bridge attaches the RAW
 * scroll progress — so for behaviour-equivalence the JS lane must run with
 * smoothing disabled (`new ScrollTimeline({ smoothing: false })`), or the
 * divergence is documented. We do NOT smuggle the JS smoother onto the native
 * lane (there is no seam to). The lifecycle is W7-W1-shaped: an infinite scroll
 * timeline never resolves `finished` (correctly long-lived) — the handles are
 * exposed on `animation._waAnimations` so `stop()`/`reset()` cancel them.
 */
export function attachNativeScrollTimeline<V extends Vars>(
    animation: KeyframesAnimation<V>,
    spec: NativeTimelineSpec,
): NativeScrollAttachment {
    const elig = isWAAPIEligible(animation);
    if (!elig.eligible) {
        return { attached: false, reason: elig.reason };
    }

    const timeline = createNativeTimeline(spec);
    if (timeline == null) {
        return {
            attached: false,
            reason: "native scroll/view timeline unavailable (feature absent)",
        };
    }

    const keyframes = toWAAPIKeyframes(animation);
    // A native scroll-driven animation maps its 0→1 progress over the timeline
    // range, NOT wall-clock time — but the easing/direction/fill from the one
    // options builder still shape that progress mapping; `timeline:` swaps the
    // clock for the scroller. No time-based `duration` smoothing is involved:
    // the native lane has no SmoothProgress, by construction (see caveat).
    const options: KeyframeAnimationOptions = {
        ...toWAAPIOptions(animation),
        timeline,
    };

    const animations = animation.targets.map((target) =>
        target.animate(keyframes, options),
    );
    animation._waAnimations = animations;
    return { attached: true, animations };
}
