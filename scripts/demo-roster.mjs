/**
 * demo-roster — the SINGLE SOURCE of the S.A2 demo-gate partition (SPEC §3 S.A2).
 *
 * The monolithic `demo-smoke` CI job is split into two jobs by TIER, and this
 * module is the one place the tier membership lives (the M.W1 "membership in one
 * place" pattern) so the roster driver (`scripts/run-demo-roster.mjs`) and the
 * coverage meta-gate (`scripts/proof-ci-coverage.mjs`) can never drift onto
 * different sets:
 *
 *   demo-correctness      — BLOCKING (gates deploy). The kf-owned correctness +
 *                           hygiene demo gates. Run by the roster driver as ONE
 *                           report-all step against a SHARED chromium + a stable
 *                           dist snapshot (the S.A2 S2 net-deletion), so the job
 *                           carries ZERO step-level `continue-on-error` masking.
 *   demo-device-observe   — OBSERVE-ONLY (job-level continue-on-error; never
 *                           gates deploy). The device-dependent measurements
 *                           (LoAF / dock-perf / lighthouse) + the born-RED
 *                           tripwire — RECORDED, not blocking.
 *
 * ── THE FOUR DISPOSITION BUCKETS (SPEC §3 S.A2 S5) ────────────────────────────
 * Every per-gate red was dispositioned into one of four buckets; this partition
 * is the machine-readable outcome:
 *   1. genuine            → FOLD by cause (the discharging wave named in BACKLOG
 *                           for the four still-open A0 rows; the rest are fixed).
 *   2. absolute-threshold → RELATIVE budget (proof:perf-frame-budget, DM-12 — its
 *                           easing clause moved to a same-run cube-reference
 *                           relative budget; the whole gate rides OBSERVE).
 *   3. binary-absent      → install-or-observe (lighthouse — `npm i --no-save
 *                           lighthouse` in the observe job; the audits ride
 *                           OBSERVE, never blocking).
 *   4. stale-gate         → re-point the parser (proof:demo-usability, the R.W5
 *                           `name: s.id` route form — fixed in S.A0 S5; the
 *                           generic bucket is owned here).
 *
 * ── PER-GATE BUCKET ADJUDICATIONS (SPEC §3 S.A2 S5, the named reds) ────────────
 *   proof:perf-frame-budget → bucket 2. Easing clause moved to a same-run
 *       cube-reference RELATIVE budget (was a single absolute ceiling that flaked
 *       2..24 run-to-run — DM-12); the dock clause is a NON-BLOCKING glass-ui
 *       HANDOFF (dock width-morph → glass-ui). Whole gate is device-dependent →
 *       rides OBSERVE.
 *   proof:lighthouse-a11y / proof:lighthouse-mobile → bucket 3. The lighthouse
 *       binary is installed --no-save in the observe job (install-or-observe); the
 *       scores are environment-sensitive → OBSERVE, never blocking.
 *   proof:demo-usability → bucket 4. The route-name parser drifted from the R.W5
 *       generated `name: s.id` form; re-pointed in S.A0 S5 (a green demo must not
 *       red on the gate's own obsolescence). It is now GREEN in the correctness
 *       roster.
 *   proof:visual-lock → CROSS-ENV pixel-render, ADJUDICATED to observe-only-in-CI
 *       (it already declarePosture("observe-only") — pixel-render). Its self-
 *       captured baseline drifts on cross-OS font metrics (it REDs identically at
 *       base — ~47/40 regions — on any runner, a LINUX-vs-macOS font-hinting
 *       delta, NOT a product regression). Disposition: it RECORDS the drift and
 *       exits 0 IN CI (observe-only), hard-gating on-device only; it rides the
 *       correctness roster (amortised on the shared harness) but never blocks in
 *       CI. Its baselines are NOT overwritten — regenerating them to "green" the
 *       drift would be the forbidden masking (SPEC §3 S.A2 hard clause). Its
 *       correctness authority was already STRIPPED (I.W7 S5); it is a hygiene
 *       drift check only.
 *
 * ── THE HARD CLAUSE (SPEC §3 S.A2, x2-#2) ─────────────────────────────────────
 * The correctness↔observe split may NOT green a red whose signature reproduces
 * off-runner. OBSERVE carries ONLY genuinely device-dependent measurements
 * (throttled frame ms, cross-OS lighthouse) + the born-RED tripwire; NO
 * correctness/gate-bug red is moved here. The split is not claimed to green such
 * reds — those are discharged by cause (S.A0) or owner-ratified KILL.
 */

