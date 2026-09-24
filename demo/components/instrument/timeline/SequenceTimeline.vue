<template>
    <!-- THE TIMELINE PANE'S SEQUENCE MODE (X.KF.W13V.s2 · COHESION §0cw,
         ESC-s-1 option (b) · OA-46 "dock items for keyframes, timeline, etc —
         NOT inline"). A master-clock channel (one that carries a `sequence`
         descriptor) opens the shared Timeline pane on its ITEMS rather than on
         one Animation's keyframe offsets: one lane per item, each with its
         re-time handle; the master scrub is the pane's playhead. The same card
         the keyframe Timeline wears, so the pane is one surface in two modes.
         The stage keeps the subject only. -->
    <Card tier="quiet" class="cartoon-surface w-full overflow-visible">
        <CardContent class="relative flex flex-col gap-3 p-4">
            <div class="flex items-center justify-between gap-2">
                <span class="text-mono-caption text-muted-foreground">
                    {{ source.lanes().length }} items &middot;
                    <span class="tabular-nums">{{ source.duration() }} ms</span>
                </span>
                <!-- The re-time's undo (SC-2): the one path back to the default
                     placement, beside the handles it undoes. -->
                <Button
                    size="sm"
                    emphasis="quiet"
                    icon-only
                    aria-label="Reset the sequence items to the default stagger"
                    title="Reset the sequence items"
                    @click="source.reset()"
                >
                    <RotateCcw class="icon-sm" />
                </Button>
            </div>
            <SequenceLanes :source="source" />
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Button, Card, CardContent } from "@mkbabb/glass-ui";
import { RotateCcw } from "@lucide/vue";
import SequenceLanes from "./components/SequenceLanes.vue";
import type { SequenceTimelineSource } from "./timelineTypes";

const { source } = defineProps<{ source: SequenceTimelineSource }>();
</script>
