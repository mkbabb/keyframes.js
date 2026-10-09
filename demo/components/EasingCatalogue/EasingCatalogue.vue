<template>
    <!-- X.KF.W13W.p (OA-58, KF-W13.md §0cq) — THE ONE EASING PICKER. Every site
         that picks a named curve renders this component: the Easing scene's
         specimen gallery (its stage) and the Controls pane's easing dropdown
         (ChannelOptions, a popover over this same body). One hierarchy:
           1. the family filter — ONE glass segmented control (`SegmentedTabs`,
              glass's exported seam), never a row of loose stadium pills;
           2. a divider between the filter and the grid;
           3. per-family sections, each under a type-scale header, when the
              filter is "All";
           4. one tile idiom on `--radius-field`: the curve with its ball ON the
              curve (`curvePlot`, X.KF.W13W.b — the stroke and the ball read ONE
              plot), the name beneath, never truncated;
           5. the selected tile marked by ink + ring, never a grey plate.
         The tiles are ONE `ToggleGroup type="single"` (one tab stop, arrows
         roving across every section) — the grid's selection model, not its
         paint. -->
    <div class="easing-catalogue" data-easing-catalogue :data-density="density">
        <!-- X-DS r3 pass 3 (KF-C22-01) — a TEN-way categorical filter takes
             glass's own axes, not the equal-width eyeglass: the pill strip
             forced every option to the widest label's width (960 px of strip in
             a 772 px stage at 1440, Bounce and Steps behind an edge a mouse
             could not reach), so overflow was the designed state at every
             width. `variant="underline"` is the paper ink hairline (no capsule
             track), its options sized to their labels and the row wrapping in
             the stage; `:responsive` collapses it to glass's Select wherever
             the host is narrow: below lg for the stage, and always in the
             Controls pane's popover (`density="menu"`, a narrow host at every
             viewport). The FadingScroll and the max-content row are deleted
             with the overflow they existed to scroll. -->
        <SegmentedTabs
            variant="underline"
            semantics="toggle"
            class="catalogue-filter"
            :options="familyOptions"
            :model-value="family"
            :responsive="filterResponsive"
            aria-label="Filter curves by family"
            @update:model-value="onFamilyChange"
        />

        <!-- The divider between the filter and the grid: the underline
             strip's own paper hairline when the strip shows (a second rule
             under it read as a double line), this Separator when the filter
             is glass's collapsed Select. -->
        <Separator v-if="!filterIsStrip" class="catalogue-divider" />

        <FadingScroll axis="y" class="specimen-drawer min-h-0 w-full flex-1">
            <ToggleGroup
                type="single"
                size="sm"
                class="specimen-grid-group"
                :aria-label="label"
                :model-value="modelValue ?? ''"
                @update:model-value="onTileSelect"
            >
                <section
                    v-for="group in visibleGroups"
                    :key="group.family"
                    class="catalogue-section"
                >
                    <h3
                        v-if="family === ALL"
                        class="catalogue-family text-subheading"
                    >
                        {{ group.family }}
                    </h3>
                    <div class="specimen-grid">
                        <ToggleGroupItem
                            v-for="item in group.items"
                            :key="item.name"
                            :value="item.name"
                            :aria-describedby="descriptionId(item.name)"
                            data-surface="opaque"
                            class="specimen-tile flex-col gap-1.5 px-2 py-2.5"
                        >
                            <span class="tile-stage" aria-hidden="true">
                                <span class="tile-plot">
                                    <svg
                                        class="tile-sparkline"
                                        :viewBox="plotFor(item.name).viewBox"
                                        preserveAspectRatio="none"
                                    >
                                        <path
                                            :d="plotFor(item.name).d"
                                            vector-effect="non-scaling-stroke"
                                        />
                                    </svg>
                                    <span
                                        ref="tileCarriageEls"
                                        class="curve-carriage tile-carriage"
                                        :data-curve="item.name"
                                        :style="{
                                            '--curve-rest': plotFor(item.name).place(0),
                                        }"
                                    >
                                        <span
                                            class="curve-ball tile-ball"
                                            :data-curve="item.name"
                                        ></span>
                                    </span>
                                </span>
                            </span>
                            <span
                                class="tile-name text-mono-caption"
                                data-register="code"
                                >{{ item.name }}</span
                            >
                            <!-- The row's DESCRIPTION is its accessible
                                 description, never part of its name (OA-31):
                                 visually hidden, wired by aria-describedby. -->
                            <span
                                :id="descriptionId(item.name)"
                                class="sr-only"
                                aria-hidden="true"
                                >{{ item.description }}</span
                            >
                        </ToggleGroupItem>
                    </div>
                </section>
            </ToggleGroup>
        </FadingScroll>
    </div>
