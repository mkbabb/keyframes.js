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
    <div ref="rootEl" class="easing-catalogue" data-easing-catalogue :data-density="density">
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
             with the overflow they existed to scroll.
             X-DS r5 pass 4 (KF-C4-01) — the strip is ONE row or it is the
             Select. Wrapping was the designed state: ten labels at the
             section-heading rung needed ~850 px of a 772 px stage at 1440, so
             "Steps" sat alone on a second row and the ink underline and the
             strip's hairline were on different lines. The labels step one rung
             down (`--type-small`, under the family headings they filter), the
             row no longer wraps, and the collapse to the Select is driven by a
             measured "does not fit one row" as well as the lg floor. -->
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

        <!-- X-DS r5 pass 5 (KF-C5-09) — the stage's drawer lands its fold on
             a row (`landDrawer`, the script), as the rail's scrollers do. -->
        <FadingScroll ref="drawerEl" axis="y" class="specimen-drawer min-h-0 w-full flex-1">
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
                                 visually hidden, wired by aria-describedby.
                                 X-DS r6 pass 9 (KF-C9-07) — shown as a muted
                                 second line where the engine name misdescribes
                                 the drawn shape (`noteShown`); still the
                                 description, never the name. -->
                            <span
                                :id="descriptionId(item.name)"
                                :class="item.noteShown ? 'tile-note text-caption' : 'sr-only'"
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
import { useMediaQuery, useResizeObserver } from "@vueuse/core";
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
        /** KF-C9-07 — the description shows as a second line (a misdescribing engine name). */
        readonly noteShown?: boolean;
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
const NEVER = "100000px";
const wideViewport = useMediaQuery(`(min-width: ${STRIP_MIN_WIDTH})`);
/** KF-C4-01 — and only where its options fit ONE row of the host. The strip's
 *  one-row width is read while it shows (its `scrollWidth`: the row does not
 *  wrap, so an overflowing row reports what it needs) and kept while the
 *  Select stands in for it, so the strip returns when the host is that wide
 *  again. */
const rootEl = useTemplateRef<HTMLElement>("rootEl");
const hostWidth = ref(Number.POSITIVE_INFINITY);
const stripWidth = ref(0);
const measureStrip = () => {
    const root = rootEl.value;
    if (!root) return;
    hostWidth.value = root.clientWidth;
    const strip = root.querySelector<HTMLElement>(".segmented-tabs.catalogue-filter");
    if (strip) stripWidth.value = strip.scrollWidth;
};
useResizeObserver(rootEl, measureStrip);
const filterIsStrip = computed(
    () => props.density === "stage" && wideViewport.value && stripWidth.value <= hostWidth.value,
);
const filterResponsive = computed(() => ({
    breakpoint: filterIsStrip.value ? STRIP_MIN_WIDTH : NEVER,
    ariaLabel: "Filter curves by family",
}));
// The strip's own width changes with its labels (a font landing, the groups).
watch([filterIsStrip, familyOptions], measureStrip, { flush: "post" });

/** X-DS r5 pass 5 (KF-C5-09) — THE STAGE DRAWER'S FOLD LANDS ON A ROW, the
 *  rail's rule (useFoldLanding) for the stage's one scroller. Its height was
 *  whatever the plate left, so at 1440x900 the fold ran through the Sine row's
 *  curves and balls (93 px of a 133 px tile). At rest a tile the fold would cut
 *  shows its top edge only (the drawer's `scroll-padding-block-end`, under
 *  glass's end fade: the "more below" cue), and a family heading it would cut
 *  goes under the fold whole. One `max-block-size` on the drawer, written when
 *  the host resizes or the filter changes, never per frame.
 *  X-DS r6 pass 6 (KF-C6-05) — the popover's compact grid (`density="menu"`)
 *  lands the same way: its fold ran through the Sine heading's glyphs. The
 *  popover is content-sized under its max-height, so a capped drawer shortens
 *  the menu rather than leaving a band under the fold. */
