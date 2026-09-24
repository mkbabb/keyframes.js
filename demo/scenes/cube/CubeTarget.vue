<template>
    <div
        class="relative grid h-full w-full max-w-full items-center justify-center justify-items-center overflow-visible"
        style="touch-action: none; overscroll-behavior: contain"
        @wheel.prevent
    >
        <div
            ref="graphEl"
            class="graph preserve-3d grid items-center justify-center justify-items-center"
        >
            <OrbitalDrag
                ref="orbitalRef"
                class="preserve-3d relative flex items-center justify-center justify-items-center select-none"
                v-model="transform"
                apply-transform-to-container
                @pressed-keys="onPressedKeys"
            >
                <div
                    ref="rollEl"
                    :class="[
                        'idle-hover preserve-3d',
                        { playing: isPlaying, 'idle-hover--rolling': rolling },
                    ]"
                >
                    <!-- KF.W13U.w — ONE ELEMENT PER TRANSFORM OWNER. Each of the
                         group's three channels authors a WHOLE `transform`, and
                         the group's `replace` layer (the README contract) keeps
                         one writer per property per element — so on one shared
                         `.cube` the last channel won and the die only bobbed
                         (OA-27). The house idiom (the roll's own element above)
                         gives each writer its own node: the bob on `.cube-bob`,
                         the authored matrix pose on `.cube-pose`, the spin on
                         `.cube` — nested, so they COMPOSE (bob · pose · spin). -->
                    <div ref="bobEl" class="cube-bob preserve-3d">
                        <div ref="poseEl" class="cube-pose preserve-3d">
                            <div
                                ref="cubeEl"
                                class="cube preserve-3d animation relative flex items-center justify-center justify-items-center"
                                :class="{ 'cube--rolling': rolling }"
                            >
                                <!-- KF.W6 #21 (≡ census S-6) — EVALUATED, SWAP DECLINED,
                                     with the mechanism named rather than a preference.
                                     glass-ui ships `Progress` with an `indeterminate`
                                     prop, and it is a linear BAR: its only orientations
                                     are horizontal and vertical, its variants are
                                     default/gradient/liquid, and it has no spinner
                                     affordance at all — so there is no like-for-like to
                                     swap this centre-plane spinner onto. It would also
                                     have to mount INSIDE the `preserve-3d` chain, adding
                                     a DOM participant to the 3D subtree, which is the
                                     same class of act that once flattened all six faces
                                     (T.A1's `filter` finding, one file over). The
                                     bespoke idiom is RETAINED; the ask that survives is
                                     a producer-side indeterminate spinner, and it rides
                                     the BH relay, never a demo-side re-authoring. -->
                                <span
                                    class="contents"
                                    v-if="showLoader"
                                >
                                    <Loader2
                                        class="absolute h-[var(--target-viewport-h)] w-[var(--target-viewport-w)] animate-spin"
                                    ></Loader2>
                                </span>
                                <div
                                    v-for="(side, index) in cubeSides"
                                    :key="index"
                                    :class="[
                                        'cube-side',
                                        side.class,
                                        'rounded-lg',
                                        'transition-[background-color,opacity] duration-panel ease-in-out',
                                        // z-10: LOCAL stacking inside the 3D cube — each
                                        // face sits above its own background plane. NOT a
                                        // participant in the editor z-contract (style.css),
                                        // so it stays a bare local rung, not a semantic
                                        // z-* layer.
                                        'absolute z-10 flex items-center justify-center',
                                    ]"
                                    :style="{ '--lit': faceLit[index] }"
                                >
                                    <template v-if="!ppMode">
                                        <div
                                            :class="[
                                                'face-lacquer h-full w-full font-bold',
                                                'flex items-center justify-center',
                                            ]"
                                            :style="{
                                                backgroundColor: side.color,
                                            }"
                                        >
                                            <!-- L.W11.S2 — the re-lit overlay: a --lit-keyed
                                                 highlight/shadow modulating LUMINANCE over
                                                 the KEPT crayon, never its hue. Pointer-
                                                 transparent. -->
                                            <span
                                                class="face-relit pointer-events-none absolute inset-0"
                                                aria-hidden="true"
                                            ></span>
                                            <span
                                                :class="[
                                                    'face-numeral text-display-2 h-full w-full',
                                                    'relative',
                                                    'flex items-center justify-center',
                                                ]"
                                                >{{ side.content }}</span
                                            >
                                        </div>
                                    </template>

                                    <template v-else>
                                        <div
                                            class="ppmycota-cube absolute h-full w-full"
                                        ></div>
                                        <div
                                            class="ppmycota-logo-lg absolute h-full w-full"
                                        ></div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </OrbitalDrag>

            <!-- P.W5.S3 EGG — the keyboard axis-lock reveal (the colocated
                 CubeAxisLines sub-unit: markup + styles together). OrbitalDrag
                 CONSTRAINS rotation to a single axis while X/Y/Z is held; the
                 matching axis line lights up so the otherwise-hidden lock becomes
                 spatially legible. Fed the latch OrbitalDrag publishes (no new
                 rAF, no new gesture machinery). -->
            <CubeAxisLines :lock="axisLock" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onScopeDispose, reactive, ref, useTemplateRef } from "vue";
