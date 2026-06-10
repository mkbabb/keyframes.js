/**
 * ci-env — the ONE `IN_CI` authority + the per-gate DECLARED device-dependence
 * posture (J.W3 S2 / CICD-3 / WZ-postclose §B-§D; "P6 made mechanical").
 *
 * Before J.W3 the `IN_CI = !!(process.env.CI || process.env.GITHUB_ACTIONS)`
 * literal was TRIPLICATED verbatim (proof-perf-frame-budget.mjs:61,
 * proof-scene-transition-perf.mjs:79, proof-visual-lock.mjs:220) — three drift
 * points, no manifest of which gates are observe-only and why, no enforcement
 * that a NEW device-dependent gate adopts the posture. This module is the one
 * helper; the posture is DECLARED per gate at its top, never re-implemented.
 *
 * ── THE THREE POSTURES (ci-cd.md §5 — the taxonomy, named) ───────────────────
 *   hard              — device-INDEPENDENT oracle: red on any failure, CI and
 *                       local. The default; the overwhelming majority.
 *   observe-only      — device-DEPENDENT measurement (throttled frame ms,
 *                       cross-OS pixel, absolute timing): RECORDED in CI (never
 *                       red there), HARD on-device/local.
 *   runner-calibrated — the absolute threshold is KEPT; only the STRESS SIZE is
 *                       sized to the runner (the LoAF bench, KF_LOAF_COUNT).
 *                       Misses are hard everywhere — calibration is the gate's
 *                       own sizing concern, not this module's.
 *
 * ── THE THIRD TAXONOMY STATE, NAMED (WZ-postclose §C / wave-I.W7 §10) ────────
 * **on-device** — a CORRECTNESS-tier gate whose CI run is OBSERVATIONAL (the
 * observe-only posture on a correctness-class oracle). "proof:correctness GREEN
 * in CI" must NEVER be over-read as the felt timing/exact-pixel budget holding
 * in CI; the felt budget hard-gates ON-DEVICE only. `proof:perf-frame-budget`
 * is the canonical instance. The policy (WZ-postclose c2, decided): device-
 * dependent gates are observe-only in CI — NOT CI-excluded.
 *
 * ── NO-WORKAROUND PROHIBITION (J.md §spine; S2) ──────────────────────────────
 * The helper is NOT an escape hatch. A device-INDEPENDENT gate may NEVER route
 * through `observe-only` to paper a flake (the scene-control-dfa lesson): a
 * flaky device-independent gate is a determinism bug in the gate or a real
 * product bug — fixed, never silenced. An `observe-only` declaration REQUIRES a
 * stated `reason` (the device-dependence), enforced here at declaration time.
 */

/** IN_CI — the single authority. No per-script re-implementation (S2c polices
 *  this as a hygiene clause). */
export const IN_CI = !!(process.env.CI || process.env.GITHUB_ACTIONS);

/** The named postures (ci-cd.md §5). */
export const POSTURES = Object.freeze(["hard", "observe-only", "runner-calibrated"]);

const defaultNote = (label) => console.log(`  · ${label}`);
const defaultFail = (label) => {
    process.exitCode = 1;
    console.error(`  ✗ ${label}`);
};

/**
 * observeOnlyInCI — the observe-only mechanism (spec S2a): in CI the
 * measurement is RECORDED (noted, exit stays 0 — returns false); locally it is
 * HARD (routes to the gate's `fail` — returns true). The printed form is the
 * estate's established `[CI observe-only — <reason>] <label>` shape.
 *
 * @param label   the measured miss (the gate's failure text, unchanged)
 * @param reason  the declared device-dependence (e.g. "re-measure on-device")
 * @param hooks   { fail, note } — the gate's own recorders; defaults log/exit-poison
 * @returns       true iff the miss went RED (i.e. local/on-device)
 */
export function observeOnlyInCI(label, reason, { fail = defaultFail, note = defaultNote } = {}) {
    if (IN_CI) {
        note(`[CI observe-only — ${reason}] ${label}`);
        return false;
    }
    fail(label);
    return true;
}

/**
 * declarePosture — the per-gate DECLARED posture, consumed at gate top (S2b).
 * Returns `{ posture, inCI, miss }` where `miss(label)` is the gate's
 * miss-handler routed per the declaration:
 *
 *   hard / runner-calibrated → miss = fail (red everywhere; runner-calibrated
 *                              gates size their stress, the threshold stands)
 *   observe-only             → miss = observeOnlyInCI(label, reason, hooks)
 *
 * An observe-only declaration without a `reason` THROWS — the reason IS the
 * taxonomy-manifest entry (S2b/S2c); an undeclared device-dependence may not
 * ship.
 */
export function declarePosture(posture, { reason, fail = defaultFail, note = defaultNote } = {}) {
    if (!POSTURES.includes(posture)) {
        throw new Error(
            `ci-env: unknown posture "${posture}" — declare one of ${POSTURES.join(" | ")} (ci-cd.md §5)`,
        );
    }
    if (posture === "observe-only" && !reason) {
        throw new Error(
            "ci-env: an observe-only declaration REQUIRES a `reason` (the declared " +
                "device-dependence — the taxonomy-manifest entry; J.W3 S2b)",
        );
    }
    const miss =
        posture === "observe-only"
            ? (label) => observeOnlyInCI(label, reason, { fail, note })
            : (label) => {
                  fail(label);
                  return true;
              };
    return { posture, inCI: IN_CI, miss };
}
