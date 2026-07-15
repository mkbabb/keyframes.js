<script setup lang="ts">
import { computed, inject, ref, watch, useTemplateRef, type Component } from "vue";
import { CONTROLS_PANE_HOVER_KEY } from "@components/instrument/transport/injectionKeys";
import { Activity, ChevronDown, ChevronUp, Home, PanelLeftClose, PanelLeftOpen, SlidersHorizontal, Braces, Clock, Grid3X3 } from "@lucide/vue";
import { useMediaQuery } from "@vueuse/core";
import {
    GlassDock,
    DockIconButton,
    DockSelectTrigger,
    DockSeparator,
} from "@mkbabb/glass-ui/dock";
// T.C1 — the elision RENDER consumes T.B5's AUTHORITATIVE cardinality model
// (the DFA projection; the batch-5 dockZones.ts stand-in was deleted at merge —
// ONE source of the count arithmetic, per lane 18's dual-formula rule).
import {
    BUILT_IN_SURFACES,
} from "@state/controlSurfaces";
import {
    SURFACE_META,
    dockCardinality,
} from "@components/instrument/surfaceTabs";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectValue,
} from "@mkbabb/glass-ui";
import { StatusDot } from "@mkbabb/glass-ui/status-dot";
// GLASSUI-GAP: dockDismissHold — the isAnyOpen popup mutex + the re-expand watch
// (below) are a band-aid for glass-ui's dock self-collapsing under its own open
// popover (its dismiss-pointerdown ignoring keepOpen() holds — GU-3). They are
// deleted on the re-pin; proof:glass-ui-gap-tripwire flips RED the instant
// glassCaps.dockDismissHold is satisfied while the watch survives. See
// demo/glass-ui-gaps.ts.

// H.W5.S1/S2: the dock no longer holds a parallel string-keyed `sceneIcons`
// Record of imported image URLs (the D8 drift root cause). Each scene carries
// its own inline-SVG `icon` component on the descriptor (scenes.ts); the dock
// renders `<component :is="scene.icon">` so the binding is single-sourced and
// every survivor themes via currentColor. <Home> remains the icon for the
// explicit home descriptor ALONE (the single fallback).

// The BUILT-IN editor tab descriptors (label + icon for the {controls,keyframes,
// timeline} triad). The DFA (controlSurfaceDFA.ts) is the AUTHORITY on WHICH of
// these render per scene — `allControlTabs` filters this list against the
// `controlSurfaces` prop (the active scene's valid set). T.B2 — the {label,icon}
// metadata itself DERIVES from the ONE `SURFACE_META` registry (the former
// hand-synced literal here was one of the three triplicated sites); `TAB_ICONS`
// below survives as the string→COMPONENT icon registry (a render concern, not
// metadata). The easing scene's set is ['easing'] (a scene-specific surface
// carried by `extraControlTabs`), so NONE of this triad renders for it.
const BUILT_IN_CONTROL_TABS: { value: string; label: string; icon?: string }[] =
    BUILT_IN_SURFACES.map((s) => SURFACE_META[s]);

const TAB_ICONS: Record<string, Component> = {
    SlidersHorizontal,
    Braces,
    Clock,
    Grid3X3,
    Activity,
};

const props = defineProps<{
    currentSceneId: string;
    scenes: { id: string; label: string; icon?: Component }[];
    homeSceneId: string;
    currentLabel: string;
    isControlsPanelOpen: boolean;
    selectedControl?: string;
    /** The active scene's valid BUILT-IN editor surfaces (the DFA projection,
     *  H.W11.S4 / I2). The dock renders the {controls,keyframes,timeline} triad
     *  FROM this set — an invalid built-in surface CANNOT render. Defaults to the
     *  full triad when absent (non-App hosts that don't drive the DFA). */
    controlSurfaces?: string[];
    extraControlTabs?: { value: string; label: string; icon?: string }[];
    /** A slotted #items popup (the @mbabb dropdown) is open. The slot content is
     *  set up in the PARENT (App.vue), so its `useOptionalDockContext()` resolves
     *  ABOVE this provider and cannot hold the dock open itself; the parent surfaces
     *  the open state here so the dock's own keep-open hold (dockRef) pins it — the
     *  same mutex the scene/controls Selects ride (BLK-8 / D9). */
    itemsPopupOpen?: boolean;
}>();

