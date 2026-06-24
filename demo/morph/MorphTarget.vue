<template>
    <div
        class="mx-auto flex h-full w-full max-w-3xl flex-col items-center
            justify-center gap-4 overflow-hidden px-6 lg:px-8"
    >
        <Card
            :shadow="false"
            class="morph-target flex min-h-0 w-full flex-1 flex-col
                overflow-hidden"
        >
            <!-- The header: the scene name on the display rung + the live morph
                 pair (from → to) as the headline metric + the glyph's live
                 tangent (the orient channel) as the quieter sibling — the same
                 header rhythm as MotionPath/Sequence. -->
            <div
                class="border-border/40 flex shrink-0 flex-wrap items-center
                    justify-between gap-3 gap-y-1 border-b px-4 py-2.5"
            >
                <div
                    class="flex min-w-0 flex-wrap items-baseline gap-3 gap-y-1"
                >
                    <span class="text-display text-foreground truncate"
                        >MorphSVG</span
                    >
                    <MetricBadge
                        size="xl"
                        label="morph"
                        label-position="inline"
                        :value="`${demo.fromShape.value.label} → ${demo.toShape.value.label}`"
                        color="var(--ball-tone, var(--color-progress))"
                        class="shrink-0"
                    />
                    <MetricBadge
                        size="lg"
                        label="tangent"
                        label-position="inline"
                        :value="Math.round(glyphAngleDeg)"
                        unit="&deg;"
                        class="shrink-0"
                    />
                </div>
                <!-- Advance the shape ring to the next pair — rebuilds the morph
                     over the new `from → to` and re-targets the same <path>. The
                     accessible name STARTS WITH the visible label (WCAG 2.5.3). -->
                <Button
                    variant="outline"
                    class="text-small btn-interactive h-7 shrink-0 gap-1.5"
                    aria-label="Next shape pair"
                    @click="onNextShape"
                >
                    <Shuffle class="h-3.5 w-3.5" />
                    <span>Next shape</span>
                </Button>
            </div>

            <!-- The stage: a live <path> whose `d` the engine drives each frame
                 via the Q.WC4 render contract (the `d:` CSS property +
                 var(--morph-d) fallback). The morphing shape paints DIRECTLY —
                 no per-frame Vue binding, the engine owns the `d`. -->
            <div class="flex min-h-0 flex-1 items-center justify-center p-4">
                <div class="morph-stage relative">
                    <svg
                        class="morph-canvas"
                        :viewBox="`0 0 ${VIEW} ${VIEW}`"
                        aria-hidden="true"
                    >
                        <!-- The endpoint ghosts: the `from` + `to` shapes drawn
                             faint so the morph reads AGAINST its two extremes. -->
                        <path
                            :d="demo.fromShape.value.d"
                            class="morph-ghost morph-ghost--from"
                            fill="none"
                        />
                        <path
                            :d="demo.toShape.value.d"
                            class="morph-ghost morph-ghost--to"
                            fill="none"
                        />
                        <!-- THE SUBJECT: the engine writes its `d:` each frame
                             (var(--morph-d) is the cross-browser fallback). It
                             starts at the `from` shape so it paints before play. -->
                        <path
                            ref="morphPathEl"
                            data-morph-subject
                            :d="demo.fromShape.value.d"
                            class="morph-subject"
                        />
                    </svg>
                    <!-- The oriented glyph (S2 dogfood): sits at a body point of
                         the morphed outline and BANKS to that point's tangent —
                         rotate: var(--morph-glyph-angle) reads the engine's
                         interpolated --morph-{i}-angle channel. -->
                    <div
                        class="morph-glyph"
                        :style="{
                            left: `${glyphX}px`,
                            top: `${glyphY}px`,
                            '--morph-glyph-angle': `${glyphAngleDeg}deg`,
                        }"
                        aria-hidden="true"
                    >
                        <span class="morph-glyph-bank">&#9650;</span>
                    </div>
                </div>
            </div>

            <p class="text-small text-muted-foreground px-6 pb-5 text-center">
                A HEAVY
                <span class="code-token">fromMorphSVG(from, to)</span>
                over value.js&rsquo;s
                <span class="code-token">PathGeometry</span> &mdash; the engine
                writes the morphed <span class="code-token">d</span> each frame;
                the glyph banks to the tangent (orient-along-path).
            </p>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import { useRafFn } from "@vueuse/core";
