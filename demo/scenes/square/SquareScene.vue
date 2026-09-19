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
            :tumble-hint-shown="tumbleHintShown"
            :tour-hint-shown="tourHintShown"
            :travel="travel"
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
             keyboard target (arrow nudges move both axis sliders).

             §B.1 row 5 — the ring idiom is `kf-focus-ring`, not the bare
             `focus-ring`. glass-ui 7.0.0 ships a REALIZED `.focus-ring:focus-visible`
             inside `@layer components` that also binds `border-radius:
             var(--radius-pill)`; the demo's unlayered same-named rule won the
             box-shadow and silently inherited the producer's pill radius onto
             rectangular hosts. KF.W6 renamed the demo's rule (`a6418729`) and
             carried its own forced-colors restoration with it; this was one of
             the two hosts still wearing the bare class.

             D-4/D-7 — THE ACCESSIBLE NAME IS NO LONGER POINTER-ONLY. The label
             instructed a drag while every keyboard affordance (Arrow×4, Shift+Arrow,
             PageUp/Down, Home, End, `c`) was undeclared, and all three on-screen
             instruction surfaces are `aria-hidden` — so there was no channel at
             all. `aria-keyshortcuts` publishes the bindings and
             `aria-describedby` points at an sr-only twin of the visual hints. -->
        <div
            ref="box"
            class="demo-box palette-sweep-host text-display kf-focus-ring"
            :class="{ 'demo-box--dragging': dragging }"
            :data-square-mode="mode"
            role="group"
            aria-label="Drag the box across two axes — a spring chases each axis"
            aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Shift+ArrowUp Shift+ArrowDown Shift+ArrowLeft Shift+ArrowRight PageUp PageDown Home End C"
            :aria-describedby="keyboardHelpId"
            tabindex="0"
            @pointerdown="onPointerDown"
            @keydown="onKeydown"
        >
            <span :id="keyboardHelpId" class="sr-only-slider">
                Arrow keys nudge the box a quarter of its travel; hold Shift for a
                fine nudge; Page Up and Page Down move a half-step vertically;
                Home re-centres it; End sends it to the far corner; press C to
                trace the travel envelope; double-tap to tumble.
            </span>
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
import {
    markRaw,
    onBeforeUnmount,
    onMounted,
    onScopeDispose,
    reactive,
    ref,
    useId,
    useTemplateRef,
    watch,
} from "vue";
import { Card } from "@mkbabb/glass-ui";
import { registerShortcut } from "@mkbabb/glass-ui/keyboard";
import { kfEngine } from "@kf-engine";
import { useDragScrub } from "@composables/useDragScrub";
import { useDoubleTap } from "@composables/useDoubleTap";
import { useSquareDemo } from "./useSquareDemo";
import { useSquareKeyboard } from "./useSquareKeyboard";
import SquareInstrument from "./SquareInstrument.vue";
import { SQUARE_ANIM_NAME, SQUARE_SCENE_ID } from "./squareKeys";
import { facilityFromGroup } from "@composables/scene-facility";
import { useSceneMachine } from "@state";
import { useSceneTransport } from "@composables/scene-runtime/useSceneTransport";

const superKey = SQUARE_SCENE_ID;

