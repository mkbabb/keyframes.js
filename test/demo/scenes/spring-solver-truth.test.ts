/**
 * X.KF.W13X.spring — the spring solver and physics rows' falsifiers.
 *
 * (1) KFA-38 + UIA-KF-204 — the scene is born at an honest rest. The solvers
 *     were built at value 0 with the target written to 1 and the chase intent
 *     born false, so the mount loop stopped at once and left an UNSETTLED
 *     field parked at 0 under a target of 1: the badge read "tracking", x read
 *     0.000, the marker sat at 1, and the first Play or facet write launched the
 *     stale chase. Born state: every solver settled at its target, the target
 *     at the ball, the readouts flushed from the solvers.
 */
import { beforeAll, describe, expect, it } from "vitest";

import { withSetup } from "../../support/withSetup";
import { useSpringDemo } from "../../../demo/scenes/spring/useSpringDemo";
import { useSceneMachine } from "../../../demo/state";
import { warmKfEngine } from "../../../demo/kf-engine";

function parkPausedOnSpring() {
    const machine = useSceneMachine();
    machine.dispatch({ type: "NAVIGATE", to: "spring" });
    machine.dispatch({ type: "SCENE_READY" });
    machine.dispatch({ type: "PAUSE" });
    return machine;
}

beforeAll(async () => {
    await warmKfEngine();
});

describe("(1) KFA-38 + UIA-KF-204 — born at an honest rest", () => {
    it("every solver is settled at its target, and the readouts say so", () => {
        parkPausedOnSpring();
        const [demo, app] = withSetup(() => useSpringDemo());
        try {
            expect(demo.liveSettled.value, "the badge's source reads settled").toBe(true);
            expect(demo.springLive.settled).toBe(true);
            expect(demo.target.value, "the target marker sits on the ball").toBe(demo.springLive.value);
            expect(demo.liveValue.value).toBe(demo.springLive.value);
            for (const t of demo.tracks) {
                expect(t.spring.settled, `${t.preset.name} is settled`).toBe(true);
                expect(t.settled.value).toBe(true);
                expect(t.spring.value).toBe(demo.target.value);
            }
        } finally {
            app.unmount();
        }
    });

    it("reset() returns the field to that same born rest", () => {
        parkPausedOnSpring();
        const [demo, app] = withSetup(() => useSpringDemo());
        try {
            const born = demo.target.value;
            demo.reseat(1 - born);
            demo.reset();
            expect(demo.target.value).toBe(born);
            expect(demo.springLive.settled).toBe(true);
            expect(demo.liveSettled.value).toBe(true);
            expect(demo.springLive.value).toBe(born);
            for (const t of demo.tracks) expect(t.spring.settled).toBe(true);
        } finally {
            app.unmount();
        }
    });
});
