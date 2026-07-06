// ─────────────────────────────────────────────────────────────────────────────
// THE CONTROL-SURFACE DFA — the THIRD orthogonal axis on the H.W1 keystone
// (H.W11.S4 / I2). Pure core, co-located with the scene+playback reducer it
// EXTENDS (sceneMachine.ts owns scene+playback; THIS owns control-surface
// VISIBILITY keyed by scene). The reactive projection is exposed through the
// effect layer (useSceneMachine.ts `controlSurfacesFor`).
//
// WHY a separate axis: W1 owns TWO orthogonal axes (the SCENE axis and the
// PLAYBACK-status axis). The per-scene control-surface VISIBILITY had no formal
// owner — `AnimationControls.vue` hard-coded the {controls,keyframes,timeline}
// triad for EVERY scene, and each scene poke-set `selectedControl`/
// `isControlsPanelOpen` with reka-tab-fallback HACKS (EasingScene's onMounted
// nextTick re-assert, etc.). This DFA is the explicit owner those hacks stood
// in for: a STATIC, TOTAL map (scene → valid control-surface set) the tab hosts
// render FROM, so an INVALID surface CANNOT render per scene.
//
// DO NOT touch the W1 reducer (`transition`) — this is a PURE orthogonal
// PROJECTION, never a state mutation. `transition(state, event)` is unchanged;
// proof:scene-machine-irrefragable stays GREEN by construction.
// ─────────────────────────────────────────────────────────────────────────────

import type { SceneId } from "./sceneMachine";

/**
 * The control-surface alphabet — every surface a scene MAY expose in the control
 * dock/panel. `controls`/`keyframes`/`timeline` are the BUILT-IN editor triad;
 * `easing`/`spring`/`matrix-controls` are the scene-specific surfaces whose tab
 * metadata projects through `extraControlTabsFor` (J.W0.S3). The DFA is the
 * authority on WHICH of these are valid per scene; the tab host renders the
 * INTERSECTION of its known tab descriptors with this set.
 */
export type ControlSurface =
    | "controls"
    | "keyframes"
    | "timeline"
    | "easing"
    | "spring"
    | "matrix-controls";

/** The BUILT-IN editor triad — the surfaces `AnimationControls`/`ChromeDock`
 *  carry as first-class tab descriptors. A scene shows a triad member ONLY when
 *  its DFA entry includes it. */
export const BUILT_IN_SURFACES: readonly ControlSurface[] = [
    "controls",
    "keyframes",
    "timeline",
];

/**
 * THE DFA TABLE — (scene → valid control-surface set). The (scene ×
 * control-surface) matrix made EXPLICIT + TOTAL: every declared scene id maps to
 * an enumerated set; `controlSurfacesFor` makes UNKNOWN scenes total (no
 * undefined behavior navigating any (scene → scene) pair — every cell resolves).
 *
 *   • home          → []                                (no editor — the landing)
 *   • cube/amiga     → [controls, keyframes, timeline]  (the full editor triad;
 *                                                        cube ADDS matrix-controls
 *                                                        CONDITIONALLY — see below)
 *   • easing         → [easing]                         (ONLY easing — NOT the
 *                                                        meaningless keyframes/
 *                                                        timeline triad)
 *   • spring         → [spring]                         (ONLY spring)
 *   • square         → [controls, keyframes, timeline]  (T.A13+T.B3 / fold row 69 —
 *                                                        the G2 collapse CURED: the
 *                                                        "Transform" animation is now
 *                                                        LIVE (num()-normalized four-
 *                                                        corner keyframes), so the
 *                                                        triad edits an HONEST anim —
 *                                                        Play obeys duration/easing.)
 *   • sequence       → []                               (self-contained; no panel)
 *
 * CUBE'S matrix-controls is a CONDITIONAL surface (valid only while the Matrix
 * animation is selected). It is therefore NOT a static table member; it composes
 * on top through `extraControlTabsFor`'s `activeConditionals` argument (the App
 * supplies the selection predicate — a stored, synchronous fact). The static
 * table enumerates the surface set that holds REGARDLESS of the in-scene
 * selection; the cube's CONDITIONAL ceiling is recorded in `CONDITIONAL_SURFACES`
 * so the navigation-matrix gate knows the cube cell's full possible set is
 * DEFINED.
 */
