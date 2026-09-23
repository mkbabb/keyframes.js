<template>
    <div
        ref="menubarHostEl"
        data-dock-tether="bottom"
        :class="[
            'menubar-safe-pb px-2 py-1.5 m-0 flex items-center justify-center justify-items-center',
            'fixed left-0 right-0 z-dock pointer-events-none',
        ]"
        style="bottom: var(--dock-bottom-anchor, var(--work-area-bottom-offset, 0px));"
    >
        <!--
            The transport rides GlassDock's own collapse: a summary pill (the
            selected name + the play mirror, #collapsed) that expands on
            hover/focus. Both play controls actuate through `usePlayActuation`
            (pointerup on the same control / Space on keyup, Enter on keydown —
            never the synthesised `click` the collapse crossfade can strand);
            the actuation and cancellation law is that composable's docblock.
            Collapsing shrinks the host, so `useMenubarMeasure` republishes the
            smaller --menubar-measured-h and the mobile sheet anchor follows.
            The transport mounts EXPANDED and may collapse (TD-5): since glass
            9.0.0 that posture is `collapse="open"` (the former
            `:always-expanded="false"` with `startCollapsed` defaulted off);
            the boot posture batches with kf-ChromeDock RR-1 M#4 and is not
            re-tuned here.
        -->
        <!-- TD-36: the host is a full-bleed band; only the pill takes the
             pointer (the ChromeDock pair — pointer-events-none host,
             pointer-events-auto child), so the band outside it never
             swallows a press meant for the stage beneath. -->
        <div class="pointer-events-auto">
            <GlassDock ref="dockRef" collapse="open" :fit-content="true">
                <!-- Expanded state: full controls.
                     T.C1 — THE TRANSPORT RECUT (rail-core | section | nav on glass-ui
                     DockSeparator). PLAY LEADS as rail-core, drawn FIRST from the
                     ordered T.B10 action model (`actions.primary.kind === "play"`, the
                     data-layer order truth — VERDICT #6). The animation select is the
                     contextual section (≥2 channels only — the channelZone elision).
                     Reset + the timeline-collapse chip trail as one nav utility group.
                     "Clear all & reload" LEFT the transport for the @mbabb settings menu
                     (T.C2 — a destructive storage reset is a settings action, not
                     transport chrome). Separators derive from INHABITED zones (zero
                     hand-rolled dock-separator divs). Tooltips are the single visible
                     renderer (Tooltip primitives); the accessible name rides aria-label — every
                     `title=` passthrough is GONE (T.C3, the double-tooltip KILL). -->
                <div class="transport-row flex items-center">
                    <!-- rail-core: PLAY, FIRST (actions.primary) -->
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button
                                emphasis="quiet"
                                :aria-label="isPlaying ? 'Pause animation' : 'Play animation'"
                                :class="[
                                    'scale-on-hover icon-lg text-white rounded-full p-0',
                                    'w-10 h-10 shrink-0',
                                    isPlaying ? 'rainbow-vivid' : 'rainbow-pastel',
                                ]"
                                @pointerdown="onPlayPointerDown($event)"
                                @pointerup="onPlayPointerUp($event)"
                                @pointercancel="onPlayPointerCancel($event)"
                                @keydown="onPlayKeydown($event)"
                                @keyup="onPlayKeyup($event)"
                                @blur="onPlayBlur($event)"
                            >
                                <Pause v-if="isPlaying" class="icon-lg" />
                                <Play v-else class="icon-lg translate-x-px" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{{ isPlaying ? "Pause" : "Play" }}</TooltipContent>
                    </Tooltip>

                    <!-- section (contextual): the animation select. Rendered ONLY when
                         channelZone is INHABITED (≥2 channels — kind "select"). One or
                         zero channels ⇒ zone ABSENT: NO node and NO flanking separator
                         (T.B5-RENDER — the single-animation static NAME span is DELETED;
                         a lone animation is the scene identity, transported without a
                         dead 1-item dropdown or a demoted label). -->
                    <template v-if="channelZoneKind === 'select'">
                        <DockSeparator />
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <div class="relative flex items-center gap-1.5">
                                <Select
                                    class="p-0 m-0 cursor-pointer"
                                    :model-value="storedControls.selectedAnimation ?? ''"
                                    @update:model-value="
                                        (key) => {
                                            emit('selectAnimation', String(key));
                                        }
                                    "
                                >
                                    <DockTrigger
                                        for="select"
                                        aria-label="Select animation"
                                        class="dock-label"
                                    >
                                        <!-- The empty-state leading glyph — rendered
                                             directly, not via reka's SelectIcon slot
                                             (the one headless reach past the glass-ui
                                             surface; DockSelectTrigger owns the trigger
                                             + its chevron, GG-6). -->
                                        <List
                                            v-if="!storedControls.selectedAnimation"
                                        />
                                        <SelectValue class="text-ellipsis">{{
                                            storedControls.selectedAnimation
                                        }}</SelectValue>
                                    </DockTrigger>
                                    <SelectContent class="min-w-[var(--dropdown-min-width)]">
                                        <SelectGroup class="dock-label">
                                            <template v-for="name in animationNames" :key="name">
                                                <SelectItem class="py-2 px-3" hide-indicator :value="name">
                                                    <span class="flex items-center gap-2">
                                                        <!-- Playing: live conic-gradient progress ring driven by --dot-p.
                                                             Idle/paused: discrete glass-ui StatusDot state colour. -->
                                                        <span
                                                            v-if="isPlaying"
                                                            class="progress-dot w-2.5 h-2.5"
                                                            :style="dotStyle(name)"
                                                        ></span>
                                                        <StatusDot
                                                            v-else
                                                            size="md"
                                                            :state="isStarted ? 'warning' : 'unknown'"
                                                        />
                                                        <span :class="storedControls.selectedAnimation === name ? 'font-bold' : ''">{{ name }}</span>
                                                    </span>
                                                </SelectItem>
                                            </template>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>Select animation</TooltipContent>
                        </Tooltip>
                    </template>

                    <!-- nav: reset (+ the timeline-collapse chip when the timeline pane
                         is expanded — one utility group, no internal separator). The
                         timeline chip's ultimate home is the timeline pane it controls
                         (T.C1 → T.B/T.F edge owner); it rides nav here until that lands. -->
                    <DockSeparator />
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <DockControl shape="icon" aria-label="Reset animation" @click="() => { resetIconSpin(); emit('reset', false); }">
                                <span ref="resetIconEl" class="inline-flex">
                                    <RotateCcw class="icon-lg" />
                                </span>
                            </DockControl>
                        </TooltipTrigger>
                        <TooltipContent>Reset animation</TooltipContent>
                    </Tooltip>

                    <template v-if="storedControls.isTimelineExpanded">
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <DockControl shape="icon" aria-label="Collapse timeline" @click="emit('expandTimeline', false)">
                                    <Minimize2 class="icon-lg" />
                                </DockControl>
                            </TooltipTrigger>
                            <TooltipContent>Collapse timeline</TooltipContent>
                        </Tooltip>

                        <span class="dock-label whitespace-nowrap">Timeline</span>
                    </template>
                </div>

                <!-- Collapsed state: PLAY FIRST, then the animation name.
                     X.KF.W13.e · TD-37 under OP-7 (COHESION §0ai) — ONE FACE ORDER:
                     play leads on BOTH faces. The two faces are concentric (GlassDock
                     stacks them, `layers.css` `.dock-layer { grid-area: 1/1 }`), so the
                     pre-cure `[name][play]` collapsed order translated the primary CTA
                     across the pill on every hover-expand and every 3600 ms idle
                     collapse — out from under the reaching pointer. With play leading
                     here as it does at `:39-59`, the CTA holds its end through the
                     crossfade.
                     TD-21's r2 shared-Set rider rides this order change (same identity,
                     same family): the end-swap was what made the in-place release land
                     on NEITHER control and leak a persistent mouse press-origin. Play
                     co-located on both faces makes that release land on the OTHER play
                     mirror, where `usePlayActuation`'s per-control origin guard
                     (`:81-89`, landed X.KF.W13.b `dafce6eb`) consumes and clears the
                     entry without actuating — and the window release-elsewhere cleanup
                     (`:62-73`) still covers the off-control case. No stale id survives
                     either path. -->
                <!-- X.KF.W13.b · THE PROPAGATION POLICY (TD-2 + TD-38 + TD-40, stated
                     once, here — the only place a stop modifier ever lived): neither
                     play mirror stops propagation. The dock's pointer/click listeners
                     are capture-phase (a stop modifier on the button never reached
                     them — the three pointer stops this mirror carried were inert);
                     the window Space shortcut is scoped away from activation targets
                     at the registry seat (useControlsKeyboardShortcuts.ts), so no
                     keyboard stop is load-bearing; and what a press does to the dock
                     is the dock's own declared meaning of that press plus
                     `actuatePlay()`'s explicit `expand()` — never an accidental
                     stop. Symmetry is the invariant: zero stop modifiers on both
                     faces, as on the sibling ChromeDock. Census + grounds: value.js
                     docs/tranches/X/keyframes/evidence/W13/b-td-remainder-derivation.md §4. -->
                <template #collapsed>
                    <!-- The collapsed play mirror carries the SAME accessible name
                         as the expanded Play (TD-39): exactly one dock layer is ever
                         in the accessibility tree (the other is `inert`), so it is
                         one logical command, not two identically-named controls —
                         the name must not mutate with transient chrome state. -->
                    <Button
                        emphasis="quiet"
                        :aria-label="isPlaying ? 'Pause animation' : 'Play animation'"
                        :class="[
                            'scale-on-hover text-white rounded-full p-0',
                            'w-8 h-8 shrink-0',
                            isPlaying ? 'rainbow-vivid' : 'rainbow-pastel',
                        ]"
                        @pointerdown="onPlayPointerDown($event)"
                        @pointerup="onPlayPointerUp($event)"
                        @pointercancel="onPlayPointerCancel($event)"
                        @keydown="onPlayKeydown($event)"
                        @keyup="onPlayKeyup($event)"
                        @blur="onPlayBlur($event)"
                    >
                        <Pause v-if="isPlaying" class="icon-md" />
                        <Play v-else class="icon-md translate-x-px" />
                    </Button>
                    <span v-if="storedControls.selectedAnimation" class="dock-label text-foreground whitespace-nowrap font-semibold">
                        {{ storedControls.selectedAnimation }}
                    </span>
                </template>
            </GlassDock>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue";

