<script setup lang="ts">
import { computed, inject, ref, watch, useTemplateRef, type Component } from "vue";
import { CONTROLS_PANE_HOVER_KEY } from "@components/instrument/transport/injectionKeys";
import { Activity, ChevronDown, ChevronUp, Home, PanelLeftClose, PanelLeftOpen, SlidersHorizontal, Braces, Clock, Grid3X3 } from "@lucide/vue";
import { useMediaQuery } from "@vueuse/core";
import {
    GlassDock,
    DockControl,
    DockTrigger,
    DockSeparator,
} from "@mkbabb/glass-ui/dock";
// T.C1 — the elision RENDER consumes T.B5's AUTHORITATIVE cardinality model
// (the DFA projection; the batch-5 dockZones.ts stand-in was deleted at merge —
// ONE source of the count arithmetic, per lane 18's dual-formula rule).
import {
    BUILT_IN_SURFACES,
    type ControlSurface,
} from "@state/controlSurfaces";
import {
    SURFACE_META,
    dockCardinality,
    type ControlSurfaceTab,
} from "@components/instrument/surfaceTabs";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectValue,
} from "@mkbabb/glass-ui";
// ChromeDock D-24 — the `StatusDot` import is GONE with the rows that misused it.
// A health-status primitive (`online` green / dashed `unknown` ring, one per
// NON-current row) was carrying the SELECTION signal in three menus, against
// this dock's own "never a saturated brand hue" register — while the primitive
// built for the job, the producer's SelectItem INDICATOR, was switched off at
// every one of those rows by `hide-indicator`. The demo hid the selection
// vocabulary and then re-invented it out of a health vocabulary. Now the
// indicator is simply left on: reka renders it for `data-state="checked"` alone,
// so the CURRENT row is marked instead of every OTHER row being marked
// "unknown". The `font-bold` on the current row stays as the redundant second
// channel it always was.
//
// WHY `--select-dot-color` IS BOUND EXPLICITLY (measured, not preferred). The
// producer's dot paints
//   background-color: var(--select-dot-color, var(--glass-accent, currentColor))
// and in THIS app the middle link is dead: `--glass-accent: var(--color-gold)`
// is declared by the producer where `--color-gold` is not yet defined and the
// property is registered, so it falls to its transparent initial value —
// measured `rgba(0, 0, 0, 0)` at both `:root` and `body`, while the demo's own
// `--color-gold` measures `#d9a520` one scope later. Leaving the chain alone
// would have swapped a wrong-but-visible signal for an INVISIBLE one, so the
// binding names the chain's own terminal link, `currentColor`: the row's ink,
// legible in both themes for free, and pointedly NOT a saturated brand hue —
// this dock's own register.
//
// `--dock-selected-accent` is NOT what gets bound, and the reason is measured
// too: its only consumer in the dist is
// `.glass-dock.vertical .dock-icon-button:is(.is-active, …)::before` — a
// VERTICAL rail accent strip — and it resolves to a 14% wash
// (`oklab(0.216 … / 0.14)`) sized for a 3px bar. Piping that into an 8px dot on
// a horizontal dock authors an invisible affordance. The row's premise that the
// token sits unused is TRUE and stays true; at this dock's orientation it is
// unreachable, and a Select's own vocabulary is what a Select consumes.
// Recorded, not silently dropped.

// The popup mutex and re-expand watch keep this dock open while one of its own
// popovers owns interaction.

// H.W5.S1/S2: the dock no longer holds a parallel string-keyed `sceneIcons`
// Record of imported image URLs (the D8 drift root cause). Each scene carries
// its own inline-SVG `icon` component on the descriptor (scenes.ts); the dock
// renders `<component :is="scene.icon">` so the binding is single-sourced and
// every survivor themes via currentColor. <Home> remains the icon for the
// explicit home descriptor ALONE (the single fallback).

