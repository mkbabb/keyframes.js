<script setup lang="ts">
/**
 * MiniPreview — a per-scene LIVE miniature driven by the shared LOD clock's
 * `tick` (design §8: "light = life"). Every visual derives from `tick`, so the
 * front card (full cadence) visibly races while the flanks (18fps) idle — the
 * DOM mutation IS the liveness proof the gate reads. `square` mounts the REAL
 * SquareInstrument target fed engine-derived deflection.
 *
 * inv ζ: the ONE driver is the shared RAFPlayback clock in useLivePreviewLOD; no
 * preview owns a rAF. value.js-free (proof:boundary).
 */
import { computed } from "vue";
import SquareInstrument from "../../../../scenes/square/SquareInstrument.vue";
import type { SceneStageEntry } from "./sceneStageRegistry";

const props = defineProps<{
    entry: SceneStageEntry;
    /** The shared-clock frame token (advances only on this card's due frames). */
    tick: number;
    /** Full-rate front card? (drives cadence-honest phase speed). */
    front: boolean;
    /** D3.3: for the webgl tier, false → the static POSTER; true → live render. */
    glLive?: boolean;
    reducedMotion: boolean;
}>();

// A continuous phase from the clock tick. Front advances at full cadence; the
// flank ticks arrive at 18fps so its phase visibly crawls — the cadence shows.
const phase = computed(() => (props.reducedMotion ? 0.25 : props.tick * 0.06));

const cubeStyle = computed(() => ({
    transform: `rotateX(${-20 + Math.sin(phase.value) * 18}deg) rotateY(${phase.value * 40}deg)`,
}));

// easing ball tracing an ease-in-out along a sine baseline
const easeX = computed(() => {
    const t = (Math.sin(phase.value) + 1) / 2; // 0..1
    const e = t * t * (3 - 2 * t); // smoothstep
    return e * 100;
});
const easeY = computed(() => 50 - Math.sin(phase.value * 2) * 22);

// spring bob (damped-looking from a decaying sine)
const springY = computed(() => {
    const d = Math.exp(-((phase.value % 6.28) / 6.28) * 2.2);
    return 50 - Math.sin(phase.value * 3) * 34 * d;
});

// sequence staggered bars
const bars = computed(() =>
    Array.from({ length: 5 }, (_, i) => {
        const p = (Math.sin(phase.value - i * 0.5) + 1) / 2;
        return 20 + p * 70;
    }),
);

// motion-path dot along a closed loop
const pathT = computed(() => (phase.value * 8) % 100);

// morph blob — border radius wander
const morph = computed(() => {
    const a = 40 + Math.sin(phase.value) * 25;
    const b = 60 - Math.sin(phase.value * 1.3) * 25;
    const c = 50 + Math.cos(phase.value * 0.8) * 20;
    const d = 50 - Math.cos(phase.value) * 20;
    return { borderRadius: `${a}% ${b}% ${c}% ${d}% / ${d}% ${c}% ${b}% ${a}%` };
});

// amiga fake-3D sphere sheen. D3.3: when NOT glLive (flank/rear or a pending
// dispose), the sphere freezes to a STATIC poster — the live sheen only animates
// while the GL context is front-settled.
const amigaBg = computed(() => {
    const live = props.glLive !== false;
    const x = live ? 50 + Math.sin(phase.value) * 22 : 42;
    const y = live ? 40 + Math.cos(phase.value) * 18 : 34;
    return {
        background: `radial-gradient(circle at ${x}% ${y}%, #fff 0%, ${props.entry.tone} 35%, #0b1020 90%)`,
    };
});

// square: engine-derived deflection fed to the REAL target
const deflX = computed(() => (props.reducedMotion ? 0.2 : Math.sin(phase.value) * 0.8));
const deflY = computed(() => (props.reducedMotion ? 0.1 : Math.cos(phase.value * 1.2) * 0.8));
const readout = (v: number) => v.toFixed(2);
</script>

