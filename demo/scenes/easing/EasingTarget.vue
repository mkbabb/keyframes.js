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
        class="easing-target easing-gallery flex h-full w-full flex-col gap-4
            overflow-hidden px-4 py-4 lg:px-6"
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
                    <code class="literal-text text-mono-small">{{
                        literal
                    }}</code>
                    <!-- S-7 (W6-I): the copy control is a glass Button that
                         owns its box and its ink. The bespoke copy-control
                         rule pair W6-I orphaned here (a 1rem box + muted ink
                         authored for the old zero-size host) is DELETED from
                         `EasingTarget.css` in this same commit — the routing
                         W6-I §4.1 handed this unit, discharged, so no recipe
                         survives that could be re-applied to the primitive and
                         un-do the reshell. -->
                    <CopyButton :text="literal" label="Copy easing literal" />
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
                        aria-label="Filter curves by family"
                        @update:model-value="onFamilyChange"
                    >
                        <ToggleGroupItem
                            v-for="f in FAMILY_FILTERS"
                            :key="f"
                            :value="f"
                            size="sm"
                        >
                            {{ f }}
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </FadingScroll>
        </header>

        <!-- The drawer: a responsive specimen grid inside FadingScroll. Upper
             region of each tile: the static sparkline portrait + the hairline
             rail + the racing ball (the shared registerDotPainter seam — direct
             style.transform writes, OFF the Vue render graph). Lower region:
             the curve name, room to breathe, no truncation at the 150px floor.

             KF-ET-10 (W6-I, I-35 R-9 — `ChipGroup` DECLINED by the producer,
             the reshell is the cure): the 28 tiles are ONE `ToggleGroup
             type="single"` — the same primitive the family filter above
             already uses in this file — so the selected curve is the group's
             model (the hand-rolled single-select invariant and its 28
             independent `Chip mode="selectable"` booleans are gone), the grid
             is ONE tab stop with the arrows roving inside it (reka's roving
             focus, 28 stops → 1), and every tile is a real `<button
             aria-pressed>` with `data-state="on|off"`, which is what the
             demo's own pressed-paint rules (`.specimen-tile[data-state="on"]`)
             key on. The producer's 7.0.0 caveats, each answered here: the
             `type="single"` track paint is reset on the grid (the scoped
             block at the foot of this file, an INTERIM demo override of a
             glass-owned cascade in the KF-KC-10 shape — the grid is not a
             segmented control and must not wear a track); `chipVariants` is
             NOT composed onto the items — at 7.0.0 its `.glass-chip*` hooks
             live only in a sheet no entry imports, and its `glass-capsule`
             base IS the floating-tier plate KF-ET-21 convicts.

             KF-ET-21 ≡ KF-ES-21 (the ONE glass-TIER decision, §Sequencing 8;
             `.b` §2.6): THE HOST FLOATS, ITS CONTENTS DO NOT. The stage Card
             is the one glass plate on this axis; the 28 tiles inside a
             `mask-image` scroller are `data-surface="opaque"` — the
             producer's loaded surface axis (`surface-axis.css`: no
             backdrop-filter, the card ground, tint 0) — so 28 concurrent
             `backdrop-filter`s collapse to zero. The sidebar's stack was
             DECLARED here as the ruling's second site, split between
             `EasingScene.vue` and `EasingSidebar.vue`; unit `.k` holds the
             former and RESOLVED it by measurement: `EasingScene.vue` mounts no
             glass surface at all — no `Card`, no `tier`, no `surface`, no
             `data-surface`, not one glass-ui import — so the tier decision has
             NO byte to spend there and none was invented to look busy. The
             whole of the second site is `EasingSidebar.vue`, which is in no
             owed unit's writable set: ESCALATED to seat 0 with the decision
             already made (host floats, contents do not), so the receiving seat
             applies a ruling rather than re-taking one. -->
        <FadingScroll axis="y" class="specimen-drawer min-h-0 w-full flex-1">
            <ToggleGroup
                ref="gridEl"
                type="single"
                class="specimen-grid"
                aria-label="Easing curve specimens"
                :model-value="demo.currentEasingName.value"
                @update:model-value="onTileSelect"
            >
                <ToggleGroupItem
                    v-for="curve in visibleCurves"
                    :key="curve.name"
                    :value="curve.name"
                    size="sm"
                    data-surface="opaque"
                    class="specimen-tile flex-col gap-1.5 px-2 py-2.5"
                >
                    <span class="tile-stage" aria-hidden="true">
                        <svg
                            class="tile-sparkline"
                            viewBox="0 0 1 1"
                            preserveAspectRatio="none"
                        >
                            <path
                                :d="curve.path"
                                vector-effect="non-scaling-stroke"
                            />
                        </svg>
                        <span class="progress-rail tile-rail"></span>
                        <span
                            ref="tileBallEls"
                            class="progress-ball tile-ball"
                            :data-curve="curve.name"
                        ></span>
                    </span>
                    <span
                        class="tile-name text-mono-caption"
                        data-register="code"
                    >
                        {{ curve.name }}
                    </span>
                </ToggleGroupItem>
            </ToggleGroup>
        </FadingScroll>
    </Card>
