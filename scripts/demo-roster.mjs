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
    // S.B3 EN-a/EN-b — the browser-parse library-value gate. A browser-HARNESS
    // member (jsdom's getComputedStyle does NOT drop an invalid `animation`
    // shorthand, so the EN-a bug is INVISIBLE in jsdom — a jsdom slot would be a
    // FALSE green + would correctly RED under S.A4's symmetric mis-tier clause);
    // it rides HERE beside the other browser actuators, NOT the jsdom
    // proof:library-correctness roster. Its jsdom-viable STRING half lives in
    // proof:compile-replay (fast local bite); THIS is the browser half.
    "proof:compile-browser-parse",
    // S.F1 View Transitions — the browser-actuating VT round-trip library-value
    // gate (SF-5, p09). A browser-HARNESS member: the ::view-transition-* pseudo
    // tree + getAnimations() over it are browser artifacts (jsdom has NO View
    // Transitions, so "the group pseudo carries the emitted duration" is INVISIBLE
    // there — a jsdom slot would be a FALSE green + correctly RED under S.A4's
    // symmetric mis-tier clause). It rides HERE beside the other browser actuators.
    // STRUCTURAL + one settled-rect clause; no per-frame pixel/ms threshold (C-10).
    "proof:vt-roundtrip",
    // S.F3 EN-c — the browser-actuating entry/exit round-trip library-value gate
    // (C-22; P2-2). A browser-HARNESS member: `@starting-style`/`allow-discrete`/
    // `overlay`/the CSSTransition tree are platform artifacts jsdom does NOT run
    // (a jsdom slot would be a FALSE green + correctly RED under S.A4's symmetric
    // mis-tier clause). It rides HERE beside the other browser actuators.
    // SCRUB-BASED structural (S1–S7); zero frame/ms races (C-10).
    "proof:entry-roundtrip",
    // S.F2 SplitText — the browser-actuating a11y-tree library-value gate (T8).
    // A browser-HARNESS member: the COMPUTED accessible name is a browser
    // artifact (jsdom does not run the ARIA name-computation algorithm, so a
    // jsdom slot could only check the raw aria-label ATTRIBUTE — source-shape —
    // never that a plain <div> role=generic would DROP the label; a jsdom slot
    // would be a FALSE green + correctly RED under S.A4's symmetric mis-tier
    // clause). It rides HERE beside the other browser actuators, NOT the jsdom
    // proof:library-correctness roster. Its jsdom-viable half (the a11y ATTRIBUTE
    // wiring + the by:"line" measure-or-refuse posture) lives in
    // test/orchestration/split-text.test.ts (the default vitest run); THIS is the a11y-tree half.
    "proof:split-a11y",
    // S.F4 animation-trigger — the browser-actuating library-value gate (T8). A
    // browser-HARNESS member: the native/fallback split turns on
    // CSS.supports("animation-trigger", …), which jsdom does NOT know — a jsdom
    // slot could only assert the kf state machine (the fast half in
    // test/scroll/scroll-scene.test.ts already does), never that the driver's
    // dispatch verdict MATCHES a real browser's platform support (a jsdom slot
    // would be a FALSE green + correctly RED under S.A4's symmetric mis-tier
    // clause). It rides HERE beside the other browser actuators, NOT the jsdom
    // proof:library-correctness roster. Its jsdom-viable half (the pure
    // idle→active→done state machine) lives in test/scroll/scroll-scene.test.ts
    // (the default vitest run + proof:scroll-roundtrip); THIS is the browser-
    // actuated grammar→behavior + feature-detect half.
    "proof:trigger-roundtrip",
    "proof:demo-smoke",
    "proof:occlusion",
    "proof:demo-usability",
    "proof:cold-entry",
    "proof:font-census",
    "proof:layout-cluster",
    "proof:engine-no-throw-on-play",
    "proof:subject-animates",
    // T.A1/T.A4/T.A3/T.A5 — the cube restage oracles (born-RED on the pre-cure
    // tree; green on the cured render). Silhouette+geometry: the six faces render
    // in 3D (no --spin-energy filter flatten) + .cube is side×side. Settle: the
    // graph intro is the one ease-out-back settle (≤1 overshoot). Relight-writes:
    // the quantized+memoized --lit write count stays under the absolute cap.
    "proof:cube-silhouette",
    "proof:cube-settle",
    "proof:cube-relight-writes",
    "proof:fsm-suspend-resume-live",
    "proof:easing-editor-live",
    "proof:amiga-subject-is-pivot",
    "proof:drag-gesture",
    "proof:icon-paint-live",
    // (proof:morph-scene RETIRED at T.E3 — the morph SCENE was PRUNED, OD-1 = PRUNE;
    //  the LIBRARY morph gates proof:morph-renders-d / -orients / morphsvg-consume
    //  SURVIVE.)
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
    // T.D7 (OD-6 APPROVED) — the violet-accent OWNER oracle: tokens in the
    // blessed oklch window both themes + the rendered red-census (zero
    // red-family accents outside destructive/crayon-subject surfaces). OWNER
    // authority ⇒ BLOCKING (T.M6.2) — it rides the correctness roster.
    "proof:accent-census",
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
    // S.G1 — the layout-invariant mobile stage-visibility system gate (the named
    // successor for the frozen occlusion keys; p10 F6). Runs the full 375×667
    // scene sweep on the shared harness.
    "proof:stage-visible",
    "proof:dock-zorder",
    "proof:drawer-spring",
    // T.B4 (OD-5 #7) — the naked-rail + SQ-T3 DFA-elision browser gate (static
    // half always runs; the DFA-empty + naked-rail probes need the built dist).
    "proof:panel-naked-rail",
    "proof:sheet-reopen-scroll",
    "proof:bezier-no-scroll",
    "proof:bezier-single-card",
    "proof:bezier-grown",
    "proof:scene-perf-budget",
    "proof:scene-parity",
    "proof:sequence-rows-draggable",
    // (proof:motion-path-editable / -copy / -scale RETIRED at T.E3 — the motion-path
    //  SCENE was PRUNED, OD-1 = PRUNE. The two FROZEN keys (-editable, -copy) carry
    //  machine-witnessed KILL discharges in scripts/gate-bands.mjs.)
    // S.G2 S2 (fold row 69) — the square honest-controls oracle (the lying editor
    // panel COLLAPSED; box + mono caption ARE the live controls). Browser actuator.
    "proof:square-honest",
    // S.G3 S6 (fold row 67) — the per-scene gesture census oracle: every sealed
    // affordance carries an on-stage tell + a browser-actuated reliable-primitive
    // touch path (pointer double-tap / button tap / drag — never native dblclick).
    "proof:gesture-manifest",
    "proof:easter-egg",
    "proof:design-refinement",
    // T.D9/T.D11/T.D13 (batch ⑤) — the born-OWNER hero oracles (OD-4/OD-2
    // APPROVED tokens; the P-HERO blessed reference). They REPLACE the retired
    // hero-rung/-balance/-cls FROZEN locks (machine-witnessed migrations in
    // scripts/gate-bands.mjs DISCHARGE — those three crystallized the rejected
    // word-split top-band hero). OWNER authority ⇒ BLOCKING (T.M6.2).
    "proof:hero-two-focal",
    "proof:hero-deck-voice",
    "proof:cursor-light-subtle",
    "proof:brittleness",
    "proof:modern-web",
    "proof:platform-adopt",
    // S.B8 — the doc-authority gate (root + src/animation + demo CLAUDE.md
    // path/symbol liveness). NOT a browser gate, but build-dependent like the two
    // above: clause (c) reads the built dist/keyframes.d.ts (present via `npm ci`'s
    // prepare=build:lib) and clause (b) reads dist/gh-pages — both of which the
    // demo-correctness job builds, so it rides this roster rather than the
    // glass-ui-free fast gates job. Green as of S.B8's full map regen (the 22-path
    // flat-tree backlog is discharged); a NAMED STATIC_DEMO_CARVEOUT entry in
    // proof-ci-coverage.mjs keeps clause 7 (static-gate-placement) satisfied.
    "proof:claude-paths-live",
    // T.G7 (DISCHARGED at batch ⑧ by T.G3 + T.G4) — the CDP-counter perf oracle,
    // the OWNER perceived-perf bar (VERDICT #19). Reads RecalcStyleCount/LayoutCount
    // per-frame ratios on the built dist/gh-pages: cube/spring/easing now measure
    // 0.00 recalc+layout/frame (true rest — the perpetual idle churn removed). A
    // BLOCKING member now (authority=OWNER + blocking-not-OBSERVE, T.M6.2), moved
    // OUT of T_BORNRED_BACKLOG + the ci-coverage EXCLUDED set in the same commit.
    "proof:perf-counters",
];

