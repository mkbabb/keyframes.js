import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";

import { springLinearStops } from "@src/animation/springLinearStops";

/**
 * The ONE spring → CSS `linear()` surface for the Spring scene (H.W5.S3).
 *
 * `springLinearStops(` was DOUBLE-surfaced in `demo/spring/` (WV-W5-HIGH-1:
 * exactly 2 call-sites — the live-solver rail at `SpringSidebar.vue:130` and the
 * discrete-transition view at `StartingStyleTarget.vue:95`; `SpringTarget` did
 * NOT call it). The Discrete→Spring co-location merge folds those into ONE view
 * tree, so the artifact emission folds 2→1 here: BOTH the rail's Monaco readout
 * AND the discrete card's `--spring-ease` / copy-paste artifact read this single
 * composable.
 *
 * [`springTimingFunction` is INTENTIONALLY 6×-surfaced and is NOT collapsed —
 * it is the typed `Easing` for the engine seams, a different shape than this CSS
 * `linear()` string, and not a DRY defect (WV-W5-HIGH-1).]
 *
 * @param response        spring angular period (seconds) — ref/getter/value
 * @param dampingFraction damping ratio ζ — ref/getter/value
 * @returns a computed `"linear(0, …, 1)"` string that re-samples on any change.
 */
export function useSpringLinearStops(
    response: MaybeRefOrGetter<number>,
    dampingFraction: MaybeRefOrGetter<number>,
): ComputedRef<string> {
    return computed(() =>
        springLinearStops({
            response: toValue(response),
            dampingFraction: toValue(dampingFraction),
        }),
    );
}