<template>
    <div class="mini" :style="{ '--tone': entry.tone }">
        <!-- CUBE -->
        <div v-if="entry.kind === 'cube'" class="mini-stage">
            <div class="mini-cube" :style="cubeStyle">
                <span v-for="f in 6" :key="f" :class="`face face-${f}`"></span>
            </div>
        </div>

        <!-- AMIGA (webgl tier) -->
        <div v-else-if="entry.kind === 'amiga'" class="mini-stage">
            <div class="mini-sphere" :style="amigaBg"></div>
        </div>

        <!-- SQUARE — the REAL scene target -->
        <div v-else-if="entry.kind === 'square'" class="mini-square">
            <SquareInstrument
                :defl-x="deflX"
                :defl-y="deflY"
                :settled="reducedMotion"
                :tether-active="!reducedMotion"
                :readout-x="readout(deflX)"
                :readout-y="readout(deflY)"
                :tumble-hint-shown="false"
            />
        </div>

        <!-- EASING -->
        <svg v-else-if="entry.kind === 'easing'" class="mini-svg" viewBox="0 0 100 60" preserveAspectRatio="none">
            <path d="M0,50 C30,50 40,10 60,10 S90,50 100,10" fill="none" stroke="var(--tone)" stroke-width="2" opacity="0.55" />
            <circle :cx="easeX" :cy="easeY" r="5" fill="var(--tone)" />
        </svg>

        <!-- SPRING -->
        <div v-else-if="entry.kind === 'spring'" class="mini-stage">
            <div class="mini-rail"></div>
            <div class="mini-ball" :style="{ top: springY + '%' }"></div>
        </div>

        <!-- SEQUENCE -->
        <div v-else-if="entry.kind === 'sequence'" class="mini-seq">
            <div v-for="(h, i) in bars" :key="i" class="seq-bar" :style="{ height: h + '%' }"></div>
        </div>

        <!-- MOTION-PATH -->
        <svg v-else-if="entry.kind === 'motion-path'" class="mini-svg" viewBox="0 0 100 60" preserveAspectRatio="none">
            <path id="mp" d="M12,30 C12,8 88,8 88,30 C88,52 12,52 12,30 Z" fill="none" stroke="var(--tone)" stroke-width="2" opacity="0.5" />
            <circle r="5" fill="var(--tone)">
                <animateMotion :key="Math.floor(pathT)" dur="0.001s" fill="freeze" :keyPoints="`${pathT / 100};${pathT / 100}`" keyTimes="0;1" calcMode="linear">
                    <mpath href="#mp" />
                </animateMotion>
            </circle>
        </svg>

        <!-- MORPH -->
        <div v-else-if="entry.kind === 'morph'" class="mini-stage">
            <div class="mini-blob" :style="morph"></div>
        </div>
    </div>
</template>

<style scoped>
.mini {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    overflow: hidden;
}
.mini-stage {
    position: relative;
    width: 78%;
    height: 78%;
    perspective: 320px;
    display: grid;
    place-items: center;
}
.mini-svg {
    width: 84%;
    height: 70%;
}
/* cube */
.mini-cube {
    position: relative;
    width: 46%;
    aspect-ratio: 1;
    transform-style: preserve-3d;
}
.face {
    position: absolute;
    inset: 0;
    opacity: 0.92;
    border: 1px solid rgba(255, 255, 255, 0.35);
}
.face-1 { background: #ff2d95; transform: translateZ(24px); }
.face-2 { background: #ffd500; transform: rotateY(90deg) translateZ(24px); }
.face-3 { background: #00c2ff; transform: rotateY(180deg) translateZ(24px); }
.face-4 { background: #7c4dff; transform: rotateY(-90deg) translateZ(24px); }
.face-5 { background: #29e0a0; transform: rotateX(90deg) translateZ(24px); }
.face-6 { background: #ff7043; transform: rotateX(-90deg) translateZ(24px); }
/* amiga */
.mini-sphere {
    width: 62%;
    aspect-ratio: 1;
    border-radius: 50%;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}
/* square real target */
.mini-square {
    position: relative;
    width: 92%;
    height: 92%;
    display: grid;
    place-items: center;
}
.mini-square :deep(svg),
.mini-square :deep(.square-field) {
    max-width: 100%;
}
/* spring */
.mini-rail {
    position: absolute;
    left: 50%;
    top: 12%;
    bottom: 12%;
    width: 3px;
    transform: translateX(-50%);
    background: color-mix(in srgb, var(--tone) 30%, transparent);
    border-radius: 3px;
}
.mini-ball {
    position: absolute;
    left: 50%;
    width: 26px;
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: var(--tone);
    box-shadow: 0 4px 14px color-mix(in srgb, var(--tone) 55%, transparent);
}
/* sequence */
.mini-seq {
    display: flex;
    align-items: flex-end;
    gap: 8%;
    width: 76%;
    height: 66%;
}
.seq-bar {
    flex: 1;
    background: var(--tone);
    border-radius: 4px 4px 2px 2px;
    opacity: 0.9;
}
/* morph */
.mini-blob {
    width: 56%;
    aspect-ratio: 1;
    background: var(--tone);
    box-shadow: 0 10px 30px color-mix(in srgb, var(--tone) 45%, transparent);
}
</style>
