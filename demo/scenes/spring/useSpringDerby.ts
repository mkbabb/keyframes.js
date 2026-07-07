import { ref, onScopeDispose } from "vue";

import type { SpringTrack } from "./useSpringHotPath";

// L.W11 S6 — the four DERBY LANES: each canonical preset mapped to its sanctioned
// rainbow lane hue token (--spring-lane-* in design-idioms.css, consumed, not a
// new identity). The mapping is spring.md's exact four-lane recipe:
//   smooth → blue, snappy → green, bouncy → violet (the playful ring),
//   gentle → red (--color-progress, the critically-damped one that DOESN'T cross).
// The lane hue is the token NAME (the CSS var the lane row binds to --ball-tone).
const LANE_TOKENS: Record<string, string> = {
    smooth: "var(--spring-lane-smooth)",
    snappy: "var(--spring-lane-snappy)",
    bouncy: "var(--spring-lane-bouncy)",
    gentle: "var(--spring-lane-gentle)",
};

interface DerbyLane {
    /** The preset name (smooth/snappy/bouncy/gentle). */
    name: string;
    /** ζ (the damping fraction) — bouncy=0.45 rings past, gentle=1.0 never crosses. */
    zeta: number;
    /** The index into `springLive.trackValues` the lane reads its ball from. */
    index: number;
    /** The sanctioned rainbow lane-hue token (consumed, hue-exact). */
    tone: string;
}

/**
 * EASTER EGG — "the Derby" (H.W12.S6 + L.W11 S6), colocated as its own concern
 * seam.
 *
 * Double-click the rail → a four-lane spring DERBY. The canonical trackers
 * (smooth/snappy/bouncy/gentle) are normally re-seated TOGETHER; the egg launches
 * them in a STAGGERED wave (a 110ms cascade) so their different damping fractions
 * are SEEN racing in four RAINBOW LANES — the bouncy track (ζ=0.45) overshoots
 * and rings PAST the shared target line while the gentle one (ζ=1.0) glides in
 * critically-damped and NEVER crosses. DOGFOODS each track's own SpringProgress
 * (inv ζ); the shared loop is the sole driver, so the egg only re-seats targets
 * on a timer. Bounces back to 0 after the launch so the showcase returns to rest.
 *
 * L.W11 S6 — `derbyActive` (a reactive ref) gates the four-lane overlay in the
 * view layer: the lanes show only DURING the race, the page rests as one calm red
 * spring otherwise (proportion — a discovered delight, not a permanent re-theme).
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

    // L.W11 S6 — the reactive race flag the view layer reads to reveal the lanes.
    const derbyActive = ref(false);

    // The four lane descriptors (name, ζ, the trackValues index, the rainbow tone)
    // — built once from the canonical trackers, consumed by the lane overlay.
    const lanes: DerbyLane[] = tracks.map((t, i) => ({
        name: t.preset.name,
        zeta: t.preset.dampingFraction,
        index: i,
        tone: LANE_TOKENS[t.preset.name] ?? "var(--color-progress)",
    }));

    const derby = (): void => {
        if (derbyRunning) return;
        derbyRunning = true;
        derbyActive.value = true;
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
                // Hold the lanes a beat past the settle so the ring is seen
                // resolving, then drain back to the calm red resting state.
                derbyTimers.push(
                    setTimeout(() => {
                        derbyActive.value = false;
                    }, 700),
                );
            }, launchSpan + 900),
        );
    };

    // Stop the gallery's pending derby timers on scope dispose.
    onScopeDispose(() => derbyTimers.forEach(clearTimeout));

    return { derby, derbyActive, lanes };
}
