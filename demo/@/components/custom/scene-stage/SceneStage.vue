<script setup lang="ts">
/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SceneStage — the Teleport-to-body theatrical overlay (Tranche S, design §4/§7).
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Owns the phase machine (useSceneStage), the ring orbit (useCarouselOrbit,
 * verbatim salvage), the drop-light (useStageLight), the gesture grammar
 * (useStageGestures), and the lighting layer stack (dim/beam/pool). Owns NO raw
 * rAF — every load-bearing motion rides a kf LIGHT-barrel SpringProgress on
 * RAFPlayback (inv ζ). The zoom-out/zoom-in choreography drives ONE openP spring
 * whose settle advances the machine.
 *
 * The commit routes ONLY through the caller-provided runSceneSwitch (design §10);
 * the stage carries NO view-transition-name (chrome outside the VT subject).
 */
import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from "vue";
import {
    usePreferredReducedMotion,
    useMediaQuery,
    useStorage,
} from "@vueuse/core";
import { SpringProgress } from "@mkbabb/keyframes.js";
import CarouselDisk from "./CarouselDisk.vue";
import { useCarouselOrbit } from "./composables/useCarouselOrbit";
import { useStageLight } from "./composables/useStageLight";
import { useSceneStage } from "./composables/useSceneStage";
import { useStageGestures } from "./composables/useStageGestures";
import { sceneStageEntries, sceneStageIds } from "./sceneStageRegistry";

const props = defineProps<{
    /** THE one commit edge — the caller's View-Transition wrapper. */
    runSceneSwitch: (
        id: string,
        opts?: { stage?: boolean; onUpdate?: () => void },
    ) => void;
    /** Pre-warm the target scene chunk before the VT (D2.2). Optional stub. */
    warmScene?: (id: string) => Promise<void>;
}>();

const emit = defineEmits<{
    /** phase + zoom progress the shell binds (scene-host zoom-out / dock inert). */
    (e: "phase", phase: string): void;
    (e: "zoom", p: number): void;
}>();

const prm = usePreferredReducedMotion();
const reducedMotion = computed(() => prm.value === "reduce");
const mobile = useMediaQuery("(max-width: 640px)");

const N = sceneStageIds.length;

// ── responsive radius (design §6.4) ──────────────────────────────────────────
function computeRadius(): number {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
    return mobile.value
        ? clamp(150, 0.52 * vw, 220)
        : clamp(240, 0.38 * Math.min(vw, 1200), 440);
}
const radiusPx = ref(computeRadius());

// ── the ring orbit (VERBATIM salvage) ────────────────────────────────────────
const orbit = useCarouselOrbit({ count: N, radius: radiusPx.value });

// ── the drop-light (salvage) ─────────────────────────────────────────────────
const light = useStageLight({ count: N, centerIndex: 0 });

// ── the phase machine + commit funnel (salvage + rewrite) ────────────────────
const stage = useSceneStage({
    sceneIds: sceneStageIds,
    runSceneSwitch: props.runSceneSwitch,
    frontIndex: orbit.frontIndex,
    targetIndex: orbit.targetIndex,
    spinning: orbit.spinning,
    setTargetIndex: orbit.setTargetIndex,
    reducedMotion: () => reducedMotion.value,
    warmScene: props.warmScene ?? (async () => {}),
});

defineExpose({ open: stage.open, stage });

// ── the open/close choreography — ONE openP spring (design §6.7) ─────────────
const openP = ref(0);
const openSpring = new SpringProgress({
    initial: 0,
    response: 0.6,
    dampingFraction: 0.85,
    respectReducedMotion: true,
});
openSpring.play((v) => {
    openP.value = v;
    emit("zoom", v);
    // settle-driven machine advance
    if (openSpring.settled) {
        if (stage.phase.value === "zooming-out") stage.onZoomOutDone();
        else if (stage.phase.value === "zooming-in") stage.onZoomInDone();
    }
});