import {
    List,
    Minimize2,
    Pause,
    Play,
} from "@lucide/vue";

import {
    DockControl,
    DockTrigger,
    DockSeparator,
} from "@mkbabb/glass-ui/dock";
// T.C1 — the channel-elision RENDER consumes the cardinality model. The
// authoritative model is T.B5's DFA projection (lane 1); until it lands in-tree
// this consumes T.B5's DFA projection (dockCardinality — ONE count authority).
import { dockCardinality } from "@components/instrument/surfaceTabs";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectValue,
    Button,
} from "@mkbabb/glass-ui";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mkbabb/glass-ui/tooltip";
import { StatusDot } from "@mkbabb/glass-ui/status-dot";

import { RotateCcw } from "@lucide/vue";

import { GlassDock } from "@mkbabb/glass-ui/dock";
import { usePlayActuation } from "./TransportDock/usePlayActuation";
import { useMenubarMeasure } from "./TransportDock/useMenubarMeasure";
import { useIconSpin } from "./TransportDock/useIconSpin";
import type { StoredAnimationGroupControlOptions } from "@state";

const dockRef = useTemplateRef<InstanceType<typeof GlassDock>>("dockRef");

// The menubar host's REAL border-box height is published as
// `--menubar-measured-h` (+ a monotonic `-peak`) on :root so the mobile sheet
// anchor and the stage's band reserve clear the menubar the user sees (CH-3 /
// S1); the mechanism and its cycle-freedom are `useMenubarMeasure`'s docblock.
// The SFC owns the typed template ref and hands it in (TD-17).
const menubarHostEl = useTemplateRef<HTMLElement>("menubarHostEl");
useMenubarMeasure(menubarHostEl);

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

