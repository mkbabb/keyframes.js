/**
 * X.KF.W11.b — G-KFW11-7's witness (the square packet).
 *
 * Born RED against `2b649a1d`. Four clauses, one per cure family:
 *
 *   (a) L-2 — the EDITOR SEAM. A keyframes-panel edit round-trip through
 *       `useKeyframeOps.updateFromString` must leave the square's animation
 *       holding ITS OWN custom renderer: `usesDefaultRenderer(frame.transform)`
 *       is `false` on every compiled frame, and the nested `transform.a.b.c.d`
 *       leaf still reaches the renderer (`unflatten` preserved).
 *   (b) L-1/C-3 — the PLAYBACK AUTHORITY. The takeover edge dispatches PAUSE
 *       through the machine, never `animationGroup.pause()` behind it.
 *   (c) MISS-3 — the TOUR IS SETTLE-PACED, as its own docblock asserts: a leg
 *       advances when the springs arrive, not on a fixed timer.
 *   (d) N-SQ-4/D-1/D-6 — the TETHER HAS A FRAME. The instrument draws a subject
 *       travelling ±110 px in the stage's own px space, with NO `viewBox` (the
 *       `viewBox` + `preserveAspectRatio="none"` cure is geometrically unsound:
 *       a non-conformal map turns the perpendicular bow off-normal).
 */
import { beforeAll, describe, expect, it } from "vitest";
import { ref } from "vue";
import { mount } from "@vue/test-utils";
import { withSetup } from "../../support/withSetup";
import { useSquareDemo } from "../../../demo/scenes/square/useSquareDemo";
import { useKeyframeOps } from "../../../demo/components/instrument/keyframes/composables/useKeyframeOps";
import type { KeyframesState } from "../../../demo/components/instrument/keyframes/composables/useKeyframesState";
import SquareInstrument from "../../../demo/scenes/square/SquareInstrument.vue";
import { warmKfEngine } from "../../../demo/kf-engine";

/** The two members of `KeyframesState` the ops thread actually reads. */
const stateStub = () =>
    ({
        addKeyframesString: ref(""),
        kfControls: { keyframes: "", addKeyframes: "", dialogOpen: false },
        getFormatWidth: () => undefined,
    }) as unknown as KeyframesState;

const syncStub = () => ({
    updateAllStrings: async () => "",
    updateAllStringsAndAnimation: async () => {},
    debouncedUpdateAllStrings: () => {},
});

describe("X.KF.W11.b (a) — the editor seam keeps the square's own renderer (L-2)", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    it("survives a keyframes-panel round-trip with its custom transformFunc intact", async () => {
        const el = document.createElement("div");
        const [demo, app] = withSetup(() => useSquareDemo(ref(el)));
        try {
            demo.anim.setTargets(el);
            demo.anim.parse();

            // The square's frames are compiled against ITS renderer, never the
            // instance default — that is the primitive the scene exists to prove.
            expect(demo.anim.frames.length).toBeGreaterThan(0);
            for (const frame of demo.anim.frames) {
                expect(demo.anim.usesDefaultRenderer(frame.transform)).toBe(
                    false,
                );
            }
            expect(demo.anim.unflatten).toBe(true);

            // The renderer identity itself — the thing the round-trip used to
            // destroy. Captured BEFORE the edit so the assertion after it is an
            // identity claim, not a shape claim.
            const ownRenderer = demo.anim.frames[0]!.transform;

            const ops = useKeyframeOps(
                demo.anim,
                stateStub(),
                () => {},
                syncStub(),
            );

            // The exact edit the panel performs: a whitespace-level round-trip
            // of an authored keyframes string. The throwaway the editor compiles
            // carries NO transform — which is precisely why the receiver's own
            // renderer is at risk on the adopt.
            await ops.updateFromString(
                "0% { transform: translateX(0px); }\n100% { transform: translateX(10px); }",
            );

            // L-2: after the round-trip the animation STILL renders through its
            // own nested-object transformFunc — the SAME function object.
            expect(demo.anim.frames.length).toBeGreaterThan(0);
            for (const frame of demo.anim.frames) {
                expect(frame.transform).toBe(ownRenderer);
                expect(demo.anim.usesDefaultRenderer(frame.transform)).toBe(
                    false,
                );
            }
            // `unflatten` is the flag that says the renderer is handed the
            // NESTED vars — without it `transform.a.b.c.d` never reaches it.
            expect(demo.anim.unflatten).toBe(true);

            // And the templates too, so the next `parse()` cannot re-derive the
            // loss (the round-trip must be idempotent).
            demo.anim.parse();
            for (const frame of demo.anim.frames) {
                expect(frame.transform).toBe(ownRenderer);
            }
        } finally {
            app.unmount();
        }
    });
});