// ── The S.A0 enumerated born-RED BACKLOG (SPEC §3 S.A0). These four rows are a
// SUBSET of CORRECTNESS_ROSTER — they RUN and RED and keep demo-correctness RED
// (they are BLOCKING, not moved to observe), and are DISCHARGED by their named
// downstream wave. The roster driver classifies their reds as EXPECTED (the
// "failing set ⊆ backlog" verdict) so an UNEXPECTED red (an S.A2 regression) is
// distinguishable from the authorized backlog in the report-all log. ──────────
export const BACKLOG = {
    // S.G3 DISCHARGED the LAST backlog row — the roster's failing set is now EMPTY,
    // so demo-correctness goes FULL GREEN for the first time. Any future red is
    // therefore UNEXPECTED (an S.A2 regression), never an authorized carry.
    //   • proof:drag-gesture — the source seam already holds userSelect through the
    //     gesture across all 6 drag surfaces (clause a green); the flake was a
    //     clause-(b) SETTLE-PREDICATE race — a naive "poll until two reads coincide"
    //     false-settled on the live spring's post-`reseat` startup pause (dt=0 first
    //     frame). Cured honestly in the gate (C-10): persist waits a SUSTAINED-stable
    //     dwell + asserts the dragged translate held; the Home recenter waits for the
    //     REAL identity end-state, not "stopped changing." No source masking.
    // S.G2 discharged the other three S.A0 backlog rows earlier:
    //   • proof:easing-sidebar-minimal — the writable value <input> STRIPPED (B1)
    //     (EasingSidebar.vue); the dropdown is the sole selector, the readout stays.
    //   • proof:scene-perf-budget — the amiga setPixelRatio(min(dpr,2)) cap is live
    //     (useAmigaThree.ts); the A2 source anchor followed the R.W6-decomp carve.
    //   • proof:icon-paint-live — the demo-side `::view-transition-*` residue
    //     (scene-transition.css) DELETED (S11); glass-ui owns the VT look.
    // RE-OPENED 2026-07-04 at the owner live-review: the S.G3 discharge was
    // INCOMPLETE — one drag surface (easing/ribbon-slider) still leaves
    // body.is-dragging unset mid-gesture. T.S2 (lane 27 F3) root-caused it to TWO
    // defects and fixed the seam one:
    //   (1) SEAM (FIXED) — PlaybackRibbon.vue's gatedSliderDown routed a MOUSE press
    //       through glass-ui useTouchGate, whose `"ontouchstart" in window` desktop
    //       check is TRUE in Chromium, so handleTouchStart returned false on the
    //       first press and swallowed acquireSelectSuppression. Cure: mouse/pen
    //       bypass the touch gate; only genuine touch consults it (validated live —
    //       with the occluder neutralized, body.is-dragging arms on down / clears on up).
    //   (2) OCCLUSION (RESIDUAL, easing-only) — the fixed TransportDock
    //       (.menubar-safe-pb, z-40, y 767-831) overlaps the controls-pane ribbon
    //       (y 795-835) on the easing scene, so the pointerdown never reaches the
    //       slider; square/spring/sequence/bezier all pass clean. This occlusion
    //       RIDES the easing/dock redesign (T.C dock recut · T.E/T.B controls-model;
    //       T.S2 edges: ride the redesign, not harden a doomed widget), so the
    //       browser leg still reds on this ONE surface — the row STAYS, a NAMED
    //       carry, never a mask.
    "proof:drag-gesture": "T.C/T.E/T.B (dock-occlusion residual; the T.S2 seam fix landed)",
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

// ── OBSERVE-IN-CI (the header's visual-lock adjudication, made executable).
// These gates RIDE the correctness roster (amortised on the shared harness) but
// their reds RECORD in CI instead of blocking — the declared observe-only
// posture (cross-OS pixel/font-metric drift is not a product regression; the
// baselines are NOT overwritten — regenerating them to "green" the drift is the
// forbidden masking). Off-CI (on-device) they hard-gate as usual. The x2-#2
// hard clause holds: the carve-out is EXACTLY the declared-posture set, never a
// correctness red. ────────────────────────────────────────────────────────────
export const OBSERVE_IN_CI = ["proof:visual-lock"];

/** The union of every demo gate this module partitions (correctness ∪ observe ∪
 *  tripwires) — the set proof:ci-coverage counts as CI-invoked via the roster. */
export const ALL_DEMO_GATES = [
    ...CORRECTNESS_ROSTER,
    ...OBSERVE_GATES,
    ...BORNRED_TRIPWIRES,
];
