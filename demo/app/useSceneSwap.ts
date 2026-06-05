import { computed, ref, watch, type ComputedRef } from "vue";
import { SpringProgress } from "@src/animation/spring";

/**
 * The engine-dogfooded scene-swap cross-dissolve. The keyed `<Suspense>` host
 * (App.vue) hard-cuts the scene; this `SpringProgress` fades the new scene in
 * over the previous paint via a sibling reactive style binding — NOT a
 * `<Transition>` wrapper.
 *
 * Why a sibling style binding, not a `<Transition>`: a `<Transition mode="out-in">`
 * / `<KeepAlive>` around a keyed `<Suspense>` whose child is a
 * `defineAsyncComponent` never triggered the async loader, so amiga / square /
 * easing / spring shipped a BLANK viewport on every load (the chunk was never
 * even requested — B.W3's headline blocker). Driving the fade from the SIBLING
 * wrapper `<div>` keeps the async loader on the bare `<Suspense>`, untouched, so
 * the async-load re-break cannot recur. On `activeSceneKey` change the spring
 * re-seats 0→1, fading the new scene in over the previous paint (a
 * cross-dissolve, never a blank gap).
 *
 * The default options ARE the iOS "smooth" preset (response 0.5, dampingFraction
 * 0.86 — no overshoot, a calm enter); `respectReducedMotion: true` makes the
 * spring snap to terminal in one emit under prefers-reduced-motion — an instant
 * clean swap, the engine's own reduced-motion authority.
 */
export function useSceneSwap(activeSceneKey: ComputedRef<string>) {
    const sceneOpacity = ref(1);
    const sceneSwapStyle = computed(() => ({
        opacity: sceneOpacity.value,
        // lerp(0.97, 1, v): subtle scale-up as the scene settles in.
        transform: `scale(${0.97 + 0.03 * sceneOpacity.value})`,
    }));
    const sceneSwapSpring = new SpringProgress({ respectReducedMotion: true });
    watch(activeSceneKey, () => {
        sceneSwapSpring.reset(0);
        sceneSwapSpring.play((v) => { sceneOpacity.value = v; });
        sceneSwapSpring.target = 1;
    });

    return { sceneSwapStyle };
}
