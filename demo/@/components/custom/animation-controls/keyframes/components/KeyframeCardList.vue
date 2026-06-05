<template>
    <div class="contents">
        <template
            v-for="(s, i) in frameStrings"
            :key="frames[i]?.id ?? i"
        >
            <KeyframeCard
                :ref="(el: any) => setCardRef(i, el)"
                :frame-string="s"
                :formatted-c-s-s="formatCSSKeyframeString(s)"
                :frame-start="frames[i].start.toString()"
                :index="i"
                @update-start="(val) => emit('updateStart', { val, index: i })"
                @update-c-s-s="(value) => emit('updateCSS', { value, index: i })"
                @remove="(e) => emit('remove', { event: e, index: i })"
                @keydown="(e) => emit('keydown', e)"
            />

            <Separator
                class="w-full"
                v-if="i < frameStrings.length - 1"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Separator } from "@mkbabb/glass-ui";
import { formatCSSKeyframeString } from "@src/animation/format";
import KeyframeCard from "../KeyframeCard.vue";

defineProps<{
    frameStrings: string[];
    frames: any[];
}>();

const emit = defineEmits<{
    (e: "updateStart", val: { val: string; index: number }): void;
    (e: "updateCSS", val: { value: string; index: number }): void;
    (e: "remove", val: { event: Event; index: number }): void;
    (e: "keydown", event: KeyboardEvent): void;
}>();

// The KeyframeCard child instances — a declared child-ref contract. Each card
// exposes its root `$el` (for the remove animation) and its `preEl` (the <pre>
// code block, for scoped highlighting) via defineExpose.
const cardInstances = ref<any[]>([]);
const setCardRef = (i: number, el: any) => {
    cardInstances.value[i] = el;
};

// Each card's root `$el`, derived for the remove animation + highlight scope.
const cardRefs = computed(() =>
    cardInstances.value.map((c) => c?.$el ?? c),
);

/** The list's own <pre> code blocks — collected from the cards' exposed `preEl`
 *  child refs (no querySelectorAll). */
const getPreElements = (): HTMLElement[] =>
    cardInstances.value
        .map((c) => c?.preEl)
        .filter((el): el is HTMLElement => el != null);

defineExpose({ cardRefs, getPreElements });
</script>
