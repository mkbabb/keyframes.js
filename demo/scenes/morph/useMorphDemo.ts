import { computed, markRaw, ref, shallowRef } from "vue";

import { kfEngine } from "@utils/kfEngine";
import type {
    AnimationGroup,
    CSSKeyframesAnimation,
} from "@mkbabb/keyframes.js";

import {
    createGroupAdapter,
    useSceneMachine,
} from "@state";

import { MORPH_SHAPES, type MorphShape } from "./morphShapes";

/**
 * useMorphDemo — the dogfood of the THIRD HEAVY geometry front door (Q.WC4 S3):
 * `fromMorphSVG` morphs one SVG `<path>` `d` INTO another over value.js's
 * `PathGeometry`, and the Q.WC4 S1 render contract paints the morphing shape
 * DIRECTLY on a live `<path>` (the `d:` CSS property + `--morph-d` custom
 * property the morph writes each frame). Beside MotionPath (offset-distance over
 * an author path) and DrawSVG (stroke line-drawing), this is the morph.
 *
 * The morph IS a `CSSKeyframesAnimation`, so it slots straight into a contract
 * `AnimationGroup` and rides the editor's machine-native playback (the SAME
 * contract cube/amiga/motion-path ride). It is built on MOUNT (once the live
 * `<path>` target exists for the render contract), then swapped reactively; the
 * App's scene-machine group watcher binds the new group + registers its
 * ScenePlayback adapter.
 *
 * THE SHAPE RING (S3): the scene morphs `shapes[i]` → `shapes[i+1]`, alternating
 * (so the body breathes A⇄B), and a "Next shape" affordance advances the ring —
 * each advance REBUILDS the morph (a fresh `fromMorphSVG` over the new pair) and
 * re-targets the same `<path>`. ORIENT (S2 dogfood): the morph is built with
 * `orient: true`, so a glyph banks to the tangent along the morphed outline (the
 * `--morph-{i}-angle` channel the engine interpolates).
 */
export function useMorphDemo() {
    // HEAVY engine from the warmed surface (synchronous — main.ts warms before
    // any scene mounts). `fromMorphSVG`/`AnimationGroup` ride the heavy boundary.
    const { fromMorphSVG, AnimationGroup } = kfEngine();

    // Starts empty; the morph animation is registered on mount (once the target
    // `<path>` exists for the render contract).
    const animationGroup = shallowRef<AnimationGroup<any>>(
        markRaw(new AnimationGroup()),
    );
    const isStarted = ref(true);

    // ── Machine-native playback (the read-only projection + dispatchers) ──────
    const machine = useSceneMachine();
    const isPlaying = computed(() => machine.status.value === "playing");
    const play = (): void => {
        if (isPlaying.value) return;
        machine.dispatch({ type: "PLAY" });
    };
    const pause = (): void => {
        if (!isPlaying.value) return;
        machine.dispatch({ type: "PAUSE" });
    };

    // The group ScenePlayback adapter the App registers on SCENE_READY (the same
    // contract MotionPath rides — the morph CSSKeyframesAnimation's `t` snapshots
    // round-trip across suspend/restore through the group adapter).
    const scenePlayback = createGroupAdapter(() => animationGroup.value);

    // ── The shape ring (the single source of the current morph pair) ──────────
    const shapeIndex = ref(0);
    const fromShape = computed<MorphShape>(
        () => MORPH_SHAPES[shapeIndex.value]!,
    );
    const toShape = computed<MorphShape>(
        () => MORPH_SHAPES[(shapeIndex.value + 1) % MORPH_SHAPES.length]!,
    );

    /** The live morph animation (markRaw — the engine handle, not reactive). */
    const morph = shallowRef<CSSKeyframesAnimation<any> | null>(null);

    /** The sample index the oriented glyph sits at — a representative body point
     *  the glyph banks to (≈ the path's far side, so the bank reads clearly). */
    const ORIENT_SAMPLE = 24;
    const SAMPLES = 48;

    /**
     * (Re)build the morph over the CURRENT shape pair, targeting `pathEl` so the
     * S1 render contract paints `d:`/`--morph-d` each frame. Alternating +
     * infinite so the body breathes between the two shapes; `orient: true` emits
     * the `--morph-{i}-angle` channel the glyph banks by. Publishes the morph in
     * a fresh contract `AnimationGroup` (the App binds it + registers the adapter).
     */
    const buildMorph = (pathEl: SVGPathElement): void => {
        const anim = fromMorphSVG(fromShape.value.d, toShape.value.d, {
            target: pathEl,
            samples: SAMPLES,
            orient: true,
            duration: 2200,
            iterationCount: "infinite",
            direction: "alternate",
            autoPlay: false,
        });
        anim.superKey = "Morph";
        // Seed the INITIAL render so the subject paints the `from` shape BEFORE
        // play (the CSS `d: var(--morph-d)` would otherwise read empty → `none`).
        // One apply frame at t=0 writes --morph-d / d: for the start shape; the
        // play loop takes over from there.
        anim.interpFrames(0, true);
        morph.value = markRaw(anim);
        animationGroup.value = markRaw(new AnimationGroup(anim));
    };

    /** Advance the ring to the next shape pair (rebuilds the morph in place). */
    const nextShape = (pathEl: SVGPathElement | null): void => {
        shapeIndex.value = (shapeIndex.value + 1) % MORPH_SHAPES.length;
        if (pathEl) buildMorph(pathEl);
    };

    /**
     * Read the oriented glyph's LIVE position + tangent at the morph's current
     * playhead — the orient-along-path dogfood (S2). The render contract writes
     * `--morph-d`/`d:` to the TARGET, but the per-point `--morph-{i}-x/y/angle`
     * channels live on the engine's interpolated frames — so the glyph reads them
     * DIRECTLY off the morph animation (`interpFrames(t)`), the same seam
     * `MorphSVG.sampleD` reads. Returns user-space `(x, y)` + the tangent (rad),
     * or null before the morph is built.
     */
    const readOrient = (): { x: number; y: number; angle: number } | null => {
        const anim = morph.value;
        if (!anim) return null;
        const i = ORIENT_SAMPLE;
        const out = anim.interpFrames(anim.t, false);
        const x = out[`--morph-${i}-x`]?.[0]?.value;
        const y = out[`--morph-${i}-y`]?.[0]?.value;
        const angle = out[`--morph-${i}-angle`]?.[0]?.value;
        if (typeof x !== "number" || typeof y !== "number") return null;
        return { x, y, angle: typeof angle === "number" ? angle : 0 };
    };

    return {
        animationGroup,
        isStarted,
        isPlaying,
        play,
        pause,
        scenePlayback,
        // The shape ring (single source).
        shapeIndex,
        fromShape,
        toShape,
        shapes: MORPH_SHAPES,
        // The morph lifecycle.
        morph,
        buildMorph,
        nextShape,
        readOrient,
        ORIENT_SAMPLE,
        SAMPLES,
    };
}

export type MorphDemo = ReturnType<typeof useMorphDemo>;
