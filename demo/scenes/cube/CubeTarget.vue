<template>
    <div
        class="relative grid h-full w-full max-w-full items-center justify-center justify-items-center overflow-visible"
        style="touch-action: none; overscroll-behavior: contain"
        @wheel.prevent
    >
        <!-- S.G3 S1 — the drafting-stamp gesture legend surfaces the cube's
             otherwise-invisible gesture grammar (fold row 67); the `cube:roll` row
             is the census TELL for the double-tap egg. Fades after the first roll. -->
        <GestureLegend
            scene="cube"
            :items="[
                { id: 'orbit', glyph: '↻', label: 'drag: orbit' },
                { id: 'axislock', glyph: '⇥', label: 'hold X / Y / Z: lock axis' },
                { id: 'roll', glyph: '⁚⁚', label: 'double-tap: roll the die' },
            ]"
            :used="rollUsed"
        />
        <div
            ref="graphEl"
            class="graph preserve-3d grid items-center justify-center justify-items-center"
        >
            <OrbitalDrag
                class="preserve-3d relative flex items-center justify-center justify-items-center select-none"
                v-model="transform"
                :apply-transform-to-container="props.isPlaying || props.isStarted"
                @pressed-keys="onPressedKeys"
            >
                <div
                    :class="[
                        'idle-hover preserve-3d',
                        { playing: isPlaying },
                    ]"
                >
                    <div
                        ref="cubeEl"
                        class="cube cube--relit preserve-3d animation relative flex items-center justify-center justify-items-center"
                        :class="{ 'cube--rolling': rolling }"
                        :style="{ '--spin-energy': spinEnergy }"
                    >
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
                                // face sits above its own .rainbow-wrapper
                                // background span. NOT a participant in the
                                // editor z-contract (style.css), so it stays a
                                // bare local rung, not a semantic z-* layer.
                                'absolute z-10 flex items-center justify-center',
                            ]"
                            :style="{ '--lit': faceLit[index] }"
                        >
                            <span
                                :class="
                                    'rainbow-wrapper ' +
                                    (!isPlaying
                                        ? 'opacity-100'
                                        : 'opacity-25')
                                "
                                :style="rainbowTimings[index]"
                            >
                            </span>
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
                                    <!-- L.W11.S2 — the re-lit overlay (a --lit-keyed
                                         highlight/shadow modulating LUMINANCE over
                                         the KEPT crayon, never its hue) + the
                                         drafting-stamp axis tag (the Fira-Code
                                         coordinate annotation paired with the
                                         serif numeral). Both pointer-transparent. -->
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
                                    <span
                                        class="face-axis-tag pointer-events-none absolute"
                                        aria-hidden="true"
                                        >{{ side.axisTag }}</span
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
            </OrbitalDrag>

            <!-- P.W5.S3 EGG — the keyboard axis-lock reveal (the colocated
                 CubeAxisLines sub-unit: markup + styles together). OrbitalDrag
                 CONSTRAINS rotation to a single axis while X/Y/Z is held; the
                 matching axis line lights up so the otherwise-hidden lock becomes
                 spatially legible. Fed the latch OrbitalDrag publishes (no new
                 rAF, no new gesture machinery). -->
            <CubeAxisLines :lock="axisLock" />
        </div>

        <!-- L.W11.S2 — the live attitude readout: rx/ry/rz Euler degrees in a
             Fira-Code .readout-accent chip, reading the SAME transform model
             OrbitalDrag publishes per rotation (no second clock/rAF). -->
        <div
            class="cube-attitude readout-accent pointer-events-none select-none"
            aria-hidden="true"
        >
            <span class="cube-attitude__axis">rx</span> {{ euler.x }}°
            <span class="cube-attitude__axis">ry</span> {{ euler.y }}°
            <span class="cube-attitude__axis">rz</span> {{ euler.z }}°
        </div>
    </div>
</template>

<script setup lang="ts">
import { onScopeDispose, reactive, ref, useTemplateRef } from "vue";
import { Loader2 } from "@lucide/vue";
import type { CSSKeyframesAnimation } from "@mkbabb/keyframes.js";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import { useDoubleTap } from "@composables/useDoubleTap";
import GestureLegend from "@components/custom/GestureLegend.vue";
import OrbitalDrag from "./orbital-drag/OrbitalDrag.vue";
import type { PressedKeys, TransformState } from "./orbital-drag";
import CubeAxisLines from "./CubeAxisLines.vue";
import { useCubeRelit } from "./useCubeRelit";

