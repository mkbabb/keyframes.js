/**
 * group-layer-springs — the K.W11 PHYS-C spring-driven blend-weight helpers,
 * lifted off `AnimationGroup` as pure functions (INTERNAL — NOT a barrel
 * export). The flagship physics: a `SpringProgress` (any `WeightStepper`)
 * DRIVES a layer's `weighted`-blend weight instead of a constant, so a
 * crossfade follows a PHYSICAL trajectory that can overshoot 1.0 and settle —
 * only possible on kf's weighted-blend substrate.
 *
 * Cohesion: the construction + entry-resolution the K.W11 transition API
 * (`transitionLayer`/`crossfade`/`advanceLayerSprings`) leans on, extracted
 * whole off the compositor so `group.ts` holds its core composite seam (the
 * `_grouped` buffer machinery, the element-wise blend leaf, the managed-child
 * lifecycle) under its base ceiling. The gate-anchored spring STATEMENTS — the
 * `?? layer.weight` read, `layer.weightSpring = spring`, `existing.target = …`,
 * the per-frame `spring.tickDt(dt)`, the settle commit/clear — stay INLINE in
 * `group.ts`'s thin method bodies (proof:spring-blend-weight locks them THERE,
 * as the composite contract); this module carries the spring CONSTRUCTION + the
 * shared name↔reference lookup those statements glue, plus the documented
 * algorithm.
 *
 * Zero-alloc discipline: NEITHER helper allocates per FRAME. `seedLayerSpring`
 * runs once per `transitionLayer` call (a user gesture, not a frame) and is the
 * ONLY allocation in the whole spring path; `requireEntry`/`resolveEntryKey`
 * run on the same gesture path. The per-frame advance (`advanceLayerSprings`,
 * gated behind `_hasLayerSprings`) stays in `group.ts` and calls NOTHING here —
 * the constant-weight blend hot path never reaches this module, so the
 * zero-alloc constant path is byte-unchanged (proof:zero-alloc green).
 *
 * value.js note: `SpringProgress` is LIGHT (value.js-free), so importing it
 * here adds no boundary edge — `group.ts` is HEAVY regardless.
 *
 * Also colocated (the cohesive blocks lifted alongside to clear the base
 * ceiling — see proof:decomposition): the entry-set → grouped-key UNION
 * (`computeGroupedKeys`, a per-setup pure fold) and the scheduler-yield BATCHED
 * advance (`advanceSlice`/`advanceBatched`, the children-per-slice fan-out
 * `AnimationGroup.advanceTo` drives). Each is a pure function of the entries the
 * group passes in — no `AnimationGroup` `this`, no per-frame closure: the sync
 * `advanceSlice` returns `undefined` when every child steps synchronously
 * (the J.W6 S1 zero-microtask fast path), allocating nothing.
 */
import { SpringProgress, type SpringProgressOptions } from "./spring";
import { getAnimationId } from "./engine";
import { yieldToMain } from "./internal/scheduler";
import type { KeyframesAnimation } from "./engine";
import type { AnimationGroupEntry, AnimationGroupObject } from "./group";

/**
 * Options for `AnimationGroup.transitionLayer` / `crossfade` (K.W11 PHYS-C).
 * The `spring` half is the {@link SpringProgressOptions} subset that shapes the
 * weight trajectory (`response`/`dampingFraction`/`bounce`-via-config); the
 * spring is ALWAYS seeded at the layer's CURRENT weight and targets the new
 * weight, so `initial`/`initialVelocity` are managed internally and excluded.
 */
export type LayerTransitionSpring = Partial<
    Omit<SpringProgressOptions, "initial" | "initialVelocity">
>;

/**
 * Resolve a name-or-Animation to its registration key — the string IS the key;
 * an `Animation` reference resolves through `getAnimationId`. The ONE place the
 * group's name↔reference duality is decided (shared by `setChildTime`,
 * `setLayerConfig`, `getLayerConfig`, and the K.W11 transition API).
 */
export const resolveEntryKey = <V extends Record<string, unknown>>(
    nameOrAnim: string | KeyframesAnimation<V>,
): string =>
    typeof nameOrAnim === "string" ? nameOrAnim : getAnimationId(nameOrAnim);

/**
 * Look an entry up by name/reference, throwing the SHARED fail-explicit "no
 * animation registered" error every layer method raises (silent no-ops were
 * hiding consumer bugs). `method` names the caller in the message. The lookup
 * the transition API + `setLayerConfig`/`setChildTime`/`getLayerConfig` route
 * through, so the error text is authored ONCE here (DRY).
 */
export const requireEntry = <V extends Record<string, unknown>>(
    animations: AnimationGroupObject<V>,
    nameOrAnim: string | KeyframesAnimation<V>,
    method: string,
): AnimationGroupEntry<V> => {
    const key = resolveEntryKey(nameOrAnim);
    const entry = animations[key];
    if (!entry) {
        throw new Error(
            `AnimationGroup.${method}: no animation registered for key "${key}". Known keys: ${Object.keys(animations).join(", ") || "(none)"}.`,
        );
    }
    return entry;
};

/**
 * Seed a FRESH `SpringProgress` for a layer transition (K.W11 PHYS-C). The
 * spring starts at the layer's CURRENT weight (the value the blend was reading)
 * and targets the new weight, so the crossfade is velocity-continuous from
 * rest. With an UNDER-damped spring the weight momentarily blends PAST the
 * target (the canonical iOS "snap into place" for a whole animation layer)
 * before settling — a PHYSICAL trajectory, NOT a hard cut.
 *
 * Returns the constructed spring; the caller parks it on `layer.weightSpring`
 * (the gate-anchored assignment stays in `group.ts`). Re-targeting mid-flight
 * RE-SEATS the EXISTING spring from its live `(value, velocity)` via `set
 * target` — that re-seat path does NOT come here (no new spring); only the
 * first transition of a static-weight layer seeds.
 *
 * Allocates exactly one `SpringProgress` per CALL — a user gesture
 * (`transitionLayer`/`crossfade`), never a frame.
 */
