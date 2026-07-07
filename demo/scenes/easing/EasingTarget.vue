<template>
    <!-- T.E6 (OD-7 APPROVED 2026-07-06 — P-GALLERY is the blessed reference) —
         THE SPECIMEN DRAWER IS THE SCENE. The owner ruled the direction (#14
         "just have the easing balls previewed here"): the buried "All"
         balls-preview mode is PROMOTED to be the scene; the singular hero
         (EasingHeroStage + ghost/smear) is DELETED. Every named curve is a
         specimen tile — a sparkline portrait with a 14px OD-6-violet ball
         racing x = fn(phase)·maxX on a hairline rail — under ONE shared sweep
         clock: all balls depart together, arrive per their curve. The
         comparative read IS the pedagogy. -->
    <Card
        :shadow="false"
        class="easing-target easing-gallery flex h-full w-full flex-col gap-4 overflow-hidden px-4 py-4 lg:px-6"
    >
        <!-- Header: the selected specimen PROMOTED. Left — the curve name at
             the Instrument-Serif display rung + its COMPLETE re-parseable
             literal (Fira Code + CopyButton, never truncated). Right — the
             QUIET family filter (a single-select ToggleGroup replacing the
             former view-mode Select). -->
        <header class="gallery-header shrink-0">
            <div class="gallery-id">
                <Transition name="specimen-name" mode="out-in">
                    <h2
                        :key="demo.currentEasingName.value"
                        class="specimen-name text-display text-foreground"
                    >
                        {{ demo.currentEasingName.value }}
                    </h2>
                </Transition>
                <span class="specimen-literal" data-register="code">
                    <code class="literal-text text-mono-small">{{ literal }}</code>
                    <CopyButton
                        class="literal-copy"
                        :text="literal"
                        label="Copy easing literal"
                    />
                </span>
            </div>
            <FadingScroll axis="x" class="family-filter">
                <!-- The owned max-content row: the vendor group centers its
                     content, and a CENTERED overflow strands its left edge
                     past the scroll origin ("All" unreachable on phones).
                     Sizing the row to its content removes the overflow
                     condition instead of reaching into the vendor root
                     (BG-12 — the strip posture is lettered to glass-ui). -->
                <div class="family-row">
                    <ToggleGroup
                        type="single"
                        :model-value="familyFilter"
                        class="family-group"
                        aria-label="Filter curves by family"
                        @update:model-value="onFamilyChange"
                    >
                        <ToggleGroupItem
                            v-for="f in FAMILY_FILTERS"
                            :key="f"
                            :value="f"
                            size="sm"
                            class="family-item"
                        >
                            {{ f }}
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </FadingScroll>
        </header>

        <!-- The drawer: a responsive specimen grid inside FadingScroll. Each
             tile is a glass-ui ToggleChip cell (single-select — the pressed
             tile IS the selected curve). Upper region: the static sparkline
             portrait + the hairline rail + the racing ball (the shared
             registerDotPainter seam — direct style.transform writes, OFF the
             Vue render graph). Lower region: the curve name, room to
             breathe, no truncation at the 150px floor. -->
        <FadingScroll axis="y" class="specimen-drawer min-h-0 w-full flex-1">
            <div
                ref="gridEl"
                class="specimen-grid"
                role="group"
                aria-label="Easing curve specimens"
            >
                <ToggleChip
                    v-for="curve in visibleCurves"
                    :key="curve.name"
                    variant="cell"
                    class="specimen-tile"
                    :model-value="curve.name === demo.currentEasingName.value"
                    @update:model-value="(on: boolean) => onTileToggle(curve.name, on)"
                >
                    <span class="tile-stage" aria-hidden="true">
                        <svg
                            class="tile-sparkline"
                            viewBox="0 0 1 1"
                            preserveAspectRatio="none"
                        >
                            <path :d="curve.path" vector-effect="non-scaling-stroke" />
                        </svg>
                        <span class="progress-rail tile-rail"></span>
                        <span
                            ref="tileBallEls"
                            class="progress-ball tile-ball"
                            :data-curve="curve.name"
                        ></span>
                    </span>
                    <span class="tile-name text-mono-caption" data-register="code">
                        {{ curve.name }}
                    </span>
                </ToggleChip>
            </div>
        </FadingScroll>
    </Card>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onMounted, onScopeDispose, ref, useTemplateRef, watch } from "vue";
