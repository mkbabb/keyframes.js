<template>
    <!-- J.W7a S1 (D1 / SQ-3 + SQ-1) — the square joins the I5 STAGE-CARD
         register: the drag arena gains the standard glass protagonist plate
         (`<Card surface="glass" tier="resting" :shadow="false">`, the SAME
         plate easing/spring/sequence stand on) instead of floating
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
            :data-square-mode="mode"
            role="group"
            aria-label="Drag the box across two axes — a spring chases each axis"
            tabindex="0"
            @pointerdown="onPointerDown"
            @keydown="onKeydown"
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
import { useDoubleTap } from "@composables/useDoubleTap";
import { useSquareDemo } from "./useSquareDemo";
import { useSquareKeyboard } from "./useSquareKeyboard";
import SquareInstrument from "./SquareInstrument.vue";
import { SQUARE_SCENE_ID } from "./squareKeys";
import { facilityFromGroup } from "@composables/scene-facility";

const superKey = SQUARE_SCENE_ID;

// T.A13 (SQ-T1) — THE PLAY VERB MADE HONEST (the G2 inversion cured, not collapsed).
// S.G2 amputated the panel because Play painted nothing: the box transformFunc was
// written for the spring loop's RAW NUMBERS, but the engine handed nested vars whose
// leaves stringified to `"0pxpx"` → CSSOM silently discarded the write. The three-part
// cure lands in the composable: (1) the unit-honest `num()` normalizer at the shared
// transformFunc boundary resolves BOTH writers (the spring loop's numbers AND the
// T.A6 plain-vars authored strings); (2) REAL four-corner keyframes (a ±90px diamond
// tour, full 360° rotation, nested `d` swell, rainbow sweep) so Play VISIBLY obeys
// duration/easing/direction; (3) the {idle, drag, playback} single-authority FSM here.
// Play now drives the group's honest tour (the panel triad edits a LIVE animation,
// T.B3); the former `isPlaying → tumble()` kill is RETIRED — the tumble stays a
// discovered double-tap gesture egg, NOT the Play verb. `isPlaying` is the WRITABLE
// ref the App toggles (the cube/amiga group-scene contract).
const isPlaying = ref(false);

// T.A13 — the single-authority FSM state. `idle` = at rest (springs settled, group
// stopped/paused); `playback` = the group plays the four-corner tour; `drag` = a
// pointer owns the box (the group is paused, the springs chase the pointer). The
// pose-capture takeover (`seatFromPose`) makes the playback→drag edge jump-free.
type SquareMode = "idle" | "drag" | "playback";
const mode = ref<SquareMode>("idle");

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

const { anim, springX, springY, reseat, settle, seatFromPose, travel, paintRest, tumble, dispose } =
    useSquareDemo(
        box,
        () => {
            // The spring loop has come fully to rest (a drag/tumble settled). If
            // the group is not touring, the box is idle.
            if (!animationGroup.started || animationGroup.paused) mode.value = "idle";
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

// T.A13 — the FSM tracks the App-written play state. Play (rising edge) enters
// `playback`: the group (below) plays the honest four-corner tour — NO tumble.
// Pause (falling edge) settles the FSM to `idle` unless a drag is mid-gesture
// (the drag owns the box until release). The tumble is a discovered double-tap
// egg only (see `useDoubleTap` below), never the Play verb.
watch(isPlaying, (playing) => {
    if (playing) mode.value = "playback";
    else if (mode.value === "playback") mode.value = "idle";
});

// HEAVY (AnimationGroup); constructed through the warmed engine surface
// (kfEngine(), L.W8 S1 dogfood inversion) — synchronous, since the warm resolves
// before any scene mounts.
const { AnimationGroup } = kfEngine();
const animationGroup = markRaw(new AnimationGroup(anim));
// T.A13 — the per-animation transform path: each child applies its OWN nested
// custom `transformFunc` (fed the T.A6 plain-vars authored-shape projection, now
// unit-honest via `num()`), rather than the grouped SoA composite. The square is
// a single-animation scene, so per-animation IS the natural path; the group is a
// real playback authority now (Play drives the four-corner tour), not a decoy.
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
    // T.A13 — the {playback → drag} FSM edge. A pointerdown mid-tour PAUSES the
    // group and SEATS the springs from the box's CURRENT painted pose (via
    // DOMMatrix), so the spring chase begins exactly where the tour left the box
    // — a seamless, jump-free takeover (the library's own adopt idea at demo
    // scale). Sync the App-written play state so the transport reflects the pause.
    if (animationGroup.started && !animationGroup.paused) {
        animationGroup.pause();
        seatFromPose();
        isPlaying.value = false;
    }
    mode.value = "drag";
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
        // T.A13 — the {drag → idle} FSM edge: the pointer released, the spring
        // chases to rest at the dragged target (persist). The group stays paused
        // (Play resumes the tour from here).
        mode.value = "idle";
        springReadout.x = springX.target.toFixed(2);
        springReadout.y = springY.target.toFixed(2);
        syncAxisNow();
    },
});

// S.G3 S2 — the Tumble is a POINTER-based double-tap now (touch parity; the former
// `@dblclick` was mouse-only). Drag-disjoint: moving the box never triggers it.
useDoubleTap({
    el: box,
    onDoubleTap: () => {
        tumble();
    },
});

// ── Keyboard layer + the "envelope tour" REVEAL egg (P.W6) ─────────────────
// The arrow/Home nudge (slider posture parity with Spring/MotionPath) and the
// keyboard `c` envelope-tour egg live in the colocated useSquareKeyboard
// sub-unit. Both re-seat the SAME springs the drag uses (no second authority,
// no new rAF) and report each new target through `onTarget`, which mirrors it
// into the live spring readout + the per-axis aria-valuenow.
const { onKeydown } = useSquareKeyboard({
    springX,
    springY,
    reseat,
    onTarget: (nx, ny) => {
        springReadout.x = nx.toFixed(2);
        springReadout.y = ny.toFixed(2);
        syncAxisNow();
    },
});

const facility = facilityFromGroup(() => animationGroup);

defineExpose({
    // T.B1 STAGE 1 — the additive SceneFacility: square's REAL nested-keyframes
    // channel paints (the honest four-corner tour); the legacy `animationGroup`
    // stays for the panel group. The facility's playback is the group adapter.
    facility,
    superKey,
    // T.A13 — the writable play state the App toggles for a group-adapter scene
    // (the cube/amiga contract: `onPlayStateChange` writes `isPlaying` when the
    // scene does NOT own its own `scenePlayback`). Here Play drives the group's
    // honest four-corner tour (the FSM enters `playback`); a drag takes over.
});
</script>

<!-- The .demo-box layout (uncaged from utils.css, D.W2.S2). It lands on THIS
     component's own <div> and has exactly one consumer now (the standalone
     `simple` scene was removed), so its smallest shared scope is this SFC's
     own scoped block — the most encapsulated home. The `.demo-container` grid
     it once paired with is dead (zero consumers) and was deleted outright. -->
<style scoped src="./SquareScene.css"></style>
