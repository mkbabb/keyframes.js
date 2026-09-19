<template>
    <!-- Master scrubber — the rail/ball idiom; the MASTER CLOCK's scrub surface
         (the storyboard's one INSTRUMENT verb — it drives the phosphor playhead
         in the stage), not transport chrome (the bottom TransportDock IS the
         transport). Colocated sub-unit of SequenceTarget (split at the scrubber
         seam to hold the ≤500L demo ceiling; it injects ONLY `demo`, no
         Target-private state). -->
    <div class="px-4 py-3 border-t border-border/40 shrink-0">
        <div class="flex items-center justify-between mb-2">
            <!-- The instrument-panel eyebrow — the demo's ONE caption rung
                 (`text-mono-caption`: the mono face, uppercase, caps tracking —
                 nothing re-authored here) names the master clock; the lit
                 timecode beside it reads that clock. -->
            <span class="text-mono-caption text-muted-foreground">master clock</span>
            <!-- The lit timecode reads the master clock as a normalized counter
                 (`0.000`, tabular figures, the small mono rung so the fraction
                 stays quieter than the Metric's ms readout above the stage — the
                 clock's CANONICAL unit is milliseconds, announced on the rail's
                 valuetext; this fraction is its progress). -->
            <span class="seq-timecode readout-accent text-mono-small tabular-nums">{{ demo.progress.value.toFixed(3) }}</span>
        </div>
        <div
            ref="scrubEl"
            class="seq-scrub kf-focus-ring relative w-full h-12 cursor-pointer select-none"
            :class="{ 'is-scrubbing': demo.isScrubbing.value }"
            role="slider"
            aria-label="Scrub the sequence master clock"
            :aria-valuenow="Math.round(demo.progress.value * 100)"
            :aria-valuetext="`${Math.round(demo.progress.value * demo.duration.value)} ms of ${demo.duration.value} ms`"
            aria-valuemin="0"
            aria-valuemax="100"
            tabindex="0"
            @pointerdown="onPointerDown"
            @keydown="onScrubKeydown"
            @keyup="onScrubKeyup"
            @blur="onScrubBlur"
        >
            <div class="progress-rail"></div>
            <div
                class="progress-ball scrub-ball"
                :style="{ transform: `translateX(calc(${demo.progress.value * 100}cqw))` }"
            ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, useTemplateRef } from "vue";

import { clamp } from "@mkbabb/value.js/math";
import { useDragScrub } from "@composables/useDragScrub";
import { SEQUENCE_DEMO_KEY } from "./sequenceKeys";

// KF.W7 C·C-4 — THE PROVIDER GUARD, and the asymmetry declared rather than
// asserted away. This component is a colocated sub-unit of `SequenceTarget`: it
// injects the whole scene demo and owns none of it, which is exactly why G1
// ruled it KEEP-BESPOKE (the gesture drives `Sequence.scrub` under an explicit
// single-writer rule). The `!` claimed a provider it never checked, so a mount
// outside the scene died inside the RENDER — `Cannot read properties of
// undefined (reading 'progress')` — naming neither the contract nor the seam.
const demo = inject(SEQUENCE_DEMO_KEY);
if (!demo) {
    throw new Error(
        "SequenceScrubber must be mounted inside the sequence scene: no SEQUENCE_DEMO_KEY was provided.",
    );
}

// ── Master scrubber: drag/keyboard scrubs the Sequence progress ──────────────
// The drag rides the shared `useDragScrub` seam (H.W12.S1 / I8); `project` is the
// clamped rail rect-ratio.
const scrubEl = useTemplateRef<HTMLElement>("scrubEl");

// THE GESTURE SPEC (X.KF.W11.d — kf-SequenceScrubber C-2/L-D-4 + KF-SCR-6 +
// C-12; kf-SequencePlayhead N-3 · N-13 · N-18). ONE helper, every consumer:
//   • every master-clock scrub — the pointer samples AND the four keyboard
//     verbs — routes through `applyScrub`; there is no second scrub path;
//   • every master-clock scrub LIGHTS THE WELL (`demo.setScrubbing(true)` —
//     the ONE home of that boolean, the instrument's; the stage's
//     `.is-scrubbing` and this rail's read it, nothing shadows it); the
//     pointer gesture cools it on release, the keyboard gesture on key-up or
//     blur. Row re-times are AUTHORING gestures, not scrubs: they do not light
//     the well — declared, not omitted;
//   • the comet's direction latches PER ADMITTED SAMPLE from the sign of
//     `p − lastP`, with a DEADBAND — a zero-delta sample leaves it untouched;
//   • the phosphor line in the stage is "the master playhead"; this rail is the
//     master CLOCK's scrub surface that DRIVES it (its name says so).
// The cascade the scrub detonates is the ENGINE's own work (`Sequence.scrub`
// drives each child's `--ball-p`; the per-lane glow scales with it — no rAF, no
// second writer, inv ζ); this file reports the GESTURE and nothing else.
type ScrubGesture = "pointer" | "keyboard";

/**
 * The keyboard step on the master clock — 5% of the clock per arrow press
 * (≈97ms at the default 1940ms span). DECLARED beside the row handles' 40ms
 * `ROW_AT_STEP`: two granularities for two different gestures — a scrub of the
 * WHOLE clock vs a nudge of ONE row's offset — stated, not accidental (KF-SCR-6).
 */
const SCRUB_KEY_STEP = 0.05;
let lastP = 0;