import { useMediaQuery, useResizeObserver } from "@vueuse/core";
import { Card } from "@mkbabb/glass-ui";
import { FadingScroll } from "@mkbabb/glass-ui/fading-scroll";
import { ToggleChip } from "@mkbabb/glass-ui/toggle-chip";
import { ToggleGroup, ToggleGroupItem } from "@mkbabb/glass-ui/toggle-group";
import type { AcceptableValue } from "reka-ui";
import { cubicBezierToString, stepEnd, stepStart, steppedEase } from "@mkbabb/value.js";
import type { TimingFunction } from "@mkbabb/keyframes.js";

import CopyButton from "@components/custom/CopyButton.vue";
import { getCurvePath } from "@components/custom/instrument/transport/controls/timingCurveUtils";
import { EASING_GROUPS } from "./easingGroups";
import { EASING_DEMO_KEY } from "./easingKeys";

const demo = inject(EASING_DEMO_KEY)!;

// ── The family filter (All · Standard · Sine · … · Back · Bounce · Steps) ──
// Replaces the former unlabeled "Singular/All" view-mode Select. "Custom"
// (the bare cubic-bezier editor affordance) is a SIDEBAR concern (T.E8's
// EasingPicker), not a specimen — it carries no tile and no filter entry.
const SPECIMEN_GROUPS = EASING_GROUPS.filter((g) => g.family !== "Custom");
const FAMILY_FILTERS = ["All", ...SPECIMEN_GROUPS.map((g) => g.family)];

const familyFilter = ref("All");
const onFamilyChange = (v: AcceptableValue | AcceptableValue[]) => {
    // Single-select, never empty: ignore the deselect-toggle (clicking the
    // pressed filter keeps it pressed) — a filter is always in force.
    if (typeof v === "string" && v.length) familyFilter.value = v;
};

// ── The specimen set ───────────────────────────────────────────────
// Every named curve is a tile. Parameterized entries get honest static
// defaults ("steps" = the 4-step staircase; the selected curve's live
// parameters ride the header literal + the sidebar editor, not the tile).
const fnForCurve = (name: string): TimingFunction => {
    if (name === "steps") return steppedEase(4, "jump-end");
    if (name === "step-start") return stepStart();
    if (name === "step-end") return stepEnd();
    const fn = demo.timingFunctionsAnd[name];
    return typeof fn === "function" ? (fn as TimingFunction) : (t: number) => t;
};

interface SpecimenCurve {
    name: string;
    fn: TimingFunction;
    path: string;
}

const visibleCurves = computed<SpecimenCurve[]>(() => {
    const groups =
        familyFilter.value === "All"
            ? SPECIMEN_GROUPS
            : SPECIMEN_GROUPS.filter((g) => g.family === familyFilter.value);
    return groups.flatMap((g) =>
        g.items.map((item) => ({
            name: item.name,
            fn: fnForCurve(item.name),
            path: getCurvePath(item.name, demo.timingFunctionsAnd),
        })),
    );
});

// ── Selection: the tile press IS the curve selection ───────────────
const onTileToggle = (name: string, on: boolean) => {
    // Single-select: pressing selects; pressing the already-selected tile is
    // a no-op (the controlled :model-value keeps it pressed — a curve is
    // always selected).
    if (on) demo.selectEasing(name);
};

// ── The header literal — COMPLETE and re-parseable, never truncated ──
const literal = computed<string>(() => {
    const name = demo.currentEasingName.value;
    if (name === "steps") {
        return `steps(${demo.stepOptions.value.steps}, ${demo.stepOptions.value.jumpTerm})`;
    }
    if (demo.isBezierEditable.value) {
        return cubicBezierToString(...demo.bezierControlPoints.value);
    }
    // An engine-named curve (ease-in-out-sine, bounce-in-ease, step-start …):
    // the name IS the literal — value.js round-trips it by registry lookup.
    return name;
});

// ── The tile painter: ONE shared clock, direct transform writes ─────
// The demo's registerDotPainter seam survives (I.W4 D4): the sweep loop calls
// the painter imperatively each frame with the live raw phase; the painter
// walks a DOM snapshot and writes style.transform ONLY — zero per-frame
// filter/layout writes, zero Vue re-renders. All balls read the SAME phase:
// the departure is simultaneous by construction.
const BALL_SIZE = 14;

const gridEl = useTemplateRef<HTMLElement>("gridEl");
const tileBallEls = useTemplateRef<HTMLElement[]>("tileBallEls");
const railWidth = ref(0);

const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

