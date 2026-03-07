<template>
    <Card>
        <CardContent>
            <div
                class="relative flex flex-wrap gap-2 items-center justify-center justify-items-center w-full"
            >
                <template v-for="(color, ix) in savedColors">
                    <TooltipProvider :delay-duration="100">
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <div
                                    class="items-center rounded-sm w-12 aspect-square hover:scale-125 cursor-pointer transition-all border-1 border-solid border-gray-200"
                                    :style="{
                                        backgroundColor: normalizeColorUnit(
                                            color,
                                            true,
                                            false,
                                        ).toString(),
                                    }"
                                    @click="() => emit('select', color, ix)"
                                ></div>
                            </TooltipTrigger>
                            <TooltipContent class="fira-code">
                                {{
                                    normalizeColorUnit(
                                        color,
                                        true,
                                        false,
                                    ).value.toFormattedString()
                                }}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </template>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from "@components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@components/ui/tooltip";
import { normalizeColorUnit } from "@src/units/color/normalize";
import type { ColorValueUnit } from "./types";

defineProps<{
    savedColors: ColorValueUnit[];
}>();

const emit = defineEmits<{
    (e: "select", color: ColorValueUnit, ix: number): void;
    (e: "add"): void;
}>();
</script>
