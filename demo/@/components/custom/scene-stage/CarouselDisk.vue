<script setup lang="ts">
/**
 * CarouselDisk — the perspective viewport + tilted ring (design §6). Binds each
 * card's transform off `orbit.derive()` (a pure fn of the LIVE spring angle, so
 * the whole ring eases as ONE interruptible motion). Owns the shared LOD clock
 * (provide) + the fan-in reveal (`stagger(from:"center")`). Hosts StageCards.
 * The gesture surface (drag/wheel) is bound by the parent onto `diskEl`.
 *
 * Lit tier (design §8): FRONT + 2 FLANKS are LIVE; REAR is UNMOUNTED (v-if) — the
 * "light = life" structural cap (≤3 live desktop, 1 mobile).
 */
import { computed, provide, ref, watch } from "vue";
import { stagger } from "@mkbabb/keyframes.js";
import StageCard from "./StageCard.vue";
import {
    useLivePreviewLOD,
    type LivePreviewLOD,
} from "./composables/useLivePreviewLOD";
import { SCENE_STAGE_LOD_KEY } from "./composables/lodKey";
import type { CarouselOrbit } from "./composables/useCarouselOrbit";
import { sceneStageEntries } from "./sceneStageRegistry";

const props = defineProps<{
    orbit: CarouselOrbit;
    reducedMotion: boolean;
    mobile: boolean;
    /** true during fanning-in / carousel / committing — cards are revealed. */
    revealed: boolean;
    radiusPx: number;
    /** D5: the committing payoff — the armed/front card presses toward the viewer. */
    committing?: boolean;
    armedId?: string | null;
    /** True while the orbit spring is chasing its target (gates GL create, D3.3). */
    spinning?: boolean;
}>();

const entries = sceneStageEntries;
const N = entries.length;
const step = 360 / N;

// ── the shared LOD clock (design §8) — ONE per disk, provided to every host ──
// D9.2: maxConcurrentFull = 1 (desktop AND mobile). "Only the stage under the
// beam runs at full rate"; the flanks idle at 18fps (the penumbra). The prior
// 2+1 gave a flank a bigger budget than the light-is-life story allows.
const lod: LivePreviewLOD = useLivePreviewLOD({
    fullFps: 60,
    flankFps: 18,
    maxConcurrentFull: 1,
});
provide(SCENE_STAGE_LOD_KEY, lod);

const diskEl = ref<HTMLElement | null>(null);
defineExpose({ diskEl });

// fan-in reveal delays (stagger from center) — the LIGHT-barrel orchestration
const revealDelays = stagger(N, { each: 55, from: "center" });

function angleOf(i: number): number {
    let a = ((i * step - props.orbit.angle.value) % 360 + 360) % 360;
    if (a > 180) a -= 360;
    return Math.abs(a);
}

// ── D9.1: the lit boundary is a BAND, not a threshold (hysteresis). A multi-slot
// decay flick sweeps cards through [1.5, 2.5]·step without a single mount/unmount
// cycle — churn only when a card genuinely leaves the neighborhood. Mobile lights
// the FRONT only (flanks are unlit slivers, D9.2). ──
const litMountT = computed(() => (props.mobile ? step * 0.5 : step * 1.5));
const litUnmountT = computed(() => (props.mobile ? step * 1.0 : step * 2.5));
// D8.1: mobile cull beyond ±2 slots, same hysteresis discipline one ring out.
const CULL_MOUNT = step * 2.25;
const CULL_UNMOUNT = step * 2.5;

// ── B1/B2/B3 (round 3): the OCCLUSION face-fade + the VISUAL/MOUNT decouple. ──
// The round-2 rear-label fade keyed off depth (a/180) and only touched the
// nameplate past d>0.5, so occluded nameplates/breadcrumbs/glyphs still bled
// through the nearer flank glass (B1) — and through the FRONT card on mobile
// (B2). The cure: fade the WHOLE occluded card FACE (preview + poster + plate)
// by OCCLUSION GEOMETRY. A card whose slot sits BEHIND a nearer shell drops its
// face to 0 by the time the overlap begins:
//   • desktop — the ±1 flanks are the occluder band; any card at |a| past the
//     flank (→ slot ±2 and beyond) is behind a flank → face → 0.
//   • mobile  — the FRONT card is the sole occluder; every non-front card is
//     behind it → face → 0 (the edge slivers become clean glass, no bleed).
// occlusion ∈ [0,1]: 1 = in the clear (front + immediate flank), 0 = occluded.
const OCC_START = computed(() => (props.mobile ? step * 0.55 : step * 1.3));
const OCC_END = computed(() => (props.mobile ? step * 1.0 : step * 1.9));

