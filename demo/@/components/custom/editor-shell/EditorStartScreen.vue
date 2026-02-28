<template>
    <div
        class="absolute left-0 top-0 mt-20 grid h-0 w-screen items-center gap-0 px-6 lg:mt-16"
    >
        <h1
            class="fraunces grid p-0 text-5xl font-bold lg:flex lg:text-7xl"
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
        <h2 class="fraunces w-full text-4xl font-light italic">
            {{ subtitle }}
            <List class="inline"></List> {{ subtitleSuffix }}
        </h2>
        <h2
            v-if="hint"
            class="fraunces w-full text-xl font-light italic opacity-50"
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
        subtitleSuffix: "below.",
        hint: undefined,
    },
);
</script>
