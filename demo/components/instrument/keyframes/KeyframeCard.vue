<template>
    <div class="grid">
        <!-- KF-KC-4 ≡ KF-KC-13 ≡ KC-5 — the start/offset field STOPS ERASING THE
             CONTROL. This one `class` carried seven utilities that cancelled
             glass's `field-control` outright: `bg-transparent` killed the plate
             (`--glass-defined-plate` is set inside the very rule whose
             `background` shorthand resets `background-image`, so the plate was
             doubly dead), `border-transparent`/`border-none`/`shadow-none` took
             the edge, `p-0` took the padding, and `focus:border-transparent
             focus:shadow-none` took BOTH halves of `field-control:focus-visible`
             — whose own `outline: none` then forecloses the native fallback, so
             keyboard focus changed literally nothing outside forced-colors. The
             utilities layer is last, so every one of them won; the file's own
             `<pre>` forty lines down rings correctly, which is why this was an
             omission and never house style.
             The row's other admissible arm is the BARE VARIANT REQUEST to the
             producer (root-styling law: never per-instance erasure); that ask is
             already sent as O-26 R-16 and, when it lands, this field consumes
             the variant instead of re-erasing. Only geometry and type stay here. -->
        <Input
            class="sticky z-modal top-0 text-subheading w-16 text-ellipsis aspect-square font-semibold leading-none tracking-tight m-0"
            :model-value="displayStart"
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
                class="kf-focus-ring hljs css p-2 min-h-32 cursor-text rounded-lg text-small bg-transparent outline-none border-none relative"
                contenteditable="true"
                role="textbox"
                aria-multiline="true"
                :aria-label="`CSS for keyframe ${index}`"
            ><code>{{ formattedCSS }}</code></pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import { Label } from "@mkbabb/glass-ui";
import { Input } from "@mkbabb/glass-ui/forms";
import CopyButton from "@components/CopyButton.vue";
import { X } from "@lucide/vue";

const props = defineProps<{
    frameString: string;
    formattedCSS: string;
    frameStart: string;
    index: number;
}>();

// FE-3 — coerce the start to its scalar before binding the editable start
// field. The parent (KeyframeCardList) already passes a scalar, but a Spring
// `KeyframeSelector` object (`{ kind: "percent", value }`) reaching this Input
// would render `"[object Object]"`; extracting `.value` keeps the field honest
// regardless of what upstream hands down.
const displayStart = computed(() => {
    const s = props.frameStart as unknown;
    if (s != null && typeof s === "object" && "value" in s) {
        return String((s as { value: unknown }).value);
    }
    return String(s ?? "");
});

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
