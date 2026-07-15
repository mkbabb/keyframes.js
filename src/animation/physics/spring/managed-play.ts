/**
 * physics/spring/managed-play.ts — the SpringProgress MANAGED-PLAYBACK loop (the
 * `.play()`/`.stop()` rAF ownership), lifted off `SpringProgress` as FREE
 * FUNCTIONS (S.B5 — the progress.ts ceiling carve). The class keeps thin
 * delegates so `spring.play(onFrame)` / `spring.stop()` read unchanged; the loop
 * ownership — arming the shared `RAFPlayback.drive` driver, the reduced-motion
 * routing, the idempotent re-bind — lives here.
 *
 * The seam (what STAYS on `progress.ts`): the closed-form SOLVER (the analytic
 * `evaluateAt`/`checkSettled` step, the `set target` re-seat, the snap/reset
 * writes, the `tickDt`/`tickToTime` step surface, the SoA vector overload) is the
 * spring's math and stays on the class. These helpers drive that stepper through
 * the {@link SpringPlayback} structural contract declared in `./types` (the
 * ring-break home) — so this module NEVER imports the `SpringProgress` class,
 * keeping the `progress → managed-play` edge one-directional (no import cycle
 * under `tsPreCompilationDeps`). LIGHT (value.js-free): it reaches only the
 * shared reduced-motion gate + the injected `RAFPlayback`.
 */
import type { SpringFrameCallback, SpringPlayback } from "./types";
import { managedPlay, managedStart, managedStop } from "../managed-stepper";

/**
 * Arm the shared driver: it steps `tickDt(dt)` once per frame until `settled`
 * flips true, emitting `onFrame` per step. Idempotent — the driver no-ops while
 * already running. Also the auto-resume `set target` reaches when a callback is
 * bound and a re-seat un-settles the spring.
 */
export function springStartLoop(spring: SpringPlayback): void {
    managedStart(spring);
}

/**
 * Start a managed rAF loop that calls `tickDt(dt)` each frame until `settled`,
 * invoking `onFrame(value, velocity)` per tick. Idempotent — repeat calls re-bind
 * the callback without spawning a second loop. Once settled the loop auto-stops;
 * setting `target` while a callback is bound auto-resumes it without another
 * `.play()`. Under `respectReducedMotion` + an active query, snaps to target at
 * zero velocity (one emit, no loop).
 */
export function springPlay(
    spring: SpringPlayback,
    onFrame?: SpringFrameCallback,
): void {
    managedPlay(spring, onFrame);
}

/** Cancel the managed rAF loop and detach the per-frame callback. Pairs with
 * `springPlay`; does not touch current/target/settled state. */
export function springStop(spring: SpringPlayback): void {
    managedStop(spring);
}