// T.A13 (SQ-T1) — THE PLAY VERB MADE HONEST (the G2 inversion cured, not collapsed).
// S.G2 amputated the panel because Play painted nothing: the box transformFunc was
// written for the spring loop's RAW NUMBERS, but the engine handed nested vars whose
// leaves stringified to `"0pxpx"` → CSSOM silently discarded the write. The three-part
// cure lands in the composable: (1) the `num()` normalizer at the shared
// transformFunc boundary resolves BOTH writers (the spring loop's numbers AND the
// T.A6 authored strings); (2) REAL four-corner keyframes (a ±90px diamond
// tour, full 360° rotation, nested `d` swell, rainbow sweep) so Play VISIBLY obeys
// duration/easing/direction; (3) the {idle, drag, playback} single-authority FSM here.
// Play now drives the group's honest tour (the panel triad edits a LIVE animation,
// T.B3); the former `isPlaying → tumble()` kill is RETIRED — the tumble stays a
// discovered double-tap gesture egg, NOT the Play verb.
//
// L-8/C-2 — ONE PLAYING-STATE AUTHORITY (settled with kf-CubeScene L-2/C-5).
// `isPlaying` was a PRIVATE `ref(false)` this scene never exposed and never
// wrote: absent from `SceneExposedApi`, so the App could not toggle it, so
// `watch(isPlaying, …)` never fired and `mode = "playback"` — the third state of
// a documented three-state FSM — was unreachable. It is now the house
// projection: a READ-ONLY computed over `machine.status`, the same single
// authority `useAnimationGroupPlayback` derives from and the same one
// `facility.isPlaying()` reports. Nothing here writes a playing flag; the
// transport verbs DISPATCH intent and the group adapter re-arms or stops the
// loop (proof:no-shadow-playback-authority).
const machine = useSceneMachine();
const { isPlaying, pause } = useSceneTransport(machine);

// T.A13 — the single-authority FSM state. `idle` = at rest (springs settled, group
// stopped/paused); `playback` = the group plays the four-corner tour; `drag` = a
// pointer owns the box (the group is paused, the springs chase the pointer). The
// pose-capture takeover (`seatFromPose`) makes the playback→drag edge jump-free.
type SquareMode = "idle" | "drag" | "playback";
const mode = ref<SquareMode>("idle");

const box = useTemplateRef<HTMLElement>("box");

/** D-4/D-7 — the id the box's `aria-describedby` points at (the sr-only twin of
 *  the three `aria-hidden` instruction surfaces). */
const keyboardHelpId = useId();

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
// C-6 + D-5 — TWO EGGS, TWO DISCLOSURES. One `tumbleHintShown` flag gated two
// unrelated affordances (the POINTER tumble and the KEYBOARD envelope tour), so
// its name was false for one of them and neither could disclose on its own
// modality's first settle. Each hint now has its own flag, armed by the modality
// that can actually perform it.
const tumbleHintShown = ref(false);
const tourHintShown = ref(false);
/** A real interaction has happened on some modality (pointer past the move
 *  threshold, or any keyboard target) — the disclosure's arming condition. */
let hasInteracted = false;
/** Which modality armed it, so each hint discloses to the audience that can use
 *  it: the double-tap tumble to a pointer, the `c` envelope tour to a keyboard. */
let interactedByKeyboard = false;

const {
    anim,
    springX,
    springY,
    reseat,
    settle,
    seatFromPose,
    tourTimeForPose,
    travel,
    paintRest,
    tumble,
    dispose,
} = useSquareDemo(
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
            // Reveal each egg's hint after the first settle of an interaction
            // that reached the threshold — to the modality that can use it.
            if (isSettled && hasInteracted) {
                if (interactedByKeyboard) tourHintShown.value = true;
                else tumbleHintShown.value = true;
            }
        },
    );
// N-SQ-8 — ONE identity, one spelling. The strip's title and the engine
// animation's name were two literals across a file boundary; the colocated
// `squareKeys.ts` exists for exactly this.
anim.name = SQUARE_ANIM_NAME;
anim.superKey = superKey;

// (The tether SVG geometry lives in the colocated SquareInstrument sub-unit,
// fed `deflX`/`deflY` as props — the derived-read instrument layer.)

// HEAVY (AnimationGroup); constructed through the warmed engine surface
// (kfEngine(), L.W8 S1 dogfood inversion) — synchronous, since the warm resolves
// before any scene mounts.
const { AnimationGroup } = kfEngine();
const animationGroup = markRaw(new AnimationGroup(anim));
// T.A13 — the per-animation transform path: each child applies its OWN nested
// custom `transformFunc` (fed the T.A6 nested authored shape, now
// unit-honest via `num()`), rather than the grouped SoA composite. The square is
// a single-animation scene, so per-animation IS the natural path; the group is a
// real playback authority now (Play drives the four-corner tour), not a decoy.
animationGroup.singleTarget = false;

