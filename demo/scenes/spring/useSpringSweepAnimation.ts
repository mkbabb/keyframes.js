import { markRaw } from "vue";

import { kfEngine } from "@kf-engine";
import { springTimingFunction } from "@mkbabb/keyframes.js";
import { SPRING_SCENE_ID } from "./springKeys";

/** The progress points the seed samples the spring at (one keyframe each). */
export const SEED_STOPS = [0, 0.25, 0.5, 0.75, 1] as const;

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
 * @param duration         one iteration = one sweep leg = the settle horizon the
 *                         trace labels (ESC-spring-1); `alternate` plays its mirror
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
        const rows = SEED_STOPS.map((t) => {
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

    const SPRING_KEYFRAMES_NAME = "spring";

    /** Explicit re-seed of the Sweep keyframes from the current spring params
     *  (the Physics facet's action — NOT a reactive overwrite). After this the
     *  shared Keyframes pane is authoritative again until the next re-seed.
     *
     *  owner-1112 [46] — the seed OVERWRITES whatever the Sweep keyframes held
     *  (a typed edit included), so it hands back its own undo: the keyframes as
     *  they stood, serialized through the library's own round-trip emitter
     *  before the overwrite, and re-parsed on undo. Resolves to the count of
     *  stops written (the facet's confirmation names it). */
    const seedKeyframes = async (): Promise<{ stops: number; undo: () => void }> => {
        const { CSSKeyframesToString } = kfEngine();
        const prior = await CSSKeyframesToString(springEditAnim, SPRING_KEYFRAMES_NAME);
        springEditAnim.fromString(buildSpringKeyframesCSS());
        springEditAnim.parse();
        return {
            stops: SEED_STOPS.length,
            undo: () => {
                springEditAnim.fromString(prior);
                springEditAnim.parse();
            },
        };
    };

    return { springEditAnim, seedKeyframes };
}