const drawerEl = useTemplateRef<{ $el: HTMLElement }>("drawerEl");
/** The drawer's rows in its own CONTENT box (scroll- and transform-free): a
 *  popover measured mid-reveal is scaled, and its client rects with it
 *  (r6 pass 6, KF-C6-05: the menu's fold was landed 15 px short that way). */
const rowsOf = (drawer: HTMLElement, selector: string) => {
    const box = drawer.getBoundingClientRect();
    const scale = drawer.offsetHeight > 0 ? box.height / drawer.offsetHeight : 1;
    const origin = box.top + drawer.clientTop * scale;
    return [...drawer.querySelectorAll<HTMLElement>(selector)].map((el) => {
        const rect = el.getBoundingClientRect();
        return {
            el,
            top: (rect.top - origin) / scale + drawer.scrollTop,
            bottom: (rect.bottom - origin) / scale + drawer.scrollTop,
        };
    });
};
/*  X-DS r6 pass 7 (KF-C7-02 · KF-C7-03) — the fold is landed by HEIGHT only in
 *  the menu, which is content-sized under its max-height. The stage drawer
 *  keeps the stage's free block: shrinking it shortened the plate below its
 *  siblings' (1440) and left the stage's free block under a cut last tile
 *  (390). It lands its rows by scroll (`landTop`). */
const landDrawer = () => {
    if (props.density !== "menu") return;
    const drawer = drawerEl.value?.$el;
    if (!(drawer instanceof HTMLElement)) return;
    drawer.style.maxBlockSize = "";
    const fold = drawer.clientHeight;
    if (fold === 0 || drawer.scrollHeight - fold <= 1) return;
    const at = drawer.scrollTop;
    const cut = rowsOf(drawer, ".catalogue-family, .specimen-tile")
        .filter((row) => row.top - at < fold && row.bottom - at > fold)
        .reduce<ReturnType<typeof rowsOf>[number] | null>(
            (first, row) => (first && first.top <= row.top ? first : row),
            null,
        );
    if (!cut) return;
    const peek = cut.el.classList.contains("specimen-tile")
        ? Number.parseFloat(getComputedStyle(drawer).scrollPaddingBlockEnd) || 0
        : 0;
    const end = Math.floor(cut.top - at + peek);
    // A port too short to hold a row whole is left as it stands.
    if (end < fold / 2) return;
    drawer.style.maxBlockSize = `${end + drawer.offsetHeight - fold}px`;
};
useResizeObserver(rootEl, landDrawer);

/** X-DS r6 pass 6 (KF-C6-04) — AND THE TOP EDGE LANDS, as the bottom does. A
 *  restored or selection-driven scroll (the browser's focus scroll, a pick
 *  made off-view) left the drawer's top fold mid-row: at 1440 the 'Bounce'
 *  heading half under the start fade, at 390 the ease-in-bounce tile cut under
 *  the divider with its heading scrolled away. On a restore, a pick or a filter
 *  change the drawer comes to rest with a FAMILY HEADING as its first row
 *  (a tile row on a one-family filter, which shows no headings), at the
 *  drawer's `scroll-padding-block-start` (the start fade's depth): the resting
 *  place nearest where it stands that keeps the selected tile wholly in view.
 *  Never on the user's own scroll. */
