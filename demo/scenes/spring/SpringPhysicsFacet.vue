<template>
    <!-- THE PHYSICS FACET — the spring facility's additive facet surface
         (`surfacesFor`, T.B2), mounted by SpringScene's `tabsContent` into the
         channel controls. It is: the two LabeledSlider param rows + the
         parameter-space heatmap + the four canonical presets as clickable
         points — consumed glass components end to end — and one action that
         re-seeds the Sweep channel's keyframes from the physics (those
         keyframes are edited in the shared Keyframes pane, X.KF.W13V.s). The
         Sweep/Entry view fork is CHANNEL
         DATA on the transport Select, not this facet's. (The merged
         axis-labeled canvas instrument of T-SPR-6 stays design-PENDING; the
         heatmap is the live parameter-space surface until that design lands.)
         SPF-27 (KF.W6): this header was a tranche changelog naming files that
         no longer exist at any path; it now describes what mounts. -->
    <Card tier="quiet" class="cartoon-surface w-full overflow-visible">
        <CardContent class="panel-content flex flex-col gap-3 px-4 py-3">
            <!-- X.KF.W13V.y (OA-51; DESIGN-NOTE N-2) — the PARAM ROW idiom: the
                 label and the live value share ONE line, the slider spans the
                 row beneath (the default LabeledSlider stack; the value is an
                 `<output>` seated on the label's line by the `.param-row` grid,
                 design-idioms.css). The value is the readout — the slider
                 carries no second one; the humane string reaches AT through
                 the producer's `valueText`. -->
            <div class="flex flex-col gap-3">
                <div class="param-row">
                    <LabeledSlider
                        :model-value="demo.response.value"
                        label="response"
                        tooltip="Spring response time (s) — higher = slower"
                        :min="RESPONSE_AXIS.min"
                        :max="RESPONSE_AXIS.max"
                        :step="PARAM_STEP"
                        :value-text="(v: number) => `${v.toFixed(2)} seconds`"
                        @update:model-value="(v) => { demo.response.value = v; }"
                    />
                    <output class="param-value" aria-hidden="true">{{ demo.response.value.toFixed(2) }} s</output>
                </div>
                <div class="param-row">
                    <LabeledSlider
                        :model-value="demo.dampingFraction.value"
                        label="damping"
                        tooltip="Damping fraction (ζ) — <1 overshoots, ≥1 settles"
                        :min="DAMPING_AXIS.min"
                        :max="DAMPING_AXIS.max"
                        :step="PARAM_STEP"
                        :value-text="(v: number) => `damping ${v.toFixed(2)}`"
                        @update:model-value="(v) => { demo.dampingFraction.value = v; }"
                    />
                    <output class="param-value" aria-hidden="true">ζ {{ demo.dampingFraction.value.toFixed(2) }}</output>
                </div>
            </div>
            <Separator />
            <!-- ── P.W6 S3 — THE PARAMETER FIELD ─────────────────────────────
                 The (response × damping) surface tinted by the EXACT analytic
                 peak overshoot `exp(-ζπ/√(1-ζ²))`; clicking, sweeping or arrowing
                 across it writes the live (response, damping) through the SAME
                 two refs the rows above write. -->
            <SpringHeatmap
                v-model:response="demo.response.value"
                v-model:damping-fraction="demo.dampingFraction.value"
            />
            <Separator />
            <!-- X.KF.W13V.y (OA-51; DESIGN-NOTE N-2 · N-4) — the presets are ONE
                 glass ToggleGroup of TILES on `--radius-field` (16 px — a tile
                 holds two lines, so it is never a stadium): the preset's name and
                 ONE mono line of its parameters. No rail, ball or mini-slider
                 lives inside a tile (the four presets' live race is the stage's
                 derby, SpringTarget). SPF-4 stands: four mutually-exclusive
                 presets are ONE `type="single"` group — a labelled group, an
                 exclusive model derived from the live params (a deselect is
                 refused), roving focus; `aria-pressed` is the producer's. -->
            <ToggleGroup
                type="single"
                class="preset-grid grid w-auto max-w-none grid-cols-2 gap-2 rounded-none bg-transparent p-0 shadow-none backdrop-filter-none"
                aria-label="Spring presets"
                :model-value="activePresetName ?? NO_PRESET"
                @update:model-value="onPresetSelect"
            >
                <ToggleGroupItem
                    v-for="t in demo.tracks"
                    :key="t.preset.name"
                    :value="t.preset.name"
                    :title="t.preset.blurb"
                    class="preset-cell w-full min-w-0 flex-col items-start gap-0.5 bg-background px-3 py-2 font-medium leading-normal"
                >
                    <span class="text-small text-foreground capitalize">{{ t.preset.name }}</span>
                    <span class="text-mono-caption text-muted-foreground tabular-nums whitespace-nowrap">{{ t.preset.response }} s · ζ {{ t.preset.dampingFraction }}</span>
                </ToggleGroupItem>
            </ToggleGroup>
            <!-- X.KF.W13V.s (OA-37/46/51) — NO inline keyframes editor. The
                 Sweep channel's keyframes are edited in the SHARED Keyframes
                 pane (the dock's Keyframes item), as on every scene. The facet
                 keeps one ACTION: write the current physics into those
                 keyframes (an explicit re-seed, never a reactive overwrite). -->
            <button
                type="button"
                class="reseed-btn inline-flex items-center gap-1.5 self-start rounded-md px-2 py-1 text-caption font-medium text-muted-foreground hover:text-foreground"
                title="Replace the Sweep keyframes with stops sampled from the current spring"
                @click="demo.seedKeyframes()"
            >
                <RefreshCw class="w-3 h-3" aria-hidden="true" />
                <span>Write physics to keyframes</span>
            </button>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Card, CardContent, Separator } from "@mkbabb/glass-ui";