// The active scene's inline-SVG glyph for the trigger + collapsed pill; the
// home descriptor (and any not-yet-resolved id) has no icon → <Home> fallback.
const currentIcon = computed<Component | undefined>(
    () => props.scenes.find((s) => s.id === props.currentSceneId)?.icon,
);

// The effective control-tab set the dock renders = the DFA-VALID built-in triad
// for the active scene + the machine-PROJECTED `extraControlTabs` (the
// scene-specific surfaces' tab metadata: easing→Easing, spring→Spring,
// cube→Matrix Controls — derived from `activeScene` through the DFA's tab table
// in the App, J.W0.S3, so the trigger label settles synchronously with the
// route, never a tick late on the destination scene's mount).
// When `controlSurfaces` is absent (a non-App host that doesn't drive the DFA)
// the full built-in triad is the conservative default — total, never undefined.
const allControlTabs = computed(() => {
    const valid = props.controlSurfaces;
    const builtIn = valid
        ? BUILT_IN_CONTROL_TABS.filter((t) => valid.includes(t.value))
        : [...BUILT_IN_CONTROL_TABS];
    return props.extraControlTabs ? [...builtIn, ...props.extraControlTabs] : builtIn;
});

// The control-panel affordances (the collapse toggle + the tab selector) appear
// ONLY when the scene has at least one control surface to show (the DFA set is
// non-empty). For home/sequence the DFA set is [] — so NO control
// affordance renders, which is the DFA-driven supersession of those scenes'
// former `isControlsPanelOpen = false` poke-sets (one authority for "this scene
// has no panel", not a per-scene imperative write). J.W0.S3: the former
// `hasSelectedAnimation` AND-clause is DEAD — it keyed the affordance on a
// per-superKey stored fact seeded only at SCENE_READY (post-mount), so on a
// cross-scene nav the trigger VANISHED for the mount window (clause (b)'s
// forbidden `null`). The DFA projection is born-correct on the rest tick; the
// affordance presence now settles synchronously with the route.
const hasControlPanel = computed(() => allControlTabs.value.length > 0);

// T.C1 + T.B5-RENDER (VERDICT #17 — the `∿ Spring │ ∿ Spring` dup KILL). The
// control-tab zone is a projection of the tab COUNT × the scene identity (the
// cross-axis redundancy predicate): `> 1 ⇒ select`; `1 ⇒ absent` when the sole
// tab's label is redundant with the scene identity the compass already shows
// (easing→"Easing", spring→"Spring" — always true on the surviving scene set);
// `0 ⇒ absent`. The K.W4 S6 STATIC-LABEL else-branch is DELETED: a single control
// surface now renders NOTHING (no node, no flanking separator), not a demoted
// label duplicating the scene name (the owner-rejected #17 register). The
// `hasControlPanel` (`> 0`) predicate still gates the collapse TOGGLE — a 1-tab
// scene HAS a panel to open/close, it just has nothing to PICK.
const controlZoneKind = computed(() => {
    const { controlZone: cz, controlLabelRedundant } = dockCardinality({
        tabs: allControlTabs.value,
        channels: [],
        sceneLabel: props.currentLabel,
    });
    // The cross-axis clause folds here: a redundant inline label renders NOTHING.
    return controlLabelRedundant ? "absent" : cz.kind;
});
// The controls `<Select>` renders ONLY for kind "select" (≥2 tabs). This is the
// count-guard the U4/no-single-option-select gate keys on (bound to `> 1`).
const multipleControlTabs = computed(() => allControlTabs.value.length > 1);
// The control section is INHABITED for "select" (dropdown) or "inline" (bare tab
// body); "absent" renders no node and no flanking separator (the elision).
const showControlSection = computed(() => controlZoneKind.value !== "absent");
// The inline zone body (a non-redundant single surface — never on the surviving
// scene set, carried for T.B5 contract parity). NOT a static label: it is the
// contextual zone's tab body, rendered without dropdown chrome.
const inlineControlTab = computed(() =>
    controlZoneKind.value === "inline" ? allControlTabs.value[0] : undefined,
);

