<template>
    <!-- Master scrubber — the F.W16 rail/ball idiom; the storyboard's editable
         CONTENT (the playhead the user scrubs), not transport chrome (the bottom
         TransportDock IS the transport, XH-2 / §c). Colocated sub-unit of
         SequenceTarget (J.WZ — split at the scrubber seam to hold the ≤500L
         demo ceiling; it injects ONLY `demo`, no Target-private state). -->
    <div class="px-4 py-3 border-t border-border/40 shrink-0">
        <div class="flex items-center justify-between mb-2">
            <span class="text-small text-foreground">master playhead</span>
            <span class="readout-accent text-mono-caption tabular-nums">{{ demo.progress.value.toFixed(3) }}</span>
        </div>
        <div
            ref="scrubEl"
            class="seq-scrub relative w-full h-9 cursor-pointer select-none"
            role="slider"
            aria-label="Scrub the sequence master playhead"
            :aria-valuenow="Math.round(demo.progress.value * 100)"
            aria-valuemin="0"
            aria-valuemax="100"
            tabindex="0"
            @pointerdown="onScrubDown"
            @keydown="onScrubKeydown"
        >
            <div class="progress-rail"></div>
            <div
                class="progress-ball scrub-ball"
                :style="{ left: `calc(${clamp01(demo.progress.value) * 100}%)` }"
            ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, useTemplateRef } from "vue";

import { useDragScrub } from "@composables/useDragScrub";
import { SEQUENCE_DEMO_KEY } from "./sequenceKeys";

const demo = inject(SEQUENCE_DEMO_KEY)!;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// ── Master scrubber: drag/keyboard scrubs the Sequence progress ──────────────
// The drag rides the shared `useDragScrub` seam (H.W12.S1 / I8); `project` is the
// clamped rail rect-ratio.
const scrubEl = useTemplateRef<HTMLElement>("scrubEl");

const { onPointerDown: onScrubDown } = useDragScrub({
    el: scrubEl,
    project: (e) => {
        const el = scrubEl.value;
        if (!el) return demo.progress.value;
        const rect = el.getBoundingClientRect();
        return clamp01((e.clientX - rect.left) / rect.width);
    },
    onScrub: (p) => demo.scrub(p),
});

const onScrubKeydown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        demo.scrub(demo.progress.value + 0.05);
        e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        demo.scrub(demo.progress.value - 0.05);
        e.preventDefault();
    } else if (e.key === "Home") {
        demo.scrub(0);
        e.preventDefault();
    } else if (e.key === "End") {
        demo.scrub(1);
        e.preventDefault();
    }
};
</script>

<style scoped>
.seq-scrub {
    display: flex;
    align-items: center;
}

/* The master scrub-ball — positioned by Vue (the one ball the engine does not
   paint), at the idiom-default --ball-size + full glow: the DOMINANT ball that
   drives the whole storyboard (SEQ-12). */
.scrub-ball {
    margin-left: calc(var(--ball-size, 36px) / -2);
    will-change: left;
}
</style>
