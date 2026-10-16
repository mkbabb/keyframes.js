<script setup lang="ts">
/**
 * KF.W13U.d2 (OA-32) — the Spring scene's dock icon, a bounded miniature of
 * the scene's subject.
 *
 * X-DS r6 pass 10 (KF-C10-04) — THE STAGE'S SUBJECT, NOT THE RETIRED FIELD.
 * The icon drew the pre-W13X preset field: four tinted lanes ending in dots,
 * which is the Sequence glyph's own idiom, so the two read alike in the dock.
 * It now draws what the stage draws: a ball on a rail springing into the
 * dashed target ring, driven by keyframes.js under `springTimingFunction` of
 * the scene's born spring (the `smooth` preset, `useSpringDemo`'s initial
 * response and damping) over its settle window (`response × 4`). The rail
 * stops at the ring's edge, so the ring stays empty (KF-C10-07). One ink, the
 * scene's progress tone.
 *
 * X-DS r7 pass 6 (KF-C6-03) — THE ICONS' COMMON WEIGHT. Drawn subordinate
 * (a 1.5 px rail at 45 %, a 4-unit ball, a 7-unit ring) the glyph was a faint
 * speck beside the Easing curve, the Sequence lanes and the Cube, and the dock
 * tile read as empty. As KF-C2-11 did for Square, the marks take the strip's
 * weight: the rail is full ink at 2 px, the ball 5.5 units, the ring 8.5
 * units with its 1.5 px dash. No colour or motion change.
 *
 * The sweep is translateX 0 → 100% of a carriage whose width IS the travel
 * (rail start → ring centre); the root clips and contains its paint. `live`
 * plays (the dock's chosen scene while its transport plays); otherwise the
 * ball rests at the rail's start. Reduced motion: the engine's gate snaps.
 */
import { markRaw, useTemplateRef } from "vue";
import { useLiveMini } from "@composables/useLiveMini";
import { springTimingFunction } from "@mkbabb/keyframes.js";
import { kfEngine } from "@kf-engine";
import { SPRING_BASE, SPRING_PRESETS } from "./springPresets";

const { live = false } = defineProps<{ live?: boolean }>();

const BORN = SPRING_PRESETS[0]!;
const SWEEP = `@keyframes spring-chase {
    from { transform: translateX(0%); }
    to   { transform: translateX(100%); }
}`;

const carriageEl = useTemplateRef<HTMLElement>("carriageEl");

const { CSSKeyframesAnimation } = kfEngine();
const chase = markRaw(
    new CSSKeyframesAnimation({
        duration: BORN.response * 4 * 1000,
        iterationCount: "infinite",
        direction: "alternate",
        timingFunction: springTimingFunction({
            response: BORN.response,
            dampingFraction: BORN.dampingFraction,
        }),
        respectReducedMotion: SPRING_BASE.respectReducedMotion,
    }).fromString(SWEEP),
);

useLiveMini(chase, () => live, () => chase.setTargets(carriageEl.value!));
</script>

<template>
    <span class="scene-mini" :data-live="live ? '' : undefined">
        <span class="layer" data-layer="rail">
            <span class="rail" />
            <span class="target" />
        </span>
        <span class="layer" data-layer="ball">
            <span ref="carriageEl" class="carriage">
                <span class="ball" />
            </span>
        </span>
    </span>
</template>

<style scoped>
.scene-mini {
    position: relative;
    display: inline-block;
    overflow: hidden;
    contain: strict;
    --mini-ink: var(--color-progress, currentColor);
}
.layer {
    position: absolute;
    inset: 0;
}
/* The box is 20 units: the rail at y 10 from x 2 to the ring's edge
   (x 10.75), the dashed target ring centred at x 15 (8.5 units across), the
   ball 5.5 units riding x 3 → 15 (its carriage starts half a ball left of 3).
   The ring's class is `.target`: `.ring` is a Tailwind utility (a box-shadow
   ring) and would paint over it. */
.rail {
    position: absolute;
    top: 50%;
    left: 10%;
    right: 46.25%;
    height: 2px;
    margin-top: -1px;
    border-radius: 1px;
    background: var(--mini-ink);
}
.target {
    position: absolute;
    top: 50%;
    left: 75%;
    width: 42.5%;
    aspect-ratio: 1;
    translate: -50% -50%;
    border: 1.5px dashed var(--mini-ink);
    border-radius: 50%;
    opacity: 0.6;
}
.carriage {
    position: absolute;
    top: 36.25%;
    left: 1.25%;
    width: 60%;
    height: 27.5%;
}
.ball {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: var(--mini-ink);
}
</style>
