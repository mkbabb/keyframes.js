<template>
    <div
        ref="menubarHostEl"
        data-dock-tether="bottom"
        :class="[
            'menubar-safe-pb px-2 py-1.5 m-0 flex items-center justify-center justify-items-center',
            'fixed left-0 right-0 z-dock',
        ]"
        style="bottom: var(--dock-bottom-anchor, var(--work-area-bottom-offset, 0px));"
    >
        <!--
            J.W7c U2 — the SHRUNKEN transport. The dock collapses to a summary
            pill (the selected animation name + the rainbow play mirror, the
            #collapsed slot below) and expands on hover/focus, driven by
            GlassDock's own collapse. R.W6 C.6 (DM-1 KILL) — both play controls
            actuate from DISJOINT, modality-pure event sources (pointerup for
            pointer, keydown for keyboard) — NEVER from the strand-prone synthesized
            `click` — so the collapse crossfade has no trailing event to strand on a
            leaving layer (see the script handler). Collapsing also shrinks the
            menubar host, so the ResizeObserver (below) republishes a smaller
            --menubar-measured-h and the mobile sheet anchor self-corrects to the
            collapsed pill (audit X1).
        -->
        <!--
            K.W0 S3 (U-K1 — the transport default detent, the kf-side decision).
            NAMED DECISION: the bottom transport defaults to the COLLAPSED detent
            (`:always-expanded="false"`) — it must NOT render its full layer at
            rest (the U-K1 defect: only the TOP dock honoured the collapse while
            this transport stayed full, y:770 `dock-layer--full is-active`,
            probe-dock-default.mjs). Collapsed-but-PLAY-REACHABLE: the #collapsed
            slot below keeps the rainbow play CTA (the PRIMARY first-run gesture)
            present as the summary-pill play mirror, so the detent never strands
            the play affordance.
            `:always-expanded="false"` is the ONLY kf-side lever for the detent;
            the FULL collapse-policy integration (GlassDock honouring the detent so
            the transport actually shrinks to the pill at rest, not just the top
            dock) is a glass-ui collapse-policy fix that lands on the K.W1
            re-pin (RF-17 / the dock-collapse handoff) — NOT a retuned magic
            offset here (the K mandate's named forbidding). This is a TASTE-boundary
            item: this collapsed default is corroboration; the appearance verdict
            closes on the user's review packet.
        -->
        <GlassDock ref="dockRef" :always-expanded="false" :fit-content="true">
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
            <div class="flex items-center gap-3">
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
                        >
                            <Pause v-if="isPlaying" class="icon-lg" />
                            <Play v-else class="icon-lg pl-0.5" />
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
                                :model-value="storedControls.selectedAnimation"
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
                                        <template
                                            v-for="name in animationNames"
                                        >
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
                            <RotateCcw
                                ref="resetIconEl"
                                class="icon-lg"
                            />
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

            <!-- Collapsed state: animation name first, play button on right -->
            <template #collapsed>
                <span v-if="storedControls.selectedAnimation" class="dock-label text-foreground whitespace-nowrap font-semibold">
                    {{ storedControls.selectedAnimation }}
                </span>
                <!-- The collapsed-dock play mirror — carries a DISTINCT
                     accessible name from the expanded menubar transport play
                     (X-3): two play controls with the same "Play animation"
                     name are indistinguishable to a screen reader. Disambiguated
                     across BOTH states (Play and Pause) since one ternary drives
                     both. -->
                <Button
                    emphasis="quiet"
                    :aria-label="
                        isPlaying
                            ? 'Pause animation (collapsed dock)'
                            : 'Play animation (collapsed dock)'
                    "
                    :class="[
                        'scale-on-hover text-white rounded-full p-0',
                        'w-8 h-8 shrink-0',
                        isPlaying ? 'rainbow-vivid' : 'rainbow-pastel',
                    ]"
                    @pointerdown.stop="onPlayPointerDown($event)"
                    @pointerup.stop="onPlayPointerUp($event)"
                    @pointercancel.stop="onPlayPointerCancel($event)"
                    @keydown.stop="onPlayKeydown($event)"
                    @keyup.stop="onPlayKeyup($event)"
                >
                    <Pause v-if="isPlaying" class="icon-md" />
                    <Play v-else class="icon-md pl-px" />
                </Button>
            </template>
        </GlassDock>
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

// ── J.W4 S7 (CH-3/M1 — the sheet anchor derives from the MEASURED menubar) ──
// The mobile bottom sheet anchors at `bottom: var(--dock-menubar-reserve)`
// (ControlsPaneWrapper.vue), and the reserve's dock band was DERIVED FROM A
// TOKEN (`--dock-icon-height` + margin ≈ 52px) while the always-expanded
// TransportDock pill actually renders ~80px tall (+ host padding ≈ 90px) — so
// the open sheet's bottom ran 30+px BEHIND the menubar and the menubar pill
// painted OVER the sheet's bottom control row (the M1 occlusion class, live at
// 390×844; the I deferred-ledger CH-3 row's named cure is "derive sheet anchor
// from MEASURED menubar height"). This observer IS that cure: it measures the
// menubar host's REAL border-box height and publishes it as
// `--menubar-measured-h` on :root; style.css folds it into
// `--dock-band-reserve` via max(), so the sheet (and the work-area band math)
// always clears the menubar the user actually sees — token drift can never
// re-open the occlusion. Height is content-driven (never a function of the
// reserve it feeds), so no custom-property cycle forms.
// Gated by proof:live-session-mobile (sheet.bottom ≤ menubar.top on a real
// 390×844 + hasTouch context — the CH-3 re-certification oracle).
const menubarHostEl = useMenubarMeasure();

// J.WZ (S1 stage-rect-invariant fix) — the menubar pill's border-box height is
// NOT constant across the sheet toggle: opening the bottom sheet reflows the
// GlassDock content (the transport row crossfades/repacks) so the LIVE measure
// oscillates ~90px↔~84px. The sheet anchor WANTS that live value (it must clear
// the menubar the user sees this instant — proof:live-session-mobile). But the
// mobile full-bleed STAGE reserves its band from the same token, and a band that
// breathes with the dock SHIFTS the fixed stage rect on every open/close — the
// exact S1 violation proof:mobile-single-page clause (b) bites (host Δ ≈ ±8px).
// Cure: publish a MONOTONIC high-water mark beside the live value. The stage
// reserves the PEAK (stable by construction — it only ever grows), so the
// full-bleed frame never moves; the sheet keeps tracking the live measure. The
// peak is a pure ceiling over observed heights (never fed back into the measure),
// so no custom-property cycle forms and over-reservation only ever keeps the
// subject MORE clear of the dock, never less.

// ── R.W6 C.6 — DM-1 CONTINGENCY KILL (the crossfade-strand band-aid EXCISED).
//
// The play toggle formerly carried a press-handled boolean + a pointerdown/click
// dual-path interim (the 8th-carry chronic DM-1) that hedged glass-ui's
// collapse-crossfade STRANDING the trailing synthesized `click`: a `@click`-only
// toggle could be DROPPED when the dock crossfaded the active `.dock-layer`
// mid-gesture (the layer went `pointer-events:none` before the browser
// synthesized the click). The durable cure is a glass-ui dock-layer keepalive
// (GU-Q2). Until that published seam arrives, the kf handler is crossfade-
// independent by construction.
//
// The cure: actuate from DISJOINT, modality-pure event sources, NEVER from the
// strand-prone `click`:
//   · POINTER  → `pointerup` on the live button. pointerup fires on the button
//     the pointer is OVER, regardless of any pending collapse — the crossfade can
//     only strand the LATER synthesized `click`, which we no longer listen for.
//   · KEYBOARD → `keydown` Enter/Space directly (the native button click path is
//     not used, so there is nothing for the crossfade to strand).
// One handler set governs both the expanded button and the collapsed-summary
// mirror so the two controls can never drift.
//
// S.B7 S6 (a12 F2/F3) — the actuation contract lives in `usePlayActuation` so it
// is unit-testable, and it mirrors NATIVE button semantics: pointerup gated on a
// pointerdown-on-this-control press-origin flag (+isPrimary), Space on keyup /
// Enter on keydown, both auto-repeat-guarded. The prior handler actuated on ANY
// pointerup over the button and on RAW keydown — a drag-release toggle and a
// held-key rapid-toggle respectively.

function actuatePlay() {
    // Best-effort re-pin the dock open (the toggle stays legible after actuation),
    // then emit. The emit is the load-bearing line — pointerup/keyup both fire on
    // the live button, so it cannot be raced by the collapse crossfade.
    dockRef.value?.expand();
    emit("togglePlay");
}

const {
    onPlayPointerDown,
    onPlayPointerUp,
    onPlayPointerCancel,
    onPlayKeydown,
    onPlayKeyup,
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

const { resetIconEl, resetIconSpin } = useIconSpin();

// T.C2 — "Clear all & reload" (the trash icon + its shake, `emit('reset', true)`)
// MOVED OUT of the transport into the @mbabb settings menu (a destructive storage
// reset is a settings action, not transport chrome). The trashShakeAnim +
// trashIconShake are removed with it.

defineExpose({ resetIconSpin });
</script>

<style scoped>
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
