<template>
    <!-- ── P.W6 S3 — THE SPRING PARAMETER-SPACE HEATMAP (the headline navigational
         egg) ──────────────────────────────────────────────────────────────────
         A 20×20 response×damping landscape. Each cell is tinted by the EXACT
         closed-form analytic peak-overshoot of the damped harmonic oscillator —
         `overshoot = exp(-ζπ / √(1-ζ²))` (ζ = dampingFraction) — NOT by
         instantiating 400 live SpringProgress trackers. The analytic path was
         BENCHED at 507× faster than 400 live instances (`spring-heatmap-probe`,
         2026-06-22: 0.002 ms vs 1.04 ms/mount), and the overshoot formula is
         EXACT (under 1% vs the live 60 Hz peak). Click a cell to NAVIGATE the live
         spring to that (response, dampingFraction); the marker tracks the live
         params. KISS: one canvas + one click handler + one marker — no rAF, no
         object lifecycle, no new library API (inv ζ). -->
    <div class="spring-heatmap-section grid gap-2">
        <div class="flex items-center justify-between gap-2">
            <span class="text-small font-medium text-muted-foreground">parameter space — overshoot
            </span>
            <span class="text-mono-caption text-muted-foreground tabular-nums">
                {{ demo.response.value.toFixed(2) }} /
                {{ demo.dampingFraction.value.toFixed(2) }}
            </span>
        </div>

        <!-- The clickable field. `role="application"` + a label describes the
             2D navigation surface to assistive tech (the canvas itself is opaque
             to SR — proof:lighthouse-a11y); the demo-OWNED keyboard focus ring is
             the demo-wide focus contract; arrow keys step the live params by one
             cell. The host re-points onto the renamed class under KF-KE-30's one
             ruling: glass 7.0.0 ships a realized rule of the former name that
             binds a PILL radius on its host, and this field is rectangular, so
             the producer's rule would have reshaped it on focus. The rename is
             the only mechanism that detaches the radius without fighting the
             producer per-site, and the renamed class carries its own
             forced-colors arm. -->
        <div
            ref="fieldEl"
            class="spring-heatmap kf-focus-ring relative w-full select-none cursor-crosshair rounded-md overflow-hidden"
            role="application"
            aria-label="Spring parameter-space heatmap — click or use the arrow keys to navigate response (horizontal) and damping (vertical); cells are tinted by peak overshoot"
            tabindex="0"
            @pointerdown="onPointerDown"
            @keydown="onKeydown"
        >
            <canvas ref="canvasEl" class="block h-full w-full" aria-hidden="true"></canvas>

            <!-- The live marker — tracks the current (response, dampingFraction).
                 A discrete position (it moves only on a param edit), so a reactive
                 :style is correct here (no 60 Hz hot path — inv ζ). -->
            <div
                class="spring-heatmap-marker"
                :style="markerStyle"
                aria-hidden="true"
            ></div>
        </div>

        <!-- The legend — names the three regimes the landscape reveals. -->
        <div class="flex items-center justify-between gap-2 text-caption text-muted-foreground">
            <span>← underdamped (rings)</span>
            <span>critical / overdamped →</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useTemplateRef, watch } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { resolveCanvasColor } from "@mkbabb/glass-ui/canvas";
import { useGlobalDark } from "@mkbabb/glass-ui/dark";
import { clamp } from "@mkbabb/value.js/math";

import type { SpringDemoContext } from "./springKeys";

const props = defineProps<{ demo: SpringDemoContext }>();
const demo = props.demo;

// ── The parameter ranges — IDENTICAL to the SpringSidebar sliders' min/max so a
// click on the field is the same coordinate space the sliders write (U5). ──────
const RESPONSE_MIN = 0.1;
const RESPONSE_MAX = 1.2;
const DAMPING_MIN = 0.2;
const DAMPING_MAX = 1.5;

// 20×20 grid (the validated resolution). x = response, y = dampingFraction.
const COLS = 20;
const ROWS = 20;

// The half-cell tolerance the click→param mapping carries (the canvas→param
// mapping is grid-discretized: a click snaps to the nearest cell center, so the
// honest navigation precision is ±half a cell on each axis).
const HALF_CELL_RESPONSE = (RESPONSE_MAX - RESPONSE_MIN) / COLS / 2;
const HALF_CELL_DAMPING = (DAMPING_MAX - DAMPING_MIN) / ROWS / 2;