import { Button, Card } from "@mkbabb/glass-ui";
import { MetricBadge } from "@mkbabb/glass-ui/metric-badge";
import { Shuffle } from "@lucide/vue";

import { MORPH_DEMO_KEY } from "./morphKeys";
import { VIEW } from "./morphShapes";

// The shared playback-button skin (the same partial MotionPath/Easing import) —
// the Next-shape button rides .btn-interactive for cross-scene posture parity.
import "@components/custom/animation-controls/controls/playback-button.css";

const demo = inject(MORPH_DEMO_KEY)!;

const morphPathEl = useTemplateRef<SVGPathElement>("morphPathEl");

// The oriented glyph's live position (stage px) + tangent (deg). Read from the
// LIVE engine-written custom props on the subject `<path>` each frame — the
// glyph rides a representative body sample (`ORIENT_SAMPLE`) of the morphed
// outline. The angle channel is in RADIANS (the rotate: auto value); convert to
// deg for the CSS rotate.
const glyphX = ref(VIEW / 2);
const glyphY = ref(VIEW / 2);
const glyphAngleDeg = ref(0);

// Map a user-space coordinate (0..VIEW) to a stage pixel. The SVG canvas fills
// the square stage 1:1 with its viewBox, so the stage px = (coord / VIEW) *
// stagePx; we read the stage size once per frame (cheap; the stage is square).
// The orient data (x, y, tangent) is read DIRECTLY off the morph animation's
// interpolated frame (demo.readOrient) — the per-point channels live there, the
// same seam MorphSVG.sampleD reads (the render contract writes --morph-d/d: to
// the target, not the per-point props).
const readGlyph = (): void => {
    const path = morphPathEl.value;
    const stage = path?.ownerSVGElement?.parentElement;
    if (!path || !stage) return;
    const o = demo.readOrient();
    if (!o) return;
    const px = stage.clientWidth || VIEW;
    glyphX.value = (o.x / VIEW) * px;
    glyphY.value = (o.y / VIEW) * px;
    glyphAngleDeg.value = (o.angle * 180) / Math.PI;
};

// A gated rAF poll bridges the markRaw engine writes to the glyph (the demo's
// standing pattern: animation objects are markRaw, UI reads via a light poll).
const { pause: pausePoll, resume: resumePoll } = useRafFn(readGlyph, {
    immediate: false,
});

onMounted(() => {
    if (morphPathEl.value) demo.buildMorph(morphPathEl.value);
    resumePoll();
});

onBeforeUnmount(() => pausePoll());

const onNextShape = (): void => {
    demo.nextShape(morphPathEl.value);
};
</script>

<style scoped>
/* The scene's ONE colour seam: the morph subject keeps its icon's promise
   (morph.svg draws the violet triangle⇄star), cascading from the stage root to
   the subject path, ghosts, and glyph — one token, the whole editor reads
   violet (the cross-scene colour-pop convention). */
.morph-target {
    --ball-tone: var(--rainbow-violet);
}

/* The stage: a designed violet field (the same blueprint-ground idiom as the
   motion-path stage — scene-tinted plate + a two-tier graph), sized FROM its
   own flex slot (square via aspect-ratio so the SVG viewBox maps 1:1). */
