/**
 * `engine/css/css-animation.ts` — `CSSKeyframesAnimation`, the CSS-parsing
 * entry-point subclass, lifted out of the engine god-module (R.W2 — lib-engine
 * F-4) and sub-zoned into `engine/css/` beside its `metadata` recovery sibling
 * (S.B2 — C-1). Its fields (`propertyRegistry`, `scrollOptions`, `_boundTimeline`)
 * and methods (`fromString`, `fromVars`, `fromKeyframes`, `bindTimeline`,
 * `resolveTransform`) are wholly CSS-specific — the base `KeyframesAnimation`
 * (in `../animation`) is value.js-/scroll-agnostic. The `engine/css/index.ts`
 * barrel re-exports the class; the `engine/index.ts` barrel re-exports it onward.
 */
import {
    isObject,
    ValueUnit,
    type CSSTimelineOptions,
    type PropertyDescriptor,
} from "@mkbabb/value.js";
import { resolveKeyframes } from "../../adapter";
import type {
    CompositeOperator,
    Easing,
    InputAnimationOptions,
    TransformFunction,
    Vars,
} from "../../constants";
import {
    recoverAnimationOptionsBase,
    recoverScrollOptions,
    registerPropertyDescriptors,
} from "./metadata";
import { cssTwinFor } from "../../easing";
import {
    namedSelectorToFraction,
    NAMED_SELECTOR_SUPERTYPE,
} from "../../compile/frame-compiler";
import type { Timeline } from "../../orchestration/timeline";
import { getTimingFunction } from "../../compile/easing-registry";
import { KeyframesAnimation } from "../animation";

const hasClone = (value: unknown): value is { clone: () => unknown } => {
    if (typeof value !== "object" || value == null) {
        return false;
    }

    const maybeClone = (value as { clone?: unknown }).clone;
    return typeof maybeClone === "function";
};

export class CSSKeyframesAnimation<
    V extends Vars,