import { Loader2 } from "@lucide/vue";
import type { CSSKeyframesAnimation, Vars } from "@mkbabb/keyframes.js";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import { useDoubleTap } from "@composables/useDoubleTap";
import OrbitalDrag from "./orbital-drag/OrbitalDrag.vue";
import type { PressedKeys, TransformState } from "./orbital-drag";
import CubeAxisLines from "./CubeAxisLines.vue";
import { GRAPH_ATTITUDE, useCubeRelit } from "./useCubeRelit";
import {
    numberValue,
    transformCall,
    transformList,
} from "./matrix-editor/transformMath";

const props = defineProps<{
    isPlaying: boolean;
    ppMode: boolean;
    showLoader: boolean;
}>();

const transform = defineModel<TransformState>("transform", { required: true });

const cubeEl = useTemplateRef<HTMLElement>("cubeEl");
const graphEl = useTemplateRef<HTMLElement>("graphEl");
// KF.W13U.w — the bob and pose channels' own elements (template note above).
const bobEl = useTemplateRef<HTMLElement>("bobEl");
const poseEl = useTemplateRef<HTMLElement>("poseEl");
// The roll's OWN element (#6/#2's arbitration half): see the Roll block below.
const rollEl = useTemplateRef<HTMLElement>("rollEl");
const orbitalRef = useTemplateRef<InstanceType<typeof OrbitalDrag>>("orbitalRef");

defineExpose({ cubeEl, bobEl, poseEl, graphEl });

// L.W11.S2 — the six crayon facets are KEPT, every hue intact; the raw rgba
// literals are HOISTED one-for-one into named --face-1…6 tokens (proof:crayon-
// preserved hue-EXACT), resolved by the backgroundColor binding at paint time.
// Its re-lit normal lives in useCubeRelit (FACE_NORMALS, index-aligned — rest
// pose: front toward +Z).
//
// KF.W6 #9 ≡ CubeScene D-7 — DECLARED, NOT CURED, and routed. The hoist
// preserved the hues EXACTLY, which is the praise and the defect in one act:
// the six values are the raw sRGB corners at one alpha, so they carry a very
// wide luminance spread across a single object, and they are theme-INVARIANT
// while the numeral ink below inherits theme-reactive `text-foreground`. Half
// the faces therefore lose their numeral in the dark arm. Both banked ends name
// the same cure — a dark arm or `light-dark()` on the palette, and/or a
// per-face-aware ink — and both are edits to the token DEFINITIONS in the
// demo's root sheet, which is outside this unit's §Bounds; a per-face override
// spelled here would be the masking the wave convicts, and re-cutting a crayon
// at the call site would break the hoist's own hue-exactness guarantee. Routed
// with `#8`/`#58` as ONE theme packet, decided in one motion. The bank's weight
// correction rides: the numeral is weight-400 by the typography layer, not
// bold, so the large-text bar holds on size alone. No ratio is quoted here
// (KF-SKEL-22); the rendered verdict with sheen and specular over it is KF.W9's,
// and neither end closes this id alone.
const cubeSides = [
    { class: "front", content: "1", color: "var(--face-1)" },
    { class: "right", content: "2", color: "var(--face-2)" },
    { class: "back", content: "3", color: "var(--face-3)" },
    { class: "left", content: "4", color: "var(--face-4)" },
    { class: "top", content: "5", color: "var(--face-5)" },
    { class: "bottom", content: "6", color: "var(--face-6)" },
];

