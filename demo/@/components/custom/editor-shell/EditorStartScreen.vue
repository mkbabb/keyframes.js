<template>
    <div
        class="absolute left-0 top-0 z-30 mt-28 grid h-0 w-screen items-center gap-0 px-6 lg:mt-24 pointer-events-none"
    >
        <h1
            class="instrument-serif grid p-0 text-6xl font-bold lg:flex lg:text-8xl"
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
        <h2 class="instrument-serif w-full text-5xl font-light italic">
            {{ subtitle }}
            <List class="inline"></List> {{ subtitleSuffix }}
        </h2>
        <h2
            v-if="hint"
            class="instrument-serif w-full text-2xl font-light italic opacity-50"
        >
            {{ hint }}
        </h2>
    </div>
</template>

<script setup lang="ts">
import { List } from "lucide-vue-next";
import { AnimatedText } from "@components/custom/animation-controls";

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
