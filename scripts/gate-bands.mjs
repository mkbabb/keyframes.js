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

/**
 * ── THE FEATURE-COUPLED RETIREMENT LEDGER (T.M7 · lane 29 rec 6) ───────────────
 * The Class-A inverted / feature-dead S gates that each ENFORCE an owner-rejected
 * state today and are retired AS their features are removed or redesigned. T.M
 * owns this LEDGER + the no-orphan-key completion clause; the BANDS execute each
 * deletion (T.A/T.B/T.C/T.D/T.E). Status is DERIVED FROM THE TREE, never
 * hand-maintained: a retire-target key still present in package.json = PENDING, a
 * key absent = RETIRED. This makes the ledger MERGE-CONFLICT-FREE against the
 * parallel T.E deletions (a lane deleting compose/morph/motion-path keys need not
 * touch this file — the derive-from-tree read reflects the deletion automatically).
 *
 * `proof:retirement-ledger` (T.M7) reads this and REDs on the NO-ORPHAN-KEY clause:
 * a package.json proof:* key that is GONE but is NOT a ledger retire-target (and is
 * not a T.M8 FROZEN discharge, and is not otherwise accounted) is an untracked
 * deletion → RED. A ledger entry whose key is still present is simply PENDING
 * (reported, not red). Each entry names its coupled feature, the verdict item, and
 * (when applicable) the successor gate that re-asserts any surviving live property.
 *
 * Do NOT delete keys HERE — the ledger only WITNESSES deletions the bands execute.
 */
