<template>
    <!-- J.W7a S1 (D1 / SQ-3 + SQ-1) — the square joins the I5 STAGE-CARD
         register: the drag arena gains the standard glass protagonist plate
         (`<Card surface="glass" tier="resting" :shadow="false">`, the SAME
         plate easing/spring/sequence/motion-path stand on) instead of floating
         bare on the page grid — the subject finally has a stage. The plate's
         `rounded-card` resolves SQ-4 for free. `grid place-items-center` on the
         stage cell resolves the off-center drift (SQ-1): the box is the
         geometric center of the plate by construction. -->
    <Card
        :shadow="false"
        class="square-stage grid h-full w-full place-items-center select-none"
    >
        <!-- L.W11 S4 — the draughtsman's instrument layer (the coordinate field,
             the rubber-band tether, the telemetry strip, the legend) lives in the
             colocated SquareInstrument sub-unit (markup + styles together). It is
             fed DERIVED READS of the spring state — no second writer, no rAF. -->
        <SquareInstrument
            :defl-x="deflX"
            :defl-y="deflY"
            :settled="settled"
            :tether-active="tetherActive"
            :readout-x="springReadout.x"
            :readout-y="springReadout.y"
            :tumble-hint-shown="tumbleHintShown"
        />

        <!-- J.W7a S2 (D7 / SQ-12, TYP §4) — "drag me" is the scene's typography
             moment: the small body-mono whisper lifts to the Instrument-Serif
             `text-display` rung — the type IS the affordance, the one audacious
             word on the bold subject (the same display register the other
             scene titles carry inward).

             P.W6 S1(a) — the per-axis 2D-slider-group ARIA contract. A single
             `role="slider"` with a scalar `aria-valuenow` is a lossy
             misrepresentation of a 2D drag (a 1D control reporting a blended
             scalar). Instead the box is the `role="group"` container (the 2D
             instrument) holding TWO visually-hidden `role="slider"` children, one
             per axis, each carrying a COMPLETE WCAG 4.1.2 contract
             (`aria-valuemin="-1"`, `aria-valuemax="1"`, live `:aria-valuenow`
             tracking `springX.target`/`springY.target`). The box stays the
             keyboard target (arrow nudges move both axis sliders); the
             `.focus-ring` idiom (P.W6 S1(b)) gives keyboard focus a visible ring. -->
        <div
            ref="box"
            class="demo-box palette-sweep-host text-display focus-ring"
            :class="{ 'demo-box--dragging': dragging }"
            role="group"
            aria-label="Drag the box across two axes — a spring chases each axis"
            tabindex="0"
            @pointerdown="onPointerDown"
            @keydown="onKeydown"
            @dblclick="tumble"
        >
            <span
                class="sr-only-slider"
                role="slider"
                aria-label="Horizontal position"
                aria-orientation="horizontal"
                aria-valuemin="-1"
                aria-valuemax="1"
                :aria-valuenow="axisNow.x"
                :aria-valuetext="`x ${springReadout.x}`"
            />
            <span
                class="sr-only-slider"
                role="slider"
                aria-label="Vertical position"
                aria-orientation="vertical"
                aria-valuemin="-1"
                aria-valuemax="1"
                :aria-valuenow="axisNow.y"
                :aria-valuetext="`y ${springReadout.y}`"
            />
            drag me
        </div>
    </Card>
</template>

<script setup lang="ts">
import { computed, markRaw, onBeforeUnmount, onMounted, reactive, ref, useTemplateRef, watch } from "vue";
import { Card } from "@mkbabb/glass-ui";
import { kfEngine } from "@utils/kfEngine";
import { useDragScrub } from "@composables/useDragScrub";
import { useSquareAnimations } from "./useSquareAnimations";
import SquareInstrument from "./SquareInstrument.vue";
import { SQUARE_SUPER_KEY } from "./squareKeys";

const superKey = SQUARE_SUPER_KEY;

