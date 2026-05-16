<template>
    <div class="grid">
        <Input
            class="sticky z-modal bg-transparent top-0 text-2xl w-16 text-ellipsis aspect-square font-semibold leading-none tracking-tight border-transparent p-0 m-0 shadow-none focus:border-transparent focus:shadow-none border-none"
            :model-value="frameStart"
            @update:model-value="(val) => emit('updateStart', String(val))"
        >
        </Input>

        <div class="relative">
            <div
                class="absolute top-2 right-4 grid gap-1 items-center justify-center justify-items-center"
            >
                <div class="flex">
                    <X
                        @click="(e) => emit('remove', e)"
                        class="p-0 m-0 scale-on-hover cursor-pointer stroke-2 w-6 h-6 text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent"
                    >
                    </X>
                    <CopyButton class="h-6 w-6" :text="frameString" />
                </div>
                <div
                    class="italic opacity-25 z-0 pointer-events-none grid gap-1"
                >
                    <Label
                        class="text-sm font-light leading-none font-mono"
                        >f {{ index }}</Label
                    >
                    <Label
                        class="text-sm font-light leading-none font-mono"
                        >s {{ frameStart }}</Label
                    >
                </div>
            </div>
            <pre
                @input="(e) => emit('updateCSS', (e.target as HTMLElement).innerText)"
                @keydown="(e) => emit('keydown', e)"
                class="hljs css p-2 min-h-32 cursor-text rounded-lg text-sm bg-transparent outline-none border-none relative"
                contenteditable="true"
            ><code>{{ formattedCSS }}</code></pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Label } from "@mkbabb/glass-ui";
import { Input } from "@mkbabb/glass-ui/forms";
import CopyButton from "@components/custom/CopyButton.vue";
import { X } from "lucide-vue-next";

defineProps<{
    frameString: string;
    formattedCSS: string;
    frameStart: string;
    index: number;
}>();

const emit = defineEmits<{
    (e: "updateStart", val: string): void;
    (e: "updateCSS", val: string): void;
    (e: "remove", event: Event): void;
    (e: "keydown", event: KeyboardEvent): void;
}>();

</script>
