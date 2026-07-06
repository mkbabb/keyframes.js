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
    // (proof:hero-rung / proof:hero-balance / proof:hero-cls were FROZEN here
    //  until T.D9/T.D10 RETIRED them — the word-split top-band hero geometry
    //  they locked was the owner-REJECTED state (VERDICT #3); their surviving
    //  live properties MIGRATED to proof:hero-two-focal (OWNER, OD-4). The
    //  machine-witnessed migration discharges live in DISCHARGE below.)
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
    // (proof:design-refinement + proof:easter-egg were FROZEN here until T.M7/T.M8
    //  KILLED them (batch ⑧) — VERDICT #2/#13/#15 "remove this crap" / "remove all
    //  of this" made the owner-rejected instrument-egg program machine-MANDATORY;
    //  the WHOLE key goes. The eggs SURVIVE in the code as discovered delights, but
    //  NO gate mandates them; the on-stage legend layer that surfaced them (the
    //  census MANDATE) is retired, replaced by the negative-space proof:stage-
    //  inventory (T.M4). Their machine-witnessed KILL discharges live in DISCHARGE
    //  below.)
    // scene-editor / interaction appearance locks
    "proof:sequence-rows-draggable",
    // (proof:motion-path-editable / proof:motion-path-copy were FROZEN here until
    //  T.E3 KILLED them — the motion-path scene was PRUNED (OD-1 = PRUNE); their
    //  machine-witnessed KILL discharges live in DISCHARGE below.)
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
    // T.D9/T.D10 (OD-4 APPROVED) — the three FROZEN hero locks are discharged by
    // MIGRATION to `proof:hero-two-focal` (OWNER authority, the born-OWNER T.D9
    // oracle over the P-HERO blessed reference). Each lock's SURVIVING live
    // property is re-asserted by the successor; the property that died was the
    // rejected state itself (lane 29: "the hero-rung gates crystallize the
    // rejected word-split").
    "proof:hero-rung": {
        kind: "migration",
        successor: "proof:hero-two-focal",
        note:
            "The mega-φ-rung survivorship (its ONE live property — the hero stays " +
            "text-display-mega) is hero-two-focal clause (a); its top-band SEAT " +
            "half asserted the rejected header-band hero (VERDICT #3 'lower on the " +
            "page') and is INVERTED by clause (b). proof:phi-leaf-zero HALF 2 " +
            "co-asserts the rung statically.",
    },
    "proof:hero-balance": {
        kind: "migration",
        successor: "proof:hero-two-focal",
        note:
            "The one-optical-block poster (title + dots as one block) survives in " +
            "hero-two-focal clause (b)+(c) + proof:demo-usability clause 2 (the " +
            "re-armed per-char contract); the hero∩cube==0 half was OVERTURNED by " +
            "OD-4 (overlap WELCOME — 'it's OK if it sits a bit on top of the cube').",
    },
    "proof:hero-cls": {
        kind: "migration",
        successor: "proof:hero-two-focal",
        note:
            "The CLS companion locked the WORD-split geometry (per-word spans in " +
            "the top band — the rejected state). Its live substrate (the Capsize " +
            "metric-matched fallback + the mega rung) is re-asserted by " +
            "hero-two-focal clause (a) + proof:demo-elevate's first-paint clause " +
            "(size-adjust/ascent/descent overrides).",
    },
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
    // T.M7/T.M8 (batch ⑧) — the owner-rejected instrument-egg PROGRAM's gate-lock
    // dies. VERDICT #2/#13/#15 ("remove this crap" / "Remove all of this" / "remove
    // this button") ruled the decorative, library-orthogonal egg chrome + the on-
    // stage LEGEND layer that surfaced it OUT; the S taste error had made the eggs
    // machine-MANDATORY (a gate that browser-actuated each one + red if it was
    // unreachable). The eggs THEMSELVES survive in the code as discovered delights
    // (cube roll, spring derby, square tumble, sequence retime — kept deliberately);
    // what dies is the GATE MANDATE. Owner-ruled KILL. The re-run witness re-verifies
    // every run that the script is gone from disk, the key is absent, and the
    // CORRECTNESS_ROSTER membership is gone (all three landed THIS commit).
    "proof:easter-egg": {
        kind: "kill",
        ledger:
            "T ledger — VERDICT #2/#13/#15 (OWNER-DECISIONS.md): the Gallery + the " +
            "seven kf-source eggs were decorative library-orthogonal chrome the owner " +
            "ruled OUT; the S regime made them machine-mandatory (proof:easter-egg " +
            "browser-actuated each egg + red if unreachable — the taste error made a " +
            "MANDATE). T.M7 retires the WHOLE key; the eggs stay as unmandated delights.",
        witness: {
            cmd: "node scripts/proof-easter-egg.mjs",
            cite:
                "the on-stage LEGEND layer that surfaced the eggs is deleted (T.M — " +
                "GestureLegend.vue + the 3 remaining tells: square/spring/sequence, " +
                "cube/amiga at T.A2/T.A10; the easing gallery-door at T.E7). No gate " +
                "MANDATES an egg now; the negative-space proof:stage-inventory (T.M4) " +
                "asserts the at-rest stage carries NO un-manifested chrome. The re-run " +
                "witness is machine-continuous: this clause re-verifies every run that " +
                "the script file is absent, the package key is absent, and the " +
                "CORRECTNESS_ROSTER membership is gone.",
        },
    },
    "proof:design-refinement": {
        kind: "kill",
        ledger:
            "T ledger — VERDICT #2/#13/#15 (OWNER-DECISIONS.md): the nine instrument-" +
            "eggs (the S1 @KEYFRAMES·LIVE typing card, the S5 easing drag-smear " +
            "telemetry, …) were the owner-rejected 'remove this crap' surface the S " +
            "regime crystallized into a machine-mandatory gate. The coupled surfaces " +
            "landed removed across the drive (S1 typing card → T.D12; S5 easing smear " +
            "surface fate → OD-7's T.E6). T.M7 retires the WHOLE key.",
        witness: {
            cmd: "node scripts/proof-design-refinement.mjs",
            cite:
                "the S1 kf-source typing card was excised at T.D12 (useHeroSourceEgg.ts " +
                "deleted; absence browser-asserted by proof:hero-two-focal clause (c)); " +
                "no gate MANDATES a design-refinement egg now. The re-run witness is " +
                "machine-continuous: this clause re-verifies every run that the script " +
                "file is absent, the package key is absent, and the CORRECTNESS_ROSTER " +
                "membership is gone.",
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
    // T.D14 (lane 12 T-CL-3) — the hand-rolled cursor-tracker pattern was
    // independently authored TWICE (H.W9 .cartoon-specular → ComposeTarget
    // .foundry-keylight); this standing guard keeps a THIRD impossible. NOT
    // compose-coupled — it guards the future.
    "proof:no-hand-rolled-cursor-tracker",
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
    // T.D10/T.D12 (LANDED, batch ⑤) — `proof:typing-dots` + `proof:dogfood-hero`
    // were NOT retired; they leave the ledger (the square-honest precedent: a key
    // is either being RETIRED or being GREENED, never both). The T.D12 removal was
    // the @KEYFRAMES·LIVE typing CARD (kf-source-egg + useHeroSourceEgg —
    // design-refinement's S1 arm re-cut; absence asserted by hero-two-focal
    // clause (c)); the TypingDots ELLIPSIS these two gates actually guard was
    // KEPT by T.D10 ("keep <TypingDots/> as the faster-cadence tail — the
    // engine-dogfooded pulse"), so both gates stay LIVE re-specced in place
    // (typing-dots' static clause re-anchored `.lift-down`→`.wave-char`).
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
        dischargedBy: "T.A/T.B/T.C/T.D/T.E (furniture prune) + the browser rendered-set reconciliation (the KF_REQUIRE_BROWSER discharge, a later wave)",
        reason:
            "the on-stage negative-space gate. The MANIFEST LAYER is now FULLY GREEN " +
            "(batch ⑧ T.M4: all 7 per-scene slots carry a committed owner-sanctioned " +
            "inventory — home/cube/amiga filled earlier; square/spring/sequence/easing " +
            "filled here as the gesture-legend strip landed). It STAYS born-RED because " +
            "(a) the browser RENDERED-set reconciliation (KF_REQUIRE_BROWSER=1: does the " +
            "running demo paint exactly the sanctioned set?) is not yet implemented — a " +
            "later wave opens the browser and asserts it; and (b) the retire-target chrome " +
            "the manifests mark FORBIDDEN (#11 square caption, #17 dock-label dup, the OD-7 " +
            "easing gallery redesign, …) has its on-stage DOM prune / redesign PENDING " +
            "across T.B/T.C/T.D/T.E, so the browser reconciliation would still red. " +
            "Converges as those prunes + the reconciliation land.",
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
    // (proof:perf-counters DISCHARGED at batch ⑧ (T.G3 + T.G4): cube/spring/easing
    //  now reach TRUE REST at idle — recalc AND layout both 0.00/frame (measured
    //  WITH browser on the built dist/gh-pages; square/sequence 0.00 same-run
    //  references). T.G3 removed the perpetual idle churn (spring/easing autoPlays →
    //  false so the raw-rAF loop never arms at rest; the cube's non-compositable
    //  `preserve-3d` idle-bob — 1.00 recalc/frame — removed, the die rests still and
    //  comes alive on play/hover). T.G4 moved the spring ball off the `left` layout-
    //  thrash. The gate flips from a recorded tripwire to a NORMAL COVERED gate on
    //  the blocking proof:demo-correctness chain (authority=OWNER + blocking-not-
    //  OBSERVE, T.M6.2) — removed here + from proof:ci-coverage's EXCLUDED set in the
    //  same commit, drive clause 7. The blur half of VERDICT #19 stays
    //  proof:blur-not-resampled's (an fps toggle; the compositor cost is invisible to
    //  these main-thread CDP counters).)
    "proof:roster-ceiling": {
        dischargedBy: "T.M7 retirements + the FROZEN discharge fold (converges as bands delete keys)",
        reason:
            "the count clause reds while the proof:* roster exceeds the declared ceiling " +
            `(${ROSTER_CEILING}); today 228 (batch ⑧: 231 − the gesture-manifest / easter-egg ` +
            "/ design-refinement retirement = 228; each altitude band kept authoring MORE " +
            "born-RED oracles than the M7 retirements removed, so the count converges SLOWLY). " +
            "It CONVERGES as the remaining M7 feature-coupled retirements (the easing surface-" +
            "locks, crayon, icon-paint-live) + the FROZEN discharge land — a declared backlog, " +
            "not a mask.",
    },
    "proof:owner-golden": {
        dischargedBy: "the owner golden-blessing at review",
        reason:
            "T.M3 — the owner-anchored perceptual reference oracle that SUPERSEDES " +
            "proof:visual-lock's self-captured baseline + full-subject mask (the one " +
            "appearance tripwire that painted the amiga sphere / CSS-3D cube / engine " +
            "balls / typing dots FLAT before the diff, blind to verdict #1/#4/#9/#21 and " +
            "locking the owner-rejected layout as its golden). BORN-RED + BORN-OWNER: its " +
            "GREEN is UNREACHABLE without a committed owner BLESSING token " +
            "(docs/tranches/T/goldens/BLESSED.json) over the 12 candidate frames " +
            "(home/cube/amiga/square/easing/spring × light/dark), each subject-full (the " +
            "mask is FORBIDDEN — the subject stays IN) and matched by the live render " +
            "(dHash under PRM). Reds today: BLESSED.json is absent. The candidates are " +
            "captured from the LANDED tree as PENDING-OWNER " +
            "(`node scripts/proof-owner-golden.mjs --capture-candidates`); the owner " +
            "blesses at the mid-drive/close review, and the visual-lock demote-vs-retire " +
            "call (T.M3 lockstep) executes WITH the blessing.",
    },
    "proof:easing-curve-editor": {
        dischargedBy:
            "the easing TERMINAL batch (T.E8 EasingPicker replaces the hand-rolled " +
            "cluster + T.E6 post-OD-7): these two surface-locks' subject IS the " +
            "E8-deletion-target editor cluster, and their actuation predates the " +
            "T.B2 facet model (easing opens on Controls; the Curve facet needs " +
            "selection). Re-charter-or-retire rides the redesign (T.M7 ledger class).",
        reason:
            "the ghost-diff/named-pick clauses red on the pre-facet actuation " +
            "(picked=false) — a stale-driver red on an E8-retire-target surface, " +
            "not a product defect (the editor itself functions; live-session B4 green).",
    },
    "proof:easing-sidebar-minimal": {
        dischargedBy:
            "the easing TERMINAL batch (T.E8/T.E6 post-OD-7) — same class as " +
            "easing-curve-editor: the J clauses need the Curve facet SELECTED " +
            "(post-T.B2 easing opens on Controls), and the sidebar body is the " +
            "E8/E6 redesign surface.",
        reason:
            "'.easing-curve-canvas:false — the sidebar never painted' — the gate's " +
            "mount path predates the T.B7 Curve-facet dissolution + T.B2 derived " +
            "default tab; a stale-driver red on a retire-target surface.",
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
    // (proof:scene-facility — DISCHARGED at the T.B1-β/T.B7 joint motion (batch
    //  ⑥′ STAGE 2): easing rides ONE real preview channel (a CSSKeyframesAnimation
    //  whose timingFunction IS the edited easing), spring rides the Sweep
    //  (springEditAnim) + Entry (the compiled @starting-style animation) channels,
    //  and demo/app/runtime/useContractAnimGroup.ts is DELETED in the same motion.
    //  Clause (b) decoy-zero GREENS — the gate exits 0 and joins the blocking
    //  proof:hygiene-chain as a normal covered gate (removed here + from the
    //  ci-coverage EXCLUDED set in the same commit, drive clause 7).)
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
    "proof:dock-rest-crisp": {
        dischargedBy:
            "glass-ui GU-1 publish + re-pin (T.C6) — the reveal blur gated on " +
            "[data-morphing], content-only (never the plate); a resting dock is CRISP.",
        reason:
            "T.C5 (GU-1 acceptance). MEASURED born-RED: the resting collapsed .glass-dock " +
            "computes filter: blur(3px) (glass-ui BB.W-LIQUID-REVEAL bloom in " +
            "dist/styles/dock/morph.css, NOT gated on [data-morphing]) — VERDICT #4's " +
            "unreadable blur-blob. Per MEMORY the fix is glass-ui-root (never patched in " +
            "demo); kf cannot self-cure it. OWNER authority + blocking-not-OBSERVE (T.M6). " +
            "See demo/glass-ui-gaps.ts dockRestBlur (GU-1).",
    },
    "proof:dock-morph-continuity": {
        dischargedBy:
            "glass-ui GU-2 publish + re-pin (T.C6) — measure REAL laid-out endpoint " +
            "geometry (or defer the morph one frame); no max-content release jump-cut.",
        reason:
            "T.C5 (GU-2 acceptance). MEASURED born-RED: the dock width SNAPS 58→14px, holds " +
            "a 14px sliver, then jump-cuts 14→225px with no animation (lane 08 D2 frame " +
            "table) — glass-ui pins un-laid-out endpoints (dist/dock.js). rAF-sampled: the " +
            "per-frame Δ far exceeds 25% of range + a >5px change after [data-morphing] " +
            "clears. glass-ui-root fix; OWNER authority + blocking-not-OBSERVE (T.M6). See " +
            "demo/glass-ui-gaps.ts dockMorphMeasure (GU-2).",
    },
    // proof:transport-play-first-render — DISCHARGED at T.C1 (batch ⑤). The rail-core
    // rebuild renders play FIRST (from actions.primary); the gate flipped GREEN and
    // moved to the blocking proof:hygiene-chain in the SAME commit (drive clause 7 —
    // discharge = cure). No longer a born-RED backlog row.
};