// S5b (K.W0 / U-K5 "none of the animations work properly /square") — THE PLAY VERB
// MADE HONEST. The box is drag-autonomous (the spring loop owns its paint); the
// contract `AnimationGroup` below is a keyframes-readout transport host whose
// grouped interpolation passes FLAT ValueUnits that don't match the nested-object
// structure the box transformFunc reads (`singleTarget = false`), so `group.play()`
// painted NOTHING — a dead Play. The cure (the named decision, option (b)): Play
// TUMBLES the box. `isPlaying` is a WRITABLE ref the App toggles (the cube/amiga
// contract); a rising edge fires the existing spring-driven `tumble()` — a real,
// visible 360° barrel-roll with a colour sweep, painted by the ONE spring-loop
// authority — and the play state self-clears when the tumble settles (`onSettle`).
// No new shadow playback authority, no timer: the loop's own settle is the signal.
const isPlaying = ref(false);

const box = useTemplateRef<HTMLElement>("box");

// L.W11 S4 — the instrument-layer reactive state (the rubber-band tether + the
// settled/tracking telemetry badge). These are DERIVED READS of the live spring
// snapshot the composable feeds via `onTick` — never a second writer, never a
// second rAF (the spring loop is the sole driver; this just mirrors its state
// into the few reactive bindings the SVG/badge consume).
const settled = ref(true);
const tetherActive = ref(false);
// The live normalized deflection (-1..1 per axis), mirrored at the loop cadence.
const deflX = ref(0);
const deflY = ref(0);
// Progressive disclosure: the tumble hint appears only after the first drag-settle.
const tumbleHintShown = ref(false);
let hasDragged = false;

const { anim, springX, springY, reseat, settle, travel, paintRest, tumble, dispose } =
    useSquareAnimations(
        box,
        () => {
            // The barrel-roll has come to rest — return the Play button to its idle
            // posture (the honest one-shot verb).
            isPlaying.value = false;
        },
        // The per-frame derived-read hook: mirror the live spring snapshot into the
        // tether + badge bindings. The tether is visible while the springs are
        // un-settled OR a drag is in flight.
        ({ x, y, settled: isSettled }) => {
            deflX.value = x;
            deflY.value = y;
            settled.value = isSettled;
            tetherActive.value = dragging.value || !isSettled;
            // Reveal the egg hint after the first successful drag-settle.
            if (isSettled && hasDragged && !tumbleHintShown.value) {
                tumbleHintShown.value = true;
            }
        },
    );
anim.name = "Transform";
anim.superKey = superKey;

// (The tether SVG geometry lives in the colocated SquareInstrument sub-unit,
// fed `deflX`/`deflY` as props — the derived-read instrument layer.)

// Fire the honest tumble on the Play CTA's rising edge (the App writes `isPlaying`
// for this scene — the non-`scenePlayback` writable-ref contract). A falling edge
// (settle / pause) needs no action: the tumble is a self-completing one-shot.
watch(isPlaying, (playing, was) => {
    if (playing && !was) tumble();
});

// HEAVY (AnimationGroup); constructed through the warmed engine surface
// (kfEngine(), L.W8 S1 dogfood inversion) — synchronous, since the warm resolves
// before any scene mounts.
const { AnimationGroup } = kfEngine();
const animationGroup = markRaw(new AnimationGroup(anim));
// Force per-animation transform path — the grouped path passes flat ValueUnit
// values which don't match the nested object structure our transform expects.
animationGroup.singleTarget = false;

// A live spring read-out for the slider's aria-valuetext (no per-frame Vue work
// on the hot path — read on demand from the markRaw springs).
const springReadout = reactive({ x: "0.00", y: "0.00" });

// P.W6 S1(a) — the per-axis NUMERIC `aria-valuenow` (each axis slider's WCAG
// 4.1.2 value). Written beside `springReadout` at the same few-Hz cadence the
// drag/keyboard events fire (NOT the 60 Hz paint loop), so assistive tech reads
// the live per-axis target without any hot-path Vue work. Rounded to 2 dp so a
// screen reader announces a stable value, not float noise.
const axisNow = reactive({ x: 0, y: 0 });
const syncAxisNow = () => {
    axisNow.x = Math.round(springX.target * 100) / 100;
    axisNow.y = Math.round(springY.target * 100) / 100;
};

onMounted(() => {
    anim.setTargets(box.value!);
    // Paint the rest pose so the box sits home before any drag (the spring loop
    // is idle at rest; the drag arms it).
    paintRest();
});

onBeforeUnmount(() => {
    animationGroup.stop();
    dispose();
});

