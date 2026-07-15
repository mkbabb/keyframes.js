/**
 * `engine/interpolate.ts` — the interpolation HOT PATH, lifted off the
 * `KeyframesAnimation` god-object (R.W2 — lib-engine "Concern C"). The per-frame
 * lerp + apply core: `interpFrames` (the binary-search active-frame fold called
 * once per rAF frame), `processFrame` (the per-active-frame lerp + composition +
 * transform), `clearBuffer` (the V8-correct stable-key null-fill), and
 * `applyComposition` (the `animation-composition` honoring seam). Extracted as
 * free functions over the concrete animation — the SAME DI pattern `./playback`
 * uses — so the class keeps a thin `interpFrames`/`at` sampling delegate while
 * its body stays under the decomposition ceiling.
 *
 * The `this`-bound re-derive contract is byte-preserved: the functions read the
 * animation's `frames`/`reversed`/`options`/`unflatten`/`iteration`/`targets`/
 * `diagnostics` and the internal `_stableKeys`/`_hasComposition`/composition
 * caches DIRECTLY — there is no copy, no per-frame closure (`processFrame` is a
 * module function, not a per-call lambda), so the steady-state path mints
 * nothing per frame (proof:standalone-zero-alloc / proof:interp-fastprops /
 * proof:processframe-soa are the discriminating-bite oracles).
 */
import { clamp, lerpArray, scale } from "@mkbabb/value.js/math";
import { type ValueUnit } from "@mkbabb/value.js/units";
import { lerpValue } from "@mkbabb/value.js";
import { binarySearchRange } from "../internal/binarySearch";
import { AnimationOptionError } from "../internal/errors";
import { applyComposition as applyCompositionImpl } from "./composition";
import {
    buildPlainProjection,
    refreshPlainProjection,
} from "../compile/plain-vars";
import { NAMED_SELECTOR_SUPERTYPE } from "../compile/selector";
import type { AnimationFrame, Vars } from "../constants";
import type { KeyframesAnimation } from "./animation";

/**
 * Where the playhead rests after a completed play — derived ONCE from `fillMode`
 * (forwards/both → final; none/backwards → initial). The explicit rest-position
 * contract: completion paints the rest frame per this derivation, and the
 * reduced-motion snap is "rest = final, paint it, settle".
 */
export function restPosition<V extends Vars>(
    anim: KeyframesAnimation<V>,
): "initial" | "final" {
    return anim.options.fillMode === "forwards" ||
        anim.options.fillMode === "both"
        ? "final"
        : "initial";
}

/** Paint the rest frame per the fill contract. */
export function paintRest<V extends Vars>(anim: KeyframesAnimation<V>): void {
    if (restPosition(anim) === "final") {
        interpFrames(anim, anim.options.duration, true);
    } else {
        interpFrames(anim, 0, true);
    }
}

/**
 * Q.WD1 S3 (DM-22) — the named-selector PLAY-TIME guard. A scroll-range named
 * selector (`entry`/`exit`/`cover`/`contain`) ingests + round-trips opaquely
 * (the L.W1 S4 floor — `fromString`/`parse()` NEVER throw); it is RESOLVABLE to a
 * numeric `%` only under a `ScrollTimeline`/`ManualTimeline` via `bindTimeline`.
 * If a numeric position is genuinely DEMANDED (`play()`/`at()`) while a template
 * frame still carries `NAMED_SELECTOR_SUPERTYPE` (unresolved), refuse with the
 * TYPED `NAMED_SELECTOR_NO_TIMELINE` rather than silently producing NaN frames
 * that `binarySearchRange` treats as ALWAYS-ACTIVE. Fired ONLY at the genuinely-
 * demanded point — NEVER at parse/ingest. A resolved frame (tag CLEARED by
 * `bindTimeline`) passes silently — a zero-cost `Array.find` on a non-named
 * animation.
 */
