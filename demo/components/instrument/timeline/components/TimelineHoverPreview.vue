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
        <!-- THP L-D7 — a status line is UI prose, not data: "Capturing..." wore
             a demo-authored mono chip register (uppercase, fixed 10px), a T.D4
             breach no allowlist selector could reach (it is a SIBLING of the
             code-register div). It takes the caption register in the TEXT face
             (W6-G role (d)) — the tooltip's own body rung, muted. The
             REGISTER-LAUNDER datum (the census gate cannot see a transform) is
             KF.W4's and is carried, not re-booked. -->
        <div v-if="loading" class="text-caption text-muted-foreground">
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
             painted ratios and which-arm-is-live stay KF.W9/SS-13's. -->
        <!-- THP D-4 UNDER THE MISSED-3 CURE-COLLISION LAW (G-W6-8) — the
             register swap and the box resize are ONE edit, by construction.
             D-4: this list overrode the tooltip's own declared body size
             DOWNWARD to a fixed 10px at line-height 1, uppercased and
             caps-tracked, for a ~10-row scrolling dump of CSS declarations. It
             takes `text-mono-small` (W6-G roles (b)/(e): mono, case-preserving,
             `--type-small` at leading 1.4); the redundant mono family utility
             is the fourth and last of the D-18 pass.
             MISSED-3, re-derived at the bytes: the old box was 24 × 0.25rem =
             96px of 10px rows → 9.6 rows visible; the new rows are 1.4em of a
             14–20px glyph = 19.6–28px, so the SAME box would show 4.9→3.4 rows
             and worsen D-3 (the hidden rows are keyboard-unreachable). The
             bound is therefore re-denominated in the register's OWN em on the
             element that carries it: 12.6em = 9 rows × 1.4 at every fluid size,
             so the scroller (the affordance — the bound is replaced, never
             dropped) shows the same nine rows it always did. A-9 — the
             producer's TooltipContent block ceiling — is NOT in the installed
             7.0.0 (I-35 §2: it exists at HEAD only), so this bound is the
             component's own and does not lean on one. -->
        <div class="text-mono-small text-muted-foreground max-h-[12.6em] overflow-y-auto w-full" data-register="code">
            <div v-for="[prop, val] in Object.entries(keyframe.vars)" :key="prop" class="truncate">
                <span class="text-foreground">{{ prop }}</span>: {{ val }}
            </div>
            <!-- THP MISSED-2 — the empty state's only differentiator was an italic
                 that cannot paint (no italic face, no synthesis: the demo's one
                 italic decision, style.css). A REAL differentiator: the TEXT face
                 at the caption rung against the mono declaration rows it stands
                 in for — a change of voice, not of slant. -->
            <div v-if="Object.keys(keyframe.vars).length === 0" class="text-caption">No properties</div>
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
