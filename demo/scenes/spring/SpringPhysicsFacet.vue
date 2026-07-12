<template>
    <!-- T.B7 — THE PHYSICS FACET (the SpringSidebar dissolution). The bespoke
         313L sidebar monolith (view-fork pill + params + heatmap + presets + a
         capped keyframes editor + a hand-dragged pane) DISSOLVED into the
         spring facility:
           · the view fork became CHANNEL DATA (stage 2 — the transport Select's
             Sweep/Entry channels fork the stage; the KfPillTabs strip is gone);
           · the pane drag DIED with `useSpringPaneDrag.ts` (168L bespoke
             pane-dragging — panel placement is the shell's concern, not a
             per-scene drag toy);
           · what remains IS the Physics facet: the two LabeledSlider param
             rows + the parameter-space heatmap + the four canonical presets as
             clickable points — consumed glass components end to end. (The
             merged axis-labeled canvas instrument of T-SPR-6 stays
             design-PENDING per the drive brief; the heatmap is the live
             parameter-space surface until that design lands.)
         The engine-owned per-stop KeyframesEditor section below survives THIS
         stage bound to the REAL Sweep channel animation (`springEditAnim`); its
         terminal home is the derived Keyframes triad tab (T.B2 — the shared
         editor pane takes over and this section dies in that motion). -->
    <Card surface="cartoon" tier="quiet" class="spring-pane w-full overflow-visible">
        <CardContent class="panel-content flex flex-col gap-3 px-4 py-3">
            <!-- Live params — the UNIFORM label-column grammar (the cube's bar).
                 The two sliders join ONE `.labeled-field-grid` so their labels
                 ("response" / "damping (ζ)") resolve the SAME width (U5). -->
            <div class="labeled-field-grid">
                <LabeledSlider
                    :model-value="demo.response.value"
                    label="response"
                    label-class="text-small font-medium text-muted-foreground"
                    tooltip="Spring response time (s) — higher = slower"
                    :min="0.1"
                    :max="1.2"
                    :step="0.01"
                    @update:model-value="(v) => { demo.response.value = v; }"
                />
                <LabeledSlider
                    :model-value="demo.dampingFraction.value"
                    label="damping (ζ)"
                    label-class="text-small font-medium text-muted-foreground"
                    tooltip="Damping fraction (ζ) — <1 overshoots, ≥1 settles"
                    :min="0.2"
                    :max="1.5"
                    :step="0.01"
                    @update:model-value="(v) => { demo.dampingFraction.value = v; }"
                />
            </div>

            <!-- ── P.W6 S3 — THE PARAMETER-SPACE HEATMAP (the headline egg) ──────
                 The two abstract sliders above become a navigable landscape: a
                 20×20 response×damping field tinted by the EXACT analytic
                 overshoot `exp(-ζπ/√(1-ζ²))` (NOT 400 live SpringProgress
                 instances — 507× faster, `spring-heatmap-probe`). Clicking a
                 cell NAVIGATES the live spring to that (response, damping); the
                 marker tracks the live params. Two-way: it reads `demo.response`
                 / `demo.dampingFraction` and a click writes them (the same refs
                 the sliders drive — one shared control surface). -->
            <SpringHeatmap :demo="demo" />

            <!-- Preset cells — the SINGLE preset surface (S5: the StartingStyle
                 pane's redundant preset row is retired; this is the ONE place the
                 four canonical presets live). Each cell carries its OWN live track
                 ball (painter-positioned). S3 — the active cell wears the RED-DASHED
                 ring (the `.preset-cell--active` token treatment), not the solid
                 green inset; the hover is the red-accent family (F3). -->
            <div class="preset-grid grid grid-cols-2 gap-2">
                <ToggleChip
                    v-for="(t, i) in demo.tracks"
                    :key="t.preset.name"
                    variant="cell"
                    :model-value="isActivePreset(t)"
                    :title="t.preset.blurb"
                    class="preset-cell rounded-pill border-none bg-background px-3 pt-1.5 pb-2 h-auto items-start gap-1 font-medium leading-normal whitespace-nowrap btn-interactive"
                    @update:model-value="applyPreset(t.preset)"
                >
                    <span class="preset-name-row flex w-full flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                        <span class="text-small text-foreground capitalize">{{ t.preset.name }}</span>
                        <span class="text-mono-caption text-muted-foreground tabular-nums">{{ t.preset.response }} / {{ t.preset.dampingFraction }}</span>
                    </span>
                    <span class="preset-track relative block w-full h-2">
                        <span class="progress-rail"></span>
                        <span
                            :ref="(el) => setTrackBallEl(i, el)"
                            class="progress-ball preset-ball"
                        ></span>
                    </span>
                </ToggleChip>
            </div>

            <!-- ── KEYFRAMES EDITOR (K.W4 S1 — survives THIS stage) ────────────
                 The engine-owned KeyframesEditor (the SAME per-stop card grammar
                 the cube scene uses) — two-way bound to the REAL Sweep channel
                 animation. A typed edit PERSISTS (the editor is authoritative);
                 "Re-sample from spring" explicitly re-seeds it from the current
                 solver params. Terminal home: the derived Keyframes triad tab
                 (T.B2) — this section + the 26rem cap die in that motion. -->
            <div class="keyframes-section grid gap-2">
                <div class="flex items-center justify-between gap-2">
                    <!-- T.D4 — section label + button ride the body register
                         (mono is data, not the UI voice). -->
                    <span class="text-small font-medium text-muted-foreground">@keyframes (editable)</span>
                    <button
                        type="button"
                        class="reseed-btn btn-interactive shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-caption font-medium text-muted-foreground hover:text-foreground"
                        title="Re-sample the keyframe stops from the current spring params"
                        @click="demo.seedKeyframes()"
                    >
                        <RefreshCw class="w-3 h-3" />
                        <span>re-sample</span>
                    </button>
                </div>
                <div class="keyframes-editor-scroll">
                    <!-- K.W1′ — `:framed="false"` DROPS the editor's own inner
                         `Card` so the per-stop list flows into THIS facet's lone
                         quiet parent Card directly (no card-in-card; the glass-ui
                         4.0.0 single-surface contract — the
                         proof:easing-sidebar-normalized G6 flatten clause). -->
                    <KeyframesEditor :animation="demo.springEditAnim" :framed="false" />
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";
import { onMounted, onScopeDispose } from "vue";
import { Card, CardContent } from "@mkbabb/glass-ui";
import { LabeledSlider } from "@mkbabb/glass-ui/labeled-field";
import { ToggleChip } from "@mkbabb/glass-ui/toggle-chip";
import { RefreshCw } from "@lucide/vue";
import { clamp } from "@mkbabb/value.js/math";

import KeyframesEditor from "@components/instrument/keyframes/KeyframesEditor.vue";
import SpringHeatmap from "./SpringHeatmap.vue";

import type { SpringDemoContext } from "./springKeys";
import type { SpringPreset, SpringTrack } from "./useSpringDemo";

const props = defineProps<{ demo: SpringDemoContext }>();
const demo = props.demo;

// ── J.W2 S5 (DS-3) — the preset-cell ball painter (the 60 Hz hot path) ─────────
const trackBallEls: (HTMLElement | null)[] = [];
const setTrackBallEl = (i: number, el: Element | ComponentPublicInstance | null) => {
    trackBallEls[i] = (el as HTMLElement) ?? null;
};

let unregisterPainter: (() => void) | null = null;
onMounted(() => {
    unregisterPainter = demo.registerSpringPainter(() => {
        const values = demo.springLive.trackValues;
        for (let i = 0; i < trackBallEls.length; i++) {
            const el = trackBallEls[i];
            // T.G4 — position by `transform: translateX(<cqw>)`, never `left` (the
            // compositor-only value axis; `cqw` = 1% of the `.preset-track`
            // inline-size container). No per-frame layout, no width read.
            if (el) el.style.transform = `translateX(${clamp(values[i] ?? 0, 0, 1) * 100}cqw)`;
        }
    });
});
onScopeDispose(() => unregisterPainter?.());

const isActivePreset = (t: SpringTrack) =>
    Math.abs(demo.response.value - t.preset.response) < 1e-6 &&
    Math.abs(demo.dampingFraction.value - t.preset.dampingFraction) < 1e-6;

const applyPreset = (preset: SpringPreset) => {
    demo.response.value = preset.response;
    demo.dampingFraction.value = preset.dampingFraction;
};
</script>

<style scoped>
/* ── §LABEL-subgrid consume ──
   The params ride the shared `.labeled-field-grid` idiom (design-idioms.css —
   the DRY home). Nothing is re-authored here. */

/* ── Preset cells — the SINGLE preset surface ──
   The rail + ball geometry come from the shared .progress-rail / .progress-ball
   idiom (design-idioms.css). The rail tint lifts to 14% so the short in-cell
   track reads as a clear groove at rest. */
.preset-track .progress-rail {
    --rail-tint: 14%;
}
/* T.G4 — the track is the `cqw` inline-size container the preset ball's
   `translateX(<cqw>)` resolves against. */
.preset-track {
    container-type: inline-size;
}
.preset-ball {
    --ball-size: 0.85rem;
    --ball-glow: 0%;
    left: 0; /* T.G4 — painter's translateX(<cqw>) carries the position */
    margin-left: calc(var(--ball-size) / -2);
    will-change: transform;
}

/* ── S3 → T.D7 — the DASHED active/settled ring (the token treatment) ──
   The active cell wears the canonical motion-color (--color-progress — the
   OD-6 violet authority since T.D7; red is destructive-only) as a DASHED
   outline — mirroring AnimationVisualizer's settled twin (`border-dashed
   border-accent-kf/40 bg-accent-kf/15`), the dashed IDIOM the owner kept
   (U-K17) riding the new hue. NOT a per-cell color class: the token is the
   authority; this is the dashed TREATMENT over it. The hover is the same
   accent family, a faint tinted wash that reads as the motion language, not
   the neutral grey accent. */
.preset-cell {
    outline: 1px dashed transparent;
    outline-offset: -1px;
    transition:
        outline-color var(--duration-fast) ease,
        background-color var(--duration-fast) ease;
}
.preset-cell:hover {
    background: color-mix(in srgb, var(--color-progress) 8%, var(--background)) !important;
    outline-color: color-mix(in srgb, var(--color-progress) 35%, transparent);
}
.preset-cell[data-state="on"] {
    background: color-mix(in srgb, var(--color-progress) 12%, var(--background)) !important;
    outline-color: color-mix(in srgb, var(--color-progress) 65%, transparent);
}

/* ── The keyframes editor section (T.B2-terminal — see the template note) ──
   The engine-owned KeyframesEditor is authored for the cube's full-height pane;
   in the rail it is CAPPED to a scrollable band so the per-stop cards + the
   stop-position slider stay reachable without the pane growing unbounded. The
   editor's own sticky footer (the slider + add/copy menubar) stays pinned. */
.keyframes-section {
    min-width: 0;
}
.keyframes-editor-scroll {
    max-height: 26rem;
    overflow-y: auto;
    border-radius: var(--radius-md, 0.5rem);
    container-type: inline-size;
}
.reseed-btn {
    line-height: 1.2;
}
</style>
