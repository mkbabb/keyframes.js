import { markRaw } from "vue";

import { kfEngine } from "@kf-engine";
import { springTimingFunction } from "@mkbabb/keyframes.js";
import { SPRING_SCENE_ID } from "./springKeys";

/**
 * The Sweep channel's animation — a REAL `CSSKeyframesAnimation` seeded from the
 * spring curve at the current params (`useSpringDemo` owns the live physics and
 * the transport; this unit owns the Sweep channel's keyframes).
 *
 * X.KF.W13V.s (OA-37/46/51): the spring scene has NO inline keyframes editor.
 * These keyframes are edited where every scene's are — the shared Keyframes
 * pane, opened from the dock's Keyframes item on the Sweep channel. Seeded once;
 * after that the pane is authoritative (a typed edit persists and is never
 * overwritten by a later slider/preset interaction). `seedKeyframes()` re-seeds
 * ONLY on the Physics facet's explicit "write to keyframes" action.
 *
 * @param response         getter for the live spring response (s)
 * @param dampingFraction  getter for the live damping fraction ζ
 * @param duration         the animation's clock (the sampler duration)
 */
export function useSpringSweepAnimation(
    response: () => number,
    dampingFraction: () => number,
    duration: number,
) {
    // HEAVY constructor from the warmed engine (kfEngine(), L.W8 S1 dogfood
    // inversion) — synchronous, since the warm resolves before any scene mounts.
    const { CSSKeyframesAnimation } = kfEngine();

    /** Build the spring's `@keyframes` block sampled from the live params — the
     *  Sweep channel's seed (springTimingFunction → displacement). */
    const buildSpringKeyframesCSS = (): string => {
        const easing = springTimingFunction({
            response: response(),
            dampingFraction: dampingFraction(),
        });
        const stops = [0, 0.25, 0.5, 0.75, 1];
        const rows = stops.map((t) => {
            const v = easing.fn(t);
            const pct = Math.round(t * 100);
            return `    ${pct}% { transform: translateX(${(v * 100).toFixed(2)}%); }`;
        });
        return `@keyframes spring {\n${rows.join("\n")}\n}`;
    };

    const springEditAnim = markRaw(
        new CSSKeyframesAnimation({
            duration,
            iterationCount: "infinite",
            direction: "alternate",
            timingFunction: "linear",
        }).fromString(buildSpringKeyframesCSS()),
    );
    springEditAnim.name = "Spring Keyframes";
    springEditAnim.superKey = SPRING_SCENE_ID;

    /** Explicit re-seed of the Sweep keyframes from the current spring params
     *  (the Physics facet's action — NOT a reactive overwrite). After this the
     *  shared Keyframes pane is authoritative again until the next re-seed. */
    const seedKeyframes = (): void => {
        springEditAnim.fromString(buildSpringKeyframesCSS());
        springEditAnim.parse();
    };

    return { springEditAnim, seedKeyframes };
}
