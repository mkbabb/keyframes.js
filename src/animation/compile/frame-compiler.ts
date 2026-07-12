/**
 * `FrameCompiler` — the frame-compilation half of the animation engine,
 * split out of the former ~1019-line `Animation` god-object (D.W4 D-4).
 *
 * It owns the template→compiled pipeline (`addFrame` → `parse` → reconcile
 * vars → compute times → `AnimationFrame[]` with `interpVars`) and the frame
 * data (`templateFrames`/`parsedVars`/`frames`). It carries NO run-state — no
 * clock, no rAF loop, no lifecycle flags — so it is a pure value-in →
 * frames-out unit, unit-testable without a running loop. The owning
 * `Animation` composes one and delegates `addFrame`/`parse`/the frame
 * accessors to it; the compile inputs it needs (`options`, and `targets` for
 * `parse`) are passed in, never reached back through the owning class.
 */
import { unflattenObject, ValueUnit } from "@mkbabb/value.js/units";
import { seekPreviousValue } from "@mkbabb/value.js";
import type {
    AnimationFrame,
    AnimationOptions,
    CompositeOperator,
    InputAnimationOptions,
    TemplateAnimationFrame,
    TransformFunction,
    Vars,
} from "../constants";
import { NOOP_TRANSFORM } from "../constants";
import {
    createInterpVarValue,
    parseAndFlattenObject,
    type ParsedVarMap,
} from "./parse-flatten";
// The keyframe-SELECTOR grammar (the regexes, the named-range tag, the
// named-phase → fraction resolver, the content-id scale) AND the selector
// validate+parse function (`parseKeyframeSelector`, carved off `addFrame` at
// S.B5) live in the colocated `./selector` module (R.W2b + S.B5). S.B3 C-2 — the
// re-export CEREMONY is DEAD: consumers (`engine/interpolate.ts`,
// `test/nan-frame.ts`) import `namedSelectorToFraction` / `NAMED_SELECTOR_SUPERTYPE`
// from `./selector` DIRECTLY; this module imports only what IT uses.
import { FRAME_ID_SCALE, parseKeyframeSelector } from "./selector";

/**
 * A frame mid-compile (a29 F7). `createFrame` returns this: every field EXCEPT
 * the two derived ones (`vars`/`flatVars`) is present, and those two are
 * honestly OMITTED — not forged with `undefined as unknown as V`, which under
 * `exactOptionalPropertyTypes` is a per-field lie (a `V` slot holding
 * `undefined`). `finalizeFrameVars` derives `vars`/`flatVars` from `interpVars`
 * at the tail of `parse()` and narrows the segment to a complete
 * `AnimationFrame<V>` (the fill-site narrow the audit named). The steady-state
 * `frames` array is `AnimationFrame<V>[]` — fully finalized — before any
 * consumer reads it (`parse()` is synchronous).
 */
type FrameUnderConstruction<V extends Vars = Vars> = Omit<
    AnimationFrame<V>,
    "vars" | "flatVars"
>;

/**
 * Map a segment's percent endpoints onto the wall-clock window. Inlined here
 * (R.W1) from the dissolved `utils.ts` — this is its sole consumer.
 */
function calcFrameTime<V extends Vars>(
    startFrame: TemplateAnimationFrame<V>,
    endFrame: TemplateAnimationFrame<V>,
    duration: number,
) {
    const [start, stop] = [startFrame.start, endFrame.start];
    return {
        start: (start.value * duration) / 100,
        stop: (stop.value * duration) / 100,
    };
}

// The numeric SoA fold plan (`buildNumericPlan` + its `isNumericInterpVar`
// predicate) lives in the colocated `./numeric-plan` module (R.W2b carve);
// `finalizeFrameVars` builds one per frame. The heavy-surface easing-input
// resolver (`resolveEasingOption`) lives in `./easing/easing-option`. S.B3 C-2 —
// the re-export CEREMONY is DEAD: `engine/options.ts` imports `resolveEasingOption`
// from `./easing/easing-option` DIRECTLY; this module imports only what IT uses.
import { buildNumericPlan } from "./numeric-plan";
import { resolveEasingOption } from "./easing/easing-option";