let fanTimer: ReturnType<typeof setTimeout> | null = null;
watch(
    () => stage.phase.value,
    (phase, prev) => {
        emit("phase", phase);
        if (phase === "zooming-out") {
            openSpring.target = 1;
            // PRM: the spring snaps its value WITHOUT emitting a settled frame,
            // so the play-callback advance never runs — drive the beat by hand.
            if (reducedMotion.value) {
                openP.value = 1;
                emit("zoom", 1);
                stage.onZoomOutDone();
            }
        } else if (phase === "fanning-in") {
            // the fan-in stagger + a settle margin → carousel
            const dwell = reducedMotion.value ? 0 : 55 * N + 160;
            if (fanTimer) clearTimeout(fanTimer);
            fanTimer = setTimeout(() => stage.onFanInDone(), dwell);
        } else if (phase === "committing") {
            // D5: the theater takes a breath — the beam FLARES.
            light.flare(true);
        } else if (phase === "zooming-in") {
            // H4: a cancel during fan-in must clear the dangling fanTimer.
            if (fanTimer) clearTimeout(fanTimer);
            fanTimer = null;
            openSpring.target = 0;
            if (reducedMotion.value) {
                openP.value = 0;
                emit("zoom", 0);
                stage.onZoomInDone();
            }
        }
        // D5 cancel: leaving committing (Esc) exhales the flare on the spring.
        if (prev === "committing" && phase !== "committing") {
            light.flare(false);
        }
        // keep the pool under the live front
        light.setCenter(orbit.frontIndex.value);
    },
);

// pool tracks the turntable front as it spins
watch(orbit.frontIndex, (i) => light.setCenter(i));

const revealed = computed(
    () =>
        stage.phase.value === "fanning-in" ||
        stage.phase.value === "carousel" ||
        stage.phase.value === "committing",
);

// ── the overlay root + focus + gestures ──────────────────────────────────────
const overlayEl = ref<HTMLElement | null>(null);
const disk = ref<InstanceType<typeof CarouselDisk> | null>(null);

// D7: the one-time discoverability hint — fades permanently after the first
// user-committed spin (any completed drag/wheel/arrow step).
const hintDismissed = useStorage("kf-stage-hint-dismissed", false);
function dismissHint(): void {
    hintDismissed.value = true;
}
function onOverlayKeydown(e: KeyboardEvent): void {
    // D7.3: an arrow/Home/End press is a spin → dismiss the hint.
    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
        dismissHint();
    }
    stage.onKeydown(e);
}

const gestures = useStageGestures({
    diskEl: computed(() => disk.value?.diskEl ?? null) as any,
    cardWidthPx: () => {
        const el = overlayEl.value?.querySelector(
            '[data-front="true"]',
        ) as HTMLElement | null;
        return el?.getBoundingClientRect().width ?? 260;
    },
    frontIndex: () => orbit.frontIndex.value,
    idOf: (i) => sceneStageIds[((i % N) + N) % N] ?? sceneStageIds[0] ?? "",
    step: (dir) => {
        stage.step(dir);
        dismissHint();
    },
    centerIndex: stage.centerIndex,
    requestCommit: stage.requestCommit,
    // D1.1: pointerdown halts a coast — re-seat to the nearest rounded front so
    // a subsequent ≤slop tap commits the HALTED front (deterministic).
    grab: () => {
        if (orbit.spinning.value) stage.centerIndex(orbit.frontIndex.value);
    },
    onSpin: dismissHint,
    setDragging: (d) => document.body.classList.toggle("is-dragging", d),
});

watch(
    () => stage.isOpen.value,
    async (open) => {
        if (open) {
            await nextTick();
            overlayEl.value?.focus();
            gestures.attach();
        } else {
            gestures.detach();
        }
    },
);