export const CONTROL_SURFACES: Record<SceneId, ControlSurface[]> = {
    home: [],
    cube: ["controls", "keyframes", "timeline"],
    amiga: ["controls", "keyframes", "timeline"],
    // T.A13 + T.B3 (fold row 69, the G2 inversion CURED) — square RE-TABLED into
    // the full built-in triad. S.G2 collapsed square to [] because Play painted
    // nothing (the "0pxpx" CSSOM discard). With the unit-honest `num()` normalizer
    // + the real four-corner keyframes + the {idle,drag,playback} FSM (T.A13), the
    // "Transform" animation is LIVE — Play visibly obeys duration/easing/direction,
    // so the triad edits an honest animation (the VERDICT #12/#25 panel RETURN).
    square: ["controls", "keyframes", "timeline"],
    easing: ["easing"],
    spring: ["spring"],
    sequence: [],
};

/**
 * The CONDITIONAL surfaces a scene MAY add on top of its static set, gated by an
 * in-scene selection (cube's matrix-controls appears only when the Matrix
 * animation is selected). Enumerated so the navigation-matrix gate can assert the
 * cube cell's FULL possible surface set is DEFINED (no undefined behavior even
 * with the conditional extra). The App projects these through
 * `extraControlTabsFor` (J.W0.S3 — the caller supplies WHICH conditionals are
 * currently active); the DFA records that they are EXPECTED + valid.
 */
export const CONDITIONAL_SURFACES: Record<SceneId, ControlSurface[]> = {
    cube: ["matrix-controls"],
};

/**
 * The TOTAL selector — the valid control-surface set for ANY scene id. An
 * unknown/unregistered scene id falls back to the BUILT-IN editor triad (the
 * conservative default: a never-seen scene gets the standard editor, never an
 * undefined set). This totality is the no-undefined-behavior guarantee: every
 * (scene → scene) navigation lands on a DEFINED control-surface set.
 *
 * Returns a fresh array per call (the table value is never mutated by callers).
 */
export function controlSurfacesFor(sceneId: SceneId): ControlSurface[] {
    const set = CONTROL_SURFACES[sceneId];
    return set ? [...set] : [...BUILT_IN_SURFACES];
}

/**
 * Is `surface` valid for `sceneId`? Includes the CONDITIONAL surfaces (cube's
 * matrix-controls) so a host can ask "may this surface EVER render here" — the
 * gate's TOTAL-matrix question. For the STRICT "renders right now without a
 * conditional selection" question, intersect against `controlSurfacesFor`.
 */
export function isSurfaceValidForScene(
    sceneId: SceneId,
    surface: ControlSurface,
): boolean {
    if (controlSurfacesFor(sceneId).includes(surface)) return true;
    return (CONDITIONAL_SURFACES[sceneId] ?? []).includes(surface);
}

/**
 * Project the BUILT-IN editor triad through the DFA for a scene: the subset of
 * {controls,keyframes,timeline} this scene is allowed to show. The tab hosts
 * render exactly these built-in triggers (the easing scene → [], so NO
 * keyframes/timeline node exists for it), then UNION the machine-projected
 * `extraControlTabs` (`extraControlTabsFor` — the scene-specific surfaces' tab
 * metadata). KISS·DRY: one authority for the triad's per-scene visibility.
 */
export function builtInSurfacesFor(sceneId: SceneId): ControlSurface[] {
    const valid = controlSurfacesFor(sceneId);
    return BUILT_IN_SURFACES.filter((s) => valid.includes(s));
}

// ── THE EXTRA-TAB PROJECTION (J.W0.S3 — the dock trigger born-correct) ───────
// The scene-specific surfaces' TAB METADATA (value + label + icon), single-
// sourced HERE beside the DFA table that declares WHERE each surface is valid.
// Formerly each scene component carried its own `extraControlTabs` computed and
// the App re-bound it through `sceneRef` — so the dock's trigger label arrived
// a tick LATE, gated on the destination scene's <Suspense> mount (the
// scene-control-dfa trigger-lag race, `ci-linux-open-item.md §2`). The metadata
// is STATIC per surface; deriving it from `activeScene` through this table makes
// the dock projection settle synchronously with the route transition.

/** A dock/tab-host descriptor for a control surface. The `icon` is a key into
 *  the host's icon-COMPONENT registry (ChromeDock `TAB_ICONS` — a string→
 *  component map, not metadata). */
export interface ControlSurfaceTab {
    value: ControlSurface;
    label: string;
    icon?: string;
}

/**
 * THE ONE SURFACE-METADATA REGISTRY (T.B2 — the triplication fold). The
 * surface→{label,icon} map formerly existed THREE times — `SCENE_SURFACE_TABS`
 * here, `BUILT_IN_TAB_META` in AnimationControls.vue, `BUILT_IN_CONTROL_TABS`
 * in ChromeDock.vue — three hand-synced copies of one fact. This is the SINGLE
 * source: both docks and the in-panel strip derive their tab descriptors from
 * it (ChromeDock's `TAB_ICONS` survives as the string→component ICON registry,
 * a render concern, not metadata). Total over the ControlSurface alphabet.
 */
