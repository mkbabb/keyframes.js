<template>
    <!-- F1 (H.W9.S3) → LP-10 ≡ KF-CO-37 (prose corrected at the bytes): the
         blend / z-index / weight / enabled rows render as glass-ui
         `.labeled-field` rows into ChannelOptions's layer sub-pane, whose
         `.labeled-field-grid` wrapper is the ONE DRY source of the row shape —
         the §LABEL-subgrid idiom (design-idioms.css), a uniform derived label
         column across every row. This component does NOT re-author it (the
         W9-era `.panel-content :deep(.labeled-field)` rule this header once
         credited is deleted). The LabeledField slot contract is
         `labeled-field/types.d.ts` (`controlId` / `errorId`), not the 19-line
         `LabeledField.vue.d.ts`.
         LP-13 — the former `v-if="layerConfig"` guarded a REQUIRED prop; the
         sole mount site (ChannelOptions) guards, so the guard is deleted and
         the type is the truth.
         LP-6 / LP-17 — the DISABLED posture is the honest state, threaded
         through glass 7's `disabled` channel (surfaced as `data-disabled`):
         on a multi-target group the engine never reads `entry.layer`
         (`renderMultiTarget`), so blend AND enabled are inert together and
         both render disabled (the `blendAvailable` disclosure extended to the
         enabled row; the dangling `label[for]` readout row of LP-14 dies with
         its deletion); when `enabled` is false the layer contributes to
         nothing (its keys leave the stable union; every compositor path
         skips it), so blend / z-index / weight render disabled beneath the
         live switch. -->
    <!-- KF-CO-1 / LP-2 — `open` is the producer's DECLARED prop
         (`SelectProps.open?: boolean` on `./select` — LabeledSelect left
         `./labeled-field` at glass 8.0.0 for this LabeledField + Select
         composition — emit `update:open`). The former
         `is-open` spelling reached nothing, and the absent Boolean prop cast to
         `false` was forwarded unconditionally into reka's SelectRoot, pinning
         this select controlled-shut. -->
    <LabeledField
        label="blend"
        :disabled="!blendAvailable || !layerConfig.enabled"
        v-slot="{ controlId, labelledBy, describedBy }"
    >
        <Select
            :model-value="layerConfig.op"
            :open="open"
            :disabled="!blendAvailable || !layerConfig.enabled"
            @update:model-value="
                (v) => {
                    if (isCompositeOperator(v)) emit('update', { op: v });
                }
            "
            @update:open="(v: boolean) => emit('update:open', v)"
        >
            <SelectTrigger
                :id="controlId"
                :aria-labelledby="labelledBy"
                :aria-describedby="describedBy"
            >
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <!-- X.KF.W13X.controls · UIA-KF-171 — the blend select
                         speaks the sibling easing picker's idiom: each item a
                         name plus its muted description (the demo's own
                         `COMPOSITE_OPERATOR_DESCRIPTIONS`, through the
                         producer's declared `description` slot), and the
                         current value marked by the producer's item indicator
                         (glass ≥ 8 default, nothing hides it). -->
                    <SelectItem
                        v-for="item in COMPOSITE_OPERATORS"
                        :key="item"
                        :value="item"
                    >
                        {{ item }}
                        <template #description>{{
                            COMPOSITE_OPERATOR_DESCRIPTIONS[item]
                        }}</template>
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    </LabeledField>

    <!-- z-index: a raw <LabeledField> + a slotted control so blend/z-index/
         enabled are all one-cell rows (one paradigm, H.W3.S2). LabeledField
         owns the label/copy layer; the slot binds `controlId` by hand (the
         wrappers auto-wire it; `types.d.ts`).
         LP-8 ≡ KF-CO-35 (S-9, EVALUATED → ADOPTED, W6-I; LANDED at the
         frontier — booked GREEN-BEFORE-CURE by this unit): the control is the
         producer's `NumberField` (`./number-field`; since glass 8.0.0 the root
         is the group and ONE `NumberFieldStep` is parameterised by `direction`). The hand-rolled
         `<Input type="number">` sat outside the primitive's declared type
         union, invented data on a blank commit (`parseInt(…) || 0` — an empty
         field became a zero z-index) and committed on blur only. The
         NumberField emits a NUMBER payload through its own model, so the
         commit is `Number.isFinite`-gated: a blank or unparsable entry commits
         NOTHING, an integer step is the domain's own, and the stepper buttons
         give the row a keyboard and pointer increment it never had. `id`
         rides the root (reka hands it to the input through its context). The
         mono face and tabular numerals are the primitive's own
         (`.number-field__input`). The SECOND site of this evaluation —
         TimelineCaret's inline percent editor (C-4 / D·M-9, MISS-α6) — is
         DECLINED at the caret, in writing there.
         LP-11 — the former `:aria-errormessage="errorId"` was permanently
         inert (`errorId` resolves only under `invalid` + an `#error` slot,
         neither bound; ARIA also wants `aria-invalid`) and is deleted: the
         NumberField's finite-gate rejects nothing the user can see, so there
         is no error to point at. -->
    <!-- X.KF.W13X.controls · UIA-KF-169 — the ROW is disabled, not only its
         stepper: the LabeledField carries `disabled`, so glass sets
         `data-disabled` on the row and its label dims with the control (the
         label stayed at full ink while the stepper dimmed). UIA-KF-082 / 270 —
         and z-index is disabled with blend and enabled on a multi-target
         group: `renderMultiTarget` never reads `entry.layer`, so stepping it
         there changed nothing on screen while it was offered as live. -->
    <LabeledField
        label="z-index"
        :disabled="!blendAvailable || !layerConfig.enabled"
        v-slot="{ controlId }"
    >
        <NumberField
            :id="controlId"
            :model-value="layerConfig.zIndex"
            :step="1"
            :format-options="{ maximumFractionDigits: 0 }"
            :disabled="!blendAvailable || !layerConfig.enabled"
            @update:model-value="
                (v: number) => {
                    if (Number.isFinite(v)) emit('update', { zIndex: v });
                }
            "
        >
            <NumberFieldStep direction="decrement" />
            <NumberFieldInput />
            <NumberFieldStep direction="increment" />
        </NumberField>
    </LabeledField>

    <!-- X.KF.W13X.controls · UIA-KF-081 — the label is the static `weight`;
         the value is a trailing readout in its OWN fixed-width tabular cell
         beside the slider (the way the z-index row shows its integer). Welded
         into the label (`weight 1.00`) it made the label the widest in the
         pane, so showing or hiding the row moved every control 27 px sideways
         and each value step nudged them again. glass's `LabeledSlider` has no
         readout seam (SS-6), so the row is the producer's `LabeledField` +
         `Slider` composition (`controlLabelable: false` — reka's Slider root
         is a span; the thumb is named through `labelledBy`).
         LP-18 — the one 0–1 quantity at step 0.01 shows its number.
         LP-23 — a live `weightSpring` SILENTLY SHADOWS this write (weight.ts:
         `weightSpring?.value ?? weight`), so the slider is disabled while a
         spring drives the weight. LP-20 — `v-if` on the element itself. -->
    <LabeledField
        v-if="blendAvailable && layerConfig.op === 'replace'"
        label="weight"
        :control-labelable="false"
        :disabled="!layerConfig.enabled || layerConfig.weightSpring !== undefined"
        v-slot="{ labelledBy }"
    >
        <div class="flex items-center gap-2">
            <Slider
                class="min-w-0 flex-1"
                :aria-labelledby="labelledBy"
                :model-value="[layerConfig.weight]"
                :min="0"
                :max="1"
                :step="0.01"
                :value-text="(v: number) => v.toFixed(2)"
                :disabled="!layerConfig.enabled || layerConfig.weightSpring !== undefined"
                @update:model-value="
                    (v?: number[]) => {
                        const w = v?.[0];
                        if (w !== undefined) emit('update', { weight: w });
                    }
                "
            />
            <output class="weight-readout" aria-hidden="true">{{
                layerConfig.weight.toFixed(2)
            }}</output>
        </div>
    </LabeledField>

    <!-- KF-CO-8 ≡ LP-3 — the switch rides the producer's DECLARED model
         (`LabeledSwitchProps.modelValue: boolean`, emit `update:modelValue`).
         `checked`/`update:checked` were unknown to the installed component:
         the absent Boolean `modelValue` cast to `false` rendered the switch
         permanently OFF while the engine default is `enabled: true`, and
         the click listened for an event that was never fired. -->
    <LabeledSwitch
        label="enabled"
        :model-value="layerConfig.enabled"
        :disabled="!blendAvailable"
        @update:model-value="(v: boolean) => emit('update', { enabled: v })"
    />
    <!-- LP-12 — the terminal `<Separator>` (a bare `role="separator"` with no
         accessible name, separating the last row from nothing) is deleted. -->