const props = defineProps<{
    isPlaying: boolean;
    isStarted: boolean;
    ppMode: boolean;
    showLoader: boolean;
}>();

const transform = defineModel<TransformState>("transform", { required: true });

const cubeEl = useTemplateRef<HTMLElement>("cubeEl");
const graphEl = useTemplateRef<HTMLElement>("graphEl");

defineExpose({ cubeEl, graphEl });

// L.W11.S2 — the six crayon facets are KEPT, every hue intact; the raw rgba
// literals are HOISTED one-for-one into named --face-1…6 tokens (proof:crayon-
// preserved hue-EXACT), resolved by the backgroundColor binding at paint time.
// Each facet carries a drafting-stamp axis tag; its re-lit normal lives in
// useCubeRelit (FACE_NORMALS, index-aligned — rest pose: front toward +Z).
const cubeSides = [
    { class: "front", content: "1", color: "var(--face-1)", axisTag: "+Z" },
    { class: "right", content: "2", color: "var(--face-2)", axisTag: "+X" },
    { class: "back", content: "3", color: "var(--face-3)", axisTag: "−Z" },
    { class: "left", content: "4", color: "var(--face-4)", axisTag: "−X" },
    { class: "top", content: "5", color: "var(--face-5)", axisTag: "−Y" },
    { class: "bottom", content: "6", color: "var(--face-6)", axisTag: "+Y" },
];

// L.W11.S2 — the orientation-coupled RE-LIT die (the signature egg). faceLit
// (per-face --lit), the live euler readout, and --spin-energy ride the LIVE
// transform model OrbitalDrag publishes per rotation — reactive, NO second rAF
// (inv ζ); the crayon hue is untouched (--lit is LUMINANCE only). Colocated unit.
const { faceLit, euler, spinEnergy, flashRoll, disposeFlash } =
    useCubeRelit(transform);

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

// S5d (K.W0) — the per-face rainbow-wrapper animation timings were drawn with
// `Math.random()` INSIDE the inline :style binding, so every render re-rolled the
// delay/duration and the rainbow shimmer flickered on each reactive tick. The
// timings are a constant property of each face, not render state: draw them ONCE
// at setup (one entry per cube side) and bind the static array by index. No
// per-render randomness — the shimmer is now stable across reactivity.
const rainbowTimings = cubeSides.map(() => ({
    animationDelay: `${Math.random() * 10}s`,
    animationDuration: `${Math.random() * 10}s`,
}));

// ── EASTER EGG — "the Roll" (H.W12.S6) ───────────────────────────────────────
// Double-click M. Cubert → roll the die. The cube IS a six-faced die (1–6); the
// egg DOGFOODS the engine `CSSKeyframesAnimation` (inv ζ) to spin the `.cube`
// element itself a couple of full turns on TWO axes into a RANDOM face, on a
// bouncy `easeOutBack` so the die overshoots and settles. It targets the `.cube`
// (NOT the OrbitalDrag quaternion container), so the spin COMPOSES with whatever
// orbit the user set — the faces tumble within the current viewing frame. A
// transitionend-free, engine-owned tumble; the rolling flag suppresses re-rolls
// mid-spin and stands the pointer down for the ~1s arc.
const rolling = ref(false);
// S.G3 S1 — fades the legend stamp once the die has been rolled at least once.
const rollUsed = ref(false);
let rollAnim: CSSKeyframesAnimation | undefined;

// The six face-up orientations of the `.cube` (degrees). Spinning the cube to
// these shows faces 1–6 toward the viewer (the faces sit at ±translateZ off the
// cube center, so a whole-cube rotate re-presents them).
const ROLL_FACES: ReadonlyArray<{ x: number; y: number }> = [
    { x: 0, y: 0 },     // 1 — front
    { x: 0, y: -90 },   // 2 — right
    { x: 0, y: 180 },   // 3 — back
    { x: 0, y: 90 },    // 4 — left
    { x: -90, y: 0 },   // 5 — top
    { x: 90, y: 0 },    // 6 — bottom
];

