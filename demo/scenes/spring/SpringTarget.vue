<template>
    <!-- I5 (H.W11.S1) — the STAGE-CARD register (REVERSES W10 G8 full-bleed).
         A standard, NON-cartoon glass `<Card>` (the protagonist plate;
         `tier="resting" surface="glass"`, rounded-card by construction → I4 for
         free). The control PANELS stay cartoon+quiet (W2/W9). Dock-band
         containment is the surviving [stage]-track `.stage-cell` PRIMITIVE (the
         G8 LAYOUT half survives; the surface half reverses). `shadow={false}`:
         the plate reads cleaner without a nested shadow (FORK I5-shadow). The
         `max-w-3xl` rides the content column as an optical reading measure. -->
    <Card
        :shadow="false"
        class="spring-target relative flex flex-col items-center justify-center gap-8 h-full w-full px-6 lg:px-8 overflow-hidden"
    >
        <!-- Header readout.
             J.W7a S2 (D7 / TYP-2, SP-2) — the scene name lifts to the
             Instrument-Serif `text-display` rung (the display voice carried
             inward; cross-typography §3).
             J.W7a S2 (D8 / C3) + S3 (D14) — the live solver state promotes from
             one 12px muted caption to the published MetricBadge register: the
             headline x at the size="xl" audacious-poster rung wearing the scene
             accent (color → --ball-tone), the velocity as the quieter lg
             sibling. The NUMBER wins; the labels stay small muted mono. -->
        <!-- The header rows WRAP (flex-wrap): at 375w an unwrappable row would
             starve the serif title against the two metric badges — the reflow
             keeps every member legible (the D8 responsive behaviour). -->
        <!-- K.W4 S5 (U-K18) — the readout RE-TIERED: the PRIMARY datum (x, the
             live displacement that proves the engine runs) is promoted to the
             display-tier `.spring-readout-primary` audacious number wearing the
             scene accent; the SECONDARIES (v, settled) are DEMOTED to a quiet
             caption row. The former flat row gave x + v the SAME small MetricBadge
             size (the equal-weight inversion the user named); the re-tier moves
             the display weight to the one number that matters. -->
        <div class="flex w-full max-w-3xl flex-wrap items-end justify-between gap-3 gap-y-2 shrink-0">
            <div class="flex flex-col gap-1 min-w-0">
                <span class="text-display text-foreground truncate leading-none">
                    SpringProgress
                </span>
                <div class="flex items-baseline gap-2">
                    <span class="text-mono-small text-muted-foreground tabular-nums">x</span>
                    <span class="spring-readout-primary tabular-nums">{{ demo.liveValue.value.toFixed(3) }}</span>
                </div>
            </div>
            <div class="flex flex-col items-end gap-1 shrink-0">
                <span
                    class="status-badge text-admin-label px-2 py-0.5 rounded-full"
                    :class="demo.liveSettled.value ? 'settled-badge' : 'tracking-badge'"
                >{{ demo.liveSettled.value ? "settled" : "tracking" }}</span>
                <span class="text-mono-caption text-muted-foreground tabular-nums">
                    v {{ demo.liveVelocity.value.toFixed(2) }}
                </span>
            </div>
        </div>

        <!-- The rail: tap/drag to re-seat the live target -->
        <div class="flex w-full max-w-3xl flex-col items-center justify-center gap-6">
            <!-- J.W7a S4 (D17 / C2) — the displacement rail carries the shared
                 `.stage-field-x` coordinate frame: vertical quarter ticks at
                 0.25/0.5/0.75 of the target axis (the curve canvas's --border
                 hairline language), so the re-seat gesture reads against a
                 graduated field, not blank glass. -->
            <div
                ref="railEl"
                class="spring-rail stage-field-x focus-ring relative w-full h-12 cursor-pointer select-none"
                :class="{ 'spring-rail--derby': demo.derbyActive.value }"
                role="slider"
                aria-label="Drag to re-seat the spring target"
                :aria-valuenow="Math.round(demo.target.value * 100)"
                aria-valuemin="0"
                aria-valuemax="100"
                tabindex="0"
                @pointerdown="onPointerDown"
                @keydown="onKeydown"
            >
                <div class="progress-rail"></div>
                <!-- L.W11 S6 — the y=1 TARGET LINE every trace is measured
                     against (the rail's right edge = the spring's target). It
                     gives ONE quiet red-dashed `settle-pulse` when the live
                     spring crosses `liveSettled` (the settled register) — the
                     instrument confirming "locked". -->
                <div
                    class="spring-target-line settle-pulse"
                    :class="{ 'settle-pulse--fire': demo.liveSettled.value }"
                    aria-hidden="true"
                ></div>
                <!-- Ghost target marker (where the spring is chasing) — a
                     DISCRETE position (re-seat events), so it stays reactive. -->
                <div
                    class="spring-target-marker"
                    :style="{ left: `calc(${demo.target.value * 100}% )` }"
                ></div>
                <!-- The live spring ball — positioned IMPERATIVELY by the
                     registered spring painter (J.W2 S5: direct style writes off
                     the Vue render graph; no reactive :style on the hot path). -->
                <div ref="liveBallEl" class="progress-ball spring-ball"></div>

                <!-- ── L.W11 S6 EGG — the four-lane DERBY overlay ──────────────
                     Double-click the rail and four SpringProgress solvers race
                     four RAINBOW LANES over a shared target line: bouncy (ζ=0.45)
                     rings PAST it, gentle (ζ=1.0) never crosses. Each lane wears
                     its sanctioned --spring-lane-* tone; the balls ride the live
                     `springLive.trackValues` (the engine's physics, painter-
                     positioned — inv ζ, no second rAF). Shown ONLY during the
                     race (`derbyActive`); the page rests as one calm red spring. -->
                <div
                    v-if="demo.derbyActive.value"
                    class="derby-lanes"
                    aria-hidden="true"
                >
                    <div
                        v-for="lane in demo.derbyLanes"
                        :key="lane.name"
                        :class="['derby-lane', `spring-lane-${lane.name}`]"
                        :style="{ '--ball-tone': lane.tone }"
                    >
                        <span class="derby-lane-rail"></span>
                        <span
                            :ref="(el) => setDerbyBallEl(lane.index, el)"
                            class="progress-ball derby-lane-ball"
                        ></span>
                        <span class="derby-lane-tag text-mono-caption tabular-nums">
                            {{ lane.name }} · ζ{{ lane.zeta.toFixed(2) }}
                        </span>
                    </div>
                </div>
            </div>
            <p class="text-small text-muted-foreground text-center">
                Tap or drag the rail &mdash; the ball springs to the new target. Adjust
                <span class="code-token">response</span> /
                <span class="code-token">dampingFraction</span> in the panel.
            </p>
        </div>

        <!-- springTimingFunction sweep -->
        <div class="w-full max-w-3xl shrink-0">
            <div class="flex items-center justify-between mb-2">
                <span class="text-small text-foreground">springTimingFunction sweep</span>
                <!-- J.W7a S3 (D14 / CP-4) — the live sampled value wears the
                     scene accent; the label stays muted. -->
                <span class="readout-accent text-mono-caption tabular-nums">{{ demo.sampled.value.toFixed(3) }}</span>
            </div>
            <div class="sampler-track stage-field-x relative h-9">
                <div class="progress-rail"></div>
                <!-- The sampler ball — painter-positioned (J.W2 S5, as above). -->
                <div ref="samplerBallEl" class="progress-ball sampler-ball"></div>
            </div>
        </div>

        <!-- ── L.W11 S6 — the linear() 26-stop PLOT (the curve drawn, beside its
             string). The parse + draw lives in the colocated SpringTrace sub-unit
             (the natural concern seam); it reads the live (response, ζ) so the
             trace re-plots as the sliders move. -->
        <SpringTrace
            :response="demo.response.value"
            :damping-fraction="demo.dampingFraction.value"
        />
    </Card>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";
