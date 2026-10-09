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
    <!-- X-DS pass 1, C1 (KF-C1-07) — no card of its own: the pane host draws the one frame (ControlsPaneWrapper), so this surface is flat inside it. -->
    <div class="w-full">
        <div class="panel-content p-0">
            <!-- X-DS pass 2 · KF-C2-08 — the pane is named for what it
                 controls (the items' stagger, the word its reset already uses);
                 the stage keeps the subject's name, so "Sequence" is said once. -->
            <!-- X-DS pass 16 (KF-C16-06) — the body's block end matches its inline
                 inset (glass's body is px-5 · py-2), so the lanes and the playhead
                 seat 20 px above the pane's edge instead of ~8 px. -->
            <ConfiguratorLayer label="Stagger" default-open body-class="flex flex-col gap-3 pb-5">
                <template #actions>
                    <!-- X.KF.W13X.dh2 (UIA-KF-098) — THE REEL, homed off the
                         stage: a verb on the items, so it sits with their other
                         verb in this layer's header, in Reset's register (glass
                         Button, quiet, icon-only). Its running state is the
                         Button's shipped `loading` contract (KFA-220: aria-busy,
                         the busy glyph, activation suppressed while it runs).
                         The stage card keeps the subject and its one readout.
                         X-DS r3 pass 2 (KF-C21-03) — ONE header-verb grammar with
                         the Physics pane: the Reel is a LABELLED quiet verb (the
                         word, as 'To keyframes' is; the clapperboard read as
                         ornament), and the visible word is inside the accessible
                         name (label-in-name). -->
                    <Button
                        size="sm"
                        emphasis="quiet"
                        :loading="source.isReeling()"
                        aria-label="Reel — play a cascading wave replay"
                        title="Play the reel"
                        @click="source.playReel()"
                    >
                        Reel
                    </Button>
                    <!-- The same vertical hairline the Physics header carries
                         (KF-C16-07) closes the labelled verb. -->
                    <Separator orientation="vertical" class="h-4 self-center" />
                    <!-- The re-time's undo (SC-2): the one glyph-only verb, the path
                         back to the default placement, in the header of the
                         section it undoes. -->
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
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button, Separator } from "@mkbabb/glass-ui";
import { ConfiguratorLayer } from "@mkbabb/glass-ui/configurator";
import { RotateCcw } from "@lucide/vue";
import SequenceLanes from "./components/SequenceLanes.vue";
import type { SequenceTimelineSource } from "./timelineTypes";

const { source } = defineProps<{ source: SequenceTimelineSource }>();
</script>