export function assertNoUnresolvedNamedSelector<V extends Vars>(
    anim: KeyframesAnimation<V>,
): void {
    const unresolved = anim.compiler.templateFrames.find((f) =>
        f.start.superType?.includes(NAMED_SELECTOR_SUPERTYPE),
    );
    if (unresolved != null) {
        const raw = String(unresolved.start.value);
        throw new AnimationOptionError(
            "start",
            raw,
            `named scroll-range selector ("${raw}") requires a ScrollTimeline ` +
                `or ManualTimeline — call bindTimeline(timeline) before play() ` +
                `to resolve the named phase to a numeric position`,
            "NAMED_SELECTOR_NO_TIMELINE",
        );
    }
}

/**
 * Stateless progress query. Maps [0,1] from first keyframe to last, regardless
 * of playback direction. `apply=true` invokes transform callbacks.
 */
export function at<V extends Vars>(
    anim: KeyframesAnimation<V>,
    progress: number,
    apply: boolean = false,
): Record<string, ValueUnit[]> {
    // Q.WD1 S3 — the oracle path shares the named-selector guard (an unresolved
    // named-selector animation would otherwise produce NaN here too).
    assertNoUnresolvedNamedSelector(anim);
    const saved = anim._playback.reversed;
    anim._playback.reversed = false;
    const t = clamp(progress, 0, 1) * anim.options.duration;
    const result = interpFrames(anim, t, apply);
    anim._playback.reversed = saved;
    return result;
}

/**
 * Interpolate all active frames at time `t`. This is the hot path — called once
 * per rAF frame during playback.
 *
 * Uses binary search (O(log N)) to find the first matching frame, then scans
 * neighbors to collect all overlapping frames at `t` (multiple properties may
 * share the same time range).
 *
 * @param anim - the animation whose frames are sampled.
 * @param t - Current animation time in milliseconds.
 * @param transformFrames - If true, applies each frame's transform to targets.
 * @param out - Optional output object to write results into. When provided, its
 *   keys are cleared first so no stale keys from a previous call leak through.
 *   Pass this per-animation to achieve zero-allocation steady-state playback.
 * @returns Merged flat vars from all active frames.
 */
