/**
 * gate-authority — T.M6 (`proof:gate-authority`). THE AUTHORITY AXIS.
 *
 * The S.A4 re-taxonomy fixed the TIER question (hygiene vs correctness, source vs
 * runtime — proof:gate-is-runtime enforces it). It never touched the AUTHORITY
 * question: *who blesses appearance and taste, and is that blessing a blocking
 * gate?* This module is the single source for that axis.
 *
 * Two authority values (lane 29 rec 7 · Part III doctrine):
 *   - INSTRUMENT — the gate asserts a CORRECTNESS fact (a family, a bbox, a count,
 *                  a placement, a drift). Its green is a machine fact. An INSTRUMENT
 *                  gate may NOT stand as the appearance BAR.
 *   - OWNER      — the gate's green cannot be reached without a committed owner
 *                  token (a filled verdict / a blessed golden). It carries taste
 *                  authority. An OWNER gate must be BLOCKING — it may NOT be demoted
 *                  to the OBSERVE-only bucket (the blocking-not-OBSERVE tooth, so a
 *                  sitewide "god awful" cannot ride non-blocking, VERDICT #19).
 *
 * `proof:gate-authority` REDs when a LIVE appearance-touching gate (a member of
 * APPEARANCE_TOUCHING below that resolves to a package.json script) carries NO
 * authority declaration here, and when an OWNER-authority gate rides an OBSERVE
 * bucket (demo-roster OBSERVE_GATES / OBSERVE_IN_CI). A gate RETIRED by a band
 * (absent from package.json) is simply skipped — the axis shrinks with the roster,
 * so this module is merge-safe against the parallel T.E deletions.
 *
 * This is the DOCTRINE home. T.G's whole-roster perf gate, when it lands, declares
 * OWNER authority + blocking HERE (charter §1 hand-off; T.M6 enforces, T.G authors).
 */

/**
 * The appearance-touching gate set — every gate whose verdict bears on how the
 * running demo LOOKS / FEELS / reads (idiom locks, hero/layout/dock geometry,
 * scene-render subjects, the born-OWNER class). NOT the full 203 roster — the
 * pure library value-proofs (proof:replay-equality, proof:grammar-fuzz, …) and the
 * structural/boundary hygiene gates (proof:boundary, proof:no-flat-siblings, …)
 * are NOT appearance-touching and carry no authority declaration by design.
 *
 * A gate listed here that is LIVE (in package.json) MUST have a GATE_AUTHORITY
 * entry below. Membership here is the "this gate touches appearance" assertion; the
 * authority value is the "who blesses it" assertion.
 */
export const APPEARANCE_TOUCHING = [
    // idiom / hero / cartoon design-idiom locks
    "proof:idioms",
    "proof:phi-leaf-zero",
    "proof:icon-idiom",
    "proof:styling-idioms",
    "proof:scene-parity",
    "proof:typing-dots",
    "proof:dogfood-hero",
    "proof:crayon-preserved",
    "proof:design-refinement",
    // easing-scene appearance locks
    "proof:easing-canvas-bounded",
    "proof:scene-uses-standard-ribbon",
    "proof:easing-sidebar-normalized",
    "proof:easing-sidebar-minimal",
    "proof:easing-stage-is-ball",
    // card / stage / dock geometry locks
    "proof:scene-card-rounded",
    "proof:stage-glass-card",
    "proof:card-rounded-primitive",
    "proof:stage-within-docks",
    "proof:mobile-single-page",
    "proof:bezier-no-scroll",
    "proof:bezier-single-card",
    "proof:bezier-grown",
    "proof:pp-logo-svg",
    "proof:hero-rung",
    "proof:hero-balance",
    "proof:hero-cls",
    "proof:cartoon-is-panel-depth",
    "proof:glass-and-cartoon",
    "proof:dock-popover-opens",
    "proof:single-toggle",
    "proof:darkmode-row-toggle",
    "proof:idle-fade",
    "proof:single-column-pack",
    "proof:label-subgrid",
    "proof:timeline-rail-width",
    "proof:demo-shell-grid",
    "proof:layout-cluster",
    "proof:stage-not-clipped",
    "proof:cartoon-shadow-unclipped",
    "proof:dock-zorder",
    "proof:drawer-spring",
    "proof:stage-visible",
    // T.G1 — the blur de-layer's perf acceptance gate (perceived perf = how the
    // demo FEELS, VERDICT #19). INSTRUMENT (a measured toggle-delta fact), NOT the
    // OWNER perceived-perf bar (those are T.G6/T.G7/T.G9).
    "proof:blur-not-resampled",
    // scene-subject render gates (the ones the verdict cited)
    "proof:subject-animates",
    "proof:orbital-rotate3d",
    "proof:amiga-subject-is-pivot",
    "proof:amiga-decay-visible",
    "proof:icon-paint-live",
    "proof:morph-scene",
    "proof:motion-path-editable",
    "proof:motion-path-copy",
    "proof:motion-path-scale",
    "proof:square-honest",
    "proof:gesture-manifest",
    "proof:easter-egg",
    "proof:compose-scene",
    "proof:appearance-suffusion",
    "proof:specular-absent-at-rest",
    "proof:demo-fonts",
    "proof:font-census",
    "proof:demo-elevate",
    "proof:demo-usability",
    "proof:demo-no-oversize",
    "proof:no-single-option-select",
    // the appearance TRIPWIRE + self-baseline drift check (INSTRUMENT — authority
    // STRIPPED at I.W7 S5; retired/demoted by T.M3 owner-golden)
    "proof:visual-lock",
    // the born-OWNER gate class (T.M) — OWNER authority by construction
    "proof:owner-verdict-recorded",
    "proof:stage-inventory",
    "proof:subject-legible",
    "proof:subject-full",
];

