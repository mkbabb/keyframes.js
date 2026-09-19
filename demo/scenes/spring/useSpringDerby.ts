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
    const derbyTimers: ReturnType<typeof setTimeout>[] = [];

    // L.W11 S6 — the reactive race flag the view layer reads to reveal the lanes.
    //
    // M-5 — AND IT IS NOW THE ONLY GUARD. The race used to be guarded by a
    // SECOND, private `derbyRunning` boolean whose lifetime did not match this
    // one's: `derbyRunning` cleared at the settle (~1340 ms) while `derbyActive`
    // — the flag the overlay actually renders on — cleared 700 ms later
    // (~2040 ms). A second double-tap inside that window therefore passed the
    // guard, and `derbyTimers.length = 0` then ORPHANED the pending hide-timer
    // without clearing it, so the stale timer unmounted the lanes ~540 ms into
    // race #2. The same truncation emptied the array `onScopeDispose` iterates,
    // leaving a timer pending against a disposed scope on a scene swap.
    //
    // LAW A census (§B.3(2)), run at this seat before the delete —
    // ⟨cmd⟩ `grep -rn derbyRunning demo test` → FOUR lines, all in this file
    // (the declaration, the guard read, the set, the clear); zero consumers
    // anywhere else, and no comment documented it. Two booleans for one state
    // is the defect; the one the UI renders on is the one that survives.
    const derbyActive = ref(false);

    /** Clear every pending timer, THEN drop the handles. Never the reverse —
     *  the reverse is exactly the orphaning M-5 convicts. One body serves
     *  re-entry and scope disposal, so the two can no longer diverge. */
    const cancelTimers = (): void => {
        for (const t of derbyTimers) clearTimeout(t);
        derbyTimers.length = 0;
    };

    // The four lane descriptors (name, ζ, the trackValues index, the rainbow tone)
    // — built once from the canonical trackers, consumed by the lane overlay.
    const lanes: DerbyLane[] = tracks.map((t, i) => ({
        name: t.preset.name,
        zeta: t.preset.dampingFraction,
        index: i,
        tone: LANE_TOKENS[t.preset.name] ?? "var(--color-progress)",
    }));

    const derby = (): void => {
        // The overlay's own flag gates re-entry for the WHOLE race, hold
        // included: a second double-tap before the lanes have left is refused,
        // not admitted into a half-torn-down race.
        if (derbyActive.value) return;
        cancelTimers();
        derbyActive.value = true;

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
                // Hold the lanes a beat past the settle so the ring is seen
                // resolving, then leave.
                //
                // N-1 — "then DRAIN BACK to the calm red resting state" is what
                // this said, and it was false twice over: the overlay's `v-if`
                // had no <Transition> at all, so the lanes vanished in one frame,
                // and the rail/ball/marker snapped 0.35→1 because the opacity
                // transition lived only INSIDE `.spring-rail--derby`. The exit is
                // a real two-way fade now (SpringTarget.vue's base rules plus a
                // named <Transition>), so the sentence can stand — but only
                // because the bytes changed, not because the sentence did.
                derbyTimers.push(
                    setTimeout(() => {
                        derbyActive.value = false;
                    }, 700),
                );
            }, launchSpan + 900),
        );
    };

    // Stop the gallery's pending derby timers on scope dispose — the SAME body
    // re-entry uses, so a disposed scope can never be left holding one.
    onScopeDispose(cancelTimers);

    return { derby, derbyActive, lanes };
}
