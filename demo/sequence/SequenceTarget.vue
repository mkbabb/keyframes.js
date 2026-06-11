<template>
    <div class="flex flex-col items-center justify-center gap-4 h-full w-full px-6 lg:px-8 max-w-3xl mx-auto overflow-hidden">
        <!-- I5 (H.W11.S1) — the STAGE-CARD register. The former bare-class
             `glass-resting cartoon-surface` div (border-radius 0 — the I4 square
             defect; the radius lived on the `<Card>` root, not the
             `cartoon-surface` utility) SWAPS to a standard, NON-cartoon glass
             `<Card>` — the protagonist plate, rounded-card by construction (I4
             closes FOR FREE). `shadow={false}` (FORK I5-shadow). All four stage
             scenes converge to ONE register. -->
        <Card :shadow="false" class="seq-target w-full flex-1 min-h-0 flex flex-col overflow-hidden">
            <!-- Header: title + live master progress read-out.
                 J.W7a S2 (D7 / TYP-2, SEQ-01) — the scene name lifts to the
                 Instrument-Serif `text-display` rung (the display voice carried
                 inward; cross-typography §3).
                 J.W7a S2 (D8) + S3 (D14) — the live master progress promotes to
                 the published MetricBadge size="xl" poster rung wearing the
                 master accent (--ball-tone, the canonical clock green); the
                 structural `stagger × 5` stays the small muted caption — only
                 the LIVE number pops. -->
            <!-- The header rows WRAP (flex-wrap, here + the left group): the
                 xl readout badge is wider than the old caption, and at 375w an
                 unwrappable row starved the serif title to zero width and slid
                 the badge under the reel button — the reflow keeps every
                 member legible at phone widths (the D8 responsive behaviour;
                 the XH-4 band contract stays intact — the strip grows DOWN
                 into the card, never up into the scene-switcher band). -->
            <div class="flex flex-wrap items-center justify-between gap-y-1 px-4 py-2.5 border-b border-border/40 shrink-0">
                <div class="flex flex-wrap items-baseline gap-3 gap-y-1 min-w-0">
                    <span class="text-display text-foreground truncate">Sequence</span>
                    <span class="text-mono-caption text-muted-foreground tabular-nums whitespace-nowrap">
                        stagger &times; {{ ROW_COUNT }}
                    </span>
                    <MetricBadge
                        size="xl"
                        label="progress"
                        label-position="inline"
                        :amount="(demo.progress.value * 100).toFixed(0)"
                        unit="%"
                        color="var(--ball-tone, var(--color-progress))"
                        class="shrink-0"
                    />
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <!-- EE-SEQ-1 "the reel" — the discoverable twin of the hidden
                         typed "reel" trigger: cascading-wave overshoot replay. -->
                    <Button
                        variant="outline"
                        class="h-7 w-7 p-0 btn-interactive"
                        :class="{ 'reel-active': demo.isReeling.value }"
                        aria-label="Play the reel — a cascading wave replay"
                        @click="demo.playReel()"
                    >
                        <Clapperboard class="w-3.5 h-3.5" />
                    </Button>
                    <span
                        class="status-badge text-admin-label px-2 py-0.5 rounded-full"
                        :class="demo.isReversed.value ? 'reverse-badge' : (demo.isPlaying.value ? 'tracking-badge' : 'settled-badge')"
                    >{{ demo.isReversed.value ? "reverse" : (demo.isPlaying.value ? "playing" : "ready") }}</span>
                </div>
            </div>

            <!-- The staggered storyboard: one rail+ball per Sequence child, now
                 a draggable TIMELINE (H.W12.S6 / I3). Each row's start-handle
                 scrubs its child's master-clock `at:` offset live; a swept
                 master-playhead LINE crosses all rows at the live progress so the
                 stagger is SEEN as a sweep (R-SEQ-E). The handle track + the
                 playhead share the master-clock axis (`at / STAGGER_MAX`). -->
            <div class="seq-storyboard relative flex-1 min-h-0 flex flex-col justify-center gap-3 px-6 py-6">
                <!-- The swept master-playhead line — pure CSS, driven by the one
                     `progress` value the scrub ball already pays for. A track
                     wrapper spans ONLY the shared track region (inset past the
                     label column) so the line's `%` position resolves against the
                     track width, then translateX moves it (compositor-friendly). -->
                <!-- J.W7a S4 (D17 / C2) — the playhead track wrapper (already
                     spanning EXACTLY the shared master-clock region) carries
                     the `.stage-field-x` time grid: vertical quarter rules at
                     0.25/0.5/0.75 of the stagger axis, so the storyboard's
                     temporal structure reads behind the swept line (the C2
                     evidence: "a playhead line but no time grid"). -->
                <div class="seq-playhead-track stage-field-x" aria-hidden="true">
                    <div
                        class="seq-playhead"
                        :style="{ '--playhead-p': clamp01(demo.progress.value) }"
                    ></div>
                </div>

                <!-- J.W7a S3 (D12 / CP-2, SEQ-13) — the five rows draw the
                     ascending violet→green spectrum the sequence GLYPH already
                     advertises (sequence.svg: violet/blue/cyan/green bars):
                     each row sets the ONE --ball-tone token (the D10 seam) and
                     its rail, traveller, and start-handle all wear that stop —
                     "you SEE each distinct traveler" instead of five identical
                     green ghosts. The master playhead + scrubber stay the
                     canonical clock green (the row spectrum answers to one
                     green master — the icon's own grammar). -->
                <div
                    v-for="row in demo.rows.value"
                    :key="row.index"
                    class="seq-row flex items-center gap-3"
                    :style="{ '--ball-tone': ROW_TONES[row.index] }"
                >
                    <span class="text-mono-caption text-muted-foreground tabular-nums shrink-0 w-20 text-right pr-2">
                        @{{ Math.round(row.at) }}ms
                    </span>
                    <div
                        :ref="(el) => setRowEl(row.index, el as HTMLElement | null)"
                        class="seq-track relative flex-1 h-10"
                    >
                        <div class="progress-rail"></div>
                        <!-- The draggable start-handle: marks (and re-authors)
                             this child's master-clock `at:` offset. Slider posture
                             — drag re-emits delays[i] + re-sorts the Sequence. -->
                        <div
                            class="seq-handle"
                            :style="{ left: `calc(${(row.at / demo.STAGGER_MAX) * 100}%)` }"
                            role="slider"
                            :aria-label="`Re-time row ${row.index + 1} start offset`"
                            :aria-valuenow="Math.round(row.at)"
                            aria-valuemin="0"
                            :aria-valuemax="demo.STAGGER_MAX"
                            tabindex="0"
                            @pointerdown="onRowDown(row.index, $event)"
                            @keydown="onRowKeydown(row.index, $event)"
                        ></div>
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
                    <!-- J.W7a S3 (D14 / CP-4) — the live playhead value wears
                         the master accent; the label stays muted. -->
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

                <!-- J.W7a S5 / XH-2 + §c (D21/D23) — the in-stage flat transport
                     row (Play/Reverse/1×/Reset) is RETIRED into the convergent
                     playback register: the bottom TransportDock's rainbow
                     group-play + reset ARE the sequence's transport (already
                     wired through the machine's ScenePlayback adapter — the
                     same canonical pair every scene rhymes against,
                     cross-color-pops §0). The storyboard register now agrees:
                     no storyboard scene mounts a third in-stage playback
                     dialect (cross-hierarchy #2 — the control-placement
                     schism). The master scrubber above stays — it is the
                     storyboard's editable CONTENT (the playhead the user
                     scrubs), not transport chrome. The triage's timeScale
                     aria-label fix (S5, WCAG 2.5.3 Label in Name) landed on
                     this row and is moot with it — the row no longer exists. -->
            </div>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, useTemplateRef } from "vue";