const isMobile = useMediaQuery("(max-width: 1023px)");

const emit = defineEmits<{
    (e: "switchScene", id: string): void;
    (e: "warmScene", id: string): void;
    (e: "toggleControlsPanel"): void;
    (e: "updateSelectedControl", value: string): void;
}>();

// ── Dock ref + controls pane hover sync ──
const dockRef = useTemplateRef<InstanceType<typeof GlassDock>>("dockRef");
const controlsPaneHover = inject(CONTROLS_PANE_HOVER_KEY, null);

watch(() => dockRef.value?.expanded, (isExpanded) => {
    if (controlsPaneHover) controlsPaneHover.value = !!isExpanded;
});

// ── Popup mutex: only one dropdown at a time ──
type PopupKey = "scene" | "controls";
const openPopup = ref<PopupKey | null>(null);
// The dock stays expanded while ANY popup is open — the scene/controls Selects
// (openPopup mutex) OR a slotted #items popup the parent surfaces (the @mbabb
// dropdown, whose own DI-injected hold can't reach this provider). Holding here is
// what keeps the trigger's layer from collapsing to visibility:hidden mid-gesture.
const isAnyOpen = computed(() => openPopup.value !== null || !!props.itemsPopupOpen);
function popupModel(key: PopupKey) {
    return computed({
        get: () => openPopup.value === key,
        set: (open: boolean) => {
            if (open) {
                openPopup.value = key;
            } else if (openPopup.value === key) {
                openPopup.value = null;
            }
        },
    });
}
const sceneSelectOpen = popupModel("scene");
const controlsSelectOpen = popupModel("controls");

// While a popup is open, the dock MUST stay expanded so the trigger that owns the
// popup remains visible + hit-testable (the @mbabb dropdown's open/close latch, the
// scene/controls selects' re-pick). keepOpen() blocks the idle-TIMER collapse, but
// the dock's document-pointerdown path can still force a collapse (its own
// dismiss-synthetic pointerdown lands outside the dock and self-collapses it,
// bypassing the hold counter). So we ALSO re-assert expand() if the dock slips to
// collapsed while a popup is open — the trigger's layer never goes
// visibility:hidden under an open menu (BLK-8 / D9). The guard below settles into a
// stable expanded state (re-expand fires at most once per spurious collapse).
watch(
    () => dockRef.value?.expanded,
    (isExpanded) => {
        if (isExpanded === false && isAnyOpen.value) dockRef.value?.expand();
    },
);

watch(isAnyOpen, (open) => {
    if (open) {
        dockRef.value?.keepOpen();
        dockRef.value?.expand();
    } else dockRef.value?.release();
});
</script>