</template>

<script setup lang="ts">
import type { AnimationLayerConfig } from "@mkbabb/keyframes.js";
import { LabeledField, LabeledSwitch } from "@mkbabb/glass-ui/labeled-field";
import { Slider } from "@mkbabb/glass-ui/slider";
import { COMPOSITE_OPERATOR_DESCRIPTIONS } from "@utils/reference-data/animationDescriptions";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@mkbabb/glass-ui/select";
import {
    NumberField,
    NumberFieldInput,
    NumberFieldStep,
} from "@mkbabb/glass-ui/number-field";

// LP-15 / LP-21 — ONE operator enumeration, policed against the engine's own
// union (`satisfies`: a member the engine drops fails to compile here), and
// the `op` write NARROWED at the emit boundary by a predicate over that same
// list — the producer's Select emits `string | number`, and the former `as` cast let
// an out-of-vocabulary operator ride `Object.assign` into the compositor's
// replace/weight-blend arm unvalidated. (The `COMPOSITE_OPERATOR_DESCRIPTIONS`
// binding it once carried was a phantom prop — KF-CO-2 / KF-CO-47; the table
// now reaches the items through the producer's declared `description` slot.)
type CompositeOperator = AnimationLayerConfig["op"];
const COMPOSITE_OPERATORS = [
    "replace",
    "add",
    "accumulate",
] as const satisfies readonly CompositeOperator[];
const isCompositeOperator = (v: string | number): v is CompositeOperator =>
    COMPOSITE_OPERATORS.some((op) => op === v);

defineProps<{
    layerConfig: AnimationLayerConfig;
    blendAvailable: boolean;
    /** The blend select's open state — the host's one-open-at-a-time mutex
     *  drives it through `open` / `update:open` (LP-16: a declared model,
     *  not a stringly-typed callback pair). Required, never absent: an absent
     *  Boolean prop casts to `false` and would pin the select shut. */
    open: boolean;
}>();

const emit = defineEmits<{
    (e: "update", val: Partial<AnimationLayerConfig>): void;
    (e: "update:open", open: boolean): void;
}>();
</script>

<style scoped>
/* UIA-KF-081 — the weight readout's own cell: a fixed width of tabular
   numerals, so a value step never moves the slider beside it. */
.weight-readout {
    flex: none;
    inline-size: 4ch;
    text-align: end;
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
}
</style>