import { useEventListener } from "@vueuse/core";
import { Button, Card } from "@mkbabb/glass-ui";
// J.W7a S2 (D8) — the published poster-metric primitive (glass-ui 3.9.0); the
// MetricHeader abstraction over the four stage headers stays a W7b handoff edge.
import { MetricBadge } from "@mkbabb/glass-ui/metric-badge";
import { Clapperboard } from "@lucide/vue";

// J.W7a S5 (D21/D23) — the playback-button.css import retired WITH the in-stage
// transport row (no `.btn-playback*` consumer remains in this file); the reel
// button rides glass-ui's `btn-interactive` utility.

import { useDragScrub } from "@composables/useDragScrub";
import { SEQUENCE_DEMO_KEY } from "./sequenceKeys";
import { ROW_COUNT } from "./useSequenceDemo";

const demo = inject(SEQUENCE_DEMO_KEY)!;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// J.W7a S3 (D12 / CP-2) — the per-row spectrum map, row 0 violet … row 4 green
// (the sequence icon's ascending bars). All five stops resolve from the owned
// --rainbow-* family (design-idioms.css); the fourth is the token-derived
// cyan→green midpoint (the glyph ships four stops over five rows — the bridge
// stop is mixed from its neighbours, never a new literal).
const ROW_TONES = [
    "var(--rainbow-violet)",
    "var(--rainbow-blue)",
    "var(--rainbow-cyan)",
    "color-mix(in oklab, var(--rainbow-cyan) 45%, var(--rainbow-green))",
    "var(--rainbow-green)",
] as const;

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
    // Paint the CURRENT playhead (not a hard t=0): on a fresh entry `progress` is
    // 0 (balls rest at their rail origin); on a return entry the machine's
    // SCENE_READY restore may have already re-seated `progress` through the
    // ScenePlayback adapter, so seeking the live value avoids clobbering it
    // regardless of mount/restore ordering (H.W1).
    demo.sequence.progress = demo.progress.value;
});

