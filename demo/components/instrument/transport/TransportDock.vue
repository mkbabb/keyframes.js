<template>
    <div
        ref="menubarHostEl"
        :data-dock-tether="contained ? undefined : 'bottom'"
        :class="[
            'px-2 py-1.5 m-0 flex items-center justify-center justify-items-center pointer-events-none',
            contained ? 'transport-contained' : 'menubar-safe-pb fixed left-0 right-0 z-dock',
        ]"
        :style="contained ? undefined : 'bottom: var(--dock-bottom-anchor, var(--work-area-bottom-offset, 0px));'"
    >
        <!-- `contained` (an embed slice): the band sits in its host's flow at
             the slice's foot instead of fixed to the viewport, and publishes
             no menubar measure (nothing in an embed anchors on it). -->
        <!--
            The transport rides GlassDock's own collapse: Play is the dock's
            one `#persistent` control (both faces; X.KF.W13W.d) and the rest
            expands on hover/focus. Play actuates through `usePlayActuation`
            (pointerup on the same control / Space on keyup, Enter on keydown —
            never the synthesised `click` the collapse crossfade can strand);
            the actuation and cancellation law is that composable's docblock.
            Collapsing shrinks the host, so `useMenubarMeasure` republishes the
            smaller --menubar-measured-h and the mobile sheet anchor follows.
            KFA-166 (X.KF.W13X.transport) — the boot posture is SETTLED with
            kf-ChromeDock's RR-1 M#4 batch: `collapse="closed"`, the posture
            ChromeDock mounts in. The former `collapse="open"` (TD-5) mounted
            expanded and never idled until a first hover — served expanded
            after 10 s with no interaction — because the producer's idle
            window arms on a pointer leave. Closed, the transport rests on the
            persistent Play and expands on hover/focus like its sibling.
        -->
        <!-- TD-36: the host is a full-bleed band; only the pill takes the
             pointer (the ChromeDock pair — pointer-events-none host,
             pointer-events-auto child), so the band outside it never
             swallows a press meant for the stage beneath. -->
        <div class="pointer-events-auto dock-vt-group" data-dock-swap="transport-dock">
            <!-- An upright phone's transport is the page's one bottom dock: it
                 never folds (Play, the scene's choices and Controls stay in
                 view), and its Controls seat opens the sheet. -->
            <GlassDock ref="dockRef" :collapse="phoneDock ? false : 'closed'" :fit-content="true">
                <!-- Expanded state: full controls.
                     T.C1 — THE TRANSPORT RECUT (rail-core | section | nav on glass-ui
                     DockSeparator). PLAY LEADS as rail-core, drawn FIRST from the
                     ordered T.B10 action model (`actions.primary.kind === "play"`, the
                     data-layer order truth — VERDICT #6). The animation select is the
                     contextual section (≥2 channels only — the channelZone elision).
                     Reset trails as the nav utility.
                     "Clear all & reload" LEFT the transport for the @mbabb settings menu
                     (T.C2 — a destructive storage reset is a settings action, not
                     transport chrome). Separators derive from INHABITED zones (zero
                     hand-rolled dock-separator divs). Tooltips are the single visible
                     renderer (Tooltip primitives); the accessible name rides aria-label — every
                     `title=` passthrough is GONE (T.C3, the double-tooltip KILL). -->
                <!-- X.KF.W13W.d · OA-57 (COHESION §0cq) — PLAY IS PERSISTENT: ONE control,
                     glass's `#persistent` seat, in-flow on BOTH faces, never inert,
                     never a crossfade pane. The collapsed face used to hand-duplicate
                     Play plus the animation name into `#collapsed`, whose summary seat
                     the producer necks to one circle (`.dock-layer--summary`:
                     `aspect-ratio: 1` at `--dock-collapsed-summary-min-size`): at
                     1440 the collapsed plate measured 56 px while the two seats ran
                     132 px, so both spilled 38 px out of the plate on every idle
                     collapse. `#persistent` is the producer's own seam for "keep a
                     control visible while collapsed WITHOUT hand-duplicating it into
                     both the #default and #collapsed slots" (GlassDock.vue docblock);
                     with `#collapsed` unauthored the summary is `:empty` and the
                     plate centres the persistent Play (`morph.css`). The name lives
                     on the expanded face (the channel Select, >=2 channels; a lone
                     animation is the scene identity, T.B5-RENDER), as the ChromeDock's
                     icon-forward collapsed face already rules. A multi-seat collapsed
                     plate is O-65's (DOCK-COLLAPSED-FORM), relay only.
                     TD-37 holds by structure: play leads on both faces because it is
                     the same element, and TD-39's one stable name is one control. -->
                <template #persistent>
                <!-- rail-core: PLAY, FIRST (actions.primary) -->
                <!-- X.KF.W13X.r4transport · UIA-KF-052 (consumer half) — Play is a
                     DockControl like its Reset sibling: the producer's icon cell
                     owns the size, the radius role and the press, so the
                     literal radius, the fixed 40 px box and the bespoke hover
                     scale are gone. The rainbow fill is the scene's identity
                     colour (kept, §0dm); a DockControl accent tone is the glass
                     half (O-59). -->
                <Tooltip :disabled="!dockTip">
                    <TooltipTrigger as-child>
                        <DockControl
                            shape="icon"
                            :aria-label="isPlaying ? 'Pause animation' : 'Play animation'"
                            :class="[PLAY_FILL.ink, isPlaying ? PLAY_FILL.playing : PLAY_FILL.rest]"
                            @pointerdown="onPlayPointerDown($event)"
                            @pointerup="onPlayPointerUp($event)"
                            @pointercancel="onPlayPointerCancel($event)"
                            @keydown="onPlayKeydown($event)"
                            @keyup="onPlayKeyup($event)"
                            @blur="onPlayBlur($event)"
                        >
                            <Pause v-if="isPlaying" class="icon-lg" />
                            <Play v-else class="icon-lg translate-x-px" />
                        </DockControl>
                    </TooltipTrigger>
                    <TooltipContent>{{ isPlaying ? "Pause" : "Play" }}</TooltipContent>
                </Tooltip>
                </template>

                <div class="transport-row flex items-center">
                    <!-- An upright phone's dock carries the playhead: the one
                         scrub on the page, beside Play (the pane's own time row
                         is not drawn there). Home keeps Play alone. -->
                    <TransportScrub
                        v-if="phoneDock && !startScreen && getScrubT && scrubTo"
                        :get-t="getScrubT"
                        :scrub="scrubTo"
                        :is-playing="isPlaying"
                        @scrub-start="emit('scrubStart')"
                        @scrub-end="emit('scrubEnd')"
                    />
                    <!-- section (contextual): the animation select. Rendered ONLY when
                         channelZone is INHABITED (≥2 channels — kind "select"). One or
                         zero channels ⇒ zone ABSENT: NO node and NO flanking separator
                         (T.B5-RENDER — the single-animation static NAME span is DELETED;
                         a lone animation is the scene identity, transported without a
                         dead 1-item dropdown or a demoted label). -->
                    <!-- On an upright phone with a controls sheet, the channel
                         select and Reset are rows of the opened sheet: a fifth
                         seat would take the scrub under 150 px. An upright
                         phone's Home keeps Play alone (the dock never folds
                         there, so nothing would hide the select). -->
                    <template v-if="channelZoneKind === 'select' && !sheetHoldsExtras && !phoneHome">
                        <DockSeparator />
                        <!-- X.KF.W13X.transport — the channel Select, bare on the dock:
                             (UIA-KF-257) no Tooltip and no wrapper div — the trigger
                             already shows its value and chevron, and the aria-label
                             names it; (UIA-KF-256) no `dock-label` on the trigger —
                             DockTrigger owns its face and text rung; (KFA-54) its open
                             state HOLDS the dock (keepOpen/release, as ChromeDock's
                             Selects do — hold only, never expand); (UIA-KF-152) the
                             list opens ABOVE the bottom dock, offset clear of its
                             top edge.
                             X.KF.W13X.r4dock · UIA-KF-159 — the name says what the
                             Select does: it picks the channel the controls pane
                             edits (selecting is not playing, KFA-104; Play runs
                             the whole group), so it is "Channel to edit", not
                             "Select animation", which read as isolating playback. -->
                        <Select
                            v-model:open="channelSelectOpen"
                            class="p-0 m-0 cursor-pointer"
                            :model-value="storedControls.selectedAnimation ?? ''"
                            @update:model-value="
                                (key) => {
                                    emit('selectAnimation', String(key));
                                }
                            "
                        >
                            <DockTrigger ref="channelTrigger" for="select" aria-label="Channel to edit">
                                <!-- The empty-state leading glyph — rendered
                                     directly, not via reka's SelectIcon slot
                                     (the one headless reach past the glass-ui
                                     surface; DockSelectTrigger owns the trigger
                                     + its chevron, GG-6). -->
                                <List v-if="!storedControls.selectedAnimation" />
                                <SelectValue class="text-ellipsis">{{
                                    storedControls.selectedAnimation
                                }}</SelectValue>
                            </DockTrigger>
                            <SelectContent
                                side="top"
                                :side-offset="channelListOffset"
                                class="min-w-[var(--dropdown-min-width)]"
                            >
                                <!-- UIA-KF-151 · KFA-167 · UIA-KF-108 · UIA-KF-261 — the
                                     rows carry the channel NAME only. The per-row
                                     status dot / progress ring read the GROUP's one
                                     clock (identical on every row, 'warning' for
                                     paused) and the bold was a second selection
                                     channel: all deleted. The glass SelectItem's own
                                     indicator marks the selection (no longer hidden);
                                     the transport's Play already shows the play state. -->
                                <!-- X.KF.W13X.r4transport · UIA-KF-122 — the list
                                     takes glass's menu type rung and row padding:
                                     no dock label scale on the group and no
                                     padding override on the rows. -->
                                <SelectGroup>
                                    <SelectItem
                                        v-for="name in animationNames"
                                        :key="name"
                                        :value="name"
                                    >
                                        {{ name }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </template>

                    <!-- nav: reset. UIA-KF-153 / UIA-KF-283 (X.KF.W13X.transport) — the
                         timeline Collapse chip and its inert 'Timeline' label are
                         DELETED from the transport: they were the third
                         collapse-timeline control, and the chip's home was always
                         the timeline pane it controls, whose own header Collapse
                         is the one control (one affordance per verb).
                         X.KF.W13X.r4transport · UIA-KF-229 — not on the home start
                         screen: its group is empty, so Reset has nothing to rewind
                         (CLUTTER lens). The channel list stays there: the pick is
                         carried into the scene Play opens (carryHomePick), which
                         is what the start screen's copy asks for. -->
                    <template v-if="!startScreen && !sheetHoldsExtras">
                    <DockSeparator />
                    <Tooltip :disabled="!dockTip">
                        <TooltipTrigger as-child>
                            <DockControl shape="icon" aria-label="Reset animation" @click="() => { resetIconSpin(); emit('reset', false); }">
                                <span ref="resetIconEl" class="inline-flex">
                                    <SkipBack class="icon-lg" />
                                </span>
                            </DockControl>
                        </TooltipTrigger>
                        <TooltipContent>Reset animation</TooltipContent>
                    </Tooltip>
                    </template>

                    <!-- The phone's Controls seat: it opens and closes the
                         controls sheet (on a desk the pane is a rail, opened
                         from the top dock). It wears the sheet's own glyph, a
                         panel at the foot: the sliders glyph is the Controls
                         surface's, which the top dock's surfaces seat shows.
                         A hand or the focus reaching for it warms the pane
                         (`warmControls`): the pane mounts, unseen, ahead of
                         the press. -->
                    <template v-if="phoneDock && controlsSeat">
                        <DockSeparator />
                        <Tooltip :disabled="!dockTip">
                            <TooltipTrigger as-child>
                                <DockControl
                                    shape="icon"
                                    aria-label="Controls"
                                    :aria-expanded="storedControls.isControlsPanelOpen === true"
                                    data-controls-seat
                                    @pointerenter="emit('warmControls')"
                                    @pointerdown="emit('warmControls')"
                                    @focusin="emit('warmControls')"
                                    @click="emit('toggleControls')"
                                >
                                    <PanelBottom class="icon-lg" />
                                </DockControl>
                            </TooltipTrigger>
                            <TooltipContent>Controls</TooltipContent>
                        </Tooltip>
                    </template>
                </div>

            </GlassDock>
        </div>
    </div>
</template>

<script setup lang="ts">
import "@styles/dock-swap.css";
import { useDockTip } from "@composables/useDockTip";
import { computed, ref, useTemplateRef, watch } from "vue";

import {
    List,
    PanelBottom,
    Pause,
    Play,
} from "@lucide/vue";
import { useMediaQuery } from "@vueuse/core";

import { DockControl, DockSeparator } from "@mkbabb/glass-ui/dock";
import { DockTrigger } from "@mkbabb/glass-ui/dock-trigger";
// T.C1 — the channel-elision RENDER consumes the cardinality model. The
// authoritative model is T.B5's DFA projection (lane 1); until it lands in-tree
// this consumes T.B5's DFA projection (dockCardinality — ONE count authority).
import { dockCardinality } from "@state/controlSurfaces";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectValue,
} from "@mkbabb/glass-ui";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui/tooltip";