const landTop = () => {
    const drawer = drawerEl.value?.$el;
    if (!(drawer instanceof HTMLElement)) return;
    const port = drawer.clientHeight;
    // X-DS r6 pass 8 (KF-C8-05) — the end room this rest added last time
    // (below) is not content: the catalogue's own scroll range excludes it.
    const room = Number.parseFloat(drawer.style.getPropertyValue("--drawer-end-room")) || 0;
    const max = drawer.scrollHeight - port - room;
    if (port === 0 || max <= 1) return;
    const style = getComputedStyle(drawer);
    const padStart = Number.parseFloat(style.scrollPaddingBlockStart) || 0;
    const padEnd = Number.parseFloat(style.scrollPaddingBlockEnd) || 0;
    const headings = rowsOf(drawer, ".catalogue-family");
    const marks = headings.length > 0 ? headings : rowsOf(drawer, ".specimen-tile");
    const tile = rowsOf(drawer, '.specimen-tile[data-state="on"]')[0];
    const all = [...new Set(marks.map((row) => Math.max(0, Math.round(row.top - padStart))))];
    // The selected tile clear of the end padding where a rest allows it, else
    // merely whole (the drawer's end, which the last family's tiles reach).
    const within = (gap: number, high: number) =>
        all.filter((at) => at >= (tile ? tile.bottom + gap - port : 0) && at <= high);
    const restsUnder = (high: number) =>
        within(padEnd, high).length > 0 ? within(padEnd, high) : within(0, high);
    const now = drawer.scrollTop;
    const nearest = (rests: number[]) =>
        rests.reduce((a, b) => (Math.abs(b - now) < Math.abs(a - now) ? b : a));
    const high = Math.min(max, tile ? tile.top - padStart : max);
    let rests = restsUnder(high);
    // X-DS r6 pass 8 (KF-C8-05) — THE TOP EDGE IS A FAMILY BOUNDARY, at the
    // catalogue's end too. Where no heading the drawer can scroll to keeps the
    // selected tile whole (a short port: after 'steps' at 1440 the port could
    // not reach the Back heading, so the pick rested at the end with the Circ
    // row cut through its curves under the family tabs), the drawer gains the
    // missing scroll as end room under its last row (in glass's end fade), and
    // rests on that heading. The room goes when a rest no longer needs it.
    // X-DS r6 pass 9 (KF-C9-03) — THE ROOM IS AT MOST ONE GAP. End room is
    // painted plate: after 'steps' at 1440 it was 71 px, and with the end
    // padding it left ~115 px of empty card under the last row exactly when
    // the last family is picked. A heading rest that needs more than the
    // catalogue's own section gap is not taken; the drawer rests at its end
    // (the last row whole, the plate ending one gap under it) and the top
    // fold runs under glass's start fade.
    const group = drawer.querySelector<HTMLElement>(".specimen-grid-group");
    const gap = group ? Number.parseFloat(getComputedStyle(group).rowGap) || 0 : 0;
    let need = 0;
    if (rests.length === 0 && headings.length > 0 && tile) {
        const beyond = restsUnder(tile.top - padStart);
        if (beyond.length > 0) {
            const rest = nearest(beyond);
            const extra = Math.max(0, Math.ceil(rest - max));
            if (extra <= gap) {
                rests = [rest];
                need = extra;
            } else {
                rests = [max];
            }
        }
    }
    if (need !== room) drawer.style.setProperty("--drawer-end-room", `${need}px`);
    if (rests.length === 0) return;
    let at = nearest(rests);
    // X-DS r6 pass 7 (KF-C7-02) — AND THE BOTTOM EDGE LANDS: a rest that
    // leaves less than one row of scroll cuts the drawer's last row at the
    // fold (steps-end 69 of 107 px, 54 px of scroll left, at 390). The drawer
    // then rests at its end, where the last row is whole, provided the
    // selected tile stays whole too (`high`).
    // X-DS r6 pass 8 (KF-C8-05) — but never at the price of the TOP edge: the
    // end rest is taken only where the port's top line crosses no row.
    // Otherwise the heading rest stands, and the last row's fold runs under
    // glass's end fade (the "more below" cue).
    const row = Math.min(...marks.map((m) => m.bottom - m.top).filter((h) => h > 0));
    const clearAt = (top: number) =>
        !rowsOf(drawer, ".catalogue-family, .specimen-tile").some(
            (r) => r.top < top - 1 && r.bottom > top + 1,
        );
    if (need === 0 && max - at < row && max <= high + padStart && clearAt(max)) at = max;
    if (Math.abs(at - now) <= 1) return;
    drawer.scrollTop = at;
};
// The tiles are `content-visibility: auto` (a 132 px placeholder until first
// rendered): a tile a pick or a focus scroll brings on screen renders at its
// real size a few frames later, and the rows move with it. The top lands once
// the drawer's content height has held for two frames (at most half a second).
const landTopSettled = () => {
    let last = -1;
    let held = 0;
    let frames = 0;
    const tick = () => {
        const drawer = drawerEl.value?.$el;
        if (!(drawer instanceof HTMLElement)) return;
        held = drawer.scrollHeight === last ? held + 1 : 0;
        last = drawer.scrollHeight;
        if (held >= 2 || ++frames > 30) landTop();
        else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
};
// KF-C8-05 — end room is sized against the port it was measured in; the
// port changes height after a pick (the header's name swaps out-in, and its
// literal line with it), so a rest that holds end room is re-landed when the
// drawer resizes. A rest without end room is never moved by a resize.
useResizeObserver(
    () => drawerEl.value?.$el as HTMLElement | undefined,
    () => {
        const drawer = drawerEl.value?.$el;
        if (!(drawer instanceof HTMLElement)) return;
        if ((Number.parseFloat(drawer.style.getPropertyValue("--drawer-end-room")) || 0) > 0) landTop();
    },
);
const landDrawerEdges = () => {
    landDrawer();
    landTopSettled();
};

onMounted(() => {
    measureStrip();
    landDrawerEdges();
    void document.fonts?.ready.then(() => {
        measureStrip();
        landDrawerEdges();
    });
});
const onFamilyChange = (v: string) => {
    family.value = v;
};
const visibleGroups = computed(() =>
    family.value === ALL
        ? props.groups
        : props.groups.filter((g) => g.family === family.value),
);
// The drawer's rows change with the filter (and its own top with the strip).
watch([visibleGroups, filterIsStrip], landDrawerEdges, { flush: "post" });
watch(() => props.modelValue, landTopSettled, { flush: "post" });

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

/* ── 1 · the family filter: glass's underline strip, one row ── */
/* The options keep their own widths (glass's underline is a flex row) and the
   row never wraps: where ten do not fit, the filter is glass's Select
   (`filterIsStrip`, measured). KF-C4-01 — the labels read glass's own type
   token one rung down: the strip sets its options at `--type-subheading`, the
   family headings' rung, and a filter sits under the headings it filters. */
.catalogue-filter {
    flex: none;
    max-width: 100%;
    --type-subheading: var(--type-small);
}

/* X-DS r5 pass 5 (KF-C5-09) — how much of a tile shows under the fold at rest:
   its top edge and corners, inside glass's 1rem end fade (`landDrawer`). It is
   also the room a focused tile scrolled into view keeps from the fold. */
.specimen-drawer {
    scroll-padding-block-end: 0.75rem;
    /* X-DS r6 pass 6 (KF-C6-04) — where the first row rests after a restore
       or a pick (`landTop`): under the start fade (glass's 1rem), not in it. */
    scroll-padding-block-start: 1rem;
    /* X-DS r6 pass 8 (KF-C8-05) — and the user's own scroll comes to rest the
       same way: a family heading is a snap position (proximity, so a long
       family still scrolls freely), at the same 1rem `landTop` lands on. */
    scroll-snap-type: y proximity;
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
    /* KF-C8-05 — the end room `landTop` writes when a family heading could
       not otherwise reach the top (0 at every other rest). */
    padding-block-end: calc(1rem + var(--drawer-end-room, 0px));
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
    /* KF-C8-05 — the drawer's snap position (see `.specimen-drawer`). */
    scroll-snap-align: start;
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
.tile-note {
    text-align: center;
    line-height: 1.2;
    padding-bottom: 0.25rem;
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
