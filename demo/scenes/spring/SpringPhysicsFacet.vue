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
            <!-- Live params — the UNIFORM label-column grammar (the cube's bar).
                 The two sliders join ONE `.labeled-field-grid` so their labels
                 ("response" / "damping (ζ)") resolve the SAME width (U5). Their
                 bounds and step are the FIELD's axes (one home for the
                 coordinate space the sliders and the field both write). -->
            <div class="labeled-field-grid">
                <LabeledSlider
                    :model-value="demo.response.value"
                    label="response"
                    label-class="text-small font-medium text-muted-foreground"
                    tooltip="Spring response time (s) — higher = slower"
                    :min="RESPONSE_AXIS.min"
                    :max="RESPONSE_AXIS.max"
                    :step="PARAM_STEP"
                    @update:model-value="(v) => { demo.response.value = v; }"
                />
                <LabeledSlider
                    :model-value="demo.dampingFraction.value"
                    label="damping (ζ)"
                    label-class="text-small font-medium text-muted-foreground"
                    tooltip="Damping fraction (ζ) — <1 overshoots, ≥1 settles"
                    :min="DAMPING_AXIS.min"
                    :max="DAMPING_AXIS.max"
                    :step="PARAM_STEP"
                    @update:model-value="(v) => { demo.dampingFraction.value = v; }"
                />
            </div>

            <!-- ── P.W6 S3 — THE PARAMETER FIELD ─────────────────────────────
                 The two abstract sliders above become a navigable field: a
                 (response × damping) surface tinted by the EXACT analytic peak
                 overshoot `exp(-ζπ/√(1-ζ²))` — a function of ζ alone, which the
                 field's legend states. Clicking, sweeping or arrowing across it
                 writes the live (response, damping). Two-way through the SAME
                 declared seam the sliders use: two models bound to the same two
                 refs — one shared control surface, one contract. -->
            <SpringHeatmap
                v-model:response="demo.response.value"
                v-model:damping-fraction="demo.dampingFraction.value"
            />

            <!-- Preset cells — the SINGLE preset surface (this is the ONE place
                 the four canonical presets live). Each cell carries its OWN live
                 track ball (painter-positioned). The active cell wears a DASHED
                 outline in the violet motion authority (`--color-progress`; the
                 scoped rules below) and the hover is the same family's faint
                 wash — the earlier "red-dashed ring / red-accent hover" wording
                 predated the token re-point (red is destructive-only).

                 SPF-4 (X.KF.W11.f): four mutually-exclusive presets are ONE
                 `ToggleGroup type="single"` (the `EasingTarget.vue` port), not
                 four independent selectable Chips: the section is a LABELLED
                 group, the selection model is exclusive by contract (the model
                 is derived from the live params, so a deselect is refused and
                 the set can never be empty), and focus roves — one tab stop,
                 arrows between cells. The items ship the producer's
                 `aria-pressed` (reka's toggle-group renders pressed buttons in a
                 `role="group"`, not radios); the radio half rides SS-6 as the
                 producer ask, never a demo-side attribute patch. `:title`
                 survives the item's attr filter; the tooltip-vs-slotted-copy
                 decision (SPF-13) is KF-CO-47's and is not taken here. The
                 earlier SPF-10 note (the retired Chip `shape="cell"` request)
                 is moot with the Chip: the column layout below is authored on
                 the item, as it was on the Chip. -->
            <ToggleGroup
                type="single"
                class="preset-grid grid w-auto max-w-none grid-cols-2 gap-2 rounded-none bg-transparent p-0 shadow-none backdrop-filter-none"
                aria-label="Spring presets"
                :model-value="activePresetName ?? NO_PRESET"
                @update:model-value="onPresetSelect"
            >
                <ToggleGroupItem
                    v-for="(t, i) in demo.tracks"
                    :key="t.preset.name"
                    :value="t.preset.name"
                    :title="t.preset.blurb"
                    class="preset-cell w-full flex-col items-start gap-1 rounded-pill bg-background px-3 pt-1.5 pb-2 font-medium leading-normal whitespace-nowrap"
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