export const SURFACE_META: Record<ControlSurface, ControlSurfaceTab> = {
    controls: { value: "controls", label: "Controls", icon: "SlidersHorizontal" },
    keyframes: { value: "keyframes", label: "Keyframes", icon: "Braces" },
    timeline: { value: "timeline", label: "Timeline", icon: "Clock" },
    easing: { value: "easing", label: "Easing", icon: "Activity" },
    spring: { value: "spring", label: "Spring", icon: "Activity" },
    "matrix-controls": {
        value: "matrix-controls",
        label: "Matrix Controls",
        icon: "Grid3X3",
    },
};

/**
 * The scene-specific control tabs for a scene — the dock's `extraControlTabs`,
 * derived PURELY from the DFA table (the same `controlSurfacesFor(activeScene)`
 * authority that already owns the SET), NOT from a mounted scene component.
 *
 * `activeConditionals` carries the conditional surfaces currently active (cube's
 * `matrix-controls` while the Matrix animation is selected — the caller supplies
 * the predicate result, a stored synchronous fact). The intersection with
 * `CONDITIONAL_SURFACES[sceneId]` keeps the projection TOTAL: a conditional that
 * is not declared for the scene can never render there.
 */
export function extraControlTabsFor(
    sceneId: SceneId,
    activeConditionals: readonly ControlSurface[] = [],
): ControlSurfaceTab[] {
    const statics = controlSurfacesFor(sceneId).filter(
        (s) => !BUILT_IN_SURFACES.includes(s),
    );
    const conditionals = (CONDITIONAL_SURFACES[sceneId] ?? []).filter((s) =>
        activeConditionals.includes(s),
    );
    return [...statics, ...conditionals].flatMap((s) => {
        const tab = SURFACE_META[s];
        return tab ? [tab] : [];
    });
}

// ── THE SELECTED-SURFACE SINGLE AUTHORITY (I.W2.S1) ──────────────────────────
// The order-independent control-panel mount projection I.W1's S3 consumes. The
// SELECTED control surface is a PURE FUNCTION of (the scene's DFA-valid set ×
// the group's preferred pick) — never a free `storedControls.selectedControl`
// that a scene mutates in `setup` and hopes wins the reka `<Tabs>` latch race.
//
// THE CONTRACT: the selected surface is `preferred` IFF it is a VALID member of
// the scene's surface set; otherwise it DEFAULTS to the scene's first valid
// surface (the deterministic floor). So on a switch the model-value is born
// correct on the very tick the `<Tabs>` root mounts — the reka `useVModel`
// `passive`-latch is taken with `"easing"` (not `undefined`/stale), and the
// fresh + switched paths CONVERGE. A multi-pane scene (cube/amiga) keeps its
// user pick (a valid member); a single-surface scene (easing/spring) ALWAYS
// resolves its sole surface regardless of a stale stored pick from another
// scene. This is `controlSurfacesFor(activeScene)` projected onto a single
// selected value — the same single-authority the DFA already owns for the SET,
// extended to the SELECTED member.

/**
 * Resolve the SELECTED control surface for a scene as a pure function of the
 * DFA set × a preferred pick × the ACTIVE conditional surfaces. Returns the
 * scene's first valid surface when the preference is absent / not a valid
 * member (the deterministic default), so the value is synchronously correct on
 * the mounting tick (no latch race).
 *
 * `activeConditionals` (J.W2 S2 / DS-1) carries the conditional surfaces
 * CURRENTLY active (cube's `matrix-controls` while the Matrix animation is
 * selected — the same caller-supplied predicate `extraControlTabsFor` consumes).
 * A preferred CONDITIONAL surface is honored ONLY while its condition holds;
 * when the condition lapses (the Matrix animation deselects) the projection
 * itself falls back to the scene's first static surface (`"controls"` for
 * cube) — the fallback is a function OF the DFA, computed at the single
 * writer, NOT a scene-side imperative (the deleted `CubeScene` rogue watch).
 *
 * `undefined` only when the scene has NO valid surfaces (home/sequence) —
 * those scenes mount no control pane, so there is no selected surface to
 * project.
 */
export function selectedControlSurfaceFor(
    sceneId: SceneId,
    preferred?: string,
    activeConditionals: readonly ControlSurface[] = [],
): ControlSurface | undefined {
    const valid = controlSurfacesFor(sceneId);
    if (valid.length === 0) return undefined;
    if (!preferred) return valid[0];
    // Honor the preferred pick when it is a STATIC member of the scene's set, or
    // a CONDITIONAL member whose condition is CURRENTLY active (declared for the
    // scene AND supplied by the caller). A stale conditional pick (the condition
    // lapsed) or a cross-scene pick DEFAULTS to the scene's first static surface
    // (the deterministic floor — a single-surface scene always resolves its sole
    // surface, immune to a stale pick from another scene).
    const pick = preferred as ControlSurface;
    if (valid.includes(pick)) return pick;
    if (
        (CONDITIONAL_SURFACES[sceneId] ?? []).includes(pick) &&
        activeConditionals.includes(pick)
    ) {
        return pick;
    }
    return valid[0];
}

