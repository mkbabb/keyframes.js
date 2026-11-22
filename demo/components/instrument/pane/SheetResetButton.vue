<template>
    <!-- The upright phone sheet's Reset (to the start): glass's quiet icon
         Button, the restart glyph, its name in a tooltip. -->
    <Tooltip>
        <TooltipTrigger as-child>
            <Button emphasis="quiet" icon-only aria-label="Reset animation" @click="$emit('reset')">
                <SkipBack class="sheet-head-glyph" aria-hidden="true" />
            </Button>
        </TooltipTrigger>
        <TooltipContent>Reset animation</TooltipContent>
    </Tooltip>
</template>

<script setup lang="ts">
import { Button } from "@mkbabb/glass-ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui/tooltip";
import { SkipBack } from "@lucide/vue";

defineEmits<{ (e: "reset"): void }>();
</script>
