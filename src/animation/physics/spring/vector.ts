/**
 * `physics/spring/vector.ts` — the SpringProgress MULTI-CHANNEL (SoA) lane
 * subsystem (L.W7 §S2, W122 — ADOPT @ 2.97–3.78× over K scalars), carved off the
 * scalar tracker as a cohesive internal seam (R.W2b decomposition).
 *
 * A `SpringProgress` holds at most one `SpringVectorLanes` (lazily armed on the
 * first `setTargets`), and its public `setTargets`/`tickVector`/`values`/
 * `velocities` surface delegates here — so the SCALAR hot path never touches a
 * lane buffer and a scalar-only spring never allocates. The lanes ring
 * identically to a scalar spring of the same `(omega, zeta, omegaD)` because the
 * per-channel step is the SAME closed form `evaluateAt` uses, with the
 * transcendentals (`exp`/`cos`/`sin`) hoisted ONCE per tick and reused across
 * lanes — the dispatch/alloc amortization the W122 probe measured.
 *
 * value.js-free (LIGHT) — plain typed-array math.
 */

/**
 * The shared empty lane buffer the getters return before the first
 * {@link SpringVectorLanes.setTargets} arms the vector lanes — one frozen
 * zero-length `Float64Array`, so a scalar-only spring's getters never allocate.
 * (L.W7 §S2.)
 */
export const EMPTY_LANES = new Float64Array(0);

export class SpringVectorLanes {
    private vecOrigin: Float64Array | null = null;
    private vecOriginVel: Float64Array | null = null;
    private vecTarget: Float64Array | null = null;
    private vecCurrent: Float64Array | null = null;
    private vecVelocity: Float64Array | null = null;
    private vecElapsed = 0;

    /**
     * Re-seat the lanes onto `targets` (one lane per element). First call ARMS
     * the lanes (lazily); subsequent calls re-seat each lane's origin from the
     * lane's CURRENT `(x, v)`, so a mid-flight target change is continuous per
     * channel. The lane count is fixed by the FIRST call's length; a later call
     * with a different length throws (the buffers are stable references).
     */
    setTargets(targets: Float64Array): void {
        const k = targets.length;
        if (this.vecTarget === null) {
            this.vecOrigin = new Float64Array(k);
            this.vecOriginVel = new Float64Array(k);
            this.vecTarget = new Float64Array(k);
            this.vecCurrent = new Float64Array(k);
            this.vecVelocity = new Float64Array(k);
        } else if (this.vecTarget.length !== k) {
            throw new RangeError(
                `setTargets length ${k} does not match the armed lane count ` +
                    `${this.vecTarget.length}; the lane buffers are stable ` +
                    `references — construct a new SpringProgress for a new arity.`,
            );
        }
        // Re-seat each lane's origin from its current (x, v) — continuous per
        // channel (the vector analogue of the scalar `set target` re-seat).
        this.vecOrigin!.set(this.vecCurrent!);
        this.vecOriginVel!.set(this.vecVelocity!);
        this.vecTarget!.set(targets);
        this.vecElapsed = 0;
    }

    /**
     * The shared output lane buffer — the K channels' current values, written in
     * place by {@link tick}. A STABLE reference (never re-allocated after the
     * first {@link setTargets}). Empty before the lanes are armed.
     */
    get values(): Float64Array {
        return this.vecCurrent ?? EMPTY_LANES;
    }

    /**
     * The shared output velocity lane buffer — the K channels' current
     * velocities, written in place by {@link tick}. A STABLE reference; empty
     * before the first {@link setTargets}.
     */
    get velocities(): Float64Array {
        return this.vecVelocity ?? EMPTY_LANES;
    }

    /** True once the lanes are armed by a first {@link setTargets}. */
    get armed(): boolean {
        return this.vecTarget !== null;
    }

    /**
     * Advance EVERY lane by `dt` MILLISECONDS under the spring's
     * `(omega, zeta, omegaD)` — one call, K channels, one buffer write. No-op
     * (returns the same buffer) before the first {@link setTargets} or for
     * `dt <= 0`. The analytic per-channel step is the same closed form
     * `evaluateAt` uses, with the transcendentals hoisted once per tick.
     */
    tick(dt: number, omega: number, zeta: number, omegaD: number): Float64Array {
        if (this.vecTarget === null || dt <= 0) {
            return this.values;
        }
        this.vecElapsed += dt / 1000;
        const t = this.vecElapsed;
        const w = omega;
        const z = zeta;
        const wd = omegaD;
        const origin = this.vecOrigin!;
        const originVel = this.vecOriginVel!;
        const target = this.vecTarget!;
        const current = this.vecCurrent!;
        const velocity = this.vecVelocity!;

        // Hoist the per-tick transcendentals — shared across all lanes.
        const decayU = z < 1 ? Math.exp(-z * w * t) : 0;
        const cos = z < 1 ? Math.cos(wd * t) : 0;
        const sin = z < 1 ? Math.sin(wd * t) : 0;
        const decayC = z === 1 ? Math.exp(-w * t) : 0;
        let r1 = 0;
        let r2 = 0;
        let e1 = 0;
        let e2 = 0;
        if (z > 1) {
            const disc = w * Math.sqrt(z * z - 1);
            r1 = -z * w + disc;
            r2 = -z * w - disc;
            e1 = Math.exp(r1 * t);
            e2 = Math.exp(r2 * t);
        }

        for (let i = 0; i < current.length; i++) {
            const x0 = origin[i]! - target[i]!;
            const v0 = originVel[i]!;
            let xRel: number;
            let vRel: number;
            if (z < 1) {
                const A = x0;
                const B = (v0 + z * w * x0) / wd;
                xRel = decayU * (A * cos + B * sin);
                vRel =
                    decayU *
                    ((B * wd - A * z * w) * cos - (A * wd + B * z * w) * sin);
            } else if (z === 1) {
                const A = x0;
                const B = v0 + w * x0;
                xRel = decayC * (A + B * t);
                vRel = decayC * (B - w * (A + B * t));
            } else {
                const A = (v0 - r2 * x0) / (r1 - r2);
                const B = x0 - A;
                xRel = A * e1 + B * e2;
                vRel = A * r1 * e1 + B * r2 * e2;
            }
            current[i] = target[i]! + xRel;
            velocity[i] = vRel;
        }
        return current;
    }
}