import { inject, onMounted, onScopeDispose, useTemplateRef } from "vue";
import { Card } from "@mkbabb/glass-ui";
import { useDragScrub } from "@composables/useDragScrub";
import { useDoubleTap } from "@composables/useDoubleTap";
import { SPRING_DEMO_KEY } from "./springKeys";
import SpringTrace from "./SpringTrace.vue";

const demo = inject(SPRING_DEMO_KEY)!;

// S.G3 S2 — the derby is POINTER-based double-tap now (touch parity; never native
// `dblclick`, which mobile browsers do not synthesize reliably). A discovered
// double-tap gesture egg (the on-stage legend layer was retired at T.M — VERDICT #8).

const railEl = useTemplateRef<HTMLElement>("railEl");
const liveBallEl = useTemplateRef<HTMLElement>("liveBallEl");
const samplerBallEl = useTemplateRef<HTMLElement>("samplerBallEl");

// The sweep can overshoot past 1 (underdamped) — clamp the *marker* position
// so the ball stays inside the track even though the read-out shows >1.
const clampSweep = (v: number) => Math.max(0, Math.min(1, v));

// ── L.W11 S6 — the four DERBY LANE balls (painter-positioned) ────────────────
// Each lane ball reads the live `springLive.trackValues[index]` directly (the
// engine's physics, off the Vue render graph). The lanes' clampSweep is RELAXED
// on the value axis so the curve crosses the target line (bouncy rings PAST it);
// the ball still rides its bounded horizontal rail.
const derbyBallEls: (HTMLElement | null)[] = [];
const setDerbyBallEl = (i: number, el: Element | ComponentPublicInstance | null) => {
    derbyBallEls[i] = (el as HTMLElement) ?? null;
};