// ── Master scrubber: drag/keyboard scrubs the Sequence progress ──────────────
// The drag rides the shared `useDragScrub` seam (H.W12.S1 / I8); the master
// scrubber's `project` is the clamped rail rect-ratio.
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

// ── Draggable rows: re-author each child's `at:` live (H.W12.S6 / I3) ─────────
// ONE shared `useDragScrub` consumer drives every row handle (the seam's
// single-home philosophy). The pressed row's index is latched; the `project`
// reads THAT row's track rect → a [0,1] ratio → an `at:` ms offset across the
// `[0, STAGGER_MAX]` domain; `onScrub` re-emits it via `demo.reseatRow`, which
// re-authors the engine's position-insertion (the `Sequence` re-sort). The track
// elements are the SAME refs the engine paints `--ball-p` onto (rowEls).
const activeRow = ref<number | null>(null);
const { onPointerDown: onRowScrubDown } = useDragScrub({
    el: scrubEl, // a stable capture host; the drag starts from the row handle
    project: (e) => {
        const i = activeRow.value;
        const el = i == null ? null : rowEls[i];
        if (i == null || !el) return 0;
        const rect = el.getBoundingClientRect();
        const ratio = clamp01((e.clientX - rect.left) / rect.width);
        return ratio * demo.STAGGER_MAX;
    },
    onScrub: (at) => {
        if (activeRow.value != null) demo.reseatRow(activeRow.value, at);
    },
    onEnd: () => {
        activeRow.value = null;
    },
});

const onRowDown = (index: number, e: PointerEvent) => {
    activeRow.value = index;
    onRowScrubDown(e);
};

const ROW_AT_STEP = 40; // ms nudge per arrow press (the slider keyboard posture)
const onRowKeydown = (index: number, e: KeyboardEvent) => {
    const at = demo.rows.value[index]?.at ?? 0;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = at + ROW_AT_STEP;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = at - ROW_AT_STEP;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = demo.STAGGER_MAX;
    if (next === null) return;
    e.preventDefault();
    demo.reseatRow(index, next);
};

// ── EE-SEQ-1 "the reel" trigger (H.W12.S6 / I3 egg) ──────────────────────────
// A HIDDEN typed-sequence trigger (i-r5's primary): type "reel" while the scene
// is open and the storyboard plays the cascading-wave egg. Scene-scoped via
// vueuse (auto-cleanup on unmount); ignores typing in editable targets so it
// never fights an input. The Reel button beside the readout is the discoverable
// twin (the egg is hidden, the affordance is graceful).
const REEL_CODE = "reel";
let reelBuffer = "";
useEventListener(window, "keydown", (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))
        return;
    if (e.key.length !== 1) return;
    reelBuffer = (reelBuffer + e.key.toLowerCase()).slice(-REEL_CODE.length);
    if (reelBuffer === REEL_CODE) {
        reelBuffer = "";
        demo.playReel();
    }
});
</script>

<style scoped>
/* J.W7a S3 (D12) — the MASTER tone: the card root binds the seam to the
   canonical clock green, so the master scrubber ball, the swept playhead, and
   the header readout accent all read ONE master hue; the five rows OVERRIDE it
   per-row with their spectrum stop (the inline --ball-tone in the v-for). */
.seq-target {
    --ball-tone: var(--color-progress);
}

.seq-track,
.seq-scrub {
    display: flex;
    align-items: center;
}

/* The storyboard holds the swept playhead line as an overlay. The label column
   (w-20 = 5rem) + the row gap (gap-3 = 0.75rem) is the inset before the shared
   track region; named so the playhead + handles align to ONE track axis. */
.seq-storyboard {
    --label-col: 5rem;
    --row-gap: 0.75rem;
    --track-inset: calc(var(--label-col) + var(--row-gap));
    /* LOCAL micro-stack tokens (D.W3 §S2 — single-sourced, named). These order
       the storyboard's own absolutely-positioned siblings WITHIN this card's
       local stacking context; they are NOT the global --z-* app-layer scale
       (content/controls/dock/overlay…), which orders chrome across the whole
       page. Naming them keeps even the local stack drift-free: the playhead line
       sits below the draggable row handles. */
    --z-seq-playhead: 1;
    --z-seq-handle: 2;
}

