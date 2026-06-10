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
import {
    parseCSSValueUnit,
    seekPreviousValue,
    unflattenObject,
    ValueUnit,
} from "@mkbabb/value.js";
import { cssTwinFor } from "./easing";
import { AnimationOptionError } from "./internal/errors";
import type {
    AnimationFrame,
    AnimationOptions,
    Easing,
    InputAnimationOptions,
    TemplateAnimationFrame,
    TransformFunction,
    Vars,
} from "./constants";
import { NOOP_TRANSFORM } from "./constants";
import {
    calcFrameTime,
    createInterpVarValue,
    getTimingFunction,
    parseAndFlattenObject,
    type ParsedVarMap,
} from "./utils";

/**
 * Resolve heavy-surface easing input — a callable, a typed `Easing`, a
 * registry name, or a `cubic-bezier()` literal — to a typed `Easing`.
 * Fail-explicit: unresolvable input throws; there is no silent fallback
 * to a default curve.
 */
export const resolveEasingOption = (
    option: string,
    input: NonNullable<InputAnimationOptions["timingFunction"]>,
): Easing => {
    if (typeof input === "function") return { fn: input };
    if (typeof input === "object") {
        if (typeof (input as Easing).fn === "function") {
            return input as Easing;
        }
        throw new AnimationOptionError(
            option,
            input,
            "an Easing must carry a callable `fn`",
        );
    }
    const fn = getTimingFunction(input);
    if (!fn) {
        // J.W1 S8 — the stable structured code rides the typed throw so a
        // programmatic consumer can branch on the reason (the K3-internal
        // row; the full diagnostics channel stays a K.W0 seed).
        throw new AnimationOptionError(
            option,
            input,
            "unknown timing function — pass a callable TimingFunction, a " +
                "typed Easing, a registry name, or a cubic-bezier() literal",
            "UNKNOWN_TIMING_FN",
        );
    }
    // Attach the faithful CSS twin when one exists (CSS keyword,
    // cubic-bezier()/steps() literal) so a WAAPI delegation runs the true
    // curve; value.js bespoke names (easeOutCubic, …) get none and stay on
    // the rAF path.
    const css = cssTwinFor(input);
    return css ? { fn, css } : { fn };
};

/**
 * Multiplier for the content-derived compiled `frameId` (FC-2): a segment's
 * id is `startIx * FRAME_ID_SCALE + stopIx`, unique + deterministic for any
 * keyframe count below the scale. 1e6 keyframes is far past any real animation.
 */
const FRAME_ID_SCALE = 1_000_000;

/**
 * The NAMED keyframe-selector grammar (J.W1 S3 — the SEAM-1 guard made
 * TOTAL). A selector is CONFORMING iff it is (a) a percentage literal
 * `<number>%` whose value lies in [0,100], or (b) the CSS keyframe keyword
 * `from`/`to` (case-insensitive, per CSS) — and NOTHING else. The boundary
 * is named so the guard is total, not a "looks-invalid" sniff that re-opens
 * the gap on the next unseen token.
 */
const SELECTOR_KEYWORD_RE = /^(?:from|to)$/i;
const SELECTOR_PERCENT_RE = /^(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?%$/;

const SELECTOR_REASON =
    "a keyframe selector must be a percentage 0%–100% " +
    "(e.g. \"0%\", \"50%\") or the keyword 'from'/'to'";

export class FrameCompiler<V extends Vars = any> {
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
    ): void {
        if (typeof start === "number") {
            start = String(start) + "%";
        } else if (typeof start === "string") {
            start = start;
        } else if (start instanceof ValueUnit) {
            start = String(start);
        }

        // Fail-explicit belt (H.W0 H-A2, made TOTAL in J.W1 S3 — SEAM-1).
        // The pre-J guard caught ONLY the blank selector; non-empty garbage
        // ("abc") still reached value.js and threw the cryptic, un-typed
        // `Parse error at offset 0: "…"`, while a length/time ("5px",
        // "500ms") or an out-of-range percent ("150%") was SILENTLY accepted
        // as a selector. The guard now validates against the NAMED conforming
        // grammar (percentage 0%–100% ∪ from/to — see SELECTOR_PERCENT_RE/
        // SELECTOR_KEYWORD_RE) BEFORE `parseCSSValueUnit`, so EVERY
        // non-conforming selector is a clear, typed `AnimationOptionError`.
        // The blank case carries the stable structured code "EMPTY_PARSE"
        // (J.W1 S8) so a programmatic consumer branches on the reason, never
        // on the message string.
        const selector = start.trim();
        if (selector === "") {
            throw new AnimationOptionError(
                "start",
                start,
                `${SELECTOR_REASON} — got an empty/blank string`,
                "EMPTY_PARSE",
            );
        }
        if (
            !SELECTOR_KEYWORD_RE.test(selector) &&
            !(SELECTOR_PERCENT_RE.test(selector) && parseFloat(selector) <= 100)
        ) {
            throw new AnimationOptionError(
                "start",
                start,
                `${SELECTOR_REASON} — got ${JSON.stringify(start)}`,
            );
        }

        // Guarded-total: the conforming set ("<n>%", "from", "to") is exactly
        // what value.js parses to a percentage ValueUnit — `from` → 0%,
        // `to` → 100% — so no post-parse conversion/clamp remains (the former
        // `convertFrameStart` time-selector branch died with the total guard:
        // a time is not a keyframe selector).
        const parsedStart = parseCSSValueUnit(selector);

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

        return {
            id,
            ixs,
            start: startFrame.start,
            time,
            vars: undefined as unknown as V,
            flatVars: undefined as unknown as V,
            interpVars: {},
            allInterpVars: [],
            transform,
            timingFunction,
        } as AnimationFrame<V>;
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
        // Pre-flatten for zero-alloc iteration in interpFrames()
        frame.allInterpVars = Object.values(frame.interpVars).flat();
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
