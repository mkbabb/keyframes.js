<template>
    <div
        class="absolute flex flex-col items-center"
        :style="{ left: `${position}%`, top: 'calc(50% + var(--caret-offset))', transform: 'translateX(-50%)' }"
    >
        <div
            v-if="!isEditing"
            :class="[
                'font-mono text-admin-label cursor-pointer select-none transition-colors whitespace-nowrap tabular-nums',
                isSelected ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground',
            ]"
            @click.stop="startEdit"
        >{{ Math.round(percent) }}%</div>
        <input
            v-else
            ref="inputEl"
            type="number"
            :value="Math.round(percent)"
            class="font-mono text-admin-label w-10 h-5 text-center bg-background border border-border rounded px-0.5 outline-none focus:ring-1 focus:ring-primary"
            min="0"
            max="100"
            @blur="commitEdit"
            @keydown.enter="commitEdit"
            @keydown.escape="cancelEdit"
            @click.stop
            @pointerdown.stop
        />
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from "vue";
import { clamp } from "@mkbabb/value.js/math";

const props = defineProps<{
    keyframeId: string;
    percent: number;
    position: number;
    isSelected: boolean;
}>();

const emit = defineEmits<{
    (e: "update:percent", value: number): void;
    (e: "select"): void;
}>();

const isEditing = ref(false);
const inputEl = useTemplateRef<HTMLInputElement>("inputEl");

const startEdit = () => {
    emit("select");
    isEditing.value = true;
    nextTick(() => {
        inputEl.value?.select();
    });
};

const commitEdit = () => {
    if (!isEditing.value) return;
    const val = parseFloat(inputEl.value?.value ?? "");
    if (!isNaN(val)) {
        emit("update:percent", clamp(Math.round(val), 0, 100));
    }
    isEditing.value = false;
};

const cancelEdit = () => {
    isEditing.value = false;
};
</script>