export function interpFrames<V extends Vars>(
    anim: KeyframesAnimation<V>,
    t: number,
    transformFrames: boolean = false,
    out?: Record<string, ValueUnit[]>,
): Record<string, ValueUnit[]> {
    t = anim._playback.reversed ? anim.options.duration - t : t;

    const frames = anim.frames;
    const len = frames.length;

    // Binary search for the first frame containing t
    const seedIdx = binarySearchRange(
        frames,
        t,
        (f) => f.time.start,
        (f) => f.time.stop,
    );

    // No active frame: an explicit (reused) buffer is cleared in place via
    // the stable-key null-fill so it never carries a stale key; a fresh
    // caller (no buffer) gets a new empty object. F.W4 S1: NO `delete` — the
    // delete-loop trapped the reused buffer in V8 dictionary mode for the
    // animation's lifetime (`%HasFastProperties === false`, 3.8–6.2× slower).
    if (seedIdx === -1) {
        if (out === undefined) return {};
        clearBuffer(anim, out);
        return out;
    }

    // Frames are sorted by (time.start, time.stop), so the frames active at
    // `t` are a contiguous run around the seed. Find its bounds without
    // allocating; `processFrame` is a module function (not a per-call closure)
    // so the steady-state play path mints nothing per frame (D-RT-1).
    let lo = seedIdx;
    let hi = seedIdx;
    for (let i = seedIdx - 1; i >= 0; i--) {
        const f = frames[i]!;
        if (t < f.time.start || t > f.time.stop) break;
        lo = i;
    }
    for (let i = seedIdx + 1; i < len; i++) {
        const f = frames[i]!;
        if (t < f.time.start || t > f.time.stop) break;
        hi = i;
    }

    // Lerp (and optionally apply) every active frame in place. The leaves of
    // each frame's `flatVars` ARE the `ValueUnit`s just mutated here
    // (`frame-compiler.ts` `acc[key] = value.map((v) => v.value)`).
    for (let i = lo; i <= hi; i++) {
        processFrame(anim, frames[i]!, t, transformFrames);
    }

    // F.W4 S3 — the single-active-frame alias fast-path. The dominant shape
    // (2-stop `fromString`, every preset, every single-property animation)
    // has exactly one active frame, and that frame's `flatVars` already holds
    // the freshly-lerped units — so a fresh caller (no `out` buffer) gets it
    // returned DIRECTLY, with no clear and no copy. The aliasing-correctness
    // clause: a caller that passes its OWN buffer (the AnimationGroup's
    // `entry.values`, the play loop's `_interpOut`) takes the buffer path
    // below and NEVER the alias, so no consumer mutates a shared frame object
    // expecting a private copy.
    if (lo === hi) {
        const fv = frames[seedIdx]!.flatVars as unknown as Record<
            string,
            ValueUnit[]
        >;
        if (out === undefined) return fv;
        clearBuffer(anim, out);
        Object.assign(out, fv);
        return out;
    }

    // ≥2 active frames (properties with distinct stop sets). Merge into the
    // stable-key buffer (a reused `out` is null-filled first, NOT delete-
    // poisoned; a fresh caller gets a new object whose keys are exactly the
    // active union). Object.assign into a fast-properties receiver stays at
    // fixed-offset speed.
    const result = out ?? {};
    if (out !== undefined) clearBuffer(anim, out);
    for (let i = lo; i <= hi; i++) {
        Object.assign(result, frames[i]!.flatVars);
    }
    return result;
}

/**
 * Clear a reused interpolation buffer to a stale-free state WITHOUT `delete` —
 * the V8-correct stable-key null-fill (F.W4 S1). The key-set is compile-stable
 * (`_stableKeys` is the union of every frame's `flatVars` keys, fixed at
 * `parse`), so null-filling it keeps the buffer in fast-properties mode AND
 * zero-alloc. Inactive keys read back `undefined`; every consumer of a reused
 * buffer (the group blend, the unused play-loop `_interpOut`) skips them — only
 * the standalone return path (which never reuses a buffer) must be
 * `undefined`-free, and it takes the alias / fresh merge above.
 */
function clearBuffer<V extends Vars>(
    anim: KeyframesAnimation<V>,
    buf: Record<string, ValueUnit[]>,
): void {
    const keys = anim._stableKeys;
    for (let i = 0; i < keys.length; i++) {
        buf[keys[i]!] = undefined as unknown as ValueUnit[];
    }
}

/**
 * Interpolate ONE active frame at time `t` in place (lerp + optional transform).
 * Lifted off the `interpFrames` hot loop so playback allocates no per-frame
 * closure. A zero-width frame (`start === stop`, a degenerate keyframe pair)
 * snaps to the endpoint instead of dividing by zero in `scale` (E-RT-5). The
 * merge into the result buffer is done by the caller (F.W4 S3 — so the
 * single-frame path can alias `flatVars` with no copy).
 */
