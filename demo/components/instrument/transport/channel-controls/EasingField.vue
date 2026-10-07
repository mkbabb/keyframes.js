<template>
    <!-- X.KF.W13X.controls · A2-KE-L1-7 — the easing row, carved out of the
         card: the label with its edit pencil in the label track, the one
         easing picker in the value track (X.KF.W13V.c · OA-47 — ONE control
         row of the options grid's two tracks, after a divider that separates
         timing from the curve). -->
    <Separator class="my-1" />
    <div class="col-span-full grid grid-cols-subgrid items-center">
        <div class="col-start-1 flex items-center gap-1">
            <!-- X.KF.W13X.controls · UIA-KF-271 — the label is the fields'
                 one register and carries no status: the gold-shimmer that
                 flagged "a custom curve is stored" was a signal used nowhere
                 else on the card. The trigger carries that state now. -->
            <Label :id="labelId">easing</Label>
            <!-- KF-CO-42 — the pencil is the producer's quiet icon Button, at
                 its own `sm` size (UIA-KF-269: the `h-auto p-1` override that
                 shrank its hit area and focus ring is gone); ONE name, the
                 `aria-label`. -->
            <Button
                emphasis="quiet"
                icon-only
                size="sm"
                aria-label="Edit easing curve"
                @click.stop="(e: MouseEvent) => emit('edit', e.currentTarget as HTMLElement)"
            >
                <Pencil class="icon-sm" />
            </Button>
        </div>
        <!-- X.KF.W13W.p (OA-58) — the dropdown IS the one easing picker: a
             glass Popover over `EasingCatalogue`, the SAME body the Easing
             scene's gallery renders. It rides the card's one-open-at-a-time
             mutex. OA-28 / OA-31 — the closed trigger shows the CURRENT curve:
             its glyph (sampled from the easing the key installs) and its name.
             UIA-KF-271 — a parametric curve (the `cubic-bezier` / `steps` draft
             kinds) is named `custom`, beside the stored curve's own glyph.
             X-DS pass 1, C1 (KF-C1-05) — the trigger is a FIELD, so it wears
             the field skin the direction and fill-mode Selects above it wear
             (glass's own Select-trigger recipe: `control-surface` +
             `glass-control-edge`, at the control height), not a lifted
             secondary capsule Button: the label/field column is one tone and
             one edge. -->
        <Popover :open="open" @update:open="(v: boolean) => emit('update:open', v)">
            <PopoverTrigger as-child>
                <button
                    ref="triggerEl"
                    type="button"
                    class="control-surface glass-control-edge glass-capsule-hover tap-squish focus-ring transition-control col-start-2 flex h-(--control-h-md) w-full min-w-0 cursor-pointer items-center justify-between gap-1.5 rounded-pill px-3 text-dropdown"
                    :aria-labelledby="`${labelId} ${valueId}`"
                >
                    <span :id="valueId" class="flex min-w-0 flex-1 items-center gap-1.5">
                        <template v-if="curveGlyphs.has(selectedCurveKey)">
                            <svg
                                class="curve-glyph"
                                viewBox="0 0 1 1"
                                preserveAspectRatio="none"
                                overflow="visible"
                                aria-hidden="true"
                            >
                                <path
                                    :d="curveGlyphs.get(selectedCurveKey)"
                                    vector-effect="non-scaling-stroke"
                                />
                            </svg>
                            <span data-register="code" class="truncate font-mono">{{
                                isDraftKind(selectedCurveKey) ? "custom" : selectedCurveKey
                            }}</span>
                        </template>
                        <template v-else>{{ CURVE_PLACEHOLDER }}</template>
                    </span>
                    <ChevronDown class="icon-sm shrink-0 opacity-60" aria-hidden="true" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                aria-label="Easing curves"
                class="flex w-[min(26rem,calc(100vw-2rem))] max-h-[var(--easing-dropdown-max-h)] flex-col"
            >
                <EasingCatalogue
                    class="min-h-0 flex-1"
                    density="menu"
                    :model-value="curveGlyphs.has(selectedCurveKey) ? selectedCurveKey : null"
                    :groups="EASING_GROUPS"
                    :curve-for="curveFnFor"
                    label="Easing curves"
                    @update:model-value="(name: string) => emit('pick', name)"
                />
            </PopoverContent>
        </Popover>
    </div>
</template>

<script setup lang="ts">
import type { TimingFunction } from "@mkbabb/keyframes.js";
import { Button, Separator } from "@mkbabb/glass-ui";
import { Label } from "@mkbabb/glass-ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@mkbabb/glass-ui/popover";
import { ChevronDown, Pencil } from "@lucide/vue";
import { useId, useTemplateRef } from "vue";
import EasingCatalogue from "@components/EasingCatalogue/EasingCatalogue.vue";
import { EASING_GROUPS } from "@utils/reference-data/easingGroups";
import { isDraftKind } from "./composables/useTimingFunctionEditor";

defineProps<{
    /** The catalogue key the stored curve selects (a name or a draft kind). */
    selectedCurveKey: string;
    /** Every catalogue row's curve glyph, keyed by row name. */
    curveGlyphs: Map<string, string>;
    /** The easing a catalogue key installs (the tile plots read it). */
    curveFnFor: (key: string) => TimingFunction;
    open: boolean;
}>();

const emit = defineEmits<{
    (e: "update:open", open: boolean): void;
    (e: "pick", name: string): void;
    /** The pencil: open the editor; `opener` is where focus returns. */
    (e: "edit", opener: HTMLElement): void;
}>();

// KF-CO-21 — the visible `easing` IS the trigger's accessible name, with its
// current value (label + value, the way a Select trigger announces).
const labelId = useId();
const valueId = useId();
const CURVE_PLACEHOLDER = "Pick a curve";

const triggerEl = useTemplateRef<HTMLButtonElement>("triggerEl");
/** Where focus returns when an editor opened from a draft-kind pick closes. */
defineExpose({
    triggerControl: (): HTMLElement | null => triggerEl.value ?? null,
});
</script>

<style scoped>
/* OA-7 / OA-31 — the trigger's curve glyph: sized to its text line (em), inked
   by the trigger's own colour. */
.curve-glyph {
    flex: none;
    width: 1.5em;
    height: 1em;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
}
</style>
