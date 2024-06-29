<template>
    <div class="group grid grid-cols-1 gap-2 w-full items-center z-10">
        <div class="flex gap-2 w-[400px] h-full">
            <Select
                class="rounded-none border-none"
                :model-value="storedControls.selectedAnimation"
                @update:model-value="
                    (key) => {
                        storedControls.selectedAnimation = key;
                    }
                "
            >
                <SelectTrigger>
                    <SelectValue>{{ storedControls.selectedAnimation }}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem
                            v-for="[key, value] in Object.entries(animations)"
                            :key="key"
                            :value="key"
                        >
                            {{ key }}
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Button
                class="w-32 text-xl rainbow text-white"
                v-if="storedControls.selectedAnimation"
                @click="toggleAnimationGroup"
            >
                <font-awesome-icon
                    class="icon"
                    :icon="
                        animationGroup.playing() ? ['fas', 'pause'] : ['fas', 'play']
                    "
                />
            </Button>
        </div>

        <template v-for="[name, animation] in Object.entries(animations)">
            <AnimationControls
                v-if="storedControls.selectedAnimation == name"
                @slider-update="sliderUpdate"
                @keyframes-update="keyframesUpdate"
                :animation="animation"
                :is-grouped="true"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import { DarkModeToggle } from "@components/custom/dark-mode-toggle";

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@components/ui/menubar";

import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";

import { Clipboard } from "lucide-vue-next";

import { Animation, AnimationGroup, Vars } from "@src/animation";
import AnimationControls from "./AnimationControls.vue";
import Button from "@components/ui/button/Button.vue";

import { useStorage } from "@vueuse/core";
import { getStoredAnimationGroupControlOptions } from "./animationStores";

const { animations, superKey } = defineProps<{
    animations: { [key: string]: Animation<any> };
    superKey?: string;
}>();

const storedControls = getStoredAnimationGroupControlOptions(superKey);

const emit = defineEmits<{
    (e: "selectedAnimation", val: string): void;
}>();

const animationGroup = $ref(new AnimationGroup(...Object.values(animations)));

const sliderUpdate = (e: { t: number; animationId: number }) => {
    const { t, animationId } = e;

    const groupObject = animationGroup.animationGroup.find(
        (a) => a.animation.id == animationId,
    );

    const { animation } = groupObject;

    const paused = animation.paused;
    const prevT = animation.t;

    animation.paused = false;
    animation.t = t;

    // @ts-ignore
    animationGroup.transformFrames(t);

    animation.paused = paused;
    animation.t = prevT;
};

const toggleAnimationGroup = () => {
    if (!animationGroup.started) {
        animationGroup.play();
    } else {
        animationGroup.pause();
    }
};

const keyframesUpdate = (e: { animation: Animation<any> }) => {
    // Clear out the previous values
    const groupObject = animationGroup.animationGroup.find(
        (a) => a.animation.id == e.animation.id,
    );

    if (groupObject != null) {
        groupObject.values = {};
    }
};

onMounted(() => {});
</script>

<style scoped lang="scss">
.rainbow {
    --gradient: linear-gradient(
        90deg,
        rgba(255, 0, 0, 1) 0%,
        rgba(255, 127, 0, 1) 12.5%,
        rgba(255, 255, 0, 1) 25%,
        rgba(0, 255, 0, 1) 37.5%,
        rgba(0, 0, 255, 1) 50%,
        rgba(75, 0, 130, 1) 62.5%,
        rgba(143, 0, 255, 1) 75%,
        rgba(255, 0, 0, 1) 87.5%,
        rgba(255, 0, 0, 1) 100%
    );

    background: var(--gradient);

    &:hover {
        background: var(--gradient);
    }
}
</style>
