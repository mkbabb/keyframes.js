<template>
    <!-- K.W4 (LANE A) — the spring control pane RE-CUT at the design altitude.
         The J.W7c panel the user called "awful" carried a read-only @keyframes
         viewer (overwritten on every param change), a triple-shown preset surface,
         a solid-green active ring, and no drag affordance. The re-cut:
           • S1 — the read-only artifact viewer is RETIRED; the engine-owned
             `KeyframesEditor` (the cube card grammar) is MOUNTED, two-way bound
             (per-stop value, add/remove). The editor is the PRIMARY authoring
             surface; the presets are a derived convenience.
           • S3 — the active/settled preset-cell ring is the RED-DASHED treatment
             (the --color-progress token, repointed red by Lane B, + a dashed
             outline — mirroring AnimationVisualizer's settled twin), NOT the solid
             inset; the hover wears the red-accent family (F3).
           • S4 — the view switcher is `SegmentedTabs variant="pill"` (the legible
             4.0.0 chip), NOT the near-invisible underline fork (retired with the
             artifact section).
           • S7 — the pane is DRAGGABLE via kf's OWN `Draggable` primitive (a drag
             handle in the card header), contained to the work area (left-clip
             cured). -->
    <Card
        ref="paneCardEl"
        surface="cartoon"
        tier="quiet"
        class="spring-pane w-full overflow-visible"
    >
        <CardContent class="panel-content flex flex-col gap-3 px-4 py-3">
            <!-- Card header — the drag affordance (S7) + the view switcher (S4). -->
            <div class="flex items-center gap-2">
                <button
                    ref="dragHandleEl"
                    type="button"
                    class="pane-drag-handle btn-interactive shrink-0 grid place-items-center rounded-md p-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
                    aria-label="Drag the spring control pane"
                    title="Drag to move this pane"
                >
                    <GripVertical class="w-4 h-4" />
                </button>
                <!-- R.W6 / DM-5 CONTINGENCY KILL — the kf-internal KfPillTabs
                     replaces glass-ui SegmentedTabs here: the installed 4.0.1
                     SegmentedTabs pill emits the orientation attribute
                     UNCONDITIONALLY on its `role=group`, which forced an
                     undefined-binding suppress (the DM-5 band-aid P-invariant-28
                     forbids re-carrying). KfPillTabs is a `role=tablist`/`tab`
                     switcher — ARIA-correct by construction, no suppress. -->
                <KfPillTabs
                    v-model="viewModel"
                    :options="VIEW_OPTIONS"
                    aria-label="Spring view"
                    class="spring-view-tabs min-w-0 flex-1"
                />
            </div>

            <!-- Live params — the UNIFORM label-column grammar (the cube's bar).
                 The two sliders join ONE `.labeled-field-grid` so their labels
                 ("response" / "damping (ζ)") resolve the SAME width (U5). -->
            <div class="labeled-field-grid">
                <LabeledSlider
                    :model-value="demo.response.value"
                    label="response"
                    label-class="text-mono-small text-muted-foreground"
                    tooltip="Spring response time (s) — higher = slower"
                    :min="0.1"
                    :max="1.2"
                    :step="0.01"
                    @update:model-value="(v) => { demo.response.value = v; }"
                />
                <LabeledSlider
                    :model-value="demo.dampingFraction.value"
                    label="damping (ζ)"
                    label-class="text-mono-small text-muted-foreground"
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
                        <span class="text-mono-caption text-muted-foreground">{{ t.preset.response }} / {{ t.preset.dampingFraction }}</span>
                    </span>
                    <span class="preset-track relative block w-full h-2">
                        <span class="progress-rail"></span>
                        <span
                            :ref="(el: any) => setTrackBallEl(i, el)"
                            class="progress-ball preset-ball"
                        ></span>
                    </span>
                </ToggleChip>
            </div>

            <!-- ── KEYFRAMES EDITOR (S1) ───────────────────────────────────────
                 The engine-owned KeyframesEditor (the SAME per-stop card grammar
                 the cube scene uses) — two-way bound, per-stop value editable,
                 add/remove stop. This REPLACES the retired read-only
                 `linear()`/@keyframes artifact viewer (no-legacy). A typed edit
                 PERSISTS (the editor is authoritative); "Re-sample from spring"
                 explicitly re-seeds it from the current solver params. -->
            <div class="keyframes-section grid gap-2">
                <div class="flex items-center justify-between gap-2">
                    <span class="text-mono-small text-muted-foreground">@keyframes (editable)</span>
                    <button
                        type="button"
                        class="reseed-btn btn-interactive shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-mono-caption text-muted-foreground hover:text-foreground"
                        title="Re-sample the keyframe stops from the current spring params"
                        @click="demo.seedKeyframes()"
                    >
                        <RefreshCw class="w-3 h-3" />
                        <span>re-sample</span>
                    </button>
                </div>
                <div class="keyframes-editor-scroll">
                    <!-- K.W1′ — `:framed="false"` DROPS the editor's own inner
                         `Card` so the per-stop list flows into THIS sidebar's lone
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
import { computed, onMounted, onScopeDispose, useTemplateRef } from "vue";
import { Card, CardContent } from "@mkbabb/glass-ui";
import { LabeledSlider } from "@mkbabb/glass-ui/labeled-field";
import { ToggleChip } from "@mkbabb/glass-ui/toggle-chip";
import { GripVertical, RefreshCw } from "@lucide/vue";

import KfPillTabs from "@components/custom/KfPillTabs.vue";
import type { KfPillTabOption } from "@components/custom/useKfPillTabs";

import KeyframesEditor from "@components/custom/keyframes-editor/KeyframesEditor.vue";
import SpringHeatmap from "./SpringHeatmap.vue";

import { useSpringPaneDrag } from "./useSpringPaneDrag";

import type { SpringDemoContext } from "./springKeys";
import type { SpringPreset, SpringTrack } from "./useSpringDemo";

const props = defineProps<{ demo: SpringDemoContext }>();
const demo = props.demo;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// ── View switcher (the SegmentedTabs model bridges the demo's `view` ref) ──────
const VIEW_OPTIONS: KfPillTabOption[] = [
    { label: "Live solver", value: "solver" },
    { label: "Discrete transition", value: "discrete" },
];
const viewModel = computed<string>({
    get: () => demo.view.value,
    set: (v) => {
        if (v === "solver" || v === "discrete") demo.view.value = v;
    },
});

// ── J.W2 S5 (DS-3) — the preset-cell ball painter (the 60 Hz hot path) ─────────
const trackBallEls: (HTMLElement | null)[] = [];
const setTrackBallEl = (i: number, el: any) => {
    trackBallEls[i] = (el as HTMLElement) ?? null;
};

let unregisterPainter: (() => void) | null = null;
onMounted(() => {
    unregisterPainter = demo.registerSpringPainter(() => {
        const values = demo.springLive.trackValues;
        for (let i = 0; i < trackBallEls.length; i++) {
            const el = trackBallEls[i];
            if (el) el.style.left = `${clamp01(values[i] ?? 0) * 100}%`;
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

// ── S7 — the pane drag (dogfood kf's OWN Draggable) ────────────────────────────
const paneCardEl = useTemplateRef<InstanceType<typeof Card>>("paneCardEl");
const dragHandleEl = useTemplateRef<HTMLElement>("dragHandleEl");
const paneDrag = useSpringPaneDrag();

let detachDrag: (() => void) | null = null;
onMounted(() => {
    // The Card's root element (glass-ui Card exposes $el via the component).
    const cardRoot = (paneCardEl.value as any)?.$el as HTMLElement | undefined;
    if (dragHandleEl.value && cardRoot) {
        detachDrag = paneDrag.attach(dragHandleEl.value, cardRoot);
    }
});
onScopeDispose(() => detachDrag?.());
</script>

<style scoped>
/* ── §LABEL-subgrid consume ──
   The params ride the shared `.labeled-field-grid` idiom (design-idioms.css —
   the DRY home). Nothing is re-authored here. */

.spring-view-tabs {
    align-self: center;
}

/* The pane card translates under the drag handle; keep its transform crisp +
   above siblings while dragging (the un-clip half of S7). */
.spring-pane {
    will-change: transform;
}

/* ── S7 — the drag handle affordance ──
   A quiet grip glyph that lifts on hover; the cursor reads grab/grabbing. */
.pane-drag-handle {
    touch-action: none;
}

/* ── Preset cells — the SINGLE preset surface ──
   The rail + ball geometry come from the shared .progress-rail / .progress-ball
   idiom (design-idioms.css). The rail tint lifts to 14% so the short in-cell
   track reads as a clear groove at rest. */
.preset-track .progress-rail {
    --rail-tint: 14%;
}
.preset-ball {
    --ball-size: 0.85rem;
    --ball-glow: 0%;
    margin-left: calc(var(--ball-size) / -2);
    will-change: left;
}

/* ── S3 — the RED-DASHED active/settled ring (the token treatment) ──
   The active cell wears the canonical motion-color (--color-progress, repointed
   to the --accent-red family by Lane B) as a DASHED outline — mirroring
   AnimationVisualizer's settled twin (`border-dashed border-accent-red/40
   bg-accent-red/15`), the user's explicit preference (U-K17). NOT a per-cell
   `border-red` class: the token is the authority; this is the dashed TREATMENT
   over it. The hover is the red-accent family (F3 — uninteresting/wrong-color
   hover cured), a faint tinted wash that reads as the motion language, not the
   neutral grey accent. */
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

/* ── The keyframes editor section ──
   The engine-owned KeyframesEditor is authored for the cube's full-height pane;
   in the rail it is CAPPED to a scrollable band so the per-stop cards + the
   stop-position slider stay reachable without the pane growing unbounded. The
   editor's own sticky footer (the slider + add/copy menubar) stays pinned. */
.keyframes-section {
    min-width: 0;
}
/* Cap the editor to a scrollable band so the per-stop cards stay reachable
   without the rail growing unbounded; the editor's `display:contents` grid is
   preserved (the cap rides a wrapper, not the editor's own layout root). The
   inner KeyframeCardList scrolls; the editor's sticky footer slider/menubar
   stays usable. */
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
