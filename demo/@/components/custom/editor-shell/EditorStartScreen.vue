<template>
    <div
        class="absolute left-0 top-0 z-controls mt-28 grid h-0 w-screen items-center gap-0 px-6 lg:mt-24 pointer-events-none"
    >
        <h1
            class="text-display-4 grid p-0 lg:flex"
        >
            <div>
                <AnimatedText
                    class="depth-text"
                    :text="title"
                ></AnimatedText>
            </div>

            <div>
                <AnimatedText
                    class="dot-fade depth-text"
                    :text="ellipsis"
                ></AnimatedText>
            </div>
        </h1>
        <h2 class="start-screen-prose text-title w-full italic">
            {{ subtitle }}
            <List class="inline"></List> {{ subtitleSuffix }}
        </h2>
        <h2
            v-if="hint"
            class="start-screen-prose text-subheading w-full italic text-muted-foreground"
        >
            {{ hint }}
        </h2>
    </div>
</template>

<script setup lang="ts">
import { List } from "@lucide/vue";
import AnimatedText from "@components/custom/AnimatedText.vue";

withDefaults(
    defineProps<{
        title?: string;
        ellipsis?: string;
        subtitle?: string;
        subtitleSuffix?: string;
        hint?: string;
    }>(),
    {
        title: "Select an animation",
        ellipsis: "...",
        subtitle: "from the list",
        subtitleSuffix: "below, then press Play.",
        hint: undefined,
    },
);
</script>

<style scoped>
/* F.W13.S1 — `text-wrap: pretty` on the start-screen running prose (the
   subtitle + hint <h2>s, NOT the LCP <h1> hero — that is F.W16's balance-class
   substrate). These two headings are multi-line running prose ("from the list
   below, then press Play." + the optional hint), for which the orphan-avoidance
   `pretty` algorithm is the better fit than the short-heading `balance` glass-ui
   applies to the `.text-*` family. Pure progressive enhancement: Chrome/Safari
   get the improved rag, Firefox (no `text-wrap: pretty` support) falls back to
   the inherited `balance`/standard wrap, byte-identical to today. Scoped to the
   demo's own prose — NOT a glass-ui override of the shared `.text-*` utilities. */
.start-screen-prose {
    text-wrap: pretty;
}
</style>