const onRoll = async () => {
    if (rolling.value || !cubeEl.value) return;
    rolling.value = true;

    const face = ROLL_FACES[Math.floor(Math.random() * ROLL_FACES.length)]!;
    // 1–2 extra whole turns per axis for the tumble drama, landing on the face.
    const endX = face.x + (1 + Math.floor(Math.random() * 2)) * 360;
    const endY = face.y + (1 + Math.floor(Math.random() * 2)) * 360;

    const { CSSKeyframesAnimation } = await loadAnimationEngine();
    if (!cubeEl.value) {
        rolling.value = false;
        return;
    }

    rollAnim?.stop();
    rollAnim = new CSSKeyframesAnimation({
        duration: 1100,
        iterationCount: 1,
        fillMode: "forwards",
        // The bounce-overshoot is the die settling onto its face.
        timingFunction: "ease-out-back",
    }).fromKeyframes(
        {
            from: { transform: { rotateX: "0deg", rotateY: "0deg" } },
            to: { transform: { rotateX: `${endX}deg`, rotateY: `${endY}deg` } },
        },
    );
    rollAnim.setTargets(cubeEl.value);
    rollAnim.play();
    // L.W11.S2 — the landing THUNK: flash --spin-energy to 1 as the arc settles
    // so the bloom swells then bleeds off (the SAME channel the orbit feeds).
    flashRoll();
    // Release the gesture lock after the arc; the fillMode:forwards leaves the
    // die resting on its rolled face (the next drag/animation re-bases as usual).
    setTimeout(() => { rolling.value = false; }, 1200);
};

// S.G3 S2 — the Roll is a POINTER-based double-tap now (touch parity; the former
// `@dblclick` was mouse-only). Drag-disjoint: an orbit drag never triggers it, so
// the die-roll egg and the orbital drag coexist on the same cube.
useDoubleTap({
    el: cubeEl,
    onDoubleTap: () => {
        rollUsed.value = true;
        void onRoll();
    },
});

onScopeDispose(() => {
    rollAnim?.stop();
    disposeFlash();
});
</script>

<style scoped>
/* L.W11.S2 — register --lit (re-lit luminance) + --spin-energy (bloom) so they INTERPOLATE. */
@property --lit {
    syntax: "<number>";
    inherits: true;
    initial-value: 0.5;
}
@property --spin-energy {
    syntax: "<number>";
    inherits: true;
    initial-value: 0;
}
/* P.W5.S3 — the axis-lock reveal (@property --axis-active + the .axis-line
   styles) lives in the colocated CubeAxisLines sub-unit, beside its markup. */

.graph {
    perspective: 1200px;
}

/* EASTER EGG — "the Roll" (H.W12.S6): while the die tumbles, the cube ignores
   pointer input so a stray drag mid-roll cannot fight the spring; the engine
   owns the rotation for the ~1s tumble, then hands control back. Isomorphic —
   no visual change, just the gesture hand-off. */
.cube--rolling {
    pointer-events: none;
}

/* CSS twin of the engine's reduced-motion gate: the always-on idle bob runs
   only when the user has not asked the OS to reduce motion. */
@media (prefers-reduced-motion: no-preference) {
    .idle-hover {
        animation: idle-bob 3s var(--ease-standard) infinite alternate;
    }
    .idle-hover.playing {
        animation: none;
    }
}
@keyframes idle-bob {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(5px);
    }
}

.cube {
    --side-size: min(25vh, 25vw, 15rem);
    --side-offset: calc(var(--side-size) / 2);
    --rotationX: 360deg;

    height: calc(var(--side-size) * 2);
    contain: style;
}

/* G5 (transient will-change): the cube is the element that actually transforms
   (the matrix/rotation animations + the OrbitalDrag container). Promote it to
   its own compositor layer ONLY while it is moving — playing or hovered — and
   drop the hint at rest, so an idle/off-screen cube holds no resident layer (a
   resident `will-change` keeps the layer alive forever, the G5 anti-pattern).
   The idle-bob is a 5px translate the compositor handles without the hint. */
.idle-hover.playing .cube,
.graph:hover .cube {
    will-change: transform;
}

@media (max-width: 1023px) {
    .cube {
        --side-size: min(50vh, 50vw, 18rem);
    }
}

.cube-side {
    width: var(--side-size);
    height: var(--side-size);
    backface-visibility: hidden;
    /* L.W11.S2 — smooth the per-face re-light between rotation ticks (the
       registered @property --lit interpolates at the rotation cadence). */
    transition: --lit 160ms linear;
    /* G5: the faces carry a STATIC per-face transform (they never re-transform —
       only the parent .cube/.idle-hover/OrbitalDrag container animates), so the
       former resident `will-change: transform` here pinned six permanent
       compositor layers for nothing. Dropped — the parent's transient hint
       promotes the whole 3D subtree while it moves. */

    &.front {
        transform: rotateY(0deg) translateZ(var(--side-offset));
    }
    &.back {
        transform: rotateY(180deg) translateZ(var(--side-offset));
    }
    &.top {
        transform: rotateX(90deg) translateZ(var(--side-offset));
    }
    &.bottom {
        transform: rotateX(-90deg) translateZ(var(--side-offset));
    }
    &.left {
        transform: rotateY(-90deg) translateZ(var(--side-offset));
    }
    &.right {
        transform: rotateY(90deg) translateZ(var(--side-offset));
    }
}