export class FrameCompiler<V extends Vars = Vars> {
    templateFrames: TemplateAnimationFrame<V>[] = [];
    parsedVars: ParsedVarMap[] = [];
    frames: AnimationFrame<V>[] = [];

    /**
     * Next TEMPLATE frame id — a monotonic handle assigned in `addFrame`
     * (stable across re-parse, since `parse` does not re-add templates).
     * Compiled-frame ids are content-derived from `(startIx, stopIx)`
     * (see `createFrame`), NOT this counter, so `parse()` is idempotent.
     */
    frameId: number = 0;

    /**
     * The compile inputs live on the owning `Animation`'s `options` object.
     * The compiler holds a REFERENCE to it (the setters mutate it in place,
     * never replace it), so the NEXT compile always reads the current
     * `duration`/`easing`/`colorSpace` without re-linking. For values baked
     * into already-compiled frames, the setter triggers a targeted re-derive:
     * `setDuration` rescales `frame.time` in place; `setColorSpace`/
     * `setHueMethod` call {@link renormalizeColors} (the color resolution is
     * the only baked state that depends on them). No setter silently no-ops a
     * change to compiled state.
     */
    constructor(private readonly _options: AnimationOptions) {}

    /**
     * The live options object the compiler reads (a REFERENCE to the owning
     * `Animation`'s `options` — the setters mutate it in place). Read-only:
     * the compiler never replaces it. Exposed so `Animation.adoptCompiled`
     * can re-bind `Animation.options` to the adopted compiler's options object
     * BY CONSTRUCTION (`this.options === this.compiler.options`, the live-options
     * invariant — G.W19 / the `6e29236` lock), without poking a private field.
     */
    get options(): AnimationOptions {
        return this._options;
    }

    addFrame<K extends V>(
        start: number | string | ValueUnit<number>,
        vars: Partial<K>,
        transform?: TransformFunction<K>,
        timingFunction?: InputAnimationOptions["timingFunction"],
        composition?: CompositeOperator,
    ): void {
        if (typeof start === "number") {
            start = String(start) + "%";
        } else if (typeof start === "string") {
            start = start;
        } else if (start instanceof ValueUnit) {
            start = String(start);
        }

        // Fail-explicit belt (H.W0 H-A2, made TOTAL in J.W1 S3 — SEAM-1;
        // L.W1-S4-extended for the scroll-range named selectors). The validate+
        // parse guard lives BESIDE the grammar it checks against, in
        // `./selector` (the S.B5 carve): every non-conforming selector is a
        // clear, typed `AnimationOptionError` (blank → the "EMPTY_PARSE"
        // structured code), and a conforming scroll-range named selector
        // (`entry`/`exit`/…) ingests OPAQUELY — round-trips VERBATIM, resolves
        // to a numeric `%` only under a ScrollTimeline/ManualTimeline at attach
        // time (never a parse-time throw or an invented number).
        const parsedStart: ValueUnit = parseKeyframeSelector(start);

        let templateFrame = {
            id: this.frameId,
            start: parsedStart,
            vars,
            transform,
            // Genuine omission inherits the animation's easing; a present-
            // but-unresolvable input throws (fail-explicit).
            timingFunction:
                timingFunction == null
                    ? this.options.timingFunction
                    : resolveEasingOption("timingFunction", timingFunction),
            // K.W7 — the author-declared `animation-composition` operator for
            // this stop (omission = `replace`, the default composite).
            composition,
        } as TemplateAnimationFrame<K>;

        this.templateFrames.push(
            templateFrame as unknown as TemplateAnimationFrame<V>,
        );
        this.frameId += 1;
    }