import { SkipBack } from "@lucide/vue";

import { GlassDock } from "@mkbabb/glass-ui/dock";
import { DOCK_POPUP_GAP } from "@composables/dockEdge";
import { usePlayActuation } from "./composables/usePlayActuation";
import { useMenubarMeasure } from "./composables/useMenubarMeasure";
import { useIconSpin } from "./composables/useIconSpin";
import { PLAY_FILL } from "./playFill";
import TransportScrub from "./TransportScrub.vue";
import type { StoredAnimationGroupControlOptions } from "@state";

/** The seats' tooltips open for a hovering pointer only, never on a tap (K-4). */
const dockTip = useDockTip();

const dockRef = useTemplateRef<InstanceType<typeof GlassDock>>("dockRef");

// The menubar host's REAL border-box height is published as
// `--menubar-measured-h` (+ a monotonic `-peak`) on :root so the mobile sheet
// anchor and the stage's band reserve clear the menubar the user sees (CH-3 /
// S1); the mechanism and its cycle-freedom are `useMenubarMeasure`'s docblock.
// The SFC owns the typed template ref and hands it in (TD-17).
const menubarHostEl = useTemplateRef<HTMLElement>("menubarHostEl");

// The play toggle never listens for the synthesised `click` (the dock's
// collapse crossfade can strand it — DM-1); it actuates from `usePlayActuation`'s
// modality-pure sources, whose contract and cancellation law live there.
function actuatePlay() {
    // `expand()` keeps the toggle legible after actuation (it resolves the dock
    // to "hover", not "pinned" — TD-22's consumer-site inversion is one cure
    // spec with kf-ChromeDock's row and is not re-worded here); the emit is the
    // load-bearing line.
    dockRef.value?.expand();
    emit("togglePlay");
}

