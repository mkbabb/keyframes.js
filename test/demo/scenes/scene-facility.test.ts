// proof:scene-facility (the RUNTIME half) — T.B1 STAGE 1 (batch-④′ α).
//
// The source-shape clauses live in scripts/proof-scene-facility.mjs (born-RED on
// clause (b) until batch ⑤). THIS witness asserts the STAGE-1 GREEN shape at
// RUNTIME: `facilityFromGroup` maps a real group's members to painting channels +
// a valid ScenePlayback adapter, and the migrated SEQUENCE scene exposes a
// facility (its decoy contract group is deleted) whose ONE channel round-trips
// progress and whose playback is the raw-rAF adapter.
//
// BITE: reds if a migrated scene's facility is malformed (a channel without a
// painting animation, a playback missing a contract method) or if sequence
// re-grows an `animationGroup` in place of the facility.

import { beforeAll, describe, expect, it } from "vitest";
import { effectScope } from "vue";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { AnimationGroup } from "../../../src/animation/group";
import { warmKfEngine } from "../../../demo/@/utils/kfEngine";
import {
    facilityFromGroup,
    type SceneFacility,
} from "../../../demo/app/scene/sceneFacility";
import { useSequenceDemo } from "../../../demo/scenes/sequence/useSequenceDemo";

beforeAll(async () => {
    await warmKfEngine();
});

/** The five-method ScenePlayback contract every facility.playback must satisfy. */
function assertPlaybackShape(pb: SceneFacility["playback"]) {
    for (const m of ["snapshot", "restore", "suspend", "resume", "isPlaying"] as const) {
        expect(typeof pb[m]).toBe("function");
    }
}

describe("proof:scene-facility (runtime) — the STAGE-1 GREEN shape", () => {
    it("facilityFromGroup maps a real group's members to painting channels + a valid adapter", () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        `);
        a.name = "rotate";
        const b = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
            from { transform: translateX(0px); }
            to { transform: translateX(100px); }
        `);
        b.name = "matrix";
        const group = new AnimationGroup(a, b);

        const facility = facilityFromGroup(() => group);

        // A channel PER group member — each carries a PAINTING animation (the
        // triad is honest by construction; there is no decoy channel).
        expect(facility.channels.map((c) => c.name)).toEqual(["rotate", "matrix"]);
        for (const ch of facility.channels) {
            expect(ch.animation).toBeDefined();
            expect(typeof ch.progress).toBe("function");
            expect(typeof ch.setProgress).toBe("function");
        }
        // The facility carries the real group (the shell's panel group) + a valid
        // group adapter as its playback.
        expect(facility.group).toBe(group);
        assertPlaybackShape(facility.playback);

        // The channel round-trip seats the child clock.
        const rotate = facility.channels[0]!;
        rotate.setProgress(0.5);
        expect(rotate.progress()).toBeCloseTo(0.5, 5);
    });

    it("the migrated SEQUENCE scene exposes a facility (no decoy group) with a raw-rAF playback", () => {
        const scope = effectScope();
        const demo = scope.run(() => useSequenceDemo())!;
        try {
            // The decoy contract group is GONE — the scene no longer returns an
            // `animationGroup`; it returns a `facility`.
            expect((demo as Record<string, unknown>).animationGroup).toBeUndefined();

            const facility = demo.facility;
            expect(facility.channels.length).toBeGreaterThanOrEqual(1);
            expect(facility.channels[0]!.name).toBe("Sequence");
            expect(facility.group).toBeUndefined(); // a progress-scalar scene — no group
            assertPlaybackShape(facility.playback);

            // The master channel round-trips progress through the Sequence.
            const ch = facility.channels[0]!;
            ch.setProgress(0.4);
            expect(ch.progress()).toBeCloseTo(0.4, 5);
        } finally {
            scope.stop();
        }
    });
});