    createFrame(startIx: number, endIx: number): AnimationFrame<V> {
        const startFrame = this.templateFrames[startIx]!;
        const endFrame = this.templateFrames[endIx]!;

        const ixs = {
            start: startIx,
            stop: endIx,
        };

        const time = calcFrameTime(startFrame, endFrame, this.options.duration);

        // `startIx` indexes `templateFrames` (the source keyframes), so the
        // "inherit the previous declared value" seek must walk THAT array —
        // not the compiled `frames[]`, whose indices are a different space
        // (segment order, not keyframe order). Walking `this.frames` with a
        // template index coincides only in the adjacent main-loop pass; it
        // reads the wrong frame the moment `reconcileVars` creates a segment
        // across non-adjacent keyframes (D-1). The inherited value is the
        // nearest PRECEDING keyframe that declares one.
        // J.W1 S2 (ENG-2) — the seek is TOTAL. `seekPreviousValue` honestly
        // returns `number | undefined`; the former stacked `!`s masked the
        // miss and dereferenced `templateFrames[undefined]!.transform` — a
        // TypeError on a transform-free bare `Animation` (a legitimate
        // numeric/CSS-var animation). When NO preceding template carries a
        // transform, the compiled frame takes the total no-op default (the
        // I.W0 S3 `NOOP_TRANSFORM` field-default philosophy, applied at the
        // compile seam) — a checked resolution, never a lying assertion.
        let transform = startFrame.transform;

        if (transform == null) {
            const transformIx = seekPreviousValue(
                startIx,
                this.templateFrames,
                (f) => f.transform != null,
            );
            transform =
                (transformIx === undefined
                    ? undefined
                    : this.templateFrames[transformIx]!.transform) ??
                NOOP_TRANSFORM;
        }

        // The same totality for the easing seek. `addFrame` always assigns a
        // `timingFunction`, so the miss arm is reachable only through direct
        // `templateFrames` mutation — but the resolution is total either way:
        // a miss inherits the animation's own easing, the same default
        // `addFrame` would have assigned.
        let timingFunction = startFrame.timingFunction;
        if (timingFunction == null) {
            const timingFunctionIx = seekPreviousValue(
                startIx,
                this.templateFrames,
                (f) => f.timingFunction != null,
            );
            timingFunction =
                (timingFunctionIx === undefined
                    ? undefined
                    : this.templateFrames[timingFunctionIx]!.timingFunction) ??
                this.options.timingFunction;
        }

        // Content-derived id keyed on the stable (startIx, stopIx) pair (FC-2).
        // A monotonic counter made `parse()` non-idempotent — re-compiling the
        // same input yielded different ids — defeating any byte-equality lock.
        // The (startIx, stopIx) pair IS the segment's identity, so two parses
        // of identical input now produce byte-identical frames[], ids included.
        const id = startIx * FRAME_ID_SCALE + endIx;

        // K.W7 — the segment carries the STOP stop's `animation-composition`.
        // CSS attaches `animation-composition` to the keyframe being composited
        // TOWARD, so a segment `start → stop` honors `stop`'s operator (the
        // declared composite of the value the segment is interpolating INTO).
        const composition = endFrame.composition;

        // The segment is a `FrameUnderConstruction<V>` — `vars`/`flatVars` are
        // OMITTED (not forged as `undefined as unknown as V`); `finalizeFrameVars`
        // derives them from `interpVars` at the tail of `parse()` and the buffer
        // narrows to `AnimationFrame<V>` there (a29 F7 — the fill-site narrow).
        const frame: FrameUnderConstruction<V> = {
            id,
            ixs,
            start: startFrame.start,
            time,
            interpVars: {},
            allInterpVars: [],
            transform,
            timingFunction,
            ...(composition != null ? { composition } : {}),
        };
        return frame as AnimationFrame<V>;
    }