// L.W11.S2 — the orientation-coupled RE-LIT die (the signature egg). faceLit
// (per-face --lit) rides the LIVE transform model OrbitalDrag publishes per
// rotation — reactive, NO second rAF (inv ζ); the crayon hue is untouched
// (--lit is LUMINANCE only). Colocated unit.
// #4/#56 — the relight needs BOTH frames: the die's own Euler triple (the model)
// and the attitude its `.graph` ancestor is parked at (the stage). The attitude
// is single-sourced at `useCubeDemo`, which is also what animates `.graph` into
// it, so the light and the stage can never drift apart.
const { faceLit } = useCubeRelit(transform, GRAPH_ATTITUDE);

// ── EASTER EGG — "the axis-lock reveal" (P.W5.S3) ─────────────────────────────
// Hold X / Y / Z and OrbitalDrag CONSTRAINS the rotation to that single axis —
// a powerful affordance that was, until now, completely invisible. The latched
// axis line now LIGHTS UP (--axis-active + a drop-shadow bloom in its own color),
// making the otherwise-hidden single-axis constraint spatially legible. It reads
// the `pressedKeys` latch OrbitalDrag already owns (emitted on every toggle) —
// no new rAF, no new gesture machinery (inv ζ): a threshold + a CSS state flip.
const axisLock = reactive({ x: false, y: false, z: false });
const onPressedKeys = (keys: PressedKeys) => {
    axisLock.x = keys.x;
    axisLock.y = keys.y;
    axisLock.z = keys.z;
};

// ── EASTER EGG — "the Roll" (H.W12.S6) ───────────────────────────────────────
// Double-tap M. Cubert → roll the die. The cube IS a six-faced die (1–6); the
// egg DOGFOODS the engine `CSSKeyframesAnimation` (inv ζ) to spin the die a
// couple of full turns on TWO axes into a RANDOM face, on a bouncy `easeOutBack`
// so it overshoots and settles.
//
// kf-CubeTarget #1·#2·#5·#6 — THE ROLL STACK, repaired as ONE mechanism. Every
// one of its four defects was invisible while any other stood:
//
//  · #1 THE TRIGGER. The recognizer listened on `.cube`, a DESCENDANT of the
//    element OrbitalDrag takes pointer capture on. Once capture is set, every
//    later event for that pointer is dispatched AT the capture element and
//    propagates to its ANCESTORS — `.cube` is never on the path, so the second
//    `pointerup` never arrived and `onRoll` was unreachable in every browser and
//    every input modality. The tap is now recognized on the capture element
//    itself (the drag surface OrbitalDrag exposes): the same surface the gesture
//    is delivered to, which is also exactly the die's own interactive box. The
//    sibling eggs never had this because `useDragScrub` captures on `el` itself.
//  · #2 THE PAINT. The frames authored `transform` as a NESTED PLAIN OBJECT, so
//    the compiler flattened them to the property names `transform.rotateX` /
//    `transform.rotateY`; CSSOM's `setProperty` discards an unsupported name
//    silently, so a real 1100 ms rAF loop wrote nothing for the whole arc. The
//    frames are structural `CssValue` now — the scene's own house idiom, and one
//    supported property name.
//  · #5 CONTINUITY. Both frames were ABSOLUTE (`from: 0deg`), so roll n+1 opened
//    with a 90°/180° jump-cut in five of six landings. The roll owns an
//    accumulated attitude and its frames are measured FORWARD from it.
//  · #6 ARBITRATION. It claimed `.cube` — which the scene's AnimationGroup and
//    the matrix painter already own — so "it COMPOSES with whatever orbit the
//    user set" was true of the orbit and false of everything else, and the first
//    post-roll model change obliterated the rolled pose. The roll now owns its
//    OWN element (`.idle-hover`, between the orbit container and the die), which
//    has no other transform writer. One authority per element: the container
//    orbits, `.idle-hover` rolls, `.cube` takes the spin, `.cube-pose` takes the
//    Matrix channel or its pre-start painter (never both — mutually exclusive on
//    `isGroupStarted`, KFA-2).
const rolling = ref(false);
let rollAnim: CSSKeyframesAnimation<Vars> | undefined;

