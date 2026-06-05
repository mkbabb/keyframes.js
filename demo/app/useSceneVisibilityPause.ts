import { useDocumentVisibility } from "@vueuse/core";
import { watch } from "vue";

/**
 * B-3 (CWV / battery): pause the active scene's rAF/WebGL loop while the tab is
 * backgrounded, resume it on return. There is exactly ONE scene mounted at a
 * time (a keyed `<Suspense>`, NO `KeepAlive`), so each scene's loop owner wires
 * this once and only the live scene's gate is ever active.
 *
 * Rides `@vueuse/core`'s `useDocumentVisibility` (the E.W2 listener gate forbids
 * a raw `visibilitychange` `addEventListener`) — a reactive `document.hidden`
 * read, auto-cleaned on scope dispose.
 *
 * Honesty contract: the gate only resumes what IT paused. If the loop was
 * already stopped when the tab hid (user-paused, settled, deactivated), the
 * `wasRunning` probe returns false on hide → no auto-pause is recorded → return
 * does NOT force a resume. This avoids re-playing a scene the user paused.
 *
 * The engine re-bases its rAF clock on resume (`Animation.pause()` records
 * `pausedTime`; `resume()`/`play()` adjust `startTime` so `effectiveT` stays
 * continuous — the same path `restoreGroupPlaybackState` reuses), so there is no
 * forward jump on return.
 *
 * @param wasRunning probe — true iff the loop is currently ticking (read at hide
 *        time to decide whether to auto-pause).
 * @param pause stop the loop (idempotent).
 * @param resume restart the loop (idempotent).
 */
export function useSceneVisibilityPause(
    wasRunning: () => boolean,
    pause: () => void,
    resume: () => void,
): void {
    const visibility = useDocumentVisibility();

    // Tracks whether the hide-time pause was OURS — only then do we auto-resume.
    let autoPaused = false;

    watch(visibility, (state) => {
        if (state === "hidden") {
            // Only pause (and arm the auto-resume) if the loop was actually
            // running — never claim a pause we didn't cause.
            if (wasRunning()) {
                autoPaused = true;
                pause();
            }
        } else if (autoPaused) {
            autoPaused = false;
            resume();
        }
    });
}