/**
 * The EXACT closed-form peak overshoot of a damped harmonic oscillator.
 *
 *     overshoot(ζ) = exp(-ζπ / √(1 - ζ²))   for 0 < ζ < 1  (underdamped — rings)
 *     overshoot(ζ) = 0                       for ζ ≥ 1      (critical/overdamped)
 *
 * This is a DERIVED control-theory expression (the analytic first-peak amplitude
 * of the unit-step response), NOT a helper in spring.ts — there is no closed-form
 * `settleTime`/`overshoot` function on the library surface; we compute it inline.
 * It is independent of `response` (which sets ω₀ = 2π/response, scaling the time
 * axis but not the peak height), so the heatmap's overshoot tint varies ONLY with
 * the damping (y) axis — the response (x) axis is the free dimension the designer
 * navigates within a given overshoot band. Benched at 507× faster than stepping
 * 400 live SpringProgress instances to settle (`spring-heatmap-probe`, 2026-06-22).
 */
function overshoot(zeta: number): number {
    if (zeta >= 1) return 0;
    if (zeta <= 0) return 1;
    return Math.exp((-zeta * Math.PI) / Math.sqrt(1 - zeta * zeta));
}

const canvasEl = useTemplateRef<HTMLCanvasElement>("canvasEl");
const fieldEl = useTemplateRef<HTMLElement>("fieldEl");

// ── The ramp — 20 Canvas2D-VALID fills, BAKED by the producer's resolver ───────
// The tint rides the scene's --ball-tone / --color-progress seam (NOT ad-hoc hex):
// a low-overshoot (calm, settled) cell reads as a faint wash of the surface, a
// high-overshoot (ringing) cell saturates toward the motion accent.
//
// THE COLOUR DISCIPLINE (KF.W6 G-W6-11, one decision for every demo canvas):
// `ctx.fillStyle` is NOT a CSS cascade — it silently IGNORES anything it cannot
// parse, so a token stream handed to it straight stakes the whole render on
// undeclared UA behaviour with no failure signal. This file used to interpolate
// raw `getPropertyValue()` output (a `light-dark()`/`oklch()` stream) into a
// `color-mix()` string and assign that; every fill was one parser away from a
// no-op, and the two hex/hsl last resorts it carried were unreachable AND off the
// ruled violet authority. The producer ships the cure on `@mkbabb/glass-ui/canvas`:
// `resolveCanvasColor(value, el)` resolves the value ON el's cascade — inheriting
// its `color-scheme`, so `light-dark()` picks the live arm — and returns the
// browser's own `rgb()`/`rgba()` string, which Canvas2D always parses.
//
// Baked, not per-fill: the ramp is a pure function of the two tokens and ROWS, so
// a resize repaint reuses it and only a THEME FLIP re-bakes (20 resolves per flip,
// zero per resize). `useCanvas2D` — the subpath's other half — is EVALUATED and
// DECLINED here with its reason: it is a rAF LOOP substrate (`render(ctx, now)`
// every frame), and this field is a static landscape with no loop to park; its DPR
// policy (`min(devicePixelRatio, 2)`) is byte-identical to the one below, so the
// swap would buy a 60 Hz repaint for a picture that never changes. The colour
// resolver is the half this surface needs. (The glass-first ledger is G-W6-9's.)
const ramp: string[] = [];

function bakeRamp(field: HTMLElement): void {
    ramp.length = 0;
    for (let row = 0; row < ROWS; row++) {
        // y (top) = high damping (settled); y (bottom) = low damping (rings).
        // Map row→ζ so the TOP of the field is calm/overdamped and the BOTTOM
        // is the ringing underdamped band (the conventional reading of a
        // damping landscape).
        const zeta =
            DAMPING_MAX - ((row + 0.5) / ROWS) * (DAMPING_MAX - DAMPING_MIN);
        const os = overshoot(zeta); // [0, 1]
        // Perceptual mix in oklab (Baseline 2023): surface → accent by overshoot.
        // A gentle gamma lifts the low end so the underdamped band reads as a
        // legible gradient rather than collapsing to near-surface.
        const mix = Math.round(Math.pow(os, 0.7) * 100);
        ramp.push(
            resolveCanvasColor(
                `color-mix(in oklab, var(--ball-tone, var(--color-progress)) ${mix}%, var(--background))`,
                field,
            ),
        );
    }
}

