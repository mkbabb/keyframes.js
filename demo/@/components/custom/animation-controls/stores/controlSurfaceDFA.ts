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
 * `easing`/`spring`/`matrix-controls` are the scene-specific surfaces a scene
 * injects via its `extraControlTabs` (the tab-metadata carrier). The DFA is the
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
 *   • cube/amiga/    → [controls, keyframes, timeline]  (the full editor triad;
 *     square                                             cube ADDS matrix-controls
 *                                                        CONDITIONALLY — see below)
 *   • easing         → [easing]                         (ONLY easing — NOT the
 *                                                        meaningless keyframes/
 *                                                        timeline triad)
 *   • spring         → [spring]                         (ONLY spring)
 *   • sequence       → []                               (self-contained transport
 *     / motion-path                                      ON the stage; no panel —
 *                                                        isControlsPanelOpen=false)
 *
 * CUBE'S matrix-controls is a CONDITIONAL surface (valid only while the Matrix
 * animation is selected). It is therefore NOT a static table member; it stays a
 * DYNAMIC surface the cube scene injects via `extraControlTabs` (the existing
 * mechanism). The static table enumerates the surface set that holds REGARDLESS
 * of the in-scene selection; the conditional extra composes on top (the host
 * unions the DFA set with `extraControlTabs`). The cube's CONDITIONAL ceiling is
 * recorded in `CONDITIONAL_SURFACES` so the navigation-matrix gate knows the cube
 * cell's full possible set is DEFINED.
 */
export const CONTROL_SURFACES: Record<SceneId, ControlSurface[]> = {
    home: [],
    cube: ["controls", "keyframes", "timeline"],
    amiga: ["controls", "keyframes", "timeline"],
    square: ["controls", "keyframes", "timeline"],
    easing: ["easing"],
    spring: ["spring"],
    sequence: [],
    "motion-path": [],
};

/**
 * The CONDITIONAL surfaces a scene MAY add on top of its static set, gated by an
 * in-scene selection (cube's matrix-controls appears only when the Matrix
 * animation is selected). Enumerated so the navigation-matrix gate can assert the
 * cube cell's FULL possible surface set is DEFINED (no undefined behavior even
 * with the conditional extra). The scene injects these at runtime via
 * `extraControlTabs`; the DFA records that they are EXPECTED + valid.
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
 * keyframes/timeline node exists for it), then UNION the scene's
 * `extraControlTabs` (the scene-specific surfaces' tab metadata). KISS·DRY: one
 * authority for the triad's per-scene visibility.
 */
export function builtInSurfacesFor(sceneId: SceneId): ControlSurface[] {
    const valid = controlSurfacesFor(sceneId);
    return BUILT_IN_SURFACES.filter((s) => valid.includes(s));
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
 * DFA set × a preferred pick. Returns the scene's first valid surface when the
 * preference is absent / not a valid member (the deterministic default), so the
 * value is synchronously correct on the mounting tick (no latch race).
 *
 * `undefined` only when the scene has NO valid surfaces (home/sequence/path) —
 * those scenes mount no control pane, so there is no selected surface to
 * project.
 */
export function selectedControlSurfaceFor(
    sceneId: SceneId,
    preferred?: string,
): ControlSurface | undefined {
    const valid = controlSurfacesFor(sceneId);
    if (valid.length === 0) return undefined;
    // Honor the preferred pick when it is valid for the scene — INCLUDING the
    // CONDITIONAL surfaces (cube's `matrix-controls`, injected via
    // `extraControlTabs` while the Matrix animation is selected). `isSurfaceVal…`
    // unions the static set with the conditional set, so a multi-pane scene
    // keeps its user pick (controls/keyframes/timeline/matrix-controls). An
    // absent / invalid preference DEFAULTS to the scene's first STATIC surface
    // (the deterministic floor — a single-surface scene always resolves its sole
    // surface, immune to a stale pick from another scene).
    if (preferred && isSurfaceValidForScene(sceneId, preferred as ControlSurface)) {
        return preferred as ControlSurface;
    }
    return valid[0];
}