/* L.W11.S2 — the lit-lacquer MATERIAL: a glossy lacquer read over the inline
   crayon backgroundColor (LUMINANCE-only — proof:crayon-preserved unaffected). */
.face-lacquer {
    position: relative;
    overflow: hidden;
    border-radius: inherit;
    /* a fixed diagonal lacquer sheen over the crayon backgroundColor */
    background-image: linear-gradient(
        145deg,
        rgba(255, 255, 255, 0.22) 0%,
        rgba(255, 255, 255, 0) 38%,
        rgba(0, 0, 0, 0.14) 100%
    );
    box-shadow:
        inset 0 1px 0 0 rgba(255, 255, 255, 0.28),
        inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* The re-lit overlay: highlight rises with --lit (face toward the light), shadow
   veil deepens as it falls. The crayon is never recolored — only lit. */
.face-relit {
    border-radius: inherit;
    background:
        /* upper-right specular sweep, strengthening toward the light */
        radial-gradient(
            120% 120% at 78% 18%,
            rgba(255, 255, 255, calc(0.05 + 0.5 * var(--lit, 0.5))) 0%,
            rgba(255, 255, 255, 0) 52%
        ),
        /* a --background-tinted shadow veil that lifts as the face turns away */
        linear-gradient(
            180deg,
            color-mix(in srgb, var(--background) calc((1 - var(--lit, 0.5)) * 46%), transparent) 0%,
            color-mix(in srgb, var(--background) calc((1 - var(--lit, 0.5)) * 62%), transparent) 100%
        );
}

/* The face numeral rides the content plane (z off the named --z-* scale). */
.face-numeral {
    z-index: var(--z-content);
}
/* The drafting-stamp axis tag — Fira-Code annotation, muted axis register (FRAME). */
.face-axis-tag {
    right: 0.55rem;
    bottom: 0.4rem;
    font-family: var(--font-mono);
    font-size: clamp(0.6rem, 1.4cqi, 0.8rem);
    font-weight: 600;
    letter-spacing: 0.04em;
    line-height: 1;
    color: var(--muted-foreground);
    opacity: 0.62;
    font-feature-settings: "tnum";
    z-index: var(--z-content);
}

/* --spin-energy bloom + drop-shadow: the kept physics made VISIBLE — grows with
   live angular motion + the roll flash, bleeds off via the transition. PRM-gated. */
.cube--relit {
    transition:
        filter 240ms var(--ease-standard),
        --spin-energy 220ms var(--ease-standard);
}
@media (prefers-reduced-motion: no-preference) {
    .cube--relit {
        filter: drop-shadow(
            0 calc(2px + var(--spin-energy, 0) * 10px)
                calc(6px + var(--spin-energy, 0) * 22px)
                color-mix(in srgb, var(--color-progress) calc(18% + var(--spin-energy, 0) * 34%), transparent)
        );
    }
    .cube--relit::after {
        content: "";
        position: absolute;
        inset: -40%;
        z-index: var(--z-behind);
        border-radius: 50%;
        pointer-events: none;
        background: radial-gradient(
            circle at 50% 50%,
            color-mix(in srgb, var(--color-progress) calc(var(--spin-energy, 0) * 22%), transparent) 0%,
            transparent 62%
        );
        opacity: var(--spin-energy, 0);
        transition: opacity 240ms var(--ease-standard);
    }
}

/* the live attitude readout chip — bottom-left; .readout-accent + tnum. L.W11 —
   value DEEPENED toward --foreground for WCAG AA (--accent-red TOKEN untouched). */
.cube-attitude {
    position: absolute;
    left: 1rem;
    bottom: 1rem;
    z-index: var(--z-content);
    font-family: var(--font-mono);
    font-size: clamp(0.62rem, 1.3cqi, 0.78rem);
    letter-spacing: 0.02em;
    line-height: 1.2;
    font-feature-settings: "tnum";
    white-space: nowrap;
    color: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 70%, var(--foreground));
}
.cube-attitude__axis {
    color: var(--muted-foreground);
    margin-inline: 0.15em 0.1em;
}
@media (max-width: 1023px) {
    .cube-attitude {
        left: 0.5rem;
        bottom: 0.5rem;
        font-size: var(--type-micro);
    }
}
</style>