</template>

<script setup lang="ts">
import {
    computed,
    nextTick,
    onMounted,
    onScopeDispose,
    ref,
    useId,
    useTemplateRef,
    watch,
} from "vue";
import { useMediaQuery } from "@vueuse/core";
import { Separator } from "@mkbabb/glass-ui/separator";
import { FadingScroll } from "@mkbabb/glass-ui/fading-scroll";
import { SegmentedTabs, type SegmentedTabOption } from "@mkbabb/glass-ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@mkbabb/glass-ui/toggle-group";
import type { TimingFunction } from "@mkbabb/keyframes.js";

import { curvePlot, unitEasingFrame, type CurvePlot } from "@utils/curvePlot";

/** One family of the catalogue: its name and its curves, in display order. */
export interface CatalogueGroup {
    readonly family: string;
    readonly items: readonly {
        readonly name: string;
        readonly description: string;
    }[];
}

/** A shared sweep clock: the painter is called with the live phase each frame. */
export interface CatalogueClock {
    register: (paint: (phase: number) => void) => () => void;
    repaint: () => void;
}

const props = withDefaults(
    defineProps<{
        /** The selected curve's name (`null`: nothing in the catalogue matches). */
        modelValue: string | null;
        /** The families shown, in order. */
        groups: readonly CatalogueGroup[];
        /** The function each tile plots — the easing its name installs. */
        curveFor: (name: string) => TimingFunction;
        /** The accessible name of the tile group. */
        label: string;
        /** A sweep clock the balls race on; without one each ball rests on its curve. */
        clock?: CatalogueClock;
        /** `stage` = the scene's gallery; `menu` = the dropdown's compact grid. */
        density?: "stage" | "menu";
    }>(),
    { density: "stage" },
);

const emit = defineEmits<{
    (e: "update:modelValue", name: string): void;
}>();

// ── The family filter: All · <family> … (one segmented control) ──────
const ALL = "All";
const familyOptions = computed<SegmentedTabOption[]>(() =>
    [ALL, ...props.groups.map((g) => g.family)].map((f) => ({
        label: f,
        value: f,
    })),
);
const family = ref(ALL);
/** KF-C22-01 — where the strip is a strip. The stage keeps it from lg up (the
 *  stage header's own breakpoint); the popover never does: glass's collapse
 *  reads the viewport, and the menu is narrow at every viewport, so its
 *  breakpoint is one no viewport reaches. */
const STRIP_MIN_WIDTH = "1024px";
const filterResponsive = computed(() => ({
    breakpoint: props.density === "menu" ? "100000px" : STRIP_MIN_WIDTH,
    ariaLabel: "Filter curves by family",
}));
const wideViewport = useMediaQuery(`(min-width: ${STRIP_MIN_WIDTH})`);
const filterIsStrip = computed(() => props.density === "stage" && wideViewport.value);
const onFamilyChange = (v: string) => {
    family.value = v;
};
const visibleGroups = computed(() =>
    family.value === ALL
        ? props.groups
        : props.groups.filter((g) => g.family === family.value),
);

// ── Selection: the tile press IS the curve pick ─────────────────────
// Single-select, never empty: the deselect toggle (pressing the pressed tile)
// is ignored, so a curve is always selected.
type ToggleValue =
    | string
    | number
    | bigint
    | boolean
    | Record<string, unknown>
    | null
    | undefined;
const onTileSelect = (v: ToggleValue | ToggleValue[]) => {
    if (typeof v === "string" && v.length) emit("update:modelValue", v);
};

const idBase = useId();
const descriptionId = (name: string): string => `${idBase}-desc-${name}`;

// ── The tile plots: ONE plot per name, from the function it installs ──
// Re-derived when `curveFor`'s reactive inputs move (the dropdown's draft
// kinds track the store's live quad / step options).
const TILE_FRAME = unitEasingFrame();
const plots = computed(() => {
    const map = new Map<string, CurvePlot>();
    for (const g of props.groups)
        for (const i of g.items)
            map.set(i.name, curvePlot(props.curveFor(i.name), TILE_FRAME));
    return map;
});
const plotFor = (name: string): CurvePlot => plots.value.get(name)!;

