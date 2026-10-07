<template>
    <!-- X.KF.W13X.controls · A2-KE-L1-7 — the options form, carved out of the
         card that owned five jobs. It owns the five timing fields and their
         ONE guarded commit (`commitOption`); the card composes it.
         H.W11.I1 — the rows share ONE uniform label column through the
         `.labeled-field-grid` subgrid idiom (design-idioms.css
         §LABEL-subgrid). The default slot lands INSIDE that grid, so the
         easing row the card slots in sits in the same two tracks. -->
    <div class="labeled-field-grid">
        <LabeledInput
            :model-value="stored.animationOptions.duration ?? '5s'"
            label="duration"
            :invalid="invalidField === 'duration'"
            @update:model-value="
                (v) =>
                    commitOption(
                        'duration',
                        v,
                        (d) => animation.setDuration(d),
                        (d) => {
                            stored.animationOptions.duration = d;
                            emit('durationCommitted', animation.options.duration);
                        },
                    )
            "
        >
            <template #error>{{ invalidMessage }}</template>
        </LabeledInput>

        <LabeledInput
            :model-value="stored.animationOptions.delay ?? '0ms'"
            label="delay"
            :invalid="invalidField === 'delay'"
            @update:model-value="
                (v) =>
                    commitOption(
                        'delay',
                        v,
                        (d) => animation.setDelay(d),
                        (d) => {
                            stored.animationOptions.delay = d;
                        },
                    )
            "
        >
            <template #error>{{ invalidMessage }}</template>
        </LabeledInput>

        <!-- N-4 (KF-CO-40) — ONE stored spelling of forever: the store holds
             `"infinite"`, and a typed `∞` (which the engine accepts) is
             persisted as `"infinite"`.
             X-DS pass 5 (KF-C5-06) — and the field DISPLAYS that spelling. It
             showed the `∞` glyph, which Plus Jakarta Sans draws at x-height
             (~7 px wide): beside "2000ms" and "0ms" it read as a speck and the
             field looked empty. "infinite" is the CSS keyword, at cap height in
             the fields' one face. -->
        <LabeledInput
            :model-value="String(stored.animationOptions.iterationCount ?? 'infinite')"
            label="iterations"
            :invalid="invalidField === 'iterationCount'"
            @update:model-value="
                (v: string | number) =>
                    commitOption(
                        'iterationCount',
                        v,
                        (n) => animation.setIterationCount(n),
                        (n) => {
                            stored.animationOptions.iterationCount =
                                n === '∞' || n === 'Infinity' ? 'infinite' : n;
                        },
                    )
            "
        >
            <template #error>{{ invalidMessage }}</template>
        </LabeledInput>

        <LabeledField
            v-for="field in ENUM_FIELDS"
            :key="field.key"
            :label="field.label"
            v-slot="{ controlId, labelledBy, describedBy }"
        >
            <Select
                :model-value="stored.animationOptions[field.key] ?? field.fallback"
                :open="openSelect === field.key"
                @update:model-value="(v) => commitEnum(field.key, v)"
                @update:open="(v: boolean) => (openSelect = v ? field.key : null)"
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
                            v-for="item in field.items"
                            :key="item"
                            :value="item"
                        >
                            {{ item }}
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </LabeledField>

        <slot />
    </div>
</template>

<script setup lang="ts">
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { getStoredAnimationOptions } from "@state";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@mkbabb/glass-ui";
import { LabeledField, LabeledInput } from "@mkbabb/glass-ui/labeled-field";
import { ref } from "vue";
import { kfEngine } from "@kf-engine";

const props = defineProps<{ animation: KeyframesAnimation<any> }>();

// The form holds the channel's store key and is the one writer of the five
// timing fields (a prop is never mutated — X.KF.W13T.k3 · ESC-k2-1's rule).
const stored = getStoredAnimationOptions(props.animation);

const emit = defineEmits<{
    /** The engine ACCEPTED a duration: the ribbon's rail rescales on this
     *  edge (KF-CO-15 — the card is the one writer of the duration). */
    (e: "durationCommitted", ms: number): void;
}>();

/** The card's one-open-at-a-time mutex (the easing popover and the blend
 *  select ride the same model). */
const openSelect = defineModel<string | null>("openSelect", { required: true });

// L.W8 S1 ED-3 / KF-CO-14 — the enumerations are read SYNCHRONOUSLY off the
// demo's warmed engine (the engine chunk, never a deep @src import).
const { DIRECTIONS, FILL_MODES } = kfEngine();
const ENUM_FIELDS = [
    { key: "direction", label: "direction", items: DIRECTIONS, fallback: "normal" },
    { key: "fillMode", label: "fill mode", items: FILL_MODES, fallback: "forwards" },
] as const;

// ── KF-CO-3 ≡ L·B-1 / C·B-1 (+ N-1, N-15) — ONE guarded option handler ──────
// The engine setters are fail-explicit: a malformed PRESENT value throws an
// `AnimationOptionError`. The engine write is tried, the store is written ONLY
// on acceptance, and a rejection is surfaced through the producer's `invalid`
// + `#error` seam.
type OptionField = "duration" | "delay" | "iterationCount" | "direction" | "fillMode";
const invalidField = ref<OptionField | null>(null);
const invalidMessage = ref("");

// X.KF.W13X.controls · UIA-KF-166 — the rejection is said in the user's
// words, one short line per field. The engine's own message ("Invalid value
// for animation option "duration": "abc" — expected a positive duration in
// milliseconds or a CSS time string") wrapped to four red lines, re-centred the
// label and pushed the ribbon 96 px down. The engine keeps its message for
// developers; the field says what to type.
const REJECTED: Record<OptionField, string> = {
    duration: "Try 500ms or 2s",
    delay: "Try 0ms or 1s",
    iterationCount: "Try 3, or ∞",
    direction: "Pick a listed direction",
    fillMode: "Pick a listed fill mode",
};

const commitOption = <T,>(
    field: OptionField,
    value: T,
    apply: (value: T) => void,
    persist: (value: T) => void,
) => {
    try {
        apply(value);
    } catch (e) {
        if (!(e instanceof Error) || e.name !== "AnimationOptionError") throw e;
        invalidField.value = field;
        invalidMessage.value = REJECTED[field];
        return;
    }
    persist(value);
    if (invalidField.value === field) {
        invalidField.value = null;
        invalidMessage.value = "";
    }
};

// The two enumerated options arrive from the producer's Select as its
// `SelectionValue` (`string | number`); narrowed against the engine's own
// tuples (no `as any` — N-15).
const isOneOf = <const T extends readonly string[]>(
    list: T,
    value: string | number,
): value is T[number] => (list as readonly (string | number)[]).includes(value);

const commitEnum = (key: "direction" | "fillMode", v: string | number): void => {
    if (key === "direction") {
        if (!isOneOf(DIRECTIONS, v)) return;
        commitOption("direction", v, (d) => props.animation.setDirection(d), (d) => {
            stored.animationOptions.direction = d;
        });
        return;
    }
    if (!isOneOf(FILL_MODES, v)) return;
    commitOption("fillMode", v, (f) => props.animation.setFillMode(f), (f) => {
        stored.animationOptions.fillMode = f;
    });
};
</script>
