/**
 * S.B7 · S4 — Sequence scene composable coverage (a25 F1 · fold row 40).
 *
 * Locks `useSequenceInstrument` (the scrub/power-on UI state machine — pure refs)
 * and smoke-constructs `useSequenceDemo` (the master-playhead transport built over
 * `Sequence`; scene-machine + warmed-engine wiring), referencing the scene's
 * transport key so a rename reds here.
 */
import { beforeAll, describe, expect, it } from "vitest";
import { effectScope } from "vue";
import { useSequenceInstrument } from "../../../demo/scenes/sequence/useSequenceInstrument";
import {
    ROW_COUNT,
    STAGGER_MAX,
    useSequenceDemo,
} from "../../../demo/scenes/sequence/useSequenceDemo";
import { SEQUENCE_SCENE_ID } from "../../../demo/scenes/sequence/sequenceKeys";
import { warmKfEngine } from "../../../demo/utils/kfEngine";

describe("useSequenceInstrument — the scrub/power-on state", () => {
    it("setScrubbing toggles the scrubbing flag", () => {
        const { isScrubbing, setScrubbing } = useSequenceInstrument();
        expect(isScrubbing.value).toBe(false);
        setScrubbing(true);
        expect(isScrubbing.value).toBe(true);
        setScrubbing(false);
        expect(isScrubbing.value).toBe(false);
    });

    it("setScrubDir clamps to ±1 (sign only)", () => {
        const { scrubDir, setScrubDir } = useSequenceInstrument();
        expect(scrubDir.value).toBe(1);
        setScrubDir(-5);
        expect(scrubDir.value).toBe(-1);
        setScrubDir(3);
        expect(scrubDir.value).toBe(1);
        // Zero is not negative → forward.
        setScrubDir(0);
        expect(scrubDir.value).toBe(1);
    });

    it("powerOn is idempotent (the one-shot boot guard holds)", () => {
        const { isPoweringOn, powerOn } = useSequenceInstrument();
        powerOn();
        const afterFirst = isPoweringOn.value;
        powerOn(); // second call is guarded — no state change
        expect(isPoweringOn.value).toBe(afterFirst);
    });
});

describe("useSequenceDemo construction", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    it("exposes the row-grid constants + constructs without throwing", () => {
        expect(ROW_COUNT).toBe(5);
        expect(STAGGER_MAX).toBe(1600);
        const scope = effectScope();
        const demo = scope.run(() => useSequenceDemo())!;
        expect(demo).toBeTruthy();
        expect(SEQUENCE_SCENE_ID).toBe("sequence");
        scope.stop();
    });
});