// The BUILT-IN editor tab descriptors (label + icon for the {controls,keyframes,
// timeline} triad). The DFA (controlSurfaces.ts) is the AUTHORITY on WHICH of
// these render per scene — `allControlTabs` filters this list against the
// `controlSurfaces` prop (the active scene's valid set). T.B2 — the {label,icon}
// metadata itself DERIVES from the ONE `SURFACE_META` registry (the former
// hand-synced literal here was one of the three triplicated sites); `TAB_ICONS`
// below survives as the string→COMPONENT icon registry (a render concern, not
// metadata). The easing scene's set is ['easing'] (a scene-specific surface
// carried by `extraControlTabs`), so NONE of this triad renders for it.
const BUILT_IN_CONTROL_TABS: ControlSurfaceTab[] =
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
    isControlsPanelOpen: boolean;
    selectedControl?: string;
    /** The active scene's valid BUILT-IN editor surfaces (the DFA projection,
     *  H.W11.S4 / I2). The dock renders the {controls,keyframes,timeline} triad
     *  FROM this set — an invalid built-in surface CANNOT render. Defaults to the
     *  full triad when absent (non-App hosts that don't drive the DFA). */
    controlSurfaces?: readonly ControlSurface[];
    extraControlTabs?: readonly ControlSurfaceTab[];
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
// control-tab zone is a projection of the tab COUNT: `> 1 ⇒ select`, otherwise
// ABSENT — a single control surface renders NOTHING (no node, no flanking
// separator); the `hasControlPanel` (`> 0`) predicate still gates the collapse
// TOGGLE, because a 1-tab scene HAS a panel to open/close, it just has nothing
// to PICK.
//
// kf-ChromeDock M-2/C-4 + M-3 — DECIDED: the "inline" arm is DELETED, not
// revived. It was structurally unreachable (every facility scene unions its
// additive facet onto the built-in triad, so a scene has ≥2 tabs or none), and
// the cross-axis label-redundancy predicate that four comment blocks leaned on
// could never fire after the T.E8 relabel (Curve/Physics vs Easing/Spring). A
// live arm would have re-opened the very single-surface label #17 killed, so the
// doctrine above now holds without an exception: the `inline` kind is absent
// here. With the predicate gone the `currentLabel` prop — its only consumer —
// goes too (the App's binding with it), and so do the arm's role-generic
// `aria-label` div (D-8, which dies with the branch rather than being "fixed"
// inside it) and its `.dock-inline-tab` CSS.
const showControlSelect = computed(
    () =>
        dockCardinality({ tabs: allControlTabs.value, channels: [] }).controlZone
            .kind === "select",
);

const isMobile = useMediaQuery("(max-width: 1023px)");

const emit = defineEmits<{
    (e: "switchScene", id: string): void;
    (e: "warmScene", id: string): void;
    (e: "toggleControlsPanel"): void;
    (e: "updateSelectedControl", value: string): void;
}>();

// ── ChromeDock D-23 / C-5 — tell the legibility observer about the aurora ──
// The dock floats over the home hero's animated Aurora <canvas> and, until now,
// never said so. `backdropMode` is "live" and `autoLuminance` is true by
// default, so the sampler WAS running — it just had nothing to sample: with no
// `backgroundCanvas` it fell back to the static stack-walk of the painted page
// background, which on the landing route reads the flat bg-background field and
// not the moving wash the dock is actually sitting on.
//
// THE CURE SHAPE IS THE WHOLE POINT (read at the installed 7.0.0 dist, both
// halves): GlassDock does NOT hand its prop to the resolver. It wraps it —
//   backgroundCanvas: () => { const e = props.backgroundCanvas;
//                             return typeof e === "function" ? e()
//                                  : e instanceof HTMLCanvasElement ? e : null; }
// — so a STRING falls through both arms and is null BEFORE the underlying
// resolver (which does handle selectors) ever sees it. The d.ts advertises
// "an element, a getter, or a CSS selector"; the shipped adapter honours two of
// the three. A selector-string diff would type-check, review clean and change
// nothing. So this is a GETTER.
//
// It resolves through the DEMO's own `.hero-aurora` wrapper (HeroAurora.vue),
// never a producer-internal class, and it is re-run by the observer at every
// settle — so mounting or leaving the home route is handled live, and off-route
// it honestly returns null and the static stack-walk is correct again. The
// contrast delta and the observer's cost are KF.W9's measurements.
const auroraCanvas = (): HTMLCanvasElement | null =>
    typeof document === "undefined"
        ? null
        : document.querySelector<HTMLCanvasElement>(".hero-aurora canvas");

