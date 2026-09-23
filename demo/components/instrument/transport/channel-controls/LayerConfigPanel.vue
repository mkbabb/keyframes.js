<template>
    <!-- F1 (H.W9.S3) → LP-10 ≡ KF-CO-37 (prose corrected at the bytes): the
         blend / z-index / weight / enabled rows render as glass-ui
         `.labeled-field` rows into ChannelOptions's advanced sub-pane, whose
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
                    <SelectItem
                        v-for="item in COMPOSITE_OPERATORS"
                        :key="item"
                        :value="item"
                    >
                        {{ item }}
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
    <LabeledField label="z-index" v-slot="{ controlId }">
        <NumberField
            :id="controlId"
            :model-value="layerConfig.zIndex"
            :step="1"
            :format-options="{ maximumFractionDigits: 0 }"
            :disabled="!layerConfig.enabled"
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

    <!-- LP-18 — the weight slider is the one 0–1 quantity at step 0.01 where
         precision is the point, and it shipped with no visible value (reka
         supplies `aria-valuenow`, so the reader was told the number and the
         sighted user was not). The readout is welded into the LABEL — the
         label track is the row's one text cell, so the number sits where the
         z-index row's integer sits one row up. (A LabeledSlider readout seam
         is a producer ask → SS-6.)
         LP-23 — a live `weightSpring` SILENTLY SHADOWS this write (weight.ts:
         `weightSpring?.value ?? weight`, spring exempt even from the clamp),
         so the slider is disabled while a spring drives the weight: a control
         whose write the engine ignores is not offered as live.
         LP-20 — `v-if` on the element itself, not a wrapping `<template>`. -->
    <LabeledSlider
        v-if="blendAvailable && layerConfig.op === 'replace'"
        :label="`weight ${layerConfig.weight.toFixed(2)}`"
        :model-value="layerConfig.weight"
        :min="0"
        :max="1"
        :step="0.01"
        :disabled="
            !layerConfig.enabled || layerConfig.weightSpring !== undefined
        "
        @update:model-value="(v: number) => emit('update', { weight: v })"
    />

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
import {
    LabeledField,
    LabeledSlider,
    LabeledSwitch,
} from "@mkbabb/glass-ui/labeled-field";
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
// binding it once carried was a phantom prop — KF-CO-2 / KF-CO-47.)
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
