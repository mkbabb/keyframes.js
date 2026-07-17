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
import { binarySearchRange } from "../internal/binary-search";
import { AnimationOptionError } from "../internal/errors";
import { applyComposition as applyCompositionImpl } from "./composition";
import type { CompiledAnimationFrame } from "../compile/compiled-frame";
import {
    bindInterpSlotTarget,
    interpolateSlot,
} from "../compile/interp-slot";
import {
    refreshAuthoredSink,
    type FlatAuthoredValues,
} from "../compile/value-ast";
import type { Vars } from "../constants";
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
 * frame still carries a `{ kind: "named" }` selector, refuse with the
 * TYPED `NAMED_SELECTOR_NO_TIMELINE` rather than silently producing NaN frames
 * that `binarySearchRange` treats as ALWAYS-ACTIVE. Fired ONLY at the genuinely-
 * demanded point — NEVER at parse/ingest. A resolved percent selector produced by
 * `bindTimeline` passes silently — a zero-cost `Array.find` on a non-named
 * animation.
 */
export function assertNoUnresolvedNamedSelector<V extends Vars>(
    anim: KeyframesAnimation<V>,
): void {
    const unresolved = anim.templateFrames.find(
        (frame) => frame.start.kind === "named",
    );
    if (unresolved != null) {
        const raw =
            unresolved.start.kind === "named"
                ? `${unresolved.start.name}${
                      unresolved.start.offset === undefined
                          ? ""
                          : ` ${unresolved.start.offset * 100}%`
                  }`
                : "";
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
): FlatAuthoredValues {
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
    out?: FlatAuthoredValues,
): FlatAuthoredValues {
    t = anim._playback.reversed ? anim.options.duration - t : t;

    const frames = anim.frames as CompiledAnimationFrame<V>[];
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

    // Interpolate (and optionally apply) every active frame in place. Each
    // frame's `flatVars` is the stable authored-value sink refreshed here.
    for (let i = lo; i <= hi; i++) {
        processFrame(anim, frames[i]!, t, transformFrames);
    }

    // F.W4 S3 — the single-active-frame alias fast-path. The dominant shape
    // (2-stop `fromString`, every preset, every single-property animation)
    // has exactly one active frame, and that frame's `flatVars` already holds
    // the freshly refreshed authored values — so a fresh caller (no `out` buffer)
    // gets it returned DIRECTLY, with no clear and no copy. The aliasing-correctness
    // clause: a caller that passes its OWN buffer (the AnimationGroup's
    // `entry.values`, the play loop's `_interpOut`) takes the buffer path
    // below and NEVER the alias, so no consumer mutates a shared frame object
    // expecting a private copy.
    if (lo === hi) {
        const fv = frames[seedIdx]!.flatVars;
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
    buf: FlatAuthoredValues,
): void {
    const keys = anim._stableKeys;
    for (let i = 0; i < keys.length; i++) {
        buf[keys[i]!] = undefined;
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
    frame: CompiledAnimationFrame<V>,
    t: number,
    transformFrames: boolean,
): void {
    const { start, stop } = frame.time;
    const scaled = start === stop ? 1 : scale(t, start, stop, 0, 1);
    const eased = frame.timingFunction.fn(scaled);
    const target = anim.targets[0];

    // Q.WB3 S2 — the numeric SoA fold (ADOPT-verdicted; the interp-equal +
    // fold-taken oracles live in `test/engine/processframe-soa-identity.test.ts`,
    // the ADOPT floor in `bench/taxonomy.json`'s budgeted K=8 SoA-lerpArray row).
    // The pure-numeric slot subset folds through one contiguous
    // `lerpArray` over the precomputed `Float64Array` endpoint buffers (built
    // once at parse time (`frame._numericPlan`), replacing per-slot dispatch on
    // the dominant single-animation path. The result writes each numeric slot's
    // `current` field, so the apply/composition/transform below —
    // which read the now-folded `flatVars`/`vars` — run EXACTLY as before
    // (bit-identical; the interp-equal oracle is in
    // `test/engine/processframe-soa-identity.test.ts`). Structural residual
    // slots keep their ordinary interpolation dispatch.
    const plan = frame._numericPlan;
    if (plan !== undefined && plan.numeric.length > 0) {
        const { numeric, from, to, out } = plan;
        lerpArray(from, to, eased, out);
        for (let s = 0; s < numeric.length; s++) {
            numeric[s]!.current = out[s]!;
        }
        for (const slot of plan.residual) {
            bindInterpSlotTarget(slot, target);
            interpolateSlot(slot, eased);
        }
    } else {
        for (const slot of frame.allInterpVars) {
            bindInterpSlotTarget(slot, target);
            interpolateSlot(slot, eased);
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
    refreshAuthoredSink(frame._sink);

    if (transformFrames) {
        if (anim.unflatten) {
            frame.transform(frame.vars, t);
        } else {
            frame.transform(frame.flatVars as V, t);
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
    frame: CompiledAnimationFrame<V>,
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
