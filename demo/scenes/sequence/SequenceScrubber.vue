<template>
    <!-- Master scrubber — the F.W16 rail/ball idiom; the storyboard's editable
         CONTENT (the playhead the user scrubs), not transport chrome (the bottom
         TransportDock IS the transport, XH-2 / §c). Colocated sub-unit of
         SequenceTarget (J.WZ — split at the scrubber seam to hold the ≤500L
         demo ceiling; it injects ONLY `demo`, no Target-private state). -->
    <div class="px-4 py-3 border-t border-border/40 shrink-0">
        <div class="flex items-center justify-between mb-2">
            <!-- L.W11 S7 — the instrument-panel micro-cap eyebrow (Fira Code,
                 letter-spaced) names the master clock; the lit timecode reads it. -->
            <span class="seq-eyebrow text-mono-caption text-muted-foreground">master playhead</span>
            <!-- L.W11 S7 — the LIT phosphor timecode: the master clock made the
                 brightest number on the page (tnum, always-three-digits, phosphor
                 text-shadow keyed to the master red). It is `0.000` so it clicks
                 like a counter. -->
            <span class="seq-timecode readout-accent text-mono-caption tabular-nums">{{ demo.progress.value.toFixed(3) }}</span>
        </div>
        <div
            ref="scrubEl"
            class="seq-scrub relative w-full h-9 cursor-pointer select-none"
            :class="{ 'is-scrubbing': scrubbing }"
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
import { inject, ref, useTemplateRef } from "vue";

import { useDragScrub } from "@composables/useDragScrub";
import { SEQUENCE_DEMO_KEY } from "./sequenceKeys";

const demo = inject(SEQUENCE_DEMO_KEY)!;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// ── Master scrubber: drag/keyboard scrubs the Sequence progress ──────────────
// The drag rides the shared `useDragScrub` seam (H.W12.S1 / I8); `project` is the
// clamped rail rect-ratio.
const scrubEl = useTemplateRef<HTMLElement>("scrubEl");

// L.W11 S7 — the IGNITION-CASCADE heat: while the master scrub is held, the
// whole storyboard well runs hotter (a `.is-scrubbing` class lifts --seq-glow,
// scoped to the stage via demo.setScrubbing). The lane balls then DETONATE in a
// diagonal cascade under the thumb — but the cascade is the ENGINE's own work:
// `Sequence.scrub` drives each child's `--ball-p` 0→1, and the per-lane glow in
// SequenceTarget scales its box-shadow bloom with `--ball-p` (no new rAF, no
// second writer — inv ζ). This handler only reports the GESTURE (scrub start/end
// + the drag direction) so the cascade direction flips on a drag-back.
const scrubbing = ref(false);
let lastP = 0;

// `onScrub` — the detonate driver. Each scrub sample re-reads the master clock
// (demo.scrub → Sequence.progress), which the engine fans out to the lanes as a
// DIAGONAL cascade; the direction (forward = violet→green, back = cooling in
// reverse) is recorded so the stage can chase the thumb correctly.
const onScrub = (p: number) => {
    demo.setScrubDir(p >= lastP ? 1 : -1);
    lastP = p;
    demo.scrub(p);
};

const { onPointerDown: onScrubDownRaw } = useDragScrub({
    el: scrubEl,
    project: (e) => {
        const el = scrubEl.value;
        if (!el) return demo.progress.value;
        const rect = el.getBoundingClientRect();
        return clamp01((e.clientX - rect.left) / rect.width);
    },
    onScrub,
    onStart: () => {
        scrubbing.value = true;
        lastP = demo.progress.value;
        demo.setScrubbing(true);
    },
    onEnd: () => {
        scrubbing.value = false;
        demo.setScrubbing(false);
    },
});

const onScrubDown = (e: PointerEvent) => onScrubDownRaw(e);

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

/* L.W11 S7 — the instrument-panel micro-cap label convention (Fira Code,
   uppercase, letter-spaced, dim). Tiny + precise — the "MASTER PLAYHEAD" stamp. */
.seq-eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.18em;
}

/* L.W11 S7 — the LIT phosphor TIMECODE. The master clock is the brightest number
   on the page: tnum figures + a phosphor text-shadow keyed to the master red
   (--ball-tone resolves to --color-progress here — the one master authority). It
   already reads `0.000` (toFixed(3)), so it clicks like a counter. The bloom
   lifts a hair while scrubbing via the stage's shared light (here a static
   phosphor halo; the cascade carries the live heat). */
.seq-timecode {
    font-feature-settings: "tnum" 1;
    text-shadow: 0 0 8px
        color-mix(in srgb, var(--ball-tone, var(--color-progress)) 40%, transparent);
}

/* The scrub rail runs hotter under an active drag — the ball blooms as you
   conduct (the same scrub-heat the storyboard well lifts). CONSUME the promoted
   .progress-ball idiom's --ball-glow parameter (design-idioms.css:584) rather
   than re-authoring its box-shadow — the idiom owns the 0 2px glow shape; the
   scene only lifts the glow strength (35% → 60%) under the active scrub. */
.seq-scrub.is-scrubbing .scrub-ball {
    --ball-glow: 60%;
}

/* The master scrub-ball — positioned by Vue (the one ball the engine does not
   paint), at the idiom-default --ball-size + full glow: the DOMINANT ball that
   drives the whole storyboard (SEQ-12). */
.scrub-ball {
    margin-left: calc(var(--ball-size, 36px) / -2);
    will-change: left;
}
</style>
