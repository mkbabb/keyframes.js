import { computed, onScopeDispose, ref, type ComputedRef } from "vue";
import { usePreferredReducedMotion } from "@vueuse/core";
import { SpringProgress } from "@mkbabb/keyframes.js";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * useCarouselOrbit — the ring-angle SpringProgress + the per-card transform
 * deriver (Tranche N).
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Owns ONE `SpringProgress` over the ring ANGLE (a scalar, in degrees). The
 * carousel is a tilted disk; each card sits at `cardIndex × step` degrees around
 * the ring. Spinning a card to the front means re-seating the spring's target to
 * the SHORTEST signed angular delta that lands that card's slot at angle 0.
 *
 * VERIFIED GEOMETRY (do not re-derive — IMPL-BLUEPRINT §"Verified facts"):
 *   • the ring tilts `rotateX(-15deg)` → BACK HIGHER (`+deg` is the inverted bug)
 *   • `perspective: 1100px`, `perspective-origin: 50% 42%`  (owned by the view)
 *   • each card: `rotateY(a) translateZ(R) rotateY(-a)` — counter-rotated to face
 *     the user; FRONT (a = 0) = nearest / largest / lowest, BACK = smallest /
 *     highest / dimmed.
 *
 * The per-card visual falloff (opacity / scale / brightness / blur / z-index) is
 * a pure function of the card's |angle| from front, sampled off the LIVE spring
 * value — so the whole ring eases as one interruptible motion.
 *
 * inv ζ: every motion rides `SpringProgress` on `RAFPlayback` (no hand-rolled
 * rAF). PRM: the spring's `respectReducedMotion` snaps the orbit instantly.
 * LIGHT barrel only (`SpringProgress`) — value.js-free (proof:boundary).
 */

export interface CarouselOrbitOptions {
    /** Number of cards in the ring (the angular domain `count × step = 360°`). */
    count: number;
    /**
     * The ring radius in px, fed to each card's `translateZ(R)`. Default 320 —
     * the front card sits nearest, the back card recedes by `2R`.
     */
    radius?: number;
    /** The initial front index (the centered card). Default 0. */
    initialIndex?: number;
}

/** The per-card derived transform + visual-falloff bundle the view binds. */
export interface CarouselCardDerived {
    /** The full CSS `transform` string for this card's ring slot. */
    transform: string;
    /** [0,1] opacity — front full, far cards faded (never to 0). */
    opacity: number;
    /** Uniform scale — front largest, far cards smaller. */
    scale: number;
    /** CSS `filter: brightness()` factor — darks are LIFTED, never crushed. */
    brightness: number;
    /** Blur radius in px — 0 near, capped ~1px on the FAR cards only. */
    blur: number;
    /** Integer z-index — front on top, derived from depth. */
    zIndex: number;
}

export interface CarouselOrbit {
    /** The live front index (rounded from the live angle) — reactive. */
    readonly frontIndex: ComputedRef<number>;
    /**
     * The DESTINATION slot the spring is chasing (the decay-projected rest a
     * flick is headed to), independent of the passing live angle. D1.1: the
     * commit arm latches THIS while coasting, never the slot the ring is passing
     * through.
     */
    readonly targetIndex: ComputedRef<number>;
    /** The live effective ring angle in degrees — reactive (settles via spring). */
    readonly angle: ComputedRef<number>;
    /** True while the spring is still chasing its target. */
    readonly spinning: ComputedRef<boolean>;
    /** Spin the chosen card to front via the SHORTEST signed delta (interruptible). */
    setTargetIndex(index: number): void;
    /** Step the ring by `dir` cards (+1 = next/right, -1 = prev/left). */
    step(dir: number): void;
    /** Derive the per-card transform + falloff from the LIVE angle. */
    derive(cardIndex: number): CarouselCardDerived;
    /** Stop the spring loop (idempotent). */
    stop(): void;
}