const facility = facilityFromGroup(() => animationGroup);

// L-1/C-3 + C-4 — THE TAKEOVER EDGE, ONE FUNCTION, EVERY MODALITY.
// `captureFrame` used to poke the group's own `pause()` DIRECTLY — the last such
// call in any scene, and a verbatim breach of the repo's own
// `proof:no-shadow-playback-authority` law ("createGroupAdapter is the ONLY code
// path that touches them"). The machine never learned of it, so `machine.status`
// stayed `playing`, the transport lied for one interaction, and the first press
// afterwards took `suspend()`'s else-arm — a visual no-op. And the pause lived on
// ONE input modality: the keyboard layer reached the paint loop with the engine
// still touring, so Play + any arrow put TWO rAF writers on one
// `el.style.transform` (C-4's two-writer breach of the T.A13 guarantee).
//
// Now the edge is a single function that DISPATCHES PAUSE through the machine —
// the adapter performs the group pause, `isPlaying` falls out of `machine.status`
// by construction — and seats the springs from the painted pose. Both the
// pointer (`useDragScrub.onStart`) and the keyboard (`useSquareKeyboard`) enter
// through it, so the guarantee is the FSM edge's, not one handler's.
const takeOverFromPlayback = () => {
    if (!isPlaying.value && !(animationGroup.started && !animationGroup.paused)) {
        return;
    }
    pause();
    seatFromPose();
};

// A live spring read-out for the slider's aria-valuetext (no per-frame Vue work
// on the hot path — read on demand from the markRaw springs).
const springReadout = reactive({ x: "0.00", y: "0.00" });

// P.W6 S1(a) — the per-axis NUMERIC `aria-valuenow` (each axis slider's WCAG
// 4.1.2 value). Written beside `springReadout` at the same few-Hz cadence the
// drag/keyboard events fire (NOT the 60 Hz paint loop), so assistive tech reads
// the live per-axis target without any hot-path Vue work. Rounded to 2 dp so a
// screen reader announces a stable value, not float noise.
const axisNow = reactive({ x: 0, y: 0 });

// L-15 — ONE readout sync, ONE rounding rule. The pair was written from three
// call sites with TWO rules (`toFixed(2)` on the text, `Math.round(v*100)/100`
// on the number), which disagree at tie-adjacent doubles — so `aria-valuenow`
// and `aria-valuetext` could announce different numbers for one position. Both
// now derive from the SAME rounded value, in one place.
const syncReadouts = () => {
    axisNow.x = Math.round(springX.target * 100) / 100;
    axisNow.y = Math.round(springY.target * 100) / 100;
    springReadout.x = axisNow.x.toFixed(2);
    springReadout.y = axisNow.y.toFixed(2);
};

// T.A13 — the FSM tracks the machine's play state. Play (rising edge) enters
// `playback`: the group plays the honest four-corner tour — NO tumble. Pause
// (falling edge) settles the FSM to `idle` unless a drag is mid-gesture (the
// drag owns the box until release). The tumble is a discovered double-tap egg
// only (see `useDoubleTap` below), never the Play verb.
//
// ARB-1 — THE REVERSE EDGE GETS ITS POSE ADOPTION TOO. `seatFromPose` made the
// playback→drag edge jump-free and nothing did the same for drag→playback: the
// tour resumed at its own paused clock (or started at 0% home) while the
// persist-policy drag had left the box up to 2×TRAVEL away, so the first engine
// frame snapped ~220 px and a rotation appeared from nowhere — the exact
// discontinuity the scene's own prose forbids. The rising edge now seats the
// GROUP's clock at the tour time whose authored pose is nearest the box's
// current pose, the mirror of `seatFromPose` and the engine's own adopt idea at
// demo scale.
watch(isPlaying, (playing) => {
    if (playing) {
        facility.channels[0]?.setProgress(tourTimeForPose());
        mode.value = "playback";
    } else if (mode.value === "playback") mode.value = "idle";
});

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

