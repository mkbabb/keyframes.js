/**
 * Ambient types for the JS-only CI-env helper (`ci-env.mjs`). The `.mjs` ships no
 * declarations, so an explicit `.mjs` import (e.g. `bench/playwright.bench.ts`)
 * reads as implicit-`any` (TS7016) once `bench/` joins the typecheck (S.B7). This
 * declaration mirrors the module's real runtime export surface so the import is
 * typed — and a drift REDs here, the same discipline as `test/stubs/`.
 */

/** The single CI-detection authority (`process.env.CI || GITHUB_ACTIONS`). */
export const IN_CI: boolean;

/** The named gate postures. */
export const POSTURES: readonly ["hard", "observe-only", "runner-calibrated"];

interface PostureHooks {
    fail?: (label: string) => void;
    note?: (label: string) => void;
}

/** Observe-only-in-CI: records (exit 0) in CI, hard-fails locally. Returns true
 *  iff the miss went RED (local/on-device). */
export function observeOnlyInCI(
    label: string,
    reason: string,
    hooks?: PostureHooks,
): boolean;

/** Declare a gate's posture; routing depends on `posture` + CI. */
export function declarePosture(
    posture: string,
    opts: { reason: string } & PostureHooks,
): boolean;