</template>

<script setup lang="ts">
import {
    computed,
    inject,
    nextTick,
    onMounted,
    onScopeDispose,
    ref,
    useTemplateRef,
    watch,
} from "vue";
import type { ComponentPublicInstance } from "vue";
import { useMediaQuery, useResizeObserver } from "@vueuse/core";
import { Card } from "@mkbabb/glass-ui";
import { FadingScroll } from "@mkbabb/glass-ui/fading-scroll";
import { ToggleGroup, ToggleGroupItem } from "@mkbabb/glass-ui/toggle-group";
import { cubicBezierToString } from "@mkbabb/value.js/math";
import type { TimingFunction } from "@mkbabb/keyframes.js";

import CopyButton from "@components/CopyButton/CopyButton.vue";
import {
    getCurvePath,
    namedEasing,
    steppedEasing,
} from "@utils/reference-data/timingCurveUtils";
import { EASING_GROUPS } from "@utils/reference-data/easingGroups";
import { EASING_DEMO_KEY } from "./easingKeys";

const demo = inject(EASING_DEMO_KEY)!;

// ── The family filter (All · Standard · Sine · … · Back · Bounce · Steps) ──
// Replaces the former unlabeled "Singular/All" view-mode Select. "Custom"
// (the bare cubic-bezier editor affordance) is a SIDEBAR concern (T.E8's
// EasingPicker), not a specimen — it carries no tile and no filter entry.
const SPECIMEN_GROUPS = EASING_GROUPS.filter((g) => g.family !== "Custom");
const FAMILY_FILTERS = ["All", ...SPECIMEN_GROUPS.map((g) => g.family)];

const familyFilter = ref("All");
// The ToggleGroup emits its item value (a family name string here) — typed
// structurally so the demo never reaches for the headless reka basis (G.W12.S4).
type ToggleValue =
    | string
    | number
    | bigint
    | boolean
    | Record<string, unknown>
    | null
    | undefined;
const onFamilyChange = (v: ToggleValue | ToggleValue[]) => {
    // Single-select, never empty: ignore the deselect-toggle (clicking the
    // pressed filter keeps it pressed) — a filter is always in force.
    if (typeof v === "string" && v.length) familyFilter.value = v;
};

// ── The specimen set ───────────────────────────────────────────────
// Every named curve is a tile. Parameterized entries get honest static
// defaults ("steps" = the 4-step staircase; the selected curve's live
// parameters ride the header literal + the sidebar editor, not the tile).
const fnForCurve = (name: string): TimingFunction => {
    if (name === "steps") return steppedEasing(4, "jump-end");
    return namedEasing(name);
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
            path: getCurvePath(item.name),
        })),
    );
});

// ── Selection: the tile press IS the curve selection ───────────────
// The group emits its item value (a curve name) — or an empty value when the
// pressed tile is pressed again. Single-select, never empty: the deselect
// toggle is ignored (the controlled :model-value keeps the tile pressed — a
// curve is always selected), the same shape as the family filter above.
const onTileSelect = (v: ToggleValue | ToggleValue[]) => {
    if (typeof v === "string" && v.length) demo.selectEasing(v);
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
    // An engine-named curve (ease-in-out-sine, ease-in-bounce, step-start …):
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

// The grid is the ToggleGroup's root element (a component ref; vueuse's
// `unrefElement` reads its `$el` for the resize observer below).
const gridEl = useTemplateRef<ComponentPublicInstance>("gridEl");
const tileBallEls = useTemplateRef<HTMLElement[]>("tileBallEls");
const railWidth = ref(0);

const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

type TileEntry = {
    el: HTMLElement;
    stage: HTMLElement | null;
    fn: TimingFunction;
};
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

<style scoped src="./EasingTarget.css"></style>

<style scoped>
/* KF-ET-10 (W6-I) — INTERIM, demo-side, unlayered by being scoped (the
   KF-KC-10 + MM-4 shape: a glass-owned cascade overridden at the consumer
   without `:deep`, until the producer ships the switch). At 7.0.0
   `.toggle-group[data-type="single"]` paints a quiet blurred TRACK — padding,
   pill radius, `--glass-bg-quiet`, backdrop-filter, rim shadows — designed
   for a segmented control, and the specimen grid is a ToggleGroup only for
   its selection model and roving focus, never for that plate. The track is
   reset here; the grid's own geometry (display, columns, gap, padding) stays
   in EasingTarget.css, whose scoped rules already outrank the track's. The
   producer ask (a track opt-out on `ToggleGroup`) rides the wave's mail. */
.specimen-grid {
    border-radius: 0;
    background: none;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    box-shadow: none;
}
</style>