export function useCarouselOrbit(
    options: CarouselOrbitOptions,
): CarouselOrbit {
    const count = Math.max(1, options.count);
    const radius = options.radius ?? 320;
    const step = 360 / count;

    const prm = usePreferredReducedMotion();
    const prefersReduced = computed(() => prm.value === "reduce");

    // The ring angle in DEGREES. The spring runs in the same continuous angular
    // space the cards are placed in: card i is at `i × step − ringAngle`, so
    // ringAngle 0 puts card 0 at front; setTargetIndex re-seats ringAngle so the
    // chosen card's slot lands at 0 along the shortest arc.
    // respectReducedMotion makes a re-seat snap to terminal in one emit.
    const spring = new SpringProgress({
        initial: options.initialIndex != null ? options.initialIndex * step : 0,
        // The iOS "smooth" register — a calm, no-overshoot settle for a ring of
        // live previews (overshoot would re-trigger LOD churn on the flank cards).
        response: 0.55,
        dampingFraction: 0.9,
        respectReducedMotion: true,
    });

    // The live angle mirror (few-Hz reactive — the per-card painter reads the
    // spring directly, but the view needs a reactive front index + spinning flag).
    const liveAngle = ref(spring.value);
    const spinning = ref(false);

    // The discrete target index — the front the spring is chasing. Drives the
    // shortest-delta re-seat and survives a live OS PRM toggle.
    const targetIndex = ref(
        options.initialIndex != null ? mod(options.initialIndex, count) : 0,
    );

    // Drive the spring; mirror its value into the reactive angle each frame. The
    // loop auto-stops on settle (SpringProgress.play contract) and auto-resumes
    // when `target` is set again — so one `play` covers the lifetime.
    spring.play((v) => {
        liveAngle.value = v;
        spinning.value = !spring.settled;
    });

    /**
     * Spin the chosen card to front via the SHORTEST signed angular delta. The
     * target angle for index `i` is `i × step`, but the ring is periodic (mod
     * 360), so we re-seat from the spring's CURRENT value to the nearest
     * congruent multiple — the spring keeps its live velocity (interruptible:
     * re-seating mid-flight continues from the live (value, velocity)).
     */
    function setTargetIndex(index: number): void {
        const i = mod(index, count);
        targetIndex.value = i;
        const desired = i * step;
        const current = spring.value;
        // Shortest signed delta to a congruent angle: bring `desired` into the
        // same revolution as `current`, then snap to the nearest of the three
        // candidates (one revolution either side) so we never spin the long way.
        const base = current - mod(current, 360); // the revolution `current` is in
        let best = base + desired;
        let bestDist = Math.abs(best - current);
        for (const cand of [base + desired - 360, base + desired + 360]) {
            const d = Math.abs(cand - current);
            if (d < bestDist) {
                best = cand;
                bestDist = d;
            }
        }
        // Setting target auto-resumes the managed loop (the spring contract); PRM
        // snaps it to terminal in one emit (no orbit), so the front index settles
        // instantly under reduced motion.
        spring.target = best;
        if (prefersReduced.value) {
            // The snap already landed `value` at `best`; mirror it so the
            // reactive front index is correct on the same tick.
            liveAngle.value = spring.value;
            spinning.value = false;
        } else if (Math.abs(best - current) < 1e-3) {
            // No-move re-seat (target already the current slot — e.g. the open's
            // setTargetIndex(frontIndex), or a commit-arm on the already-front
            // card). The managed loop parks WITHOUT emitting a final settled
            // frame, so `spinning` would otherwise stay stuck `true` and the
            // commit settle-watch would never match (only the failsafe fired).
            liveAngle.value = best;
            spinning.value = false;
        } else {
            spinning.value = true;
        }
    }

    /** Step the ring by `dir` cards (+1 next, -1 prev) — shortest delta. */
    function step_(dir: number): void {
        setTargetIndex(targetIndex.value + Math.sign(dir));
    }

    // ── The per-card transform deriver ───────────────────────────────────────
    // Card `i`'s angle around the ring relative to FRONT: `i × step − ringAngle`,
    // normalized to (−180, 180]. front a = 0 (nearest/largest/lowest). The card
    // transform is the verified `rotateY(a) translateZ(R) rotateY(-a)` (the
    // counter-rotation faces it to the user); the ring's `rotateX(-15deg)` tilt
    // is applied ONCE on the ring container (the view), not per card.
    function derive(cardIndex: number): CarouselCardDerived {
        const a = signedAngle(cardIndex * step - liveAngle.value);
        const abs = Math.abs(a);
        // Depth fraction ∈ [0,1]: 0 at front, 1 at the back (|a| = 180).
        const depth = abs / 180;

        // Falloff curves (eased so the front-neighbour reads clearly distinct):
        //  • scale: front 1 → back 0.62 (a smooth recede)
        //  • opacity: front 1 → back 0.5 (NEVER 0 — every card stays legible)
        //  • brightness: darks LIFTED — front 1 → back 0.78 (dimmed, not crushed)
        //  • blur: 0 near, ramps in only past the immediate flanks, capped ~1px
        const ease = depth * depth; // quadratic — flanks stay crisp, back recedes
        const scale = 1 - 0.38 * ease;
        const opacity = 1 - 0.5 * ease;
        const brightness = 1 - 0.22 * ease;
        // Blur stays 0 until the card is well behind the flanks (depth > 0.55),
        // then ramps to a 1px cap on the rear only (the BLUEPRINT's "far only").
        const blur = depth > 0.55 ? Math.min(1, (depth - 0.55) / 0.45) : 0;

        // z-index from depth: front (depth 0) highest. The ring spans `count`
        // cards; map depth → an integer band so siblings never z-fight.
        const zIndex = Math.round((1 - depth) * 1000);

        return {
            transform: `rotateY(${a.toFixed(3)}deg) translateZ(${radius}px) rotateY(${(-a).toFixed(3)}deg)`,
            opacity,
            scale,
            brightness,
            blur,
            zIndex,
        };
    }

    function stop(): void {
        spring.stop();
    }

    onScopeDispose(() => spring.dispose());

    return {
        frontIndex: computed(() => mod(Math.round(liveAngle.value / step), count)),
        targetIndex: computed(() => targetIndex.value),
        angle: computed(() => liveAngle.value),
        spinning: computed(() => spinning.value),
        setTargetIndex,
        step: step_,
        derive,
        stop,
    };
}

// ── geometry helpers ─────────────────────────────────────────────────────────

/** Positive modulo (JS `%` keeps the dividend's sign). */
function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
}

/** Normalize an angle (deg) to (−180, 180]. */
function signedAngle(deg: number): number {
    let a = mod(deg, 360);
    if (a > 180) a -= 360;
    return a;
}
