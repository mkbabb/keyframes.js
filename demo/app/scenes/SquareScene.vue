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
        <!-- J.W7a S2 (D7 / SQ-12, TYP §4) — "drag me" is the scene's typography
             moment: the small body-mono whisper lifts to the Instrument-Serif
             `text-display` rung — the type IS the affordance, the one audacious
             word on the bold subject (the same display register the other
             scene titles carry inward). -->
        <div
            ref="box"
            class="demo-box text-display"
            :class="{ 'demo-box--dragging': dragging }"
            role="slider"
            aria-label="Drag the box — two springs chase per axis"
            :aria-valuetext="`x ${springReadout.x}, y ${springReadout.y}`"
            tabindex="0"
            @pointerdown="onPointerDown"
            @keydown="onKeydown"
            @dblclick="tumble"
        >
            drag me
        </div>
    </Card>
</template>

<script setup lang="ts">
import { computed, markRaw, onBeforeUnmount, onMounted, reactive, ref, useTemplateRef, watch } from "vue";
import { Card } from "@mkbabb/glass-ui";
import { AnimationGroup } from "@src/animation/group";
import { useDragScrub } from "@composables/useDragScrub";
import { useSquareAnimations } from "../../square/useSquareAnimations";

const superKey = "Square";

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
const { anim, springX, springY, reseat, settle, travel, paintRest, tumble, dispose } =
    useSquareAnimations(box, () => {
        // The barrel-roll has come to rest — return the Play button to its idle
        // posture (the honest one-shot verb).
        isPlaying.value = false;
    });
anim.name = "Transform";
anim.superKey = superKey;

// Fire the honest tumble on the Play CTA's rising edge (the App writes `isPlaying`
// for this scene — the non-`scenePlayback` writable-ref contract). A falling edge
// (settle / pause) needs no action: the tumble is a self-completing one-shot.
watch(isPlaying, (playing, was) => {
    if (playing && !was) tumble();
});

const animationGroup = markRaw(new AnimationGroup(anim as any));
// Force per-animation transform path — the grouped path passes flat ValueUnit
// values which don't match the nested object structure our transform expects.
animationGroup.singleTarget = false;

// A live spring read-out for the slider's aria-valuetext (no per-frame Vue work
// on the hot path — read on demand from the markRaw springs).
const springReadout = reactive({ x: "0.00", y: "0.00" });

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
    },
    // Persist on release — leave the springs at their dragged target and let them
    // chase-to-rest THERE (the box stays where released). `settle()` re-arms the
    // paint loop so the final chase paints even if it had momentarily settled.
    onEnd: () => {
        settle();
        springReadout.x = springX.target.toFixed(2);
        springReadout.y = springY.target.toFixed(2);
    },
});

// Keyboard nudge (slider posture parity with Spring/MotionPath).
const onKeydown = (e: KeyboardEvent) => {
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
        return;
    } else return;
    e.preventDefault();
    const nx = Math.max(-1, Math.min(1, springX.target + dx));
    const ny = Math.max(-1, Math.min(1, springY.target + dy));
    reseat(nx, ny);
    springReadout.x = nx.toFixed(2);
    springReadout.y = ny.toFixed(2);
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
}

.demo-box {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
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
       the published rung owns the type; scoped rules no longer shadow it.) */
    background-color: var(--subject-teal);
    color: color-mix(in oklab, var(--subject-teal) 25%, black);
    box-shadow: 0 0 0 0.5rem color-mix(in srgb, var(--background) 50%, transparent);
    /* Direct-manipulation affordance (S5). The transformFunc owns `transform`,
       so the cursor + touch-action carry the drag posture. */
    cursor: grab;
    touch-action: none;
    will-change: transform;
}

.demo-box--dragging {
    cursor: grabbing;
}
</style>