// ── J.W2 S5 (DS-3) — the spring painters: DIRECT non-reactive `style` writes ──
// Registered with the demo's loop seam; called imperatively each frame with the
// live snapshot. The hot positional path leaves the Vue render graph (the
// former 17-refs/frame reactive storm is gone — the balls move, nothing
// re-renders); the readout numerals above stay reactive at the few-Hz cadence.
let unregisterPainter: (() => void) | null = null;
onMounted(() => {
    unregisterPainter = demo.registerSpringPainter(() => {
        const live = demo.springLive;
        // T.G4 — position by `transform: translateX(<cqw>)`, NEVER `left`. Animating
        // `left` re-LAYS-OUT every frame (the born-RED spring layout thrash); a
        // `translateX` composites on the GPU with zero layout. `cqw` = 1% of the
        // nearest container's inline size (the rail/track/lane carry
        // `container-type: inline-size`), so the value axis stays rail-relative with
        // NO per-frame width read (the AnimationVisualizer/easing transform idiom).
        if (liveBallEl.value) {
            liveBallEl.value.style.transform = `translateX(${live.value * 100}cqw)`;
        }
        if (samplerBallEl.value) {
            samplerBallEl.value.style.transform = `translateX(${clampSweep(live.sampled) * 100}cqw)`;
        }
        // L.W11 S6 — position the four derby-lane balls from the live tracker
        // values (clampSweep RELAXED here so the bouncy lane visibly rings PAST
        // the target line — the overshoot is the point). Painter-positioned, the
        // SAME hot path; no second writer, no second rAF (inv ζ).
        const trackValues = live.trackValues;
        for (let i = 0; i < derbyBallEls.length; i++) {
            const el = derbyBallEls[i];
            if (el) {
                // Allow a small overshoot beyond 100% so the ring is seen; cap so
                // the ball can't leave the lane entirely.
                const v = Math.max(0, Math.min(1.18, trackValues[i] ?? 0));
                el.style.transform = `translateX(${v * 100}cqw)`;
            }
        }
    });
});
onScopeDispose(() => unregisterPainter?.());

// The shared drag-scrub seam (H.W12.S1 / I8). Spring's `project` is the bare
// rect-ratio (`demo.reseat` owns the clamp); no pause/resume hooks — the spring
// chases the live target continuously.
const { onPointerDown } = useDragScrub({
    el: railEl,
    project: (e) => {
        const el = railEl.value;
        if (!el) return demo.target.value;
        const rect = el.getBoundingClientRect();
        return (e.clientX - rect.left) / rect.width;
    },
    onScrub: (ratio) => demo.reseat(ratio),
});