// arrow auto-repeat (hold)
let repeatTimer: ReturnType<typeof setInterval> | null = null;
let repeatDelay: ReturnType<typeof setTimeout> | null = null;
function armRepeat(dir: number): void {
    stage.step(dir);
    dismissHint();
    repeatDelay = setTimeout(() => {
        repeatTimer = setInterval(() => stage.step(dir), 280);
    }, 400);
}
function disarmRepeat(): void {
    if (repeatDelay) clearTimeout(repeatDelay);
    if (repeatTimer) clearInterval(repeatTimer);
    repeatDelay = repeatTimer = null;
}

// the marquee — the centered scene's label + counter. D5.4: during committing
// the marquee swaps to the ARMED scene immediately (even mid spin-to-front).
const marqueeId = computed(() =>
    stage.phase.value === "committing" && stage.armedId.value
        ? stage.armedId.value
        : stage.centeredSceneId.value,
);
const centeredEntry = computed(() =>
    sceneStageEntries.find((e) => e.id === marqueeId.value),
);
const counter = computed(
    () => `${(orbit.frontIndex.value % N) + 1} / ${N}`,
);
// D7: the hint shows only on carousel, before the first spin.
const showHint = computed(
    () => !hintDismissed.value && stage.phase.value === "carousel",
);

// overlay CSS vars — lighting driver values land here (design §7)
const overlayVars = computed(() => ({
    "--stage-light": String(light.light.value),
    "--stage-pool-x": String(light.poolX.value),
    "--openP": String(openP.value),
    "--stage-N": String(N),
    "--front-tone": centeredEntry.value?.tone ?? "var(--color-progress, #7cd6a0)",
}));

function onResize(): void {
    radiusPx.value = computeRadius();
}
onMounted(() => {
    window.addEventListener("resize", onResize);
    // Dev/proto-only introspection seam for the adversarial gate (D11): lets the
    // playwright driver start a deterministic multi-slot coast and read the live
    // orbit target vs front WITHOUT reaching into Vue internals. Never shipped.
    if (import.meta.env?.DEV) {
        (window as any).__stageDebug = {
            spinTo: (i: number) => stage.centerIndex(i),
            frontIndex: () => orbit.frontIndex.value,
            targetIndex: () => orbit.targetIndex.value,
            spinning: () => orbit.spinning.value,
            sceneAt: (i: number) => stage.sceneAt(i),
            armedId: () => stage.armedId.value,
        };
    }
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize);
    if (fanTimer) clearTimeout(fanTimer);
    disarmRepeat();
    openSpring.dispose();
    orbit.stop();
    light.stop();
    stage.dispose();
});

function clamp(lo: number, v: number, hi: number): number {
    return Math.max(lo, Math.min(hi, v));
}
</script>

