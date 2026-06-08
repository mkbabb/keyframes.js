<template>
    <div class="flex flex-col items-center justify-center gap-4 h-full w-full px-6 lg:px-8 max-w-3xl mx-auto overflow-hidden">
        <!-- I5 (H.W11.S1) — the STAGE-CARD register. The former bare-class
             `glass-resting cartoon-surface` div (border-radius 0 — the I4 square
             defect the user caught: "motion-path's card is NOT rounded — it
             should be impossible") SWAPS to a standard, NON-cartoon glass
             `<Card>` — the protagonist plate, rounded-card by construction (I4
             closes FOR FREE). `shadow={false}` (FORK I5-shadow). All four stage
             scenes converge to ONE register. -->
        <Card :shadow="false" class="w-full flex-1 min-h-0 flex flex-col overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2.5 border-b border-border/40 shrink-0">
                <div class="flex items-baseline gap-3 min-w-0">
                    <span class="text-heading text-foreground truncate">MotionPath</span>
                    <span class="text-mono-caption text-muted-foreground tabular-nums whitespace-nowrap">
                        offset-distance = {{ (distance * 100).toFixed(0) }}%
                    </span>
                </div>
            </div>

            <!-- The viewport: the author path drawn as an SVG guide, with a
                 traveller element the engine moves via offset-distance. Drag the
                 traveller ALONG the path to scrub offset-distance directly. -->
            <div class="flex-1 min-h-0 flex items-center justify-center p-6">
                <div ref="stageEl" class="mp-stage relative">
                    <svg
                        class="mp-guide"
                        :viewBox="`0 0 ${VIEW} ${VIEW}`"
                        aria-hidden="true"
                    >
                        <path ref="guidePathEl" :d="PATH_D" class="mp-guide-path" fill="none" />
                    </svg>
                    <!-- The traveller: the engine sets offset-path + sweeps
                         offset-distance on THIS element (fromMotionPath). Slider
                         posture — pointer-drag scrubs the distance along the path,
                         the engine resumes its sweep on release. -->
                    <div
                        ref="travellerEl"
                        class="progress-ball mp-traveller"
                        :class="{ 'mp-traveller--dragging': dragging }"
                        role="slider"
                        aria-label="Drag the traveller along the path"
                        :aria-valuenow="Math.round(distance * 100)"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        tabindex="0"
                        @pointerdown="onPointerDown"
                        @keydown="onKeydown"
                    >
                        <span class="mp-traveller-glyph">&#x1F642;&#x200D;&#x2194;&#xFE0F;</span>
                    </div>
                </div>
            </div>

            <p class="px-6 pb-5 text-small text-muted-foreground text-center">
                A WAAPI-eligible
                <span class="code-token">offset-distance: 0% &rarr; 100%</span>
                over an author
                <span class="code-token">offset-path</span> &mdash; the browser owns
                the geometry. Drag the traveller along the path, or scrub from the bar below.
            </p>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, useTemplateRef } from "vue";
import { useEventListener } from "@vueuse/core";
import { Card } from "@mkbabb/glass-ui";
import { fromMotionPath } from "@src/animation/motion-path";
import { ManualTimeline } from "@src/animation/timeline";
import type { CSSKeyframesAnimation } from "@src/animation/engine";
import { MOTION_PATH_DEMO_KEY } from "./motionPathKeys";
import { PATH_D, VIEW } from "./motionPathGeometry";

const demo = inject(MOTION_PATH_DEMO_KEY)!;

const stageEl = useTemplateRef<HTMLElement>("stageEl");
const travellerEl = useTemplateRef<HTMLElement>("travellerEl");
const guidePathEl = useTemplateRef<SVGPathElement>("guidePathEl");

// The traveller's current offset-distance as a [0,1] ratio. The engine sweeps
// it during autoplay; the drag writes it directly. The header reads it.
const distance = ref(0);

// The path-motion animation built on mount — kept here so the drag can re-seat
// its playhead through the group scrub seam.
let anim: CSSKeyframesAnimation<any> | undefined;

// ManualTimeline is the engine's caller-driven progress primitive — the SAME
// pipeline class the bottom-bar scrub rides. The drag samples the pointer→length
// ratio into it (clamp + boundary-snap), then reads back `.progress`, so the drag
// owns NO bespoke clamp math (inv ζ — dogfood a public primitive, not new gesture
// code).
const timeline = new ManualTimeline();

onMounted(() => {
    const el = travellerEl.value;
    if (!el) return;
    // Construct the path-motion animation on the traveller via the engine's
    // fromMotionPath factory (F.W12.S1): it sets the author offset-path +
    // offset-rotate (tangent-following) on the element and builds the
    // offset-distance sweep. autoPlay:false — the editor's bottom bar drives it.
    anim = fromMotionPath(el, {
        path: `path('${PATH_D}')`,
        rotate: "auto",
        duration: 4000,
        autoPlay: false,
    });
    anim.name = "Path traversal";
    demo.registerAnimation(anim);
});

// ── Drag-along-the-path (S4a) ──────────────────────────────────────────
// Project the pointer onto the SVG <path> via getTotalLength()/getPointAtLength
// to the nearest length ratio, feed it through the ManualTimeline, and re-seat
// the engine playhead via the group scrub seam (setChildTime → render). The
// guide <path> and the traveller's CSS offset-path share ONE `d`
// (motionPathGeometry.ts), so the length the guide measures IS the length the
// browser positions the traveller along — no drift. The pause-for-gesture /
// resume-on-release mirrors the bottom bar's onScrubStart/onScrubEnd EXACTLY.