// S.G3 S2 — the reliable-primitive double-tap on the rail launches the derby (the
// touch parity for the former `@dblclick`; drag-disjoint — a scrub never triggers
// it). The SAME path serves mouse, pen, and touch.
useDoubleTap({
    el: railEl,
    onDoubleTap: () => {
        demo.derby();
    },
});

const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        demo.reseat(demo.target.value + 0.1);
        e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        demo.reseat(demo.target.value - 0.1);
        e.preventDefault();
    } else if (e.key === "Home") {
        demo.reseat(0);
        e.preventDefault();
    } else if (e.key === "End") {
        demo.reseat(1);
        e.preventDefault();
    }
};
</script>

<style scoped>
/* J.W7a S3 (D11 / CP-1) — the scene's ONE colour consumer. The spring icon's
   rest dot IS the progress green (spring.svg → --rainbow-green family), so the
   tone seam binds EXPLICITLY to the canonical --color-progress: the already-
   consistent identity is now a declared fact the clause-a oracle reads, not an
   accident of the idiom default (cross-color-pops §5.1). */
.spring-target {
    --ball-tone: var(--color-progress);
}

/* ── K.W4 S5 (U-K18) — the PRIMARY readout, display-tier ──
   The live displacement x is the one number that proves the engine runs; it
   gets the audacious-poster register (the missing display-type IN the pane),
   wearing the scene accent (the cascaded --ball-tone), while v + the settled
   badge demote to a quiet caption column. The former flat row gave x and v the
   SAME small MetricBadge size (the equal-weight inversion U-K18 named). */
.spring-readout-primary {
    font-size: clamp(2.25rem, 6cqi, 3.25rem);
    /* T.D2 (RULED #24) — the `650` magic weight dies: weights step the ladder
       (100-multiples only); the readout numeral reads the semibold token. */
    font-weight: var(--font-weight-semibold, 600);
    line-height: 1;
    letter-spacing: -0.01em;
    color: var(--ball-tone, var(--color-progress));
    font-variant-numeric: tabular-nums;
}

.spring-rail,
.sampler-track {
    display: flex;
    align-items: center;
    /* T.G4 — the balls ride `translateX(<cqw>)`; `cqw` resolves against the nearest
       inline-size container, so the rail/track ARE that container (the value axis
       stays rail-relative with no per-frame width read). */
    container-type: inline-size;
}

/* The rail + ball geometry now come from the shared .progress-rail /
   .progress-ball idiom (design-idioms.css). The consolidation adopts
   EasingTarget's canonical lineage (rail-tint 8%, ball-glow 35%) — so the former
   12% rail + 40% glow become the canonical defaults (a named befitting motion-
   cohesion delta, the same class as the W11 --spring-snappy reconcile). These
   scoped modifiers carry only the per-site variation: the left-positioned
   horizontal centering (the idiom centers vertically via margin-top; these balls
   ride `left:`), the live-ball SIZE, and the sampler ball's translucent fill +
   suppressed glow.
   The spring-target-marker is the dashed GHOST target (where the spring is
   chasing) — a distinct primitive, NOT a rail/ball, so it stays scoped. */
.spring-target-marker {
    position: absolute;
    top: 50%;
    width: 2.5rem;
    height: 2.5rem;
    margin-left: -1.25rem;
    margin-top: -1.25rem;
    border-radius: var(--radius-pill);
    /* J.W7a S3 (D11) — the ghost marker reads the tone seam (a no-op for
       spring, whose tone IS the canonical green; the rule stays seam-coherent). */
    border: 2px dashed color-mix(in srgb, var(--ball-tone, var(--color-progress)) 50%, transparent);
    pointer-events: none;
    transition: border-color var(--duration-fast) ease;
}

/* J.W7a S1 (D4 / SP-1) — the live ball IS the scene's protagonist and takes
   the idiom-default --ball-size (36px) + full canonical glow: at the former
   1.75rem it "read as a footnote" against the vast glass plate. The h-12 rail
   row seats the 36px ball with breathing room; the quiet sampler below keeps
   its small translucent rung so the hierarchy (protagonist > sampler) is
   legible at a glance. */