// ── demo-correctness (BLOCKING) — the kf-owned correctness + hygiene demo gates,
// run by the roster driver against the shared harness. Order preserves the
// former demo-smoke step order (the headline inv-γ/inv-δ pair first). ──────────
export const CORRECTNESS_ROSTER = [
    "proof:demo-smoke",
    "proof:occlusion",
    "proof:demo-usability",
    "proof:cold-entry",
    "proof:font-census",
    "proof:layout-cluster",
    "proof:engine-no-throw-on-play",
    "proof:subject-animates",
    "proof:fsm-suspend-resume-live",
    "proof:easing-editor-live",
    "proof:amiga-subject-is-pivot",
    "proof:drag-gesture",
    "proof:icon-paint-live",
    "proof:morph-scene",
    "proof:specular-absent-at-rest",
    "proof:demo-fonts",
    "proof:live-session",
    "proof:live-session-mobile",
    "proof:demo-control-point",
    "proof:easing-curve-editor",
    // proof:scene-switcher-mobile RETIRED at S.A4 (C-6, fold row 18) — a ledgered
    // KILL with a re-run witness (scripts/gate-bands.mjs DISCHARGE). It asserted a
    // mobile scroll-snap carousel + a SceneSwitcherCarousel component that does not
    // exist on disk (proof:scene-colocated ASSERTION 3), masked here by the former
    // demo-smoke continue-on-error. The stage rebirth is SHELVED with band S.E.
    "proof:amiga-decay-visible",
    "proof:appearance-suffusion",
    "proof:spring-slider-continuous",
    "proof:visual-lock",
    "proof:taste-packet",
    "proof:scene-machine-irrefragable",
    "proof:scene-control-dfa",
    "proof:control-surface-single-writer",
    "proof:scene-transition-perf",
    "proof:dock-popover-opens",
    "proof:single-toggle",
    "proof:darkmode-row-toggle",
    "proof:idle-fade",
    "proof:single-column-pack",
    "proof:label-subgrid",
    "proof:timeline-rail-width",
    "proof:demo-shell-grid",
    "proof:stage-not-clipped",
    "proof:cartoon-shadow-unclipped",
    "proof:computed-real-dom",
    "proof:decomposition",
    "proof:demo-no-oversize",
    "proof:cartoon-is-panel-depth",
    "proof:glass-and-cartoon",
    "proof:typing-dots",
    "proof:easing-canvas-bounded",
    "proof:scene-uses-standard-ribbon",
    "proof:easing-sidebar-normalized",
    "proof:easing-sidebar-minimal",
    "proof:easing-stage-is-ball",
    "proof:scene-card-rounded",
    "proof:stage-glass-card",
    "proof:card-rounded-primitive",
    "proof:stage-within-docks",
    "proof:mobile-single-page",
    "proof:dock-zorder",
    "proof:drawer-spring",
    "proof:sheet-reopen-scroll",
    "proof:bezier-no-scroll",
    "proof:bezier-single-card",
    "proof:bezier-grown",
    "proof:scene-perf-budget",
    "proof:scene-parity",
    "proof:sequence-rows-draggable",
    "proof:motion-path-editable",
    "proof:motion-path-copy",
    "proof:easter-egg",
    "proof:design-refinement",
    "proof:hero-rung",
    "proof:hero-balance",
    "proof:hero-cls",
    "proof:brittleness",
    "proof:modern-web",
    "proof:platform-adopt",
];

// ── The S.A0 enumerated born-RED BACKLOG (SPEC §3 S.A0). These four rows are a
// SUBSET of CORRECTNESS_ROSTER — they RUN and RED and keep demo-correctness RED
// (they are BLOCKING, not moved to observe), and are DISCHARGED by their named
// downstream wave. The roster driver classifies their reds as EXPECTED (the
// "failing set ⊆ backlog" verdict) so an UNEXPECTED red (an S.A2 regression) is
// distinguishable from the authorized backlog in the report-all log. ──────────
export const BACKLOG = {
    "proof:drag-gesture": "S.G3", // userSelect:auto mid-gesture
    "proof:easing-sidebar-minimal": "S.G2",
    "proof:scene-perf-budget": "S.G2", // amiga setPixelRatio(min(dpr,2)) cap (A2)
    "proof:icon-paint-live": "S.G2", // ::view-transition-* residue (glass-ui-home check)
};

// ── demo-device-observe (OBSERVE-ONLY) — the device-dependent proof:* gates.
// They ride the observe job as individual steps (so proof:ci-coverage sees them
// directly); listed here for the four-bucket disposition record + so the roster
// tooling can name them. NOT blocking, never gates deploy. ────────────────────
export const OBSERVE_GATES = [
    "proof:perf-frame-budget", // bucket 2 — relative budget; DM-12 dock clause = glass-ui HANDOFF
    "proof:lighthouse-a11y", // bucket 3 — install-or-observe (lighthouse)
    "proof:lighthouse-mobile", // bucket 3 — install-or-observe (already observe-only-in-CI)
];

// ── The born-RED-by-design tripwire (Q.WA3 S1). RECORDED in the observe job,
// never blocking (it stays RED until glass-ui BB widens its peer range + kf
// re-pins — an external HANDOFF, not an S wave). ──────────────────────────────
export const BORNRED_TRIPWIRES = ["proof:peer-satisfied"];

/** The union of every demo gate this module partitions (correctness ∪ observe ∪
 *  tripwires) — the set proof:ci-coverage counts as CI-invoked via the roster. */
export const ALL_DEMO_GATES = [
    ...CORRECTNESS_ROSTER,
    ...OBSERVE_GATES,
    ...BORNRED_TRIPWIRES,
];
