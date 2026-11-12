<template>
    <!-- X.KF.W13X.controls · A2-KE-L1-7 — the easing row, carved out of the
         card: the bare label in the label track, the one easing picker (with
         its edit pencil in the field's trailing slot) in the value track (X.KF.W13V.c · OA-47 — ONE control
         row of the options grid's two tracks, after a divider that separates
         timing from the curve). -->
    <Separator class="my-1" />
    <div class="col-span-full grid grid-cols-subgrid items-center">
        <!-- X.KF.W13X.controls · UIA-KF-271 — the label is the fields'
             one register and carries no status: the gold-shimmer that
             flagged "a custom curve is stored" was a signal used nowhere
             else on the card. The trigger carries that state now.
             X-DS pass 4 (KF-C4-15) — and the label is BARE, like its
             siblings': the edit pencil left the label column for the field's
             trailing slot (below), so one control shows one set of glyphs. -->
        <Label :id="labelId" class="col-start-1">easing</Label>
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
             one edge.
             X-DS pass 4 (KF-C4-07) — and one FACE: the curve's name is set in
             the field's text stack like `5s`, `alternate` and `forwards` in the
             fields above it (all CSS literals); the mono value was the only
             Fira Code leaf in the column. -->
        <div class="relative col-start-2 min-w-0">
        <Popover :open="open" @update:open="(v: boolean) => emit('update:open', v)">
            <PopoverTrigger as-child>
                <button
                    ref="triggerEl"
                    type="button"
                    class="control-surface glass-control-edge glass-capsule-hover tap-squish focus-ring transition-control flex h-(--control-h-md) w-full min-w-0 cursor-pointer items-center justify-between gap-1.5 rounded-pill ps-3 pe-10 text-dropdown"
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
                                    ref="glyphPath"
                                    :d="glyphD ?? curveGlyphs.get(selectedCurveKey)"
                                    vector-effect="non-scaling-stroke"
                                />
                            </svg>
                            <span class="truncate">{{
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
        <!-- KF-CO-42 — the pencil is the producer's quiet icon Button (UIA-KF-269:
             no override shrinks its hit area or focus ring); ONE name, the
             `aria-label`. X-DS pass 4 (KF-C4-15) — it sits in the field's
             trailing slot, a sibling of the trigger (a button never nests in a
             button), so the field reads as picker plus edit, and the label
             column is bare. -->
        <!-- owner-1112 (item 1c, "the edit button icon doesn't shrink like a
             click") — glass Button's JS press is the liquid squish (measured
             at 1440: x 1.03 · y 0.92 at the hold), which reads as a squash, not
             a press. The pencil keeps glass's quiet icon-only button skin (the
             `.button` contract: `data-emphasis` / `data-size` /
             `data-icon-only`) and takes glass's CSS press, `.tap-squish`
             (`--scale-press`, uniform), the same press the trigger beside it
             wears. Relayed to glass (a uniform press option on Button); when
             glass ships it this returns to `<Button>`. -->
        <button
            type="button"
            class="button tap-squish focus-ring absolute inset-y-0 end-1 my-auto"
            data-slot="button"
            data-emphasis="quiet"
            data-size="sm"
            data-icon-only
            aria-label="Edit easing curve"
            @click.stop="(e: MouseEvent) => emit('edit', e.currentTarget as HTMLElement)"
        >
            <Pencil class="icon-sm" />
        </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TimingFunction } from "@mkbabb/keyframes.js";
import { NumericAnimation } from "@mkbabb/keyframes.js";
import { easeInOutCubic } from "@mkbabb/value.js/easing";
import { Separator } from "@mkbabb/glass-ui";
import { Label } from "@mkbabb/glass-ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@mkbabb/glass-ui/popover";
import { ChevronDown, Pencil } from "@lucide/vue";
import { onScopeDispose, ref, useId, useTemplateRef, watch } from "vue";
import { useMediaQuery } from "@vueuse/core";
import EasingCatalogue from "@components/EasingCatalogue/EasingCatalogue.vue";
import { EASING_GROUPS } from "@utils/reference-data/easingGroups";
import { isDraftKind } from "./composables/useTimingFunctionEditor";

const props = defineProps<{
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

// ── owner-1112 (item 1b) — THE TRIGGER'S GLYPH MORPHS TO THE CHOSEN CURVE ──
// Every glyph is the same sampled polyline (`generateCurveSVGPath`: n + 1
// points on one x grid, y = 1 − f(x)), so a choice tweens each sample's y from
// the old curve to the new one: the line bends into its new shape instead of
// being swapped in a frame. The tween is the library's `NumericAnimation`
// over one `t`; `glyphD` holds the in-between path and is cleared on arrival,
// so at rest the glyph is exactly the map's path. Reduced motion: no bend,
// the new glyph fades up from the old one's place (a fade, never a cut).
const GLYPH_MORPH_MS = 420;
const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
const glyphD = ref<string | null>(null);
const glyphPath = useTemplateRef<SVGPathElement>("glyphPath");
const parseGlyph = (d: string | undefined): [number, number][] | null => {
    if (!d?.startsWith("M ")) return null;
    const pts = d
        .slice(2)
        .split(" L ")
        .map((pair) => pair.split(",").map(Number) as [number, number]);
    return pts.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y)) ? pts : null;
};
const morph = new NumericAnimation<{ t: number }>([{ t: 0 }, { t: 1 }], {
    duration: GLYPH_MORPH_MS,
    timingFunction: easeInOutCubic,
});
let morphRun = 0;
const fade = new NumericAnimation<{ o: number }>([{ o: 0.25 }, { o: 1 }], { duration: 200 });
onScopeDispose(() => {
    morph.stop();
    fade.stop();
});
watch(
    () => props.curveGlyphs.get(props.selectedCurveKey),
    (next, prev) => {
        if (!next || !prev || next === prev) return;
        morph.stop();
        fade.stop();
        if (reducedMotion.value) {
            glyphD.value = null;
            void fade.play(({ o }) => glyphPath.value?.style.setProperty("opacity", o.toFixed(3)));
            return;
        }
        // Bend from what is drawn now (a choice mid-morph starts from there).
        const from = parseGlyph(glyphD.value ?? prev);
        const to = parseGlyph(next);
        if (!from || !to || from.length !== to.length) {
            glyphD.value = null;
            return;
        }
        const run = ++morphRun;
        void morph
            .play(({ t }) => {
                glyphD.value = `M ${from
                    .map(([x, y], i) => `${x.toFixed(3)},${(y + (to[i]![1] - y) * t).toFixed(3)}`)
                    .join(" L ")}`;
            })
            .then(() => {
                if (run === morphRun) glyphD.value = null;
            });
    },
);
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
    /* owner-1112 (item 9) — the curve strokes are thicker across the demo. */
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}
</style>
