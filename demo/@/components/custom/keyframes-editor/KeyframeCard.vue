<template>
    <div class="grid">
        <Input
            class="sticky z-modal bg-transparent top-0 text-subheading w-16 text-ellipsis aspect-square font-semibold leading-none tracking-tight border-transparent p-0 m-0 shadow-none focus:border-transparent focus:shadow-none border-none"
            :model-value="frameStart"
            @update:model-value="(val) => emit('updateStart', String(val))"
        >
        </Input>

        <div class="relative">
            <div
                class="absolute top-2 right-4 grid gap-1 items-center justify-center justify-items-center"
            >
                <div class="flex">
                    <!-- T.D7 (OD-6) — the delete-X is a DESTRUCTIVE affordance:
                         it rides the demo's destructive register (--accent-red,
                         red's ONE sanctioned home post-red-kill) instead of the
                         raw Tailwind red-500 literal, and is destructive-MARKED
                         so proof:accent-census's red-census recognizes the role. -->
                    <X
                        @click="(e) => emit('remove', e)"
                        data-destructive
                        class="p-0 m-0 scale-on-hover cursor-pointer stroke-2 w-6 h-6 text-accent-red hover:opacity-80 bg-transparent hover:bg-transparent"
                    >
                    </X>
                    <CopyButton class="h-6 w-6" :text="frameString" />
                </div>
                <div
                    class="italic opacity-25 z-0 pointer-events-none grid gap-1"
                >
                    <Label
                        class="text-mono-small font-light leading-none tabular-nums"
                        >f {{ index }}</Label
                    >
                    <Label
                        class="text-mono-small font-light leading-none tabular-nums"
                        >s {{ frameStart }}</Label
                    >
                </div>
            </div>
            <pre
                ref="preEl"
                @input="(e) => emit('updateCSS', (e.target as HTMLElement).innerText)"
                @keydown="(e) => emit('keydown', e)"
                class="focus-ring hljs css p-2 min-h-32 cursor-text rounded-lg text-small bg-transparent outline-none border-none relative"
                contenteditable="true"
                role="textbox"
                aria-multiline="true"
                :aria-label="`CSS for keyframe ${index}`"
            ><code>{{ formattedCSS }}</code></pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";
import { Label } from "@mkbabb/glass-ui";
import { Input } from "@mkbabb/glass-ui/forms";
import CopyButton from "@components/custom/CopyButton.vue";
import { X } from "@lucide/vue";

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

// The card's own contenteditable <pre> — surfaced for the parent's scoped
// highlight collection (a declared child-ref contract, no querySelector).
const preEl = useTemplateRef<HTMLElement>("preEl");

defineExpose({ preEl });
</script>