export const seedLayerSpring = (
    currentWeight: number,
    targetWeight: number,
    springOpts: LayerTransitionSpring | undefined,
): SpringProgress => {
    const spring = new SpringProgress({
        ...springOpts,
        initial: currentWeight,
    });
    spring.target = targetWeight;
    return spring;
};

/**
 * Compute the compile-stable UNION of every child's contributed
 * (whitelist-filtered) keys — what the compositor's `_grouped` buffer is
 * null-filled to each frame so the composite is cleared WITHOUT `delete` (F.W4
 * S2: the delete-loop trapped `_grouped` in V8 dictionary mode). A pure fold
 * over the already-sorted entries; the group recomputes it only when the entry
 * set / a layer whitelist changes (not per frame), so it never touches the hot
 * path. Children are parsed (their `flatKeys` populated) before the first
 * composite — the group blends only during play, after child setup.
 */
export const computeGroupedKeys = <V extends Record<string, unknown>>(
    entries: AnimationGroupEntry<V>[],
): string[] => {
    const seen = new Set<string>();
    for (const entry of entries) {
        const whitelist = entry.layer.properties;
        for (const key of entry.animation.flatKeys) {
            if (whitelist && !whitelist.has(key)) continue;
            seen.add(key);
        }
    }
    return [...seen];
};

/**
 * Advance one slice of children to absolute clock `t` — the J.W6 S1 sync fast
 * path. Returns `undefined` IFF every child stepped SYNCHRONOUSLY (a plain
 * number from `Animation.advanceTo`); only a genuinely-async child (a thenable)
 * promotes the slice to a `Promise<void>`. The sync return allocates nothing —
 * no `promises` array is created unless an async child needs one — so the
 * steady per-frame composite path is zero-microtask, zero-alloc.
 *
 * A paused child with a recorded `pausedTime` is skipped (it holds its frame);
 * mirrors the former private `_advanceSlice` exactly.
 */
export const advanceSlice = <V extends Record<string, unknown>>(
    slice: AnimationGroupEntry<V>[],
    t: number,
): Promise<void> | undefined => {
    let promises: Promise<number>[] | undefined;
    for (const entry of slice) {
        const anim = entry.animation;
        if (anim.paused && anim.pausedTime !== 0) continue;
        const stepped = anim.advanceTo(t);
        if (typeof stepped !== "number") (promises ??= []).push(stepped);
    }
    return promises && Promise.all(promises).then(() => undefined);
};

/**
 * Batched advance — for a group larger than `YIELD_BATCH`, advance children in
 * slices and `await yieldToMain()` between them so a big per-frame composite
 * doesn't run as one long task (INP relief). Always async (the over-batch path
 * is never the zero-alloc hot path — a group with > 32 children is the rare
 * case). Mirrors the former private `_advanceBatched`.
 */
export const advanceBatched = async <V extends Record<string, unknown>>(
    entries: AnimationGroupEntry<V>[],
    t: number,
    batch: number,
): Promise<void> => {
    for (let i = 0; i < entries.length; i += batch) {
        await advanceSlice(entries.slice(i, i + batch), t);
        if (i + batch < entries.length) await yieldToMain();
    }
};

/**
 * Apply each child's interpolated vars DIRECTLY to its own target(s) at the
 * child's current `t` (the MULTI-target render path — no group composite). The
 * group's single-target path goes through `transformFramesGrouped` instead.
 * Returns whether EVERY child is done (the multi-target completion test the
 * draw loop reads); the caller stores it on `this.done`. A pure fold over the
 * entries — no `AnimationGroup` `this`, no per-frame allocation.
 */
export const renderMultiTarget = <V extends Record<string, unknown>>(
    entries: AnimationGroupEntry<V>[],
): boolean => {
    let allDone = true;
    for (const entry of entries) {
        entry.animation.interpFrames(entry.animation.t, true);
        allDone = allDone && entry.animation.done;
    }
    return allDone;
};

/**
 * Snap every child to its FINAL frame and apply it to the target(s) — the
 * `prefers-reduced-motion` rest = final path (mirrors `Animation`'s PRM snap).
 * Marks each child started, sets its clock to the full duration, and paints the
 * final frame; the caller then composites (single-target) and settles. A pure
 * fold over the entries — the motion is elided, the rest frame stays painted.
 */
export const snapChildrenToFinal = <V extends Record<string, unknown>>(
    entries: AnimationGroupEntry<V>[],
): void => {
    for (const entry of entries) {
        const anim = entry.animation;
        anim.started = true;
        anim.t = anim.options.duration;
        anim.interpFrames(anim.t, true);
    }
};

/**
 * Broadcast a paused flag to every child DIRECTLY (never `child.pause()`/
 * `child.resume()`, which would touch each child's own rAF loop) — the group's
 * draw loop owns the ticking. The shared child-flag write the group's `resume`/
 * `forcePause`/`forcePlay` route through. Pure, allocation-free.
 */
export const setChildrenPaused = <V extends Record<string, unknown>>(
    entries: AnimationGroupEntry<V>[],
    paused: boolean,
): void => {
    for (const entry of entries) entry.animation.paused = paused;
};