<template>
    <div
        data-dock-tether="top"
        class="fixed left-1/2 -translate-x-1/2 z-dock flex items-center justify-center pointer-events-none"
        style="top: var(--dock-top-anchor);"
    >
        <div class="pointer-events-auto">
            <!-- G.W12.S2: the :always-expanded="isMobile" occlusion-dodge mask is
                 REMOVED — glass-ui's rebuilt 3.3.0 dock owns the no-occlusion
                 contract; the occlusion gate re-runs mask-free as the lock. The
                 dead single-layer DockLayerGroup/DockLayer costume is collapsed —
                 the items mount directly in the GlassDock default slot. -->
            <GlassDock ref="dockRef" :collapse-delay="2500" :start-collapsed="true" :fit-content="true">
                <div class="flex items-center gap-2">
                        <!-- T.C1 — THE COMPASS RECUT (rail-core | section | nav on
                             glass-ui DockSeparator; separators derive from INHABITED
                             zones by construction — zero hand-rolled dock-separator
                             divs). Identity LEADS (the scene trigger is rail-core);
                             the controls tab is the contextual section (≥2 only, the
                             elision render); the panel-collapse toggle + @mbabb chip
                             trail as nav (the toggle NEVER leads — VERDICT #6). -->

                        <!-- rail-core: the scene trigger (identity first) -->
                        <Select
                            :model-value="currentSceneId"
                            :open="sceneSelectOpen"
                            @update:open="sceneSelectOpen = $event"
                            @update:model-value="(id) => emit('switchScene', String(id))"
                        >
                            <DockSelectTrigger aria-label="Scene" class="dock-label [&>span]:line-clamp-none">
                                <component v-if="currentIcon" :is="currentIcon" class="icon-sm shrink-0 text-muted-foreground" />
                                <Home v-else class="icon-sm text-muted-foreground" />
                                <SelectValue />
                            </DockSelectTrigger>
                            <SelectContent class="min-w-[var(--dropdown-min-width)]">
                                <SelectGroup class="dock-label">
                                    <SelectItem :value="homeSceneId" class="py-2 px-3" hide-indicator>
                                        <span class="flex items-center gap-2">
                                            <StatusDot :variant="currentSceneId === homeSceneId ? 'active' : 'idle'" />
                                            <Home class="icon-sm text-muted-foreground" />
                                            <span :class="currentSceneId === homeSceneId ? 'font-bold' : ''">Home</span>
                                        </span>
                                    </SelectItem>
                                    <SelectItem
                                        v-for="scene in scenes"
                                        :key="scene.id"
                                        :value="scene.id"
                                        class="py-2 px-3"
                                        hide-indicator
                                        @pointerenter="emit('warmScene', scene.id)"
                                    >
                                        <span class="flex items-center gap-2">
                                            <StatusDot :variant="currentSceneId === scene.id ? 'active' : 'idle'" />
                                            <component v-if="scene.icon" :is="scene.icon" class="icon-sm shrink-0 text-muted-foreground" />
                                            <span :class="currentSceneId === scene.id ? 'font-bold' : ''">{{ scene.label }}</span>
                                        </span>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <!-- section (contextual): the controls tab. Rendered ONLY
                             when the zone is INHABITED (controlZoneKind !== "absent")
                             — a single control surface (easing/spring) is redundant
                             with the scene identity above, so the zone is ABSENT: NO
                             node and NO flanking separator (T.B5-RENDER, #17 dup
                             KILL). The SELECT renders only for ≥2 tabs; the "inline"
                             arm draws the bare tab body for a non-redundant single
                             surface (T.B5 contract parity; never on the current
                             scene set). -->
                        <template v-if="showControlSection">
                            <DockSeparator />
                            <Select
                                v-if="multipleControlTabs"
                                :model-value="selectedControl ?? 'controls'"
                                :open="controlsSelectOpen"
                                @update:open="controlsSelectOpen = $event"
                                @update:model-value="(v) => emit('updateSelectedControl', String(v))"
                            >
                                <DockSelectTrigger aria-label="Controls tab" class="dock-label [&>span]:line-clamp-none">
                                    <component :is="TAB_ICONS[allControlTabs.find(t => t.value === selectedControl)?.icon ?? 'SlidersHorizontal']" class="icon-md text-muted-foreground" />
                                    <SelectValue />
                                </DockSelectTrigger>
                                <SelectContent class="min-w-[var(--dropdown-min-width)]">
                                    <SelectGroup class="dock-label">
                                        <SelectItem v-for="tab in allControlTabs" :key="tab.value" :value="tab.value" class="py-2 px-3" hide-indicator>
                                            <span class="flex items-center gap-2">
                                                <component v-if="tab.icon && TAB_ICONS[tab.icon]" :is="TAB_ICONS[tab.icon]" class="icon-md text-muted-foreground" />
                                                <StatusDot :variant="selectedControl === tab.value ? 'active' : 'idle'" />
                                                <span :class="selectedControl === tab.value ? 'font-bold' : ''">{{ tab.label }}</span>
                                            </span>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <div
                                v-else-if="inlineControlTab"
                                aria-label="Controls tab"
                                class="dock-label dock-inline-tab flex items-center gap-2"
                            >
                                <component
                                    v-if="inlineControlTab.icon && TAB_ICONS[inlineControlTab.icon]"
                                    :is="TAB_ICONS[inlineControlTab.icon]"
                                    class="icon-md text-muted-foreground"
                                />
                                <span>{{ inlineControlTab.label }}</span>
                            </div>
                        </template>

                        <!-- nav: the panel-collapse toggle (never leading — VERDICT
                             #6) + the @mbabb chip. Separated from the identity/section
                             by one DockSeparator. The toggle's ultimate home is the
                             panel edge (co-decided with T.B4's naked-rail recut); it
                             rides nav here, never the lead. -->
                        <DockSeparator />
                        <DockIconButton
                            v-if="hasControlPanel"
                            :aria-label="isControlsPanelOpen ? 'Close controls' : 'Open controls'"
                            @click="emit('toggleControlsPanel')"
                        >
                            <template v-if="isMobile">
                                <ChevronUp v-if="isControlsPanelOpen" class="icon-lg" />
                                <ChevronDown v-else class="icon-lg" />
                            </template>
                            <template v-else>
                                <PanelLeftClose v-if="isControlsPanelOpen" class="icon-lg" />
                                <PanelLeftOpen v-else class="icon-lg" />
                            </template>
                        </DockIconButton>

                        <!-- Header items slot (@mbabb chip) -->
                        <slot name="items" />
                </div>

                <!-- Collapsed state.
                     K.W4 F6 (U-K20-adjacent) — on glass-ui 4.0.0 the collapsed
                     dock necks to a PERFECT CIRCLE (the summary pane floors to
                     `--dock-collapsed-summary-min-size` with `aspect-ratio: 1`),
                     and a circle cannot hold the icon + the scene name + a chevron
                     — the former three-part chip CLIPPED the label ("Cube" → "Cub").
                     The collapsed content is now ICON-FORWARD: only the scene's
                     colourful glyph, centred cleanly in the circle (the scene's
                     identity moment is the glyph, which is already the brand-voice
                     pop — the J.W7a §3 anti-goal that the label stays uncoloured is
                     trivially satisfied when the label is absent). The serif
                     scene-title + chevron belong to the EXPANDED bar (already good);
                     the EXPANDED scene <Select> trigger above carries the full
                     `{{ currentLabel }}` for the named identity. This is a kf-CONSUME
                     fit (no GlassDock patch) — the slot content shrinks to what the
                     circle holds. -->
                <template #collapsed>
                    <component v-if="currentIcon" :is="currentIcon" class="icon-md shrink-0 text-muted-foreground" />
                    <Home v-else class="icon-md text-muted-foreground" />
                </template>
            </GlassDock>
        </div>
    </div>
</template>

<style scoped>
/* T.C1 — the "inline" control-zone body register (a non-redundant single control
   surface: the tab body drawn WITHOUT dropdown chrome, per the T.B5 contract). It
   reads at the same inline height + padding a `DockSelectTrigger` occupies so the
   dock row keeps its rhythm. Not to be confused with the DELETED K.W4 single-option
   STATIC label (the #17 dup that duplicated the scene name — now elided to ABSENT).
   The `dock-label` glass-ui class supplies the font register (Jakarta, T.D3); this
   rule only pads the inline box + keeps the text from wrapping. */
.dock-inline-tab {
    padding-inline: var(--dock-label-padding-inline, 0.5rem);
    white-space: nowrap;
    color: var(--foreground);
}
</style>
