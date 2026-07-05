/**
 * gate-bands — the S.A4 machine-distinguishable gate-band manifests (SPEC §3 S.A4
 * S3/S4/S7; fold rows 18/20). The SINGLE SOURCE the `proof:ci-coverage`
 * frozen-discharge + regression-guard clauses read, so the band membership can
 * never drift onto a different set (the M.W1 "membership in one place" pattern).
 *
 * ── THE FROZEN SET (fold row 20; p08 §4 disposition=freeze-migrate) ────────────
 * The ~51 demo-appearance / demo-layout gates that accreted H–R. S authorizes them
 * as a RED-authorized ossifying set: they are FROZEN IN PLACE at S.A4 (every one is
 * still a live package.json script + still runs in its tier/roster) and each is
 * discharged LATER (S.G1 / S.D3, the demo rewrite) by EITHER —
 *   (a) MIGRATION — its live property re-asserted by a named SUCCESSOR system gate
 *       (proof:stage-visible / proof:demo-occlusion-free / proof:demo-a11y /
 *       proof:demo-dogfoods-engine, a27 F2 / S.G1); OR
 *   (b) KILL      — an owner-ratified S-ledger row with a RE-RUN WITNESS that the
 *       property is obsolete.
 * Free-prose "deletion-with-cause" is BANNED (x2-#7): the frozen-discharge clause
 * REDs if a FROZEN key is deleted from package.json without a DISCHARGE record. The
 * FROZEN reds of S.D3/S.G are only DECLARABLE against this authorized set — that is
 * why S.A4 BLOCKS those bands' born-RED appearance gates (SPEC §3 S.A4 DAG).
 *
 * The `A4 -> D2 -> D3` canonical `proof:scene-colocated` edit order (fold row 19,
 * C-24) is a SEPARATE ordering concern; scene-colocated is NOT in this set (its
 * ASSERTION 3 stays WHOLE under the no-stage status quo, C-6 re-corrected at the
 * 2026-07-03 S.E shelf).
 */
export const FROZEN_SET = [
    // idiom / hero / cartoon design-idiom locks
    "proof:idioms",
    "proof:phi-leaf-zero",
    "proof:icon-idiom",
    "proof:styling-idioms",
    "proof:scene-parity",
    "proof:typing-dots",
    "proof:dogfood-hero",
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
    "proof:crayon-preserved",
    "proof:design-refinement",
    // scene-editor / interaction appearance locks
    "proof:sequence-rows-draggable",
    // (proof:motion-path-editable / proof:motion-path-copy were FROZEN here until
    //  T.E3 KILLED them — the motion-path scene was PRUNED (OD-1 = PRUNE); their
    //  machine-witnessed KILL discharges live in DISCHARGE below.)
    "proof:easter-egg",
    "proof:demo-no-oversize",
    "proof:demo-usability",
    "proof:demo-elevate",
    "proof:taste-packet",
    // the headline demo invariants (re-authored, not deleted, by S.G1)
    "proof:occlusion",
    "proof:visual-lock",
];

/**
 * ── THE DISCHARGE LEDGER (machine-distinguishable; S.A4 S3/S4) ─────────────────
 * Keyed by a RETIRED gate's proof:* key (a FROZEN gate discharged downstream, OR a
 * C-6 zombie KILL). Each value is a STRUCTURED record the ci-coverage clause
 * machine-validates — NOT free prose:
 *
 *   { kind: "migration", successor: "proof:<live-system-gate>", note }
 *       — the live property is now asserted by a NAMED successor gate that MUST
 *         exist as a live package.json script.
 *   { kind: "kill", ledger: "<S-ledger row>", witness: { cmd, cite } }
 *       — an owner-ratified KILL. `witness.cmd` names the retired gate's script;
 *         the clause RE-VERIFIES (every run) that script is GONE from disk AND the
 *         key is absent AND the roster membership is gone — the "re-run witness".
 *         `witness.cite` names the live evidence the property is obsolete.
 *
 * A retired FROZEN key with NO record here REDs (free-prose deletion banned); a
 * KILL record with no witness REDs; a migration whose successor is not live REDs.
 *
 * Discharges: the C-6 `proof:scene-switcher-mobile` KILL (fold row 18 — the zombie
 * gate asserting a component that does not exist) + the T.E3 KILLs of
 * `proof:motion-path-editable` / `proof:motion-path-copy` (OD-1 = PRUNE — the
 * motion-path scene those interaction locks asserted was pruned outright).
 */