// ── The painter: ONE shared clock, direct transform writes ──────────
// With a clock, the sweep loop calls the painter each frame with the live phase;
// it walks a DOM snapshot and writes `style.transform` ONLY (no Vue render, no
// layout read). Every ball reads the SAME phase, so the departure is
// simultaneous by construction, and each is placed at `plot.place(phase)` — the
// point of the plot that drew its stroke (X.KF.W13W.b). Without a clock, or
// under reduced motion, the balls rest on their curves.
const tileCarriageEls = useTemplateRef<HTMLElement[]>("tileCarriageEls");
const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

type TileEntry = { el: HTMLElement; stage: HTMLElement | null; plot: CurvePlot };
let tileSnapshot: TileEntry[] = [];

// IntersectionObserver gates the paint walk: off-screen tiles (the drawer
// scrolls) take no transform writes; a tile scrolling back in snaps to the live
// phase on the next observer tick.
const visibleStages = new Set<Element>();
let io: IntersectionObserver | null = null;

const paintTileDots = (phase: number) => {
    for (const { el, stage, plot } of tileSnapshot) {
        if (stage && !visibleStages.has(stage)) continue;
        el.style.transform = plot.place(phase);
    }
};

// Reduced motion: no sweep — every ball RESTS on its curve at the end state.
const paintRestState = () => {
    for (const { el, plot } of tileSnapshot) el.style.transform = plot.place(1);
};

let unregisterPainter: (() => void) | null = null;
const wirePainter = async () => {
    await nextTick(); // the new filter's tiles must be in the DOM first
    unregisterPainter?.();
    unregisterPainter = null;
    io?.disconnect();
    io = null;
    visibleStages.clear();
    const clock = props.clock;
    if (!clock) return; // unclocked: every carriage holds `--curve-rest`
    // Snapshot keyed by data-curve (ref arrays carry no order guarantee).
    tileSnapshot = (tileCarriageEls.value ?? []).map((el) => ({
        el,
        stage: el.closest<HTMLElement>(".tile-stage"),
        plot: plotFor(el.dataset.curve ?? ""),
    }));
    if (reducedMotion.value) {
        paintRestState();
        return;
    }
    io = new IntersectionObserver(
        (entries) => {
            for (const e of entries) {
                if (e.isIntersecting) visibleStages.add(e.target);
                else visibleStages.delete(e.target);
            }
            clock.repaint(); // newly-visible tiles snap to the live phase
        },
        { rootMargin: "25% 0px" },
    );
    for (const { stage } of tileSnapshot) if (stage) io.observe(stage);
    // registerPainter paints once on register — a paused clock shows the
    // correct rest position immediately.
    unregisterPainter = clock.register(paintTileDots);
};

onMounted(() => wirePainter());
onScopeDispose(() => {
    unregisterPainter?.();
    io?.disconnect();
});

watch([visibleGroups, plots, reducedMotion], () => wirePainter());
// A selection change needs no re-wire — but the pressed-state render must not
// strand a paused ball: repaint at the live phase so the grid stays coherent.
watch(
    () => props.modelValue,
    () => {
        if (props.clock && !reducedMotion.value) props.clock.repaint();
    },
);
</script>

<style scoped>
.easing-catalogue {
    /* The one violet authority (--color-progress = --accent-kf) through the
       shared --ball-tone seam every ball reads. */
    --ball-tone: var(--color-progress);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-height: 0;
    min-width: 0;
}

/* ── 1 · the family filter: glass's underline strip, wrapping in the stage ── */
/* The options keep their own widths (glass's underline is a flex row); the row
   wraps rather than overflowing, so every family is on the page. The ink
   indicator rides the active option on whichever line it sits. */
.catalogue-filter {
    flex: none;
    flex-wrap: wrap;
    max-width: 100%;
}

/* ── 2 · the divider (glass Separator owns its hairline) ── */
.catalogue-divider {
    flex: none;
}

/* ── 3 · the sections: one type-scale header per family on "All" ── */
/* KF-ET-10 — INTERIM, demo-side (the KF-KC-10 + MM-4 shape): at the installed
   glass `.toggle-group[data-type="single"]` paints a quiet blurred TRACK for a
   segmented control; this group is a ToggleGroup only for its selection model
   and roving focus, never for that plate. The producer ask (a track opt-out)
   rides the wave's mail. */