const {
    onPlayPointerDown,
    onPlayPointerUp,
    onPlayPointerCancel,
    onPlayKeydown,
    onPlayKeyup,
    onPlayBlur,
} = usePlayActuation(actuatePlay);

const {
    storedControls,
    isPlaying,
    animationNames,
    startScreen = false,
    contained = false,
    controlsSeat = false,
    getScrubT,
    scrubTo,
} = defineProps<{
    storedControls: StoredAnimationGroupControlOptions;
    isPlaying: boolean;
    animationNames: string[];
    /** The home start screen: no Reset there (UIA-KF-229). */
    startScreen?: boolean;
    /** In its host's flow (an embed slice's foot), not fixed to the viewport. */
    contained?: boolean;
    /** The scene has a controls pane: on an upright phone the dock offers the
     *  seat that opens it. */
    controlsSeat?: boolean;
    /** The selected channel's playhead in [0, 1], and the seat for it: the
     *  upright phone's dock scrub reads and writes through these. */
    getScrubT?: () => number;
    scrubTo?: (fraction: number) => void;
}>();

/** An upright phone (under the desk's 1024 px, over a landscape phone's
 *  500 px height): the transport is the one bottom dock and never folds. */
const uprightPhone = useMediaQuery("(max-width: 1023px) and (min-height: 501px)");
const phoneDock = computed(() => !contained && uprightPhone.value);
/** The opened sheet holds the channel select and Reset on an upright phone. */
const sheetHoldsExtras = computed(() => phoneDock.value && controlsSeat);
/** Home on an upright phone: the dock holds Play alone. */
const phoneHome = computed(() => phoneDock.value && startScreen);

