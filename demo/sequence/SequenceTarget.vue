<template>
    <div class="flex flex-col items-center justify-center gap-4 h-full w-full px-6 lg:px-8 max-w-3xl mx-auto overflow-hidden dock-inset">
        <div class="glass-card w-full flex-1 min-h-0 flex flex-col overflow-hidden">
            <!-- Header: title + live master progress read-out -->
            <div class="flex items-center justify-between px-4 py-2.5 border-b border-border/40 shrink-0">
                <div class="flex items-baseline gap-3 min-w-0">
                    <span class="text-heading text-foreground truncate">Sequence</span>
                    <span class="text-mono-caption text-muted-foreground tabular-nums whitespace-nowrap">
                        stagger &times; {{ ROW_COUNT }} &middot; progress {{ (demo.progress.value * 100).toFixed(0) }}%
                    </span>
                </div>
                <span
                    class="status-badge text-admin-label px-2 py-0.5 rounded-full"
                    :class="demo.isReversed.value ? 'reverse-badge' : (demo.isPlaying.value ? 'tracking-badge' : 'settled-badge')"
                >{{ demo.isReversed.value ? "reverse" : (demo.isPlaying.value ? "playing" : "ready") }}</span>
            </div>

            <!-- The staggered storyboard: one rail+ball per Sequence child -->
            <div class="flex-1 min-h-0 flex flex-col justify-center gap-3 px-6 py-6">
                <div
                    v-for="row in demo.rows.value"
                    :key="row.index"
                    class="seq-row flex items-center gap-3"
                >
                    <span class="text-mono-caption text-muted-foreground tabular-nums shrink-0 w-20 text-right pr-2">
                        @{{ Math.round(row.at) }}ms
                    </span>
                    <div
                        :ref="(el) => setRowEl(row.index, el as HTMLElement | null)"
                        class="seq-track relative flex-1 h-10"
                    >
                        <div class="progress-rail"></div>
                        <!-- The ball position is painted by the engine into
                             --ball-p (0→1) on this element; CSS reads it. -->
                        <div class="progress-ball seq-ball"></div>
                    </div>
                </div>
            </div>

            <!-- Master scrubber — the F.W16 rail/ball idiom for the playhead -->
            <div class="px-4 py-3 border-t border-border/40 shrink-0">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-small text-foreground">master playhead</span>
                    <span class="text-mono-caption text-muted-foreground tabular-nums">{{ demo.progress.value.toFixed(3) }}</span>
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

                <!-- The F.W9 transport — play/pause, reverse, timeScale, reset.
                     Exercises the COMPLETE Sequence transport (not just play/
                     stop), the F.W10.S3 gate clause. -->
                <div class="grid grid-cols-4 gap-2 mt-3">
                    <Button
                        variant="outline"
                        class="h-8 w-full rounded-full gap-1.5 text-small btn-interactive"
                        aria-label="Play or pause the sequence"
                        @click="demo.togglePlay()"
                    >
                        <component :is="demo.isPlaying.value ? Pause : Play" class="w-4 h-4" />
                        <span>{{ demo.isPlaying.value ? "Pause" : "Play" }}</span>
                    </Button>
                    <Button
                        variant="outline"
                        class="h-8 w-full rounded-full gap-1.5 text-small btn-interactive"
                        :class="{ 'transport-active': demo.isReversed.value }"
                        aria-label="Reverse the sequence direction"
                        @click="demo.reverse()"
                    >
                        <Rewind class="w-4 h-4" />
                        <span>Reverse</span>
                    </Button>
                    <Button
                        variant="outline"
                        class="h-8 w-full rounded-full gap-1.5 text-small btn-interactive"
                        aria-label="Cycle the sequence time scale"
                        @click="cycleTimeScale()"
                    >
                        <Gauge class="w-4 h-4" />
                        <span class="tabular-nums">{{ demo.timeScale.value }}&times;</span>
                    </Button>
                    <Button
                        variant="outline"
                        class="h-8 w-full rounded-full gap-1.5 text-small btn-interactive"
                        aria-label="Reset the sequence to the start"
                        @click="demo.reset()"
                    >
                        <RotateCcw class="w-4 h-4" />
                        <span>Reset</span>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, useTemplateRef } from "vue";
