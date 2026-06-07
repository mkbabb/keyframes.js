<template>
    <div class="flex flex-col items-center justify-center gap-4 h-full w-full px-6 lg:px-8 max-w-3xl mx-auto overflow-hidden dock-inset">
        <div class="glass-card w-full flex-1 min-h-0 flex flex-col overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2.5 border-b border-border/40 shrink-0">
                <div class="flex items-baseline gap-3 min-w-0">
                    <span class="text-heading text-foreground truncate">MotionPath</span>
                    <span class="text-mono-caption text-muted-foreground tabular-nums whitespace-nowrap">
                        offset-distance sweep over an author offset-path
                    </span>
                </div>
            </div>

            <!-- The viewport: the author path drawn as an SVG guide, with a
                 traveller element the engine moves via offset-distance. -->
            <div class="flex-1 min-h-0 flex items-center justify-center p-6">
                <div ref="stageEl" class="mp-stage relative">
                    <svg
                        class="mp-guide"
                        :viewBox="`0 0 ${VIEW} ${VIEW}`"
                        aria-hidden="true"
                    >
                        <path :d="PATH_D" class="mp-guide-path" fill="none" />
                    </svg>
                    <!-- The traveller: the engine sets offset-path + sweeps
                         offset-distance on THIS element (fromMotionPath). -->
                    <div ref="travellerEl" class="progress-ball mp-traveller">
                        <span class="mp-traveller-glyph">&#x1F642;&#x200D;&#x2194;&#xFE0F;</span>
                    </div>
                </div>
            </div>

            <p class="px-6 pb-5 text-small text-muted-foreground text-center">
                A WAAPI-eligible
                <span class="code-token">offset-distance: 0% &rarr; 100%</span>
                over an author
                <span class="code-token">offset-path</span> &mdash; the browser owns
                the geometry, keyframes.js sweeps the scalar. Scrub from the bar below.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, useTemplateRef } from "vue";
import { fromMotionPath } from "@src/animation/motion-path";
import { MOTION_PATH_DEMO_KEY } from "./motionPathKeys";
import { PATH_D, VIEW } from "./motionPathGeometry";

const demo = inject(MOTION_PATH_DEMO_KEY)!;

const stageEl = useTemplateRef<HTMLElement>("stageEl");
const travellerEl = useTemplateRef<HTMLElement>("travellerEl");

onMounted(() => {
    const el = travellerEl.value;
    if (!el) return;
    // Construct the path-motion animation on the traveller via the engine's
    // fromMotionPath factory (F.W12.S1): it sets the author offset-path +
    // offset-rotate (tangent-following) on the element and builds the
    // offset-distance sweep. autoPlay:false — the editor's bottom bar drives it.
    const anim = fromMotionPath(el, {
        path: `path('${PATH_D}')`,
        rotate: "auto",
        duration: 4000,
        autoPlay: false,
    });
    anim.name = "Path traversal";
    demo.registerAnimation(anim);
});
</script>

<style scoped>
.mp-stage {
    width: min(70vmin, 26rem);
    aspect-ratio: 1;
}

.mp-guide {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
}

/* The author path drawn as a dashed guide so the traversal reads against it —
   tinted from the shared progress tone (consistent with the rail idiom's hue). */
.mp-guide-path {
    stroke: color-mix(in srgb, var(--color-progress) 35%, transparent);
    stroke-width: 2.5;
    stroke-dasharray: 6 7;
    stroke-linecap: round;
}

/* The traveller rides the engine-set offset-path; its position is the swept
   offset-distance (the browser resolves geometry from the path). It consumes the
   shared .progress-ball idiom (design-idioms.css) — the recipe it formerly
   hand-rolled with two drifted literals (the glow/blur drift F §1 consolidated
   everywhere else). Only the per-site variation lives here:
     • the offset-path positioning (top:0; left:0 — the engine sweeps
       offset-distance, so the ball is NOT rail-centered via margin-top),
     • --ball-size: 2.75rem (the largest ball in the demo),
     • --ball-glow: 40% — a NAMED per-site motion-cohesion delta (the larger
       traveller earns a brighter glow; the same seam EasingTarget/Spring use),
       over the idiom's 35% default. The 12px blur folds to the idiom's 10px.
     • display: grid; place-items: center — centers the glyph child. */
.mp-traveller {
    top: 0;
    left: 0;
    margin-top: 0;
    display: grid;
    place-items: center;
    --ball-size: 2.75rem;
    --ball-glow: 40%;
    will-change: offset-distance;
}

.mp-traveller-glyph {
    font-size: 1.25rem;
    line-height: 1;
}
</style>
