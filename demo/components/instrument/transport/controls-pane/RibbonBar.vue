<template>
    <div class="flex-shrink-0 pl-4 pr-7 pb-2">
        <Card cartoon tier="quiet" class="overflow-visible">
            <CardContent class="p-3">
                <!-- Controls tab: filled via Teleport from ChannelOptions -->
                <div
                    id="controls-ribbon-target"
                    v-show="storedControls.selectedControl === 'controls'"
                ></div>

                <!-- Keyframes tab -->
                <div
                    v-if="storedControls.selectedControl === 'keyframes'"
                    class="flex items-center justify-center gap-2 flex-wrap"
                >
                    <Button
                        size="sm"
                        emphasis="secondary"
                        @click="activeKeyframesRef?.copyCSS?.()"
                    >
                        <Copy class="icon-sm" /> Copy
                    </Button>
                    <Button
                        size="sm"
                        emphasis="secondary"
                        @click="activeKeyframesRef?.formatCSS?.()"
                    >
                        <Sparkles class="icon-sm text-gold" /> Format
                    </Button>
                    <!-- K.W10 CC-4 — Export CSS: compile the orchestration graph
                         to a zero-runtime CSS artifact via the gated compileToCSS
                         (the round-trip's BACKWARD half) + the honest CC-3
                         ineligibility report. The editor is a CSS-animation IDE. -->
                    <Button
                        size="sm"
                        emphasis="secondary"
                        @click="activeKeyframesRef?.exportCompiledCSS?.()"
                    >
                        <FileCode class="icon-sm text-emerald-500" /> Export CSS
                    </Button>
                    <Button
                        size="sm"
                        emphasis="secondary"
                        :class="
                            activeKeyframesRef?.cssApplied
                                ? 'rainbow-vivid text-white ribbon-apply--active'
                                : ''
                        "
                        @click="activeKeyframesRef?.applyCSSStyles?.()"
                    >
                        <Paintbrush
                            class="icon-sm"
                            :style="
                                !activeKeyframesRef?.cssApplied
                                    ? { stroke: 'url(#rainbow-gradient)' }
                                    : {}
                            "
                        />
                        Apply CSS
                    </Button>
                </div>

                <!-- Timeline tab -->
                <div
                    v-else-if="storedControls.selectedControl === 'timeline'"
                    class="flex items-center justify-center gap-2 flex-wrap"
                >
                    <Button
                        size="sm"
                        emphasis="secondary"
                        @click="activeTimelineRef?.snapshot?.()"
                    >
                        <Camera class="icon-sm" /> Snapshot
                    </Button>
                    <Button
                        size="sm"
                        emphasis="secondary"
                        @click="activeTimelineRef?.openImportDialog?.()"
                    >
                        <Download class="icon-sm" /> Import
                    </Button>
                    <Button
                        size="sm"
                        emphasis="secondary"
                        @click="activeTimelineRef?.exportCSS?.()"
                    >
                        <Upload class="icon-sm" /> Export
                    </Button>
                    <Button
                        size="sm"
                        emphasis="secondary"
                        @click="activeTimelineRef?.openAddCSSDialog?.()"
                    >
                        <FilePlus2 class="icon-sm" /> Add CSS
                    </Button>
                </div>

                <!-- Other tabs (matrix controls, etc.) via slot -->
                <div
                    v-else-if="storedControls.selectedControl !== 'controls'"
                    class="flex items-center justify-center gap-2 flex-wrap"
                >
                    <slot
                        name="ribbon-content"
                        :selected-control="storedControls.selectedControl"
                    ></slot>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import {
    Camera,
    Copy,
    Download,
    FileCode,
    FilePlus2,
    Paintbrush,
    Sparkles,
    Upload,
} from "@lucide/vue";
import { Button, Card, CardContent } from "@mkbabb/glass-ui";
import type { StoredAnimationGroupControlOptions } from "@state";

// The ribbon's eight Buttons carry NO class string of their own: `size="sm"` +
// `emphasis="secondary"` is the whole request, and the producer answers it
// (CPW D-M11 + D-m12). The former RIBBON_BUTTON_CLASS was five tokens, each
// one of: dead (the phantom `btn-*` utility token — zero rules in the demo,
// the dist and the shipped sheet), unreachable (`h-8` against `.button`'s `min-block-size`, which
// `height` never contests), duplicative (`rounded-full` over `--radius-control`,
// itself the pill), or actively de-scaling (`text-body` / `gap-1.5` pinning a
// rung and a 6px gap where the sm recipe scales both with `--ui-scale`). The
// active Apply state keeps its own three tokens below; nothing else is owed.

defineProps<{
    storedControls: StoredAnimationGroupControlOptions;
    activeKeyframesRef: any;
    activeTimelineRef: any;
}>();
</script>

<style scoped>
/* The active rainbow-vivid Apply button drops its border so the gradient
   reads edge-to-edge — was a `!border-transparent` Tailwind escape at the
   callsite (D.W2.S3); a scoped rule fights the cascade honestly. */
.ribbon-apply--active {
    border-color: transparent;
}
</style>