<script lang="ts">
// ── SPF-3 — the preset-ball painter's GEOMETRY, stated and exported ───────────
// A track value is the spring's live position: 0 at rest, 1 at the target, and
// PAST either on the way (the four presets differ by exactly how far — analytic
// peaks 1.005 / 1.068 / 1.205 / 1.000 — and the tracks retarget in both
// directions, so the undershoot on a downward retarget is real and symmetric).
// The painter maps [-HEADROOM, 1 + HEADROOM] onto the track's full width, so
// rest sits at 1/6, the target at 5/6, and an overshoot visibly leaves the rail
// (which is inset to span exactly [0, 1]). The headroom exceeds the largest
// preset peak; the clamp is the geometric bound, never reached by the four.
import { clamp } from "@mkbabb/value.js/math";

/** The travel the track affords beyond rest and beyond the target, in value units. */
export const BALL_HEADROOM = 0.25;

/** A track value → its position along the track, 0 → 1 (the `cqw` fraction). */
export function ballTravel(value: number): number {
    return (clamp(value, -BALL_HEADROOM, 1 + BALL_HEADROOM) + BALL_HEADROOM) / (1 + 2 * BALL_HEADROOM);
}
</script>

<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";
import { computed, onMounted, onScopeDispose } from "vue";
import { Card, CardContent } from "@mkbabb/glass-ui";
import { LabeledSlider } from "@mkbabb/glass-ui/labeled-field";
import { ToggleGroup, ToggleGroupItem } from "@mkbabb/glass-ui/toggle-group";
import { RefreshCw } from "@lucide/vue";

import SpringHeatmap, { DAMPING_AXIS, PARAM_STEP, RESPONSE_AXIS } from "./SpringHeatmap.vue";

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
            // inline-size container). No per-frame layout, no width read. The
            // value is NOT clamped to [0, 1]: the overshoot is the point (SPF-3;
            // `ballTravel` above states the geometry).
            if (el) el.style.transform = `translateX(${ballTravel(values[i] ?? 0) * 100}cqw)`;
        }
    });
});
onScopeDispose(() => unregisterPainter?.());

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
/* ── §LABEL-subgrid consume ──
   The params ride the shared `.labeled-field-grid` idiom (design-idioms.css —
   the DRY home). Nothing is re-authored here. */

/* ── Preset cells — the SINGLE preset surface ──
   The rail + ball geometry come from the shared .progress-rail / .progress-ball
   idiom (design-idioms.css). The rail tint lifts to 14% so the short in-cell
   track reads as a clear groove at rest. The rail is INSET to span exactly the
   [0, 1] travel — rest at 1/6, the target at 5/6 of the track (`ballTravel`'s
   geometry) — so a ball that overshoots visibly leaves the rail's end. */
.preset-track .progress-rail {
    --rail-tint: 14%;
    left: calc(100% / 6);
    width: calc(100% * 2 / 3);
}
/* T.G4 — the track is the `cqw` inline-size container the preset ball's
   `translateX(<cqw>)` resolves against. */
.preset-track {
    container-type: inline-size;
}
/* The FOURTH authoring of the T.G4 anchor (m-8, riding KF-AV-10). The other
   three are one rule now (`SpringTarget.vue`, `.spring-ball, .sampler-ball,
   .derby-lane-ball`); this one is in a different component with its own scoped
   block, so sharing it would mean hoisting the x-anchor into the idiom itself —
   `design-idioms.css`, whose KF.W7 carve is stated not to widen, and a hoist
   that every one of the idiom's seven consumers must survive. Declared here
   rather than consolidated silently: kf-EasingTarget P-2 is why the idiom
   anchors in y and leaves x (and `transform`) to its consumers, and a careless
   unification drops balls out of their rails. Residual, owner named in the
   KF.W7 execution record. */
.preset-ball {
    --ball-size: 0.85rem;
    --ball-glow: 0%;
    left: 0; /* T.G4 — painter's translateX(<cqw>) carries the position */
    margin-left: calc(var(--ball-size) / -2);
    will-change: transform;
}

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
.preset-cell {
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