const dragging = ref(false);
let wasPlayingBeforeDrag = false;
let totalLen = 0;
// Coarse sampling step (in path-length units) for the nearest-point search; the
// path is ~1100 units long, so ~220 samples reads smooth without per-move cost.
const SAMPLE_STEP = 5;

// Project a client point onto the path: walk sampled points, find the nearest,
// return its length / total as a [0,1] ratio. The SVG and the traveller live in
// the SAME stage box, so client→SVG-user-units is the stage rect scale.
const projectPointer = (e: PointerEvent): number => {
    const pathEl = guidePathEl.value;
    const stage = stageEl.value;
    if (!pathEl || !stage || totalLen <= 0) return distance.value;

    const rect = stage.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return distance.value;
    // The guide SVG fills the stage with viewBox `0 0 VIEW VIEW`, so client px
    // map to user units by the stage→VIEW scale on each axis.
    const ux = ((e.clientX - rect.left) / rect.width) * VIEW;
    const uy = ((e.clientY - rect.top) / rect.height) * VIEW;

    let bestLen = 0;
    let bestDist = Infinity;
    for (let len = 0; len <= totalLen; len += SAMPLE_STEP) {
        const p = pathEl.getPointAtLength(len);
        const d = (p.x - ux) ** 2 + (p.y - uy) ** 2;
        if (d < bestDist) {
            bestDist = d;
            bestLen = len;
        }
    }
    return bestLen / totalLen;
};

// Write a [0,1] distance ratio to the traveller: pass it through the
// ManualTimeline (clamp + boundary-snap), then re-seat the engine playhead via
// the group scrub seam so interpFrames repaints offset-distance — ONE progress
// source for the drag and the bottom-bar scrub.
const applyDistance = (ratio: number) => {
    timeline.set(ratio);
    // tickDt advances the (smoothing-off) pipeline and returns the clamped,
    // boundary-snapped progress.
    const p = timeline.tickDt(16.667);
    distance.value = p;
    const group = demo.animationGroup.value;
    // The anim is registered under getAnimationId (its `name`); guard on the
    // resolved key so a not-yet-registered group is a no-op (never throws).
    if (anim?.name && group.animations[anim.name]) {
        group.setChildTime(anim, p * anim.options.duration).render();
    }
};

const onPointerDown = (e: PointerEvent) => {
    const pathEl = guidePathEl.value;
    if (!pathEl) return;
    totalLen = pathEl.getTotalLength();
    dragging.value = true;
    // Pause the group sweep for the gesture (the bottom bar's onScrubStart).
    const group = demo.animationGroup.value;
    wasPlayingBeforeDrag = group.playing();
    if (wasPlayingBeforeDrag) {
        group.pause();
        demo.isPlaying.value = false;
    }
    try {
        travellerEl.value?.setPointerCapture(e.pointerId);
    } catch { /* iOS / synthetic pointers may throw — drag still works */ }
    applyDistance(projectPointer(e));
};

// vueuse owns the listener lifecycle; the handler early-returns unless a drag is
// live — the idiomatic form the Spring rail uses.
useEventListener(window, "pointermove", (e: PointerEvent) => {
    if (!dragging.value) return;
    applyDistance(projectPointer(e));
});

useEventListener(window, "pointerup", () => {
    if (!dragging.value) return;
    dragging.value = false;
    // Release → resume autoplay from the re-seated playhead (setChildTime updated
    // pausedTime, so the resume is continuous, not a jump) — the bottom bar's
    // onScrubEnd.
    if (wasPlayingBeforeDrag) {
        demo.animationGroup.value.resume();
        demo.isPlaying.value = true;
    }
    wasPlayingBeforeDrag = false;
});

// Keyboard scrub (slider posture parity with Spring/Sequence).
const onKeydown = (e: KeyboardEvent) => {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = distance.value + 0.05;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = distance.value - 0.05;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 1;
    if (next === null) return;
    e.preventDefault();
    const group = demo.animationGroup.value;
    if (group.playing()) {
        group.pause();
        demo.isPlaying.value = false;
    }
    applyDistance(next);
};
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
    /* The guide is a passive backdrop; the traveller above owns the pointer. */
    pointer-events: none;
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
     • display: grid; place-items: center — centers the glyph child.
     • cursor: grab + touch-action: none — the slider affordance (S4a drag). */
.mp-traveller {
    top: 0;
    left: 0;
    margin-top: 0;
    display: grid;
    place-items: center;
    --ball-size: 2.75rem;
    --ball-glow: 40%;
    will-change: offset-distance;
    cursor: grab;
    touch-action: none;
    /* The shared .progress-ball idiom is `pointer-events: none` (a decorative
       scrubber ball riding a rail). The traveller is the S4a DRAG affordance
       (role="slider", @pointerdown) — re-enable pointer events so it can
       actually receive the drag the handler is wired for. */
    pointer-events: auto;
}

.mp-traveller--dragging {
    cursor: grabbing;
    --ball-glow: 55%;
}

.mp-traveller-glyph {
    /* H.W4.S4 (L2 leaf-tail sweep) — the raw 1.25rem was eyeballing the √φ
       rung; route it to the named `--type-subheading` (1.272rem) so the
       traveller glyph sits on the φ ladder, not a stray literal. */
    font-size: var(--type-subheading);
    line-height: 1;
    pointer-events: none;
}
</style>
