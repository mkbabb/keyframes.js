import { watch, type ShallowRef } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/stores";
import { useDebounceFn } from "@vueuse/core";

/**
 * Bidirectional sync of ?anim= query param with the controls store.
 * Follows the monotonic generation counter pattern from value.js useColorUrl.
 *
 * - URL → Model: watch route.query.anim, update selectedAnimation
 * - Model → URL: watch selectedAnimation, debounced write to router.replace
 * - Generation counter prevents circular updates
 */
export function useSceneUrl(currentSuperKey: ShallowRef<string>) {
    const router = useRouter();
    const route = useRoute();

    // Monotonic generation counter — prevents circular URL ↔ model updates.
    // Incremented on every write (either direction); the debounced writer
    // captures gen at schedule time and no-ops if it changed.
    let syncGen = 0;

    // URL → Model: apply ?anim= to selectedAnimation
    function applyAnimFromUrl() {
        const anim = route.query.anim as string | undefined;
        if (!anim) return;

        const controls = getStoredAnimationGroupControlOptions(currentSuperKey.value);
        if (controls.selectedAnimation !== anim) {
            syncGen++;
            controls.selectedAnimation = anim;
        }
    }

    // Model → URL: debounced write of selectedAnimation to ?anim=
    const syncAnimToUrl = useDebounceFn(() => {
        const gen = syncGen;
        const controls = getStoredAnimationGroupControlOptions(currentSuperKey.value);
        const anim = controls.selectedAnimation;

        // If generation changed since debounce was scheduled, skip
        if (gen !== syncGen) return;

        const currentAnim = route.query.anim as string | undefined;
        if (anim === currentAnim) return;

        syncGen++;
        const query = { ...route.query };
        if (anim) {
            query.anim = anim;
        } else {
            delete query.anim;
        }
        router.replace({ query });
    }, 300);

    // Apply ?anim= on initial load
    applyAnimFromUrl();

    // Watch for back/forward navigation changing ?anim=
    watch(() => route.query.anim, () => applyAnimFromUrl());

    // Watch model → URL (selectedAnimation changes)
    watch(
        () => getStoredAnimationGroupControlOptions(currentSuperKey.value).selectedAnimation,
        () => syncAnimToUrl(),
    );
}
