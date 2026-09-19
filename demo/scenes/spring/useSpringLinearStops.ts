import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";

import { springLinearStops } from "@mkbabb/keyframes.js";

/**
 * The ONE spring → CSS `linear()` surface for the Spring scene (H.W5.S3).
 *
 * N-5 — THE SCENE'S ONE WRITTEN ENGINE-SEAM CONTRACT NAMED A DEAD CONSUMER. This
 * paragraph used to cite `SpringSidebar.vue:130` and `StartingStyleTarget.vue:95`
 * as the two call sites it folds, and to state that `SpringTarget` does not call
 * it. `SpringSidebar.vue` was deleted at `277c01ec`; the file does not exist at
 * any path. A contract statement is the one place a reader is entitled to trust
 * without checking, so a stale one costs more than no statement at all.
 *
 * Measured at this seat — ⟨cmd⟩ `grep -rn useSpringLinearStops demo` → the LIVE
 * consumers are **`SpringTrace.vue`** (the 26-stop plot) and
 * **`StartingStyleTarget.vue`** (the `--spring-ease` / copy-paste artifact),
 * neither of which the old sentence named. The fold this composable exists to
 * perform is real and unchanged — one emission surface, two readers — and that is
 * now stated in terms of files that are here.
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