/**
 * The authority declaration per appearance-touching gate. INSTRUMENT unless the
 * gate's green requires a committed owner token (the born-OWNER class).
 *
 * The retained S appearance gates are INSTRUMENT: they assert a correctness fact
 * (a bbox, a placement, a family, a count) and — per the T doctrine — may NOT
 * stand as the appearance bar. The born-OWNER T.M gates are OWNER: their green
 * cannot be reached without a filled verdict / blessed golden / owner-sanctioned
 * manifest.
 */
export const GATE_AUTHORITY = {
    // ── OWNER authority (born-OWNER class; green needs a committed owner token) ──
    "proof:owner-verdict-recorded": "OWNER",
    "proof:stage-inventory": "OWNER",
    "proof:subject-legible": "OWNER",
    "proof:subject-full": "OWNER",
    // (proof:owner-golden lands with T.A/T.D renders — its OWNER row is added then)

    // ── INSTRUMENT authority (correctness facts; may NOT stand as the appearance bar) ──
    "proof:idioms": "INSTRUMENT",
    "proof:phi-leaf-zero": "INSTRUMENT",
    "proof:icon-idiom": "INSTRUMENT",
    "proof:styling-idioms": "INSTRUMENT",
    "proof:scene-parity": "INSTRUMENT",
    "proof:typing-dots": "INSTRUMENT",
    "proof:dogfood-hero": "INSTRUMENT",
    "proof:crayon-preserved": "INSTRUMENT",
    "proof:design-refinement": "INSTRUMENT",
    "proof:easing-canvas-bounded": "INSTRUMENT",
    "proof:scene-uses-standard-ribbon": "INSTRUMENT",
    "proof:easing-sidebar-normalized": "INSTRUMENT",
    "proof:easing-sidebar-minimal": "INSTRUMENT",
    "proof:easing-stage-is-ball": "INSTRUMENT",
    "proof:scene-card-rounded": "INSTRUMENT",
    "proof:stage-glass-card": "INSTRUMENT",
    "proof:card-rounded-primitive": "INSTRUMENT",
    "proof:stage-within-docks": "INSTRUMENT",
    "proof:mobile-single-page": "INSTRUMENT",
    "proof:bezier-no-scroll": "INSTRUMENT",
    "proof:bezier-single-card": "INSTRUMENT",
    "proof:bezier-grown": "INSTRUMENT",
    "proof:pp-logo-svg": "INSTRUMENT",
    "proof:hero-rung": "INSTRUMENT",
    "proof:hero-balance": "INSTRUMENT",
    "proof:hero-cls": "INSTRUMENT",
    "proof:cartoon-is-panel-depth": "INSTRUMENT",
    "proof:glass-and-cartoon": "INSTRUMENT",
    "proof:dock-popover-opens": "INSTRUMENT",
    "proof:single-toggle": "INSTRUMENT",
    "proof:darkmode-row-toggle": "INSTRUMENT",
    "proof:idle-fade": "INSTRUMENT",
    "proof:single-column-pack": "INSTRUMENT",
    "proof:label-subgrid": "INSTRUMENT",
    "proof:timeline-rail-width": "INSTRUMENT",
    "proof:demo-shell-grid": "INSTRUMENT",
    "proof:layout-cluster": "INSTRUMENT",
    "proof:stage-not-clipped": "INSTRUMENT",
    "proof:cartoon-shadow-unclipped": "INSTRUMENT",
    "proof:dock-zorder": "INSTRUMENT",
    "proof:drawer-spring": "INSTRUMENT",
    "proof:stage-visible": "INSTRUMENT",
    "proof:blur-not-resampled": "INSTRUMENT",
    "proof:subject-animates": "INSTRUMENT",
    "proof:orbital-rotate3d": "INSTRUMENT",
    "proof:amiga-subject-is-pivot": "INSTRUMENT",
    "proof:amiga-decay-visible": "INSTRUMENT",
    "proof:icon-paint-live": "INSTRUMENT",
    "proof:morph-scene": "INSTRUMENT",
    "proof:motion-path-editable": "INSTRUMENT",
    "proof:motion-path-copy": "INSTRUMENT",
    "proof:motion-path-scale": "INSTRUMENT",
    "proof:square-honest": "INSTRUMENT",
    "proof:gesture-manifest": "INSTRUMENT",
    "proof:easter-egg": "INSTRUMENT",
    "proof:compose-scene": "INSTRUMENT",
    "proof:appearance-suffusion": "INSTRUMENT",
    "proof:specular-absent-at-rest": "INSTRUMENT",
    "proof:demo-fonts": "INSTRUMENT",
    "proof:font-census": "INSTRUMENT",
    "proof:demo-elevate": "INSTRUMENT",
    "proof:demo-usability": "INSTRUMENT",
    "proof:demo-no-oversize": "INSTRUMENT",
    "proof:no-single-option-select": "INSTRUMENT",
    "proof:visual-lock": "INSTRUMENT",
};

export const VALID_AUTHORITIES = new Set(["INSTRUMENT", "OWNER"]);