.spring-ball {
    /* T.G4 — anchored at the rail's left edge; the painter's `translateX(<cqw>)`
       carries the position (compositor-only, no layout). */
    left: 0;
    margin-left: calc(var(--ball-size, 36px) / -2);
    will-change: transform;
}

.sampler-ball {
    --ball-size: 1.25rem;
    --ball-glow: 0%; /* the sweep sampler is a quiet translucent marker, no glow */
    left: 0;
    margin-left: calc(var(--ball-size) / -2);
    background: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 65%, transparent);
    will-change: transform;
}

/* ── L.W11 S6 — the y=1 TARGET LINE + the settle-pulse ──
   The rail's right edge is the spring's target (value 1). A faint vertical line
   marks it; on `liveSettled` it gives ONE quiet red-dashed pulse (the settled
   register — the instrument confirming "locked"). Compositor-cheap; PRM drops
   the pulse animation (the line stays). */
.spring-target-line {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 0;
    border-right: 2px dashed color-mix(in srgb, var(--color-progress) 35%, transparent);
    pointer-events: none;
}
/* The settle-pulse resting state (no flash); `--fire` plays the one pulse. */
.settle-pulse {
    transition: border-right-color var(--duration-fast, 160ms) ease;
}
.settle-pulse--fire {
    animation: spring-settle-pulse 220ms var(--ease-standard, ease) 1;
}

/* `.spring-rail--derby` — the rail's racing state (the four-lane overlay is
   shown; the live rail recedes slightly so the lanes read as the foreground). */
.spring-rail--derby .progress-rail,
.spring-rail--derby .spring-ball,
.spring-rail--derby .spring-target-marker {
    opacity: 0.35;
    transition: opacity var(--duration-fast, 160ms) ease;
}
@keyframes spring-settle-pulse {
    0% {
        border-right-color: var(--color-progress);
        filter: drop-shadow(0 0 4px color-mix(in srgb, var(--color-progress) 60%, transparent));
    }
    100% {
        border-right-color: color-mix(in srgb, var(--color-progress) 35%, transparent);
        filter: none;
    }
}

/* ── L.W11 S6 — the four-lane DERBY overlay ──
   Four stacked rainbow lanes that appear ONLY during the race (derbyActive). Each
   lane wears its sanctioned --spring-lane-* tone (consumed via --ball-tone — the
   .progress-ball idiom keys on it), with a small ζ tag. The bouncy lane's ball
   rings PAST the target line (the painter's relaxed clamp); the gentle lane never
   crosses. Absolutely overlaid on the rail region; fades in/out. */
.derby-lanes {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: grid;
    gap: 0.35rem;
    padding: 0.25rem 0;
    pointer-events: none;
    z-index: var(--z-content);
    animation: derby-fade-in 220ms var(--ease-standard, ease) 1;
}
.derby-lane {
    position: relative;
    height: 0.9rem;
    display: flex;
    align-items: center;
    /* T.G4 — the lane ball rides `translateX(<cqw>)`; the lane is its inline-size
       container. */
    container-type: inline-size;
}
.derby-lane-rail {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 2px;
    transform: translateY(-50%);
    border-radius: var(--radius-pill);
    background: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 22%, transparent);
}
.derby-lane-ball {
    --ball-size: 0.8rem;
    --ball-glow: 30%;
    position: absolute;
    top: 50%;
    left: 0; /* T.G4 — painter's translateX(<cqw>) carries the position */
    margin-top: calc(var(--ball-size) / -2);
    margin-left: calc(var(--ball-size) / -2);
    will-change: transform;
    /* the phosphor afterglow in the lane hue */
    filter: drop-shadow(0 0 5px color-mix(in srgb, var(--ball-tone, var(--color-progress)) 50%, transparent));
}
.derby-lane-tag {
    position: absolute;
    right: 0;
    top: -0.65rem;
    color: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 90%, var(--foreground));
    opacity: 0.85;
    text-transform: none;
}

@keyframes derby-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
    .settle-pulse--fire {
        animation: none;
    }
    .derby-lanes {
        animation: none;
    }
}
</style>
