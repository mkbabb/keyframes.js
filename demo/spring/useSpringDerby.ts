import { onScopeDispose } from "vue";

import type { SpringTrack } from "./useSpringHotPath";

/**
 * EASTER EGG — "the Derby" (H.W12.S6), colocated as its own concern seam.
 *
 * Double-click the rail → a spring DERBY. The canonical trackers
 * (smooth/snappy/bouncy/gentle) are normally re-seated TOGETHER; the egg
 * launches them in a STAGGERED wave (a 110ms cascade) so their different damping
 * fractions are SEEN racing — the bouncy track overshoots and rings while the
 * gentle one glides in late. DOGFOODS each track's own SpringProgress (inv ζ);
 * the shared loop is the sole driver, so the egg only re-seats targets on a
 * timer. Bounces back to 0 after the launch so the showcase returns to rest.
 *
 * @param tracks      the canonical preset trackers (each gets its own launch)
 * @param launchLive  re-seat the interactive live ball to 1 (joins the wave last)
 * @param settle      bounce the whole field home (re-seat all to 0)
 * @param startLoop   re-arm the shared rAF loop after a target re-seat
 */
export function useSpringDerby(
    tracks: SpringTrack[],
    launchLive: () => void,
    settle: () => void,
    startLoop: () => void,
) {
    const STAGGER_MS = 110;
    let derbyRunning = false;
    const derbyTimers: ReturnType<typeof setTimeout>[] = [];

    const derby = (): void => {
        if (derbyRunning) return;
        derbyRunning = true;
        derbyTimers.length = 0;

        // Launch each canonical track to 1 in a staggered wave.
        tracks.forEach((t, i) => {
            derbyTimers.push(
                setTimeout(() => {
                    t.spring.target = 1;
                    startLoop();
                }, i * STAGGER_MS),
            );
        });
        // The live ball joins the wave last, then the whole field bounces home.
        const launchSpan = tracks.length * STAGGER_MS;
        derbyTimers.push(
            setTimeout(() => {
                launchLive();
                startLoop();
            }, launchSpan),
        );
        derbyTimers.push(
            setTimeout(() => {
                settle();
                derbyRunning = false;
            }, launchSpan + 900),
        );
    };

    // Stop the gallery's pending derby timers on scope dispose.
    onScopeDispose(() => derbyTimers.forEach(clearTimeout));

    return { derby };
}
