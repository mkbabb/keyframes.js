/**
 * X.KF.W13X.r4shared · A2-KE-L1-18 — the one arrow keymap of a two-axis subject.
 *
 * Right / Down are positive, Left / Up negative (screen axes); Shift takes the
 * fine step (APG's fine grain). A ctrl / meta / alt chord is a command, not a
 * nudge, and is declined, as is every other key: the caller keeps its own verbs
 * (Home, End, the Page keys) and calls `preventDefault` only on a result.
 */
export interface ArrowNudgeSteps {
    /** One arrow press, in the subject's own unit. */
    step: number;
    /** One Shift+arrow press. */
    fine: number;
}

export interface ArrowNudge {
    dx: number;
    dy: number;
}

/** A ctrl / meta / alt chord belongs to the app or the browser, never to the subject. */
export const isCommandChord = (event: KeyboardEvent): boolean => event.ctrlKey || event.metaKey || event.altKey;

export function arrowNudge(event: KeyboardEvent, steps: ArrowNudgeSteps): ArrowNudge | null {
    if (isCommandChord(event)) return null;
    const by = event.shiftKey ? steps.fine : steps.step;
    switch (event.key) {
        case "ArrowRight":
            return { dx: by, dy: 0 };
        case "ArrowLeft":
            return { dx: -by, dy: 0 };
        case "ArrowDown":
            return { dx: 0, dy: by };
        case "ArrowUp":
            return { dx: 0, dy: -by };
        default:
            return null;
    }
}