// ── Drag the box → re-seat the per-axis spring targets (S5) ─────────────
// I.W4 D1 — the hand-rolled `window`-drag is GONE; the box now routes through the
// shared `useDragScrub` seam (the single authority over "a gesture is in flight"),
// which owns the global select-suppression token so the pointer can sweep the
// chrome without highlighting it. I.W4 D2 — `releasePolicy: "persist"` means
// release leaves the box where dragged (the spring chases-to-rest at the dragged
// target); the explicit `Home`/`End` recenter below is the deliberate return-home.
//
// The pointer offset (px) from the box's home center, divided by the spring's px
// travel, becomes each axis target ∈ [-1, 1] (clamped in reseat) — so the box
// follows the pointer ~1:1 up to the clamp; the spring chases.

let homeX = 0;
let homeY = 0;

// Capture the box's home center once per gesture (the seam's `onStart` hook) so
// the offset is stable across the drag (re-grabbing mid-flight subtracts the live
// deflection to recover it).
const captureFrame = () => {
    // L.W11 S4 — a drag has begun: arm the progressive tumble-hint disclosure
    // (the hint appears once the first drag settles) and mark the tether active.
    hasDragged = true;
    tetherActive.value = true;
    const el = box.value;
    if (!el) return;
    const br = el.getBoundingClientRect();
    // The box's CURRENT center minus the live spring deflection = its home
    // center (so re-grabbing mid-flight doesn't snap the home point).
    homeX = br.left + br.width / 2 - springX.value * travel;
    homeY = br.top + br.height / 2 - springY.value * travel;
};

// The shared drag-scrub seam (I8). Square is 2-axis, so `T = {nx,ny}`; `project`
// is the former `reseatFromEvent` math, `onScrub` re-seats the springs, `onStart`
// carries the per-gesture home capture, and `onEnd` syncs the aria read-out to
// the settled target (NO recenter — persist).
const { dragging, onPointerDown } = useDragScrub<{ nx: number; ny: number }>({
    el: box,
    releasePolicy: "persist",
    onStart: captureFrame,
    project: (e) => ({
        nx: (e.clientX - homeX) / travel,
        ny: (e.clientY - homeY) / travel,
    }),
    onScrub: ({ nx, ny }) => {
        reseat(nx, ny);
        springReadout.x = springX.target.toFixed(2);
        springReadout.y = springY.target.toFixed(2);
        syncAxisNow();
    },
    // Persist on release — leave the springs at their dragged target and let them
    // chase-to-rest THERE (the box stays where released). `settle()` re-arms the
    // paint loop so the final chase paints even if it had momentarily settled.
    onEnd: () => {
        settle();
        springReadout.x = springX.target.toFixed(2);
        springReadout.y = springY.target.toFixed(2);
        syncAxisNow();
    },
});

// ── EASTER EGG — "the envelope tour" (P.W6, the REVEAL egg) ────────────────
// Press `c` (corners) on the focused box → the spring tours all four extremes of
// the [-1,1]² travel field and returns home, REVEALING the bounded coordinate
// space the instrument field draws (the `x·y ∈ [-1, 1]` legend made physical).
// Each leg re-seats the SAME springs the drag uses (no second authority, no new
// rAF) so you see the spring chase each corner with the real banking velocity —
// the egg teaches the reachable envelope AND the spring's feel at once. Distinct
// from the double-click tumble (which reveals the colour twin); the two never
// collide (one is keyboard, one is dblclick). The legs are paced by the spring's
// own settle, not a fixed timer: each corner waits for the chase to arrive.
const ENVELOPE_LEGS: ReadonlyArray<[number, number]> = [
    [1, -1], // top-right
    [1, 1], // bottom-right
    [-1, 1], // bottom-left
    [-1, -1], // top-left
    [0, 0], // home
];
let touring = false;
let tourTimer: ReturnType<typeof setTimeout> | null = null;
const tourEnvelope = () => {
    if (touring) return;
    touring = true;
    let i = 0;
    const step = () => {
        if (i >= ENVELOPE_LEGS.length) {
            touring = false;
            tourTimer = null;
            return;
        }
        const [nx, ny] = ENVELOPE_LEGS[i]!;
        i += 1;
        reseat(nx, ny);
        springReadout.x = nx.toFixed(2);
        springReadout.y = ny.toFixed(2);
        syncAxisNow();
        // Pace each leg by the spring's own travel time (the snappy 0.32 response
        // settles well under 520ms) — a hold long enough to SEE the corner before
        // the next leg, but no hand-rolled rAF (the spring loop paints).
        tourTimer = setTimeout(step, 520);
    };
    step();
};
onBeforeUnmount(() => {
    if (tourTimer) clearTimeout(tourTimer);
});

