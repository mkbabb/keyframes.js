<template>
    <Popover v-model:open="sharePopoverOpen">
        <PopoverTrigger as-child>
            <Share2
                title="Share"
                :class="[
                    'w-5 h-5 cursor-pointer hover:scale-105 transition-all duration-fast',
                    sharePopoverOpen ? 'opacity-100' : 'hover:opacity-50',
                ]"
            />
        </PopoverTrigger>
        <PopoverContent class="z-popover w-72 p-2" align="start" :side-offset="8">
            <div class="flex items-center gap-1.5">
                <Input
                    v-model="loadHashInput"
                    placeholder="Paste share URL..."
                    class="font-mono text-xs h-8 flex-1"
                    @keydown.enter="loadFromInput"
                />
                <Button
                    size="sm"
                    variant="ghost"
                    class="h-8 w-8 p-0 shrink-0"
                    @click="loadFromInput"
                    title="Load shared state"
                >
                    <ArrowRight class="w-4 h-4" />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    class="h-8 w-8 p-0 shrink-0"
                    @click="shareState"
                    title="Copy share link"
                >
                    <Clipboard class="w-4 h-4" />
                </Button>
            </div>
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts">
import { Share2, Clipboard, ArrowRight } from "lucide-vue-next";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    Input,
    Button,
} from "@mkbabb/glass-ui";
import { useShareState } from "./useShareState";

const props = defineProps<{
    onSceneRestore?: (sceneId: string) => void;
}>();

const { sharePopoverOpen, loadHashInput, shareState, loadFromInput } =
    useShareState(props.onSceneRestore);
</script>