const applyScrub = (p: number, gesture: { gesture: ScrubGesture }) => {
    const next = clamp(p, 0, 1);
    if (next !== lastP) {
        demo.setScrubDir(next > lastP ? 1 : -1);
        lastP = next;
    }
    // Both gestures light the well; each cools it from its own end event.
    demo.setScrubbing(true);
    demo.scrub(next);
    return gesture.gesture;
};

const { onPointerDown } = useDragScrub({
    el: scrubEl,
    project: (e) => {
        const el = scrubEl.value;
        if (!el) return demo.progress.value;
        const rect = el.getBoundingClientRect();
        // The NaN guard belongs HERE, at the projector (the ruling-8 family): a
        // zero-width rail would project `0 / 0`, and every clamp downstream is
        // NaN-transparent — so a rail without geometry reports the clock as is.
        if (rect.width === 0) return demo.progress.value;
        return clamp((e.clientX - rect.left) / rect.width, 0, 1);
    },
    onScrub: (p) => applyScrub(p, { gesture: "pointer" }),
    onStart: () => {
        lastP = demo.progress.value;
    },
    onEnd: () => {
        demo.setScrubbing(false);
    },
});

const SCRUB_KEYS = new Set(["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown", "Home", "End"]);

const onScrubKeydown = (e: KeyboardEvent) => {
    if (!SCRUB_KEYS.has(e.key)) return;
    e.preventDefault();
    // A key press is a one-sample gesture: its "previous sample" is the clock
    // as it stands (the pointer seeds the same way, once, in `onStart`).
    const p = demo.progress.value;
    lastP = p;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        applyScrub(p + SCRUB_KEY_STEP, { gesture: "keyboard" });
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        applyScrub(p - SCRUB_KEY_STEP, { gesture: "keyboard" });
    } else if (e.key === "Home") {
        applyScrub(0, { gesture: "keyboard" });
    } else {
        applyScrub(1, { gesture: "keyboard" });
    }
};
const onScrubKeyup = (e: KeyboardEvent) => {
    if (SCRUB_KEYS.has(e.key)) demo.setScrubbing(false);
};
const onScrubBlur = () => {
    demo.setScrubbing(false);
};
</script>

<style scoped>
.seq-scrub {
    display: flex;
    align-items: center;
    /* T.G4 — the scrub-ball rides `translateX(<cqw>)`; `cqw` resolves against
       this rail's inline size, so the master clock position stays rail-
       relative with no per-frame `left` layout (compositor-only). */
    container-type: inline-size;
    /* The rail owns the pointer for the length of the drag (`useDragScrub`
       captures it); on touch, the browser must not race it for a pan. The same
       declaration the row handles carry — the two scrub surfaces agree. */
    touch-action: none;
}

/* The LIT phosphor TIMECODE. The master clock's progress fraction: tabular
   figures + a phosphor text-shadow keyed to the master tone (`--ball-tone`
   resolves to `--color-progress` here — the one master authority). It reads
   `0.000` (toFixed(3)), so it clicks like a counter. The bloom lifts a hair
   while scrubbing via the stage's shared light (here a static phosphor halo;
   the cascade carries the live heat). `tabular-nums` on the element is the whole
   figure setting — a second `font-feature-settings: "tnum"` said it twice.

   KF.W6 D·D-7 — THE MATERIAL-REGISTER DECISION, not a per-site shadow patch.
   The question the bank asks is whether the phosphor belongs to a register at
   all and WHICH THEME ARM declares it, and the answer is legible from what a
   phosphor IS: a halo is emission read against a DARK substrate. This one
   shipped ungated into a page whose default arm is light, where a coloured glow
   around 12–16 px tabular figures is not a bloom, it is a blur — it spreads the
   very digits the tnum figures exist to keep crisp, and it does so on the one
   readout the scene calls its brightest. So the register declares the halo on
   the DARK arm and declares NONE on the light arm, in ONE declaration rather
   than a media query or a second rule: `light-dark()` is a colour function, so
   the arm lives in the shadow's COLOUR, and a fully transparent shadow paints
   nothing at all. The light arm's prominence then rests where it should — the
   size, the weight, the tabular figures and the master tone itself — none of
   which this touches. Nothing bespoke is patched per site and the tone chain to
   the master authority is untouched. Percept: KF.W9 / SS-13. */
.seq-timecode {
    text-shadow: 0 0 8px
        light-dark(
            transparent,
            color-mix(in srgb, var(--ball-tone, var(--color-progress)) 40%, transparent)
        );
}

/* The scrub rail runs hotter under an active drag — the ball blooms as you
   conduct (the same scrub-heat the storyboard well lifts). CONSUME the promoted
   `.progress-ball` idiom's `--ball-glow` parameter (design-idioms.css, the
   `.progress-ball` block) rather than re-authoring its box-shadow — the idiom
   owns the glow shape; the scene only lifts the glow strength (35% → 60%)
   under the active scrub. */
.seq-scrub.is-scrubbing .scrub-ball {
    --ball-glow: 60%;
}

/* The master scrub-ball — positioned by Vue (the one ball the engine does not
   paint), at the idiom-default --ball-size + full glow: the DOMINANT ball that
   drives the whole storyboard (SEQ-12). */
.scrub-ball {
    /* T.G4 — anchored at the rail's left edge; the inline `translateX(<cqw>)`
       carries the position (compositor-only, no per-frame layout). */
    left: 0;
    margin-left: calc(var(--ball-size, 36px) / -2);
    will-change: transform;
}
</style>