type TileEntry = { el: HTMLElement; stage: HTMLElement | null; fn: TimingFunction };
let tileSnapshot: TileEntry[] = [];

// IntersectionObserver gates the paint walk: off-screen tiles (the drawer
// scrolls) take no transform writes; a tile scrolling back in snaps to the
// live phase on the next observer tick.
const visibleStages = new Set<Element>();
let io: IntersectionObserver | null = null;

const tileBallXAt = (fn: TimingFunction, phase: number): number => {
    const maxX = railWidth.value - BALL_SIZE;
    return maxX > 0 ? fn(phase) * maxX : 0;
};

const paintTileDots = (phase: number) => {
    for (const { el, stage, fn } of tileSnapshot) {
        if (stage && !visibleStages.has(stage)) continue;
        el.style.transform = `translateX(${tileBallXAt(fn, phase)}px)`;
    }
};

// Reduced motion: no sweep — every ball RESTS at its end state and the
// sparklines ARE the preview (the portrait carries the curve).
const paintRestState = () => {
    for (const { el, fn } of tileSnapshot) {
        el.style.transform = `translateX(${tileBallXAt(fn, 1)}px)`;
    }
};

const measureRailWidth = () => {
    const stage = tileSnapshot[0]?.stage;
    if (stage) railWidth.value = stage.clientWidth;
    if (reducedMotion.value) paintRestState();
    else demo.repaintDots();
};

let unregisterPainter: (() => void) | null = null;
const wirePainter = async () => {
    await nextTick(); // the new filter's tiles must be in the DOM first
    unregisterPainter?.();
    unregisterPainter = null;
    io?.disconnect();
    visibleStages.clear();
    // Snapshot keyed by data-curve (NOT v-for index — ref arrays carry no
    // order guarantee), stage = the ball's positioning parent.
    tileSnapshot = (tileBallEls.value ?? []).map((el) => ({
        el,
        stage: el.parentElement,
        fn: fnForCurve(el.dataset.curve ?? ""),
    }));
    io = new IntersectionObserver(
        (entries) => {
            for (const e of entries) {
                if (e.isIntersecting) visibleStages.add(e.target);
                else visibleStages.delete(e.target);
            }
            // Newly-visible tiles snap to the live phase at once.
            if (!reducedMotion.value) demo.repaintDots();
        },
        { rootMargin: "25% 0px" },
    );
    for (const { stage } of tileSnapshot) if (stage) io.observe(stage);
    const stage = tileSnapshot[0]?.stage;
    if (stage) railWidth.value = stage.clientWidth;
    if (reducedMotion.value) {
        paintRestState();
        return;
    }
    // registerDotPainter paints once on register — a paused scene shows the
    // correct rest position immediately.
    unregisterPainter = demo.registerDotPainter(paintTileDots);
};

onMounted(() => wirePainter());
onScopeDispose(() => {
    unregisterPainter?.();
    io?.disconnect();
});

watch(visibleCurves, () => wirePainter());
watch(reducedMotion, () => wirePainter());
// A selection change needs no re-wire (tile fns are static portraits) — but
// the pressed-state render must not strand a paused ball: repaint at the live
// phase so the drawer stays coherent under scrub.
watch(
    () => demo.currentEasingName.value,
    () => {
        if (!reducedMotion.value) demo.repaintDots();
    },
);

// The grid is uniform-width tiles; one measure serves every rail.
useResizeObserver(gridEl, () => measureRailWidth());
</script>

<style scoped>
.easing-target {
    /* T.E9 (#16a) + T.D7/OD-6 — the scene's ONE colour consumer is the blessed
       violet authority, consumed through the sitewide motion token
       (--color-progress = --accent-kf since T.D7) via the shared --ball-tone
       seam the .progress-rail/.progress-ball idiom reads. One token; every
       ball, rail tint, selected sparkline, and active label agrees. */
    --ball-tone: var(--color-progress);
}

/* ── Header ── */
.gallery-header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 0.5rem 1.5rem;
}

.gallery-id {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.25rem 0.875rem;
    min-width: 0;
}

.specimen-name {
    line-height: 1.05;
    /* Curve identifiers read as-cased (ease-in-out, bounce-in-ease-half). */
    text-transform: none;
}

