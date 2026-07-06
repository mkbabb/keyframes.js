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
    // (proof:design-refinement RETIRED at T.M7/T.M8 batch ⑧ — the axis shrinks with
    //  the roster; its FROZEN KILL discharge lives in scripts/gate-bands.mjs.)
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
    // T.D9/T.D11/T.D13 — the born-OWNER hero oracles (they replaced the retired
    // hero-rung/-balance/-cls INSTRUMENT locks; gate-bands.mjs DISCHARGE) + the
    // T.D14 recurrence guard (a cursor-light effect is an appearance surface).
    "proof:hero-two-focal",
    "proof:hero-deck-voice",
    "proof:cursor-light-subtle",
    "proof:no-hand-rolled-cursor-tracker",
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
    "proof:panel-naked-rail",
    "proof:stage-visible",
    // T.G1 — the blur de-layer's perf acceptance gate (perceived perf = how the
    // demo FEELS, VERDICT #19). INSTRUMENT (a measured toggle-delta fact), NOT the
    // OWNER perceived-perf bar (those are T.G6/T.G7/T.G9).
    "proof:blur-not-resampled",
    // T.G7 — the CDP-counter perf oracle. This IS the OWNER perceived-perf bar
    // (VERDICT #19 "god awful on every single page"): its verdict is the absolute
    // felt-performance axis C-10 forbade a LIBRARY gate but the demo requires. OWNER
    // + blocking-not-OBSERVE (T.M6.2) — it may NOT ride the OBSERVE bucket the way
    // perf-frame-budget's rAF-interval clauses do (that demotion is why the 20fps
    // stage rode green). Born-RED; a recorded T_BORNRED_BACKLOG tripwire, dischargedBy T.G1.
    "proof:perf-counters",
    // T.C5 — the two dock RENDER acceptance gates (GU-1/GU-2). A "blurry janky
    // dock" is a taste-authority surface (VERDICT #4) — OWNER + blocking-not-OBSERVE
    // (T.M6): a resting blur-blob / a jump-cut morph may not ride non-blocking.
    "proof:dock-rest-crisp",
    "proof:dock-morph-continuity",
    // T.C7 — the three STRUCTURAL dock oracles (grammar / elision / single tooltip).
    // INSTRUMENT: they assert falsifiable structure (DockSeparator grammar, zero
    // static-label nodes, zero native `title=`), NOT the dock aesthetic — the "two
    // quiet instruments" composition rides T.M's capture sign-off (taste-packet),
    // never a standalone born-RED (the T.A2 precedent).
    "proof:dock-grammar",
    "proof:dock-elision",
    "proof:dock-single-tooltip",
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
    // (proof:gesture-manifest / proof:easter-egg RETIRED at T.M7/T.M8 batch ⑧ —
    //  gesture-manifest via the RETIREMENT_LEDGER, easter-egg (FROZEN) via a KILL
    //  discharge; the axis shrinks with the roster.)
    "proof:compose-scene",
    "proof:appearance-suffusion",
    "proof:accent-census",
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
    // T.D7 — the violet-accent oracle: its green window IS the OD-6-blessed ramp
    // (APPROVED 2026-07-05 "Good.", the P-THEME reference worktree) — unreachable
    // without the committed owner token, so OWNER by construction. BLOCKING
    // (correctness roster), per the T.M6.2 blocking-not-OBSERVE tooth.
    "proof:accent-census": "OWNER",
    // T.C5 (GU-1/GU-2) — the dock render acceptance gates. OWNER + blocking-not-
    // OBSERVE: a "blurry janky dock" (VERDICT #4) may not stand green as a mere
    // machine fact nor ride an OBSERVE bucket. Born-RED until the glass-ui re-pin.
    "proof:dock-rest-crisp": "OWNER",
    "proof:dock-morph-continuity": "OWNER",
    // T.D9/T.D11/T.D13 (batch ⑤) — the hero oracles are OWNER by construction:
    // each one's green window IS a committed owner token — the OD-4 APPROVED
    // home composition (hero-two-focal: the φ-band two-focal seat; deck-voice:
    // the serif-italic ramp the live review resolved) and the OD-2 AMENDED
    // subtlety bound (cursor-light-subtle encodes the ≤0.1 ceiling, strictly
    // under the P-HERO 0.15 wall). BLOCKING (correctness roster), per the
    // T.M6.2 blocking-not-OBSERVE tooth.
    "proof:hero-two-focal": "OWNER",
    "proof:hero-deck-voice": "OWNER",
    "proof:cursor-light-subtle": "OWNER",
    // T.G7 (T.M6 coordination — the doctrine is T.M's, the gate is T.G's; charter §1).
    // The OWNER perceived-perf bar (VERDICT #19): its green cannot be reached without
    // the demo actually being fast (the live-blur/neutralized CDP TaskDuration toggle-
    // delta within budget). BLOCKING-not-OBSERVE per T.M6.2 — the single most important
    // lesson of the T.G band (every existing perf instrument was neutered to OBSERVE).
    // Born-RED today; a recorded T_BORNRED_BACKLOG tripwire (not the OBSERVE bucket).
    "proof:perf-counters": "OWNER",
    // T.G9 (lighthouse-mobile, the mobile half of the perceived bar) — its OWNER
    // flip is DEFERRED, not dropped: the gate rides demo-roster OBSERVE_GATES today
    // (bucket 3 — the lighthouse binary is absent in CI), and flipping it to OWNER
    // while it sits in the OBSERVE bucket would red T.M6.2 with no calibrated runner
    // to make it actually blocking. The T-open born-RED baseline is COMMITTED
    // (scripts/baselines/lighthouse-mobile-t-open.json) and its integrity clause is
    // device-independent + always-on; the OWNER flip dischargedBy the calibrated
    // runner provisioning (T.G9 lockstep → T.Z/T.S deploy-of-record) + the mobile
    // perf cure lifting every scene to its B floor. Recorded here so the deferral is
    // explicit, not a silent drop.
    // (proof:owner-golden lands with T.A/T.D renders — its OWNER row is added then)

    // ── INSTRUMENT authority (correctness facts; may NOT stand as the appearance bar) ──
    // T.C7 — the structural dock oracles (the meta-fact cure: the S roster never
    // looked at a dock's grammar). Falsifiable structure, not the dock aesthetic.
    "proof:dock-grammar": "INSTRUMENT",
    "proof:dock-elision": "INSTRUMENT",
    "proof:dock-single-tooltip": "INSTRUMENT",
    "proof:idioms": "INSTRUMENT",
    "proof:phi-leaf-zero": "INSTRUMENT",
    "proof:icon-idiom": "INSTRUMENT",
    "proof:styling-idioms": "INSTRUMENT",
    "proof:scene-parity": "INSTRUMENT",
    "proof:typing-dots": "INSTRUMENT",
    "proof:dogfood-hero": "INSTRUMENT",
    "proof:crayon-preserved": "INSTRUMENT",
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
    // (hero-rung/-balance/-cls rows removed WITH their retirement — the axis
    //  shrinks with the roster, per this module's header contract.)
    // T.D14 — the no-hand-rolled-cursor-tracker recurrence guard asserts a
    // structural absence fact (a grep), never taste: INSTRUMENT (T.D14 spec).
    "proof:no-hand-rolled-cursor-tracker": "INSTRUMENT",
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
    // T.B4 (OD-5 #7): the RULED naked-rail/DFA-elision facts (border/count/
    // placement) — INSTRUMENT by the doctrine's own examples. The two-panel
    // COMPOSITION is the separate born-OWNER surface (proof:panel-composition,
    // PENDING-OWNER; not authored here).
    "proof:panel-naked-rail": "INSTRUMENT",
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