if (!contained) useMenubarMeasure(menubarHostEl);

const emit = defineEmits<{
    (e: "togglePlay"): void;
    (e: "reset", all: boolean): void;
    (e: "selectAnimation", name: string): void;
    (e: "toggleControls"): void;
    /** A hand or the focus reaches for the Controls seat, ahead of its press. */
    (e: "warmControls"): void;
    (e: "scrubStart"): void;
    (e: "scrubEnd"): void;
}>();

// T.C1 / T.B5-RENDER — the channel zone: `>1 channels ⇒ select`, else ABSENT
// (the animation `<Select>` renders only for kind "select"; a lone/zero animation
// renders no node + no flanking separator, the elision). The count IS the guard
// the U4/no-single-option-select gate keys on (bound to `.length > 1`).
const channelZoneKind = computed(
    () => dockCardinality({ tabs: [], channels: animationNames }).channelZone.kind,
);

// KFA-54 — an open channel Select holds the transport and does nothing else,
// the same RR-2 MISSED #1 law ChromeDock keeps for its Selects: without the
// hold the dock idle-collapsed ~5.7 s under an open list, which then jumped
// ~107 px and floated over a collapsed pill. Hold only — never `expand()`
// (it would demote a pin to a timed hover).
const channelSelectOpen = ref(false);
watch(channelSelectOpen, (open) => {
    if (open) dockRef.value?.keepOpen();
    else dockRef.value?.release();
});

