<template>
    <!-- The upright phone sheet's Reset (to the start): glass's quiet Button
         with the restart glyph. In the sheet's head row it is the glyph alone,
         its name in a tooltip; `labelled`, it is a row of its own, the glyph
         and its word. -->
    <Button
        v-if="labelled"
        emphasis="quiet"
        size="sm"
        class="sheet-reset-labelled"
        aria-label="Reset animation"
        @click="$emit('reset')"
    >
        <SkipBack aria-hidden="true" />
        Reset
    </Button>
    <Tooltip v-else>
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

defineProps<{
    /** A row of its own: the glyph and the word, at a one-channel section's foot. */
    labelled?: boolean;
}>();
defineEmits<{ (e: "reset"): void }>();
</script>

<style scoped>
/* The glyph alone takes half its seat, as the site's other glyphs do (glass's
   own Button glyph, `--ui-glyph`, is smaller). Scoped here: the glyph is this
   component's, so a rule in the pane's scoped sheet does not reach it. Beside
   its word the glyph keeps glass's own size. */
.sheet-head-glyph {
    width: calc(var(--control-h-md) / 2);
    height: calc(var(--control-h-md) / 2);
}
/* A row of its own: it stands at the row's start, never stretched across it. */
.sheet-reset-labelled {
    align-self: flex-start;
}
</style>
