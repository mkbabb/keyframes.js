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
             to SR — proof:lighthouse-a11y); `.focus-ring` is the demo-wide
             keyboard focus contract; arrow keys step the live params by one cell. -->
        <div
            ref="fieldEl"
            class="spring-heatmap focus-ring relative w-full select-none cursor-crosshair rounded-md overflow-hidden"
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
import { computed, onMounted, useTemplateRef, watch } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { useGlobalDark } from "@mkbabb/glass-ui/dark";

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

// ── Resolve the perceptual ramp endpoints from the live design tokens ──────────
// The tint rides the scene's --color-progress / --ball-tone token (NOT ad-hoc
// hex): a low-overshoot (calm, settled) cell reads as a faint wash of the surface,
// a high-overshoot (ringing) cell saturates toward the motion accent. We sample
// the resolved token from the field element so dark mode re-tints for free.
function resolveTone(el: HTMLElement): string {
    const cs = getComputedStyle(el);
    return (
        cs.getPropertyValue("--ball-tone").trim() ||
        cs.getPropertyValue("--color-progress").trim() ||
        "hsl(142 71% 45%)"
    );
}
function resolveSurface(el: HTMLElement): string {
    const cs = getComputedStyle(el);
    return cs.getPropertyValue("--background").trim() || cs.backgroundColor || "#fff";
}

/**
 * Paint the 20×20 grid. ONE-TIME at mount (and on a token/theme/size change) —
 * since the closed-form is ≤0.002 ms/cell the full repaint is free, so we simply
 * recompute on resize rather than caching pixels. Each cell's fill is the
 * perceptual blend of the surface and the accent tone by its overshoot amplitude
 * (a `color-mix(in oklab)` ramp — oklab is the perceptual space the engine's own
 * color interpolation defaults to). NO SpringProgress is instantiated.
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

    const tone = resolveTone(field);
    const surface = resolveSurface(field);

    const cellW = cssW / COLS;
    const cellH = cssH / ROWS;

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
        ctx.fillStyle = `color-mix(in oklab, ${tone} ${mix}%, ${surface})`;
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
    return {
        left: `${Math.max(0, Math.min(1, rx)) * 100}%`,
        top: `${Math.max(0, Math.min(1, ry)) * 100}%`,
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

    const fx = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const fy = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

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
        Math.round(Math.max(RESPONSE_MIN, Math.min(RESPONSE_MAX, r)) * 100) / 100;
    demo.dampingFraction.value =
        Math.round(Math.max(DAMPING_MIN, Math.min(DAMPING_MAX, d)) * 100) / 100;
}

// ── Lifecycle — paint once at mount; re-paint on resize (the closed-form is so
// cheap the recompute is free) and on a theme change (the token tints shift). ──
useResizeObserver(fieldEl, () => paint());

const { isDark } = useGlobalDark();
watch(isDark, () => paint());

onMounted(() => {
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
}

/* The live marker — a ringed dot tracking (response, damping). Reads the scene
   accent (--ball-tone seam) like every other spring instrument; lifts above the
   canvas with a soft phosphor glow so it stays legible over the saturated cells. */
.spring-heatmap-marker {
    position: absolute;
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
    transition:
        left var(--duration-fast, 160ms) var(--ease-standard, ease),
        top var(--duration-fast, 160ms) var(--ease-standard, ease);
    will-change: left, top;
    z-index: var(--z-content);
}

@media (prefers-reduced-motion: reduce) {
    .spring-heatmap-marker {
        transition: none;
    }
}
</style>