const { storedControls, isPlaying, isStarted, animationProgress, animationNames } = defineProps<{
    storedControls: StoredAnimationGroupControlOptions;
    isPlaying: boolean;
    isStarted: boolean;
    animationProgress: Record<string, number>;
    animationNames: string[];
}>();

const emit = defineEmits<{
    (e: "togglePlay"): void;
    (e: "reset", all: boolean): void;
    (e: "selectAnimation", name: string): void;
    (e: "expandTimeline", expanded: boolean): void;
}>();

// T.C1 / T.B5-RENDER — the channel zone: `>1 channels ⇒ select`, else ABSENT
// (the animation `<Select>` renders only for kind "select"; a lone/zero animation
// renders no node + no flanking separator, the elision). The count IS the guard
// the U4/no-single-option-select gate keys on (bound to `.length > 1`).
const channelZoneKind = computed(
    () => dockCardinality({ tabs: [], channels: animationNames }).channelZone.kind,
);

/** Set a single CSS custom property; the stylesheet computes gradient + shadow. */
const dotStyle = (name: string): Record<string, string> => {
    const p = animationProgress[name] ?? 0;
    return { "--dot-p": String(p) };
};

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

/* The .progress-dot recipe (the active-playing conic-gradient progress ring,
   applied at the SelectItem above) was PROMOTED to the owned idiom layer
   (design-idioms.css, E.W11.S4 — beside its sibling .progress-bar), so the
   progress vocabulary is single-sourced. The call site keeps `class="progress-dot"`. */
</style>
