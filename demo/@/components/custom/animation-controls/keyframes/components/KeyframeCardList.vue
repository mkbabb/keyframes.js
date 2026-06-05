<template>
    <div ref="listEl" class="contents">
        <template
            v-for="(s, i) in frameStrings"
            :key="frames[i]?.id ?? i"
        >
            <KeyframeCard
                :ref="(el: any) => (cardRefs[i] = el?.$el ?? el)"
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
import { ref, useTemplateRef } from "vue";
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

const listEl = useTemplateRef<HTMLElement>("listEl");
// Each card's root `$el`, captured for the remove animation + highlight scope.
const cardRefs = ref<any[]>([]);

/** The list's own <pre> code blocks — for scoped highlighting (no global sweep). */
const getPreElements = (): HTMLElement[] =>
    listEl.value ? Array.from(listEl.value.querySelectorAll("pre")) : [];

defineExpose({ cardRefs, getPreElements });
</script>