export const RETIREMENT_LEDGER = {
    // T.A13 + T.B3 (LANDED, batch ③) — `proof:square-honest` was NOT retired; it
    // was REWRITTEN in place to v2 (the born-RED inversion: panel PRESENT + Play
    // paints, replacing the S.G2 "panel ABSENT" collapse assertion) and RE-TIERED
    // into proof:demo-correctness. A live correctness gate, not a retirement — so
    // it leaves the ledger. The #12/#25 panel RETURN is now proven by that v2 gate
    // (+ proof:scene-control-dfa's square-in-triad EXPECT), not by a retirement.
    "proof:gesture-manifest": {
        coupledFeature: "the on-stage gesture LEGEND mandate (tell-or-RED)",
        verdictItem: "#8/#15 — remove all legend elements",
        executedBy: "T.E/T.B",
        successor: "proof:stage-inventory (T.M4 — the negative-space inversion)",
    },
    "proof:easter-egg": {
        coupledFeature: "the Gallery + seven kf-source eggs",
        verdictItem: "#2/#13/#15 — remove decorative library-orthogonal chrome",
        executedBy: "T.E/T.D",
        successor: null,
    },
    "proof:design-refinement": {
        coupledFeature: "the nine instrument-eggs (S1 typing card, S5 easing smear, …)",
        verdictItem: "#2/#13/#15",
        executedBy: "T.E/T.D",
        successor: null,
    },
    "proof:easing-sidebar-minimal": {
        coupledFeature: "the hand-rolled easing sidebar surface-lock",
        verdictItem: "#16 — re-design the easing scene with glass-ui",
        executedBy: "T.E",
        successor: "proof:easing-gallery (T.E6 — born-OWNER, OD-7)",
    },
    "proof:easing-sidebar-normalized": {
        coupledFeature: "the hand-rolled easing sidebar surface-lock",
        verdictItem: "#16",
        executedBy: "T.E",
        successor: "proof:easing-gallery (T.E6)",
    },
    "proof:easing-stage-is-ball": {
        coupledFeature: "the easing-stage-is-ball surface-lock (the ball-preview INTENT survives)",
        verdictItem: "#14/#16",
        executedBy: "T.E",
        successor: "proof:easing-gallery (T.E6 — the ball-preview intent re-homed)",
    },
    "proof:easing-canvas-bounded": {
        coupledFeature: "the easing-canvas geometry lock",
        verdictItem: "#16",
        executedBy: "T.E",
        successor: "proof:easing-gallery (T.E6)",
    },
    "proof:scene-uses-standard-ribbon": {
        coupledFeature: "the easing-scene ribbon lock",
        verdictItem: "#16",
        executedBy: "T.E",
        successor: null,
    },
    "proof:hero-rung": {
        coupledFeature: "the rejected hero WORD-split rung geometry",
        verdictItem: "#3 — per-CHAR uplift, hero lower/centred, overlap-OK",
        executedBy: "T.D",
        successor: "proof:hero-two-focal + proof:hero-deck-voice (T.D9/D11 — born-OWNER, OD-4)",
    },
    "proof:hero-balance": {
        coupledFeature: "the rejected hero∩cube==0 balance lock",
        verdictItem: "#3",
        executedBy: "T.D",
        successor: "proof:hero-two-focal (T.D9)",
    },
    "proof:hero-cls": {
        coupledFeature: "the rejected hero CLS lock (word-split geometry)",
        verdictItem: "#3",
        executedBy: "T.D",
        successor: "proof:hero-two-focal (T.D9)",
    },
    "proof:typing-dots": {
        coupledFeature: "the home typing-card indicator",
        verdictItem: "#2 — remove the typing card",
        executedBy: "T.D",
        successor: null,
    },
    "proof:dogfood-hero": {
        coupledFeature: "the rejected hero dogfood lock",
        verdictItem: "#3 — re-spec with the new hero",
        executedBy: "T.D",
        successor: "proof:hero-two-focal (T.D9)",
    },
    "proof:crayon-preserved": {
        coupledFeature: "the crayon idiom (likely dies with the latent-red theme)",
        verdictItem: "#16 — don't like this latent red theme",
        executedBy: "T.D",
        successor: null,
    },
    "proof:compose-scene": {
        coupledFeature: "the compose scene (DELETED in totality per OD-1 / :has() collapse)",
        verdictItem: "#23 — remove compose",
        executedBy: "T.E",
        successor: null,
    },
    "proof:morph-scene": {
        coupledFeature: "the morph scene (PRUNED per OD-1 PRUNE FINAL)",
        verdictItem: "#21 — does not work at all",
        executedBy: "T.E",
        successor: "proof:subject-full (T.M5 — visible-render, if kept; PRUNED per OD-1)",
    },
    "proof:motion-path-editable": {
        coupledFeature: "the motion-path scene (PRUNED per OD-1)",
        verdictItem: "#20 — barely works",
        executedBy: "T.E",
        successor: null,
    },
    "proof:motion-path-copy": {
        coupledFeature: "the motion-path scene (PRUNED per OD-1)",
        verdictItem: "#20",
        executedBy: "T.E",
        successor: null,
    },
    "proof:motion-path-scale": {
        coupledFeature: "the motion-path scene (PRUNED per OD-1)",
        verdictItem: "#20",
        executedBy: "T.E",
        successor: null,
    },
    // (proof:visual-lock is NOT ledgered here: its interim flap-red rides
    //  T_BORNRED_BACKLOG below, and its terminal retire-vs-demote call is
    //  T.M3's — the owner-golden wave re-adds the ledger row (or executes the
    //  demotion) when it lands. A key is either being RETIRED or being GREENED,
    //  never both at once — the model clause of proof:retirement-ledger.)
    "proof:icon-paint-live": {
        coupledFeature: "the bbox-only icon existence proxy (blur-blind)",
        verdictItem: "#4 — blurred dock icon; existence ≠ legibility",
        executedBy: "T.C",
        successor: "proof:subject-legible (T.M5 — no-blur + edge-energy floor)",
    },
};

/**
 * ── THE ROSTER CEILING (T.M8 · lane 24 rec 2 / lane 27 F10) ────────────────────
 * S.A4's headline was "190 → ~138 immediate → ~120 once the FROZEN fold
 * discharges." The tree INVERTED to 203 (each altitude band authored MORE
 * structural born-RED oracles). T.M8 declares the ceiling and drives the count back
 * toward it as M7's retirements + the FROZEN discharge land. The COUNT clause of
 * proof:roster-ceiling stays RED (declared T born-RED backlog) until the bands
 * retire keys — it converges, it does not mask.
 */
export const ROSTER_CEILING = 120;