.morph-stage {
    --morph-stage-max: 26rem;
    block-size: min(100%, var(--morph-stage-max));
    inline-size: auto;
    max-inline-size: 100%;
    aspect-ratio: 1;
    --c: var(--ball-tone, var(--color-progress));
    background-color: color-mix(
        in srgb,
        var(--c) var(--stage-field-tint, 4%),
        var(--background)
    );
    background-image:
        linear-gradient(
            to right,
            transparent calc(50% - 0.5px),
            color-mix(in srgb, var(--c) 12%, transparent) calc(50% - 0.5px)
                calc(50% + 0.5px),
            transparent calc(50% + 0.5px)
        ),
        linear-gradient(
            to bottom,
            transparent calc(50% - 0.5px),
            color-mix(in srgb, var(--c) 12%, transparent) calc(50% - 0.5px)
                calc(50% + 0.5px),
            transparent calc(50% + 0.5px)
        ),
        repeating-linear-gradient(
            to right,
            color-mix(in srgb, var(--c) 6%, transparent) 0 1px,
            transparent 1px var(--graph-pitch, 1.25rem)
        ),
        repeating-linear-gradient(
            to bottom,
            color-mix(in srgb, var(--c) 6%, transparent) 0 1px,
            transparent 1px var(--graph-pitch, 1.25rem)
        );
    border-radius: var(--radius-card);
    box-shadow: inset 0 0 32px color-mix(in srgb, var(--c) 6%, transparent);
}

.morph-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
}

/* The endpoint ghosts — the two shapes the morph travels between, drawn faint
   so the morphing subject reads AGAINST its extremes. */
.morph-ghost {
    stroke: color-mix(
        in srgb,
        var(--ball-tone, var(--color-progress)) 22%,
        transparent
    );
    stroke-width: 1.5;
    stroke-dasharray: 4 5;
    stroke-linejoin: round;
}
.morph-ghost--to {
    stroke-dasharray: 2 6;
    opacity: 0.7;
}

/* THE SUBJECT: the engine writes its `d` each frame (the `d:` property renders
   directly on Chromium/Safari; var(--morph-d) is the cross-browser fallback —
   honored here so Firefox still paints the morphing shape). A vivid violet
   stroke + a soft fill so the body reads as it re-shapes. */
.morph-subject {
    /* The Firefox-lags fallback: render the engine-written --morph-d custom
       property. On Chromium/Safari the engine ALSO sets `d:` directly (which
       wins), so the shape paints on every engine. */
    d: var(--morph-d);
    fill: color-mix(
        in srgb,
        var(--ball-tone, var(--color-progress)) 16%,
        transparent
    );
    stroke: var(--ball-tone, var(--color-progress));
    stroke-width: 2.5;
    stroke-linejoin: round;
    stroke-linecap: round;
    filter: drop-shadow(
        0 0 10px
            color-mix(
                in srgb,
                var(--ball-tone, var(--color-progress)) 35%,
                transparent
            )
    );
    will-change: d;
}

/* The oriented glyph — a small marker riding a body point of the morphed
   outline, banking to that point's tangent (the orient-along-path dogfood).
   Identity transforms on the base (the MANDATORY individual-transform-property
   guidance) so the rotate never shifts the stacking context. */
.morph-glyph {
    position: absolute;
    width: 0;
    height: 0;
    display: grid;
    place-items: center;
    translate: -50% -50%;
    pointer-events: none;
    color: var(--rainbow-yellow, var(--color-progress));
}
.morph-glyph-bank {
    font-size: 0.9rem;
    line-height: 1;
    /* The bank: rotate to the live tangent (the engine's --morph-{i}-angle, in
       deg) — damped so it reads smoothly. The leading +90deg seats the ▲ glyph
       so its apex points ALONG the path direction. */
    rotate: calc(var(--morph-glyph-angle, 0deg) + 90deg);
    scale: 1;
    transition: rotate 90ms linear;
    filter: drop-shadow(
        0 0 5px color-mix(in srgb, var(--rainbow-yellow) 60%, transparent)
    );
}

/* MANDATORY PRM degrade — the glyph bank damping + the subject's glow hint are
   decorative; under reduced motion the rotation still applies (a static state
   read) but the transition + will-change hint are held. */
@media (prefers-reduced-motion: reduce) {
    .morph-glyph-bank {
        transition: none;
    }
    .morph-subject {
        will-change: auto;
    }
}
</style>