// The roll's accumulated attitude on its own element (degrees). This IS the
// "resting on its rolled face" the egg promises: the next roll opens here.
const rollAttitude = { x: 0, y: 0 };

// The six face-up orientations of the die (degrees). Spinning to these shows
// faces 1–6 toward the viewer (the faces sit at ±translateZ off the centre, so
// a whole-die rotate re-presents them).
const ROLL_FACES: ReadonlyArray<{ x: number; y: number }> = [
    { x: 0, y: 0 },     // 1 — front
    { x: 0, y: -90 },   // 2 — right
    { x: 0, y: 180 },   // 3 — back
    { x: 0, y: 90 },    // 4 — left
    { x: -90, y: 0 },   // 5 — top
    { x: 90, y: 0 },    // 6 — bottom
];

/** The next absolute attitude showing `faceDeg` to the viewer, reached by
 *  turning FORWARD from `from` through `turns` whole revolutions. Always
 *  ≥ `from`, so the arc never cuts backwards (#5). */
const nextRollAttitude = (
    from: number,
    faceDeg: number,
    turns: number,
): number => from + ((((faceDeg - from) % 360) + 360) % 360) + turns * 360;

const rollTransform = (x: number, y: number) =>
    transformList(
        transformCall("rotateX", numberValue(x, "deg")),
        transformCall("rotateY", numberValue(y, "deg")),
    );

const onRoll = async () => {
    if (rolling.value || !rollEl.value) return;
    rolling.value = true;

    try {
        const face = ROLL_FACES[Math.floor(Math.random() * ROLL_FACES.length)]!;
        // 1–2 extra whole turns per axis for the tumble drama, landing on the face.
        const endX = nextRollAttitude(rollAttitude.x, face.x, 1 + Math.floor(Math.random() * 2));
        const endY = nextRollAttitude(rollAttitude.y, face.y, 1 + Math.floor(Math.random() * 2));

        const { CSSKeyframesAnimation } = await loadAnimationEngine();
        if (!rollEl.value) return;

        rollAnim?.stop();
        rollAnim = new CSSKeyframesAnimation({
            duration: 1100,
            iterationCount: 1,
            fillMode: "forwards",
            // The bounce-overshoot is the die settling onto its face.
            timingFunction: "ease-out-back",
        }).fromKeyframes({
            from: { transform: rollTransform(rollAttitude.x, rollAttitude.y) },
            to: { transform: rollTransform(endX, endY) },
        });
        rollAnim.setTargets(rollEl.value);
        // #20 — the release rides the arc's OWN completion (`play()` resolves when
        // the animation settles or is stopped), not a hand-tuned 1200 ms timer that
        // outlived the motion and survived a throw. `finally` frees the gesture
        // lock on every exit, so a failed engine load can no longer strand the die
        // pointer-dead.
        await rollAnim.play();
        rollAttitude.x = endX;
        rollAttitude.y = endY;
    } finally {
        rolling.value = false;
    }
};

// S.G3 S2 — the Roll is a POINTER-based double-tap (touch parity; the former
// `@dblclick` was mouse-only). Drag-disjoint: an orbit drag never triggers it, so
// the die-roll egg and the orbital drag coexist on the same surface.
//
// #1 — the surface is OrbitalDrag's CAPTURE element, not `.cube`. See the Roll
// block above: a descendant of the capture element is not on the dispatch path.
const dragSurfaceEl = computed<HTMLElement | null>(
    () => orbitalRef.value?.containerRef ?? null,
);

useDoubleTap({
    el: dragSurfaceEl,
    onDoubleTap: () => {
        void onRoll();
    },
});

onScopeDispose(() => {
    rollAnim?.stop();
});
</script>

<style scoped src="./CubeTarget.css"></style>
