<script setup lang="ts">
/**
 * X.KF.W13X.esc2 · ESC-dock-3 (UIA-KF-132; KF-W13.md addendum (g), COHESION
 * §0er) — Home's dock icon: a living miniature in the `<S>Mini.vue` idiom, so
 * Home is no longer the one lucide monochrome stroke among six colour
 * miniatures (the glyph that read as a disabled or other-kind row).
 *
 * Home is the landing, and its own motion is the hero's ellipsis: the three
 * `TypingDots` beside the title. The miniature plays that motion through
 * keyframes.js from the hero's own contract (`TYPING_DOTS_*`,
 * `typingDotKeyframes`, exported by `TypingDots.vue`): one keyframes animation
 * per dot on the hero's cycle and stepped timing, seated by the library's
 * `stagger` at one step quantum (CYCLE / 8), so the dots march left to right
 * on one grid as they do in the title. The inks are the demo's rainbow, the
 * family the Spring and Sequence miniatures draw from. Flat dots, no gloss
 * (X-DS canon, §0ek).
 *
 * `live` plays (the dock's chosen scene, i.e. on home); otherwise the icon
 * rests as the whole ellipsis, every dot at full ink (the hero's dimmed rest
 * frame is a beat of its pulse, and a 20 px glyph of three faint dots is the
 * disabled look this row replaces). Reduced motion: the engine's gate snaps.
 */
import { markRaw, useTemplateRef } from "vue";
import { stagger } from "@mkbabb/keyframes.js";
import { useLiveMini } from "@composables/useLiveMini";
import { kfEngine } from "@kf-engine";
import {
    TYPING_DOTS_CYCLE_MS,
    TYPING_DOTS_TIMING,
    typingDotKeyframes,
} from "./TypingDots.vue";

const { live = false } = defineProps<{ live?: boolean }>();

const INKS = ["--rainbow-violet", "--rainbow-blue", "--rainbow-cyan"];
const COUNT = INKS.length;
const delays = stagger(COUNT, { each: TYPING_DOTS_CYCLE_MS / 8, from: "first" }).delays(COUNT);

const dotEls = useTemplateRef<HTMLElement[]>("dotEls");

const { CSSKeyframesAnimation } = kfEngine();
const dots = INKS.map((_, i) =>
    markRaw(
        new CSSKeyframesAnimation<{ opacity: number }>({
            duration: TYPING_DOTS_CYCLE_MS,
            delay: delays[i] ?? 0,
            iterationCount: "infinite",
            timingFunction: TYPING_DOTS_TIMING,
            respectReducedMotion: true,
        }).fromKeyframes(typingDotKeyframes()),
    ),
);

useLiveMini(dots, () => live, () => {
    dotEls.value?.forEach((el, i) => dots[i]?.setTargets(el));
});
</script>

<template>
    <span class="scene-mini" :data-live="live ? '' : undefined">
        <span class="row" data-layer="dots">
            <span
                v-for="ink in INKS"
                :key="ink"
                ref="dotEls"
                class="dot"
                :style="{ background: `var(${ink}, currentColor)` }"
            />
        </span>
    </span>
</template>

<style scoped>
.scene-mini {
    position: relative;
    display: inline-block;
    overflow: hidden;
    contain: strict;
}
/* Three dots on the icon's centre line: each a quarter of the icon, 8 % apart,
   so the row spans 91 % and each dot carries the weight of the Spring and
   Sequence miniatures' balls. */
.row {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8%;
}
.dot {
    width: 25%;
    aspect-ratio: 1;
    border-radius: 50%;
}
</style>