> extends KeyframesAnimation<V> {
    /**
     * Q.WD1-bind S2 (DM-22) — the timeline a scroll-range named selector resolves
     * its phase against. Stored by {@link bindTimeline} for the no-timeline guard's
     * check; `undefined` until a timeline is bound. A scroll-context operation
     * specific to CSS keyframes with named selectors (the base `Animation` class is
     * value.js-/scroll-agnostic), so the field + method live here.
     */
    private _boundTimeline?: Timeline;

    constructor(
        options?: Partial<InputAnimationOptions>,
        ...targets: HTMLElement[]
    ) {
        super(options, targets);

        this.unflatten = false;
    }

    /**
     * Q.WD1-bind S2 (DM-22) — the attach-time deferred-resolution seam. A
     * scroll-range named keyframe selector (`entry`/`exit`/`cover`/`contain`)
     * ingests OPAQUELY (the L.W1 S4 floor) and is RESOLVABLE only under a timeline;
     * `bindTimeline` is where that resolution happens. It walks `templateFrames`,
     * resolves each named-selector start to a numeric `%` `ValueUnit` via
     * {@link namedSelectorToFraction}, CLEARS the `NAMED_SELECTOR_SUPERTYPE` tag (so
     * the resolved frame is indistinguishable from an author-written `%` at the sort
     * step — no NaN), and re-compiles. The play-time guard
     * (`assertNoUnresolvedNamedSelector`) then finds zero unresolved frames and
     * passes silently — so this MUST land before the guard fires (the gate-enforced
     * sub-wave ordering: the guard over-throws on a bound animation if the resolver
     * is absent).
     *
     * Idempotent + safe to call before `fromString`: with no named frames the walk
     * is a no-op; calling it after a NaN-producing `parse()` purges the NaN frames.
     */
    bindTimeline(timeline: Timeline): this {
        this._boundTimeline = timeline;

        let resolvedAny = false;
        for (const frame of this.compiler.templateFrames) {
            if (frame.start.superType?.includes(NAMED_SELECTOR_SUPERTYPE)) {
                const fraction = namedSelectorToFraction(
                    String(frame.start.value),
                );
                // A proper numeric percentage ValueUnit; the named-selector tag is
                // CLEARED (absent on the replacement) so the sort + calcFrameTime see
                // a plain `%` start — no NaN.
                frame.start = new ValueUnit(fraction * 100, "%");
                resolvedAny = true;
            }
        }

        // Re-compile if already parsed (purge any NaN frames the prior parse made)
        // OR if we just resolved named starts — the next `parse()` then sees only
        // numeric starts. If never parsed and nothing resolved, the walk was a no-op.
        if (resolvedAny && this.compiler.frames.length > 0) {
            this.parse();
        }

        return this;
    }

    /**
     * One transform-resolution seam for the three `from*` entry points:
     * a supplied transform is the consumer's renderer (vars arrive
     * unflattened); genuine omission resolves to the instance's ONE
     * default DOM-style renderer, which keeps WAAPI eligibility a
     * reference comparison (`usesDefaultRenderer`).
     */
    private resolveTransform(
        transform: TransformFunction<V> | undefined,
    ): TransformFunction<V> {
        this.unflatten = transform != null;
        return transform ?? this._defaultTransform;
    }

    fromVars(vars: V[], transform?: TransformFunction<V>) {
        transform = this.resolveTransform(transform);

        for (let i = 0; i < vars.length; i++) {
            const v = vars[i]!;
            const percent = Math.round((i / (vars.length - 1)) * 100);
            this.addFrame(percent, v, transform);
        }

        this.parse();

        return this;
    }

    fromKeyframes(
        keyframes: Map<string, Partial<V>> | Record<string, Partial<V>>,
        transform?: TransformFunction<V>,
    ) {
        transform = this.resolveTransform(transform);

        if (isObject(keyframes)) {
            keyframes = new Map(Object.entries(keyframes));
        }

        const entries =
            keyframes instanceof Map
                ? keyframes.entries()
                : Object.entries(keyframes);

        for (const [percent, frame] of entries) {
            this.addFrame(percent, frame, transform);
        }

        this.parse();
        return this;
    }

    /**
     * Property registry from `@property` declarations parsed by
     * `fromString`. Empty when the input had no `@property` rules.
     * Consumers can read this to recover the type metadata for
     * custom properties (syntax string, initial value, inheritance
     * flag) without re-parsing the source CSS.
     */
    propertyRegistry: Map<string, PropertyDescriptor> = new Map();

    /**
     * Parsed scroll-grammar (`animation-timeline` / `animation-range` /
     * `timeline-scope` / `animation-trigger`) recovered from a sibling style rule
     * by `fromString` (L.W2 S1 — CC-6) via `recoverScrollOptions` (the
     * CSS-metadata-recovery seam); `undefined` when the input carried no scroll
     * grammar (the canonical time-clock animation). A read-only metadata field —
     * no hot-path impact, analogous to {@link propertyRegistry}. The compiler
     * (`compileToCSS`) reads it to EMIT the scroll longhands back out, closing the
     * round-trip's EMIT half.
     */
    scrollOptions?: CSSTimelineOptions;

    fromString(keyframes: string, transform?: TransformFunction<V>) {
        transform = this.resolveTransform(transform);

        // Single grammar in value.js handles every input shape:
        // bare @keyframes, @property + @keyframes, .class +
        // @keyframes, multi-keyframes, mixed at-rules. No regex
        // pre-detection or fallback parser path.
        const resolved = resolveKeyframes(keyframes);
        this.propertyRegistry = resolved.properties;

        // L.W2 S1 (CC-6) — recover the scroll grammar from the SAME parse via the
        // CSS-metadata-recovery seam. Under `exactOptionalPropertyTypes`, a
        // re-parse with no scroll grammar must DELETE a stale field rather than
        // assign `undefined` into the optional.
        const timeline = recoverScrollOptions(resolved.stylesheet);
        if (timeline !== undefined) this.scrollOptions = timeline;
        else delete this.scrollOptions;

        // K.W7 S4 — surface the adapter's structured diagnostics (EMPTY_PARSE,
        // and any value.js PARSE_ERROR consumed through OnParseError) on the
        // animation. A fresh array per `fromString` so a re-parse does not
        // carry stale rows; the engine's own COMPOSITION_FALLBACK rows join it
        // at apply time. The channel is queryable; nothing is logged.
        this.diagnostics = [...resolved.diagnostics];

        // F.W8 — recover a sibling style rule's `animation` shorthand/longhands as
        // the option BASE via the CSS-metadata-recovery seam, with the
        // constructor-explicit options overriding it. The base is EMPTY (a
        // byte-identical no-op) when the input carried no style rule.
        const base = recoverAnimationOptionsBase(resolved.options);
        if (Object.keys(base).length > 0) {
            this.setOptions({ ...base, ...this._ctorOptions });
        }

        for (const [percent, cachedFrame] of resolved.keyframes.entries()) {
            // Clone the frame to avoid mutating the memoized parse cache
            const frame = Object.fromEntries(
                Object.entries(cachedFrame).map(([k, v]) => [
                    k,
                    hasClone(v) ? v.clone() : v,
                ]),
            ) as Record<string, unknown>;
            // CSS parsing stays LENIENT (a forgiving language): an
            // unrecognized per-keyframe `animation-timing-function` falls
            // back to the inherited easing rather than throwing. The
            // fail-explicit throw is reserved for the explicit
            // setter/addFrame API where a bad value is a consumer bug, not
            // a parse outcome.
            const tfText = resolved.timingFunctions.get(percent);
            const resolvedFn = tfText ? getTimingFunction(tfText) : undefined;
            // Preserve the faithful CSS twin (a `linear()`/`cubic-bezier()`/
            // `steps()` literal, a CSS keyword) so the per-keyframe easing
            // round-trips on re-serialize instead of collapsing to the bare
            // registry name (F.W7 — the read half of the round-trip symmetry).
            let easing: Easing | undefined;
            if (resolvedFn) {
                const css = tfText ? cssTwinFor(tfText) : undefined;
                easing = css ? { fn: resolvedFn, css } : { fn: resolvedFn };
            }
            // K.W7 S1 — thread the captured per-keyframe `animation-composition`
            // operator (`add`/`accumulate`/`replace`) from the adapter's Map
            // into the template frame BESIDE the per-keyframe easing read. This
            // is the WIRING the audit named: the engine READING the value it
            // dropped, never a re-parse of the CSS at apply time.
            const composition = resolved.composition.get(percent) as
                | CompositeOperator
                | undefined;
            this.addFrame(
                percent,
                frame as Partial<V>,
                transform,
                easing,
                composition,
            );
        }

        this.parse();

        // D-LIB-1: register the parsed `@property` registry with the platform via
        // the CSS-metadata-recovery seam, so the native (WAAPI) path interpolates
        // a typed custom SMOOTHLY instead of discretely (the rAF JS path is the
        // verbatim fallback). Feature-detected — see `engine/css/metadata.ts`.
        // R.W3 §2A: thread `this.diagnostics` so a UA rejection surface a
        // `PROPERTY_REGISTER_REJECTED` row (the FAIL-EXPLICIT narrowing).
        registerPropertyDescriptors(this.propertyRegistry, this.diagnostics);

        return this;
    }
}