// ── Dock ref + controls pane hover sync ──
const dockRef = useTemplateRef<InstanceType<typeof GlassDock>>("dockRef");
const controlsPaneHover = inject(CONTROLS_PANE_HOVER_KEY, null);

// ── Popup mutex: only one dropdown at a time ──
type PopupKey = "scene" | "controls";
const openPopup = ref<PopupKey | null>(null);
// The dock stays expanded while one of THIS component's own dropdowns is open
// (the scene/controls Selects, one at a time through the mutex above) — holding
// is what keeps the trigger's layer from collapsing to visibility:hidden
// mid-gesture (BLK-8 / D9).
//
// M-4 (kf-ChromeDock) — the slotted-popup prop this term used to OR in is GONE,
// and with it the five-site round-trip (App.vue ref → prop → this term →
// MbabbMenu's `defineModel` → back). It existed to serve a claim about Vue that
// the registry killed and `test/demo/app/dock-context-slot-resolution.test.ts`
// now falsifies in a mounted render: `inject` resolves along the RUNTIME PARENT
// chain, so slot content authored in App.vue resolves THIS `<GlassDock>`'s
// context and holds the dock open itself (`useOptionalDockContext().keepOpen()`
// — MbabbMenu.vue). The producer's own portalled `SelectContent`, authored as
// slot content right here, has always relied on exactly that resolution.
const isSelectOpen = computed(() => openPopup.value !== null);
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

// ── T.G9 — the Monaco keyframes-pane INTERACTION WARM, re-homed HERE ─────────
// The interaction half of T.G9 used to hang off the in-panel pill strip's own
// `@pointerenter`/`@focusin`. That strip never rendered — the App provides
// `TABS_EXTERNALLY_MANAGED_KEY` unconditionally, so its host `v-if` was
// permanently false — so the interaction warm fired for nobody and the pane
// waited on the idle warm alone. THIS `<Select>` is the shipped control-surface
// switcher, so the warm re-homes onto it: reaching for the control tabs
// prefetches the Monaco-heavy keyframes pane, and the pane's own
// `useKeyframesPaneReveal` idle/select warm then mounts it off an already-warm
// module cache (the mount stays instant; only WHEN the bytes arrive changes).
// The Vite dynamic-import warmup, the same shape the scene warm uses
// (`app/scene/scenes.ts` `warmScene`): a rejected warm is swallowed here, and
// the real mount surfaces any error through the pane's own async boundary.
const warmControlSurfaces = (): void => {
    void import("@components/instrument/keyframes/KeyframesStringControls.vue").catch(
        () => {},
    );
};

// ── The dock watcher: the hover mirror and the touch-gate watchdog (ONE) ──
// C-14 — one watcher on the dock's state, not two on the same `expanded` read.
//
// R3-2 — `expanded` is hover ∪ PINNED, but the controls pane's sole reader of
// `controlsPaneHover` treats it as HOVER (its F9 idle rest-dim). Mirroring
// `expanded` let a pinned dock defeat the rest-dim for the life of the pin, so
// the mirror is HOVER only: expanded and not pinned.
//
// M-5 / C-6 — the watchdog, and the TRUE mechanism it answers. `keepOpen()`
// blocks the idle-timer collapse, and the dock's document-pointerdown path is
// already hold-guarded and portal-stamp exempt (`data-glass-dock-portal`), so a
// tap inside an open portalled menu does NOT collapse the dock by that route.
// The route that does exist is the producer's TOUCH GATE: when its
// `isActive` falls, it calls the dock's `collapse()` for any expanded,
// un-pinned dock WITHOUT consulting the hold counter — so on a touch device a
// tap in a portalled menu collapses the dock underneath it. The watchdog stays
// for exactly that path: a dock that slips to collapsed while anything holds
// it (this file's Selects, or a slot child holding through the dock context —
// MbabbMenu) is re-expanded, at most once per spurious collapse. The cure of
// record is the producer's (the gate should consult the hold counter and the
// portal stamp) and rides the BH relay; this is the consumer's accommodation.
watch(
    () => [dockRef.value?.expanded, dockRef.value?.isPinned] as const,
    ([isExpanded, isPinned]) => {
        if (controlsPaneHover) controlsPaneHover.value = !!isExpanded && !isPinned;
        if (isExpanded === false && dockRef.value?.isHeld) dockRef.value.expand();
    },
);