/**
 * Paint the 20×20 grid. ONE-TIME at mount (and on a token/theme/size change) —
 * since the closed-form is ≤0.002 ms/cell the full repaint is free, so we simply
 * recompute on resize rather than caching pixels. Each cell's fill is the baked
 * ramp row above. NO SpringProgress is instantiated.
 */
function paint(): void {
    const canvas = canvasEl.value;
    const field = fieldEl.value;
    if (!canvas || !field) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cssW = field.clientWidth;
    const cssH = field.clientHeight;
    if (cssW <= 0 || cssH <= 0) return;

    // Crisp on high-DPI: back the canvas at devicePixelRatio, draw in CSS units.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (ramp.length !== ROWS) bakeRamp(field);

    const cellW = cssW / COLS;
    const cellH = cssH / ROWS;

    for (let row = 0; row < ROWS; row++) {
        ctx.fillStyle = ramp[row]!;
        for (let col = 0; col < COLS; col++) {
            ctx.fillRect(
                Math.floor(col * cellW),
                Math.floor(row * cellH),
                Math.ceil(cellW) + 1,
                Math.ceil(cellH) + 1,
            );
        }
    }
}

// ── Marker — the live (response, dampingFraction) position on the field ────────
const markerStyle = computed(() => {
    const rx =
        (demo.response.value - RESPONSE_MIN) / (RESPONSE_MAX - RESPONSE_MIN);
    // y is inverted: high damping at the TOP (see paint()).
    const ry =
        (DAMPING_MAX - demo.dampingFraction.value) /
        (DAMPING_MAX - DAMPING_MIN);
    // T.G4 — position by `transform: translate(<cqw>, <cqh>)` (compositor-only),
    // NOT `left`/`top`: the marker's glide-on-edit transition then rides `transform`
    // instead of animating layout properties (no per-edit layout thrash). `cqw`/`cqh`
    // resolve against the field (`.spring-heatmap` is a `container-type: size`).
    const px = clamp(rx, 0, 1) * 100;
    const py = clamp(ry, 0, 1) * 100;
    return {
        transform: `translate(${px}cqw, ${py}cqh)`,
    };
});

// ── Click-to-navigate — map a field pixel → (response, dampingFraction) ────────
// Snaps to the nearest cell CENTER (the field is grid-discretized), then writes
// the live params. The sliders + the rebuild watch in useSpringDemo pick this up
// (two-way: the heatmap reads the live params via the marker, click sets them).
function navigateFromPointer(clientX: number, clientY: number): void {
    const field = fieldEl.value;
    if (!field) return;
    const rect = field.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const fx = clamp((clientX - rect.left) / rect.width, 0, 1);
    const fy = clamp((clientY - rect.top) / rect.height, 0, 1);

    // Snap to the nearest cell center on each axis.
    const col = Math.min(COLS - 1, Math.floor(fx * COLS));
    const row = Math.min(ROWS - 1, Math.floor(fy * ROWS));

    const response =
        RESPONSE_MIN + ((col + 0.5) / COLS) * (RESPONSE_MAX - RESPONSE_MIN);
    const damping =
        DAMPING_MAX - ((row + 0.5) / ROWS) * (DAMPING_MAX - DAMPING_MIN);

    // Round to the slider step grid (0.01) so the navigated value is a clean
    // slider position and the marker lands on the cell center.
    demo.response.value = Math.round(response * 100) / 100;
    demo.dampingFraction.value = Math.round(damping * 100) / 100;
}

function onPointerDown(e: PointerEvent): void {
    navigateFromPointer(e.clientX, e.clientY);
    fieldEl.value?.focus();
}

// Keyboard navigation — step the live params by one cell per arrow press.
function onKeydown(e: KeyboardEvent): void {
    const stepR = (RESPONSE_MAX - RESPONSE_MIN) / COLS;
    const stepD = (DAMPING_MAX - DAMPING_MIN) / ROWS;
    let r = demo.response.value;
    let d = demo.dampingFraction.value;
    let handled = true;
    switch (e.key) {
        case "ArrowRight":
            r += stepR;
            break;
        case "ArrowLeft":
            r -= stepR;
            break;
        case "ArrowUp":
            d += stepD; // up = more damping (toward the calm top)
            break;
        case "ArrowDown":
            d -= stepD;
            break;
        default:
            handled = false;
    }
    if (!handled) return;
    e.preventDefault();
    demo.response.value =
        Math.round(clamp(r, RESPONSE_MIN, RESPONSE_MAX) * 100) / 100;
    demo.dampingFraction.value =
        Math.round(clamp(d, DAMPING_MIN, DAMPING_MAX) * 100) / 100;
}

