<template>
        <div
            class="col-span-2 w-full grid justify-items-center"
        >
            <Button
                variant="ghost"
                class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2 instrument-serif justify-self-start px-0 h-auto"
                @click="emit('exitDetailPanel')"
            >
                <ArrowLeft class="w-3.5 h-3.5" />
                back to controls
            </Button>

            <template
                v-if="(storedAnimationOptions.animationOptions.timingFunction as any) === 'cubic-bezier'"
            >
                <CubicBezierControls
                    :animation="animation"
                    :editing-curve-name="editingCurveName"
                    @update-timing-function="() => emit('updateTimingFunction', 'cubic-bezier')"
                    class="w-full"
                ></CubicBezierControls>
            </template>

            <template
                v-else-if="storedAnimationOptions.animationOptions.timingFunction === 'steps'"
            >
                <Card plain>
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
import type { StoredAnimationOptions } from "../stores";

import { jumpTerms } from "@src/easing";

import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Input,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@mkbabb/glass-ui";

import { defineAsyncComponent } from "vue";
const CubicBezierControls = defineAsyncComponent(() => import("./CubicBezierControls.vue"));
import { ArrowLeft } from "lucide-vue-next";

const { animation, storedAnimationOptions, timingFunctionsAnd, editingCurveName } = defineProps<{
    animation: Animation<any>;
    storedAnimationOptions: StoredAnimationOptions;
    timingFunctionsAnd: Record<string, any>;
    editingCurveName?: string;
}>();

const emit = defineEmits<{
    (e: "exitDetailPanel"): void;
    (e: "updateTimingFunction", key: TimingFunctionNames | "cubic-bezier"): void;
}>();

</script>
