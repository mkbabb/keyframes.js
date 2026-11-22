import { useDocumentVisibility } from "@vueuse/core";
import { onScopeDispose, watch } from "vue";

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
 * A hand on the subject is the second reason (`held`): while a finger or the
 * mouse holds the die, or a wheel stream turns it, the scene's own loop yields,
 * so the page's frames carry the hand and nothing else (a playing scene
 * repaints its transport every frame, and its input then reached the page later:
 * a phone's touches 28.7 ms after their time against 13.2 ms paused, a desk's
 * wheel about 20 ms against the embed's 12). The die holds still under the hand and plays on from
 * the same instant when it is let go. The same honesty holds: only a loop that
 * was running is paused, and only that pause is resumed, once neither reason
 * stands and the scene still means to play (a Pause pressed while the hand
 * held the die is kept).
 *
 * @param wasRunning probe — true iff the loop is currently ticking (read at hide
 *        time to decide whether to auto-pause).
 * @param pause stop the loop (idempotent).
 * @param resume restart the loop (idempotent).
 * The way back may be eased (`easeIn`): nothing changes instantly, so a scene
 * whose subject stood still under the hand can gather its speed again instead
 * of jumping to it. `easeIn(done, keepGoing)` walks the paused loop back up to
 * speed and calls `done` at the end (or as soon as `keepGoing()` fails: a
 * Pause pressed meanwhile); the resume follows `done`, still only if the scene
 * means to play. A hand or a hide that returns mid-way stops the walk where it
 * stands, and the pause stays ours.
 *
 * @param wasRunning probe — true iff the loop is currently ticking (read at hide
 *        time to decide whether to auto-pause).
 * @param pause stop the loop (idempotent).
 * @param resume restart the loop (idempotent).
 * @param hand `held`: true while a hand holds the scene's subject (default:
 *        never); `playing`: the scene's own play state, read before a resume
 *        (default: always); `easeIn`: the way back up to speed, returning its
 *        cancel (default: none, the loop resumes at once).
 */
export function useSceneVisibilityPause(
    wasRunning: () => boolean,
    pause: () => void,
    resume: () => void,
    {
        held = () => false,
        playing = () => true,
        easeIn,
    }: {
        held?: () => boolean;
        playing?: () => boolean;
        easeIn?: (done: () => void, keepGoing: () => boolean) => () => void;
    } = {},
): void {
    const visibility = useDocumentVisibility();

    // Tracks whether the pause was OURS — only then do we auto-resume.
    let autoPaused = false;
    // The way back up to speed, while it runs (the loop is still paused).
    let cancelEase: (() => void) | null = null;

    const settle = () => {
        cancelEase = null;
        autoPaused = false;
        if (playing()) resume();
    };

    watch(
        () => visibility.value === "hidden" || held(),
        (yields) => {
            if (yields) {
                // A reason returned while the loop eased back: it stops where
                // it stands, still paused, and the pause is still ours.
                if (cancelEase) {
                    cancelEase();
                    cancelEase = null;
                    return;
                }
                // Only pause (and arm the auto-resume) if the loop was actually
                // running — never claim a pause we didn't cause.
                if (!autoPaused && wasRunning()) {
                    autoPaused = true;
                    pause();
                }
            } else if (autoPaused) {
                if (!easeIn || !playing()) return settle();
                let ended = false;
                const cancel = easeIn(() => {
                    ended = true;
                    settle();
                }, playing);
                if (!ended) cancelEase = cancel;
            }
        },
    );
    onScopeDispose(() => cancelEase?.());
}
