import { markRaw, ref, shallowRef } from "vue";

import { AnimationGroup } from "@src/animation/group";
import type { CSSKeyframesAnimation } from "@src/animation/engine";

/**
 * useMotionPathDemo — the dogfood of the CSS-native MotionPath primitive
 * (F.W12.S3). It drives an element along an author `offset-path` by sweeping
 * `offset-distance` via `fromMotionPath` — proving the primitive the way the
 * cube proves `AnimationGroup`.
 *
 * The MotionPath animation IS a `CSSKeyframesAnimation`, so it slots straight
 * into a contract `AnimationGroup` and rides the editor's EXISTING bottom-bar
 * transport (play/pause/scrub) — no custom loop. The traveller element only
 * exists after mount (the factory sets `offset-path` on a live element), so the
 * scene registers its animation on mount and swaps the reactive group; the
 * App's scene-machine group watcher binds the new group instance and registers
 * its ScenePlayback adapter (H.W1).
 *
 * INTERACTIVITY (H.W5.S4a): the traveller is draggable ALONG its own path. The
 * Target projects the pointer onto the SVG `<path>` and re-seats the engine
 * playhead via `group.setChildTime(...).render()` — the SAME scrub seam the
 * bottom-bar slider uses (`useAnimationGroupPlayback.sliderUpdate`), so the drag
 * and the scrub share ONE progress source (DRY). The drag pauses/resumes the
 * group around the gesture exactly as `onScrubStart`/`onScrubEnd` do; `isPlaying`
 * stays the App-writable group-state mirror (the group scenes' contract, H.W1).
 */
export function useMotionPathDemo() {
    // Starts empty; the traveller's MotionPath animation is registered on mount.
    const animationGroup = shallowRef<AnimationGroup<any>>(
        markRaw(new AnimationGroup()),
    );
    const isStarted = ref(true);
    const isPlaying = ref(false);

    /**
     * Register the traveller's MotionPath animation (built on mount, once the
     * DOM element exists for the `offset-path` set). Wraps it in a fresh
     * contract `AnimationGroup` and publishes it reactively.
     */
    const registerAnimation = (anim: CSSKeyframesAnimation<any>): void => {
        anim.superKey = "MotionPath";
        animationGroup.value = markRaw(new AnimationGroup(anim));
    };

    return { animationGroup, isStarted, isPlaying, registerAnimation };
}

export type MotionPathDemo = ReturnType<typeof useMotionPathDemo>;
