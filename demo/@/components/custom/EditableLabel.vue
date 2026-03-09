<template>
    <span
        v-if="!isRenaming"
        :class="props.class"
        @dblclick="startRename"
    >{{ modelValue }}</span>
    <input
        v-else
        ref="renameInputEl"
        v-model="renameValue"
        :class="[props.class, 'bg-transparent border-b border-primary outline-none min-w-0']"
        @blur="commitRename"
        @keydown.enter="commitRename"
        @keydown.escape="isRenaming = false"
        @click.stop
    />
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from "vue";

const props = defineProps<{
    modelValue: string;
    class?: string;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const isRenaming = ref(false);
const renameValue = ref("");
const renameInputEl = useTemplateRef<HTMLInputElement>("renameInputEl");

const startRename = () => {
    renameValue.value = props.modelValue;
    isRenaming.value = true;
    nextTick(() => renameInputEl.value?.select());
};

const commitRename = () => {
    if (isRenaming.value && renameValue.value.trim()) {
        emit("update:modelValue", renameValue.value.trim());
    }
    isRenaming.value = false;
};

defineExpose({ startRename });
</script>