<template>
    <Teleport to="body">
        <div
            v-if="stage.isOpen.value"
            ref="overlayEl"
            class="scene-stage"
            :class="{ 'is-mobile': mobile, 'is-committing': stage.phase.value === 'committing' }"
            role="dialog"
            aria-modal="true"
            aria-label="Scene stage"
            tabindex="-1"
            :data-stage-phase="stage.phase.value"
            :data-stage-armed="stage.armedId.value ?? ''"
            :style="overlayVars"
            @keydown="onOverlayKeydown"
        >
            <!-- L0.5 the theater base — the house dims to warm DUSK (never pure
                 black; unifies dark + light readings: dark lifts to warm
                 charcoal, light darkens from white to the same dusk). -->
            <div class="stage-base" aria-hidden="true"></div>
            <!-- L0.75 the grid ghost — graph paper survives the dusk, brighter
                 inside the pool (D4.6: the MATINEE image). -->
            <div class="stage-grid" aria-hidden="true"></div>
            <!-- L1 dim vignette (paper stays; never black) -->
            <div class="stage-dim" aria-hidden="true"></div>
            <!-- L2 drop beam -->
            <div class="stage-beam" aria-hidden="true"></div>
            <!-- L3 floor pool -->
            <div class="stage-pool" aria-hidden="true"></div>

            <!-- L5 the disk (cards) -->
            <CarouselDisk
                ref="disk"
                :orbit="orbit"
                :reduced-motion="reducedMotion"
                :mobile="mobile"
                :revealed="revealed"
                :radius-px="radiusPx"
                :committing="stage.phase.value === 'committing'"
                :armed-id="stage.armedId.value"
                :spinning="orbit.spinning.value"
            />

            <!-- L6 marquee + chrome -->
            <div class="stage-marquee" :class="{ below: mobile }">
                <div class="marquee-name" aria-live="polite">
                    {{ centeredEntry?.label ?? "" }}
                </div>
                <div class="marquee-count">{{ counter }}</div>
            </div>

            <!-- D7: the one-time diegetic hint, sitting at the pool line -->
            <Transition name="hint-fade">
                <div v-if="showHint" class="stage-hint" aria-hidden="true">
                    drag to spin · tap to enter
                </div>
            </Transition>

            <button
                class="stage-arrow stage-arrow--prev"
                aria-label="Previous scene"
                @pointerdown="armRepeat(-1)"
                @pointerup="disarmRepeat"
                @pointerleave="disarmRepeat"
            >
                ‹
            </button>
            <button
                class="stage-arrow stage-arrow--next"
                aria-label="Next scene"
                @pointerdown="armRepeat(1)"
                @pointerup="disarmRepeat"
                @pointerleave="disarmRepeat"
            >
                ›
            </button>

            <button class="stage-close" aria-label="Close scene stage" @click="stage.close">
                ×
            </button>
        </div>
    </Teleport>
</template>

<style scoped>
/* The two stage-scoped @property registrations (design §7). */
@property --stage-light {
    syntax: "<number>";
    inherits: true;
    initial-value: 1;
}
@property --stage-pool-x {
    syntax: "<number>";
    inherits: true;
    initial-value: 0;
}

.scene-stage {
    position: fixed;
    inset: 0;
    z-index: var(--z-overlay, 50);
    isolation: isolate;
    outline: none;
    overflow: hidden;
}

/* the warm-dusk theater base (design §1: "dims to dusk, never pure black") */
.stage-base {
    position: absolute;
    inset: 0;
    pointer-events: none;
    /* warm charcoal-violet dusk — the SAME target for both themes */
    background: hsl(265 24% 7%);
    opacity: calc(var(--openP, 0) * 0.9);
}

/* ── L0.75: the grid ghost (D4.6) — graph paper survives the dusk, warm graphite
   under tungsten, BRIGHTER inside the pool ellipse (the MATINEE image). Built
   from the SAME --graph-pitch/--graph-major tokens as .grid-background. ── */