// UIA-KF-152 — the list opens ABOVE this bottom dock, and its offset clears
// the dock's own top edge, not merely the trigger's: the trigger sits inside
// the plate's block padding, so an offset from the trigger alone laid the
// list's rim 4-10 px over the dock's (served 769 over 764.6 at 1440, 732.5
// over 722.6 at 390). The mirror of ChromeDock's `useDockEdgeOffset`
// (dockEdge.ts, the top dock's bottom edge) for the bottom dock's top edge,
// measured when the list opens; the plate is the GlassDock's own root through
// its component ref (no producer selector). The producer half — floating
// content inside a dock offsets from the dock edge by itself — is O-59.
const channelTrigger = useTemplateRef<{ $el: HTMLElement }>("channelTrigger");
const channelListOffset = ref(DOCK_POPUP_GAP);
watch(
    channelSelectOpen,
    (open) => {
        if (!open) return;
        const trigger = channelTrigger.value?.$el;
        const plate = (dockRef.value?.$el as HTMLElement | undefined) ?? null;
        const inset =
            trigger && plate
                ? trigger.getBoundingClientRect().top - plate.getBoundingClientRect().top
                : 0;
        channelListOffset.value = Math.max(0, inset) + DOCK_POPUP_GAP;
    },
    { flush: "sync" },
);

