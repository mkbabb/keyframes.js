import { ref, watch, type Ref } from "vue";
import { afterViewTransition, viewTransitionRunning } from "@utils/viewTransition";

/**
 * FORTY-SIXTH E1 (J5, J6) — Home's wash leaves by a fade. Its renderer tears
 * down when it unmounts (glass's Aurora loses its WebGL context in its
 * `onBeforeUnmount`), so a `<Transition>` leave would fade a canvas already
 * blank: the wash went in one frame. It stays mounted through its fade instead
 * (an animation of the element's own opacity, from whatever it shows now) and
 * is unmounted when the fade has finished. Back on Home before then, the fade
 * is cancelled and the wash stays.
 *
 * FORTY-SIXTH A (K-1) — a wash that arrives with a page change mounts once
 * the swap has finished (`afterViewTransition`); its own entrance (HeroAurora)
 * then fades it in. Mounted with the new page, its WebGL renderer came up in
 * the docks' glide's first frame (a task of 67 to 181 ms on every first visit
 * of Home), which held the plates at the cube's width while the seats moved
 * on, then landed the width in one frame. On a cold Home (no swap) it mounts
 * at once, as before.
 *
 * @param shown whether the wash belongs on the page (Home).
 * @param el the wash's element, while it is mounted.
 * @param ms the fade's length.
 * @returns whether the wash is mounted.
 */
export function useBackdropLeave(
    shown: () => boolean,
    el: () => Element | null | undefined,
    ms: number,
): Readonly<Ref<boolean>> {
    const mounted = ref(shown());
    let fade: Animation | null = null;
    let stopArrival: (() => void) | null = null;
    watch(shown, (on) => {
        fade?.cancel();
        fade = null;
        stopArrival?.();
        stopArrival = null;
        if (on) {
            if (mounted.value || !viewTransitionRunning()) {
                mounted.value = true;
                return;
            }
            stopArrival = afterViewTransition(() => {
                stopArrival = null;
                if (shown()) mounted.value = true;
            });
            return;
        }
        if (!mounted.value) return;
        const target = el();
        if (!target || typeof target.animate !== "function") {
            mounted.value = false;
            return;
        }
        const mine = target.animate([{ opacity: getComputedStyle(target).opacity }, { opacity: 0 }], {
            duration: ms,
            easing: "cubic-bezier(0.4, 0, 1, 1)",
            fill: "forwards",
        });
        fade = mine;
        mine.finished.then(
            () => {
                if (fade !== mine) return;
                fade = null;
                mounted.value = false;
            },
            () => {},
        );
    });
    return mounted;
}
