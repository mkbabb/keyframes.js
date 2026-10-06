<template>
    <!-- THE TIMELINE PANE'S SEQUENCE MODE (X.KF.W13V.s2 · COHESION §0cw,
         ESC-s-1 option (b) · OA-46 "dock items for keyframes, timeline, etc —
         NOT inline"). A master-clock channel (one that carries a `sequence`
         descriptor) opens the shared Timeline pane on its ITEMS rather than on
         one Animation's keyframe offsets: one lane per item, each with its
         re-time handle; the master scrub is the pane's playhead. The same card
         the keyframe Timeline wears, so the pane is one surface in two modes.
         The stage keeps the subject only. -->
    <!-- X.KF.W13X.sq+dh (§0dz, addendum (e)) — the pane wears glass's section
         anatomy, the same ConfiguratorLayer the Spring physics pane wears: the
         section label on the type scale, the reset in the layer's own header
         (#actions, addendum (c)), the item count and span as ONE subordinate
         caption in the body (it was an uppercase mono header competing with the
         lanes), then the lanes. -->
    <Card tier="quiet" class="cartoon-surface w-full overflow-visible">
        <CardContent class="panel-content px-4 py-3">
            <ConfiguratorLayer label="Sequence" default-open body-class="flex flex-col gap-3">
                <template #actions>
                    <!-- The re-time's undo (SC-2): the one path back to the default
                         placement, in the header of the section it undoes. -->
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
                </template>
                <p class="text-caption text-muted-foreground tabular-nums m-0" data-readout="secondary">
                    {{ source.lanes().length }} items &middot; {{ source.duration() }} ms
                </p>
                <SequenceLanes :source="source" />
            </ConfiguratorLayer>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Button, Card, CardContent } from "@mkbabb/glass-ui";
import { ConfiguratorLayer } from "@mkbabb/glass-ui/configurator";
import { RotateCcw } from "@lucide/vue";
import SequenceLanes from "./components/SequenceLanes.vue";
import type { SequenceTimelineSource } from "./timelineTypes";

const { source } = defineProps<{ source: SequenceTimelineSource }>();
</script>
