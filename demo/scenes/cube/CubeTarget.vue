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
                                >
                                    <!-- X-DS pass 1 (KF-P1-02) — a FLAT crayon face
                                         (the ORIGIN die: six flat faces, a numeral,
                                         rounded corners). The lit-lacquer gloss and
                                         the orientation-coupled specular/veil are
                                         deleted; the one tonal step is FIXED per face
                                         (CubeTarget.css), never driven by rotation. -->
                                    <template v-if="!ppMode">
                                        <div
                                            :class="[
                                                'face-fill h-full w-full font-bold',
                                                'flex items-center justify-center',
                                            ]"
                                            :style="{ '--face-crayon': side.color, color: side.ink }"
                                        >
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
import type { CSSKeyframesAnimation, Vars } from "@mkbabb/keyframes.js";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import { useDoubleTap } from "@composables/useDoubleTap";
import OrbitalDrag from "./orbital-drag/OrbitalDrag.vue";
import type { TransformState } from "./orbital-drag/transform";
import type { PressedKeys } from "./orbital-drag/types";
import CubeAxisLines from "./CubeAxisLines.vue";
import {
    numberValue,
    transformCall,
    transformList,
} from "./matrix-editor/transformMath";

const props = defineProps<{
    isPlaying: boolean;
    ppMode: boolean;
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
    // X-DS pass 6 (KF-C6-04) — the one light crayon in both themes carries
    // the dark ink (`--face-4-ink`, style.css); the others inherit --foreground.
    { class: "left", content: "4", color: "var(--face-4)", ink: "var(--face-4-ink)" },
    { class: "top", content: "5", color: "var(--face-5)" },
    { class: "bottom", content: "6", color: "var(--face-6)" },
];

// ── EASTER EGG — "the axis-lock reveal" (P.W5.S3) ─────────────────────────────
// Hold X / Y / Z and OrbitalDrag CONSTRAINS the rotation to that single axis —
// a powerful affordance that was, until now, completely invisible. The latched
// axis line now goes SOLID and full-strength (--axis-active; no bloom, X-DS),
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
// couple of full turns on TWO axes onto a random face-aligned attitude, then
// overshoots a fixed few degrees and settles (KFA-86).
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

// The six axis-aligned attitudes the roll lands on (degrees). KFA-141 — these
// are attitudes of the roll's OWN element, not faces: `.idle-hover` wraps the
// running group's bob, pose and spin, so which numeral ends toward the viewer is
// that composition's business. The roll promises a face-aligned landing on a
// random attitude, never a named face.
const ROLL_ATTITUDES: ReadonlyArray<{ x: number; y: number }> = [
    { x: 0, y: 0 },
    { x: 0, y: -90 },
    { x: 0, y: 180 },
    { x: 0, y: 90 },
    { x: -90, y: 0 },
    { x: 90, y: 0 },
];

// KFA-86 · KFA-140 — the overshoot is a FIXED angle and the spin's slope is
// bounded. `ease-out-back` over a fixed 1100 ms scaled its overshoot with the
// whole multi-turn arc (up to ~70° past the landing, served) and front-loaded
// 40-75° per frame. The spin now eases out to ROLL_OVERSHOOT_DEG past the
// landing and settles back on its own segment, over a duration that grows with
// the arc, so the opening rate stays near 1.3°/ms whatever the arc.
const ROLL_OVERSHOOT_DEG = 8;
const ROLL_SETTLE_AT = "85%";
const rollDurationMs = (arcDeg: number) => 600 + arcDeg;

/** The next absolute attitude congruent to `faceDeg`, reached by
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
        const face = ROLL_ATTITUDES[Math.floor(Math.random() * ROLL_ATTITUDES.length)]!;
        // 1–2 extra whole turns per axis for the tumble drama.
        const endX = nextRollAttitude(rollAttitude.x, face.x, 1 + Math.floor(Math.random() * 2));
        const endY = nextRollAttitude(rollAttitude.y, face.y, 1 + Math.floor(Math.random() * 2));

        const { CSSKeyframesAnimation } = await loadAnimationEngine();
        if (!rollEl.value) return;

        rollAnim?.stop();
        const arc = Math.max(endX - rollAttitude.x, endY - rollAttitude.y);
        rollAnim = new CSSKeyframesAnimation({
            duration: rollDurationMs(arc),
            iterationCount: 1,
            fillMode: "forwards",
            // Per keyframe segment (the CSS rule): the spin eases out onto the
            // overshoot, then the settle eases back onto the landing.
            timingFunction: "ease-out",
            // KFA-87 — the engine's own reduced-motion gate: under PRM the roll
            // snaps to its landing instead of tumbling.
            respectReducedMotion: true,
        }).fromKeyframes({
            from: { transform: rollTransform(rollAttitude.x, rollAttitude.y) },
            [ROLL_SETTLE_AT]: {
                transform: rollTransform(
                    endX + ROLL_OVERSHOOT_DEG,
                    endY + ROLL_OVERSHOOT_DEG,
                ),
            },
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