const litFlags = ref<boolean[]>(entries.map((_, i) => i === 0));
const presentFlags = ref<boolean[]>(entries.map(() => true));

function updateBands(): void {
    const lit = litFlags.value.slice();
    const present = presentFlags.value.slice();
    let litChanged = false;
    let presChanged = false;
    for (let i = 0; i < N; i++) {
        const a = angleOf(i);
        if (!lit[i] && a <= litMountT.value) {
            lit[i] = true;
            litChanged = true;
        } else if (lit[i] && a > litUnmountT.value) {
            lit[i] = false;
            litChanged = true;
        }
        if (props.mobile) {
            if (!present[i] && a <= CULL_MOUNT) {
                present[i] = true;
                presChanged = true;
            } else if (present[i] && a > CULL_UNMOUNT) {
                present[i] = false;
                presChanged = true;
            }
        } else if (!present[i]) {
            present[i] = true;
            presChanged = true;
        }
    }
    if (litChanged) litFlags.value = lit;
    if (presChanged) presentFlags.value = present;
}
watch(() => props.orbit.angle.value, updateBands, { immediate: true });
watch(() => props.mobile, updateBands);

const cards = computed(() =>
    entries.map((entry, i) => {
        const derived = props.orbit.derive(i);
        const a = angleOf(i);
        const front = a < step / 2;
        // MOUNT authority (hysteresis) — keeps the preview host alive across the
        // [1.5,2.5]·step band so a multi-slot flick never churns mount/unmount.
        const lit = litFlags.value[i] ?? false;
        const present = presentFlags.value[i] ?? true;
        // D4.5: the penumbra ramp — k∈[0,1] over |a|∈[step/2, 1.5·step], driven
        // continuously by the orbit angle (no threshold pop). front = 0.
        const k = Math.max(0, Math.min(1, (a - step / 2) / step));
        const pressed = !!props.committing && front;
        // B1/B2: the occlusion face-fade (1 in the clear → 0 fully occluded).
        const occlusion =
            1 -
            clamp01((a - OCC_START.value) / (OCC_END.value - OCC_START.value));
        // B3: VISUAL (paint) authority, DECOUPLED from mount. Paint the live
        // preview ONLY where the face is still in the clear (a < OCC_END); a
        // hysteresis-residual card stays MOUNTED (lit) but wears its poster face
        // — no bright miniature UI in the payoff penumbra.
        const showPreview = lit && a < OCC_END.value;
        // D3.3: the GL create gate — front AND settled (never mid-transit).
        const settled = front && !props.spinning;
        return {
            entry,
            i,
            derived,
            front,
            lit,
            present,
            penumbra: k,
            pressed,
            occlusion,
            showPreview,
            settled,
        };
    }),
);

const ringStyle = computed(() => ({
    transform: `rotateX(-15deg)`,
}));

function clamp01(v: number): number {
    return Math.max(0, Math.min(1, v));
}
</script>

<template>
    <div
        ref="diskEl"
        class="carousel-viewport"
        :class="{ 'is-mobile': mobile }"
        role="listbox"
        aria-orientation="horizontal"
        aria-label="Scenes"
        :style="{ '--ring-radius': radiusPx + 'px' }"
    >
        <div class="carousel-ring" :style="ringStyle">
            <StageCard
                v-for="c in cards"
                v-show="c.present"
                :key="c.entry.id"
                :entry="c.entry"
                :index="c.i"
                :total="N"
                :derived="c.derived"
                :front="c.front"
                :lit="c.lit"
                :show-preview="c.showPreview"
                :occlusion="c.occlusion"
                :penumbra="c.penumbra"
                :pressed="c.pressed"
                :settled="c.settled"
                :reduced-motion="reducedMotion"
                :revealed="revealed"
                :reveal-delay-ms="reducedMotion ? 0 : revealDelays[c.i] ?? 0"
            />
        </div>
    </div>
</template>

<style scoped>
.carousel-viewport {
    position: absolute;
    inset: 0;
    perspective: 1100px;
    perspective-origin: 50% 42%;
    touch-action: none;
    /* D7: the turntable affordance. */
    cursor: grab;
}
.carousel-viewport:active {
    cursor: grabbing;
}
.carousel-viewport.is-mobile {
    perspective: 900px;
    /* D8.3: drop the origin so the ring settles toward the pool; the top-half
       dead zone shrinks under the marquee-below-ring composition. */
    perspective-origin: 50% 52%;
}
.carousel-ring {
    position: absolute;
    left: 50%;
    top: 46%;
    width: 0;
    height: 0;
    transform-style: preserve-3d;
}
</style>