/**
 * ── THE T BORN-RED BACKLOG (the S.A0 doctrine, T-side) ─────────────────────────
 * The T.M gates that land BORN-RED by design — they red on today's real defects /
 * on a not-yet-converged count — and are registered HERE so CI posture stays
 * "failing ⊆ declared backlog, exactly" (nothing reds silently). Each is kept OUT
 * of every blocking aggregator (&&-chain / roster) and rides CI as a RECORDED
 * tripwire — the proof:peer-satisfied / proof:chronic-closure precedent. Each row
 * names the wave(s) that DISCHARGE it (green it). proof:ci-coverage (clause 11)
 * asserts every entry here is a live package.json script AND is in its EXCLUDED set
 * AND carries a non-empty reason + dischargedBy — so a born-RED gate cannot escape
 * the declared-backlog register.
 */
export const T_BORNRED_BACKLOG = {
    "proof:stage-inventory": {
        dischargedBy: "T.A/T.B/T.C/T.D/T.E (furniture prune + owner-sanctioned per-scene manifests)",
        reason:
            "the on-stage negative-space gate: reds until the retire-target chrome " +
            "(#5 cube readout / #6 dock ghost-tooltip+divider / #7 controls pane / #11 " +
            "square caption / #22 cursor light) is pruned AND each scene carries a " +
            "committed owner-sanctioned manifest. Per-scene manifest slots are EMPTY-RED " +
            "by design (bands fill them).",
    },
    "proof:subject-legible": {
        dischargedBy: "T.C (dock icon de-blur — a glass-ui born-RED handoff)",
        reason:
            "no-blur-over-glyph + edge-energy floor: reds on the resting blur(3px) dock " +
            "icon (#4). Existence ≠ legibility — supersedes proof:icon-paint-live (a)'s bbox clause.",
    },
    // (proof:subject-full DISCHARGED at batch ②′ — the cube leg flipped verified
    //  with the T.A1 bloom-delete browser render check, the amiga leg with the
    //  T.A6/T.A7 plain-vars + compositor cure (3833 visible ball pixels), and the
    //  morph clause retired with the OD-1 prune at batch ①. The gate exits 0.)
    "proof:blur-not-resampled": {
        dischargedBy:
            "T.H (glass-ui `blur-source=\"static\"` frozen-backdrop publish, BG-5) + the kf " +
            "re-pin adopting it — the kf-side de-layer clauses (A: contain:paint deleted, no " +
            "backdrop-filter ancestor; C: the BG-5 ledger row) GREEN NOW; only clause B (the " +
            "runtime toggle-delta) stays RED until the frozen-backdrop capability ships.",
        reason:
            "T.G1 (the perf keystone). The glass chrome's LIVE backdrop-filter re-samples the " +
            "moving stage as its backdrop every frame (VERDICT #19 root cause #1): neutralizing " +
            "it raises the heaviest-coupled surviving scene (easing) from 26→65fps here / the " +
            "wave's 33→39.5fps @1440×dpr2, far over the 15% ceiling. No pure-CSS kf-side cure " +
            "exists (isolation/z-index/radius-cap/geometry all measured neutral); the frozen-" +
            "backdrop capability is glass-ui-owned and absent today — a born-RED handoff (T.H). " +
            "The runtime clause is subsumed by T.G6's proof:perf blur-delta once lane 11's " +
            "toggle-probe is promoted. See demo/glass-ui-gaps.ts staticBackdrop (BG-5).",
    },
    "proof:roster-ceiling": {
        dischargedBy: "T.M7 retirements + the FROZEN discharge fold (converges as bands delete keys)",
        reason:
            "the count clause reds while the proof:* roster exceeds the declared ceiling " +
            `(${ROSTER_CEILING}); today 203. It CONVERGES as M7's ~15 feature-coupled ` +
            "retirements + the FROZEN discharge land — a declared backlog, not a mask.",
    },
    "proof:chronic-closure": {
        dischargedBy:
            "T.S1 remainder (the residual-row C-20 triage): row 71 re-pointed GREEN " +
            "onto the T.H5 glass-ui-gap-tripwire + T.F16 excision, row 72 ratified " +
            "GREEN as a historical RECORD; row 69 DISCHARGED (batch ③ T.A13+T.B3): " +
            "`proof:square-honest` REWRITTEN v2 (panel PRESENT + Play paints) + TIERED " +
            "into proof:demo-correctness (a runtime browser gate) — the row's cited " +
            "gate is now resolve+tier+runtime, so row 69 is GREEN. FULL greening is a " +
            "WHOLE-TRANCHE discharge: ~30 further S-ledger FOLD rows (rows 1/4/5/6-15/ " +
            "23/25/… — the 'missing-witness wording' class) name their closure gate in " +
            "prose but not in backticks, each owned by its landing wave.",
        reason:
            "HONEST COUNT (measured on this lane's tree post-square-landing): the gate " +
            "has 31 row-fails (row 69 square-honest v2 is now GREEN; the prior handoff " +
            "measured 33). Greening the rest re-authors the S-ledger closure column " +
            "wave-by-wave (each row's owning wave backticks + tiers its gate), so this " +
            "stays a whole-tranche born-RED backlog. Exit 1 verified on the tree.",
    },
    "proof:visual-lock": {
        dischargedBy:
            "T.A3 LANDED (the easeInBounce mount intro is replaced by the deterministic " +
            "ease-out-back settle + a PRM snap — the cube-pose-flap CAUSE is removed, proven " +
            "green by proof:cube-settle: ≤1 overshoot sign-change + PRM snaps to attitude; " +
            "the cube stage is also stripped per rulings #5/#8) + T.M3 (owner-golden supersedes " +
            "this self-baseline tripwire as the appearance authority — the terminal " +
            "retire-vs-demote call is T.M3's; un-ledgered from RETIREMENT_LEDGER " +
            "until then per the either-retired-or-greened model clause). ROW STILL OPEN: the " +
            "baseline is NOT re-captured here — --update-baseline re-bakes ALL regions " +
            "(home hero at this env's font hinting), the forbidden cross-OS masking the " +
            "header names; the terminal re-baseline rides T.M3's owner-golden.",
        reason:
            "the cube open/stage regions FLAPPED run-to-run above the 0.9% tolerance because " +
            "the easeInBounce settle left the die at a nondeterministic pose at capture time — " +
            "that CAUSE is now removed (T.A3: deterministic ease-out-back + PRM snap). What " +
            "REMAINS red is the cross-OS baseline drift (home hero 9.17%/24.67% — chromium/font " +
            "hinting since the S-era capture) + the cube regions' stale baseline (it still shows " +
            "the pre-strip readout/legend/bloomed cube — an INTENDED appearance change, not a " +
            "regression). The terminal re-baseline is T.M3's owner-golden; visual-lock is " +
            "observe-only-in-CI (never blocks) and its correctness authority was stripped " +
            "(I.W7 S5). Correctness corroborators verified green: cube-silhouette, cube-settle, " +
            "live-session, subject-full (cube leg), occlusion, scene-control-dfa.",
    },
    "proof:no-collision-rename": {
        dischargedBy:
            "value.js renames the exported PropertyDescriptor → a collision-free name " +
            "(e.g. CSSPropertyDescriptor) [EXTERNAL] + kf re-points its import + Map<…> types",
        reason:
            "KF-7 (T.S3 / lane 27 F5): value.js exports a type `PropertyDescriptor` that " +
            "collides with the ambient DOM global, so API-Extractor mangles it into kf's " +
            "PUBLISHED dist/keyframes.d.ts as `PropertyDescriptor_2` (verified live at :11/:814/" +
            ":2732). value.js 2.0.1, 3.0.0 AND 3.1.0 all still export it un-renamed (re-verified at " +
            "the T.S3 3.1.0 re-pin — the tripwire STAYS born-RED after the pin); the gate greens the " +
            "instant value.js renames it and kf re-points (the adopt-event watch gates the re-point). " +
            "See docs/tranches/T/KF-TO-VALUEJS-T.md.",
    },
    // proof:no-nested-self-dependency — DISCHARGED at T.S3 (2026-07-05): the value.js
    // ^3.1.0 re-pin drops the self-dependency phantom (3.0.0+ carry only parse-that in
    // their deps), so npm ci no longer nests a stale @mkbabb install and the tripwire
    // greens permanently. VERIFIED GREEN in the isolated 3.1.0 clone (proof:no-nested-
    // self-dependency exit 0). Removed from the born-RED register per drive clause 7
    // (gate green + row removed in the SAME commit as the cure = the pin). NOTE: greens
    // only once the tree is `npm ci`'d to 3.1.0 — the shared-symlink worktree was NOT
    // mutated (sibling-lane isolation); see risksForMerge / the pin commit.
};
