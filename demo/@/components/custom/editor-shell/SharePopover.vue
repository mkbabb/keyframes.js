<template>
    <Popover v-model:open="sharePopoverOpen">
        <PopoverTrigger as-child>
            <button
                aria-label="Share animation"
                :class="[
                    'inline-flex items-center justify-center cursor-pointer scale-on-hover transition-all duration-fast bg-transparent border-none p-0',
                    sharePopoverOpen ? 'opacity-100' : 'hover:opacity-50',
                ]"
            >
                <Share2 class="icon-lg" />
            </button>
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
                    <ArrowRight class="icon-md" />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    class="h-8 w-8 p-0 shrink-0"
                    @click="shareState"
                    title="Copy share link"
                >
                    <Clipboard class="icon-md" />
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
    Button,
} from "@mkbabb/glass-ui";
import { Input } from "@mkbabb/glass-ui/forms";
import { useShareState } from "./useShareState";

const props = defineProps<{
    onSceneRestore?: (sceneId: string) => void;
}>();

const { sharePopoverOpen, loadHashInput, shareState, loadFromInput } =
    useShareState(props.onSceneRestore);
</script>
