// ─────────────────────────────────────────────────────────────────────────────
// THE INSTRUMENT FACILITY (T.F5 — the GRAND COLOCATION EDICT, OWNER-ASKS row 1).
//
// The animation control panel is ONE facility, cohered here from what were four
// flat sibling peers under components/custom/. Each member is a real,
// self-barrelled instrument:
//
//   transport/  — the control shells, playback ribbon, TransportDock, the
//                 tab-panel host (AnimationControls) + its composables
//   keyframes/  — the Monaco CSS @keyframes editor
//   timeline/   — the draggable keyframe timeline
//   shell/      — the EditorShell chrome (hero, header, share, start screen)
//
// Every heavy member re-exports its SFCs LAZILY (`defineAsyncComponent`), so
// importing this umbrella never eager-loads the Monaco / highlight.js chunk —
// the idle-warm pane-reveal seam (useKeyframesPaneReveal) is preserved by
// construction (this replaces animation-transport's empty "don't import me"
// stub with a real, lazy barrel).
//
// (easing/ is a transient co-tenant here — the E8/easing terminal deletes it;
//  it is NOT a facility member and is deliberately absent from this barrel.)
// ─────────────────────────────────────────────────────────────────────────────

export * from "./transport";
export * from "./keyframes";
export * from "./timeline";
export * from "./shell";