export const DISCHARGE = {
    // T.E3 (OD-1 = PRUNE) — the motion-path SCENE was pruned outright, so its two
    // FROZEN interaction-appearance locks (which asserted the editable control-net
    // + the copyable offset-path artifact ON that scene) are obsolete. Owner-ruled
    // KILL: OD-1 RULED PRUNE (FINAL) 2026-07-05. The re-run witness re-verifies
    // every run that the script is gone from disk, the key is absent, and the
    // CORRECTNESS_ROSTER membership is gone.
    "proof:motion-path-editable": {
        kind: "kill",
        ledger:
            "T ledger — OD-1 RULED PRUNE (FINAL, 2026-07-05): morph + motion-path " +
            "pruned outright (T.E3). The editable-control-net lock asserted a scene " +
            "that no longer exists; the LIBRARY MotionPath factory + test/svg/" +
            "motion-path.test.ts survive.",
        witness: {
            cmd: "node scripts/proof-motion-path-editable.mjs",
            cite:
                "demo/scenes/motion-path/ DELETED from disk at T.E3 (scenes.ts " +
                "descriptor + SCENE_GATE_META entry removed; proof:manifest-sourced " +
                "green with no motion-path id). The re-run witness is " +
                "machine-continuous: this clause re-verifies every run that the " +
                "script file is absent, the package key is absent, and the " +
                "CORRECTNESS_ROSTER membership is gone.",
        },
    },
    "proof:motion-path-copy": {
        kind: "kill",
        ledger:
            "T ledger — OD-1 RULED PRUNE (FINAL, 2026-07-05): morph + motion-path " +
            "pruned outright (T.E3). The copyable-offset-path artifact lock asserted " +
            "a scene that no longer exists; the LIBRARY MotionPath factory + " +
            "test/svg/motion-path.test.ts survive.",
        witness: {
            cmd: "node scripts/proof-motion-path-copy.mjs",
            cite:
                "demo/scenes/motion-path/ DELETED from disk at T.E3 (scenes.ts " +
                "descriptor + SCENE_GATE_META entry removed; proof:manifest-sourced " +
                "green with no motion-path id). The re-run witness is " +
                "machine-continuous: this clause re-verifies every run that the " +
                "script file is absent, the package key is absent, and the " +
                "CORRECTNESS_ROSTER membership is gone.",
        },
    },
    "proof:scene-switcher-mobile": {
        kind: "kill",
        ledger:
            "S ledger — C-6 / fold row 18 (re-corrected at the 2026-07-03 S.E shelf): " +
            "the zombie scene-switcher-mobile gate asserted a mobile scroll-snap " +
            "carousel + a component (SceneSwitcherCarousel) that does NOT exist on " +
            "disk; it was masked by demo-smoke continue-on-error. The originally " +
            "ruled rebirth (proof:scene-stage-commits) is SHELVED with band S.E — no " +
            "successor gate exists in S. RETIRED, not migrated.",
        witness: {
            cmd: "node scripts/proof-scene-switcher-mobile.mjs",
            cite:
                "proof:scene-colocated ASSERTION 3 (SceneSwitcherCarousel + " +
                "useScrollSnapScene DELETED from disk under demo/, R.W5) — the retired " +
                "gate asserted a component ASSERTION 3 proves is gone. The re-run " +
                "witness is machine-continuous: this clause re-verifies every run that " +
                "the script file is absent, the package key is absent, and the " +
                "CORRECTNESS_ROSTER membership is gone.",
        },
    },
};

/**
 * ── THE REGRESSION-GUARD BAND (S.A4 S7; p08 §4 F9) ─────────────────────────────
 * The absence/excision guards — gates whose job is to keep a deleted anti-pattern
 * deleted (a deprecated nav-guard, a dropped alias, a silent fallback, a
 * cross-realm cast, a foreign-symbol stamp, a flat sibling, a duplicate utility, a
 * brittle selector, a single-option select). Banded under this explicit header so
 * the band is a machine-readable set, not scattered prose. The ci-coverage
 * regression-guard clause asserts every member is a LIVE hygiene-chain gate — a
 * regression-guard that drifts out of the hygiene tier (or vanishes) REDs.
 */
export const REGRESSION_GUARDS = [
    "proof:no-deprecated-guard",
    "proof:alias-dropped",
    "proof:no-silent-fallback",
    "proof:no-cross-realm-cast",
    "proof:no-foreign-symbol-stamp",
    "proof:no-flat-siblings",
    "proof:no-dup-utility",
    "proof:no-brittle-selector",
    "proof:no-single-option-select",
];