.specimen-grid-group {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: 1.25rem;
    inline-size: 100%;
    padding: 2px 2px 1rem;
    border-radius: 0;
    background: none;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    box-shadow: none;
}
.catalogue-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.catalogue-family {
    color: var(--foreground);
    text-transform: none;
}
/* X-DS pass 16 (KF-C16-03) — below lg the display rung is fluid and shrinks
   (~26 px at 390) while the subheading rung does not, so 'Standard' out-ranked
   the specimen's name. The family names step down to the body rung (the
   utility's semibold kept): section labels under the specimen. */
@media (max-width: 1023px) {
    .catalogue-family {
        font-size: var(--type-body);
    }
}

/* ── 4 · the tile idiom ── */
/* X-DS pass 4 (KF-C4-06) — never fewer than two tiles a row: the track floor is
   the smaller of --tile-min and half the row (less half the gap). At 390 the
   ~295px box fell to ONE column of full-width tiles (two 152px tracks and the
   gap did not fit), and with the 2:1 stage (KF-C3-03) each tile doubled in
   height, so two specimens filled the plate. */
.specimen-grid {
    display: grid;
    grid-template-columns: repeat(
        auto-fill,
        minmax(min(var(--tile-min, 9.5rem), calc(50% - 0.25rem)), 1fr)
    );
    gap: 0.5rem;
}
[data-density="menu"] .specimen-grid {
    --tile-min: 6.75rem;
}
/* A tile holds two lines (the curve + the name): the multi-line field rung,
   never the producer item's stadium. content-visibility gates off-screen work.
   X-DS r3 pass 2 (KF-C21-01) — KF-C9-02's tile reset, at the root of every
   specimen tile (the Spring preset cells' idiom): the producer item paints its
   plate as a background-IMAGE (the control-surface gradient) and an inset edge
   stack, so a background-colour reset left the lit plate on every tile, the
   selected one included. The shorthand clears the image; the tile is a hairline
   at the field radius. The consumer choosing its own tile paint (O-59 tile
   axis); no glass lighting token is touched (O-87). */
.specimen-tile {
    border-radius: var(--radius-field);
    border: 1px solid var(--border);
    background: transparent;
    box-shadow: none;
    content-visibility: auto;
    contain-intrinsic-size: auto 132px;
    align-items: stretch;
    height: auto;
}
/* X-DS pass 3 · KF-C3-03 — the stage keeps a 2:1 aspect, not a fixed 3.25rem
   band: on a ~180px tile the band drew each sparkline ~165x34 (5:1), so ease,
   ease-in, ease-in-sine and ease-out-sine flattened into one another and the
   comparative read the gallery exists for was lost. The plot's overshoot
   headroom (below) is unchanged. */
.tile-stage {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 2 / 1;
}
/* The plot box: the sparkline and the ball's carriage share it (curvePlot's
   placement idiom, design-idioms `.curve-carriage`). 18% headroom top and
   bottom + visible overflow keep overshoot unclipped; the inline inset is half
   a ball, so a ball on either end of the curve stays on the tile. */
.tile-plot {
    position: absolute;
    inset: 18% 7px;
}
.tile-sparkline {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
}
.tile-sparkline path {
    fill: none;
    stroke: color-mix(in srgb, var(--foreground) 22%, transparent);
    stroke-width: 1.25;
    stroke-linecap: round;
    stroke-linejoin: round;
}
.tile-carriage {
    will-change: transform;
}
.tile-ball {
    --ball-size: 14px;
}
[data-density="menu"] .tile-ball {
    --ball-size: 10px;
}
/* The name: beneath the curve, NEVER truncated — a name longer than the tile
   wraps at its own hyphens; it never ellipsizes. */
.tile-name {
    text-transform: none; /* identifiers read as-cased */
    text-align: center;
    letter-spacing: 0;
    white-space: normal;
    overflow-wrap: anywhere;
    text-wrap: balance;
    line-height: 1.35;
    padding-bottom: 0.125rem;
    color: var(--muted-foreground);
}
.specimen-tile:hover .tile-name {
    color: var(--foreground);
}

/* ── 5 · selection: ink + ring, never a grey plate ── */
.specimen-tile[data-state="on"],
.specimen-tile[data-state="on"]:hover:not(:disabled) {
    outline: 1.5px solid var(--foreground);
    outline-offset: -1.5px;
}
.specimen-tile[data-state="on"] .tile-sparkline path {
    stroke: var(--foreground);
    stroke-width: 1.5;
}
.specimen-tile[data-state="on"] .tile-name {
    color: var(--foreground);
    font-weight: 600;
}
@media (forced-colors: active) {
    .specimen-tile[data-state="on"] {
        outline-color: Highlight;
    }
}
</style>