// Keyboard nudge (slider posture parity with Spring/MotionPath).
const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        tourEnvelope();
        return;
    }
    const step = 0.25;
    let dx = 0;
    let dy = 0;
    if (e.key === "ArrowRight") dx = step;
    else if (e.key === "ArrowLeft") dx = -step;
    else if (e.key === "ArrowDown") dy = step;
    else if (e.key === "ArrowUp") dy = -step;
    else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        reseat(0, 0);
        springReadout.x = "0.00";
        springReadout.y = "0.00";
        syncAxisNow();
        return;
    } else return;
    e.preventDefault();
    const nx = Math.max(-1, Math.min(1, springX.target + dx));
    const ny = Math.max(-1, Math.min(1, springY.target + dy));
    reseat(nx, ny);
    springReadout.x = nx.toFixed(2);
    springReadout.y = ny.toFixed(2);
    syncAxisNow();
};

defineExpose({
    animationGroup: computed(() => animationGroup),
    superKey,
    // S5b — the writable play state the App toggles for a group-adapter scene
    // (the cube/amiga contract: `onPlayStateChange` writes `isPlaying` when the
    // scene does NOT own its own `scenePlayback`). Here the rising edge tumbles
    // the box (the honest Play verb), and `onSettle` clears it back to idle.
    isPlaying,
});
</script>

<!-- The .demo-box layout (uncaged from utils.css, D.W2.S2). It lands on THIS
     component's own <div> and has exactly one consumer now (the standalone
     `simple` scene was removed), so its smallest shared scope is this SFC's
     own scoped block — the most encapsulated home. The `.demo-container` grid
     it once paired with is dead (zero consumers) and was deleted outright. -->
<style scoped>
.square-stage {
    /* The stage is the drag arena; the box translates within it. The plate
       (the I5 glass Card, D1) clips the spring overshoot at its rounded edge. */
    overflow: hidden;
    position: relative;
}

/* The instrument layer (field · tether · telemetry · legend) is styled inside
   the colocated SquareInstrument sub-unit (markup + styles together). This scene
   keeps only the subject (the box) + the stage's palette-sweep bloom. */

/* P.W6 S1(a) — the per-axis sliders are SEMANTIC-only (the visible affordance is
   the box itself + its instrument layer). Visually hidden but present for AT,
   the canonical sr-only clip pattern (no layout footprint, focusable-exempt —
   they carry no tabindex; the box is the single keyboard target). */
