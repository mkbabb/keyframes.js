<script setup lang="ts">
import { computed, inject, nextTick, ref, watch, useTemplateRef, type Component } from "vue";
import { CONTROLS_PANE_HOVER_KEY } from "@components/instrument/transport/injectionKeys";
import { Activity, ChevronDown, ChevronUp, Home, PanelLeftClose, PanelLeftOpen, SlidersHorizontal, Braces, Clock, Grid3X3 } from "@lucide/vue";
import { useMediaQuery } from "@vueuse/core";
import {
    GlassDock,
    DockControl,
    DockTrigger,
    DockSeparator,
} from "@mkbabb/glass-ui/dock";
import { Button } from "@mkbabb/glass-ui/button";
// T.C1 — the elision RENDER consumes T.B5's AUTHORITATIVE cardinality model
// (the DFA projection — ONE source of the count arithmetic, per lane 18's
// dual-formula rule).
import {
    BUILT_IN_SURFACES,
    type ControlSurface,
} from "@state/controlSurfaces";
import {
    SURFACE_META,
    dockCardinality,
    type ControlSurfaceTab,
} from "@components/instrument/surfaceTabs";
// m-3 / R3-6 — one import granularity: every glass-ui family here comes from
// its own subpath (`./dock`, `./button`, `./select`), never the root barrel.
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectValue,
} from "@mkbabb/glass-ui/select";
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
// its own `icon` component on the descriptor (scenes.ts) and the dock renders
// `<component :is="scene.icon">`, so the BINDING is single-sourced. <Home>
// remains the icon for the explicit home descriptor ALONE (the single fallback).
//
// D-3 — what that binding does NOT do is theme every glyph via currentColor
// (the claim this block used to make). Measured at the assets: cube, amiga and
// square are raster `<image>` pixel art; easing hardcodes `hsl(248 88% 71%)`;
// spring and sequence paint from `--color-progress`/`--rainbow-*` tokens whose
// `currentColor` fallbacks never fire because every token is defined. Only the
// lucide glyphs (Home, the tab icons) follow ink.
//
// THE INK POLICY (D-2-RESCOPED + RR-1 MISSED #2): no glyph declares its own
// ink. Every glyph inherits `currentColor` from the control or row it sits in,
// so on the trigger it rides the rest→hover ladder and the `--dock-fg-on-aurora`
// flip its label already follows, and in the portalled menu the Home glyph
// takes its row's ink instead of the root-scope muted grey that read as a
// DISABLED affordance beside five saturated icons. Every glyph is decorative
// beside a text or aria-label name, so each is `aria-hidden` (RR-1 MISSED #3 —
// the producer's own convention). The raster format and its non-integer scale
// (D-4) are the asset owner's, not this file's.

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
    /** R3-4 — the home descriptor's id AND label, single-sourced from the scene
     *  registry like the six rows beside it (the menu used to hard-code "Home"
     *  while the App passed only the id, so a rename desynced trigger and row). */
    homeScene: { id: string; label: string };
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

// m-1 / C-7 + m-9 — the controls trigger's glyph, resolved once and guarded.
// The inline `TAB_ICONS[…find(…)…]` lookup in the template typed as a Component
// but could index a missing key (a tab whose `icon` names no registry entry)
// and hand `<component :is>` undefined. Every miss now lands on the one
// declared fallback.
const selectedControlIcon = computed<Component>(() => {
    const icon = allControlTabs.value.find((t) => t.value === props.selectedControl)?.icon;
    return (icon && TAB_ICONS[icon]) || SlidersHorizontal;
});

const isMobile = useMediaQuery("(max-width: 1023px)");

const emit = defineEmits<{
    (e: "switchScene", id: string): void;
    (e: "warmScene", id: string): void;
    (e: "toggleControlsPanel"): void;
    (e: "updateSelectedControl", value: ControlSurface): void;
}>();

// m-8 + C-8 (the emit half) — the Selects' `AcceptableValue` is validated at the
// boundary instead of laundered through `String(…)` (an object value used to
// become the scene id "[object Object]" and travel to `runSceneSwitch`
// unchecked). A value is emitted only if it names a row this dock rendered, and
// the controls emit is typed in the DFA's own alphabet, `ControlSurface`, not
// widened to `string`.
function onScenePick(id: unknown): void {
    if (id === props.homeScene.id) emit("switchScene", props.homeScene.id);
    else {
        const scene = props.scenes.find((s) => s.id === id);
        if (scene) emit("switchScene", scene.id);
    }
}
function onControlPick(value: unknown): void {
    const tab = allControlTabs.value.find((t) => t.value === value);
    if (tab) emit("updateSelectedControl", tab.value);
}