    /**
     * Build an index mapping each variable name to the frame indices where
     * it appears. Used by reconcileVars() for O(1) "next occurrence" lookups
     * instead of O(N) findIndex scans per variable.
     */
    private buildVarIndex(): Map<string, number[]> {
        const index = new Map<string, number[]>();
        for (let i = 0; i < this.parsedVars.length; i++) {
            for (const key of Object.keys(this.parsedVars[i]!)) {
                let arr = index.get(key);
                if (!arr) {
                    arr = [];
                    index.set(key, arr);
                }
                arr.push(i);
            }
        }
        return index;
    }

    /**
     * Reconcile interpolation variables across non-adjacent keyframes.
     * For each variable at frame `ix`, find the next frame that also
     * defines that variable and create an interpolation segment between them.
     *
     * Uses a pre-built variable index (from buildVarIndex) to avoid
     * O(frames²) findIndex scans.
     */
    reconcileVars(ix: number, varIndex: Map<string, number[]>) {
        const startVars = this.parsedVars[ix];
        if (!startVars) {
            return;
        }

        for (const v of Object.keys(startVars)) {
            // Use the pre-built index to find the next frame defining this variable
            const occurrences = varIndex.get(v);
            if (!occurrences) continue;

            // Find first occurrence after ix
            let varIx = -1;
            for (const idx of occurrences) {
                if (idx > ix) {
                    varIx = idx;
                    break;
                }
            }

            if (varIx === -1) continue;

            const [startIx, endIx] = [ix, varIx];

            const frameIx = this.frames.findIndex(
                (f) => f.ixs.start === startIx && f.ixs.stop === endIx,
            );
            const frame =
                frameIx !== -1
                    ? this.frames[frameIx]!
                    : this.createFrame(startIx, endIx);

            frame.interpVars[v] = createInterpVarValue(
                v,
                startIx,
                endIx,
                this.parsedVars,
                this.options.colorSpace,
                this.options.hueMethod,
            ) as AnimationFrame<V>["interpVars"][string];

            if (frameIx === -1) {
                this.frames.push(frame);
            }
        }
    }

    /**
     * Compile `templateFrames` into the sampled `frames[]`. `targets` is the
     * one DOM input — each parsed var is bound to it so computed-unit
     * resolution can read the live box. Pure otherwise.
     */
    parse(targets: HTMLElement[]) {
        this.frames = [];

        // DM-22 named-selector resolution — BUILT (Q.WD1-bind S2), not deferred.
        // A scroll-range named selector (`entry`/`exit`/`cover`/`contain`) is
        // stored opaquely as `ValueUnit(rawSelector, undefined,
        // [NAMED_SELECTOR_SUPERTYPE])` (`.value` = raw STRING) so it INGESTS and
        // round-trips VERBATIM (the L.W1 S4 floor — `fromString` must not throw).
        // The correct cure is NOT a throw at parse() (that poisons the opaque-
        // ingest floor): the deferred-resolution step LIVES at attach time in
        // `CSSKeyframesAnimation.bindTimeline`, which maps each named phase to a
        // numeric `%` `ValueUnit` (via `namedSelectorToFraction`), CLEARS the
        // `NAMED_SELECTOR_SUPERTYPE` tag, and re-compiles — so a frame SAMPLED after
        // `bindTimeline` yields finite times, never NaN (locked by
        // `test/engine/nan-frame.test.ts` "after bindTimeline … finite"). The
        // play-time guard (`assertNoUnresolvedNamedSelector`) is belt-and-braces:
        // it refuses a raw `interpFrames`/`play()` on an UNBOUND named animation
        // with the typed `NAMED_SELECTOR_NO_TIMELINE` (no timeline = user error,
        // surfaced fail-explicit at play) rather than producing a NaN frame — the
        // accepted terminal contract for the sample-before-bind path. `parse()`
        // itself stays opaque-tolerant: it neither throws nor resolves (bind owns
        // resolution); named starts simply carry their raw string until bound.
        this.templateFrames.sort((a, b) => a.start.value - b.start.value);

        this.parsedVars = this.templateFrames.map((frame) => {
            const parsed = parseAndFlattenObject(
                frame.vars as Record<string, unknown>,
            );

            Object.values(parsed).forEach((values) => {
                values.setTargets(targets);
            });

            return parsed;
        });

        for (let i = 0; i < this.templateFrames.length - 1; i++) {
            this.frames.push(this.createFrame(i, i + 1));
        }

        // Perform variable reconciliation using pre-built index for O(1) lookups
        const varIndex = this.buildVarIndex();
        this.frames.forEach((_, ix) => this.reconcileVars(ix, varIndex));

        // Sort frames by start time, then by stop time
        this.frames.sort((a, b) => {
            if (a.time.start === b.time.start) {
                return a.time.stop - b.time.stop;
            }
            return a.time.start - b.time.start;
        });

        // Filter out frames that have no interpolated variables
        this.frames = this.frames.filter(
            (frame) =>
                frame.interpVars != null &&
                Object.keys(frame.interpVars).length > 0,
        );

        // Set the vars for each frame and pre-flatten interpVars for hot-path iteration
        this.frames.forEach((frame) => this.finalizeFrameVars(frame));
    }