.sr-only-slider {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.demo-box {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: var(--z-content);
    --size: 12rem;
    width: var(--size);
    height: var(--size);
    border-radius: var(--radius-lg);
    /* J.W7a S3 (D13 / SQ-5, the no-legacy delta) — the raw `aquamarine`
       named-colour literal DIES: the fill is the owned --subject-teal token
       (design-idioms.css — the EGG_HUES terminal stop, so the tumble egg
       settles INTO the box's own rest hue). The ink is a deep teal DERIVED
       from the same token (never a second literal), so "drag me" holds AA on
       its fill in BOTH themes — the former inherited foreground inverted to
       near-white-on-mint in dark mode.
       (The font-weight/size leaves with the D7 `text-display` swap above —
       the published rung owns the type; scoped rules no longer shadow it.)
       L.W11 S4 — a two-tone material (a subtle top-down oklab gradient + an
       inset edge-light) reads the teal as a physical chip under the graph light,
       not a flat fill. The base --subject-teal token is the KEPT identity; the
       gradient only adds depth (the keeper hue is untouched). */
    background-color: var(--subject-teal);
    background-image: linear-gradient(
        to bottom,
        color-mix(in oklab, var(--subject-teal) 92%, white 8%),
        var(--subject-teal)
    );
    color: color-mix(in oklab, var(--subject-teal) 25%, black);
    box-shadow:
        inset 0 1px 0 color-mix(in srgb, white 22%, transparent),
        0 0 0 0.5rem color-mix(in srgb, var(--background) 50%, transparent);
    /* Direct-manipulation affordance (S5). The transformFunc owns `transform`,
       so the cursor + touch-action carry the drag posture. */
    cursor: grab;
    touch-action: none;
    will-change: transform;
    transition: box-shadow var(--duration-fast, 160ms) var(--ease-standard, ease);
}

/* L.W11 S4 — hover-arm: the rig "powers on" under the pointer (the deflection-
   reactive aura blooms a faint red motion-authority ring at the edge). */
.demo-box:hover {
    box-shadow:
        inset 0 1px 0 color-mix(in srgb, white 28%, transparent),
        0 0 0 0.5rem color-mix(in srgb, var(--color-progress) 12%, transparent);
}

/* P.W6 S1(d) — the dragging shadow now also intensifies with the live velocity
   BANK: the box paints `--spring-tilt` (the skew magnitude) onto itself from the
   spring loop, and the motion-authority edge ring brightens with it — a fast
   pull READS as kinetic energy at the edge (the spring's velocity surfaced as
   light, not just geometry). `--spring-tilt` defaults to 0 (a flat box glows the
   base 22%). */
.demo-box--dragging {
    cursor: grabbing;
    --tilt-glow: calc(var(--spring-tilt, 0) * 1.4%);
    box-shadow:
        inset 0 1px 0 color-mix(in srgb, white 28%, transparent),
        0 0 0 0.5rem
            color-mix(
                in srgb,
                var(--color-progress) calc(22% + var(--tilt-glow)),
                transparent
            );
}

/* P.W6 S1(d) — the grab-pulse "capture confirmed" ring. A one-shot expanding
   ring fires from the box edge the instant a drag begins (the `--dragging` class
   flips the `::before` into existence, and `@starting-style` transitions it from
   a tight, opaque ring to a wide, faded one — a single tactile thunk, zero JS,
   one transition). The ring is the red motion-authority hue (the same the
   deflection aura uses). Pointer-events:none so it never steals the gesture.
   On browsers without @starting-style the ::before simply renders at its end
   state (invisible) — it degrades to no-pulse, never a broken layout. */
.demo-box--dragging::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: var(--z-behind);
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-progress) 55%, transparent);
    opacity: 0;
    transition:
        box-shadow var(--duration-slow, 420ms) var(--ease-out, ease-out),
        opacity var(--duration-slow, 420ms) var(--ease-out, ease-out);
}
@starting-style {
    .demo-box--dragging::before {
        box-shadow: 0 0 0 0.15rem color-mix(in srgb, var(--color-progress) 80%, transparent);
        opacity: 0.9;
    }
}

/* ── L.W11 S4 — the palette-sweep BLOOM (the tumble egg's landing thunk) ──
   While `data-palette-sweep` is set (the egg's colour sweep is live, painted by
   the kept SpringProgress spin) the box blooms a soft rainbow-sourced halo so
   the barrel-roll lands as an EVENT — the off-the-normal-path effect the
   design-refinement probe reads. PRM collapses it to no bloom (the box still
   tumbles + sweeps colour; only the decorative halo is dropped). */
.demo-box[data-palette-sweep] {
    box-shadow:
        inset 0 1px 0 color-mix(in srgb, white 30%, transparent),
        0 0 1.5rem 0.25rem color-mix(in srgb, var(--rainbow-violet) 35%, transparent);
}

@media (prefers-reduced-motion: reduce) {
    .square-tether {
        /* Snap: no fade, the line is either present or not (geometry unchanged). */
        transition: none;
    }
    .demo-box,
    .demo-box:hover,
    .demo-box--dragging {
        transition: none;
    }
    /* PRM — drop the grab-pulse entry transition (the ring is decorative; the
       box still banks + captures, only the expanding pulse is suppressed). */
    .demo-box--dragging::before {
        transition: none;
        opacity: 0;
    }
    .demo-box[data-palette-sweep] {
        /* Drop the decorative bloom under reduced motion (the tumble + colour
           sweep still play — only the halo is suppressed). */
        box-shadow:
            inset 0 1px 0 color-mix(in srgb, white 22%, transparent),
            0 0 0 0.5rem color-mix(in srgb, var(--background) 50%, transparent);
    }
}
</style>