// MISS-1 — A GRAB IS NOT A TELEPORT (the GradientStopEditor C11/G5 class; the
// shape read, never copied, off the landed `grabDx` precedent at
// `TimelineTrack.vue`, keyframes.js `7225cdd1`).
//
// `useDragScrub.onPointerDown` calls `onScrub(project(e))` unconditionally, and
// `project` mapped the ABSOLUTE pointer position into target space off the box's
// REST centre — so a press anywhere but the exact centre re-targeted the springs
// to bring the centre TO the press point: up to 96 px for an edge press and
// 136 px on the diagonal (12 rem box, 110 px travel), and `releasePolicy:
// "persist"` made a bare click's displacement permanent. The ":218 follows the
// pointer ~1:1" comment was true of the delta only for a dead-centre grab.
//
// The offset from the box centre to the press point is captured once per gesture
// and subtracted from every sample, so the box keeps the grip it was taken by.
// The press-to-position idiom the seam defaults to is right for a RAIL and wrong
// for a subject.
let grabDx = 0;
let grabDy = 0;

// D-5 + L-17 — the disclosure arms on a real interaction from ANY modality.
// `hasDragged` had exactly one write, inside the pointerdown hook: a bare TAP
// (no movement at all) tripped it, against the comment's "once the first drag
// settles", while the keyboard paths never tripped it at all — so a
// keyboard-only user could never mount the hints that name their only verbs.
// The pointer arm now needs the house movement threshold (`useDoubleTap`'s
// 12 px, one file over and previously unused here); the keyboard arm is the
// keyboard's own `onTarget`.
const MOVE_TOLERANCE = 12;
let grabClientX = 0;
let grabClientY = 0;

// Capture the box's home center once per gesture (the seam's `onStart` hook) so
// the offset is stable across the drag (re-grabbing mid-flight subtracts the live
// deflection to recover it).
const captureFrame = (e: PointerEvent) => {
    // L.W11 S4 — a gesture has begun: mark the tether active. The tumble-hint
    // disclosure is NOT armed here any more (D-5/L-17: a bare tap is not a drag).
    tetherActive.value = true;
    // T.A13 — the {playback → drag} FSM edge, through the one takeover function
    // above (the machine pauses; the springs seat from the painted pose), so the
    // spring chase begins exactly where the tour left the box — a seamless,
    // jump-free takeover (the library's own adopt idea at demo scale).
    takeOverFromPlayback();
    mode.value = "drag";
    grabClientX = e.clientX;
    grabClientY = e.clientY;
    const el = box.value;
    if (!el) return;
    const br = el.getBoundingClientRect();
    const centerX = br.left + br.width / 2;
    const centerY = br.top + br.height / 2;
    // MISS-1 — where on the box the press landed, relative to its centre.
    grabDx = e.clientX - centerX;
    grabDy = e.clientY - centerY;
    // The box's CURRENT center minus the live spring deflection = its home
    // center (so re-grabbing mid-flight doesn't snap the home point).
    homeX = centerX - springX.value * travel;
    homeY = centerY - springY.value * travel;
};