// m-12 — the controls Select's model falls back to the FIRST tab this dock
// renders, not a hard-coded "controls" the rendered set need not contain
// (a non-App host may pass a set without it). The empty string is the
// primitive's "no selection" (its placeholder state; `SelectionValue` admits no
// null) — unreachable, since the Select only renders at ≥2 tabs.
const controlsModel = computed((): string => {
    const [first] = allControlTabs.value;
    return props.selectedControl ?? first?.value ?? "";
});

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

// D-18 / C-1 — the collapsed Button's KEYBOARD hand-off. Tabbing onto it
// focus-expands the dock (the producer's own focusin path), and that same
// expansion makes the summary layer `inert` — which would drop focus to the
// document and let the focus-out re-arm the collapse. So a keyboard focus is
// handed, after the render that swaps the layers, to the scene trigger: the
// expanded face of the same command. A POINTER focus (`:focus-visible` false)
// is left alone — the summary's click-to-pin and the hover-expand own that
// gesture, and expanding under a live press would re-target its click.
const sceneTrigger = useTemplateRef<{ $el: HTMLElement }>("sceneTrigger");
async function onCollapsedFocus(event: FocusEvent): Promise<void> {
    const control = event.currentTarget;
    if (!(control instanceof HTMLElement) || !control.matches(":focus-visible")) return;
    dockRef.value?.expand();
    await nextTick();
    sceneTrigger.value?.$el.focus();
}

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
        class="fixed left-0 right-0 z-dock flex items-center justify-center pointer-events-none"
        style="top: var(--dock-top-anchor);"
    >
        <div class="pointer-events-auto">
            <!-- G.W12.S2: the :always-expanded="isMobile" occlusion-dodge mask is
                 REMOVED — glass-ui's rebuilt dock owns the no-occlusion
                 contract; the occlusion gate re-runs mask-free as the lock. The
                 dead single-layer DockLayerGroup/DockLayer costume is collapsed —
                 the items mount directly in the GlassDock default slot. -->
            <!-- X.KF.W13T.k (OA-6) — the dock CONTAINS its controls, by layout.
                 The band spans the viewport (left-0 right-0, the TransportDock
                 band's idiom): the former `left-1/2 -translate-x-1/2` gave the
                 dock a shrink-to-fit containing block of 50vw, a cap no token
                 declared, so at 390/768 with a scene active the Controls tab,
                 the panel toggle and @mbabb painted past the capsule. The
                 producer's `--dock-max-inline-size` is now the only cap, and
                 `overflow="wrap"` is its over-cap recipe: one row when the row
                 fits, N rows exactly when it does not. Never a clip. -->
            <GlassDock
                ref="dockRef"
                :collapse-delay="2500"
                :start-collapsed="true"
                :fit-content="true"
                overflow="wrap"
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
                            v-model:open="sceneSelectOpen"
                            @update:model-value="onScenePick"
                        >
                            <DockTrigger ref="sceneTrigger" for="select" aria-label="Scene" class="dock-label">
                                <component v-if="currentIcon" :is="currentIcon" class="dock-glyph" aria-hidden="true" />
                                <Home v-else class="dock-glyph" aria-hidden="true" />
                                <SelectValue />
                            </DockTrigger>
                            <SelectContent
                                class="min-w-[var(--dropdown-min-width)]"
                                :style="{ '--select-dot-color': 'currentColor' }"
                            >
                                <SelectGroup class="dock-label">
                                    <SelectLabel class="sr-only">Scenes</SelectLabel>
                                    <SelectItem :value="homeScene.id">
                                        <span class="flex items-center gap-2">
                                            <Home class="dock-glyph" aria-hidden="true" />
                                            <span :class="currentSceneId === homeScene.id ? 'font-bold' : ''">{{ homeScene.label }}</span>
                                        </span>
                                    </SelectItem>
                                    <SelectItem
                                        v-for="scene in scenes"
                                        :key="scene.id"
                                        :value="scene.id"
                                        @pointerenter="emit('warmScene', scene.id)"
                                    >
                                        <span class="flex items-center gap-2">
                                            <component v-if="scene.icon" :is="scene.icon" class="dock-glyph" aria-hidden="true" />
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
                                :model-value="controlsModel"
                                v-model:open="controlsSelectOpen"
                                @update:model-value="onControlPick"
                            >
                                <DockTrigger
                                    for="select"
                                    aria-label="Controls tab"
                                    class="dock-label"
                                    @pointerenter="warmControlSurfaces"
                                    @focusin="warmControlSurfaces"
                                >
                                    <component :is="selectedControlIcon" class="dock-glyph" aria-hidden="true" />
                                    <SelectValue />
                                </DockTrigger>
                                <SelectContent
                                    class="min-w-[var(--dropdown-min-width)]"
                                    :style="{ '--select-dot-color': 'currentColor' }"
                                >
                                    <SelectGroup class="dock-label">
                                        <SelectLabel class="sr-only">Control tabs</SelectLabel>
                                        <SelectItem v-for="tab in allControlTabs" :key="tab.value" :value="tab.value">
                                            <span class="flex items-center gap-2">
                                                <component v-if="tab.icon && TAB_ICONS[tab.icon]" :is="TAB_ICONS[tab.icon]" class="dock-glyph" aria-hidden="true" />
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
                        <DockSeparator v-if="hasControlPanel || $slots.items" />
                        <!-- D-20 — the panel toggle takes the producer's `active`
                             prop, so its state is `aria-pressed` + `data-active` +
                             the selected seat, and the accessible name is ONE
                             stable noun instead of a verb that flipped with the
                             state (the name-mutation half is the banked
                             kf-ControlsPaneWrapper row; this is its ChromeDock
                             site, spent with the prop that makes it redundant).
                             D-21 — ONE icon grammar on both breakpoints: the glyph
                             names the ACTION a press performs. Desktop already
                             did (panel close/open); the mobile arm drew the
                             STATE, so the open sheet — dismissed DOWNWARD — wore
                             an up-chevron. It now points where the press moves
                             the sheet. -->
                        <DockControl
                            shape="icon"
                            v-if="hasControlPanel"
                            aria-label="Controls panel"
                            :active="isControlsPanelOpen"
                            @click="emit('toggleControlsPanel')"
                        >
                            <template v-if="isMobile">
                                <ChevronDown v-if="isControlsPanelOpen" aria-hidden="true" />
                                <ChevronUp v-else aria-hidden="true" />
                            </template>
                            <template v-else>
                                <PanelLeftClose v-if="isControlsPanelOpen" aria-hidden="true" />
                                <PanelLeftOpen v-else aria-hidden="true" />
                            </template>
                        </DockControl>

                        <!-- Header items slot (@mbabb chip) -->
                        <slot name="items" />

                <!-- Collapsed state.
                     K.W4 F6 (U-K20-adjacent) — glass-ui's collapsed
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
                <!-- D-18 / C-1 — the collapsed face is REACHABLE. The producer
                     renders the full layer `inert` while collapsed and the
                     summary as a bare click-only `<div>`, so a pointer-idle dock
                     used to hold ZERO tab stops and the app's only scene
                     navigation went keyboard-dead 2.5 s after any hover. The
                     glyph now sits in a real focusable Button (the house pattern
                     TransportDock's collapsed Play set). A pointer click still
                     bubbles to the summary's own click (pin) exactly as before;
                     KEYBOARD focus hands off to the expanded scene trigger, which
                     is the command this control stands for.
                     TD-39's rider: the Button is copied, the name split is NOT —
                     one logical command, one stable name ("Scene", the expanded
                     trigger's own), never suffixed with transient chrome state. -->
                <template #collapsed>
                    <Button
                        emphasis="quiet"
                        size="sm"
                        icon-only
                        aria-label="Scene"
                        @focus="onCollapsedFocus"
                    >
                        <component v-if="currentIcon" :is="currentIcon" class="dock-glyph" aria-hidden="true" />
                        <Home v-else class="dock-glyph" aria-hidden="true" />
                    </Button>
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
    /* D-12 — the glyph never yields to shrink pressure. `shrink-0` sat on 3 of 9
       sites (the controls TRIGGER glyph among the six without it); the rule
       that sizes every glyph is the one place that says so. */
    flex-shrink: 0;
}

</style>