/* The promoted-name crossfade — quiet 140ms out-in; PRM-suppressed. */
.specimen-name-enter-active,
.specimen-name-leave-active {
    transition:
        opacity 140ms var(--ease-standard, ease),
        transform 140ms var(--ease-standard, ease);
}
.specimen-name-enter-from {
    opacity: 0;
    transform: translateY(0.15em);
}
.specimen-name-leave-to {
    opacity: 0;
    transform: translateY(-0.1em);
}
@media (prefers-reduced-motion: reduce) {
    .specimen-name-enter-active,
    .specimen-name-leave-active {
        transition: none;
    }
}

/* The complete re-parseable literal: Fira Code, wraps (never truncates),
   copy affordance beside it. */
.specimen-literal {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    min-width: 0;
    color: var(--muted-foreground);
}
.literal-text {
    text-transform: none;
    overflow-wrap: anywhere;
}
.literal-copy {
    /* CopyButton's icons are absolutely-positioned at 100% — the button needs
       an intrinsic box here (the sidebar mount sizes it externally). */
    width: 1rem;
    height: 1rem;
    flex: none;
    color: var(--muted-foreground);
}
.literal-copy:hover {
    color: var(--foreground);
}

/* The family filter is QUIET: caption-rung text pills, horizontal fade-scroll
   at narrow widths so the row never wraps the header into a tower. */
.family-filter {
    max-width: 100%;
}
.family-row {
    display: inline-flex;
    width: max-content;
    white-space: nowrap;
}

/* ── The drawer ── */
.specimen-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.5rem;
    /* Breathing room so tile hover/pressed rings never clip against the
       fade-scroll mask edges. */
    padding: 2px 2px 1rem;
}

/* Each tile: content-visibility gates off-screen render work (the paint walk
   is already IO-gated; this gates style/layout too). The intrinsic-size
   placeholder keeps the scrollbar honest. */
.specimen-tile {
    content-visibility: auto;
    contain-intrinsic-size: auto 104px;
    align-items: stretch;
}

/* ── The specimen stage: sparkline portrait + hairline rail + ball ── */
.tile-stage {
    position: relative;
    display: block;
    width: 100%;
    height: 3.25rem;
}

/* The static sparkline — the curve's portrait (value vs time), faint behind
   the race. 18% headroom + visible overflow keep overshoot unclipped. */
.tile-sparkline {
    position: absolute;
    inset: 18% 0;
    width: 100%;
    height: 64%;
    overflow: visible;
}
.tile-sparkline path {
    fill: none;
    stroke: color-mix(in srgb, var(--foreground) 22%, transparent);
    stroke-width: 1.25;
    stroke-linecap: round;
    stroke-linejoin: round;
}

/* The hairline rail — 1px (a named delta off the 2px idiom default: 33
   rails at 2px read as a grid of rules; at 1px they recede to ruled paper).
   Ticks mark the shared origin + terminus: the departure is LEGIBLE. */
.tile-rail {
    height: 1px;
    --rail-tint: 16%;
}
.tile-stage::before,
.tile-stage::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 1px;
    height: 9px;
    transform: translateY(-50%);
    background: color-mix(in srgb, var(--foreground) 22%, transparent);
}
.tile-stage::before {
    left: 6.5px; /* the departure — every ball's center at phase 0 */
}
.tile-stage::after {
    right: 6.5px; /* the terminus — every ball's center at fn(1) = 1 */
}

/* The racing ball: 14px, the OD-6 violet, transform-positioned by the shared
   painter (left: 0 is the origin; translateX carries the race). The glow is
   STATIC (one composite layer) — never written per frame. */
.tile-ball {
    --ball-size: 14px;
    --ball-glow: 28%;
    left: 0;
    will-change: transform;
}

/* ── Selection ── ToggleChip's data-state="on" carries the glass wash
   (primary 15% = the violet authority). The specimen adds: the portrait inks
   up, the name takes the tone. The BALL stays identical — the comparative
   race reads only when every runner is equal. */
.specimen-tile[data-state="on"] .tile-sparkline path {
    stroke: color-mix(in srgb, var(--ball-tone) 65%, transparent);
    stroke-width: 1.5;
}
.specimen-tile[data-state="on"] .tile-name {
    color: var(--ball-tone);
    font-weight: 600;
}

/* ── The name row: room to breathe, never truncated ── */
.tile-name {
    text-transform: none; /* identifiers read as-cased */
    text-align: center;
    overflow-wrap: anywhere;
    line-height: 1.35;
    padding-bottom: 0.125rem;
    color: var(--muted-foreground);
}
.specimen-tile:hover .tile-name {
    color: var(--foreground);
}
</style>