import { LabeledSlider } from "@mkbabb/glass-ui/labeled-field";
import { ToggleGroup, ToggleGroupItem } from "@mkbabb/glass-ui/toggle-group";
import { RefreshCw } from "@lucide/vue";

import SpringHeatmap, { DAMPING_AXIS, PARAM_STEP, RESPONSE_AXIS } from "./SpringHeatmap.vue";

import type { SpringDemoContext } from "./springKeys";
import type { SpringPreset, SpringTrack } from "./useSpringDemo";

const props = defineProps<{ demo: SpringDemoContext }>();
const demo = props.demo;

const isActivePreset = (t: SpringTrack) =>
    Math.abs(demo.response.value - t.preset.response) < 1e-6 &&
    Math.abs(demo.dampingFraction.value - t.preset.dampingFraction) < 1e-6;

/** The group's model, DERIVED from the live params: the preset whose (response,
 *  ζ) the spring currently has, or none. Never stored — the params are the truth. */
const activePresetName = computed(
    () => demo.tracks.find((t) => isActivePreset(t))?.preset.name,
);

/** The group's "no preset" selection — a value no item carries, so nothing is
 *  pressed. Passed as a string, not `undefined`: the producer's
 *  `ToggleGroupProps.modelValue` is typed without `undefined` under this tree's
 *  `exactOptionalPropertyTypes` while its runtime accepts one (the single-mode
 *  validator reads `e !== void 0`); a controlled group needs the explicit
 *  empty selection so a slider write off every preset EMPTIES it rather than
 *  leaving the last click pressed. The type ask rides SS-6. */
const NO_PRESET = "";

const applyPreset = (preset: SpringPreset) => {
    demo.response.value = preset.response;
    demo.dampingFraction.value = preset.dampingFraction;
};

/** A selection applies the named preset; a deselect (the active cell pressed
 *  again emits `undefined`) is refused — the set is exclusive and never empty. */
// The producer ToggleGroup emits its selection value (string | number), or an
// array of them in multiple mode (glass 8.0.0+); this group is `type="single"`,
// so an array never matches a preset name.
const onPresetSelect = (
    name: string | number | (string | number)[] | undefined,
) => {
    const track = demo.tracks.find((t) => t.preset.name === name);
    if (track) applyPreset(track.preset);
};
</script>

<style scoped>
/* ── The param rows ride the shared `.param-row` idiom (design-idioms.css —
   the DRY home; DESIGN-NOTE N-2). Nothing is re-authored here. */

/* ── The preset grid is a ToggleGroup for its selection model and roving
   focus, never for the producer's single-mode TRACK plate (padding, pill
   radius, quiet glass, backdrop, rim shadows — a segmented control's). That
   plate is reset ON THE ELEMENT with utilities (the `@layer utilities` rules
   outrank the producer's `@layer components` ones by layer order), NOT here:
   the ToggleGroup's root reaches the DOM through reka's `as-child`, which
   drops this component's scope attribute, so a scoped `.preset-grid` rule
   never matches it (measured live at this port — the `EasingTarget.css`
   `.specimen-grid` reset has the same reach and is inert for the same
   reason; that finding is relayed, not cured here). The producer ask — a
   track opt-out on `ToggleGroup` — already rides the mail from that port and
   is cited, not re-minted. The ITEMS do carry the scope attribute; the cell
   rules below reach them. */

/* ── S3 → T.D7 — the DASHED active/settled ring (the token treatment) ──
   The active cell wears the canonical motion-color (--color-progress — the
   OD-6 violet authority since T.D7; red is destructive-only) as a DASHED
   outline — mirroring AnimationVisualizer's settled twin (`border-dashed
   border-accent-kf/40 bg-accent-kf/15`), the dashed IDIOM the owner kept
   (U-K17) riding the new hue. NOT a per-cell color class: the token is the
   authority; this is the dashed TREATMENT over it. The hover is the same
   accent family, a faint tinted wash that reads as the motion language, not
   the neutral grey accent.

   SPF-5 — the washes are sized by the muted readout's contrast over them
   (WCAG AA, this wave's token battery): active 8 % reads 4.70:1 light /
   7.01:1 dark, hover 6 % reads 4.83 / 7.20; the shipped 12 % active wash read
   4.46:1 and FAILED. Hover and active stay distinct by wash AND outline.
   SPF-7 — no importance flag: these scoped rules are unlayered and outrank the
   producer's `@layer components` item paint by layer order alone. */
/* X.KF.W13V.y (DESIGN-NOTE N-4; glass DESIGN.md:385-391) — a tile holds two
   lines, so it sits on the multi-line field rung, never the producer item's
   stadium. */
.preset-cell {
    border-radius: var(--radius-field);
    outline: 1px dashed transparent;
    outline-offset: -1px;
    border-color: transparent;
    transition:
        outline-color var(--duration-fast) ease,
        background-color var(--duration-fast) ease;
}
.preset-cell:hover {
    background: color-mix(in srgb, var(--color-progress) 6%, var(--background));
    outline-color: color-mix(in srgb, var(--color-progress) 35%, transparent);
}
.preset-cell[data-state="on"] {
    background: color-mix(in srgb, var(--color-progress) 8%, var(--background));
    outline-color: color-mix(in srgb, var(--color-progress) 65%, transparent);
    border-color: transparent;
    box-shadow: none;
}

.reseed-btn {
    line-height: 1.2;
}
</style>
