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
        <h2 class="text-title w-full italic">
            {{ subtitle }}
            <List class="inline"></List> {{ subtitleSuffix }}
        </h2>
        <h2
            v-if="hint"
            class="text-subheading w-full italic text-muted-foreground"
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
        subtitleSuffix: "above.",
        hint: undefined,
    },
);
</script>