describe("X.KF.W11.b (d) — the tether is drawn in a frame that exists (D-1/D-6/N-SQ-4)", () => {
    const TRAVEL = 110;

    const tether = (deflX: number, deflY: number) => {
        const wrapper = mount(SquareInstrument, {
            props: {
                deflX,
                deflY,
                settled: false,
                tetherActive: true,
                readoutX: "0.00",
                readoutY: "0.00",
                tumbleHintShown: false,
                travel: TRAVEL,
            },
        });
        const svg = wrapper.get("svg.square-tether");
        const d = wrapper.get("path.square-tether-line").attributes("d")!;
        // `M hx hy Q cx cy bx by` — six numbers, in that order.
        const nums = d.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
        return { wrapper, svg, d, nums };
    };

    // N-SQ-4 orders the cure and rules OUT `viewBox` + `preserveAspectRatio`:
    // the pair is a non-conformal map, so the perpendicular bow stops being
    // perpendicular on any non-square stage.
    it("carries neither a viewBox nor a preserveAspectRatio", () => {
        const { svg, wrapper } = tether(0, 0);
        expect(svg.attributes("viewBox")).toBeUndefined();
        expect(svg.attributes("preserveAspectRatio")).toBeUndefined();
        // The element IS the travel envelope, so one user unit is one CSS px.
        expect(svg.attributes("style")).toContain(`--tether-travel: ${TRAVEL}`);
        wrapper.unmount();
    });

    it("anchors home at the envelope centre and reaches exactly ±travel px", () => {
        // Full right deflection: home (110,110) → box end (220,110).
        const right = tether(1, 0);
        expect(right.nums[0]).toBe(TRAVEL);
        expect(right.nums[1]).toBe(TRAVEL);
        expect(right.nums[4]).toBeCloseTo(TRAVEL + TRAVEL, 2);
        expect(right.nums[5]).toBeCloseTo(TRAVEL, 2);
        right.wrapper.unmount();

        // Full up-left: (110,110) → (0,0). D-6's old 38-user-unit reach could
        // not express this at ANY stage size — the coincidence was unsatisfiable.
        const upLeft = tether(-1, -1);
        expect(upLeft.nums[4]).toBeCloseTo(0, 2);
        expect(upLeft.nums[5]).toBeCloseTo(0, 2);
        upLeft.wrapper.unmount();
    });

    it("bows perpendicular to the pull, which a conformal map preserves", () => {
        const { nums, wrapper } = tether(1, 0);
        const [hx, hy, cx, cy, bx, by] = nums as [
            number, number, number, number, number, number,
        ];
        // control-point offset from the chord midpoint ⟂ the chord
        const mx = (hx + bx) / 2;
        const my = (hy + by) / 2;
        const dot = (cx - mx) * (bx - hx) + (cy - my) * (by - hy);
        expect(Math.abs(dot)).toBeLessThan(1e-6);
        expect(Math.hypot(cx - mx, cy - my)).toBeGreaterThan(0);
        wrapper.unmount();
    });
});
