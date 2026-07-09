/**
 * S.B7 · S5 — the documented composite seam.
 *
 * `AnimationGroup#transformFramesGrouped` is `private` by design (R.W2 · lib-group
 * F8): the PUBLIC single-frame paint entry is `render(t)`; the composite body lives
 * in `group/compositor.ts`. But the blend-correctness + zero-alloc suites need the
 * RAW composited SoA frame at a given `t` to assert layer math and buffer identity —
 * `render()` paints, it does not return the frame.
 *
 * Before S.B7 ~20 sites reached in with `group.transformFramesGrouped(t)` — invisible
 * to `check` because `test/` sat outside the typecheck. Now that `tsconfig.test.json`
 * is in the `check` roster, a bare private access REDs (TS2341). Rather than scatter
 * `vi.spyOn(private)` / `(group as any)` casts (each an untyped footgun that the gate
 * exists to forbid), every probe routes through THIS ONE seam. The `CompositeProbe`
 * interface mirrors the real private signature (`(t: number) => Record<string,
 * unknown>`), so a drift in `transformFramesGrouped`'s shape REDs this file — the same
 * discipline as `test/stubs/glass-ui-motion-core.ts` (typed against the real surface).
 *
 * This is the SOLE sanctioned reach into the compositor's private surface: a fresh
 * private access anywhere else still REDs the perimeter — that is the S.B7 gate's
 * falsifiability witness ("plant a private-access in a test → RED").
 */
import { vi } from "vitest";
import type { MockInstance } from "vitest";
import type { Vars } from "../../src/animation/constants";
import type { AnimationGroup } from "../../src/animation/group";

/** The real (private) compositor signature, mirrored so a drift REDs this seam. */
interface CompositeProbe {
    transformFramesGrouped(t: number): Record<string, unknown>;
}

/**
 * Composite every layer into the grouped SoA frame at time `t` — the exact private
 * path `render(t)` drives, exposed for blend/zero-alloc assertions.
 */
export function compositeFramesAt<V extends Vars>(
    group: AnimationGroup<V>,
    t: number,
): Record<string, unknown> {
    return (group as unknown as CompositeProbe).transformFramesGrouped(t);
}

/**
 * Spy on the private composite path — the sanctioned replacement for the raw
 * `vi.spyOn(group, "transformFramesGrouped")` footgun (S.B7 · S5). A caller that
 * needs to assert the compositor WAS / WAS-NOT reached (e.g. single- vs
 * multi-target scrub routing) takes the returned `MockInstance` and asserts on
 * its call record — without naming the private key at the test site.
 */
export function spyOnComposite<V extends Vars>(
    group: AnimationGroup<V>,
): MockInstance<(t: number) => Record<string, unknown>> {
    return vi.spyOn(
        group as unknown as CompositeProbe,
        "transformFramesGrouped",
    );
}