.stage-grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: var(--openP, 0);
    /* light theme: 8% (D4.6-1); dark theme lowers to 6% below. */
    --grid-line: color-mix(in srgb, var(--stage-key-apex, #e6b56a) 8%, transparent);
    background-image:
        linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
        linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px),
        linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
        linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
    background-size:
        var(--graph-major, 5rem) var(--graph-major, 5rem),
        var(--graph-major, 5rem) var(--graph-major, 5rem),
        var(--graph-pitch, 1rem) var(--graph-pitch, 1rem),
        var(--graph-pitch, 1rem) var(--graph-pitch, 1rem);
    /* the pool-matched radial: the grid is brighter where the light falls. */
    -webkit-mask-image: radial-gradient(
        58% 46% at
            calc(50% + (var(--stage-pool-x) - (var(--stage-N) - 1) / 2) * 6%) 74%,
        black 0%,
        rgb(0 0 0 / 0.45) 46%,
        rgb(0 0 0 / 0.16) 100%
    );
    mask-image: radial-gradient(
        58% 46% at
            calc(50% + (var(--stage-pool-x) - (var(--stage-N) - 1) / 2) * 6%) 74%,
        black 0%,
        rgb(0 0 0 / 0.45) 46%,
        rgb(0 0 0 / 0.16) 100%
    );
}
/* light theme: the paper darkens to the same dusk but the grid survives brighter */
.dark .stage-grid {
    --grid-line: color-mix(in srgb, var(--stage-key-apex, #e6b56a) 6%, transparent);
}

/* ── L1: the dim vignette — a darker edge falloff over the dusk base. D9.3.1:
   the full-viewport backdrop-filter is DROPPED (the .stage-grid ghost is what the
   blur was faintly softening); a plain gradient scrim is the cheaper truth. ── */
.stage-dim {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: var(--openP, 0);
    background: radial-gradient(
        130% 105% at
            calc(50% + (var(--stage-pool-x) - (var(--stage-N) - 1) / 2) * 5%) 70%,
        transparent 0%,
        transparent 32%,
        hsl(265 30% 5% / 0.5)
            calc(74% + (1 - var(--stage-light)) * 10%),
        hsl(265 40% 3% / 0.85) 100%
    );
}

/* ── L2: the drop beam — a warm TUNGSTEN shaft (D4.2). Two-stop chroma ramp:
   amber filament at the apex, cream spill at the mid. Dark theme: screen at
   44%/22%. Light theme: half-mix under plus-lighter so the shaft ADDS warmth
   over the white shells instead of laying gray film. P1: the feather mask gains
   a longer bottom ramp + a stronger blur so the clip edges stop reading
   synthetic at the floor. ── */
.stage-beam {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: var(--openP, 0);
    clip-path: polygon(40% 0, 60% 0, 96% 100%, 4% 100%);
    /* LIGHT theme default — half mix, plus-lighter. */
    background: linear-gradient(
        to bottom,
        color-mix(in srgb, var(--stage-key-apex, #e6b56a) calc(var(--stage-light) * 22%), transparent) 0%,
        color-mix(in srgb, var(--stage-key, #f2e6c8) calc(var(--stage-light) * 11%), transparent) 50%,
        transparent 92%
    );
    -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 18%,
            black 82%,
            transparent 100%
        ),
        linear-gradient(to bottom, black 0%, black 70%, transparent 100%);
    -webkit-mask-composite: source-in;
    mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 18%,
            black 82%,
            transparent 100%
        ),
        linear-gradient(to bottom, black 0%, black 70%, transparent 100%);
    mask-composite: intersect;
    /* P1: a stronger blur so the clip edges stop reading synthetic at the floor. */
    filter: blur(8px);
    mix-blend-mode: plus-lighter;
}
/* DARK theme — the filament is amber, raised to 44%/22% (the khaki dishwater
   was single-stop cream desaturating under screen-over-black). */
.dark .stage-beam {
    background: linear-gradient(
        to bottom,
        color-mix(in srgb, var(--stage-key-apex, #f0c07a) calc(var(--stage-light) * 44%), transparent) 0%,
        color-mix(in srgb, var(--stage-key, #f5ecd2) calc(var(--stage-light) * 22%), transparent) 50%,
        transparent 92%
    );
    mix-blend-mode: screen;
}

/* ── L3: the floor pool (design §7 L3) ── */
.stage-pool {
    position: absolute;
    left: 50%;
    bottom: 14%;
    width: 60%;
    height: 26%;
    pointer-events: none;
    opacity: var(--openP, 0);
    transform: translateX(
        calc(-50% + (var(--stage-pool-x) - (var(--stage-N) - 1) / 2) * 6%)
    );
    /* D4.3: the pool re-keys to the WARM apex — the surface nearest the
       filament's target. Light theme half-mix + plus-lighter. */
    background: radial-gradient(
        62% 100% at 50% 50%,
        color-mix(in srgb, var(--stage-key-apex, #e6b56a) calc(var(--stage-light) * 22%), transparent) 0%,
        color-mix(in srgb, var(--stage-key-apex, #e6b56a) calc(var(--stage-light) * 9%), transparent) 42%,
        transparent 74%
    );
    filter: blur(10px);
    mix-blend-mode: plus-lighter;
}
.dark .stage-pool {
    background: radial-gradient(
        62% 100% at 50% 50%,
        color-mix(in srgb, var(--stage-key-apex, #f0c07a) calc(var(--stage-light) * 44%), transparent) 0%,
        color-mix(in srgb, var(--stage-key-apex, #f0c07a) calc(var(--stage-light) * 18%), transparent) 42%,
        transparent 74%
    );
    mix-blend-mode: screen;
}

/* ── L6: marquee ── */
.stage-marquee {
    position: absolute;
    top: 4%;
    left: 0;
    right: 0;
    text-align: center;
    pointer-events: none;
    z-index: 2;
}
.stage-marquee.below {
    top: auto;
    bottom: calc(env(safe-area-inset-bottom, 0px) + 64px);
}
/* the stage is ALWAYS a dark theater — text is theater-light regardless of the
   page theme (never bound to --foreground, which flips dark on a light page). */
.marquee-name {
    font-family: var(--font-display, "Instrument Serif", serif);
    font-size: clamp(1.8rem, 6vw, 3.4rem);
    line-height: 1;
    color: hsl(45 34% 93%);
    text-shadow: 0 2px 18px color-mix(in srgb, var(--stage-key, #f5f0e6) 40%, transparent);
}
.marquee-count {
    font-family: var(--font-mono, "Fira Code", monospace);
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    margin-top: 0.35rem;
    color: hsl(45 12% 72%);
}

/* ── the one-time diegetic hint (D7) — Fira Code mono at the pool line ── */
.stage-hint {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 22%;
    text-align: center;
    pointer-events: none;
    z-index: 2;
    font-family: var(--font-mono, "Fira Code", monospace);
    font-size: 0.82rem;
    letter-spacing: 0.14em;
    text-transform: lowercase;
    color: color-mix(in srgb, var(--stage-key-apex, #f0c07a) 72%, #fff);
    text-shadow: 0 1px 10px color-mix(in srgb, var(--stage-key-apex, #f0c07a) 40%, transparent);
}
.is-mobile .stage-hint {
    bottom: calc(env(safe-area-inset-bottom, 0px) + 128px);
}
.hint-fade-enter-active,
.hint-fade-leave-active {
    transition: opacity 420ms ease;
}
.hint-fade-enter-from,
.hint-fade-leave-to {
    opacity: 0;
}

/* ── arrows + close (≥44px targets) — P3: the × glass register, contrast ≥3:1 ── */
.stage-arrow,
.stage-close {
    position: absolute;
    display: grid;
    place-items: center;
    min-width: 48px;
    min-height: 48px;
    border-radius: 999px;
    border: 1px solid hsl(45 30% 90% / 0.42);
    background: hsl(265 24% 12% / 0.62);
    backdrop-filter: blur(8px);
    color: hsl(45 40% 94%);
    box-shadow: 0 2px 12px rgb(0 0 0 / 0.35);
    font-size: 2rem;
    line-height: 1;
    cursor: pointer;
    z-index: 3;
    transition: transform 0.12s ease, background 0.12s ease;
}
.stage-arrow:hover,
.stage-close:hover {
    transform: scale(1.08);
    background: color-mix(in srgb, var(--stage-key, #f5f0e6) 24%, var(--background, #111));
}
.stage-arrow--prev {
    left: 3%;
    top: 50%;
    margin-top: -24px;
}
.stage-arrow--next {
    right: 3%;
    top: 50%;
    margin-top: -24px;
}
.stage-close {
    top: calc(env(safe-area-inset-top, 0px) + 16px);
    right: calc(env(safe-area-inset-right, 0px) + 16px);
    font-size: 1.6rem;
}
.is-mobile .stage-arrow--prev {
    left: 2%;
}
.is-mobile .stage-arrow--next {
    right: 2%;
}
</style>