    /**
     * Derive a frame's `flatVars`/`vars`/`allInterpVars` from its
     * `interpVars` — the pre-flattened forms the hot path
     * (`interpFrames`) iterates without re-walking. Called once per frame
     * at the tail of `parse`, and again by `renormalizeColors` after a
     * color-space change re-derives the interp carriers in place.
     */
    private finalizeFrameVars(frame: AnimationFrame<V>): void {
        const flatVars = Object.entries(frame.interpVars).reduce<
            Record<string, ValueUnit[]>
        >((acc, [key, value]) => {
            acc[key] = value.map((v) => v.value);
            return acc;
        }, {});
        frame.flatVars = flatVars as unknown as V;
        frame.vars = unflattenObject(frame.flatVars);
        // T.A6 — invalidate the PLAIN authored-shape projection (rebuilt lazily
        // on the next apply). Its writers cache the interp-carrier `ValueUnit`
        // refs, which `renormalizeColors` replaces, so a re-finalize MUST drop it.
        frame._plainProj = undefined;
        // Pre-flatten for zero-alloc iteration in interpFrames()
        frame.allInterpVars = Object.values(frame.interpVars).flat();
        // Q.WB3 S2 — build the numeric SoA fold plan over the now-stable iv set
        // (the same seam allInterpVars is built). Re-run by renormalizeColors so
        // a color-space change keeps the plan in lock-step with the carriers.
        frame._numericPlan = buildNumericPlan<V>(frame.allInterpVars);
    }

    /**
     * Re-derive the color-resolved interpolation carriers in place after a
     * `colorSpace`/`hueMethod` change on already-compiled frames. Only the
     * per-`InterpolatedVar` color resolution depends on the color space —
     * the flatten/sort/reconcile structure does not — so this re-runs
     * `createInterpVarValue` over the existing `frames`/`parsedVars` and
     * rebuilds the hot-path arrays, with NO re-flatten and NO re-sort. The
     * new carriers derive from the already-target-bound `parsedVars`, the
     * same provenance `parse` gives them, so DOM binding is preserved.
     *
     * The owning `Animation`'s `setColorSpace`/`setHueMethod` call this when
     * frames already exist; before `parse`, the option is simply read by the
     * next compile.
     */
    renormalizeColors(): void {
        for (const frame of this.frames) {
            for (const v of Object.keys(frame.interpVars)) {
                frame.interpVars[v] = createInterpVarValue(
                    v,
                    frame.ixs.start,
                    frame.ixs.stop,
                    this.parsedVars,
                    this.options.colorSpace,
                    this.options.hueMethod,
                ) as AnimationFrame<V>["interpVars"][string];
            }
            this.finalizeFrameVars(frame);
        }
    }
}
