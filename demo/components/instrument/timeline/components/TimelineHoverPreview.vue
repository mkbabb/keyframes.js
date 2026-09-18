<template>
    <div class="flex flex-col items-center gap-1.5">
        <!-- The caption names the keyframe the way its AUTHOR does (KF.W7 G6 /
             C-5 (THP) + N-2): the typed label leads when there is one, then the
             AUTHORED selector — a named scroll phase renders as the phase the
             author wrote, never as a percent nobody typed — with the resolved
             position kept as the secondary reading. -->
        <div class="flex items-baseline justify-center gap-1 max-w-full">
            <span
                v-if="keyframe.label"
                class="text-mono-caption font-semibold truncate"
                >{{ keyframe.label }} ·</span
            >
            <span class="text-mono-caption font-semibold tabular-nums">{{ authoredSelector }}</span>
            <span
                v-if="resolvedPosition"
                class="text-mono-caption text-muted-foreground tabular-nums"
                >({{ resolvedPosition }})</span
            >
        </div>
        <!-- html2canvas capture (non-3D targets) -->
        <img
            v-if="previewSrc"
            :src="previewSrc"
            :alt="`Rendered preview of the keyframe at ${Math.round(keyframe.percent)}%`"
            class="w-36 h-auto rounded border border-border/30"
        />
        <!-- Ghost box preview from CSS vars -->
        <div
            v-else-if="Object.keys(ghostStyle).length > 0"
            class="w-16 h-16 rounded border border-border/30 bg-muted/30"
            :style="ghostStyle"
        ></div>
        <div v-if="loading" class="text-muted-foreground text-admin-label">
            Capturing...
        </div>
        <!-- THP D-5 (+ D-17's load-bearing `/70`) — THE PROP/VALUE TWO-TONE,
             given two REAL registers. The authored distinction was one register
             and one alpha: the value tier read `--muted-foreground` from the
             container and the prop tier read `--foreground` at 70%. On a
             floating surface `.glass-floating` PROMOTES `--muted-foreground`
             (to the on-glass strong rung), so the two tiers converged — null in
             light, INVERTED in dark — and the whole distinction ended up carried
             by the literal `:` between them. The promotion is not fought here
             and is not fought per-site: the prop tier simply takes `--foreground`
             at full strength, which no surface promotes past, so the pair holds
             its order in BOTH arms and on BOTH the `@container` and
             `contrast-color` routes. No WCAG breach is claimed and none is
             imported — glass is credited for the promotion that prevents one;
             painted ratios and which-arm-is-live stay KF.W9/SS-13's.
             The container's class string is deliberately untouched: `max-h-24`
             there is G-W6-8's sole witness and `text-admin-label` is W6-G's
             register row, so this cure cannot trip the same-commit collision
             law — it changes the CHILD's register, not the box's. -->
        <div class="font-mono text-admin-label text-muted-foreground max-h-24 overflow-y-auto w-full" data-register="code">
            <div v-for="[prop, val] in Object.entries(keyframe.vars)" :key="prop" class="truncate">
                <span class="text-foreground">{{ prop }}</span>: {{ val }}
            </div>
            <div v-if="Object.keys(keyframe.vars).length === 0" class="italic">No properties</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { selectorText } from "@utils/keyframeSelector";
import type { TimelineKeyframe } from "../timelineTypes";

const props = defineProps<{
    keyframe: TimelineKeyframe;
    // L-D2 — both props are bound from an INDEX READ in the parent
    // (`previewCache[kf.id]` / `previewLoading[kf.id]`, TimelineTrack.vue:89-90),
    // which is `T | undefined` under `noUncheckedIndexedAccess`. The attribute is
    // always PRESENT, so under `exactOptionalPropertyTypes` the honest type
    // carries `| undefined`; the `v-if="previewSrc"` guard at `:6` is what makes
    // the absent case correct at runtime.
    previewSrc?: string | undefined;
    loading?: boolean | undefined;
    ghostStyle: Record<string, string>;
}>();

// C-5 (THP) — the `KeyframeSelector` discriminant was dropped here: every
// caption was `Math.round(percent)%`, so `entry 100%` and `cover 0%` both read
// "25%" — a percent the author never wrote, on the panel whose whole job is to
// say which keyframe this is. A PERCENT selector's authored form IS its
// position (presentation rounding, no discriminant lost); a NAMED phase's
// authored form comes from `selectorText`, the same serialization the engine's
// merge key uses, so the caption can never drift from the artifact.
const authoredSelector = computed(() =>
    props.keyframe.selector.kind === "percent"
        ? `${Math.round(props.keyframe.percent)}%`
        : selectorText(props.keyframe.selector),
);

/** The resolved position, shown only when it is NOT what the author wrote. */
const resolvedPosition = computed(() =>
    props.keyframe.selector.kind === "percent"
        ? null
        : `${Math.round(props.keyframe.percent)}%`,
);
</script>
