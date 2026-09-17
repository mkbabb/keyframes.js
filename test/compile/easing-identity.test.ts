/**
 * easing-identity.test.ts — X.KF.W4 K1 / **G-KFW4-5** (G-L7a).
 *
 * The defect this locks: value.js 4.0.0's `easing(name)` is **not memoised**, so
 * 21 of the registry's 40 names hand out a FRESH function reference on every
 * call, and the 40 names resolve onto only **31 distinct references** (nine
 * hyphen/camel twin pairs share one). `registry.ts` builds its name→function
 * map ONCE at module evaluation (R-2's "memoise kf-side now"), which is what
 * makes kf-side identity stable at all.
 *
 * **How identity is proved here, and why it is not a relabel** (COHESION §0j.C
 * **KF-SS3**, the owner's ruling): *"the easing-name trap is cured by K1's
 * sampled value-identity on the 33-point grid — the mechanism, not a relabel."*
 * A name-equality round-trip is UNATTAINABLE without touching the roster (nine
 * references carry two names each) and the `bezierPresets` fence forbids both a
 * key removal (a boot `throw` at `registry.ts:43`) and a key addition (it
 * silently widens kf's public registry). So the proposition asserted is the one
 * that is both true and load-bearing: **the curve survives the round-trip**,
 * sampled at the 33 grid points `t = i/32, i ∈ [0,32]` — the same grid
 * `linearDensifyEasing` emits on, so a stop-for-stop comparison is exact rather
 * than interpolated.
 *
 * Each clause carries its own BITE (what edit makes it red).
 */
import { describe, expect, it } from "vitest";
import { easing } from "@mkbabb/value.js/easing";
import {
    resolveTimingFunction,
    timingFunctionEntries,
} from "../../src/animation/compile/easing/registry";
import { serializeEasing } from "../../src/animation/compile/emit/easing-serialize";
import type { TimingFunction } from "../../src/animation/constants";

/** The 33-point grid — `linearDensifyEasing`'s own sample set (`n = 32`). */
const GRID = Array.from({ length: 33 }, (_, i) => i / 32);

/**
 * `linearDensifyEasing`'s own stop quantizer, re-declared here so the oracle is
 * EXACT rather than banded. The densify emits `round5(fn(t))` at each grid
 * point, so the round-tripped `linear()` must reproduce the quantized sample —
 * not merely land near the source curve. A tolerance band would let a real
 * curve defect hide under it; an equality against the declared quantization
 * cannot. The only slack is IEEE re-evaluation noise in the piecewise-linear
 * reconstruction (asserted at 12 decimals).
 */
const round5 = (n: number): number => Math.round(n * 1e5) / 1e5;

const sample = (fn: TimingFunction): number[] => GRID.map((t) => fn(t));

const registryNames = timingFunctionEntries.map(([name]) => name);

describe("K1 — the module-evaluation memo makes registry identities stable", () => {
    it("hands out ONE stable reference per name, for every name in the registry", () => {
        expect(registryNames.length).toBe(40);
        for (const name of registryNames) {
            expect(resolveTimingFunction(name)).toBe(
                resolveTimingFunction(name),
            );
        }
    });

    it("NEGATIVE CONTROL — value.js's own `easing()` is unstable for 21 of the 40, which is what the memo cures", () => {
        // BITE: delete the module-evaluation map (resolve per call) and the
        // clause above reds on exactly these names. Stated as a measured
        // inequality rather than prose so the memo's necessity is checkable.
        const unstable = registryNames.filter((name) => {
            const a = easing(name);
            const b = easing(name);
            return a.ok && b.ok && a.value !== b.value;
        });
        expect(unstable.length).toBe(21);
    });
});

describe("K1 — serialize → re-parse preserves the CURVE on the 33-point grid", () => {
    it.each(registryNames)(
        "%s round-trips value-identically (33 samples)",
        (name) => {
            const fn = resolveTimingFunction(name);
            const serialized = serializeEasing({ fn });
            const roundTripped = resolveTimingFunction(serialized);

            // Two emission paths, both declared rather than averaged over: a
            // name whose hyphenation IS a native CSS keyword rides VERBATIM and
            // is not quantized at all; every other registry curve emits its
            // `linear()` densify, whose stops are `round5`-quantized.
            const densified = serialized.startsWith("linear(");
            const before = sample(fn);
            const after = sample(roundTripped);
            for (let i = 0; i < GRID.length; i++) {
                const expected = densified ? round5(before[i]!) : before[i]!;
                expect(after[i]!).toBeCloseTo(expected, 12);
            }
        },
    );

    it("the nine reference collisions are VALUE-identical twins, not a mislabel (KF-SS3)", () => {
        // The reverse-map in `serializeEasing` cannot recover WHICH of a twin
        // pair produced a reference — and it does not need to, because the two
        // names denote the SAME curve. That is the ruling's whole point: the
        // trap is cured by proving curve-identity, never by repointing a name
        // at a class it does not belong to (`smooth-step-3` stays a smoothstep
        // polynomial; it is not flipped into `bezierPresets`).
        // BITE: repoint any twin at a different curve and a pair reds here.
        const byRef = new Map<TimingFunction, string[]>();
        for (const [name, fn] of timingFunctionEntries) {
            const group = byRef.get(fn);
            if (group) group.push(name);
            else byRef.set(fn, [name]);
        }
        const collisions = [...byRef.values()].filter((g) => g.length > 1);

        expect(byRef.size).toBe(31);
        expect(collisions.length).toBe(9);
        for (const group of collisions) {
            const [first, ...rest] = group;
            const reference = sample(resolveTimingFunction(first!));
            for (const twin of rest) {
                expect(sample(resolveTimingFunction(twin))).toEqual(reference);
            }
        }
    });
});

describe("K1 — the serializer still distinguishes a registry curve from a closure", () => {
    it("serializes every registry name to a non-empty CSS <easing-function>", () => {
        for (const name of registryNames) {
            const out = serializeEasing({ fn: resolveTimingFunction(name) });
            expect(out.length).toBeGreaterThan(0);
        }
    });

    it("THROWS on a twinless closure (the fail-explicit floor, preserved)", () => {
        // BITE: any cure that makes an unknown closure serialize to a WRONG
        // curve instead of throwing reds here. `serializeEasing`'s throw is the
        // contract four specs in `test/compile/` and `test/engine/` already
        // assert; this gate re-states it at the identity seam so the K1 cure
        // cannot be taken as licence to soften it.
        expect(() => serializeEasing({ fn: (t: number) => t * t * t })).toThrow(
            /timingFunction/,
        );
    });
});
