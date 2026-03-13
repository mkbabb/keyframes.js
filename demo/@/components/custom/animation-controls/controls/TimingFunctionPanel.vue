<template>
        <div
            class="col-span-2 w-full grid justify-items-center"
        >
            <button
                class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors mb-2 fira-code justify-self-start"
                @click="emit('exitDetailPanel')"
            >
                <ArrowLeft class="w-3.5 h-3.5" />
                back to controls
            </button>

            <template
                v-if="(storedAnimationOptions.animationOptions.timingFunction as any) === 'cubic-bezier'"
            >
                <CubicBezierControls
                    :animation="animation"
                    @update-timing-function="() => emit('updateTimingFunction', 'cubic-bezier')"
                    class="w-full"
                ></CubicBezierControls>
            </template>

            <template
                v-else-if="storedAnimationOptions.animationOptions.timingFunction === 'steps'"
            >
                <Card class="border-none shadow-none">
                    <CardHeader class="p-0 pb-2">
                        <CardTitle class="instrument-serif">steps</CardTitle>
                    </CardHeader>
                    <CardContent class="p-0 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2">
                        <label class="fira-code text-xs text-muted-foreground">count</label>
                        <Input
                            type="number"
                            class="fira-code"
                            :model-value="storedAnimationOptions.stepOptions.steps"
                            @update:model-value="
                                (key: any) => {
                                    storedAnimationOptions.stepOptions.steps = key;
                                    emit('updateTimingFunction', 'steps' as any);
                                }
                            "
                        />

                        <label class="fira-code text-xs text-muted-foreground">jump term</label>
                        <Select
                            :model-value="storedAnimationOptions.stepOptions.jumpTerm"
                            @update:model-value="
                                (key: any) => {
                                    storedAnimationOptions.stepOptions.jumpTerm = key;
                                    emit('updateTimingFunction', 'steps' as any);
                                }
                            "
                        >
                            <SelectTrigger class="fira-code">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup class="fira-code">
                                    <SelectItem v-for="j in jumpTerms" :value="j">
                                        {{ j }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            </template>
        </div>
</template>

<script setup lang="ts">
import type { Animation } from "@src/animation/index";
import type { TimingFunction, TimingFunctionNames } from "@src/animation/constants";
import type { StoredAnimationOptions } from "../animationStores";

import { jumpTerms } from "@src/easing";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";

import { CubicBezierControls } from "@components/custom/animation-controls";
import { ArrowLeft } from "lucide-vue-next";

const { animation, storedAnimationOptions, timingFunctionsAnd } = defineProps<{
    animation: Animation<any>;
    storedAnimationOptions: StoredAnimationOptions;
    timingFunctionsAnd: Record<string, any>;
}>();

const emit = defineEmits<{
    (e: "exitDetailPanel"): void;
    (e: "updateTimingFunction", key: TimingFunctionNames | "cubic-bezier"): void;
}>();

</script>