// ── THE DOCK CARDINALITY PROJECTION (T.B5-MODEL — the ONE elision rule) ───────
// VERDICT #17 ("when we have a page with ONE option … elide that intelligently")
// + #6 (the superfluous divider). Single-option elision was half-built, DUPLICATED
// across three sites (ChromeDock `multipleControlTabs`, TransportDock
// `animationNames.length`, AnimationControls `isSingleSurfaceScene`), and each
// SUBSTITUTED A STATIC LABEL instead of eliding — the very move the owner rejected
// (owner shot 14's second "Spring"). This is the ONE derived cardinality model both
// docks read, so the elision is decided in ONE place and consumed identically.
//
// Lane 3 (the dock host) CONSUMES this projection and DELETES the per-dock `.length`
// arithmetic + the static-label branches. This module is the single writer of the
// order-of-truth; it renders no chrome itself.

/**
 * The control-surface zone's cardinality state. `select` (>1 surface) draws the
 * dock `Select`; `inline` (exactly 1) draws the tab body with ZERO dock chrome and
 * NO static-label duplicate; `absent` (0) draws NO node AND no flanking separator.
 */
export type ControlZone =
    | { kind: "select"; tabs: ControlSurfaceTab[] }
    | { kind: "inline"; tab: ControlSurfaceTab }
    | { kind: "absent" };

/**
 * The transport-channel zone's cardinality state. `select` (>1 channel) draws the
 * transport `Select`; `absent` (≤1) draws NO node and no flanking separator — a
 * lone channel needs no picker (its identity is the scene's).
 */
export type ChannelZone =
    | { kind: "select"; channels: string[] }
    | { kind: "absent" };

/**
 * The ONE derived dock cardinality model both docks read (T.B5). `controlZone`
 * and `channelZone` decide select-vs-inline-vs-absent from the SAME axis-counts,
 * so the dock never re-derives `.length > 1` per site. `controlLabelRedundant`
 * carries the cross-axis clause (lane 30 rec 4): the sole control-surface identity
 * is a strict subset of the adjacent scene identity already shown — so the answer
 * is RENDER NOTHING, not a demoted label.
 */
export interface DockCardinality {
    controlZone: ControlZone;
    channelZone: ChannelZone;
    /**
     * The cross-axis redundancy clause: the control zone is `inline` AND its sole
     * tab's identity duplicates the adjacent scene identity already shown (owner
     * shot 14's "Spring\nSpring" → "Spring"). Lane 3 renders nothing for the
     * control zone when this holds.
     */
    controlLabelRedundant: boolean;
}

/**
 * Derive the dock cardinality model from the two axis inputs. PURE — it counts the
 * control-surface tabs and the transport channels and resolves the cross-axis
 * redundancy against the scene label; it holds no dock state and draws no chrome.
 *
 * `tabs` — the scene's control-surface tab descriptors (the derived triad + facet
 *          set once T.B2 lands; the DFA-projected set today).
 * `channels` — the transport channel names (`facility.channels.map(c => c.name)`).
 * `sceneLabel` — the scene identity already shown by the adjacent scene-select
 *          (the cross-axis redundancy comparand); omit for scenes with no adjacent
 *          scene label.
 */
export function dockCardinality(input: {
    tabs: readonly ControlSurfaceTab[];
    channels: readonly string[];
    sceneLabel?: string;
}): DockCardinality {
    const { tabs, channels, sceneLabel } = input;

    let controlZone: ControlZone;
    if (tabs.length > 1) {
        controlZone = { kind: "select", tabs: [...tabs] };
    } else if (tabs.length === 1) {
        controlZone = { kind: "inline", tab: tabs[0]! };
    } else {
        controlZone = { kind: "absent" };
    }

    const channelZone: ChannelZone =
        channels.length > 1
            ? { kind: "select", channels: [...channels] }
            : { kind: "absent" };

    // The cross-axis subset test: a lone control-surface label whose identity the
    // adjacent scene-select already shows is redundant — render nothing, not a
    // demoted static label (owner shot 14).
    const controlLabelRedundant =
        controlZone.kind === "inline" &&
        !!sceneLabel &&
        controlZone.tab.label.trim().toLowerCase() ===
            sceneLabel.trim().toLowerCase();

    return { controlZone, channelZone, controlLabelRedundant };
}