// RR-2 MISSED #1 — an open Select holds the dock and does nothing else. The
// `expand()` that used to ride here could only ever DEMOTE: a Select opens from
// the expanded (non-inert) layer, so the dock is never collapsed at this point,
// and `expand()` writes "hover" unconditionally — turning a user's pin (exit:
// click outside) into a timed auto-collapse once the hold drained.
watch(isSelectOpen, (open) => {
    if (open) dockRef.value?.keepOpen();
    else dockRef.value?.release();
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
            <GlassDock
                ref="dockRef"
                :collapse-delay="2500"
                :start-collapsed="true"
                :fit-content="true"
                :background-canvas="auroraCanvas"
            >
                        <!-- D-22 + RR-1 MISSED #1 — NO WRAPPER HERE. The dock's
                             own `.dock-layer` already IS the flex row
                             (`display:flex; align-items:center;
                             gap: var(--dock-layer-gap)`), so a
                             `flex items-center gap-2` div bought nothing and
                             cost two things: it substituted 8px for the token'd
                             6px, and — the consequential half — it made itself
                             the SINGLE direct child of the slot, so every onset
                             step of the producer's staggered reveal
                             (`.dock-layer.is-active > *:nth-child(2 of *)`,
                             `:nth-child(3 of *)`, `:nth-child(n+4):nth-child(-n+5)`
                             and their `nth-last-child` mirrors) matched that one
                             div and the whole row faded and scaled as one block.
                             The signature expand animation was silently lost on
                             the app's most-seen chrome. The controls now sit
                             DIRECTLY in the slot and each takes its own onset.
                             If 8px is wanted it is `--dock-layer-gap`'s to say;
                             the magnitude is KF.W9's. -->

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
                            <DockTrigger for="select" aria-label="Scene" class="dock-label [&>span]:line-clamp-none">
                                <component v-if="currentIcon" :is="currentIcon" class="dock-glyph shrink-0 text-muted-foreground" />
                                <Home v-else class="dock-glyph text-muted-foreground" />
                                <SelectValue />
                            </DockTrigger>
                            <SelectContent
                                class="min-w-[var(--dropdown-min-width)]"
                                :style="{ '--select-dot-color': 'currentColor' }"
                            >
                                <SelectGroup class="dock-label">
                                    <SelectItem :value="homeSceneId" class="py-2 px-3">
                                        <span class="flex items-center gap-2">
                                            <Home class="dock-glyph text-muted-foreground" />
                                            <span :class="currentSceneId === homeSceneId ? 'font-bold' : ''">Home</span>
                                        </span>
                                    </SelectItem>
                                    <SelectItem
                                        v-for="scene in scenes"
                                        :key="scene.id"
                                        :value="scene.id"
                                        class="py-2 px-3"
                                        @pointerenter="emit('warmScene', scene.id)"
                                    >
                                        <span class="flex items-center gap-2">
                                            <component v-if="scene.icon" :is="scene.icon" class="dock-glyph shrink-0 text-muted-foreground" />
                                            <span :class="currentSceneId === scene.id ? 'font-bold' : ''">{{ scene.label }}</span>
                                        </span>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <!-- section (contextual): the controls tab. Rendered ONLY
                             for ≥2 tabs (showControlSelect) — a single control
                             surface has nothing to pick, so the zone is ABSENT: NO
                             node and NO flanking separator (T.B5-RENDER, #17 dup
                             KILL; M-2's decision deleted the "inline" arm). -->
                        <template v-if="showControlSelect">
                            <DockSeparator />
                            <Select
                                :model-value="selectedControl ?? 'controls'"
                                :open="controlsSelectOpen"
                                @update:open="controlsSelectOpen = $event"
                                @update:model-value="(v) => emit('updateSelectedControl', String(v))"
                            >
                                <DockTrigger
                                    for="select"
                                    aria-label="Controls tab"
                                    class="dock-label [&>span]:line-clamp-none"
                                    @pointerenter="warmControlSurfaces"
                                    @focusin="warmControlSurfaces"
                                >
                                    <component :is="TAB_ICONS[allControlTabs.find(t => t.value === selectedControl)?.icon ?? 'SlidersHorizontal']" class="dock-glyph text-muted-foreground" />
                                    <SelectValue />
                                </DockTrigger>
                                <SelectContent
                                    class="min-w-[var(--dropdown-min-width)]"
                                    :style="{ '--select-dot-color': 'currentColor' }"
                                >
                                    <SelectGroup class="dock-label">
                                        <SelectItem v-for="tab in allControlTabs" :key="tab.value" :value="tab.value" class="py-2 px-3">
                                            <span class="flex items-center gap-2">
                                                <component v-if="tab.icon && TAB_ICONS[tab.icon]" :is="TAB_ICONS[tab.icon]" class="dock-glyph text-muted-foreground" />
                                                <span :class="selectedControl === tab.value ? 'font-bold' : ''">{{ tab.label }}</span>
                                            </span>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </template>

                        <!-- nav: the panel-collapse toggle (never leading — VERDICT
                             #6) + the @mbabb chip. Separated from the identity/section
                             by one DockSeparator. The toggle's ultimate home is the
                             panel edge (co-decided with T.B4's naked-rail recut); it
                             rides nav here, never the lead. -->
                        <DockSeparator />
                        <DockControl
                            shape="icon"
                            v-if="hasControlPanel"
                            :aria-label="isControlsPanelOpen ? 'Close controls' : 'Open controls'"
                            @click="emit('toggleControlsPanel')"
                        >
                            <template v-if="isMobile">
                                <ChevronUp v-if="isControlsPanelOpen" />
                                <ChevronDown v-else />
                            </template>
                            <template v-else>
                                <PanelLeftClose v-if="isControlsPanelOpen" />
                                <PanelLeftOpen v-else />
                            </template>
                        </DockControl>

                        <!-- Header items slot (@mbabb chip) -->
                        <slot name="items" />

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
                     the EXPANDED scene <Select> trigger above carries the
                     scene's name through its `<SelectValue/>` (M-3: there is no
                     `currentLabel` interpolation, and no such prop). This is a kf-CONSUME
                     fit (no GlassDock patch) — the slot content shrinks to what the
                     circle holds. -->
                <template #collapsed>
                    <component v-if="currentIcon" :is="currentIcon" class="dock-glyph shrink-0 text-muted-foreground" />
                    <Home v-else class="dock-glyph text-muted-foreground" />
                </template>
            </GlassDock>
        </div>
    </div>
</template>

<style scoped>
/* ChromeDock D-5 (co-id: the F4 row of the deleted header fork's record) — ONE
   glyph rung in the dock row, and it is the DOCK's own.

   Three defects, one root: the demo's `icon-{xs,sm,md,lg}` @utility family
   (14/16/20/24px) shadows glass-ui's `--icon-*` scale (12/14/16/20px) under
   IDENTICAL stems, uniformly one rung up. Reading those stems inside the dock
   (a) put FOUR glyph rungs in one row, (b) let `icon-lg` — a `@layer utilities`
   rule, so later than `@layer components` — defeat
   `.dock-icon-button > svg { width: var(--dock-icon-glyph) }`, drifting the
   dock's invariant 0.5 glyph:control ratio, and (c) inverted the file's own
   grammar: the IDENTITY glyph was the smallest thing in the row (`icon-sm`, 16)
   and the panel toggle the largest (`icon-lg`, 24).

   The cure is the KF-APP-25/-26 shape — retire the shadowed rung at the site
   and read the PRODUCER's token. `--dock-icon-glyph` is
   `max(--dock-layer-height * --dock-icon-glyph-ratio, --dock-icon-glyph-floor)`
   and is declared at `:root` as well as on `.glass-dock[data-size]`, so it
   resolves inside the PORTALLED SelectContent too. The DockControl glyphs carry
   no class at all now: the producer already sizes its own `> svg` from the same
   token, which is exactly the invariant `icon-lg` was defeating. Identity and
   nav therefore render at one rung, by the dock's arithmetic and not by a demo
   choice; the rendered ladder stays KF.W9's. The `icon-*` family's own
   corpus-wide disposition is W6-D's audit row, not this file's. */
.dock-glyph {
    width: var(--dock-icon-glyph);
    height: var(--dock-icon-glyph);
}

</style>