function processFrame<V extends Vars>(
    anim: KeyframesAnimation<V>,
    frame: AnimationFrame<V>,
    t: number,
    transformFrames: boolean,
): void {
    const { start, stop } = frame.time;
    const scaled = start === stop ? 1 : scale(t, start, stop, 0, 1);
    const eased = frame.timingFunction.fn(scaled);

    // Q.WB3 S2 — the numeric SoA fold (ADOPT-verdicted; the interp-equal +
    // fold-taken oracles live in `test/engine/processframe-soa-identity.test.ts`,
    // the ADOPT floor in `bench/taxonomy.json`'s budgeted K=8 SoA-lerpArray row).
    // The pure-numeric iv subset folds through ONE contiguous
    // `lerpArray` over the precomputed `Float64Array` endpoint buffers (built
    // ONCE at `parse` — `frame._numericPlan`), replacing the per-channel boxed
    // `lerpValue` megamorphic dispatch on the DOMINANT single-animation path.
    // The result strides back into each numeric leaf's `value.value` slot (the
    // SAME slot `lerpValue` wrote), so the apply/composition/transform below —
    // which read the now-folded `flatVars`/`vars` — run EXACTLY as before
    // (bit-identical; the interp-equal oracle is in
    // `test/engine/processframe-soa-identity.test.ts`). The BOXED residual
    // (color/computed/mixed) keeps the per-element `lerpValue`, UNCHANGED.
    const plan = frame._numericPlan;
    if (plan !== undefined && plan.numeric.length > 0) {
        const { numeric, from, to, out } = plan;
        lerpArray(from, to, eased, out);
        for (let s = 0; s < numeric.length; s++) {
            (numeric[s]!.value as unknown as { value: number }).value = out[s]!;
        }
        for (const iv of plan.boxed) {
            lerpValue(eased, iv);
        }
    } else {
        for (const iv of frame.allInterpVars) {
            lerpValue(eased, iv);
        }
    }

    // K.W7 S1 — HONOR `animation-composition` on the rAF APPLY path (the
    // `add`/`accumulate` composite of the lerped leaf onto the captured base;
    // see `./composition`). GATED on `transformFrames`: only the rAF apply (the
    // engine-write channel) composites — a `false` sample (the WAAPI keyframe
    // build, the group blend, a `.at()` query) keeps the RAW lerped effect,
    // because the WAAPI compositor adds the base ITSELF (S2, the `composite`
    // keyword); compositing here too would DOUBLE-count, so the rAF↔WAAPI parity
    // holds precisely because this path is rAF-only. A pure-`replace` animation
    // skips the branch (the `_hasComposition` const).
    if (transformFrames && anim._hasComposition && frame.composition != null) {
        applyComposition(anim, frame);
    }

    if (transformFrames) {
        if (anim.unflatten) {
            // T.A6 — a custom transform ("animate any object") consumes the
            // nested PLAIN authored-shape projection (numbers where authored
            // numbers, strings where a unit/color demands) — NOT `frame.vars`,
            // whose leaves are array-boxed `ValueUnit`s under value.js ≥ 2.0.1.
            // Built lazily on first apply, refreshed in place by the SAME interp
            // stride that filled `value.value` above (hot numeric path
            // zero-alloc). The DOM-style default renderer keeps the flat path.
            let proj = frame._plainProj;
            if (proj === undefined) {
                proj = buildPlainProjection(
                    frame.flatVars as unknown as Record<string, ValueUnit[]>,
                );
                frame._plainProj = proj;
                frame.plainVars = proj.root as V;
            } else {
                refreshPlainProjection(proj);
            }
            frame.transform(frame.plainVars as V, t);
        } else {
            frame.transform(frame.flatVars, t);
        }
    }
}

/**
 * Composite ONE frame's lerped numeric leaves onto the captured underlying base
 * per its `animation-composition` operator (K.W7 S1) — the thin engine seam
 * threading the live per-run state into the pure `./composition` honoring (where
 * the un-clamped add, repeat-aware accumulate, captured base, and non-numeric
 * `replace`-fallback + `COMPOSITION_FALLBACK` row live).
 */
function applyComposition<V extends Vars>(
    anim: KeyframesAnimation<V>,
    frame: AnimationFrame<V>,
): void {
    applyCompositionImpl(frame, {
        iteration: anim._playback.iteration,
        target: anim.targets[0],
        compositionBase: anim._compositionBase,
        compositionPose: anim._compositionPose,
        compositionFallbackSeen: anim._compositionFallbackSeen,
        diagnostics: anim.diagnostics,
    });
}
