<template>
    <Dialog v-model:open="modelOpen">
        <DialogContent
            @interact-outside="
                (event) => {
                    const target = event.target as HTMLElement;
                    if (target?.closest('[data-sonner-toaster]'))
                        return event.preventDefault();
                }
            "
        >
            <DialogTitle class="instrument-serif text-lg font-medium">{{ title }}</DialogTitle>
            <DialogDescription class="instrument-serif text-lg text-muted-foreground">{{ description }}</DialogDescription>
            <pre
                ref="textEl"
                @input="onInput"
                :class="preClass"
                contenteditable="true"
            ><code>{{ text }}</code></pre>
            <DialogFooter>
                <slot name="footer-extra" />
                <Button
                    class="cursor-pointer gap-2"
                    @click="onSubmit"
                >{{ buttonLabel }}<component v-if="buttonIcon" :is="buttonIcon" class="w-4 h-4" /></Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watch } from "vue";
import type { Component } from "vue";
import { Button } from "@components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@components/ui/dialog";

const props = withDefaults(
    defineProps<{
        title: string;
        description: string;
        buttonLabel: string;
        buttonIcon?: Component;
        initialText?: string;
        preClass?: string;
    }>(),
    {
        initialText: "",
        preClass: "fira-code min-h-[20vh] p-3 cursor-text rounded-lg text-sm bg-muted/50 outline-none border border-border",
    },
);

const modelOpen = defineModel<boolean>("open", { required: true });
const text = ref(props.initialText);
const textEl = useTemplateRef<HTMLElement>("textEl");

const emit = defineEmits<{
    (e: "submit", text: string): void;
}>();

watch(modelOpen, (open) => {
    if (open) {
        text.value = props.initialText;
    }
});

const onInput = (e: Event) => {
    text.value = (e.target as HTMLElement).innerText;
};

const onSubmit = () => {
    emit("submit", text.value);
};

defineExpose({ textEl });
</script>