// ── Lifecycle — paint once at mount; re-paint on resize (the closed-form is so
// cheap the recompute is free) and RE-BAKE + re-paint after a theme flip SETTLES.
//
// `onFlipSettled` is the producer's post-flip hook and the second half of the
// canvas discipline: a bare `watch(isDark)` is a DEFAULT-flush watcher, so it read
// the cascade BEFORE vueuse had applied `.dark` at `flush: "post"` — and the fatal
// direction was dark→light, where the outgoing dark-arm literal won and the
// rasterised field kept it until the next resize (nothing re-baked). The hook runs
// in ONE coalesced task after the flip's chrome paint, so what we resolve here is
// the arm the page is actually wearing. ─────────────────────────────────────────
useResizeObserver(fieldEl, () => paint());

const { onFlipSettled } = useGlobalDark();
const stopFlipSettled = onFlipSettled(() => {
    const field = fieldEl.value;
    if (!field) return;
    bakeRamp(field);
    paint();
});
onBeforeUnmount(stopFlipSettled);

onMounted(() => {
    const field = fieldEl.value;
    if (field) bakeRamp(field);
    paint();
});

// Expose the half-cell tolerance + ranges for any future consumer / gate witness.
defineExpose({ HALF_CELL_RESPONSE, HALF_CELL_DAMPING });

// (No watch on the params is needed for the canvas — the overshoot landscape is
// param-INDEPENDENT; only the marker moves, and it is reactive via markerStyle.)
watch(
    () => [demo.response.value, demo.dampingFraction.value] as const,
    () => {
        /* marker is reactive (markerStyle); nothing else to repaint */
    },
);
</script>

<style scoped>
/* ── P.W6 S3 — the heatmap field ──
   The field rides the scene's --ball-tone seam (inherited from .spring-target →
   --color-progress) so the tint is the motion language, never ad-hoc hex. A quiet
   hairline frames it against the quiet panel surface. */
.spring-heatmap {
    aspect-ratio: 11 / 13; /* response span (1.1) : damping span (1.3) — true scale */
    max-height: 16rem;
    border: 1px solid color-mix(in srgb, var(--foreground) 10%, transparent);
    background: var(--background);
    /* T.G4 — the field is the marker's query container (both axes: the marker
       rides `translate(<cqw>, <cqh>)`). The field's size is fixed by aspect-ratio
       + width, independent of contents, so `container-type: size` cannot collapse
       it. */
    container-type: size;
}

/* The live marker — a ringed dot tracking (response, damping). Reads the scene
   accent (--ball-tone seam) like every other spring instrument; lifts above the
   canvas with a soft phosphor glow so it stays legible over the saturated cells. */
.spring-heatmap-marker {
    position: absolute;
    /* T.G4 — anchored at the field's top-left; `transform: translate(<cqw>,<cqh>)`
       carries the (response, damping) position and the negative margins centre the
       0.9rem dot on it. The glide-on-edit transition rides `transform`
       (compositor-only), never `left`/`top` (no per-edit layout thrash). */
    top: 0;
    left: 0;
    width: 0.9rem;
    height: 0.9rem;
    margin-left: -0.45rem;
    margin-top: -0.45rem;
    border-radius: var(--radius-pill, 9999px);
    border: 2px solid var(--background);
    background: var(--ball-tone, var(--color-progress));
    box-shadow:
        0 0 0 1.5px color-mix(in srgb, var(--ball-tone, var(--color-progress)) 70%, transparent),
        0 0 8px color-mix(in srgb, var(--ball-tone, var(--color-progress)) 55%, transparent);
    pointer-events: none;
    /* The producer emits --duration-fast at :root (0.2s); the former `160ms`
       fallback arm was unreachable AND misstated the real duration by 25 % — a
       dead default that lied about the live one. The token stands alone. */
    transition: transform var(--duration-fast) var(--ease-standard, ease);
    will-change: transform;
    z-index: var(--z-content);
}

@media (prefers-reduced-motion: reduce) {
    .spring-heatmap-marker {
        transition: none;
    }
}
</style>
