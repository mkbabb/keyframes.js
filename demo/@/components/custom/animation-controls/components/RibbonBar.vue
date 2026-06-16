<template>
    <div class="flex-shrink-0 pl-4 pr-7 pb-2">
        <Card surface="cartoon" tier="quiet" class="overflow-visible">
            <CardContent class="p-3">
                <!-- Controls tab: filled via Teleport from AnimationControlsControls -->
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
                        variant="outline"
                        :class="RIBBON_BUTTON_CLASS"
                        @click="activeKeyframesRef?.copyCSS?.()"
                    >
                        <Copy class="icon-sm" /> Copy
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        :class="RIBBON_BUTTON_CLASS"
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
                        variant="outline"
                        :class="RIBBON_BUTTON_CLASS"
                        @click="activeKeyframesRef?.exportCompiledCSS?.()"
                    >
                        <FileCode class="icon-sm text-emerald-500" /> Export CSS
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        :class="[
                            RIBBON_BUTTON_CLASS,
                            activeKeyframesRef?.cssApplied
                                ? 'rainbow-vivid text-white ribbon-apply--active'
                                : '',
                        ]"
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
                        variant="outline"
                        :class="RIBBON_BUTTON_CLASS"
                        @click="activeTimelineRef?.snapshot?.()"
                    >
                        <Camera class="icon-sm" /> Snapshot
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        :class="RIBBON_BUTTON_CLASS"
                        @click="activeTimelineRef?.openImportDialog?.()"
                    >
                        <Download class="icon-sm" /> Import
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        :class="RIBBON_BUTTON_CLASS"
                        @click="activeTimelineRef?.exportCSS?.()"
                    >
                        <Upload class="icon-sm" /> Export
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        :class="RIBBON_BUTTON_CLASS"
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
import type { StoredAnimationGroupControlOptions } from "../stores";

const RIBBON_BUTTON_CLASS = "h-8 gap-1.5 text-body rounded-full btn-interactive";

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