// The shared drag-scrub seam (I8). Square is 2-axis, so `T = {nx,ny}`; `project`
// is the former `reseatFromEvent` math, `onScrub` re-seats the springs, `onStart`
// carries the per-gesture home capture, and `onEnd` syncs the aria read-out to
// the settled target (NO recenter — persist).
const { dragging, onPointerDown } = useDragScrub<{ nx: number; ny: number }>({
    el: box,
    releasePolicy: "persist",
    onStart: captureFrame,
    project: (e) => {
        if (
            !hasInteracted &&
            Math.hypot(e.clientX - grabClientX, e.clientY - grabClientY) >
                MOVE_TOLERANCE
        ) {
            hasInteracted = true;
        }
        // MISS-1 — the grab offset is subtracted, so the point under the finger
        // stays under the finger instead of the box's centre jumping to it.
        return {
            nx: (e.clientX - grabDx - homeX) / travel,
            ny: (e.clientY - grabDy - homeY) / travel,
        };
    },
    onScrub: ({ nx, ny }) => {
        reseat(nx, ny);
        syncReadouts();
    },
    // Persist on release — leave the springs at their dragged target and let them
    // chase-to-rest THERE (the box stays where released). `settle()` re-arms the
    // paint loop so the final chase paints even if it had momentarily settled.
    onEnd: () => {
        settle();
        // T.A13 — the {drag → idle} FSM edge: the pointer released, the spring
        // chases to rest at the dragged target (persist). The group stays paused,
        // and Play genuinely does resume the tour FROM HERE now: the rising edge
        // seats the group's clock at the authored pose nearest this one (ARB-1).
        mode.value = "idle";
        syncReadouts();
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
const { onKeydown, tourEnvelope } = useSquareKeyboard({
    springX,
    springY,
    reseat,
    // C-4 — the keyboard enters the SAME takeover edge the pointer does. The
    // T.A13 two-writer guarantee ("the two writers are never simultaneous") was
    // implemented in `captureFrame` alone, so Play + any arrow put the engine
    // tour and the spring loop on one `el.style.transform` at once.
    onTakeOver: () => {
        takeOverFromPlayback();
        mode.value = "drag";
    },
    onTarget: () => {
        // D-5 — a keyboard target IS a real interaction; the disclosure used to
        // be reachable only through a pointerdown.
        hasInteracted = true;
        interactedByKeyboard = true;
        syncReadouts();
    },
});

// D-4 — THE ENVELOPE-TOUR EGG JOINS THE ONE KEYBOARD REGISTRY. `c` was a raw
// branch inside the box's own `@keydown` with an unconditional `preventDefault`
// and no modifier guard, so it HIJACKED ⌘C/Ctrl+C on a focused box (D-6/L-6) and
// was invisible to the shortcuts modal — the one surface a keyboard user looks
// at. A registry combo matches only with NO modifiers held, so the copy
// collision is structurally impossible now, and the binding is discoverable.
// The registration is scoped to a focused box, so it is not a second authority
// over the app's keyboard: the element-level `c` branch is gone.
//
// The arrow/Home/End/Page nudges stay ELEMENT-scoped and are NOT registered:
// they are a focused widget's own slider keys (APG), and the transport already
// owns ArrowLeft/ArrowRight/Home/End globally for scrubbing — registering them
// here would be exactly the two-authority collision this registry exists to
// prevent. They reach assistive tech through `aria-keyshortcuts` instead.
const disposeTourShortcut = registerShortcut(
    "C",
    () => {
        const el = box.value;
        if (!el || !el.contains(document.activeElement)) return;
        tourEnvelope();
    },
    { label: "Trace the travel envelope", group: "Square", preventDefault: true },
);
onScopeDispose(disposeTourShortcut);

defineExpose({
    // T.B1 STAGE 1 — the additive SceneFacility: square's REAL nested-keyframes
    // channel paints (the honest four-corner tour); the legacy `animationGroup`
    // stays for the panel group. The facility's playback is the group adapter,
    // and `facility.isPlaying()` is the one readonly projection every scene
    // family publishes — there is no second playing flag to expose here (L-8/C-2:
    // the member that used to sit in this object was PROSE, never a value).
    facility,
    superKey,
});
</script>

<!-- The .demo-box layout (uncaged from utils.css, D.W2.S2). It lands on THIS
     component's own <div> and has exactly one consumer now (the standalone
     `simple` scene was removed), so its smallest shared scope is this SFC's
     own scoped block — the most encapsulated home. The `.demo-container` grid
     it once paired with is dead (zero consumers) and was deleted outright. -->
<style scoped src="./SquareScene.css"></style>