/* ── The swept master-playhead line (R-SEQ-E, H.W12.S6 / I3) ──────────────────
   The playhead track wrapper spans ONLY the shared row-track region (inset past
   the label column on the left, the px-6 padding on the right), so the line's
   `left: %` position resolves against the TRACK width — the SAME axis the row
   handles ride. */
.seq-playhead-track {
    position: absolute;
    top: 0.75rem;
    bottom: 0.75rem;
    /* px-6 (1.5rem) + the label inset on the left; px-6 on the right. */
    left: calc(1.5rem + var(--track-inset));
    right: 1.5rem;
    pointer-events: none;
    z-index: var(--z-seq-playhead);
}

/* A single vertical line crossing all five row tracks at the live progress, so
   the stagger reads as a SWEEP (each ball "wakes" as the line enters its
   window). Pure CSS — driven by the one `--playhead-p` [0,1] the scrub ball
   already pays for. `left: %` resolves against the track wrapper; translateX
   centers the 2px line on the position and keeps the move on the compositor. */
.seq-playhead {
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(var(--playhead-p, 0) * 100%);
    width: 2px;
    transform: translateX(-50%);
    background: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 55%, transparent);
    border-radius: var(--radius-pill);
    will-change: left;
}

/* ── The draggable row start-handle (R-SEQ-D, H.W12.S6 / I3) ──────────────────
   A grip marker at the child's master-clock `at:` proportion; dragging it
   re-authors that child's offset live (the GSAP-timeline gesture). A vertical
   grip (not a round ball) so it never reads as the gliding .seq-ball. */
.seq-handle {
    position: absolute;
    top: 50%;
    width: 0.55rem;
    height: 1.6rem;
    margin-top: -0.8rem;
    margin-left: -0.275rem;
    border-radius: var(--radius-pill);
    /* J.W7a S3 (D12) — the start-handle wears its ROW's spectrum stop (the
       cascaded per-row --ball-tone), so the editable offset marker and the
       traveller it times read as one coloured voice per row. */
    background: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 70%, var(--background));
    border: 1.5px solid var(--ball-tone, var(--color-progress));
    cursor: grab;
    touch-action: none;
    z-index: var(--z-seq-handle);
    transition:
        background 120ms ease,
        transform 120ms ease;
}
.seq-handle:hover,
.seq-handle:focus-visible {
    background: var(--ball-tone, var(--color-progress));
    transform: scaleY(1.12);
    outline: none;
}
.seq-handle:active {
    cursor: grabbing;
}

/* The reel button pulses while the egg runs (the active affordance state). */
.reel-active {
    color: var(--color-progress);
    border-color: var(--color-progress);
}

/* The per-row ball rides the engine-painted --ball-p (0→1), so it travels the
   rail with NO per-frame Vue work. It consumes the shared .progress-ball idiom
   (design-idioms.css): only the per-site variation lives here — the rail-relative
   horizontal position (the idiom centers vertically via margin-top) and the
   chorus-ball size. The --ball-p default keeps the ball at the origin before the
   engine first paints it.
   J.W7a S1 (D4 / SEQ-02): the five travellers step up from the recessive 1.4rem
   to the 1.75rem chorus rung (the spring live-ball lineage — the shared framing
   baseline), so the staggered subjects read against the storyboard void. */
.seq-ball {
    --ball-p: 0;
    --ball-size: 1.75rem;
    left: calc(var(--ball-p) * (100% - var(--ball-size)));
    will-change: left;
}

/* The master scrub-ball is positioned by Vue (`left:` from demo.progress) — the
   one ball the engine does not paint, since it tracks the master playhead.
   J.W7a S1 (D4 / SEQ-12): the master playhead is the DOMINANT ball — the ONE
   element that drives the whole storyboard — so it takes the idiom-default
   --ball-size (36px) + the full canonical glow (no per-site shrink): the former
   1.25rem override made the master read SMALLER than the row balls it governs. */
.scrub-ball {
    margin-left: calc(var(--ball-size, 36px) / -2);
    will-change: left;
}

/* H.W12.S1 / I8 — the former bespoke `.transport-active` reverse tint is DELETED
   (no legacy beside its replacement): the Reverse button now wears the shared
   `.btn-playback` skin, whose `[aria-pressed="true"]` rule (playback-button.css)
   carries the active tint — the SAME affordance the standard ribbon's Reverse
   uses, driven here by `:aria-pressed="demo.isReversed.value"`. */
</style>
