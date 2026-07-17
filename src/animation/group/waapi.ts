/**
 * Group WAAPI lowering (U.C16 / OD-U14 T4b).
 *
 * This module owns the conservative group-level gate and the native lowering
 * primitive. Weight-driven layers, springs, disabled layers, mixed targets, and
 * any child refused by the ordinary WAAPI predicate stay on the rAF
 * compositor; a missed optimization is preferable to a split-brain render.
 */
import type { KeyframesAnimation } from "../engine";
import type { Vars } from "../constants";
import { isWAAPIEligible } from "../waapi/eligibility";
import { toWAAPIKeyframes } from "../waapi/emission";
import { toWAAPIOptions } from "../waapi/options";
import type { AnimationGroup } from "./group";
import type { AnimationGroupEntry } from "./types";
import { isWeightBlend } from "./weight";

export type GroupWAAPIEligibility =
    | { eligible: true; target: HTMLElement; entries: AnimationGroupEntry<any>[] }
    | { eligible: false; reason: string };

/**
 * Admit only a single-target, all-eligible additive/replace stack.  Native
 * WAAPI has no equivalent for the engine's layer-weight spring axis, property
 * masks, or disabled layers, so those remain on the always-correct rAF path.
 */
export function isGroupWAAPIEligible<V extends Vars>(
    group: AnimationGroup<V>,
): GroupWAAPIEligibility {
    const entries = group.getEntries();
    if (!group.singleTarget || entries.length === 0) {
        return { eligible: false, reason: "group requires one shared target" };
    }
    const target = entries[0]?.animation.targets[0];
    if (!target || typeof target.animate !== "function") {
        return { eligible: false, reason: "group target does not implement Element.animate()" };
    }
    for (const entry of entries) {
        if (!entry.layer.enabled) return { eligible: false, reason: "disabled layer stays on rAF" };
        if (entry.layer.properties) return { eligible: false, reason: "property-masked layer stays on rAF" };
        if (isWeightBlend(entry.layer) || entry.layer.weightSpring) {
            return { eligible: false, reason: "weight-driven layer has no native composite equivalent" };
        }
        if (entry.animation.targets[0] !== target) {
            return { eligible: false, reason: "group target identity mismatch" };
        }
        if (!entry.animation.options.useWAAPI) {
            return { eligible: false, reason: "child useWAAPI is disabled" };
        }
        const eligibility = isWAAPIEligible(entry.animation);
        if (!eligibility.eligible) return { eligible: false, reason: eligibility.reason };
    }
    return { eligible: true, target, entries };
}

/** Lower an admitted group to one native effect per layer. */
export function lowerGroupWAAPI<V extends Vars>(
    group: AnimationGroup<V>,
): globalThis.Animation[] | null {
    const verdict = isGroupWAAPIEligible(group);
    if (!verdict.eligible) return null;
    const handles: globalThis.Animation[] = [];
    try {
        for (const entry of verdict.entries) {
            const composite = entry.layer.op;
            handles.push(
                verdict.target.animate(toWAAPIKeyframes(entry.animation), {
                    ...toWAAPIOptions(entry.animation),
                    composite,
                }),
            );
        }
        return handles;
    } catch {
        // The feature probe can pass while a browser rejects a particular
        // composite/keyframe combination. Tear down any earlier effects and
        // keep the always-correct rAF compositor; this lane only trades a
        // native opportunity, never correctness.
        for (const animation of handles) {
            try {
                animation.cancel?.();
            } catch {
                /* KEEP: a partially-created effect may already be detached. */
            }
        }
        return null;
    }
}
