/**
 * `group/entries.ts` — the entry-set helpers `AnimationGroup` leans on (R.W2 —
 * lib-group: the `group-layer-springs.ts` junk-drawer 3-way split; these are the
 * NON-spring exports that the misnamed file colocated). Pure functions of the
 * entries the group passes in — no `AnimationGroup` `this`, no per-frame closure:
 *
 *   - `resolveEntryKey` / `requireEntry` — the name↔reference lookup (the ONE
 *     place the group's name-or-`Animation` duality is decided).
 *   - `computeGroupedKeys` — the per-setup grouped-key UNION fold.
 *   - `renderMultiTarget` — the multi-target render path.
 *   - `snapChildrenToFinal` — the reduced-motion rest = final snap.
 *   - `setChildrenPaused` — the broadcast pause-flag write.
 *
 * The spring helpers (`seedLayerSpring`/`advanceLayerSprings`) live in
 * `./springs`; the scheduler-yield batching (`advanceSlice`/`advanceBatched`) in
 * `./scheduler`.
 */
import { getAnimationId } from "../internal/animation-id";
import type { KeyframesAnimation } from "../engine";
import type { AnimationGroupEntry, AnimationGroupObject } from "./types";

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
        // Disabled layers are not contributors. Excluding their exclusive
        // keys from the stable union avoids allocating/clearing dead fields
        // and keeps the grouped object shape aligned with active stack data.
        if (!entry.layer.enabled) continue;
        const whitelist = entry.layer.properties;
        for (const key of entry.animation.flatKeys) {
            if (whitelist && !whitelist.has(key)) continue;
            seen.add(key);
        }
    }
    return [...seen];
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
 * draw loop owns the ticking. The shared child-flag write the group's `resume`
 * routes through. Pure, allocation-free.
 */
export const setChildrenPaused = <V extends Record<string, unknown>>(
    entries: AnimationGroupEntry<V>[],
    paused: boolean,
): void => {
    for (const entry of entries) entry.animation.paused = paused;
};