// The glyph host is an HTMLElement (the engine target contract); the SFC owns
// the typed ref and hands it to the composable (TD-17).
const resetIconEl = useTemplateRef<HTMLElement>("resetIconEl");
const { resetIconSpin } = useIconSpin(resetIconEl);

// T.C2 — "Clear all & reload" (the trash icon + its shake, `emit('reset', true)`)
// MOVED OUT of the transport into the @mbabb settings menu (a destructive storage
// reset is a settings action, not transport chrome). The trashShakeAnim +
// trashIconShake are removed with it.

defineExpose({ resetIconSpin });
</script>

<style scoped>
/* KFA-77 · FORTY-SIXTH A (K-1) — the transport crosses a page change as ONE
   dock, as ChromeDock does (its note; @styles/dock-swap.css holds the look):
   its own group while a transition runs, and each seat a group of its own, so
   Home's Play glides to its place at the head of the cube's transport while the
   plate's capsule grows from the circle to the bar. The seats are the persistent
   Play and the row's members (the row itself changes width, so it is not one).
   While glass opens the folded transport (the press's own hover or tap, as
   the page changes), the row's members are not groups (glass's morph clips
   them) and the dock-swap look draws the dock live; Play, outside that clip,
   still glides from the circle's centre to the bar's head. */
:root:active-view-transition .dock-vt-group {
    view-transition-name: transport-dock;
    view-transition-class: gl-list-item kf-dock;
}
:root:active-view-transition .dock-vt-group :deep(.glass-dock .dock-persistent > *),
:root:active-view-transition .dock-vt-group :deep(.glass-dock:not([data-morphing]) .dock-layer.is-active > .transport-row > *) {
    view-transition-name: match-element;
    view-transition-class: gl-list-item kf-dock-seat;
}

/* TD-35 — the transport's internal rhythm rides the ONE gutter token every
   producer dock control rides (`--dock-layer-gap` scales with --dock-scale), so
   the row grows with its siblings on coarse pointers instead of a fixed 12px. */
.transport-row {
    gap: var(--dock-layer-gap, 0.375rem);
}

/* ── Bottom-menubar safe-area padding (D.W3.S3) ──
   Reserves the iOS home-indicator inset below the dock. Was the arbitrary
   Tailwind value `pb-[max(calc(var(--dock-margin)/2),env(safe-area-inset-bottom))]`
   with NO fallback inside env() — on a browser without env() support the whole
   max() collapsed. Now:
     • the env() carries a 0px fallback (so a browser that parses env() but has
       no inset still resolves the max() to the dock-margin baseline), and
     • an @supports-not path supplies the dock-margin baseline directly for
       browsers that do not understand env(safe-area-inset-bottom) at all.
   Happy path (modern Safari/Chrome with a notch) is byte-identical. */
.transport-contained {
    position: relative;
    z-index: 1;
}

/* An upright phone: the plate's group lays the dock out as a flex item, so no
   line box leaves a strip under the plate (it stood 6 px over the group's
   foot) and the plate itself sits 12 px above the screen's foot. */
@media (max-width: 1023px) and (min-height: 501px) {
    .dock-vt-group {
        display: flex;
    }
}

.menubar-safe-pb {
    padding-bottom: max(
        calc(var(--dock-margin) / 2),
        env(safe-area-inset-bottom, 0px)
    );
}
@supports not (padding: env(safe-area-inset-bottom)) {
    .menubar-safe-pb {
        padding-bottom: calc(var(--dock-margin) / 2);
    }
}
</style>
