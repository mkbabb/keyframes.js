import { useDocumentVisibility, useIntersectionObserver } from "@vueuse/core";
import { computed, ref, type MaybeRefOrGetter, type Ref } from "vue";

/**
 * KF.DS.r1 (COHESION §0ge.7, KF-C3-02) — when an ambient identity loop parks.
 *
 * True while the page is hidden OR the element is offscreen; false otherwise.
 * The owner of a loop (the hero's title wave, the hero dots) reads this at the
 * loop's own root and stands its motion down while it is true, so nothing
 * animates where nobody can see it. Reduced motion is a separate, prior gate
 * (each loop is already static under `prefers-reduced-motion`).
 *
 * Without IntersectionObserver the element counts as on screen, so the loop
 * still runs and still parks on a hidden page.
 */
export function useMotionPark(
    target: MaybeRefOrGetter<HTMLElement | null | undefined>,
): Readonly<Ref<boolean>> {
    const visibility = useDocumentVisibility();
    const onscreen = ref(true);
    useIntersectionObserver(target, ([entry]) => {
        onscreen.value = entry?.isIntersecting ?? true;
    });
    return computed(() => visibility.value === "hidden" || !onscreen.value);
}
