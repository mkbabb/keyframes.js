import { computed, onScopeDispose, ref, type ComputedRef } from "vue";
import { usePreferredReducedMotion } from "@vueuse/core";
import { SpringProgress } from "@mkbabb/keyframes.js";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * useStageLight — the `--stage-light` hover-brighten / focus-shift authority
 * (Tranche N).
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * The downlight over the carousel is a pure-CSS cone + floor pool driven by two
 * registered custom properties:
 *   • `--stage-light`  — the light INTENSITY ∈ [≈0.7, 1]. Rests at 1 (full); a
 *     hover on a flank card dips the global level so the centre de-emphasises and
 *     the hovered card's own pool brightens (the "downlight slides toward it").
 *   • `--stage-pool-x` — the floor-pool X position ∈ [0, count−1] in CARD-INDEX
 *     units (the view maps it to a px/% offset). It slides toward the hovered
 *     card's index; on un-hover it returns to the centred front index.
 *
 * Both ride a `SpringProgress` (inv ζ — `RAFPlayback`, no hand-rolled rAF). PRM:
 * `respectReducedMotion` FREEZES the light at full intensity (`--stage-light: 1`)
 * and snaps the pool to the centred index — no slide, no dim.
 *
 * LIGHT barrel only (`SpringProgress`) — value.js-free (proof:boundary).
 */

export interface StageLightOptions {
    /** Number of cards (the pool-x index domain). */
    count: number;
    /** The resting/centred front index the pool returns to on un-hover. */
    centerIndex?: number;
}

export interface StageLight {
    /** The live light intensity ∈ [~0.7, 1] (bind to `--stage-light`). */
    readonly light: ComputedRef<number>;
    /** The live pool X in card-index units (bind to `--stage-pool-x`). */
    readonly poolX: ComputedRef<number>;
    /** Hover a card by index → dip the level + slide the pool toward it. */
    hover(index: number): void;
    /** Un-hover → restore full intensity + return the pool to centre. */
    leave(): void;
    /** Re-seat the centred index (the front card changed) — pool follows if idle. */
    setCenter(index: number): void;
    /** D5: the commit payoff — flare the beam to 1.12 (on), or exhale to full (off). */
    flare(on: boolean): void;
    /** Stop the spring loops (idempotent). */
    stop(): void;
}

// The dimmed level the global light falls to while a flank is hovered (the
// centre de-emphasises so the hovered card pops). Never near-black — the
// BLUEPRINT: "dimmed, never near-black".
const HOVER_DIM = 0.78;
const FULL = 1;
/** D5: the payoff flare level (the @property range top). */
const FLARE = 1.12;

export function useStageLight(options: StageLightOptions): StageLight {
    const count = Math.max(1, options.count);
    const centerIndex = ref(options.centerIndex ?? 0);

    const prm = usePreferredReducedMotion();
    const prefersReduced = computed(() => prm.value === "reduce");

    // Two springs: the intensity level and the pool X. Both snap under PRM.
    const lightSpring = new SpringProgress({
        initial: FULL,
        response: 0.4,
        dampingFraction: 1, // critically damped — the light never overshoots
        respectReducedMotion: true,
    });
    const poolSpring = new SpringProgress({
        initial: centerIndex.value,
        response: 0.45,
        dampingFraction: 0.85,
        respectReducedMotion: true,
    });

    const light = ref(lightSpring.value);
    const poolX = ref(poolSpring.value);

    lightSpring.play((v) => {
        light.value = v;
    });
    poolSpring.play((v) => {
        poolX.value = v;
    });

    function hover(index: number): void {
        const i = clampIndex(index);
        if (prefersReduced.value) {
            // PRM: freeze the light at full; the pool snaps to the hovered card
            // (the spring's respectReducedMotion lands `value` immediately).
            lightSpring.target = FULL;
            light.value = lightSpring.value;
            poolSpring.target = i;
            poolX.value = poolSpring.value;
            return;
        }
        lightSpring.target = HOVER_DIM;
        poolSpring.target = i;
    }

    function leave(): void {
        // Restore full intensity + return the pool to the centred front.
        lightSpring.target = FULL;
        poolSpring.target = centerIndex.value;
        if (prefersReduced.value) {
            light.value = lightSpring.value;
            poolX.value = poolSpring.value;
        }
    }

    function flare(on: boolean): void {
        // The payoff surge (or the exhale back to full). PRM snaps the value so
        // "the LOOK survives, the motion doesn't" (D5.5).
        lightSpring.target = on ? FLARE : FULL;
        if (prefersReduced.value) light.value = lightSpring.value;
    }

    function setCenter(index: number): void {
        centerIndex.value = clampIndex(index);
        // If the light is at rest (not hovering), follow the new front so the
        // pool tracks the carousel as it spins.
        if (lightSpring.target === FULL) {
            poolSpring.target = centerIndex.value;
            if (prefersReduced.value) poolX.value = poolSpring.value;
        }
    }

    function stop(): void {
        lightSpring.stop();
        poolSpring.stop();
    }

    function clampIndex(i: number): number {
        return Math.max(0, Math.min(count - 1, i));
    }

    onScopeDispose(() => {
        lightSpring.dispose();
        poolSpring.dispose();
    });

    return {
        light: computed(() => light.value),
        poolX: computed(() => poolX.value),
        hover,
        leave,
        setCenter,
        flare,
        stop,
    };
}