import { useEventListener } from "@vueuse/core";
import { Button } from "@mkbabb/glass-ui";
import { Pause, Play, Rewind, Gauge, RotateCcw } from "@lucide/vue";

import { SEQUENCE_DEMO_KEY } from "./sequenceKeys";
import { ROW_COUNT } from "./useSequenceDemo";

const demo = inject(SEQUENCE_DEMO_KEY)!;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// timeScale cycle: slow-mo → real-time → fast-forward (the F.W9 transport).
const TIME_SCALES = [0.5, 1, 2];
const cycleTimeScale = () => {
    const i = TIME_SCALES.indexOf(demo.timeScale.value);
    demo.setTimeScale(TIME_SCALES[(i + 1) % TIME_SCALES.length]!);
};

// Per-row track elements — each becomes its child animation's target so the
// engine paints `--ball-p` directly onto it (no per-frame Vue work).
const rowEls: (HTMLElement | null)[] = Array(ROW_COUNT).fill(null);
const setRowEl = (i: number, el: HTMLElement | null) => {
    rowEls[i] = el;
};

onMounted(() => {
    for (let i = 0; i < ROW_COUNT; i++) {
        const el = rowEls[i];
        if (el) demo.childAnims[i]!.setTargets(el);
    }
    // Paint the initial (t=0) frame so balls rest at their rail origin.
    demo.sequence.seek(0);
});

// ── Master scrubber: drag/keyboard scrubs the Sequence progress ──────────────
const scrubEl = useTemplateRef<HTMLElement>("scrubEl");

const progressFromEvent = (e: PointerEvent): number => {
    const el = scrubEl.value;
    if (!el) return demo.progress.value;
    const rect = el.getBoundingClientRect();
    return clamp01((e.clientX - rect.left) / rect.width);
};

let scrubbing = false;

const onScrubDown = (e: PointerEvent) => {
    scrubbing = true;
    scrubEl.value?.setPointerCapture(e.pointerId);
    demo.scrub(progressFromEvent(e));
};

useEventListener(window, "pointermove", (e: PointerEvent) => {
    if (!scrubbing) return;
    demo.scrub(progressFromEvent(e));
});

useEventListener(window, "pointerup", () => {
    scrubbing = false;
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
.seq-track,
.seq-scrub {
    display: flex;
    align-items: center;
}

/* The per-row ball rides the engine-painted --ball-p (0→1), so it travels the
   rail with NO per-frame Vue work. It consumes the shared .progress-ball idiom
   (design-idioms.css): only the per-site variation lives here — the rail-relative
   horizontal position (the idiom centers vertically via margin-top) and a small
   live-ball size. The --ball-p default keeps the ball at the origin before the
   engine first paints it. */
.seq-ball {
    --ball-p: 0;
    --ball-size: 1.4rem;
    left: calc(var(--ball-p) * (100% - var(--ball-size)));
    will-change: left;
}

/* The master scrub-ball is positioned by Vue (`left:` from demo.progress) — the
   one ball the engine does not paint, since it tracks the master playhead. */
.scrub-ball {
    --ball-size: 1.25rem;
    margin-left: calc(var(--ball-size) / -2);
    will-change: left;
}

/* The active-reverse transport affordance — tints the Reverse button while the
   playhead walks backward (reads from the demo's progress tone). NOT a status
   badge — a distinct button-tint primitive, so it stays scoped. */
.transport-active {
    background: color-mix(in srgb, var(--color-progress) 16%, transparent);
    border-color: color-mix(in srgb, var(--color-progress) 40%, transparent);
}
</style>
